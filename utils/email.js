
const nodemailer = require('nodemailer')

const sendEmailWithGoogle = async(options)=>{

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });


    return await transporter.sendMail({
      from:'QHN SHOP',
      to:options.email,
      subject:options.subject,
      text:options.message,
      html:`<h2>Mã code :${options.message}</h2>`
    })
    

    
}

module.exports= sendEmailWithGoogle;