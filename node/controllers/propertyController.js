const admin = (req, res) => {
    res.render('properties/admin',{
        page: 'My Properties'
    })
}

export {
    admin
}