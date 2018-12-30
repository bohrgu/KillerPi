var nodemailer = require('nodemailer');

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
      pass: 'Killerpi89'
    }
  })

  return transporter.sendMail(mail)
}