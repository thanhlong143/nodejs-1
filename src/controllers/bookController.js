import * as services from "../services";
import { badRequest, internalServerError } from "../middlewares/handle_errors";
import { title, image, category_code, price, available, bid, bids } from "../helpers/joi_schema";
import joi from "joi";
const cloudinary = require("cloudinary").v2;

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
      const fileData = req.file;
      const { error } = joi.object({ title, image, category_code, price, available }).validate({ ...req.body, image: fileData?.path });
      if (error) {
         if (fileData) cloudinary.uploader.destroy(fileData.filename);
         return badRequest(error.details[0].message, res)
      }
      const response = await services.createBook(req.body, fileData);
      return res.status(200).json(response);
   } catch (error) {
      return internalServerError(res)
   }
}

export const updateBook = async (req, res) => {
   try {
      const fileData = req.file;
      const { error } = joi.object({ bid }).validate({ bid: req.body.bid });
      if (error) {
         if (fileData) cloudinary.uploader.destroy(fileData.filename);
         return badRequest(error.details[0].message, res)
      }
      const response = await services.updateBook(req.body, fileData);
      return res.status(200).json(response);
   } catch (error) {
      return internalServerError(res)
   }
}

export const deleteBook = async (req, res) => {
   try {
      const { error } = joi.object({ bids }).validate(req.query);
      if (error) {
         return badRequest(error.details[0].message, res)
      }
      const response = await services.deleteBook(req.query.bids);
      return res.status(200).json(response);
   } catch (error) {
      return internalServerError(res)
   }
}