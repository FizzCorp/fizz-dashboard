// imports
import crypto from 'crypto';

// helper methods
export function getSHA256Base64(payload) {
  const payloadStr = (typeof payload === 'string') ? payload : JSON.stringify(payload);
  let hash = crypto.createHash('sha256');
  if (payloadStr) { hash = hash.update(payloadStr); }
  return hash.digest('base64');
};

export function getHmacSHA256Base64(payload, secret) {
  const payloadStr = (typeof payload === 'string') ? payload : JSON.stringify(payload);
  let hmac = crypto.createHmac('sha256', secret);
  if (payloadStr) { hmac = hmac.update(payloadStr); }
  return hmac.digest('base64');
};