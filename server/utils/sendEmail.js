import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false, 
            auth: {
                user: process.env.NODEMAILER_EMAIL,
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
