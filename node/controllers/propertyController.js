import { validationResult } from 'express-validator'
import { Category, Price, Property } from '../models/index.js'

const admin = (req, res) => {
    res.render('properties/admin',{
        page: 'My Properties',
    })
}

const create = async (req, res) => {

    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])


    res.render('properties/create' ,{
        page: 'Create Property',
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
            csrfToken: req.csrfToken(),
            categories,
            prices,
            errors: result.array(),
            data: req.body
        })
    }

    const { title, description, category, price, rooms, wcs, street, parkings, lat, lng, price: priceId, category: categoryId } = req.body

    const { id: userId } = req.user

    try {
        const storedProperty = await Property.create({
            title,
            description,
            categoryId: category,
            priceId: price,
            rooms,
            street,
            wcs,
            parkings,
            lat,
            lng,
            priceId,
            categoryId,
            userId,
            images: ''
        })

        const { id } = storedProperty

        return res.redirect(`/properties/add-image/${id}`)
    } catch (error) {
        console.log(error);
    }
}

const addImage = async (req, res) => {

    const { id } = req.params

    const property = await Property.findByPk(id)

    if (!property) {
        return res.redirect('/my-properties')
    }

    if (property.is_published) {
        return res.redirect('/my-properties')
    }

    if (property.userId.toString() !== req.user.id.toString()) {
        return res.redirect('/my-properties')
    }

    res.render('properties/add-image', {
        page: `Add Image: ${property.title}`,
        csrfToken: req.csrfToken(),
        property
    })
}

const storeImage = async (req, res) => {

    const { id } = req.params

    const property = await Property.findByPk(id)

    if (!property) {
        return res.redirect('/my-properties')
    }

    if (property.is_published) {
        return res.redirect('/my-properties')
    }

    if (property.userId.toString() !== req.user.id.toString()) {
        return res.redirect('/my-properties')
    }
      

    try {
        const files = req.files.map(file => file.filename)

        const images = JSON.stringify(files)

        property.images = images
        property.is_published = true

        await property.save()

        console.log(property);

        

    } catch (error) {
        console.log(error);
    }
}

export {
    admin,
    create,
    store,
    addImage,
    storeImage
}