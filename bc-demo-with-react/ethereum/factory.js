import web3 from './web3';
import SupplyFactory from './build/SupplyChainFactory.json';

const instance  = new web3.eth.Contract(
  JSON.parse(SupplyFactory.interface),
  '0x07d8504d09a98eAA1a6470f476c386244eE2F353'
);

export default instance;
