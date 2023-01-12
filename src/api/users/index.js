import express from "express" // 3RD PARTY MODULE (npm i express)
import fs from "fs" // CORE MODULE (no need to install it!!!)
import { fileURLToPath } from "url" // CORE MODULE
import { dirname, join } from "path" // CORE MODULE
import uniqid from "uniqid" // 3RD PARTY MODULE (npm i uniqid)
import { getUsers } from "../../lib/fs-tools.js"
import { sendRegistrationEmail } from "../../lib/email-tools.js"

const usersRouter = express.Router() // an Express Router is a set of similar endpoints grouped in the same collection

// ****************************** HOW TO GET USERS.JSON PATH *****************************************

// target --> D:\Epicode\2022\BE-MASTER-03\U4\epicode-u4-d2-3\src\api\users\users.json

// 1. We gonna start from the current's file path --> D:\Epicode\2022\BE-MASTER-03\U4\epicode-u4-d2-3\src\api\users\index.js
console.log("CURRENTS FILE URL: ", import.meta.url)
console.log("CURRENTS FILE PATH: ", fileURLToPath(import.meta.url))
// 2. We can obtain the parent's folder path --> D:\Epicode\2022\BE-MASTER-03\U4\epicode-u4-d2-3\src\api\users\
console.log("PARENT FOLDER PATH: ", dirname(fileURLToPath(import.meta.url)))
// 3. We can concatenate parent's folder path with "users.json" --> D:\Epicode\2022\BE-MASTER-03\U4\epicode-u4-d2-3\src\api\users\users.json
console.log("TARGET: ", join(dirname(fileURLToPath(import.meta.url)), "users.json"))

usersRouter.post("/register", async (req, res, next) => {
    try {
      // 1. Receive user's data in req.body
      const { email } = req.body
      // 2. Save new user in db
      // 3. Send email to new user
      await sendRegistrationEmail(email)
      res.send()
    } catch (error) {
      next(error)
    }
  })