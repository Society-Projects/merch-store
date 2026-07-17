import { connectDB } from "#src/db/connect.js";
import { Product } from "#src/models/Product.js";

import chalk from "chalk";

connectDB().then(async () => {

    await Product.insertMany([
        {
            name: "ID card",
            description: "Description for Product 1",
            isVisible: true,
            positions: ["EB", "CORE", "MEMBER"],
            price: 500,
            image: "https://res.cloudinary.com/dbl0bzdfi/image/upload/v1783411214/logo_masldr.png",
            userInputs: [
                {
                    question: "What you want to write on ur id card",
                    isRequired: false,
                    isImageInput: false
                },
                {
                    question: "Upload your image",
                    isRequired: false,
                    isImageInput: true
                }
            ]
        },
        {
            name: "Tshirt",
            description: "Description for Product 2",
            isVisible: true,
            positions: ["EB", "CORE", "MEMBER"],
            price: 500,
            image: "https://res.cloudinary.com/dbl0bzdfi/image/upload/v1783411213/banner_lldgct.png",
            userInputs: [
                {
                    question: "What you want to write as ur name on ur Tshirt",
                    isRequired: true,
                    isImageInput: false
                }
            ]
        }
    ]);

    process.exit(0);
}).catch((err) => {
    console.error(chalk.red("Error connecting to the database:"), err);
})