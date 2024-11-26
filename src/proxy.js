const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://todoserver-k4hr.onrender.com',
            changeOrigin: true,
        })
    );
};
