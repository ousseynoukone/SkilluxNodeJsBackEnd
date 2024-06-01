//AUTH CONTROLLER
const User = require("../../models/User");
const MailSender = require("../mailSender/mailSender");
const LoginDto =  require("../../models/dtos/loginDto")
const { validationResult } = require('express-validator');
const isOldEnough = require("./helper")
const bcrypt = require('bcrypt');
const getLoginResponseDto = require("../../models/dtos/userLoginResponseDto")
const jwt = require('jsonwebtoken');
const { where } = require("sequelize");
const crypto = require('crypto');
const { response } = require("express");
require('dotenv').config(); // Load environment variables from .env file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenExpire = process.env.ACCESS_TOKEN_EXPIRE; 
const refreshTokenExpire = process.env.REFRESH_TOKEN_EXPIRE;
const { renderHtmlResetPasswordForm } = require("../mailSender/html");


// FOR CACHING THE RESET PASSWORD TOKEN
const NodeCache = require( "node-cache" ); 
const RegisterDto = require("../../models/dtos/registerDto");
const BlacklistedToken = require("../../models/BlacklistedToken");
const myCache = new NodeCache();


// Function to generate access token
function generateAccessToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    preferredTags: user.preferredTags
};
  return jwt.sign( payload , accessTokenSecret, { expiresIn: accessTokenExpire });
}

// Function to generate refresh token
function generateRefreshToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    preferredTags: user.preferredTags

};

  return jwt.sign(payload, accessTokenSecret, { expiresIn: refreshTokenExpire });
}




exports.login = async (req, res)=>{ 
    /* #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/LoginDto" },
                }
            }
        }
        #swagger.description = 'Login endpoint'
    */

    /* #swagger.responses[200] = {
            description: "When login is successful",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/LoginResponseDto"
                    }
                }           
            }
        }   
    */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const loginDto = LoginDto.fromBody(req.body);

    
    if(!loginDto.username && !loginDto.email){
      return res.status(401).json({ error: 'At least one among username and email should be provided'});
    }

    let user;
    if (loginDto.username) {
        user = await User.findOne({ where: { username: loginDto.username } });
    } else if (loginDto.email) {
        user = await User.findOne({ where: { email: loginDto.email } });
    }

    if(!user){
      return res.status(404).json({ error: 'Do not exist in our records'});
    }
    const passwordMatch = await bcrypt.compare(loginDto.password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Login or/and Password incorrect' });
    }

    const token = generateAccessToken(user)
    const userResponse = getLoginResponseDto(user)

    return res.status(200).json({ success: 'Login successful', user:userResponse,token:token ,"expire":accessTokenExpire} );

    } 
  catch (error) {
    console.log(error)

    res.status(500).json({ error: error.toString()});
  }

}



exports.logout = async (req, res) => {
  try {
    // Invalidate the token in the database
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add the token to a blacklist (you need to create this table)
    await BlacklistedToken.create({
      token: req.user.token,
      userId: user.id,
      tokenExpirationSecondsLeft: req.user.tokenExpirationSecondsLeft
    });

    return res.status(200).json({ success: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.toString() });
  }
};


exports.register = async (req, res) => {
      /* #swagger.requestBody = {
            description: "Register endpoint",
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/RegisterDto" },
                }
            }
        }
        #swagger.description = 'Register endpoint'
    */

    /* #swagger.responses[200] = {
            description: "When registering is successful",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/RegisterResponseDto"
                    }
                }           
            }
        }   
    */

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
      req.body.password = await bcrypt.hash(req.body.password, 10);
      let birth = req.body.birth

      // CHECK UNICITY OF USERNAME AND EMAIL
      let userUsernameCheck = await User.findOne({where:{username: req.body.username}})
      let userEmailCheck = await User.findOne({where:{email: req.body.email}})

      if(userUsernameCheck){
        return res.status(400).json({ error: 'This username already exits in our records'});

      }

      if(userEmailCheck){
        return res.status(400).json({ error: 'This email already exits in our records'});

      }

      if(!isOldEnough(birth)){
        return res.status(400).json({ error: 'Age does not met the minimum requirement.'});
      }
      const registerDto = RegisterDto.fromBody(req.body)

      const user = await  User.create(registerDto);
      return res.status(201).json({ success: 'Registration successful', user });

      } 
    catch (error) {
      console.log(error)
       res.status(500).json({ error: error.toString()});
    }

  };





exports.refreshToken = async (req, res)=>{ 
      /* #swagger.security = [{
            "bearerAuth": []
    }] */

  try {
  const user = await User.findOne({where:{email:req.user.email}})
  if(!user){
    return  res.status(404).send('USER NOT FOUND');
  } 
  const token = generateRefreshToken(user)
  res.status(201).json({"sucess":'Token refreshed ! ',"token" : token,"expire":refreshTokenExpire});
}catch (error) {
  console.log(error);
  res.status(500).json({ error: error.toString()});
}

}





exports.forgotPasswword = async (req, res)=>{ 
  const { email } = req.body;
  const user = await User.findOne({ where: { email: email } });

  if (!user) {
      return res.status(404).json({ error: 'Do not exist in our records' });
  }

  // Generate a reset token
  const token = crypto.randomBytes(20).toString('hex');

  // Optionally store the token in the database or another secure place
  const mailSender = new MailSender(token, user.email);

  //Caching token and email for 5 minutes
  myCache.set("token",token,300)
  myCache.set("email",user.email,300)
  

  try {

      await mailSender.sendMail();
      res.status(200).send('Check your email for instructions on resetting your password');
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.toString()});
    }


}




exports.resetPasswwordPageRenderer = async (req, res)=>{ 
  const { token } = req.params;
  const cachedToken = myCache.get("token");
  const cachedEmail = myCache.get("email");
  // Check if the token exists and is still valid
  if (cachedToken === token) {
    // Render a form for the user to enter a new password
    const htmlContent = renderHtmlResetPasswordForm(cachedEmail,token);
    res.send(htmlContent); // Send the HTML content as the response

  } else {
   return res.status(401).send('Invalid or expired token');
  }

}




exports.resetPassword = async (req, res)=>{ 
  

  try {
    const user = await User.findOne({where:{email:req.body.email}})
    const newPassword = req.body.password
    const token = req.body.token
    const cachedToken = myCache.take("token");


    if(!user){
      return  res.status(404).send('USER NOT FOUND');
    }
    if(!token){
      return res.status(401).send('Missing token :)');
    }

    if(token!=cachedToken){
      return res.status(401).send('Invalid or expired token');
    }

    user.password = await bcrypt.hash(newPassword,10)
    user.save()
    return  res.status(201).send('Password Updated ! ');

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.toString()});
  }
}







exports.changePassword = async(req,res)=>{
        /* #swagger.security = [{
            "bearerAuth": []
        }] 
        */

  try {
    const user = await User.findOne({where:{email:req.user.email}})
  if(!user){
    return  res.status(404).send('USER NOT FOUND');
  } 
    

  const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword

  const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Old password incorrect' });
  }

  user.password = await bcrypt.hash(newPassword,10)
  user.save()

  return  res.status(201).send('Password Updated ! ');
  } catch (error) {
  console.log(error)
  return res.status(500).json({ error: error.toString()});
}
  
}