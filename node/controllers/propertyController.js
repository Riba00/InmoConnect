import Price from '../models/Price.js'
import Category from '../models/Category.js'

const admin = (req, res) => {
    res.render('properties/admin',{
        page: 'My Properties',
        bar: true
    })
}

const create = async (req, res) => {

    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])


    res.render('properties/create' ,{
        page: 'Create Property',
        bar: true,
        categories,
        prices
    })
}

export {
    admin,
    create
}