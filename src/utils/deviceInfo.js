import { UAParser } from "ua-parser-js";

export default function generate(userAgent) {

    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    const deviceInfo = {
        browser: result.browser.name || 'Unknown',
        browserVersion: result.browser.version || 'Unknown',
        os: result.os.name || 'Unknown',
        osVersion: result.os.version || 'Unknown',
        device: result.device.type || 'Unknown',
        vendor: result.device.vendor || 'Unknown',
        model: result.device.model || 'Unknown',
    };

    return deviceInfo
}