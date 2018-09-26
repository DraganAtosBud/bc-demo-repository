const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/SupplyChainFactory.json');
const compiledSupplyChain = require('../ethereum/build/SupplyChain.json');

let accounts;
let factory;
let supplychainAddress;
let supplychain;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '3000000' });

  factory.setProvider(provider);

  await factory.methods.createSupplyChain('Default BuyerName','Default orderDescription','100').send({
    from: accounts[0],
    gas: '3000000'
  });

  [supplychainAddress] = await factory.methods.getDeployedSupplyChains().call();
  supplychain = await new web3.eth.Contract(
    JSON.parse(compiledSupplyChain.interface),
    supplychainAddress
  );
});

describe('SupplyChains', () => {
  it('Deploys a factory and a supplychain', () => {
    assert.ok(factory.options.address);
    assert.ok(supplychain.options.address);
  });

  it('Get order status', async () => {
    const orderStatus = await supplychain.methods.getOrderStatus().call();
    assert.equal(orderStatus, 'Placed');
  });

  it('Order can be rejected', async () => {
    await supplychain.methods.rejectOrder('Please reject...').send({
                    value: '200',
                    from: accounts[0]
                  });
    const orderStatus = await supplychain.methods.getOrderStatus().call();
    assert.equal(orderStatus, 'Rejected');
  });

  it('Shipping can be started', async () => {
    await supplychain.methods.startShipping('Shipping company', accounts[1].address, 'New status message', 'New location').send({
                    from: accounts[0],
                    gas: '3000000'
                  });
    const orderStatus = await supplychain.methods.getOrderStatus().call();
    assert.equal(orderStatus, 'Shipping In Progress');

    const shippingStatus = await supplychain.methods.getShippingStatus().call();
    assert.equal(shippingStatus, 'In Progress');
  });

  it('Shipping can be updated', async () => {

    await supplychain.methods.startShipping('Shipping company', accounts[1].address, 'New status message', 'New location').send({
        from: accounts[0],
        gas: '3000000'
      });

    await supplychain.methods.updateShipping('Shipping company 2', accounts[1].address, 'New status message 2', 'New location 2', 'New package status 2')
            .send({
                    from: accounts[0],
                    gas: '3000000'
                  });

    const orderStatus = await supplychain.methods.getOrderStatus().call();
    assert.equal(orderStatus, 'Shipping In Progress');

    const shippingStatus = await supplychain.methods.getShippingStatus().call();
    assert.equal(shippingStatus, 'In Progress');
  });

  it('Shipping cannot be updated, if not started', async () => {
    try{
        await supplychain.methods.updateShipping('Shipping company 2', accounts[1].address, 'New status message 2', 'New location 2', 'New package status 2')
                .send({
                        from: accounts[0],
                        gas: '3000000'
                    });
        assert(false);
    } catch (err) {
        assert(err);
    }
  });

  it('Package can be received', async () => {

    await supplychain.methods.startShipping('Shipping company', accounts[1].address, 'New status message', 'New location').send({
        from: accounts[0],
        gas: '3000000'
      });

    await supplychain.methods.updateShipping('Shipping company 2', accounts[1].address, 'New status message 2', 'New location 2', 'New package status 2')
            .send({
                    from: accounts[0],
                    gas: '3000000'
                  });
    await supplychain.methods.confirmReceivedByBuyer('New status message 3', 'New location 3')
    .send({
            from: accounts[0],
            gas: '3000000'
        });

    const orderStatus = await supplychain.methods.getOrderStatus().call();
    assert.equal(orderStatus, 'Shipping Finished');

    const shippingStatus = await supplychain.methods.getShippingStatus().call();
    assert.equal(shippingStatus, 'Confirmed Successfull');
  });

it('Get Order Info', async () => {

    await ShippingChain();

    const orderInfo = await supplychain.methods.getOrderInfo().call();
    assert.equal(orderInfo[0], 'Default BuyerName');  // see beforeEach
    assert.equal(orderInfo[2], '123456789'); // see Supply chain contract
    assert.equal(orderInfo[3], 'Default orderDescription'); // see beforeEach
    assert.equal(orderInfo[4], '100'); // see beforeEach
  });

it('Get Shipping Entities Count', async () => {

    await ShippingChain();

    const shippingEntitiesCount = await supplychain.methods.getShippingEntitiesCount().call();
    assert.equal(shippingEntitiesCount, '3');
  });

  it('Get Current Holder', async () => {

    await ShippingChain();

    const currentHolder = await supplychain.methods.getCurrentHolder().call();
    assert.equal(currentHolder, 'Shipping company 3');
  });

  it('Order can be closed', async () => {

    await ShippingChain();

    await supplychain.methods.closeOrder().send({
        from: accounts[0],
        gas: '3000000'
      });

    const orderStatus = await supplychain.methods.getOrderStatus().call();
    assert.equal(orderStatus, 'Closed');
  });

  it('Get specific Shipping Entity', async () => {

    await ShippingChain();

    const shippingEntity = await supplychain.methods.getShippingEntity(1).call();
    assert.equal(shippingEntity, 'Shipping company 2');
  });

});

async function ShippingChain()
{
    await supplychain.methods.startShipping('Shipping company', accounts[1].address, 'New status message', 'New location').send({
        from: accounts[0],
        gas: '3000000'
      });

    await supplychain.methods.updateShipping('Shipping company 2', accounts[2].address, 'New status message 2', 'New location 2', 'New package status 2')
            .send({
                    from: accounts[0],
                    gas: '3000000'
                  });
    await supplychain.methods.updateShipping('Shipping company 3', accounts[3].address, 'New status message 3', 'New location 3', 'New package status 3')
    .send({
            from: accounts[0],
            gas: '3000000'
        });

}
