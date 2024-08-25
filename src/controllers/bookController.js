import * as services from "../services";
import { badRequest, internalServerError } from "../middlewares/handle_errors";
import { title, image, category_code, price, available } from "../helpers/joi_schema";
import joi from "joi";

export const getBooks = async (req, res) => {
   try {
      const response = await services.getBooks(req.query);
      return res.status(200).json(response);
   } catch (error) {
      return internalServerError(res)
   }
}

export const createBook = async (req, res) => {
   try {
      const { error } = joi.object({ title, image, category_code, price, available }).validate(req.body);
      if (error) return badRequest(error.details[0].message, res)
      const response = await services.createBook(req.body);
      return res.status(200).json(response);
   } catch (error) {
      return internalServerError(res)
   }
}