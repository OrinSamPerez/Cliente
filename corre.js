import  nodemailer from 'nodemailer';
export const sendEmail = async(TO,   MENSAJE)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user:'orlinsampa28@gmail.com',
          pass:'paosospa2810'
        }
      });
      
      var mailOptions = {
        from:'orlinsampa28@gmail.com',
        to:TO,
        subject: `Mensaje enviado por ${TO}`,
        text: ` ${MENSAJE}`,
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email enviado');
        }
      });
}

