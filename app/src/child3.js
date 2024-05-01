import React,{Component} from 'react';
import * as d3 from 'd3';

class Child3 extends Component{
  constructor(props){
    super(props);
    this.state = {};
  }
  componentDidMount(){
    console.log('child3 mounted');
  }
  componentDidUpdate(){
    console.log('child3 updated');
    console.log(this.props.data3);
    console.log(this.props.target);

    // clear the svg element before drawing the new chart
    d3.select('.g_3').selectAll("*").remove();

    var data = this.props.data3;
    var target1 = this.props.target[0];
    var target2 = this.props.target[1];
    var margin = { top: 10, right: 10, bottom: 30, left: 20 },
      w = 1400 - margin.left - margin.right,
      h= 350 - margin.top - margin.bottom;

    //this is the svg element that will contain the chart
    var container = d3.select('.child3_svg')
      .attr('width', w + margin.left + margin.right +10)
      .attr('height', h + margin.top + margin.bottom +10)
      .select(".g_3")
      .attr("transform", `translate( ${margin.left}, ${margin.top})`);

    // X axis
    // var x_data= data.map(item=>item.tip);
    var x_data;
    if(target1 === 'tip'){
      x_data = data.map(item=>item.tip);
    }
    else if(target1 === 'size'){
      x_data = data.map(item=>item.size);
    }
    else if(target1 === 'total_bill'){
      x_data = data.map(item=>item.total_bill);
    }

    const x_scale = d3.scaleLinear()
    // domain is the range of the input data (x-axis data)
      .domain([0, d3.max(x_data)])
      // range is the range of the output data
      .range([margin.left, w]);
    container.selectAll(".x_axis_g").data([0]).join("g").attr("class", "x_axis_g")  
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom(x_scale) .tickValues(d3.range(x_scale.domain()[0], x_scale.domain()[1] + 10, 10)));

    // Add Y axis
    // var y_data= data.map(item=>item.tip);
    var y_data;
    if(target2 === 'tip'){
      y_data = data.map(item=>item.tip);
    }
    else if(target2 === 'size'){
      y_data = data.map(item=>item.size);
    }
    else if(target2 === 'total_bill'){
      y_data = data.map(item=>item.total_bill);
    }


    const y_scale = d3.scaleLinear()
      .domain([0, d3.max(y_data)])
      .range([h, margin.top]);
    container.selectAll(".y_axis_g").data([0]).join("g").attr("class", "y_axis_g")
      .attr("transform", `translate(${margin.left}, 0)`)
      //change y axis labels  to increments of 5
      
      .call(d3.axisLeft(y_scale)
      .tickValues(d3.range(y_scale.domain()[0], y_scale.domain()[1] + 2, 2))); // Set tick values to increments of 5
      // add axis name
    container.selectAll(".x_axis_name")
      .data([0])
      .join("text")
      .attr("transform", `translate(${w/2}, ${h+30})`)
      .style("text-anchor", "middle")
      .text(target1);

    container.selectAll(".y_axis_name")
      .data([0])
      .join("text")
      // .attr("transform", `translate(-30, ${h/2})`)
      .attr("x", -180)
      .attr("y", -10)
      .style("text-anchor", "middle")
      .attr("transform", `rotate(-90)`)
      .text(target2);
      

    container.selectAll(".background")
      .data([0])
      .join("rect")
      .attr("x", 12)
      // .attr("y", 12)
      .attr("width", w+5)
      .attr("height", h+8)
      .attr("fill", "#f9f9f9");



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
    
    
      
      //change y axis label to increments of 5
      
  }

  render(){
    return <svg className='child3_svg'>
      <g className='g_3'></g>  
    </svg>
  }
}
export default Child3;