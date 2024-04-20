import React,{Component} from 'react';
import './App.css';
import Child1 from './child1';
import Child2 from './child2';
import Child3 from './child3';
import * as d3 from 'd3';
import tips from './tips.csv';

class App extends Component{
  constructor(props){
    super(props);
    this.state = {data:[]};
  }
  componentDidMount(){
    var self= this;
    d3.csv(tips, function(d){
      return {
        tip: parseFloat(d.tip),
        total_bill: parseFloat(d.total_bill),
        size: parseInt(d.size),
        sex: d.sex,
        smoker: d.smoker,
        day: d.day,
        time: d.time
      }
    }).then(function(csv_data){
      self.setState({data:(csv_data)});
      // console.log(csv_data)
    })
    .catch(function(error){
      console.log(error)
    })
  }
  render(){
    return <div className='parent'>

        <div className='row1'>
          <div className='dropdown'>
            Select Target: 
            <select>
              <option value='tip'>Tip</option>
              <option value='total_bill'>Total Bill</option>
              <option value='size'>Size</option>
            </select>
          </div>
          
        </div>

        <div className='row2'>
          <div className='child1'>
            <Child1 data1={this.state.data} />
          </div>
          <div className='child2'>
            <Child2 data2={this.state.data}/>
          </div>
        </div>

        <div className='row3'>
          <div className='child3'>
            <Child3 data3={this.state.data}/>
          </div>
        </div>
      </div>
  }
}
export default App;