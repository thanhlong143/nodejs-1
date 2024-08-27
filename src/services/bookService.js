import { Op } from "sequelize";
import db from "../models";
import { v4 as generateId } from "uuid";
const cloudinary = require("cloudinary").v2;

export const getBooks = ({ page, limit, order, title, available, ...query }) => new Promise(async (resolve, reject) => {
   try {
      const queries = { raw: true, nest: true }
      const offset = (!page || +page <= 1) ? 0 : (+page - 1);
      const finalLimit = +limit || +process.env.LIMIT;
      queries.offset = offset * finalLimit;
      queries.limit = finalLimit;
      if (order) queries.order = [order]
      if (title) query.title = { [Op.substring]: title };
      if (available) query.available = { [Op.between]: available }

      const response = await db.Book.findAndCountAll({
         where: query,
         ...queries,
         attributes: {
            exclude: ["category_code", "description"]
         },
         include: [
            { model: db.Category, attributes: { exclude: ["createdAt", "updatedAt"] }, as: "categoryData" }
         ]
      });

      resolve({
         error: response ? 0 : 1,
         message: response ? "Got" : "Cannot found books",
         bookData: response
      });
   } catch (error) {
      reject(error);
   }
})

export const createBook = (body, fileData) => new Promise(async (resolve, reject) => {
   try {
      const response = await db.Book.findOrCreate({
         where: { title: body?.title },
         defaults: {
            ...body,
            id: generateId(),
            image: fileData?.path
         }
      });

      resolve({
         error: response[1] ? 0 : 1,
         message: response[1] ? "Created" : "Cannot create new book"
      });

      if (fileData && !response[1]) cloudinary.uploader.destroy(fileData.filename);
   } catch (error) {
      reject(error);
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
   }
})

export const updateBook = ({ bid, ...body }, fileData) => new Promise(async (resolve, reject) => {
   try {
      if (fileData) body.image = fileData.path;
      const response = await db.Book.update(body, {
         where: { id: bid }
      });

      resolve({
         error: response[0] > 0 ? 0 : 1,
         message: response[0] > 0 ? `${response[0]} book updated` : "Cannot update new book"
      });

      if (fileData && response[0] === 0) cloudinary.uploader.destroy(fileData.filename);
   } catch (error) {
      reject(error);
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
   }
})

export const deleteBook = (bids) => new Promise(async (resolve, reject) => {
   try {
      const response = await db.Book.destroy({
         where: { id: bids }
      });

      resolve({
         error: response > 0 ? 0 : 1,
         message: `${response} book(s) deleted`
      });

   } catch (error) {
      reject(error);
   }
})