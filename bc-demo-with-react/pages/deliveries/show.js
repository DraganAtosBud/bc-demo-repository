import React, {Component} from 'react';
import {Card, Grid, Button, Header, Icon, Input, Message} from 'semantic-ui-react';
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
          refreshShippingList: false,
          location: '',
          message: 'We are starting the shipping now!'
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
     await supply.methods.startShipping(sellerName, this.state.message, this.state.location)
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

  renderShippingButton(){
    return(
    <div>
      <Input labelPosition='left' label='Shipping from' placeholder='Location' style={{marginRight: '10px'}} onChange={event => this.setState({ location: event.target.value })} />
      <Input labelPosition='left' label='Info from Seller' placeholder='Message' style={{marginRight: '10px'}} onChange={event => this.setState({ message: event.target.value })} />
      <Button loading={this.state.loading} disabled={!this.state.location} onClick={this.startShipping.bind(this)} primary >Start Shipping</Button>
      {this.state.errorMessage !== '' ? <Message error header="Oops!" content={this.state.errorMessage} /> :null}
    </div>);
  };

  render() {
    let {steps, refreshShippingList} = this.state;
    return (<Layout>
      <h3>Order {this.props.address}</h3>
      <Grid>
        <Grid.Row>
        <Header as='h4' block>
          <Icon name='archive'/>
          <Header.Content>Order Information</Header.Content>
        </Header>
        </Grid.Row>
        <Grid.Row>
          {this.renderOrderInfoCards()}
        </Grid.Row>
        <Grid.Row>
          <Header as='h4' block>
            <Icon name='truck'/>
            <Header.Content>Shipping Information</Header.Content>
          </Header>
        </Grid.Row>
        <Grid.Row>
          <Card.Group>
            <Card header={this.state.shippingStatus} meta='Shipping Status'/>
          </Card.Group>
        </Grid.Row>
        <Grid.Row>
          {this.state.shippingStatus == "Shipping Not Started" && this.renderShippingButton()}
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
