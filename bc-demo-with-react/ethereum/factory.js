import web3 from './web3';
import SupplyFactory from './build/SupplyChainFactory.json';

const instance  = new web3.eth.Contract(
  JSON.parse(SupplyFactory.interface),
  '0xa65afe5826579E9D2CE9024cB422618aFcD0D87D'
);

export default instance;
