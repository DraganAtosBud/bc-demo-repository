import React, {Component} from 'react';
import {Button, Form, Input, Message, Label} from 'semantic-ui-react';
import ShippingList from '../../components/ShippingList';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import {Link} from '../../routes';
import factory from '../../ethereum/factory';
import Supply from '../../ethereum/supply';

class OrderUpdate extends Component {
  constructor(props){
    super(props);
    this.state = {
      errorMessage: '',
      loading: false,
      company: '',
      location: '',
      status: '',
      refreshShippingList: false
  }
}

  static async getInitialProps(props) {
    const supply = Supply(props.query.address);
    const shippingStatus = await supply.methods.getShippingStatus().call();

    return {address: props.query.address, shippingStatus: shippingStatus};
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({loading: true, errorMessage: ''});
    try {
      const accounts = await web3.eth.getAccounts();
      const supply = Supply(this.props.address);

      await supply.methods.updateShipping(this.state.company, this.state.status, this.state.location, 'OK').send({from: accounts[0]});
      this.refreshShippingList();
    } catch (e) {
      this.setState({errorMessage: e.message});
    }
    finally
    {
      this.setState({ loading: false });
    }
  };

    refreshShippingList() {
      this.setState({refreshShippingList: !this.state.refreshShippingList});
    };

  render() {
    let {steps, refreshShippingList} = this.state;
    return (<Layout>
      <h3>Update shipping for order {this.props.address}</h3>
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} style={{ marginBottom: 10 }}>
        <Form.Field>
          <Label>Shipping company</Label>
          <Input onChange={event => this.setState({company: event.target.value})}/>
        </Form.Field>
        <Form.Field>
          <Label>Status message of the update</Label>
          <Input onChange={event => this.setState({status: event.target.value})}/>
        </Form.Field>
        <Form.Field>
          <Label>Current location of the package</Label>
          <Input onChange={event => this.setState({location: event.target.value})}/>
        </Form.Field>
        <Message error="error" header="Oops!" content={this.state.errorMessage}/>
        <Button loading={this.state.loading} primary="primary" disabled={!this.state.company || !this.state.status || !this.state.location}>
          Submit
        </Button>
      </Form>
      <div>
        <h3>Shipping history</h3>
          <ShippingList id={this.props.address} refresh={refreshShippingList} />
      </div>
    </Layout>);
  };
}

export default OrderUpdate;
