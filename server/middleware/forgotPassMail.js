const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const { OAuth2 } = google.auth
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'

const {
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFESH_TOKEN,
    MAILING_SERVICE_ADDRESS,
    SENDER_EMAIL_ADDRESS,
    CLIENT_URL
} = process.env

const oauth2Client = new OAuth2(
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFESH_TOKEN,
    MAILING_SERVICE_ADDRESS,
    OAUTH_PLAYGROUND
)

const forgotPassMail = (to, token) => {
    oauth2Client.setCredentials({
        refresh_token: MAILING_SERVICE_REFESH_TOKEN
    })

    const accessToken = oauth2Client.getAccessToken()
    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: SENDER_EMAIL_ADDRESS,
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret: MAILING_SERVICE_CLIENT_SECRET,
            refreshToken: MAILING_SERVICE_REFESH_TOKEN,
            accessToken
        }
    })

    const mailOptions = {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: 'Yêu cầu xác thực email',
        html: `
        <p>Xin chào <strong>${to}</strong>,</p>
        <p>Cảm ơn bạn đã truy cập <strong>Hệ thống Khai báo y tế dành cho Doanh nghiệp</strong></p>
        <p>Bạn vui lòng chọn <strong>Xác Nhận</strong> để bắt đầu khai báo</p>
        <p><a href="${CLIENT_URL}/forgotPass/${token}"><button style=
                "
            width: 230px;
            height: 60px;
            background-color: white;
            border-radius: 4px;
            color: #0d6efd;
            border: 1px solid #0d6efd;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 18px;
            margin: 4px 2px;
            cursor: pointer;
            "
            >
            Xác nhận
            </button></a></p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p><span style="color: #999999;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email</span></p>
        `
    }

    smtpTransport.sendMail(mailOptions, (error, info) => {
        if (error) return error;
        return info
    })
}

module.exports = forgotPassMail