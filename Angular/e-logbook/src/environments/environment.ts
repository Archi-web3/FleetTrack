export const environment = {
    production: false,
    apiUrl: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? `http://${window.location.hostname}:3000/api`
        : 'https://fleettrack-api.onrender.com/api'
};
