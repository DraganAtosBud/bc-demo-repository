import web3 from './web3';
import SupplyFactory from './build/SupplyChainFactory.json';

const instance  = new web3.eth.Contract(
  JSON.parse(SupplyFactory.interface),
  '0x6A15979a6253e00dbF86de4acD154Ffc1323E106'
);

export default instance;
