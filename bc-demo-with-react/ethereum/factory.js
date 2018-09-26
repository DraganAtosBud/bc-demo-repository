import web3 from './web3';
import SupplyFactory from './build/SupplyChainFactory.json';

const instance  = new web3.eth.Contract(
  JSON.parse(SupplyFactory.interface),
  '0x452bF5Db22CF645CDdAc18396fE60428137627FA'
);

export default instance;
