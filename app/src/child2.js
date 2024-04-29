import React, { Component } from "react";
import * as d3 from "d3";
class Child2 extends Component {
  constructor(props) {
    super(props);
    this.state = { numericalVariables: ["total_bill", "tip", "size"]
  };
  }

  componentDidMount() {
    // Calculate correlation matrix from data passed in app.js
    const { data2 } = this.props;
    const corrVal = this.corrCalculation(data2);
    console.log("CORRELATION MATRIX:", corrVal);

    this.matrixCreation(corrVal);
  }

  componentDidUpdate() {
     // Calculate correlation matrix from data passed in app.js
    const { data2 } = this.props;
    const corrVal = this.corrCalculation(data2);

    this.matrixCreation(corrVal);


  }
  corrCalculation(data) {;
    const numericalVariables_copy = ['total_bill', 'tip', 'size'];
    const corrVal = [];
    var correlationVals = [];
    console.log("correlationVals", correlationVals)
    //go thru each variable
    this.state.numericalVariables.forEach((variable1) => {
      console.log("variable1", variable1)
      //for each variable, do .map to loop through the numericalVariables_copy in order to get 3x3
      //variableLooped == element in cols
      const row = numericalVariables_copy.map((variableLooped) => {
        //for each entry in the variable array and numericalVariables_copy array, calculate correlation
        console.log("variableLooped", variableLooped)

        // getting the x and y values from the data to prep for calculation...
        //type: Array(244) [ {…}, {…}, {…}, … ]
        const xValue = data.map(d => d[variable1]);
        console.log("xValue", xValue)
        const yValue = data.map(d => d[variableLooped]);

        //calculate average of x numericalVariables_copy
        var total = 0;
        for (var i = 0; i < xValue.length; i++) {
          total += xValue[i];
        }
        var avgX = total / xValue.length;

        //calculate average of y numericalVariables_copy

        var totalY = 0;
        for (var j = 0; i < yValue.length; j++) {
          totalY += yValue[j];
        }
        var avgY = totalY / yValue.length;
        //map == enumerate 
        const coefficientCalculation = d3.mean(xValue.map((d, i) => (d - avgX) * (yValue[i] - avgY)));
        const standardDeviation_X = d3.deviation(xValue);
        const standardDeviation_Y = d3.deviation(yValue);

        return coefficientCalculation / (standardDeviation_X * standardDeviation_Y);
      });
      correlationVals = [...correlationVals, row];


    });

    console.log("corrVal", corrVal)
    return correlationVals;
  }




