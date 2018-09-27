import React, {Component} from 'react';
import {Button, List, Form, Input, Message, Label} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import {Link} from '../../routes';
import factory from '../../ethereum/factory';
import Supply from '../../ethereum/supply';

class OrderUpdate extends Component {
  state = {
    errorMessage: '',
    loading: false,
    company: '',
    location: '',
    status: ''
  };
  static async getInitialProps(props) {
    const supply = Supply(props.query.address);
    const shippingStatus = await supply.methods.getShippingStatus().call();
    const shippingStepsCount = await supply.methods.getShippingEntitiesCount().call();
    const shippingSteps = [];
    for (var i = 0; i < shippingStepsCount; i++) {
      const step = await supply.methods.getShippingStep(i).call();
      shippingSteps.push({shippingNo: step[0], company: step[1], location: step[3], timeStamp: step[4], status: step[5]});
    }
    return {address: props.query.address, shippingStatus: shippingStatus, shippingInfo: shippingSteps};
  };

  renderShippingInfoList() {

    const shippingSteps = this.props.shippingInfo;
    let i = 0;
    const items = shippingSteps.map(step => <List.Item key={i++}>
      <List.Content>
        <List.Header>{(new Date(step.timeStamp * 1000)).toString()}
          - {step.company}</List.Header>
        <List.Description>{step.status}</List.Description>
      </List.Content>
    </List.Item>)
    return items;
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({loading: true, errorMessage: ''});
    try {
      const accounts = await web3.eth.getAccounts();
      const supply = Supply(this.props.address);

      await supply.methods.updateShipping(this.state.company, this.state.status, this.state.location, 'OK').send({from: accounts[0]});
    } catch (e) {
      this.setState({errorMessage: e.message});
    }
    finally
    {
      this.setState({ loading: false });
    }
  };
  render() {
    return (<Layout>
      <h3>Update shipping for order {this.props.address}</h3>
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} style={{ marginBottom: 10 }}>
        <Form.Field>
          <Label>Your company's name</Label>
          <Input onChange={event => this.setState({company: event.target.value})}/>
        </Form.Field>
        <Form.Field>
          <Label>Status message of the update</Label>
          <Input onChange={event => this.setState({status: event.target.value})}/>
        </Form.Field>
        <Form.Field>
          <Label>Package's current location</Label>
          <Input onChange={event => this.setState({location: event.target.value})}/>
        </Form.Field>
        <Message error="error" header="Oops!" content={this.state.errorMessage}/>
        <Button loading={this.state.loading} primary="primary" disabled={!this.state.company || !this.state.status || !this.state.location}>
          Submit
        </Button>
      </Form>
      <div>
        <h3>Shipping history</h3>
        <List bulleted="bulleted">
          {this.renderShippingInfoList()}
        </List>
      </div>
    </Layout>);
  };
}

export default OrderUpdate;
