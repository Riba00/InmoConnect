import { validationResult } from 'express-validator'
import { Category, Price, Property } from '../models/index.js'

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
        csrfToken: req.csrfToken(),
        categories,
        prices,
        data: {}
    })
}

const store = async (req, res) => {
    // Validation
    let result = validationResult(req)

    if (!result.isEmpty()) {
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])
    
    
        res.render('properties/create' ,{
            page: 'Create Property',
            bar: true,
            csrfToken: req.csrfToken(),
            categories,
            prices,
            errors: result.array(),
            data: req.body
        })
    }

    const { title, description, category, price, rooms, wcs, parkings, lat, lng } = req.body

    try {
        const storedProperty = await Property.create({
            title,
            description,
            categoryId: category,
            priceId: price,
            rooms,
            wcs,
            parkings,
            lat,
            lng
        })
    } catch (error) {
        console.log(error);
    }

    

}

export {
    admin,
    create,
    store
}