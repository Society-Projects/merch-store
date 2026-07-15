import { connectDB } from "#src/db/connect.js";
import { User } from "#src/models/User.js";

import chalk from "chalk";

connectDB().then(async () => {
    const emailInput = process.argv[2];

    if (!emailInput || !emailInput.includes("@") || !emailInput.endsWith("@thapar.edu")) {
        console.error(chalk.redBright("Please provide a valid Thapar email address as an argument."));
        process.exit(1);
        return;
    }

    const user = await User.findOne({ email: emailInput });
    if (!user) {
        console.error(chalk.redBright(`No user found with email: ${emailInput}`));
        process.exit(1);
        return;
    }

    if (user.role === "admin") {
        user.role = "user";
        await user.save();
        console.log(chalk.red(`User with email ${emailInput} has been demoted to user.`));
    } else {
        user.role = "admin";
        await user.save();
        console.log(chalk.green(`User with email ${emailInput} has been promoted to admin.`));
    }
    process.exit(0);
}).catch((err) => {
    console.error(chalk.red("Error connecting to the database:"), err);
})