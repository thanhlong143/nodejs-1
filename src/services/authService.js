import db from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const hash = str => bcrypt.hashSync(str, bcrypt.genSaltSync(10));

export const register = ({ email, password }) => new Promise(async (resolve, reject) => {
   try {
      const response = await db.User.findOrCreate({
         where: { email },
         defaults: {
            email,
            password: hash(password)
         }
      });
      const access_token = response[1] ? jwt.sign({
         id: response[0].id,
         email: response[0].email,
         role_code: response[0].role_code
      }, process.env.JWT_SECRET, { expiresIn: "3d" }) : null
      resolve({
         error: response[1] ? 0 : 1,
         message: response[1] ? "Register successfully" : "This email already exists",
         access_token: access_token ? `Bearer ${access_token}` : access_token
      });
   } catch (error) {
      reject(error);
   }
})

export const login = ({ email, password }) => new Promise(async (resolve, reject) => {
   try {
      const response = await db.User.findOne({
         where: { email },
         raw: true
      });
      const isChecked = response && bcrypt.compareSync(password, response.password)
      const access_token = isChecked ? jwt.sign({
         id: response.id,
         email: response.email,
         role_code: response.role_code
      }, process.env.JWT_SECRET, { expiresIn: "3d" }) : null
      resolve({
         error: access_token ? 0 : 1,
         message: access_token ? "Login successfully" : response ? "Wrong password" : "Email not valid",
         access_token: access_token ? `Bearer ${access_token}` : access_token
      });
   } catch (error) {
      reject(error);
   }
})