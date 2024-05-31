require("dotenv").config()
const express = require('express')
const cors = require('cors')
const formData = require("form-data")
const Mailgun = require('mailgun.js')

const app = express()
app.use(cors())
app.use(express.json())

const mailgun = new Mailgun(formData)
const mailgunClient = mailgun.client({
  username:process.env.MAILGUN_USERNAME,
  key: process.env.MAILGUN_KEY
})

app.post("/send-email", async (req,res)=>{
  try {
    const {firstname, lastname, email, subject, message} = req.body;
    const messageData={
      from:`${firstname} ${lastname} <${email}>`,
      to:process.env.PERSONAL_MAIL,
      subject:subject,
      text:message
    }
    const response = await mailgunClient.messages.create(
      process.env.MAILGUN_DOMAIN, messageData
    )
    res.status(200).json({message: response.message})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "error DB"})
  }
})


app.all("*", async (req,res)=>{
  try {
    res.status(404).json({message: "Route not found"})
    
  } catch (error) {
    res.status(500).json({message: "error DB"})
  }
})

app.listen(process.env.PORT, ()=>{console.log("Server On")})