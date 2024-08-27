import joi from "joi";

export const email = joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required();
// export const phone = joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")).required();
export const password = joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required();
export const title = joi.string().required();
export const price = joi.number().required();
export const available = joi.number().required();
export const category_code = joi.string().uppercase().alphanum().required();
export const image = joi.string().required();
export const bid = joi.string().required();
export const bids = joi.array().required();
export const filename = joi.array().required();
export const description = joi.string().required();
export const refreshToken = joi.string().required();
