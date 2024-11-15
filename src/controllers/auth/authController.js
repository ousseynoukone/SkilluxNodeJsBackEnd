//AUTH CONTROLLER
const db = require("../../../db/models/index");
const {BlacklistedToken} = db;
const {User} = db;


const MailSender = require("../mailSender/mailSender");
const LoginDto =  require("../../models/dtos/loginDto")
const { validationResult } = require('express-validator');
const {isOldEnough,convertToExpireDate,getLoginErrorMessage} = require("./helper")
const bcrypt = require('bcrypt');
const {getLoginResponseDto,getRefreshTokenDto} = require("../../models/dtos/tokenResponseDto")
const jwt = require('jsonwebtoken');
const { where } = require("sequelize");
const crypto = require('crypto');
const { response } = require("express");
require('dotenv').config(); // Load environment variables from .env file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET; 
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET; 

const {ACCESS_TOKEN_EXPIRE,REFRESH_TOKEN_EXPIRE} = require("../../parameters/constants")
const { renderHtmlResetPasswordForm,renderHtmlActivationAccount } = require("../mailSender/html");
const sequelize = db.sequelize;

// FOR CACHING THE RESET PASSWORD TOKEN
const NodeCache = require( "node-cache" ); 
const RegisterDto = require("../../models/dtos/registerDto");
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

  return jwt.sign(payload, refreshTokenSecret, { expiresIn: REFRESH_TOKEN_EXPIRE });
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


    const passwordMatch = await bcrypt.compare(loginDto.password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: getLoginErrorMessage('loginPasswordIncorrect', lang) });
    }


    if (!user.isActive) {
      return res.status(403).json({ error: getLoginErrorMessage('accountDeactivated', lang) });
    }
    
    user.lang=lang;
    if(user.profession==null || user.profession==undefined || user.profession=="" ){
      user.profession = lang == 'en' ? "New user" : "Nouveau Utilisateur";
    }
    user.save();

    const acessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    const loginResponse = getLoginResponseDto(user,acessToken,refreshToken)
    

    return res.status(200).json({ success: 'Login successful', ...loginResponse} );

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

    try {
        // Using transaction to ensure atomicity
        const user = await sequelize.transaction(async t => {
            req.body.password = await bcrypt.hash(req.body.password, 10);
            let birth = req.body.birth;

            // Check uniqueness of username and email
            let userUsernameCheck = await User.findOne({ where: { username: req.body.username } }, { transaction: t });
            let userEmailCheck = await User.findOne({ where: { email: req.body.email } }, { transaction: t });
            let lang = req.params.lang;

            if (userUsernameCheck) {
                throw new Error(lang === 'en' ? 'This username already exists in our records.' : 'Ce nom d\'utilisateur n\'est pas disponible.');
            }

            if (userEmailCheck) {
                throw new Error(lang === 'en' ? 'This email already exists in our records.' : 'Cet e-mail n\'est pas disponible.');
            }

            if (!isOldEnough(birth)) {
                throw new Error(lang === 'en' ? 'Your age does not meet the minimum requirement.' : 'Vous n\'avez pas l\'âge minimal requis.');
            }

            req.body.email = req.body.email.toLowerCase();
            if(lang=='fr'){
              req.body.lang="fr";
            }else{
              req.body.lang="en";

            }
            
            const registerDto = RegisterDto.fromBody(req.body);

            const user = await User.create(registerDto, { transaction: t });
            const result = await sendVerifierEmail(user.email, lang);

            if (!result.success) {
                throw new Error(lang === 'en' ? 'Failed to send verification email.' : 'Échec de l\'envoi de l\'e-mail de vérification.');
            }

            return user;
        });

        return res.status(201).json({ success: 'Registration successful', user });

    } catch (error) {
        console.log(error);
        const lang = req.params.lang || 'en';
        const errorMessage = error.message || (lang === 'en' ? 'An unexpected error occurred.' : 'Une erreur inattendue s\'est produite.');
        return res.status(500).json({ error: errorMessage });
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
  const access_token = generateAccessToken(user)
  const refresh_token = generateRefreshToken(user)
  const refreshTokenDto = getRefreshTokenDto(access_token,refresh_token)

  res.status(200).json({"sucess":'Token refreshed ! ',...refreshTokenDto});
}catch (error) {
  console.log(error);
  res.status(500).json({ error: error.toString()});
}

}





