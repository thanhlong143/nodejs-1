import joi from "joi";

export const email = joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com"] } }).required();
// export const phone = joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required();
export const password = joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')).required();
