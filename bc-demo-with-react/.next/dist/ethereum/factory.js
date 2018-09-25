'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _web = require('./web3');

var _web2 = _interopRequireDefault(_web);

var _SupplyChainFactory = require('./build/SupplyChainFactory.json');

var _SupplyChainFactory2 = _interopRequireDefault(_SupplyChainFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instance = new _web2.default.eth.Contract(JSON.parse(_SupplyChainFactory2.default.interface), '0x07d8504d09a98eAA1a6470f476c386244eE2F353');

exports.default = instance;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV0aGVyZXVtXFxmYWN0b3J5LmpzIl0sIm5hbWVzIjpbIndlYjMiLCJTdXBwbHlGYWN0b3J5IiwiaW5zdGFuY2UiLCJldGgiLCJDb250cmFjdCIsIkpTT04iLCJwYXJzZSIsImludGVyZmFjZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsQUFBTyxBQUFQLEFBQWlCLEFBQWpCOzs7O0FBQ0EsQUFBTyxBQUFQLEFBQTBCLEFBQTFCOzs7Ozs7QUFFQSxJQUFNLFdBQVksSUFBSSxjQUFLLEFBQUwsSUFBUyxBQUFiLFNBQ2hCLEtBQUssQUFBTCxNQUFXLDZCQUFjLEFBQXpCLEFBRGdCLFlBRWhCLEFBRmdCLEFBQWxCLEFBS0E7O2tCQUFlLEFBQWYiLCJmaWxlIjoiZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9BNjcyMDQzL0RvY3VtZW50cy9iYy1kZW1vLXJlcG9zaXRvcnkvYmMtZGVtby13aXRoLXJlYWN0In0=