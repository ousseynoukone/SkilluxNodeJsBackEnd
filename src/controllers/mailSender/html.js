exports.renderHtmlResetPasswordForm = (email) => {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Skillux Password Reset</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
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
    
            input[type="password"] {
                width: calc(100% - 10px);
                padding: 10px;
                margin-bottom: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
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

            .error {
                color: red;
                margin-bottom: 10px;
            }
        </style>
    </head>
    
    <body>
        <div class="form-container">
            <h2>Reset Your Skillux Password</h2>
            <form id="resetPasswordForm" method="post" action="/reset-password">
                <label for="password">New Password</label>
                <input type="password" id="password" name="password" required>
                <div id="error-message" class="error"></div>
                <input type="hidden" name="email" value="${email}">
                <input type="submit" value="Reset Password">
            </form>
        </div>
        <script>
            document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
                const password = document.getElementById('password').value;
                const errorMessage = document.getElementById('error-message');
                
                const passwordRegex = /^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
                if (!passwordRegex.test(password)) {
                    errorMessage.textContent = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.';
                    event.preventDefault();
                } else {
                    errorMessage.textContent = '';
                }
            });
        </script>
    </body>
    
    </html>`;
};
