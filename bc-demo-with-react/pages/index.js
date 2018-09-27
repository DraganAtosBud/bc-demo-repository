import React, { Component } from 'react';
import { Card, Button, Message, Input, Label } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';
import Layout from '../components/Layout';
import { Router } from '../routes';

class SupplyIndex extends Component{


  state = {
      errorMessage: '',
      loading: false,
      buyerName: 'Adam'
    };

  buyProduct = async (product, event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
     const accounts = await web3.eth.getAccounts();
     await factory.methods
       .createSupplyChain(this.state.buyerName, product.name, web3.utils.toWei(product.price), product.seller, product.sellerName)
       .send({
         from: accounts[0], value: web3.utils.toWei(product.price)
       });
   } catch (err) {
     this.setState({ errorMessage: err.message});
   }

   this.setState({ loading: false });
  };

  renderProducts(){
    //TODO: Add seller address here, to send it to the contract

    const items =
    [
      {name: 'Product 1', price:'0.1', sellerName:'Adam Seller 1', seller:'0x2822a11b98462eb6aeaaeebd59b1656969bf147b'},
      {name: 'Product 2', price:'0.05', sellerName:'Adam Seller 1', seller:'0x2822a11b98462eb6aeaaeebd59b1656969bf147b'},
      {name: 'Product 3', price:'0.01', sellerName:'Adam Seller 2', seller:'0x690a4f7a854ccfb3e83abbdb5a19e16413e96c55'},
      {name: 'Product 4', price:'0.02', sellerName:'Dragan Seller 1', seller:'0x486B0764390E78d90d6e269c9C9531f14365fE6F'},
      {name: 'Product 5', price:'0.03', sellerName:'Dragan Seller 2', seller:'0xFaC38D0bF10382349F43db4fDee5A51e462aA53e'},
      {name: 'Product 6', price:'0.0001', sellerName:'Misi Seller 1', seller:'0x39eccc43958d89175b0b636129523d8af469977c'}
    ]
    .map(p=>{
      return{
        header: p.name,
        description: (
          <div>
            <p>Price: {p.price} eth</p>
            <p>Seller: {p.sellerName}</p>
            <Button loading={this.state.loading} onClick={this.buyProduct.bind(this, p)} primary >Buy</Button>
          </div>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items}/>;
  }
  render(){
    return(
      <Layout>
        <div>
          <h3>Products</h3>
          <Input label='Your name' value={this.state.buyerName} style={{ marginBottom: 10 }} onChange={event => this.setState({buyerName: event.target.value})}/>
          {this.state.errorMessage !== '' ? <Message error header="Oops!" content={this.state.errorMessage} /> :null}
          {this.renderProducts()}
        </div>
      </Layout>
    );
  }
}

export default SupplyIndex;
