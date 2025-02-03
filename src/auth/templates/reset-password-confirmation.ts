export const resetPasswordConfirmationTemplate = (firstname: string, loginUrl: string) => (
  `
  <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
      background-color: #fff;
    }
    .card {
      background-color: #4834d4;
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      color: white;
    }
    .logo {
      width: 80px;
      height: 80px;
      margin-bottom: 24px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 24px;
    }
    .button {
      display: inline-block;
      background-color: #00b894;
      color: white;
      text-decoration: none;
      padding: 12px 48px;
      border-radius: 8px;
      margin-top: 24px;
      font-weight: bold;
    }
    .footer {
      margin-top: 24px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <img src="cid:logo" alt="SCIZZ" class="logo"/>
      <div class="title">Password Reset Complete</div>
      <p>Hello ${firstname}, your password has been successfully reset.</p>
      <p>You can now sign in to your account using your new password.</p>
      <a href="${loginUrl}" class="button">Sign In Now</a>
      <div class="footer">
        <p>If you didn't make this change, please contact our support team immediately.</p>
      </div>
    </div>
  </div>
</body>
</html>
`
);