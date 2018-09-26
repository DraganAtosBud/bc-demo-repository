import web3 from './web3';
import SupplyFactory from './build/SupplyChainFactory.json';

const instance  = new web3.eth.Contract(
  JSON.parse(SupplyFactory.interface),
  '0x8EFe2e7Dbb637f46A01960ff9Be436A7B8C80f2D'
);

export default instance;
