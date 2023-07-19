const nodemailer = require("nodemailer");

export const sendEmail = ({ to, url }: { to: string; url: string }) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: `Caitlyn <${process.env.EMAIL_USERNAME}>`,
        to,
        subject: "Redefinir senha",
        html: `<h2 style='color:#101010;'>Clique <a href='${url}'>aqui</a> para redefinir sua senha.</h2>`,
    };

    transporter.sendMail(mailOptions);
};
