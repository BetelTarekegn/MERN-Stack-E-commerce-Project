export const getResetPasswordTemplate = (username, resetURL) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>Reset Your Password</title>
    <style type="text/css">
      body {
        margin: 0;
        background-color: #f4f4f7;
        font-family: 'Roboto', sans-serif;
        color: #51545e;
      }
      a {
        color: #3869d4;
        text-decoration: none;
      }
      h1 {
        font-size: 24px;
        font-weight: 700;
        color: #333;
        margin-top: 0;
      }
      p {
        font-size: 16px;
        line-height: 1.6;
        margin: 0 0 1em;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        margin-top: 20px;
        background-color: #28a745;
        color: white;
        border-radius: 5px;
        font-weight: bold;
        text-decoration: none;
      }
      .email-wrapper {
        width: 100%;
        background-color: #f4f4f7;
        padding: 20px;
      }
      .email-content {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      }
      .footer {
        text-align: center;
        font-size: 13px;
        color: #a8aaaf;
        padding-top: 30px;
      }
      .footer p {
        margin: 4px 0;
      }
      .preheader {
        display: none;
        visibility: hidden;
        font-size: 1px;
        color: transparent;
        height: 0;
        width: 0;
        opacity: 0;
        overflow: hidden;
      }
      .email-masthead {
        padding: 20px 0;
        text-align: center;
      }
      .email-masthead_name {
        font-size: 20px;
        font-weight: bold;
        color: #333;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <span class="preheader">
      Use this link to reset your password. The link is only valid for 30 minutes.
    </span>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <!-- Header -->
            <tr>
              <td class="email-masthead">
                <a href="https://ecommerce.com" class="email-masthead_name">E-Commerce</a>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td class="email-body" width="570" cellpadding="0" cellspacing="0">
                <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td class="content-cell">
                      <div>
                        <h1>Hi ${username},</h1>
                        <p>
                          You recently requested to reset your password for your E-Commerce account.
                          Use the button below to reset it.
                          <strong>This password reset is only valid for the next 30 minutes.</strong>
                        </p>
<table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <td align="center">
                              <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                <tr>
                                  <td align="center">
                                    <a href="${resetURL}" class="button" target="_blank">Reset your password</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>

                        <p>
                          If you did not request a password reset, please ignore this email or
                          <a href="mailto:support@ecommerce.com">contact support</a> if you have questions.
                        </p>
                        <p>Thanks,<br>The E-Commerce Team</p>

                        <table class="body-sub" role="presentation">
                          <tr>
                            <td>
                              <p class="sub">
                                If you’re having trouble with the button above,
                                copy and paste the URL below into your web browser:
                              </p>
                              <p class="sub">
                                <a href="${resetURL}">${resetURL}</a>
                              </p>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td>
                <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td class="content-cell" align="center">
                      <p class="sub">
                        E-Commerce<br>1234 Street Rd.<br>Suite 1234
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`