import fetch from 'node-fetch';

window.fetch = fetch;
window.Response = fetch.Response;
window.Headers = fetch.Headers;
window.Request = fetch.Request;
