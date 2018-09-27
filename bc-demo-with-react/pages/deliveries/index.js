import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';
import factory from '../../ethereum/factory';

class DeliveriesIndex extends Component {

  static async getInitialProps() {
    const accounts = await web3.eth.getAccounts();
    const supplies = await factory.methods.getDeployedSupplyChainsBySeller().call({from:accounts[0]});
    supplies.reverse();
    return { supplies };
    }

    renderOrders() {
      const items = this.props.supplies.map(address => {
      return {
        header: 'Order Address: ' + address,
        description: (
          <Link route={`/deliveries/${address}`}>
            <a>View Delivery</a>
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
          <h3>My Deliveries</h3>

          {this.renderOrders()}
        </div>
      </Layout>
    );
  }

}

export default DeliveriesIndex;
