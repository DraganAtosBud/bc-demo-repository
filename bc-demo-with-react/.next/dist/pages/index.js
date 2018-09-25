'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _semanticUiReact = require('semantic-ui-react');

var _factory = require('../ethereum/factory');

var _factory2 = _interopRequireDefault(_factory);

var _web = require('../ethereum/web3');

var _web2 = _interopRequireDefault(_web);

var _Layout = require('../components/Layout');

var _Layout2 = _interopRequireDefault(_Layout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = 'C:\\Users\\A672043\\Documents\\bc-demo-repository\\bc-demo-with-react\\pages\\index.js?entry';


var SupplyIndex = function (_Component) {
  (0, _inherits3.default)(SupplyIndex, _Component);

  function SupplyIndex() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, SupplyIndex);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = SupplyIndex.__proto__ || (0, _getPrototypeOf2.default)(SupplyIndex)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      errorMessage: '',
      loading: false
    }, _this.buyProduct = function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(product, event) {
        var accounts;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                event.preventDefault();

                _this.setState({ loading: true, errorMessage: '' });

                _context.prev = 2;
                _context.next = 5;
                return _web2.default.eth.getAccounts();

              case 5:
                accounts = _context.sent;
                _context.next = 8;
                return _factory2.default.methods.createSupplyChain('Adam', product.name, _web2.default.utils.toWei(product.price), product.seller).send({
                  from: accounts[0], value: _web2.default.utils.toWei(product.price)
                });

              case 8:
                Router.pushRoute('/');
                _context.next = 14;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context['catch'](2);

                _this.setState({ errorMessage: _context.t0.message });

              case 14:

                _this.setState({ loading: false });

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2, [[2, 11]]);
      }));

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }(), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(SupplyIndex, [{
    key: 'renderProducts',
    value: function renderProducts() {
      var _this3 = this;

      //TODO: Add seller address here, to send it to the contract

      var items = [{ name: 'Product 1', price: '0.1', sellerName: 'Seller 1', seller: '0x2822a11b98462eb6aeaaeebd59b1656969bf147b' }, { name: 'Product 2', price: '0.05', sellerName: 'Seller 1', seller: '0x2822a11b98462eb6aeaaeebd59b1656969bf147b' }, { name: 'Product 3', price: '0.01', sellerName: 'Seller 2', seller: '0x690a4f7a854ccfb3e83abbdb5a19e16413e96c55' }].map(function (p) {
        return {
          header: p.name,
          description: _react2.default.createElement('div', {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 47
            }
          }, _react2.default.createElement('p', {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 48
            }
          }, 'Price: ', p.price, ' eth'), _react2.default.createElement('p', {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 49
            }
          }, 'Seller: ', p.sellerName), _react2.default.createElement(_semanticUiReact.Button, { loading: _this3.state.loading, onClick: _this3.buyProduct.bind(_this3, p), primary: true, __source: {
              fileName: _jsxFileName,
              lineNumber: 50
            }
          }, 'Buy')),
          fluid: true
        };
      });

      return _react2.default.createElement(_semanticUiReact.Card.Group, { items: items, __source: {
          fileName: _jsxFileName,
          lineNumber: 57
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_Layout2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 61
        }
      }, _react2.default.createElement('div', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 62
        }
      }, _react2.default.createElement('h3', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 63
        }
      }, 'Products'), this.state.errorMessage !== '' ? _react2.default.createElement(_semanticUiReact.Message, { error: true, header: 'Oops!', content: this.state.errorMessage, __source: {
          fileName: _jsxFileName,
          lineNumber: 64
        }
      }) : null, this.renderProducts()));
    }
  }]);

  return SupplyIndex;
}(_react.Component);

