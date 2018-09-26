import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';
import factory from '../../ethereum/factory';

class SupplyShow extends Component {

  static async getInitialProps() {
    const accounts = await web3.eth.getAccounts();
    const supplies = await factory.methods.getDeployedSupplyChains().call({from:accounts[0]});
    console.log(supplies);
    return { supplies };
    }

    renderOrders() {
      const items = this.props.supplies.map(address => {
      return {
        header: 'Order Address: ' + address,
        description: (
          <Link route={`/orders/${address}`}>
            <a>View Order</a>
          </Link>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>My orders</h3>


          {this.renderOrders()}
        </div>
      </Layout>
    );
  }

}

export default SupplyShow;
