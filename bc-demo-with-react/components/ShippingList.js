import React, {Component} from 'react';
import { List } from 'semantic-ui-react';
import Supply from '../ethereum/supply';

class ShippingList extends Component{
  state = {
    steps:[]
  }

  async componentDidMount() {
    await this.fetchSteps(this.props.id)
        .then(this.refreshShippingList)
  }
  async fetchSteps(address){

    const supply = Supply(address);
   return await this.callShippingStepsContract(supply);
  }


    createShippingListItems(shippingSteps) {
      let i = 0;
      const items = shippingSteps.map(step => {return {header: (new Date(step.timeStamp * 1000)).toUTCString() + ' - ' + step.company,
        key: i++,
        description: 'Location: ' + step.location + ', Message: ' + step.status}});
      return items;
    };

    async callShippingStepsContract(supply){
      const shippingStepsCount = await supply.methods.getShippingEntitiesCount().call();
      const shippingSteps = [];
      for (var i = shippingStepsCount -1; i >=0; i--) {
        const step = await supply.methods.getShippingStep(i).call();
        shippingSteps.push({shippingNo: step[0], company: step[1], location: step[3], timeStamp: step[4], status: step[5]});
      }
       return this.createShippingListItems(shippingSteps);
    };

  async componentWillReceiveProps(props) {
  const { refresh, id } = this.props;
  if (props.refresh !== refresh) {
    await this.fetchSteps(this.props.id)
        .then(this.refreshShippingList);
  }
}

  refreshShippingList = res => this.setState({ steps: res })

  render() {
    let {steps} = this.state;
    return(
      <List bulleted items={steps}/>
    );
  }
};

export default ShippingList;
