import React, {Component} from 'react';
import {Card, Grid, Button, Form, Header, Icon, Input, Message} from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import Layout from '../../components/Layout';
import ShippingList from '../../components/ShippingList';
import Supply from '../../ethereum/supply';
import { Router } from '../../routes';

class SupplyShow extends Component {
  constructor(props){
    super(props);
    this.state = {
          errorMessage: '',
          loading: false,
          orderStatus : props.orderInfo.status,
          shippingStatus: props.shippingStatus,
          confirmStatusMessage: 'Package received',
          confirmLocation: 'Home',
          confirmErrorMessage: '',
          confirmDone: false,
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
        header: sellerName,
        meta: 'Seller'
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
    onConfirm = async (event) => {
      event.preventDefault();
      this.setState({ loading: true, confirmErrorMessage: '' });

      const mysupply = Supply(this.props.address);

      try {
        const accounts = await web3.eth.getAccounts();
        await mysupply.methods
          .confirmReceivedByBuyer(this.state.confirmStatusMessage, this.state.confirmLocation)
          .send({
            from: accounts[0]
          });

        this.setState({ confirmDone: true });
        const orderStatus = await mysupply.methods.getOrderStatus().call();
        const shippingStatus = await mysupply.methods.getShippingStatus().call();

        this.setState({orderStatus: orderStatus, shippingStatus: shippingStatus});
        await this.callShippingStepsContract(mysupply);
        this.refreshShippingList();

      } catch (err) {
        this.setState({ confirmErrorMessage: err.message, confirmDone: false });
      }
      finally{
         this.setState({ loading: false });
      }

    };


    renderConfirm() {

      const confirmContent = <Card.Content>

          <Form onSubmit={this.onConfirm} error={!!this.state.confirmErrorMessage}
          loading={this.state.loading} success={this.state.confirmDone} >
          <Form.Field>
            <Input
              label="Package Received At"
              labelPosition="left"
              placeholder='Location'
              value={this.state.confirmLocation}
              onChange={event =>
                this.setState({ confirmLocation: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
              <Input
                label="Confirmation Message"
                labelPosition="left"
                value={this.state.confirmStatusMessage}
                placeholder='Confirmation Message'
                onChange={event =>
                  this.setState({ confirmStatusMessage: event.target.value })}
              />
            </Form.Field>
            <Message error header="Oops!" content={this.state.confirmErrorMessage} />
            <Message success header='Confirmed' content="Package received" />
            <Button icon='check' primary type='submit' >
              Confirm
            </Button>
          </Form>
      </Card.Content>;
      return <Card fluid>{confirmContent}</Card>;
    }

  refreshShippingList() {
    this.setState({refreshShippingList: !this.state.refreshShippingList});
  };

  render() {
    let {steps, refreshShippingList} = this.state;
    refreshShippingList = !refreshShippingList;
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
          <h5>Shipping History</h5>
        </Grid.Row>
        <Grid.Row>
          <ShippingList id={this.props.address} refresh={refreshShippingList} />
        </Grid.Row>
        {this.state.orderStatus == 'Shipping In Progress' && (<Grid.Row>
            <h4>Receive package</h4>
          {this.renderConfirm()}
        </Grid.Row>)}
      </Grid>
    </Layout>);
  }
}

export default SupplyShow;
