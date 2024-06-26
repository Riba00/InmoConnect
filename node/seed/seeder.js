import { exit } from 'node:process'
import categories from "./categories.js";
import prices from "./prices.js";
import users from "./users.js";
import db from '../config/db.js'
import { Category, Price, User } from '../models/index.js'

const importData = async () => {
    try {
        
        // Authenticate
        await db.authenticate()

        // Generate Cols
        await db.sync()

        // Insert Data

        await Promise.all([
            Category.bulkCreate(categories),
            Price.bulkCreate(prices),
            User.bulkCreate(users)
        ])
        
        console.log('Data Import Correctly');
        exit(0)

    } catch (error) {
        console.log(error);
        exit(1)
    }
}

const cleanData = async () => {
    try {
        // await Promise.all([
        //     Category.destroy({ where: {}, truncate: true}),
        //     Price.destroy({ where: {}, truncate: true})
        // ])

        await db.sync({force:true})
        console.log("Clean Correct");
        exit()

    } catch (error) {
        console.log(error);
        exit(1)
    }
}

if(process.argv[2] === "-i" ){
    importData();
}

if(process.argv[2] === "-c" ){
    cleanData();
}