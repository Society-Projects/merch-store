import chalk from 'chalk';
import fs from 'fs';

export const log = (message, level = 'info') => {
    const timestamp = new Date().toISOString();
    let formattedMessage;

    level = level.toUpperCase();

    if (level === "ERROR") {
        formattedMessage = `${chalk.red(`[${timestamp}] [${level}] ${message}`)}`;
    }
    else if (level === "WARN") {
        formattedMessage = `${chalk.yellow(`[${timestamp}] [${level}] ${message}`)}`;
    }
    else if (level === "INFO") {
        formattedMessage = `${chalk.blue(`[${timestamp}] [${level}] ${message}`)}`;
    }
    else if (level === "DEBUG") {
        formattedMessage = `${chalk.gray(`[${timestamp}] [${level}] ${message}`)}`;
    }
    else {
        formattedMessage = `${chalk.green(`[${timestamp}] [${level}] ${message}`)}`;
        level = "MISCELLANEOUS";
    }

    fs.writeFileSync((process.cwd() + '/logs/' + level.toLowerCase() + '.log'), `${formattedMessage}\n`, { flag: 'a' });
}