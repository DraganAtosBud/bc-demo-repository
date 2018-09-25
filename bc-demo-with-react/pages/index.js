import React, { Component } from 'react';
import { Card, Button, Message } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';
import Layout from '../components/Layout';

class SupplyIndex extends Component{
  state = {
      errorMessage: '',
      loading: false
    };

  buyProduct = async (product, event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
     const accounts = await web3.eth.getAccounts();
     await factory.methods
       .createSupplyChain('Adam', product.name, web3.utils.toWei(product.price))
       .send({
         from: accounts[0], value: web3.utils.toWei(product.price)
       });
     Router.pushRoute('/');
   } catch (err) {
     this.setState({ errorMessage: err.message});
   }

   this.setState({ loading: false });
  };

  renderProducts(){
    //TODO: Add seller address here, to send it to the contract

    const items =
    [
      {name: 'Product 1', price:'0.1', sellerName:'Seller 1'},
      {name: 'Product 2', price:'0.05', sellerName:'Seller 1'},
      {name: 'Product 3', price:'0.01', sellerName:'Seller 2'}]
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
          {this.state.errorMessage !== '' ? <Message error header="Oops!" content={this.state.errorMessage} /> :null}
          {this.renderProducts()}
        </div>
      </Layout>
    );
  }
}

export default SupplyIndex;
