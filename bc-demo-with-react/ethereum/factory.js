import web3 from './web3';
import SupplyFactory from './build/SupplyChainFactory.json';

const instance  = new web3.eth.Contract(
  JSON.parse(SupplyFactory.interface),
  '0xc290E324E194376b57Bb99E54FF71E7FDD1d6C35'
);

export default instance;
