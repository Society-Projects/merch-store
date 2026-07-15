import "#src/config/env.js";

import chalk from 'chalk';

import { connectDB } from "#src/db/connect.js";
import app from "#src/app.js";

connectDB().then(() => {
    console.log(chalk.green('- Database connected successfully'));
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(chalk.green(`- Server running on port ${PORT}`));
    });
}).catch((error) => {
    console.error(chalk.red(`Error connecting to database: `), error.message);
    process.exit(1);
})