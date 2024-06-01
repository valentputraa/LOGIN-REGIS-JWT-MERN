import db from "../config/Database.js";
import { DataTypes } from "sequelize";

const Users = db.define('users',{
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    refresh_token: DataTypes.TEXT
},{
    freezeTableName: true
})

export default Users;
