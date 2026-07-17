import { connectDB } from "#src/db/connect.js";
import { User } from "#src/models/User.js";

import chalk from "chalk";

connectDB().then(async () => {
    const roleInput = process.argv[2];
    const emailInput = process.argv[3];

    if (!roleInput || !["EB", "CORE", "MEMBER"].includes(roleInput?.toUpperCase())) {
        console.error(chalk.redBright("Please provide a valid role as an argument (EB/CORE/MEMBER)."));
        process.exit(1);
        return;
    }

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

    user.role = roleInput;
    await user.save();
    console.log(chalk.greenBright(`Successfully updated role of user ${emailInput} to ${roleInput}.`));

    process.exit(0);
}).catch((err) => {
    console.error(chalk.red("Error connecting to the database:"), err);
})