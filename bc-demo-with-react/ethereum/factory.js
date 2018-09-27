import web3 from './web3';
import SupplyFactory from './build/SupplyChainFactory.json';

const instance  = new web3.eth.Contract(
  JSON.parse(SupplyFactory.interface),
  '0xE228DF0064904f4d1E937071831f4cc8F4c86331'
);

export default instance;
