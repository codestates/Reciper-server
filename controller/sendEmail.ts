import * as nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import authorizationCodeGenerator from '../jwt/GenerateAuthorizationCode';
dotenv.config();
const EmailValidationCheck = (email: string) => {
	function validateEmail(email: string) {
		// 정규식을 이용한 이메일 형식인지 체크합니다.
		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		return re.test(email);
	}
	if (validateEmail(email)) {
		switch (
			email.split('@')[1] //
		) {
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

export const emailController = async (req: Request, res: Response) => {
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
		let info = await transporter.sendMail({
			from: `"no-reply@Reciper Admin" <${process.env.NODEMAILER_USER}>`,
			to: email,
			subject: 'Reciper Login',
			// text: 'hello',
			html: `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="width: 100% !important;"></table>
            <tbody><tr><td align="center">
                  <table style="border: 1px solid #eaeaea; border-radius: 5px; margin: 40px 0;" width="600" border="0" cellspacing="0" cellpadding="40">
                    <tbody><tr><td align="center">
                          <div style="                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',                      'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',                      'Droid Sans', 'Helvetica Neue', sans-serif;                    text-align: left;                    width: 465px;                  ">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width: 100% !important;">
                              <tbody><tr><td align="center">
                                    <div>
                                      <img style="width:50%" src="https://media.vlpt.us/images/gatsukichi/post/0708c6d6-1151-4897-befd-748bf87941b0/trollo_logo.jpg" width="50" alt="Nomad Coders" loading="lazy">
                                    </div>
                                    <h1 style="                              color: #000;                              font-family: -apple-system, BlinkMacSystemFont,                                'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',                                'Cantarell', 'Fira Sans', 'Droid Sans',                                'Helvetica Neue', sans-serif;                              font-size: 24px;                              font-weight: normal;                              margin: 30px 0;                              margin-top: 15px;                              padding: 0;                            ">
                                      Log in to
                                      <b><span>Reciper</span></b>
                                    </h1>
                                  </td></tr></tbody>
                            </table>
          
                            <p style="                      color: #000;                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',                        'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',                        'Droid Sans', 'Helvetica Neue', sans-serif;                      font-size: 14px;                      line-height: 24px;                    ">
                              Hello <b>${username}</b>!
                            </p>
          
                            <p style="                      color: #000;                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',                        'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',                        'Droid Sans', 'Helvetica Neue', sans-serif;                      font-size: 14px;                      line-height: 24px;                    ">
                              To complete the login process, please click the button
                              below:
                            </p>
                            <br>
          
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width: 100% !important;">
                              <tbody><tr><td align="center">
                                    <div>
                                      <a href=${
																				process.env.CLIENT_URL + '/login/?code=' + AuthorizationCode + '&email=' + email
																			} style="                                background-color: #1c64f2;                                border-radius: 5px;                                color: #fff;                                display: inline-block;                                font-family: -apple-system, blinkmacsystemfont,                                  'segoe ui', 'roboto', 'oxygen', 'ubuntu',                                  'cantarell', 'fira sans', 'droid sans',                                  'helvetica neue', sans-serif;                                font-size: 12px;                                font-weight: 500;                                line-: 50px;                                text-align: center;                                text-decoration: none;                                : 200px;                              " target="_blank" rel="noreferrer noopener">Log in →</a>
                                    </div>
                                  </td></tr></tbody>
                            </table>
          
                            <br>
                            <p style="                      color: #000;                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',                        'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',                        'Droid Sans', 'Helvetica Neue', sans-serif;                      font-size: 14px;                      line-height: 24px;                    ">
                              Or copy and paste this URL into a new tab of your browser:
                            </p>
                            <p style="                      color: #000;                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',                        'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',                        'Droid Sans', 'Helvetica Neue', sans-serif;                      font-size: 14px;                      line-height: 24px;                    ">
                              <a href="${
																process.env.CLIENT_URL + '/login/?code=' + AuthorizationCode + '&email=' + email
															}" style="color: #067df7; text-decoration: none;" target="_blank" rel="noreferrer noopener">
															${process.env.CLIENT_URL + '/login/?code=' + AuthorizationCode + '&email=' + email}
                              </a>
                            </p>
                            <br>
                            <hr style="                      border: none;                      border-top: 1px solid #eaeaea;                      margin: 26px 0;                      width: 100%;                    ">
                            <p style="                      color: #666666;                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',                        'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',                        'Droid Sans', 'Helvetica Neue', sans-serif;                      font-size: 12px;                      line-height: 24px;                    ">
                              Thanks for being awesome!
                            </p>
                          </div>
                        </td></tr></tbody>
                  </table>
                </td></tr></tbody>
          </table>`,
		});

		console.log('Message sent: %s', info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		res.status(200).json({
			status: 'Success',
			code: 200,
			message: 'Sent Auth Email',
		});
	} else {
		res.status(400).json({ message: 'invalid email domain' });
	}
};
// main().catch(console.error);
