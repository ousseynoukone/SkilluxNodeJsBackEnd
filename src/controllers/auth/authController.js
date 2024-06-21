//AUTH CONTROLLER
const User = require("../../models/User");
const MailSender = require("../mailSender/mailSender");
const LoginDto =  require("../../models/dtos/loginDto")
const { validationResult } = require('express-validator');
const {isOldEnough,convertToSeconds,getLoginErrorMessage} = require("./helper")
const bcrypt = require('bcrypt');
const getLoginResponseDto = require("../../models/dtos/userLoginResponseDto")
const jwt = require('jsonwebtoken');
const { where } = require("sequelize");
const crypto = require('crypto');
const { response } = require("express");
require('dotenv').config(); // Load environment variables from .env file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const {ACCESS_TOKEN_EXPIRE,REFRESH_TOKEN_EXPIRE} = require("../../parameters/constants")
const { renderHtmlResetPasswordForm,renderHtmlActivationAccount } = require("../mailSender/html");


// FOR CACHING THE RESET PASSWORD TOKEN
const NodeCache = require( "node-cache" ); 
const RegisterDto = require("../../models/dtos/registerDto");
const BlacklistedToken = require("../../models/BlacklistedToken");
const myCache = new NodeCache();

// FOR SENT EMAIL INNER CONTENT

const MailSenderContent = require("../mailSender/emailHelperContent")

// Function to generate access token
function generateAccessToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    lang: user.lang,
    isAdmin: user.isAdmin,
    preferredTags: user.preferredTags
};
  return jwt.sign( payload , accessTokenSecret, { expiresIn: ACCESS_TOKEN_EXPIRE });
}

