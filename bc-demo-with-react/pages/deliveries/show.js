import React, {Component} from 'react';
import {Card, Grid, Button, List} from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import Layout from '../../components/Layout';
import Supply from '../../ethereum/supply';

class SupplyShow extends Component {

  state = {
      errorMessage: '',
      loading: false
    };

  static async getInitialProps(props) {
    const supply = Supply(props.query.address);
    const orderInfo = await supply.methods.getOrderInfo().call();
    const orderStatus = await supply.methods.getOrderStatus().call();
    const shippingStatus = await supply.methods.getShippingStatus().call();
    const shippingStepsCount = await supply.methods.getShippingEntitiesCount().call();
    const shippingSteps = [];
    for (var i = 0; i < shippingStepsCount; i++) {
      const step = await supply.methods.getShippingStep(i).call();
      shippingSteps.push({shippingNo: step[0], company: step[1], location: step[3], timeStamp: step[4], status: step[5]});
    }
    const info = {
      buyerName: orderInfo[0],
      orderNo: orderInfo[2],
      orderDescription: orderInfo[3],
      orderPrice: orderInfo[4],
      status: orderStatus
    };
    return {address: props.query.address, shippingStatus: shippingStatus, orderInfo: info, shippingInfo: shippingSteps};
  }

  renderOrderInfoCards() {
    const {buyerName, orderNo, orderDescription, orderPrice, status} = this.props.orderInfo;

    const items = [
      {
        header: status,
        meta: 'Status'
      }, {
        header: orderNo,
        meta: 'Order No.'
      }, {
        header: buyerName,
        meta: 'Buyer name'
      }, {
        header: orderDescription,
        meta: 'Description'
      }, {
        header: web3.utils.fromWei(orderPrice, 'ether') + ' eth',
        meta: 'Price'
      }
    ];

    return <Card.Group items={items}/>;
  }

  startShipping = async (event) => {
    event.preventDefault();
    const supply = Supply(this.props.address);

    this.setState({ loading: true, errorMessage: '' });

    try {
     const accounts = await web3.eth.getAccounts();
     await supply.methods.startShipping('My Company', accounts[0], "We start the shipping now!", "China")
     .send({
       from: accounts[0]
     });

   } catch (err) {
     this.setState({ errorMessage: err.message});
   }

   this.setState({ loading: false });
  };

  renderShippingInfoCards() {
    const shippingSteps = this.props.shippingInfo;
    const items = shippingSteps.map(step => {
      return {
        header: step.company + ' ' + step.timeStamp,
        description: step.statusMessage
      };
    })

    return <List items={items}/>;
  }

  render() {
    return (<Layout>
      <h3>Order {this.props.address}</h3>
      <Grid>
        <Grid.Row>
          <h4>Order Information</h4>
        </Grid.Row>
        <Grid.Row>
          {this.renderOrderInfoCards()}
        </Grid.Row>
        <Grid.Row>
          <h4>Shipping Information</h4>
        </Grid.Row>
        <Grid.Row>
          <Card.Group>
            <Card header={this.props.shippingStatus} meta='Shipping status'/>
            <Button loading={this.state.loading} onClick={this.startShipping.bind(this)} primary >Start Shipping</Button>
          </Card.Group>
        </Grid.Row>
        <Grid.Row>
          {this.renderShippingInfoCards()}
        </Grid.Row>
      </Grid>
    </Layout>);
  }
}

export default SupplyShow;
