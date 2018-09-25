import web3 from './web3';
import SupplyChain from './build/SupplyChain.json';

export default address => {
  return new web3.eth.Contract(JSON.parse(SupplyChain.interface), address);
};
