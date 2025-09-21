// The Google Client ID should be set as an environment variable (GOOGLE_CLIENT_ID).
// Go to the Google Cloud Console to create an OAuth 2.0 Client ID for a Web application.
// https://console.cloud.google.com/
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

/**
 * Decodes a JWT token from Google Sign-In to extract user profile information.
 * This is a simple client-side decoding and does not verify the token's signature,
 * which is generally acceptable for client-side use where the token is received
 * directly from Google's trusted scripts.
 * @param {string} token The JWT credential string.
 * @returns {any | null} The decoded JSON payload of the token, or null if decoding fails.
 */
export const decodeJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding JWT token:", e);
    return null;
  }
};
