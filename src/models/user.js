"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
   class User extends Model {
      static associate(models) {

      }
   }
   User.init({
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      role_code: DataTypes.STRING
   }, {
      sequelize,
      modelName: "User",
   });
   return User;
};