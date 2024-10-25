import React from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export default class DonutChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartId: Math.round(Math.random() * 1000000) + ''
        }
    }

    renderChart(data) {
        console.log("datas", data);
        // Create chart instance
        let chart = am4core.create(this.state.chartId, am4charts.PieChart);
        chart.legend = new am4charts.Legend();

        // Adjust font size for better visibility
        chart.fontSize = '14px';

        // Add and configure Series
        
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "key";
        console.log("pieSeries",pieSeries)
        
        // Adjust labels and tooltips
        pieSeries.labels.template.disabled = true; // Hides labels inside pie
        pieSeries.labels.template.text= "{category}: {value.value}";
        pieSeries.slices.template.tooltipText = "{category}: [bold]{value}";
        chart.legend.valueLabels.template.text = "[bold]{value.value}";


        // Adjust inner radius for more donut look
        chart.innerRadius = am4core.percent(0); // Increased donut size

        // Add white border around slices for better separation
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 0; // Thicker borders
        pieSeries.slices.template.strokeOpacity = 0;

        // Disable label ticks
        pieSeries.ticks.template.disabled = true;

        // Hover effects
        let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
        shadow.opacity = 0;

        let hoverState = pieSeries.slices.template.states.getKey("hover");
        let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
        hoverShadow.opacity = 0.7;
        hoverShadow.blur = 5;

        // Custom color set for pie slices
        let colorSet = new am4core.ColorSet();
        colorSet.list = [
            // am4core.color("#99ccff"),  // light sky blue
            am4core.color("#99ffeb"),  // light aqua
            am4core.color("#ffb3e6"),  // light pink
            am4core.color("#d9b3ff"),  // light lavender
            am4core.color("#757ee6"),  // light yellow
        ];
        pieSeries.colors = colorSet;

        // Position legend on the right with smaller font size
        chart.legend.position = 'right';
        chart.legend.fontSize = '12px';
        chart.legend.itemContainers.template.clickable = false; // Disable clickable legend

        // Set chart data
        chart.data = data;
        this.chart = chart;
    }

    componentWillReceiveProps(newProps) {
        this.renderChart(newProps.data);
    }

    componentDidMount() {
        this.renderChart(this.props.data);
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    render() {
        return (
            <div id={this.state.chartId} style={{ width: "400px", height: "300px" }}></div>
        );
    }
}



// import React from 'react';
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// am4core.useTheme(am4themes_animated);

// export default class DonutChart extends React.Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             chartId: Math.round(Math.random() * 1000000) + ''
//         }
//     }

//     renderChart(data) {
//         console.log("datas",data);
//         // Create chart instance
//         let chart = am4core.create(this.state.chartId, am4charts.PieChart);
//         chart.legend = new am4charts.Legend();

//         //@subhashini just comment it(it displays only data)
//         //chart.legend.valueLabels.template.text = "{value.value}";
//         chart.fontSize = '30px';
        
//         // Add and configure Series
//         let pieSeries = chart.series.push(new am4charts.PieSeries());
//         pieSeries.dataFields.value = "value";
//         pieSeries.dataFields.category = "key";
//         pieSeries.labels.template.text= "{category}: {value.value}";
//         pieSeries.slices.template.tooltipText= "{category}: [bold]{value}";
//         chart.legend.valueLabels.template.text = "[bold]{value.value}";

    
//         // Let's cut a hole in our Pie chart the size of 30% the radius
//         chart.innerRadius = am4core.percent(30);
//         //chart.height = am4core.percent(65);

//         //@subhshini increased size
//         // chart.width = am4core.percent(60);
//         // chart.padding = am4core.percent(20);
//         chart.margin = am4core.percent(5);
//         chart.legend.itemContainers.template.clickable=false;

//         // Put a thick white border around each Slice
//         pieSeries.slices.template.stroke = am4core.color("#fff");
//         pieSeries.slices.template.strokeWidth = 2;
//         pieSeries.slices.template.strokeOpacity = 1;
//         pieSeries.slices.template
//             // change the cursor on hover to make it apparent the object can be interacted with
//             .cursorOverStyle = [
//             {
//                 "property": "cursor",
//                 "value": "pointer",
//             }
//         ];

//         pieSeries.alignLabels = false;
//         pieSeries.labels.template.disabled = true;
//         pieSeries.labels.template.bent = true;
//         pieSeries.labels.template.radius = 3;
//         pieSeries.labels.template.padding(0, 0, 0, 0);

//         pieSeries.ticks.template.disabled = true;

//         // Create a base filter effect (as if it's not there) for the hover to return to
//         let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
//         shadow.opacity = 0;

//         // Create hover state
//         let hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

//         // Slightly shift the shadow and make it more prominent on hover
//         let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
//         hoverShadow.opacity = 0.7;
//         hoverShadow.blur = 5;

//         // Add a legend
//         // chart.legend = new am4charts.Legend();
//         chart.legend.position = 'right';
//         chart.legend.fontSize = '12px';

//         chart.data = data;
//         console.log("data",data);
//         this.chart = chart;
//     }

//     componentWillReceiveProps(newProps) {
//         this.renderChart(newProps.data);
//     }

//     componentDidMount() {
//         this.renderChart(this.props.data);
//     }

//     componentWillUnmount() {
//         if (this.chart) {
//             this.chart.dispose();
//         }
//     }

//     render() {
//         return (
//             //@subhashini increased width
//             <div id={this.state.chartId} style={{width: "330px", height: "47vh", margin: "0 auto"}}></div>
//         )
//     }
// }