import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import Layout from '../../components/Layout';
import Supply from '../../ethereum/supply';

class SupplyShow extends Component{
  static async getInitialProps(props){
      const supply = Supply(props.query.address);
      const orderInfo = await supply.methods.getOrderInfo().call();
      const orderStatus = await supply.methods.getOrderStatus().call();
      const shippingStatus = await supply.methods.getShippingStatus().call();
      const info = {
      buyerName: orderInfo[0],
      orderNo: orderInfo[2],
      orderDescription : orderInfo[3],
      orderPrice : orderInfo[4],
      status : orderStatus
        };
      return {
        address: props.query.address,
        shippingStatus: shippingStatus,
        orderInfo : info
    };
  }

  renderOrderInfoCards(){
    const{
      buyerName,
      orderNo,
      orderDescription,
      orderPrice,
      status
    } = this.props.orderInfo;

    const items =[
      {
        header: status,
        meta: 'Status'
      },
      {
        header: orderNo,
        meta: 'Order No.'
      },
      {
        header: buyerName,
        meta: 'Buyer name'
      },
      {
        header: orderDescription,
        meta: 'Description'
      },
      {
        header: web3.utils.fromWei(orderPrice, 'ether') + ' eth',
        meta: 'Price'
      }
    ];

    return <Card.Group items={items}/>;
  }

  renderShippingInfoCards(){

  }

  render(){
    return(
      <Layout>
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
        </Grid>
      </Layout>
    );
  }
}

export default SupplyShow;
