//  SETTINGS
//  🤫 A common place to store and import variables used in api.js

// API
export const apiDefaultHeaders = {
  Authorization: `Bearer ${process.env.VUE_APP_CRAFT_AUTH_TOKEN}`,
  'Content-Type': 'application/json;charset=UTF-8',
};
export const apiDefaultUrl = process.env.VUE_APP_CRAFT_API_URL;