export const forgotPasswordTemplate = (firstname: string, resetTokenUrl: string) => (
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
    .warning {
      margin-top: 16px;
      color: #ff7675;
      font-weight: 500;
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
      <div class="title">Reset Your Password</div>
      <p>Hello ${firstname}, We received a request to reset your password for your SCIZZ account.</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetTokenUrl}" class="button">Reset Password</a>
      <div class="warning">
        This link will expire in 15 minutes for security reasons.
      </div>
      <div class="footer">
        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
      </div>
    </div>
  </div>
</body>
</html>
`
);