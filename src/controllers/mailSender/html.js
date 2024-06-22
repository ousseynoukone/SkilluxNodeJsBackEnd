exports.renderHtmlResetPasswordForm = (email, token, lang = 'en') => {
  const translations = {
    en: {
      title: 'Skillux Password Reset',
      heading: 'Reset Your Skillux Password',
      newPasswordLabel: 'New Password',
      showPasswordLabel: 'Show Password',
      resetPasswordButton: 'Reset Password',
      successMessage: 'Password reset successful! You can return log in :)',
      errorMessage: 'An error occurred. Please try again later.',
      passwordRequirements: 'Minimum eight characters, at least one letter and one number.'
    },
    fr: {
      title: 'Réinitialisation du mot de passe Skillux',
      heading: 'Réinitialisez votre mot de passe Skillux',
      newPasswordLabel: 'Nouveau mot de passe',
      showPasswordLabel: 'Afficher le mot de passe',
      resetPasswordButton: 'Réinitialiser le mot de passe',
      successMessage: 'Réinitialisation du mot de passe réussie ! Vous pouvez vous reconnecter :)',
      errorMessage: 'Il semble y avoir une erreur. Veuillez réessayer plus tard.',
      passwordRequirements: 'Minimum huit caractères, au moins une lettre et un chiffre.'
    }
  };

  const { title, heading, newPasswordLabel, showPasswordLabel, resetPasswordButton, successMessage, errorMessage, passwordRequirements } = translations[lang];

  return `<!DOCTYPE html>
  <html lang="${lang}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 5vh;
      }
      .form-container {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        width: 300px;
      }
      h2 {
        margin-top: 0;
        text-align: center;
        color: #333;
      }
      label {
        display: block;
        margin-bottom: 5px;
        color: #555;
      }
      input[type="text"],input[type="password"] {
        width: calc(100% - 20px);
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      input[type="checkbox"] {
        margin-top: 5px;
      }
      input[type="submit"] {
        width: 100%;
        padding: 10px;
        border: none;
        border-radius: 5px;
        background-color: #007bff;
        color: #fff;
        cursor: pointer;
      }
      input[type="submit"]:hover {
        background-color: #0056b3;
      }
      .message {
        margin-bottom: 10px;
        text-align: center;
      }
      .error {
        color: red;
      }
      .success {
        color: green;
      }
      .success-div{
        display:flex;
        align-items:center;
        justify-content:center;
      }
      .loader {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 2s linear infinite;
        margin: 0 auto;
        margin-top:20px;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </head>
  <body>
    <div class="form-container" id="form-container">
      <h2>${heading}</h2>
      <form id="resetPasswordForm">
        <label for="password">${newPasswordLabel}</label>
        <input type="password" id="password" name="password" required>
        <label>
          <input type="checkbox" id="togglePassword"> ${showPasswordLabel}
        </label>
        <div id="error-message" class="message error"></div>
        <input type="hidden" id="email" name="email" value="${email}">
        <input type="hidden" id="token" name="token" value="${token}">
        <input type="submit" value="${resetPasswordButton}" id="submit-btn">
        <div id="loader" class="loader" style="display: none;"></div>
      </form>
    </div>
    <div class="success-div">
      <h3 id="success-message" class="message success" style="display: none;"></h3>
    </div>

    <script>
      document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;
        const token = document.getElementById('token').value;
        const errorMessage = document.getElementById('error-message');
        const successMessage = document.getElementById('success-message');
        const loader = document.getElementById('loader');
        const formContainer = document.getElementById('form-container');
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$/;

        if (!passwordRegex.test(password)) {
          errorMessage.textContent = '${passwordRequirements}';
          successMessage.style.display = 'none';
          loader.style.display = 'none';
        } else {
          errorMessage.textContent = '';
          loader.style.display = 'block';

          const formData = {
            email: email,
            password: password,
            token: token
          };

          fetch('/api/v1/auth/reset-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          })
          .then(response => {
            loader.style.display = 'none';
            if (response.status === 201) {
              document.getElementById('resetPasswordForm').reset();
              successMessage.textContent = '${successMessage}';
              successMessage.style.display = 'block';
              formContainer.style.display = 'none';
            } else {
              errorMessage.textContent = '${errorMessage}';
              successMessage.style.display = 'none';
            }
          })
          .catch(error => {
            loader.style.display = 'none';
            errorMessage.textContent = '${errorMessage}';
            successMessage.style.display = 'none';
            console.error('Error:', error);
          });
        }
      });

      document.getElementById('togglePassword').addEventListener('change', function() {
        const passwordInput = document.getElementById('password');
        if (this.checked) {
          passwordInput.type = 'text';
        } else {
          passwordInput.type = 'password';
        }
      });
    </script>
  </body>
  </html>`;
};

exports.renderHtmlActivationAccount = (email, lang = 'en') => {
  const content = {
    en: {
      subject: "Account Activation",
      title: "Account Activated",
      message: "Your account has been activated. Please log in to the Skillux application.",
    },
    fr: {
      subject: "Activation de compte",
      title: "Compte Activé",
      message: "Votre compte a été activé. Veuillez vous connecter à l'application Skillux.",
    },
  }[lang];

  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${content.subject}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-top: 5vh;
        }
        .container {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          text-align: center;
        }
        .title {
          font-size: 24px;
          color: #333333;
          margin-bottom: 10px;
        }
        .message {
          font-size: 18px;
          color: #666666;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="title">${content.title}</div>
        <div class="message">${content.message}</div>
      </div>
    </body>
    </html>
  `;
};