exports.forgotPassword = async (req, res)=>{ 
  const { email } = req.body;
  const user = await User.findOne({ where: { email: email } });
  lang = user.lang=="en";
  if (!user) {
      return res.status(404).json({ error: 'Do not exist in our records' });
  }
  var emailSubject = "";
  var emailHtml = "";
  
  // Generate a reset token
  const token = crypto.randomBytes(20).toString('hex');
  const mailSenderContent = new MailSenderContent(token);

  // Localization handling
  if(lang=="en"){
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

      result = await mailSender.sendMail();
      
      if (result.success) {
        return  res.status(200).json({ success:  lang=="en" ? 'Check your email for instructions on resetting your password!' : 'Email envoyé ! Veuillez verifier votre boite e-mail.' });

      } else {
        return  res.status(500).json({ error: lang=="en" ? 'Email sending failed, please try again!' :"L'envoie de l'email a échoué, veuillez réesayer ! "  });
      }
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.toString()});
    }


}



exports.resetPasswordPageRenderer = async (req, res)=>{ 
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







exports.changePassword = async (req, res) => {
  /* #swagger.security = [{
      "bearerAuth": []
  }] 
  */

  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      const message = user.lang === 'fr' ? 'UTILISATEUR NON TROUVÉ' : 'USER NOT FOUND';
      return res.status(404).send(message);
    }

    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    // Check if old password matches the current password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      const message = user.lang === 'fr' ? 'Ancien mot de passe incorrect' : 'Old password incorrect';
      return res.status(401).json({ error: message });
    }

    // Check if old password and new password are the same
    if (oldPassword === newPassword) {
      const message = user.lang === 'fr' ? 'L\'ancien et le nouveau mot de passe ne doivent pas être identiques' : 'Old and new passwords must not be the same';
      return res.status(400).json({ error: message });
    }

    // Check if new password is the same as the current password
    const newPasswordMatch = await bcrypt.compare(newPassword, user.password);
    if (newPasswordMatch) {
      const message = user.lang === 'fr' ? 'Le nouveau mot de passe ne doit pas être identique à l\'ancien' : 'New password must not be the same as the old password';
      return res.status(400).json({ error: message });
    }

    // Update the password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    const message = user.lang === 'fr' ? 'Mot de passe mis à jour!' : 'Password Updated!';
    return res.status(201).json({"success":message});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
};




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
  const userId  = req.user.id;
  const {password}  = req.body;


  try {
    // Find the user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      const message = user.lang === 'fr' ? 'Utilisateur non trouvé' : 'User not found';
      return res.status(404).json({ error: message });
    }

    // Verify the provided password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      const message = user.lang === 'fr' ? 'Mot de passe incorrect' : 'Incorrect password';
      return res.status(401).json({ error: message });
    }

    // Delete the user account
    await user.destroy();

    const message = user.lang === 'fr' ? 'Compte supprimé avec succès' : 'Account deleted successfully';
    return res.status(201).json({ success: message });
  } catch (error) {
    console.error(error);
    const message =  'An error occurred';
    res.status(500).json({ error: message });
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
      var mailSender = new MailSender(email, emailSubject, emailHtml);
      result =  await mailSender.sendMail();

      if (result.success) {
        console.log('Email sent successfully:');
        return { success: true };
      } else {
        console.error('Failed to send email:', result.error);
        return { success: false, error: result.error };
      }

  } catch (error) {
      console.error(error);
  }
};


exports.resendVerifierEmail = async (req, res)=>{ 
  const  email  = req.params.email;
  const  lang  = req.params.lang;
  try {

    const user = await User.findOne({where:{email:email}})
    if(!user){
      return  res.status(404).json({'error':'USER NOT FOUND'} );
    } 
    if(user.isActive){
      return  res.status(403).json({'error': lang=="en" ? 'Account already active!' : 'Votre compte est déjà actif !'} );

    }
    result = await sendVerifierEmail(email,lang);
    if(result.success){
      return res.status(200).json({'success':lang=="en" ? 'Email sent ! ' : "Email envoyé !"});

    }
    return  res.status(500).json({ error: lang=="en" ? 'Email sending failed, please try again!' :"L'envoie de l'email a échoué, veuillez réesayer ! "  });


  } catch (error) {
    console.error(error);

    return res.status(500).json({'error':error.toString()});

  }
}


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

