const routes = require('next-routes')();

routes
  .add('/orders/', '/orders/index')
  .add('/orders/:address', '/orders/show');

module.exports = routes;
