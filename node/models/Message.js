import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Message = db.define('messages', {
    message: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Message