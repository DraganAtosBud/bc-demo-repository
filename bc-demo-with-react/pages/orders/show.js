import React, {Component} from 'react';
import {Card, Grid, Button, List, Form, Message, Input} from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import Layout from '../../components/Layout';
import Supply from '../../ethereum/supply';
import { Router } from '../../routes';

class SupplyShow extends Component {
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


    renderShippingInfoCards() {
      const shippingSteps = this.props.shippingInfo;
      let i = 0;
      const items = shippingSteps.map(step =>
        <List.Item key={i++}>
          <List.Content>
            <List.Header>{(new Date(step.timeStamp*1000)).toString()} - {step.company}</List.Header>
            <List.Description>{step.status}</List.Description>
          </List.Content>
        </List.Item>
      )
      return items;
    }

    state = {
      confirmStatusMessage: 'done',
      confirmLocation: 'my home',
      confirmErrorMessage: '',
      confirmDone: false,
      loading: false
    };
  
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
        Router.pushRoute('/orders/');
      } catch (err) {
        this.setState({ confirmErrorMessage: err.message, confirmDone: false });
      }
  
      this.setState({ loading: false });
    };
 
    
    renderConfirm() {
  
      const confirmContent = <Card.Content>
  
          <Form onSubmit={this.onConfirm} error={!!this.state.confirmErrorMessage} 
          loading={this.state.loading} success={this.state.confirmDone} >
          <Form.Field>
              <Input
                label="Status Message"
                labelPosition="right"
                value={this.state.confirmStatusMessage}
                placeholder='enter confirmation status message'
                onChange={event =>
                  this.setState({ confirmStatusMessage: event.target.value })}
              />
            </Form.Field>
            <Form.Field>
              <Input
                label="Location"
                labelPosition="right"
                value={this.state.confirmLocation}
                placeholder='enter location'
                onChange={event =>
                  this.setState({ confirmLocation: event.target.value })}
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
          </Card.Group>
        </Grid.Row>
        <Grid.Row>
          <h5>Shipping history</h5>
        </Grid.Row>
        <Grid.Row>
          <List bulleted>
          {this.renderShippingInfoCards()}
          </List>
        </Grid.Row>
        <Grid.Row>
          <h4>Receive package</h4>
        </Grid.Row>
        <Grid.Row>
          {this.renderConfirm()}
        </Grid.Row>
      </Grid>
    </Layout>);
  }
}

export default SupplyShow;
