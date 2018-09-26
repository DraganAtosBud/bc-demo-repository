const routes = require('next-routes')();

routes
  .add('/orders/', '/orders/index')
  .add('/orders/:address', '/orders/show')
  .add('/deliveries/', '/deliveries/index')
  .add('/deliveries/:address', '/deliveries/show')
  .add('/shipping/all', '/shipping/all')
  .add('/shipping/:address', '/shipping/update');

module.exports = routes;
