import { Request, Response } from 'express';
import * as nodemailer from 'nodemailer';
import authorizationCodeGenerator from '../../jwt/GenerateAuthorizationCode';
import * as dotenv from 'dotenv';
dotenv.config();

const EmailValidationCheck = (email: string) => {
	function validateEmail(email: string) {
		// 정규식을 이용한 이메일 형식인지 체크합니다.
		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		return re.test(email);
	}
	if (validateEmail(email)) {
		switch (email.split('@')[1]) {
			case 'naver.com':
				return true;
			case 'hanmail.net':
				return true;
			case 'daum.net':
				return true;
			case 'nate.com':
				return true;
			case 'kakao.com':
				return true;
			default:
				return false;
		}
	} else {
		return false;
	}
};

const sendEmail = async (req: Request, res: Response) => {
	console.log('💙send: email- ', req.body);
	const { email } = req.body;
	if (EmailValidationCheck(email)) {
		const username = email.split('@')[0];
		let transporter = nodemailer.createTransport({
			service: 'Naver',
			host: 'smtp.naver.com',
			port: 587,
			secure: false,
			auth: {
				user: process.env.NODEMAILER_USER,
				pass: process.env.NODEMAILER_PASS,
			},
		});
		const AuthorizationCode = await authorizationCodeGenerator();
		console.log(AuthorizationCode);
		// send mail with defined transport object
		const logoNameImage =
			'https://user-images.githubusercontent.com/77570843/118992471-a3a00f00-b9bf-11eb-86b3-bdb1f0fa5a36.png';
		const logoImage =
			'https://user-images.githubusercontent.com/77570843/118990896-3cce2600-b9be-11eb-8bbe-e36979a1041b.png';
		const userName = email.split('@')[0];
		const redirectURL = `${process.env.CLIENT_URL}/loginloading/?code=${AuthorizationCode}&email=${email}`;
		let info = await transporter.sendMail({
			from: `"no-reply@Reciper Admin" <${process.env.NODEMAILER_USER}>`,
			to: email,
			subject: 'Login to Reciper',
			html: `
<style>
  .btn-grad {
    background-image: linear-gradient(to right, #00d2ff 0%, #3a7bd5  51%, #00d2ff  100%);
    margin: 10px;
    padding: 15px 45px;
    text-align: center;
    text-transform: uppercase;
    transition: 0.5s;
    background-size: 200% auto;
    color: white;            
    box-shadow: 0 0 20px #eee;
    border-radius: 10px;
    display: block;
  }
  .btn-grad:hover {
    background-position: right center;
    color: #fff;
    text-decoration: none;
  }
</style>
<div bgcolor="#fafafa" marginheight="0" marginwidth="0" style="width:100%!important;min-width:100%;background-color:#fafafa;color:#333333;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;text-align:center;line-height:20px;font-size:14px;margin:0;padding:0">
  <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;text-align:center;height:100%;width:100%;background-color:#fafafa;color:#333333;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;line-height:20px;font-size:14px;margin:0;padding:0" bgcolor="#fafafa">
    <tbody><tr style="vertical-align:top;text-align:center;padding:0" align="center">
      <td align="center" valign="top" style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;text-align:center;color:#333333;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;line-height:20px;font-size:14px;margin:0;padding:0">
        <center style="width:100%;min-width:580px">
          <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;text-align:center;width:100%;padding:0px">
            <tbody><tr style="vertical-align:top;text-align:center;padding:0" align="center">
              <td align="center" style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;text-align:center;color:#333333;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;line-height:20px;font-size:14px;margin:0;padding:0" valign="top">
                <center style="width:100%;min-width:580px">
                  <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;text-align:inherit;width:580px;margin:0 auto;padding:0">
                    <tbody><tr style="vertical-align:top;text-align:center;padding:0" align="center">
                      <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;text-align:center;color:#333333;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;line-height:20px;font-size:14px;margin:0;padding:0 0px 0 0" align="center" valign="top">
                        <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;text-align:center;width:540px;margin:0 auto;padding:0">
                          <tbody><tr style="vertical-align:top;text-align:center;padding:0" align="center">
                            <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;text-align:center;color:#333333;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;line-height:20px;font-size:14px;margin:0;padding:0px 0px 10px" align="center" valign="top">
                              <div style="text-align:center" align="center">
                                <a href=${process.env.CLIENT_URL} style="color:#4183c4;text-decoration:none" target="_blank">
                                  <img alt="Reciper" src=${logoNameImage} width="300" height="118" style="outline:none;text-decoration:none;width:auto;max-width:100%;float:none;text-align:center;margin:0 auto;padding:25px 0 17px;border:none" align="none">
                                </a>
                              </div>
                            </td>
                            <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;text-align:center;width:0px;color:#333333;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;line-height:20px;font-size:14px;margin:0;padding:0" align="center" valign="top"></td>
                          </tr></tbody>
                        </table>
                      </td>
                    </tr></tbody>
                  </table>
                </center>
              </td>
            </tr></tbody>
          </table>
          
          <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;text-align:inherit;width:580px;margin:0 auto;padding:0">
            <tbody><tr style="vertical-align:top;text-align:center;padding:0" align="center">
              <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;text-align:center;color:#333333;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;line-height:20px;font-size:14px;margin:0;padding:0" align="center" valign="top">
                <table style="border-spacing:0;border-collapse:collapse;text-align:center;width:100%;display:block;padding:0px">
                  <tbody><tr style="vertical-align:top;text-align:center;padding:0" align="center">
                    <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;text-align:center;color:#333333;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;line-height:20px;font-size:14px;margin:0;padding:0 0px 0 0" align="center" valign="top">
                      <div style="background-color:#ffffff;border-radius:3px;padding:20px;border:1px solid #dddddd">
                        <table style="border-spacing:0;border-collapse:collapse;vertical-align:top;text-align:center;width:540px;margin:0 auto;padding:0">
                          <tbody><tr style="vertical-align:top;text-align:center;padding:0" align="center">
                            <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;text-align:center;color:#333333;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;line-height:20px;font-size:14px;margin:0;padding:0px 0px 0" align="center" valign="top">
                              <div>
                                <img src=${logoImage} width="60" height="60" alt="Reciper Logo" style="outline:none;text-decoration:none;width:auto;max-width:100%;overflow:hidden;border-radius:3px">
                                <h1 style="color:#333;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:300;text-align:center;line-height:1.2;word-break:normal;font-size:24px;margin:10px 0 25px;padding:0" align="center">
                                  Welcome to <strong>Reciper</strong>
                                </h1>
                                <hr style="color:#d9d9d9;background-color:#d9d9d9;height:1px;margin:20px 0;border:none">
                                <p style="word-wrap:normal;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;font-weight:normal;color:#333;line-height:20px;text-align:left;margin:15px 0 5px;padding:0" align="left">
                                  Hello ${userName}, <br>
                                  Your free trial starts today. What happens next? <br><br>
                                  You can click button to complete the login process.<br>
                                  This button will expire in 5 minutes.
                                </p>
                                <div style="text-align:center;color:#ffffff;padding:20px 0 25px" align="center">
                                  <a href=${redirectURL} class="btn-grad" style="background-image: linear-gradient(to right, #00d2ff 0%, #3a7bd5  51%, #00d2ff  100%);display:inline-block;color:#fff;font-size:14px;font-weight:600;text-decoration:none;width:auto!important;text-align:center;border-radius:5px;letter-spacing:normal;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;margin:0 auto;padding:6px 12px"  target="_blank"">Login Reciper</a>
                                </div>
                                <p style="word-wrap:normal;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;font-weight:normal;color:#333;line-height:20px;text-align:left;margin:15px 0 5px;padding:0" align="left">
                                  <strong>Note:</strong> This login email was intended for <strong><a href=${email} target="_blank">${email}</a></strong>.<br>If you were not expecting this login email, you can ignore this email.
                                </p>
                                <hr style="color:#d9d9d9;background-color:#d9d9d9;height:1px;margin:20px 0;border:none">
                                <p style="word-wrap:normal;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;font-weight:normal;color:#777777;line-height:20px;text-align:left;margin:15px 0 5px;padding:0" align="left">
                                  <strong>Getting a 404 error?</strong> Make sure you’re signed in as <strong>${email}</strong>.
                                </p>
                                <p style="word-wrap:normal;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;font-weight:normal;color:#777777;line-height:20px;text-align:left;margin:15px 0 5px;padding:0" align="left">
                                  <strong>Button not working?</strong> Copy and paste this link into your browser:
                                  <br><a href=${redirectURL} style="color:#4183c4;text-decoration:none" target="_blank"">${redirectURL}</a>
                                </p>
                              </div>
                            </td>
                            <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;text-align:center;width:0px;color:#333333;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:normal;line-height:20px;font-size:14px;margin:0;padding:0" align="center" valign="top"></td>
                          </tr></tbody>
                        </table>
                      </div>
                    </td>
                  </tr></tbody>
                </table>
              </td>
            </tr></tbody>
          </table>
        </center>
      </td>
    </tr></tbody>
  </table>
</div>`,
		});

		console.log('💙send: email- mail sent: %s', info.messageId);

		res.status(200).json({
			status: 'Success',
			code: 200,
			message: 'Sent Auth Email',
		});
	} else {
		res.status(400).json({
			message: 'invalid email domain',
		});
	}
};

export default sendEmail;
