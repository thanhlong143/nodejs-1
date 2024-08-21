import { unauthorized } from "./handle_errors";

export const isAdmin = (req, res, next) => {
   const { role_code } = req.user;
   if (role_code !== "R1") return unauthorized("Require admin role", res);
   next();
}

export const isModeratorOrAdmin = (req, res, next) => {
   const { role_code } = req.user;
   if (role_code !== "R1" && role_code !== "R2") return unauthorized("Require admin or moderator role", res);
   next();
}