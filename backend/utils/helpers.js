const crypto = require('crypto');

// Generate unique room ID
const generateRoomId = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Validate drawing data
const validateDrawingData = (data) => {
  if (!data || typeof data !== 'object') return false;
  
  // Check if type exists
  if (!data.type) return false;
  
  // For 'start' and 'draw' types, x and y are required
  if (data.type === 'start' || data.type === 'draw') {
    if (typeof data.x !== 'number' || typeof data.y !== 'number') {
      return false;
    }
  }
  
  // For 'end' type, x and y are optional
  return true;
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