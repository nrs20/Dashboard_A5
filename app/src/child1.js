import React, { Component } from "react";
import * as d3 from "d3";
class Child1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x_scale: 10,
      selectedOption: "day", // Initial selected option
      //dataKey: "sex" // Initial data key for the chart
    };
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  componentDidMount() {
    //console.log("componentDidMount (data is): ", this.props.data1);
    this.setState({ x_scale: 10 });
  }
  componentDidUpdate() {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 30, left: 20 },
      w = 500 - margin.left - margin.right,
      h = 300 - margin.top - margin.bottom;

    var data = this.props.data1;

    const temp_data = {
      sex: d3.flatRollup(data, d => d.length, d => d.sex),
      smoker: d3.flatRollup(data, d => d.length, d => d.smoker),
      day: d3.flatRollup(data, d => d.length, d => d.day),
      time: d3.flatRollup(data, d => d.length, d => d.time)
    };

    // Select the data based on the selected option
    const selected_data = temp_data[this.state.selectedOption];

    var container = d3
      .select(".child1_svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .select(".g_1")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // X axis
    var x_data = selected_data.map((item) => item[0]);
    var x_scale = d3
      .scaleBand()
      .domain(x_data)
      .range([margin.left, w])
      .padding(0.2);

    container
      .selectAll(".x_axis_g")
      .data([0])
      .join("g")
      .attr("class", "x_axis_g")
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom(x_scale));
    // Add Y axis
    var y_data = selected_data.map((item) => item[1]);
    var y_scale = d3
      .scaleLinear()
      .domain([0, d3.max(y_data)])
      .range([h, 0]);


    container
      .selectAll(".y_axis_g")
      .data([0])
      .join("g")
      .attr("class", "y_axis_g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y_scale));

    container
      .selectAll("rect")
      .data(selected_data)
      .join(
        enter => enter.append("rect"),
        update => update,
        exit => exit.remove()
      )
      .attr("x", function (d) {
        return x_scale(d[0]);
      })
      .attr("y", function (d) {
        return y_scale(d[1]);
      })
      .attr("width", x_scale.bandwidth())
      .attr("height", function (d) {
        return h - y_scale(d[1]);
      })
      .attr("fill", "#69b3a2");


  }

  handleOptionChange(changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value
    }, console.log("Bar Chart radio selection changed:", this.state.selectedOption));
  }

  render() {
    return (
      <div className="container">
        <div className="radio-container">
          {/* Radio buttons */}
          <input
            type="radio"
            name="sex"
            value="sex"
            checked={this.state.selectedOption === "sex"}
            onChange={this.handleOptionChange}
          />
          <label htmlFor="sex">Sex</label>

          <input
            type="radio"
            name="smoker"
            value="smoker"
            checked={this.state.selectedOption === "smoker"}
            onChange={this.handleOptionChange}
          />
          <label htmlFor="smoker">Smoker</label>

          <input
            type="radio"
            name="day"
            value="day"
            checked={this.state.selectedOption === "day"}
            onChange={this.handleOptionChange}
          />
          <label htmlFor="day">Day</label>

          <input
            type="radio"
            name="time"
            value="time"
            checked={this.state.selectedOption === "time"}
            onChange={this.handleOptionChange}
          />
          <label htmlFor="time">Time</label>
        </div>
        {/* SVG for the chart */}
        <svg className="child1_svg">
          <g className="g_1"></g>
        </svg>
      </div>
    );
  }
}
export default Child1;
