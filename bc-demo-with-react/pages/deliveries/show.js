import React, {Component} from 'react';
import {Card, Grid, Button, List} from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import Layout from '../../components/Layout';
import ShippingList from '../../components/ShippingList';
import Supply from '../../ethereum/supply';

class SupplyShow extends Component {
  constructor(props){
    super(props);
    this.state = {
          errorMessage: '',
          loading: false,
          orderStatus : props.orderInfo.status,
          shippingStatus: props.shippingStatus,
          refreshShippingList: false
      };
  };

  static async getInitialProps(props) {
    const supply = Supply(props.query.address);
    const orderInfo = await supply.methods.getOrderInfo().call();
    const orderStatus = await supply.methods.getOrderStatus().call();
    const shippingStatus = await supply.methods.getShippingStatus().call();
    const info = {
      buyerName: orderInfo[0],
      sellerName: orderInfo[1],
      orderNo: orderInfo[2],
      orderDescription: orderInfo[3],
      orderPrice: orderInfo[4],
      status: orderStatus
    };
    return {address: props.query.address, shippingStatus: shippingStatus, orderInfo: info};
  }

  renderOrderInfoCards() {
    const {buyerName, sellerName, orderNo, orderDescription, orderPrice, status} = this.props.orderInfo;
    const items = [
      {
        header: this.state.orderStatus,
        meta: 'Order Status'
      }, {
        header: orderNo,
        meta: 'Order No.'
      }, {
        header: buyerName,
        meta: 'Buyer'
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
    const sellerName = this.props.orderInfo.sellerName;

    this.setState({ loading: true, errorMessage: '' });

    try {
     const accounts = await web3.eth.getAccounts();
     await supply.methods.startShipping(sellerName, "We are starting the shipping now!", "China")
     .send({
       from: accounts[0]
     });
     const orderStatus = await supply.methods.getOrderStatus().call();
     const shippingStatus = await supply.methods.getShippingStatus().call();

     this.setState({orderStatus: orderStatus, shippingStatus: shippingStatus});
     this.refreshShippingList();
   } catch (err) {
     this.setState({ errorMessage: err.message});
   } finally{
      this.setState({ loading: false });
   }
  };
  refreshShippingList() {
    this.setState({refreshShippingList: !this.state.refreshShippingList});
  };
  render() {

    const StartShippingButton = () => (
      <Button loading={this.state.loading} onClick={this.startShipping.bind(this)} primary >Start Shipping</Button>
    );
    let {steps, refreshShippingList} = this.state;
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
            <Card header={this.state.shippingStatus} meta='Shipping Status'/>
          </Card.Group>
        </Grid.Row>
        <Grid.Row>
          {this.state.shippingStatus == "Shipping Not Started" && <StartShippingButton />}
        </Grid.Row>
        <Grid.Row>
          <h5>Shipping History</h5>
        </Grid.Row>
        <Grid.Row>
          <ShippingList id={this.props.address} refresh={refreshShippingList} />
        </Grid.Row>
      </Grid>
    </Layout>);
  }
}

export default SupplyShow;
