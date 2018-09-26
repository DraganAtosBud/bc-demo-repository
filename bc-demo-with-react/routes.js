const routes = require('next-routes')();

routes
  .add('/orders/', '/orders/index')
  .add('/orders/:address', '/orders/show')
  .add('/deliveries/', '/deliveries/index')
  .add('/deliveries/:address', '/deliveries/show');

module.exports = routes;
