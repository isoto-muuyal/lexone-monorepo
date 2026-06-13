// LexOne placeholder address.
//
// In LexOne the client never enters their own address — every request is
// anchored to the lawyer's office. The address inputs are hidden in the UI
// but the existing API still requires source_location /
// dest_location / source_lat / source_lon / dest_lat / dest_lon strings on
// the addneed, bookservice, and related endpoints. This module centralises
// the placeholder values that the frontend sends so the request validates
// without backend changes.
//
// Coordinates are an approximation for Col. San Fernando, Chihuahua city.
// Replace with the real office geo when the production address is final.

export const PLACEHOLDER_OFFICE_ADDRESS =
    'C. Priv. de Urquidi 905, San Fernando, 31060 Chihuahua, Chih., Mexico';

export const PLACEHOLDER_OFFICE_LAT = '28.6164';
export const PLACEHOLDER_OFFICE_LON = '-106.0820';
