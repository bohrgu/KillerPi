var nodemailer = require('nodemailer')
const emailPassword = process.env.NODE_KILLER_EMAIL_PASSWORD

exports.sendMail = function(destMail, subject, message) {
  var mail = {
    from: 'killerpi.noreply@gmail.com',
    to: destMail,
    subject: subject,
    text: message
  }

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'killerpi.noreply@gmail.com',
      pass: emailPassword
    }
  })

  return transporter.sendMail(mail)
}