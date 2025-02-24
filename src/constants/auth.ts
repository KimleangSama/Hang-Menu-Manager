const VERSION = '/api/v1';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + VERSION || 'http://localhost:10000' + VERSION;
export const API_IMAGE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + VERSION + "/files/view/" || 'http://localhost:10000/' + VERSION + '/files/view/';

export const ACCESS_TOKEN = 'access_token';
export const REFRESH_TOKEN = 'refresh_token';