// Function to generate refresh token
function generateRefreshToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    lang: user.lang,
    isAdmin: user.isAdmin,
    preferredTags: user.preferredTags

};

  return jwt.sign(payload, accessTokenSecret, { expiresIn: REFRESH_TOKEN_EXPIRE });
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

  const lang = req.params.lang || 'en'; // Default to 'en' if lang parameter is not provided

  try {
    const loginDto = LoginDto.fromBody(req.body);

    if (!loginDto.username && !loginDto.email) {
      return res.status(401).json({ error: getLoginErrorMessage('usernameOrEmailRequired', lang) });
    }


    let user;
    if (loginDto.username) {
        user = await User.findOne({ where: { username: loginDto.username } });
    } else if (loginDto.email) {
        user = await User.findOne({ where: { email: loginDto.email } });
    }



    if (!user) {
      return res.status(404).json({ error: getLoginErrorMessage('userNotFound', lang) });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: getLoginErrorMessage('accountDeactivated', lang) });
    }
  
    const passwordMatch = await bcrypt.compare(loginDto.password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: getLoginErrorMessage('loginPasswordIncorrect', lang) });
    }

    const token = generateAccessToken(user)
    const userResponse = getLoginResponseDto(user)

    return res.status(200).json({ success: 'Login successful', user:userResponse,token:token ,"expire": convertToSeconds(ACCESS_TOKEN_EXPIRE)} );

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

    /* #swagger.responses[201] = {
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
    return res.status(400).json({ error: errors.array() });
  }

  try {
      req.body.password = await bcrypt.hash(req.body.password, 10);
      let birth = req.body.birth

      // CHECK UNICITY OF USERNAME AND EMAIL
      let userUsernameCheck = await User.findOne({where:{username: req.body.username}})
      let userEmailCheck = await User.findOne({where:{email: req.body.email}})
      let lang = req.params.lang;
      if(userUsernameCheck){
        return res.status(400).json({ error: lang=='en' ? 'This username already exits in our records.' : 'Ce nom d\'utilisateur n\'est pas disponible.'});

      }

      if(userEmailCheck){
        return res.status(400).json({ error: lang=='en' ? 'This email already exits in our records.' : 'Cet e-mail  n\'est pas disponible.'});

      }

      if(!isOldEnough(birth)){
        return res.status(400).json({ error: lang=='en' ? 'Your age does not met the minimum requirement.' : 'Vous n\'avez pas l\'âge minimal requit.'});

      }
      req.body.email=req.body.email.toLowerCase()
      
      const registerDto = RegisterDto.fromBody(req.body)

      const user = await  User.create(registerDto);
      await sendVerifierEmail(user.email,lang);
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
  res.status(201).json({"sucess":'Token refreshed ! ',"token" : token,"expire":convertToSeconds(REFRESH_TOKEN_EXPIRE)});
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
  var emailSubject = "";
  var emailHtml = "";
  
  // Generate a reset token
  const token = crypto.randomBytes(20).toString('hex');
  const mailSenderContent = new MailSenderContent(token);

  // Localization handling
  if(user.lang=="en"){
    emailSubject = mailSenderContent.getEmailResetPasswordSubjectEn();
    emailHtml = mailSenderContent.getEmailResetPasswordHtmlEn();
  }else{
    emailSubject = mailSenderContent.getEmailResetPasswordSubjectFr();
    emailHtml = mailSenderContent.getEmailResetPasswordHtmlFr();
  }

  const mailSender = new MailSender(email,emailSubject,emailHtml);

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
  try {
    const cachedToken = myCache.get("token");
    const cachedEmail = myCache.get("email");



    // Check if the token exists and is  valid
    if (cachedToken === token) {
      const user = await User.findOne({where:{email:cachedEmail}})
      let lang = user.lang || 'en';

      // Render a form for the user to enter a new password
      const htmlContent = renderHtmlResetPasswordForm(cachedEmail,token,lang);
      res.send(htmlContent); // Send the HTML content as the response

  } else {
   return res.status(401).send('Invalid or expired token');
  }
} catch (error) {
  console.log(error);
  res.status(500).json({ error: error.toString()});
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



// Deactivate Account
exports.deactivateAccount = async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Deactivate the user account
    user.isActive = false;
    await user.save();

    return res.status(200).json({ success: 'Account deactivated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.toString() });
  }
};


// Deactivate Account
exports.activateAccount = async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Deactivate the user account
    user.isActive = true;
    await user.save();

    return res.status(200).json({ success: 'Account activated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.toString() });
  }
};


// Delete User Account
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user account
    await user.destroy();

    return res.status(200).json({ success: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.toString() });
  }
};


// Send Email For Verification


async function  sendVerifierEmail  (email,lang='en' ) {

  if (!email) {
      return res.status(403).json({ error: 'Email is not specified' });
  }

  // Generate a token
  const token = crypto.randomBytes(20).toString('hex');

  // Localization handling
  let emailSubject, emailHtml;
  const mailSenderContent = new MailSenderContent(token);

  if (lang === "en") {
      emailSubject = mailSenderContent.getEmailVerificationSubjectEn();
      emailHtml = mailSenderContent.getEmailVerificationHtmlEn();
  } else {
      emailSubject = mailSenderContent.getEmailVerificationSubjectFr();
      emailHtml = mailSenderContent.getEmailVerificationHtmlFr();
  }



  try {

      await User.update({ lang: lang }, { where: { email: email } });

      // Caching token and email for 10 minutes
      myCache.set("EmailVerificationToken", token, 600);
      myCache.set("EmailVerificationemail", email, 600);
      const mailSender = new MailSender(email, emailSubject, emailHtml);
      await mailSender.sendMail();
  } catch (error) {
      console.error(error);
  }
};




exports.accountActivationPageRenderer = async (req, res)=>{ 
  const { token } = req.params;

try {


  const cachedToken = myCache.get("EmailVerificationToken");
  const cachedEmail = myCache.get("EmailVerificationemail");


  // Check if the token exists and is still valid
  if (cachedToken === token) {
    const user = await User.findOne({where:{email:cachedEmail}})
    let lang = user.lang || 'en';

    // Activate account
    await User.update({ isActive: true }, { where: { email: cachedEmail } });

    // Render a form for the user to enter a new password
    const htmlContent = renderHtmlActivationAccount(cachedEmail,lang);
    res.send(htmlContent); // Send the HTML content as the response

  } else {
   return res.status(401).send('Invalid or expired token !  / Token invalide ou expiré ! ');
  }
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.toString() });
}
}

