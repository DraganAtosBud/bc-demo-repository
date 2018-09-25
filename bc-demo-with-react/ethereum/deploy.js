const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledSupply = require('./build/SupplyChainFactory.json');

const provider = new HDWalletProvider(
  'nut double run puppy rich pipe few steak pepper empower kid supreme',
  'https://rinkeby.infura.io/v3/c7d1c8b414004f8682c3e7d126ab8441'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledSupply.interface)
  )
    .deploy({ data: compiledSupply.bytecode })
    .send({ gas: '3000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};
deploy();
