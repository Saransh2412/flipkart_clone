const crypto = require('crypto');

const generateOrderId = () => {
    // Generate a unique order ID e.g., OD123456789012345
    // Using randomBytes is safer than randomInt for very large strings
    const randomHex = crypto.randomBytes(6).toString('hex').toUpperCase();
    const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
    return `OD${timestamp}${randomHex}`;
};

module.exports = {
    generateOrderId
};
