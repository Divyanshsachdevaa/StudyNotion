const { contactUsEmail } = require("../mail/templates/contactFormRes")
const mailSender = require('../utils/mailSender');

exports.contactUsController = async (req, res) => {
  const { email, firstName, lastName, message, phoneNumber, countryCode } = req.body
  console.log(req.body)
  try {
    console.log("First Name = ", firstName);
    console.log("Last Name = ", lastName);

    const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstName, lastName, message, phoneNumber, countryCode),
    )
    
    console.log("Email Res ", emailRes)
    return res.json({
      success: true,
      message: "Email send successfully",
    })
  } catch (error) {
    console.log("Error", error)
    console.log("Error message :", error.message)
    return res.json({
      success: false,
      message: "Something went wrong...",
    })
  }
}