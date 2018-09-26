import web3 from './web3';
import SupplyFactory from './build/SupplyChainFactory.json';

const instance  = new web3.eth.Contract(
  JSON.parse(SupplyFactory.interface),
  '0xECcCb82CBfC289Fc43C4421F4FaBC46B554F17f4'
);

export default instance;
