import { connectDB } from "#src/db/connect.js";
import { Product } from "#src/models/Product.js";

import chalk from "chalk";

connectDB().then(async () => {

    await Product.insertMany([
        {
            name: "Chapter Hoodie",
            description: "Premium heavyweight hoodie with the chapter logo embroidered on chest. 80% cotton, 20% polyester fleece — warm, structured, and built for marathon debugging sessions.",
            isVisible: true,
            positions: ["EB", "CORE", "MEMBER"],
            price: 1799,
            image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop&auto=format",
            userInputs: [
                { question: "Select your size", isRequired: true, isText: false, isImage: false, isMenu: true, menuOptions: ["XS", "S", "M", "L", "XL", "XXL"] },
                { question: "Name for embroidery (optional, max 20 chars)", isRequired: false, isText: true, isImage: false, isMenu: false }
            ]
        },
        {
            name: "IEEE Polo Shirt",
            description: "Clean, professional polo with IEEE logo embroidery on left chest. Moisture-wicking pique fabric keeps you composed during industry visits and presentations.",
            isVisible: true,
            positions: ["EB", "CORE", "MEMBER"],
            price: 1299,
            image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&h=800&fit=crop&auto=format",
            userInputs: [
                { question: "Select your size", isRequired: true, isText: false, isImage: false, isMenu: true, menuOptions: ["S", "M", "L", "XL"] },
                { question: "Your name for the name tag", isRequired: true, isText: true, isImage: false, isMenu: false }
            ]
        },
        {
            name: "GDSC Ceramic Mug",
            description: "350ml ceramic mug with GDSC logo. Microwave and dishwasher safe. The only thing that should start your morning besides a standup.",
            isVisible: true,
            positions: ["EB", "CORE", "MEMBER"],
            price: 649,
            image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=800&fit=crop&auto=format",
            userInputs: [
                { question: "Custom message on mug (max 30 chars, optional)", isRequired: false, isText: true, isImage: false, isMenu: false }
            ]
        },
        {
            name: "OWASP Security Cap",
            description: "Structured six-panel cap with embroidered OWASP logo. UV-protective fabric, adjustable buckle strap.",
            isVisible: true,
            positions: ["EB", "CORE", "MEMBER"],
            price: 849,
            image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop&auto=format",
            userInputs: [
                { question: "Upload your chapter membership ID / proof", isRequired: true, isText: false, isImage: true, isMenu: false }
            ]
        },
        {
            name: "EB Member Blazer",
            description: "Custom tailored executive blazer, available exclusively for Executive Board (EB) members. Includes golden embroidered emblem.",
            isVisible: true,
            positions: ["EB"],
            price: 2999,
            image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop&auto=format",
            userInputs: [
                { question: "Select your chest size", isRequired: true, isText: false, isImage: false, isMenu: true, menuOptions: ["38", "40", "42", "44"] },
                { question: "Upload EB Appointment Letter", isRequired: true, isText: false, isImage: true, isMenu: false }
            ]
        }
    ]);

    process.exit(0);
}).catch((err) => {
    console.error(chalk.red("Error connecting to the database:"), err);
})