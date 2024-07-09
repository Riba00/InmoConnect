import Property from "./Property.js";
import User from "./User.js";
import Category from "./Category.js";
import Price from "./Price.js";
import Message from "./Message.js";


Property.belongsTo(Price, {
    foreignKey: 'priceId'
})

Property.belongsTo(Category, {
    foreignKey: 'categoryId'
})

Property.belongsTo(User, {
    foreignKey: 'userId'
})

Message.belongsTo(Property, {foreignKey: 'propertyId'})
Message.belongsTo(User, {foreignKey: 'userId'})

export {
    Property,
    User,
    Category,
    Price,
    Message
}