  matrixCreation(corrVal) {    
    const correlationVals = corrVal.reduce((acc, row) => acc.concat(row), []);
    //  dimensions
    const margin = { top: 10, right: 10, bottom: 130, left: 60 };
    const w = 400 - margin.left - margin.right;
    const h = 500 - margin.top - margin.bottom;
    const colorLegendWidth = 25; 
    const widthOfRectangle = w / 3;
    const heightOfRectangle = h / 3.5;   
     const maximum = d3.max(correlationVals);
    const roundedMax = Math.round(maximum * 100) / 100;
    const colorPalette = d3.scaleSequential()
      .domain([d3.min(correlationVals), d3.max(correlationVals)]) // use the min and max correlation values
      .interpolator(t => d3.interpolatePlasma(t)); //color palette islam used

    const svg_element = d3.select(".child2_svg")
      .attr("width", w + margin.left + margin.right + colorLegendWidth + 950)
      .attr("height", h + margin.top + margin.bottom+500)      

    //append group element to the svg
    const svgGroup = svg_element.append("g")
      //+ move it to the right and down
      .attr("transform", `translate(${margin.left + 40}, ${margin.top + 20})`)
      //increase the length of
    const cBar_leg = svg_element.append("g").attr("transform", `translate(${w + margin.left + 100 + colorLegendWidth}, ${margin.top-95})`).attr("y", 100)

    // matrix title styling
    svgGroup.append("text").text("Correlation m  atrix").attr("y", -margin.top / 60)
    .attr("x", (w + margin.left + margin.right + colorLegendWidth) / 4) .attr("dy", "-1.0em");
    console.log("correlationVals!!", correlationVals)

    //all rules are applied for each element in the array one at a time...
    svgGroup.selectAll(".labelForCols")
      //bind data to the selection (each element in the selection is bound to an element in the array. )
      .data(this.state.numericalVariables)
      .join("text").attr("dy", "-1.5em")
      .attr("x", (p, i) => i * widthOfRectangle + widthOfRectangle / 2).attr("y", h - margin.bottom /300)
      //make text centered
      .style("text-anchor", "middle")
      //binding each element in the array to the text element..
      .text(data => data);
  

    // Add labels for matrixRows
    svgGroup.selectAll(".labelFormatrixRows")
      .data(this.state.numericalVariables)
      .join("text") // appends elements & creates placeholders for each element in the array
      .attr("padding", 10).attr("x", -margin.left )
      //
      .attr("y", function (param, i) {
        return i * heightOfRectangle + heightOfRectangle / 2;
      })
      .text(d => d);
    console.log("matrix", corrVal)
  
    
// bind data to matrixRows
const matrixRows = svgGroup.selectAll(".row")
    .data(corrVal)
    .join("g") //join elements to the selection
    .attr("transform", (d, i) => `translate(0, ${i * heightOfRectangle})`);

// append squares for each rpw
matrixRows.each(function(matrixRow) {
  //this === current row
  console.log("matrixRow", matrixRow)
    const squares = d3.select(this)
        .selectAll("g").data(matrixRow)
        .join("g").attr("transform", (d, i) => `translate(${i * widthOfRectangle}, 0)`);

    // append rect & text
    squares.each(function(cell) {
        const group = d3.select(this);
        const correlationVal = cell;

        group.append("rect")
            .attr("width", widthOfRectangle).attr("fill", colorPalette(correlationVal)).attr("height", heightOfRectangle)

        group.append("text")
            .attr("x", widthOfRectangle / 2).attr("y", heightOfRectangle / 2)
            .style("text-anchor", "middle").text(correlationVal >= 0.99 ? 1 : correlationVal.toFixed(2))
            .style("fill", correlationVal >= 0.99 ? "black" : "white");
    });
});



//color bar stuff starts here
    const colorBarScale = d3.scaleLinear()
      .domain([d3.min(correlationVals), roundedMax])
      //this controls the length of the legend scale.
      .range([425, 120]);

    const axis = d3.axisLeft(colorBarScale) // Change to d3.axisLeft to position the axis on the left side
      .tickSize(0)
      .ticks(6)
      .tickPadding(1)

  

      cBar_leg.append("g").attr("class", "legend-axis")
      //move the legend scale down
      .attr("transform", `translate(0, 0)`).call(axis);

    // actual color bar 
    const colorBar = svg_element.append("g").attr("class", "color-bar").attr("transform", `translate(${w + margin.left + 80}, ${margin.top + 25})`); 
      //decrease spacing of legend text
      
      colorBar.append("rect")
      .attr("width", colorLegendWidth)
      .attr("height", 300).style("fill", "url(#colorBar_ColorScheme)");

//coloring da bar (close enough, tried my best to match the colors in the pic)
    const colorBar_ColorScheme = colorBar.append("defs")
      .append("linearGradient").attr("id", "colorBar_ColorScheme")
      .attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");

    colorBar_ColorScheme.append("stop").attr("offset", "0%").attr("stop-color", "yellow");
      colorBar_ColorScheme.append("stop").attr("offset", "50%")
      .attr("stop-color", "orange");
    colorBar_ColorScheme.append("stop")
      .attr("offset", "75%").attr("stop-color", "purple");
    colorBar_ColorScheme.append("stop")
      .attr("offset", "100%").attr("stop-color", "#00008b");




      
  }




  render() {
    return (
      <svg className="child2_svg">
      <g className="g_2"></g>
      </svg>
    );
  }
}

export default Child2;
