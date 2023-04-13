import React from "react";
import * as d3 from "d3";

class PieChart extends React.Component {
    constructor(props) {
      super(props);
      this.chartRef = React.createRef();
    }
  
    componentDidMount() {
        const data = this.props.data;
    
        const width = 300;
        const height = 300;
        const radius = Math.min(width, height) / 2;
    
        const color = d3.scaleOrdinal()
          .range(['#ff0000', '#00ff00', '#0000ff']);
    
        const pie = d3.pie()
          .value(d => d.value);
    
        const arc = d3.arc()
          .outerRadius(radius - 10)
          .innerRadius(0);
    
        const svg = d3.select(this.chartRef.current)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
        const g = svg.selectAll('.arc')
          .data(pie(data))
          .enter()
          .append('g')
          .attr('class', 'arc');
    
        g.append('path')
          .attr('d', arc)
          .style('fill', d => color(d.data.label));
    
        g.append('text')
          .attr('transform', d => `translate(${arc.centroid(d)})`)
          .attr('dy', '.35em')
          .text(d => d.data.label);
    }
  
    render() {
      return (
        <div ref={this.chartRef}></div>
      );
    }
  }
  
export default PieChart;

