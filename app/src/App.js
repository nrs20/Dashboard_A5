import React, { Component } from 'react';
import './App.css';
import Child1 from './child1';
import Child2 from './child2';
import Child3 from './child3';
import * as d3 from 'd3';
import tips from './tips.csv';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedDropdownValue: 'tip'
    };
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  componentDidMount() {
    var self = this;
    d3.csv(tips, function (d) {
      return {
        tip: parseFloat(d.tip),
        total_bill: parseFloat(d.total_bill),
        size: parseInt(d.size),
        sex: d.sex,
        smoker: d.smoker,
        day: d.day,
        time: d.time
      };
    })
      .then(function (csv_data) {
        self.setState({ data: csv_data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // Function to store selected target in row 1 dropdown menu
  handleDropdownChange(event) {
    const newDropdownValue = event.target.value;
    this.setState({ selectedDropdownValue: newDropdownValue });
  }

  // Function to update returnArray in the state
  updateReturnArray = (newReturnArray) => {
    this.setState({ returnArray: newReturnArray });
  };


  render() {
    const {data} = this.state; 

    return (
      <div className='parent'>
        <div className='row1'>
          <div className='dropdown'>
            Select Target: 
            <select value={this.state.selectedDropdownValue} onChange={this.handleDropdownChange}>
              <option value='tip'>Tip</option>
              <option value='total_bill'>Total Bill</option>
              <option value='size'>Size</option>
              {console.log("Selected Target Updated: ", this.state.selectedDropdownValue)}
            </select>
          </div>
        </div>

        <div className='row2'>
          <div className='child1'>
            <Child1 data1={data} selectedTarget={this.state.selectedDropdownValue}/>
          </div>
          <div className='child2'>
            {/* Pass updateReturnArray as prop to Child2 */}
            <Child2 data2={data} updateReturnArray={this.updateReturnArray} />
          </div>
        </div>

        <div className='row3'>
          <div className='child3'>
            {/* Pass returnArray as prop to Child3 */}
            <Child3 data3={data} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
