const crypto = require('crypto');

// Generate unique room ID
const generateRoomId = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Validate drawing data
const validateDrawingData = (data) => {
  if (!data || typeof data !== 'object') return false;
  
  const requiredFields = ['type', 'x', 'y'];
  return requiredFields.every(field => data.hasOwnProperty(field));
};

// Sanitize chat message
const sanitizeChatMessage = (message) => {
  if (typeof message !== 'string') return '';
  
  return message
    .trim()
    .substring(0, 500) // Limit message length
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, ''); // Remove HTML tags
};

module.exports = {
  generateRoomId,
  validateDrawingData,
  sanitizeChatMessage
};