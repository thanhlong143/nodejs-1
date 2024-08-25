import { Op } from "sequelize";
import db from "../models";
import { v4 as generateId } from "uuid";

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
            exclude: ["category_code"]
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

export const createBook = (body) => new Promise(async (resolve, reject) => {
   try {
      const response = await db.Book.findOrCreate({
         where: { title: body?.title },
         defaults: {
            ...body,
            id: generateId()
         }
      });

      resolve({
         error: response[1] ? 0 : 1,
         message: response[1] ? "Created" : "Cannot create new book"
      });
   } catch (error) {
      reject(error);
   }
})