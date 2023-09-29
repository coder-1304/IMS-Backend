import nodemailer from 'nodemailer';
import pool from '../../Database/connection.js';
import statusCodes from '../../constants/statusCodes.js';
import errorCodes from '../../constants/errorCodes.js';
// import 'dotenv/config'


function generateOTP() {
    // Generate a random 4-digit number between 1000 and 9999
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp.toString(); // Convert to string to ensure it's exactly 4 digits
}

const mailController = {
    async sendOTP(email) {

        // Creating a transporter object using your Gmail SMTP credentials
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'shanneeahirwar20174@acropolis.in', 
                pass: process.env.EMAIL_PASSWORD,    
            },
        });

        const otp = generateOTP();

        // Email content
        const content = `
Your OTP for verification: ${otp}

If you didn't request this OTP, please ignore this message.

Thank you for using our service!

Regards,
Inventory Mangement System
`
        const mailOptions = {
            from: 'shanneeahirwar20174@acropolis.in',   // Sender's email address
            to: email,// Recipient's email address
            subject: 'OTP Verification',           // Email subject
            text: content // Email body
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        // pool.query("select * from Users", (err, result, fields) => {
        //     if (err) {
        //         return res.status(statusCodes[1]).json({
        //             success: false,
        //             errorCode: 1,
        //             message: errorCodes[1]
        //         });
        //     }
        //     // res.send(`OTP is sent to your ${email}. Please verify`);
        //     return;
        // });


        const query = `
            UPDATE Users
            SET OTP = ${otp}
            WHERE Email="${email}"
        `;
        pool.query(query, (err, result, fields) => {
            if (err) {
                return res.status(statusCodes[1]).json({
                    success: false,
                    errorCode: 1,
                    message: errorCodes[1]
                });
            }
            console.log(result);
            // res.send(`OTP is sent to your ${email}. Please verify`);
            return;
        });
    },
    async verifyOTP(email, otp) {
        req.user.tokens = [];
    }
}

// mailController.sendOTP('owriter686@gmail.com');

export default mailController;