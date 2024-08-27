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
      const accessToken = response[1] ? jwt.sign({
         id: response[0].id,
         email: response[0].email,
         role_code: response[0].role_code
      }, process.env.JWT_SECRET, { expiresIn: "30s" }) : null;

      const refreshToken = response[1] ? jwt.sign({
         id: response[0].id
      }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: "7d" }) : null;

      resolve({
         error: response[1] ? 0 : 1,
         message: response[1] ? "Register successfully" : "This email already exists",
         access_token: accessToken ? `Bearer ${accessToken}` : accessToken,
         refresh_token: refreshToken
      });

      if (refreshToken) {
         await db.User.update({
            refresh_token: refreshToken
         }, {
            where: { id: response[0].id }
         })
      }
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
      const accessToken = isChecked ? jwt.sign({
         id: response.id,
         email: response.email,
         role_code: response.role_code
      }, process.env.JWT_SECRET, { expiresIn: "30s" }) : null

      const refreshToken = isChecked ? jwt.sign({
         id: response.id
      }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: "7d" }) : null;

      resolve({
         error: accessToken ? 0 : 1,
         message: accessToken ? "Login successfully" : response ? "Wrong password" : "Email not valid",
         access_token: accessToken ? `Bearer ${accessToken}` : accessToken,
         refresh_token: refreshToken
      });

      if (refreshToken) {
         await db.User.update({
            refresh_token: refreshToken
         }, {
            where: { id: response.id }
         })
      }
   } catch (error) {
      reject(error);
   }
})

export const refreshToken = (refresh_token) => new Promise(async (resolve, reject) => {
   try {
      const response = await db.User.findOne({
         where: { refresh_token }
      });

      if (response) {
         jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH_TOKEN, (err) => {
            if (err) {
               resolve({
                  error: 1,
                  message: "Refresh token is expired. Require login"
               })
            }
            else {
               const accessToken = jwt.sign({
                  id: response.id,
                  email: response.email,
                  role_code: response.role_code
               }, process.env.JWT_SECRET, { expiresIn: "30s" });

               resolve({
                  error: accessToken ? 0 : 1,
                  message: accessToken ? "OK" : "Failed to generate new access token. Please try again!",
                  access_token: accessToken ? `Bearer ${accessToken}` : accessToken,
                  refresh_token: refresh_token
               })
            }
         })
      }
   } catch (error) {
      reject(error);
   }
})