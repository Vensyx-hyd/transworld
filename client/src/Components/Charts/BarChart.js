import React from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export default class BarChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartId: `chart-${Math.random() * 1000000}`
        }
    }

    componentDidMount() {
        this.renderChart();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.updateChartData();
        }
    }

    updateChartData() {
        if (this.chart) {
            this.chart.data = this.props.data; // Update chart data directly
        }
    }

    renderChart() {
        const { data } = this.props;
        console.log("Bar Chart Data", data);

        // Create chart instance
        let chart = am4core.create(this.state.chartId, am4charts.XYChart);

        // Add initial data
        chart.data = data;

        // Create X-axis (category axis)
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "key";
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.labels.template.fontSize = 12;

        // Create Y-axis (value axis)
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.disabled = true;

        // Create series
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "value";
        series.dataFields.categoryX = "key";
        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
        series.columns.template.fillOpacity = 0.8;
        series.columns.template.strokeWidth = 2;
        series.columns.template.strokeOpacity = 1;

        // Apply colors to the columns
        series.columns.template.adapter.add("fill", (fill, target) => {
            return chart.colors.getIndex(target.dataItem.index);
        });

        // Adjust color palette
        chart.colors.list = [
            am4core.color("#99ffeb"),
            am4core.color("#6fe0fc"),
            am4core.color("#9370DB"),
            am4core.color("#4051ed"),
            am4core.color("#f571ee"),
        ];

        this.chart = chart;
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    render() {
        return (
            <div id={this.state.chartId} style={{ width: "100%", height: "300px" }}></div>
        );
    }
}





// import React from 'react';
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// am4core.useTheme(am4themes_animated);

// export default class BarChart extends React.Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             chartId: Math.round(Math.random() * 1000000) + ''
//         }
//     }

//     componentWillReceiveProps() {
//         this.renderChart();
//     }

//     componentDidMount() {
//         this.renderChart();
//     }

//     renderChart() {
//         const { data } = this.props;
//         console.log("Bar Chart Data", data);

//         // Create chart instance
//         let chart = am4core.create(this.state.chartId, am4charts.XYChart);

//         // Add data
//         chart.data = data;

//         // Create X-axis (category axis)
//         let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
//         categoryAxis.dataFields.category = "key";  // X-axis has categories
//         categoryAxis.renderer.grid.template.disabled = true; // Remove grid lines
//         categoryAxis.renderer.minGridDistance = 30; // Adjust the distance between labels
//         categoryAxis.renderer.labels.template.fontSize = 12; // Adjust font size if needed

//         // Create Y-axis (value axis)
//         let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
//         valueAxis.renderer.grid.template.disabled = true; // Remove grid lines

//         // Create series
//         let series = chart.series.push(new am4charts.ColumnSeries());
//         series.dataFields.valueY = "value";  // Y-axis is for values
//         series.dataFields.categoryX = "key";  // X-axis is for categories
//         series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
//         series.columns.template.fillOpacity = .8;
//         series.columns.template.strokeWidth = 2;
//         series.columns.template.strokeOpacity = 1;

//         // Apply colors to the columns similar to the image
//         series.columns.template.adapter.add("fill", function (fill, target) {
//             return chart.colors.getIndex(target.dataItem.index);
//         });

//         // Adjusting the color palette to match the image colors
//         chart.colors.list = [
//             am4core.color("#99ffeb"),  // light aqua
//             am4core.color("#6fe0fc"), // Light Violet
//             am4core.color("#9370DB"), // Light Indigo
//             am4core.color("#4051ed"),  // light blue
//             am4core.color("#f571ee"), // Light Violet

//             // am4core.color("#c9a3d7"),  // Light purple
//             // am4core.color("#b5c6e0"),  // #b5c6e0 Light blue
//             // am4core.color("#b5e0b5"),  // #b5e0b5 Light green
//             // am4core.color("#f7e4ab"),  // #f7e4ab Light orange
//             // am4core.color("#f7a083")   // #f7a083 Light red
//         ];

//         this.chart = chart;
//     }

//     componentWillUnmount() {
//         if (this.chart) {
//             this.chart.dispose();
//         }
//     }

//     render() {
//         return (
//             <div id={this.state.chartId} style={{ width: "100%", height: "300px" }}></div>
//         );
//     }
// }













// import React from 'react';
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// am4core.useTheme(am4themes_animated);

// export default class BarChart extends React.Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             chartId: Math.round(Math.random() * 1000000) + ''
//         }
//     }

//     componentWillReceiveProps() {
//         this.renderChart();
//     }

//     componentDidMount() {
//         this.renderChart();
//     }

//     renderChart() {
//         const {data} = this.props;
//         console.log("Bar Chart Data", data);
//         // Create chart instance
//         let chart = am4core.create(this.state.chartId, am4charts.XYChart);

//         // Add data
//         chart.data = data;

//         // Create axes
//         let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
//         categoryAxis.dataFields.category = "key";
//         categoryAxis.renderer.grid.template.disabled = true;
//         categoryAxis.renderer.grid.template.location = 0;
//         categoryAxis.renderer.minGridDistance = 30;

//         categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
//             if (target.dataItem && target.dataItem.index && 2 === 2) {
//                 return dy + 25;
//             }
//             return dy;
//         });

//         let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

//         // Create series
//         let series = chart.series.push(new am4charts.ColumnSeries());
//         series.dataFields.valueY = "value";
//         series.dataFields.categoryX = "key";
//         series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
//         series.columns.template.fillOpacity = .8;

//         let columnTemplate = series.columns.template;
//         columnTemplate.strokeWidth = 2;
//         columnTemplate.strokeOpacity = 1;

//         this.chart = chart;
//     }

//     componentWillUnmount() {
//         if (this.chart) {
//             this.chart.dispose();
//         }
//     }

//     render() {
//         return (
//             <div id={this.state.chartId} style={{ width: "100%", height: "300px" }}></div>
//         )
//     }
// }