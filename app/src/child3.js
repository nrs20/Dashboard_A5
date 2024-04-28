import React,{Component} from 'react';
import * as d3 from 'd3';

class Child3 extends Component{
  constructor(props){
    super(props);
    this.state = {};
  }
  componentDidMount(){
    console.log(this.props.data3);
  }
  componentDidUpdate(){
    var data = this.props.data3;

    var margin = { top: 10, right: 10, bottom: 30, left: 20 },
      w = 500 - margin.left - margin.right,
      h= 300 - margin.top - margin.bottom;

      //this is the svg element that will contain the chart
    var container = d3.select('.child3_svg')
      .attr('width', w + margin.left + margin.right)
      .attr('height', h + margin.top + margin.bottom)
      .select(".g_3")
      .attr("transform", `translate( ${margin.left}, ${margin.top})`);

    // X axis
    var x_data= data.map(item=>item.total_bill);

    const x_scale = d3.scaleLinear()
    // domain is the range of the input data (x-axis data)
      .domain([5, d3.max(x_data)])
      // range is the range of the output data
      .range([margin.left, w]);
    container.selectAll(".x_axis_g").data([0]).join("g").attr("class", "x_axis_g")  
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom(x_scale));

    // Add Y axis
    var y_data= data.map(item=>item.tip);

    const y_scale = d3.scaleLinear()
      .domain([0, d3.max(y_data)])
      .range([h, margin.top]);
    container.selectAll(".y_axis_g").data([0]).join("g").attr("class", "y_axis_g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y_scale));

    container.selectAll(".circle")
      .data(data)
      .join("circle")
      .attr("cx", function(d) { 
        return x_scale(d.total_bill); 
      })
      .attr("cy", function(d) { 
        return y_scale(d.tip); 
      })
      .attr("r", 3)
      .style("fill", "#69b3a2");
  }

  render(){
    return <svg className='child3_svg'>
      <g className='g_3'></g>  
    </svg>
  }
}
export default Child3;