import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Category = db.define('categories', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Category