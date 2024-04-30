import React, { Component } from "react";
import * as d3 from "d3";
class Child1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x_scale: 10,
      selectedOption: "day", // Initial selected option
      selectedTarget: "tip", // Initial selected target

    };
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  componentDidMount() {
    this.setState({ x_scale: 10 });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedTarget !== this.props.selectedTarget ||
      prevState.selectedTarget !== this.state.selectedTarget) {
      // Update the state with the new selected target
      this.setState({ selectedTarget: this.props.selectedTarget });
    }
    console.log(this.state.selectedTarget)

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 30, left: 20 },
      w = 500 - margin.left - margin.right,
      h = 350 - margin.top - margin.bottom;

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

    // Add x-axis
    var x_data = selected_data.map((item) => item[0]);
    var x_scale = d3
      .scaleBand()
      .domain(x_data)
      .range([margin.left, w])
      .padding(0.05);

    container
      .selectAll(".x_axis_g")
      .data([0])
      .join("g")
      .attr("class", "x_axis_g")
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom(x_scale));

    // Add x-axis label
    container
      .selectAll(".x_axis_label")
      .data([0])
      .join("text")
      .attr("class", "x_axis_label")
      .attr("x", w / 2)
      .attr("y", h + margin.bottom - 5)
      .attr("text-anchor", "middle")
      //.attr("font-family", "Arial")
      .text(() => {
        switch (this.state.selectedOption) {
          case "sex":
            return "Sex";
          case "smoker":
            return "Smoker";
          case "day":
            return "Day";
          case "time":
            return "Time";
          default:
            return "X Axis Label";
        }
      });

    // Add y-axis 
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

    // Add y-axis label
    container
      .selectAll(".y_axis_label")
      .data([0])
      .join("text")
      .attr("class", "y_axis_label")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - h / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      //.attr("font-family", "Arial")
      .text(() => {
        switch (this.state.selectedTarget) {
          case "tip":
            return "Tip";
          case "total_bill":
            return "Total Bill";
          case "size":
            return "Size";
          default:
            return "Y Axis Label";
        }
      });

    // Bars of bar chart
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
      .attr("fill", "#b0b0b0");
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
        <svg className="child1_svg" width={500} height={1}>
          <g className="g_1"></g>
        </svg>
      </div>
    );
  }
}
export default Child1;
