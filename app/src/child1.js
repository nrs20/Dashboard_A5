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
    console.log("data", data )

    const temp_data = {
      sex: d3.flatRollup(data, d => d.length, d => d.sex),
      smoker: d3.flatRollup(data, d => d.length, d => d.smoker),
      day: d3.flatRollup(data, d => d.length, d => d.day),
      time: d3.flatRollup(data, d => d.length, d => d.time),
      tip: d3.flatRollup(data, d => d.length, d => d.tip)
    };


    let tipSum = 0, billSum = 0, sizeSum = 0;

// Sum values
data.forEach(item => {
  tipSum += item.tip;
  billSum += item.total_bill;
  sizeSum += item.size;
});

// Calculate averages
const tipAverage = tipSum / data.length;
const billAverage = billSum / data.length;
const sizeAverage = sizeSum / data.length;

// Output averages
console.log(`Average Tip: ${tipAverage.toFixed(2)}`);
console.log(`Average Total Bill: ${billAverage.toFixed(2)}`);
console.log(`Average Size: ${sizeAverage.toFixed(2)}`);

    console.log("temp_data", temp_data.tip)

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

      //get average of variable selected from dropdown
      var average = d3.mean(selected_data, function(d) {
        return d[1];
      });
      console.log("Average:", average);
      console.log(data['total_bill'])

      // Log the selected radio option
      console.log("Selected Option:", this.state.selectedOption);
    //selected data is the radio button selected data
    console.log("selected_data", selected_data)
    console.log("y_data", y_data)
    var y_scale = d3
      .scaleLinear()
      .domain([0, d3.max(y_data)])
      .range([h, 0]);
      function barAverageCalculation(data, selectedRatioItem, selectedDropdownItem) {
        const sums = {};
        const counts = {};

        for (let i = 0; i < data.length; i++) {
          const key = data[i][selectedRatioItem];
          const value = data[i][selectedDropdownItem];

          if (!sums[key]) {
            sums[key] = 0;
          }
          if (!counts[key]) {
            counts[key] = 0;
          }

          sums[key] += value;
          counts[key] += 1;
        }

        const averages = [];
        console.log("length", Object.keys(sums).length)
        const iterate = 0
        for (const key in sums) {
          console.log("key", key)
          const average = sums[key] / counts[key];
          averages.push({ [selectedRatioItem]: key, average });
        }

        return averages;
      }
      const averageResults = barAverageCalculation(data, this.state.selectedOption, this.props.selectedTarget);
      console.log("Average results:",averageResults);
      //selectdeTarget is the dropdown selected data

//edit y axis label



console.log("selected_data", this.props.selectedTarget)
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

      //write the  to the bars


      //.attr("font-family", "Arial")
      .text(() => {
        switch (this.state.selectedTarget) {
          case "tip":
            return "tip (average)";
          case "total_bill":
            return "toal_bill (average)";
          case "size":
            return "size (average)";
          default:
            return "Y Axis Label";
        }
      });
      var transformedAverageResults = averageResults.map(item => [item.day, item.average]);  
          console.log("transformedAverageResults", transformedAverageResults)

      //split averageResults into two lists 
      var averageResultsX = averageResults.map(item => item[this.state.selectedOption]);
      var averageResultsY = averageResults.map(item => item.average);
      console.log("averageResultsX", averageResultsX)
      console.log("averageResultsY", averageResultsY)
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
      console.log("selected_data in container", selected_data)
      console.log("tran")

      console.log("x_data!!!!!", x_data)


 //this is where the averages are placed onto the bars
    container
    .selectAll(".average_numbers_label")
    .data(averageResultsY)
    .join("text")
    .attr("class", "average_numbers_label")
    .attr("x", (d, i) => x_scale(averageResultsX[i]) + x_scale.bandwidth() / 2)
    .attr("y", function (d) {
      return y_scale(d); 
    })
    .attr("text-anchor", "middle")
    .text(d => d.toFixed(5))
    .attr("fill", "gray")
    .attr("dy", "0.75em"); 
  
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
