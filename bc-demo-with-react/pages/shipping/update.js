import React, {Component} from 'react';
import {Card, Grid, Button, List} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import {Link} from '../../routes';
import factory from '../../ethereum/factory';
import Supply from '../../ethereum/supply';

class OrderUpdate extends Component {
  static async getInitialProps(props) {
    const supply = Supply(props.query.address);;
    const shippingStatus = await supply.methods.getShippingStatus().call();
    const shippingStepsCount = await supply.methods.getShippingEntitiesCount().call();
    const shippingSteps = [];
    for (var i = 0; i < shippingStepsCount; i++) {
      const step = await supply.methods.getShippingStep(i).call();
      shippingSteps.push({shippingNo: step[0], company: step[1], location: step[3], timeStamp: step[4], status: step[5]});
    }
    return {address: props.query.address, shippingStatus: shippingStatus, shippingInfo: shippingSteps};
  }

    renderShippingInfoList() {

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

  render(){
    return (<Layout>
      <h3>Update shipping for order {this.props.address}</h3>
      <div>
        <List bulleted>
        {this.renderShippingInfoList()}
        </List>
      </div>
    </Layout>);
  }
}

export default OrderUpdate;