exports.default = SupplyIndex;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2VzXFxpbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsIkNhcmQiLCJCdXR0b24iLCJNZXNzYWdlIiwiZmFjdG9yeSIsIndlYjMiLCJMYXlvdXQiLCJTdXBwbHlJbmRleCIsInN0YXRlIiwiZXJyb3JNZXNzYWdlIiwibG9hZGluZyIsImJ1eVByb2R1Y3QiLCJwcm9kdWN0IiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInNldFN0YXRlIiwiZXRoIiwiZ2V0QWNjb3VudHMiLCJhY2NvdW50cyIsIm1ldGhvZHMiLCJjcmVhdGVTdXBwbHlDaGFpbiIsIm5hbWUiLCJ1dGlscyIsInRvV2VpIiwicHJpY2UiLCJzZWxsZXIiLCJzZW5kIiwiZnJvbSIsInZhbHVlIiwiUm91dGVyIiwicHVzaFJvdXRlIiwibWVzc2FnZSIsIml0ZW1zIiwic2VsbGVyTmFtZSIsIm1hcCIsImhlYWRlciIsInAiLCJkZXNjcmlwdGlvbiIsImJpbmQiLCJmbHVpZCIsInJlbmRlclByb2R1Y3RzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQUFBTyxBQUFTOzs7O0FBQ2hCLEFBQVMsQUFBTSxBQUFROztBQUN2QixBQUFPLEFBQWE7Ozs7QUFDcEIsQUFBTyxBQUFVOzs7O0FBQ2pCLEFBQU8sQUFBWTs7Ozs7Ozs7O0lBRWIsQTs7Ozs7Ozs7Ozs7Ozs7O3NOQUdKLEE7b0JBQVEsQUFDVSxBQUNkO2VBRkksQUFFSyxBO0FBRkwsQUFDSixhLEFBSUo7MkZBQWEsaUJBQUEsQUFBTyxTQUFQLEFBQWdCLE9BQWhCO1lBQUE7c0VBQUE7b0JBQUE7NkNBQUE7bUJBQ1g7c0JBQUEsQUFBTSxBQUVOOztzQkFBQSxBQUFLLFNBQVMsRUFBRSxTQUFGLEFBQVcsTUFBTSxjQUhwQixBQUdYLEFBQWMsQUFBK0I7O2dDQUhsQztnQ0FBQTt1QkFNYSxjQUFBLEFBQUssSUFObEIsQUFNYSxBQUFTOzttQkFBMUI7QUFOSSxvQ0FBQTtnQ0FBQTt5Q0FPSixBQUFRLFFBQVIsQUFDSCxrQkFERyxBQUNlLFFBQVEsUUFEdkIsQUFDK0IsTUFBTSxjQUFBLEFBQUssTUFBTCxBQUFXLE1BQU0sUUFEdEQsQUFDcUMsQUFBeUIsUUFBUSxRQUR0RSxBQUM4RSxRQUQ5RSxBQUVIO3dCQUNPLFNBREYsQUFDRSxBQUFTLElBQUksT0FBTyxjQUFBLEFBQUssTUFBTCxBQUFXLE1BQU0sUUFWckMsQUFPSixBQUVFLEFBQ3NCLEFBQXlCO0FBRC9DLEFBQ0osaUJBSEU7O21CQUtOO3VCQUFBLEFBQU8sVUFaRyxBQVlWLEFBQWlCO2dDQVpQO0FBQUE7O21CQUFBO2dDQUFBO2dEQWNWOztzQkFBQSxBQUFLLFNBQVMsRUFBRSxjQUFjLFlBZHBCLEFBY1YsQUFBYyxBQUFvQjs7bUJBR3BDOztzQkFBQSxBQUFLLFNBQVMsRUFBRSxTQWpCSixBQWlCWixBQUFjLEFBQVc7O21CQWpCYjttQkFBQTtnQ0FBQTs7QUFBQTtpQ0FBQTtBOzs7Ozs7Ozs7O3FDQW9CRzttQkFDZDs7QUFFQTs7VUFBTSxTQUVKLEVBQUMsTUFBRCxBQUFPLGFBQWEsT0FBcEIsQUFBMEIsT0FBTyxZQUFqQyxBQUE0QyxZQUFZLFFBRDFELEFBQ0UsQUFBK0QsZ0RBQy9ELEVBQUMsTUFBRCxBQUFPLGFBQWEsT0FBcEIsQUFBMEIsUUFBUSxZQUFsQyxBQUE2QyxZQUFZLFFBRjNELEFBRUUsQUFBZ0UsZ0RBQ2hFLEVBQUMsTUFBRCxBQUFPLGFBQWEsT0FBcEIsQUFBMEIsUUFBUSxZQUFsQyxBQUE2QyxZQUFZLFFBSDNELEFBR0UsQUFBZ0UsZ0RBSGxFLEFBSUMsSUFBSSxhQUFHLEFBQ047O2tCQUNVLEVBREosQUFDTSxBQUNWO3VDQUNFLGNBQUE7O3dCQUFBOzBCQUFBLEFBQ0U7QUFERjtBQUFBLFdBQUEsa0JBQ0UsY0FBQTs7d0JBQUE7MEJBQUE7QUFBQTtBQUFBLGFBQVcsYUFBWCxBQUFhLE9BRGYsQUFDRSxBQUNBLHlCQUFBLGNBQUE7O3dCQUFBOzBCQUFBO0FBQUE7QUFBQSxhQUFZLGNBRmQsQUFFRSxBQUFjLEFBQ2QsNkJBQUEsQUFBQyx5Q0FBTyxTQUFTLE9BQUEsQUFBSyxNQUF0QixBQUE0QixTQUFTLFNBQVMsT0FBQSxBQUFLLFdBQUwsQUFBZ0IsYUFBOUQsQUFBOEMsQUFBMkIsSUFBSSxTQUE3RTt3QkFBQTswQkFBQTtBQUFBO2FBTkEsQUFHRixBQUdFLEFBR0o7aUJBVEYsQUFBTSxBQVNHLEFBRVY7QUFYTyxBQUNKO0FBUEosQUFDQSxBQWtCQSxPQWxCQTs7MkNBa0JPLEFBQUMsc0JBQUQsQUFBTSxTQUFNLE9BQVosQUFBbUI7b0JBQW5CO3NCQUFQLEFBQU8sQUFDUjtBQURRO09BQUE7Ozs7NkJBRUQsQUFDTjs2QkFDRSxBQUFDOztvQkFBRDtzQkFBQSxBQUNFO0FBREY7QUFBQSxPQUFBLGtCQUNFLGNBQUE7O29CQUFBO3NCQUFBLEFBQ0U7QUFERjtBQUFBLHlCQUNFLGNBQUE7O29CQUFBO3NCQUFBO0FBQUE7QUFBQSxTQURGLEFBQ0UsQUFDQyxrQkFBQSxBQUFLLE1BQUwsQUFBVyxpQkFBWCxBQUE0QixxQkFBSyxBQUFDLDBDQUFRLE9BQVQsTUFBZSxRQUFmLEFBQXNCLFNBQVEsU0FBUyxLQUFBLEFBQUssTUFBNUMsQUFBa0Q7b0JBQWxEO3NCQUFqQyxBQUFpQztBQUFBO09BQUEsSUFGcEMsQUFFd0csQUFDckcsV0FMUCxBQUNFLEFBQ0UsQUFHRyxBQUFLLEFBSWI7Ozs7O0FBOUR1QixBLEFBaUUxQjs7a0JBQUEsQUFBZSIsImZpbGUiOiJpbmRleC5qcz9lbnRyeSIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9BNjcyMDQzL0RvY3VtZW50cy9iYy1kZW1vLXJlcG9zaXRvcnkvYmMtZGVtby13aXRoLXJlYWN0In0=