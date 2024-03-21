import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, 
            auth: {
                user: process.env.NODEMAILER_EMAIL || "aniketguptaprojects@gmail.com",
                pass: process.env.NODEMAILER_EMAIL_PASSWORD || "Aaniket1234@"
            }
        });

        const mailOptions = {
            ...options
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Error in sending",info)
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error(error);
    }
};

export { sendEmail };
