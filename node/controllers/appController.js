import {Price, Category, Property } from '../models/index.js'

const init = async (req, res) => {

    const [categories, prices] = await Promise.all([
        Category.findAll({raw: true}),
        Price.findAll({raw: true}),
    ])

    console.log(categories);


    res.render('init', {
        page:'Init',
        categories,
        prices
    })
};

const category = async (req, res) => {};
const notFound = async (req, res) => {};
const searcher = async (req, res) => {};

export {
    init,
    category,
    notFound,
    searcher
}
