const admin = (req, res) => {
    res.render('properties/admin',{
        page: 'My Properties',
        bar: true
    })
}

const create = (req, res) => {
    res.render('properties/create' ,{
        page: 'Create Property',
        bar: true
    })
}

export {
    admin,
    create
}