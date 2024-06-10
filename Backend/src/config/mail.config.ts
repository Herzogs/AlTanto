import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string
    }
})

transporter.verify()
    .then(() => console.log('Ready for send emails'))
    .catch((error) => console.log('Error: ', error))

export default transporter
