import React, {Component} from 'react';
import {Card, Grid, Button} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import {Link} from '../../routes';
import factory from '../../ethereum/factory';
import Supply from '../../ethereum/supply';

class OrderAll extends Component {

  static async getInitialProps() {
    const supplies = await factory.methods.getDeployedSupplyChains().call();
    const inProgress = [];
    for (var i = 0; i < supplies.length; i++) {
      const supply = Supply(supplies[i]);
      const status = await supply.methods.getOrderStatus().call();
      if (status === 'Shipping In Progress') {
        inProgress.push(supplies[i]);
      }
    }
    return {inProgress};
  }
  renderOrders() {
    const items = this.props.inProgress.map(address => {
      return {
        header: 'Order Address: ' + address,
        description: (<Link route={`/shipping/${address}`}>
          <a>Update shipping</a>
        </Link>),
        fluid: true
      };
    });

    return <Card.Group items={items}/>;
  }

  render() {
    return (<Layout>
      <div>
        <h3>Orders in progress</h3>

        {this.renderOrders()}
      </div>
    </Layout>);
  }

}

export default OrderAll;
