import jwt, { TokenExpiredError } from "jsonwebtoken";
import { unauthorized } from "./handle_errors";

const verifyToken = (req, res, next) => {
   const token = req.headers.authorization;
   if (!token) return unauthorized("Require authorization", res)
   const accessToken = token.split(" ")[1]
   jwt.verify(accessToken, process.env.JWT_SECRET, (error, user) => {
      if (error) {
         const isChecked = error instanceof TokenExpiredError;
         if (!isChecked) return unauthorized("Access token invalid", res, isChecked)
         if (isChecked) return unauthorized("Access token expired", res, isChecked)
      }
      req.user = user;
      next();
   })
}

export default verifyToken;