import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_KEY)

export const sendRegistrationEmail = async recipientAddress => {
  const msg = {
    to: recipientAddress,
    from: process.env.SENDER_EMAIL,
    subject: "Hello, first email sent!",
    text: "bla bla bla",
    html: "<strong>bla bla bla, but in bold</strong>",
  }
  await sgMail.send(msg)
}