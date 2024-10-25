import React from 'react';
import { connect } from "react-redux";
import {
    withStyles,
    Typography,
    Button
} from "@material-ui/core";
import Refresh from '@material-ui/icons/Refresh';
import styles from "./CEODashboard.styles";
import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import Paper from "@material-ui/core/es/Paper/Paper";
import DonutChart from "../../Components/Charts/DonutChart";
import BarChart from "../../Components/Charts/BarChart";
import AppAPI from '../../API';
import Constants from '../../API/constants';
import CEODashboardActions from './+state/ceodashboard.actions';
import Loading from "../../Components/Loading/Loading";
import Progress from "../../Components/Loading/Progress";

const mapStateToProps = state => ({
    auth: state.auth,
    state: state.CEODashboard
});

const mapDispatchToProps = (dispatch) => {
    return {
        setDriversChartData: (data) => {
            dispatch(CEODashboardActions.SET_CEO_CHART_DATA({ data: data, key: 'drivers' }))
        },
        setTrailersChartData: (data) => {
            dispatch(CEODashboardActions.SET_CEO_CHART_DATA({ data: data, key: 'trailers' }))
        },
        setTrailersPerformanceChartData: (data) => {
            dispatch(CEODashboardActions.SET_CEO_CHART_DATA({ data: data, key: 'trailerPerformance' }))
        },
        setDriversPerformanceChartData: (data) => {
            dispatch(CEODashboardActions.SET_CEO_CHART_DATA({ data: data, key: 'driverTrips' }))
        },
        setTripsPerformanceChartData: (data) => {
            dispatch(CEODashboardActions.SET_CEO_CHART_DATA({ data: data, key: 'trips' }))
        }
    };
};

class CEODashBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errMessage: "",
            allTrailers: "",
            onPay: "",
            submitted: false,
            getApi: false,
            time: new Date().getHours(),
            color1: "none",
            color2: "none",
            selectedChart: 'trailers',

            selectedDate: "currentDate",
            selectedDate1: "currentDate",
            tripsDate: "",
            driversDate: "",
            currentDate: "",

            tripdate: "",
            driverdate: "",

            tripsData: [],
            formattedTripDates: [],
        };
        this.refresh = this.refresh.bind(this);
        this.selectChart = this.selectChart.bind(this);
        this.formatTripsDate = this.formatTripsDate.bind(this);
        this.handleDateSelection = this.handleDateSelection.bind(this);
        this.handleDriverDateSelection = this.handleDriverDateSelection.bind(this);

    }

    // Handle date button click
    handleDateSelection(dateType) {
        this.setState({ selectedDate: dateType });
    }

    // Handle date button click
    handleDriverDateSelection(dateType) {
        this.setState({ selectedDate1: dateType });
    }

    formatTripsDate() {
        // Convert the string to a Date object
        const dateObject = new Date(this.state.tripsDate);

        if (!isNaN(dateObject)) {
            // Extract year, month, and day
            const year = dateObject.getFullYear();
            const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');  // Months are 0-indexed, so we add 1
            const day = dateObject.getDate().toString().padStart(2, '0');

            // Format the date as "YYYY-MM-DD"
            const formattedDate = `${year}-${month}-${day}`;

            // Update state with the formatted date
            this.setState({
                tripdate: formattedDate,
            });
        } else {
            console.error("Invalid date format:", this.state.tripsDate);
        }

        const dateObject1 = new Date(this.state.driversDate);

        if (!isNaN(dateObject1)) {
            // Extract year, month, and day
            const year = dateObject1.getFullYear();
            const month = (dateObject1.getMonth() + 1).toString().padStart(2, '0');  // Months are 0-indexed, so we add 1
            const day = dateObject1.getDate().toString().padStart(2, '0');

            // Format the date as "YYYY-MM-DD"
            const formattedDate = `${year}-${month}-${day}`;

            // Update state with the formatted date
            this.setState({
                driverdate: formattedDate,
            });
        } else {
            console.error("Invalid date format:", this.state.driverdate);
        }

        const date = new Date();
        const curyear = date.getFullYear();
        const curmonth = (date.getMonth() + 1).toString().padStart(2, '0');
        const curday = date.getDate().toString().padStart(2, '0');

        const curformattedDate = `${curyear}-${curmonth}-${curday}`;
        this.setState({
            currentDate: curformattedDate,
        })
    }

    getDateButtons() {
        const currentDate = new Date();
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);
        const dayBeforeYesterday = new Date(currentDate);
        dayBeforeYesterday.setDate(currentDate.getDate() - 2);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        return {
            currentDate: formatDate(currentDate),
            yesterday: formatDate(yesterday),
            dayBeforeYesterday: formatDate(dayBeforeYesterday)
        };
    }

    getDriverDateButtons() {
        const currentDate = new Date();
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);
        const dayBeforeYesterday = new Date(currentDate);
        dayBeforeYesterday.setDate(currentDate.getDate() - 2);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        return {
            currentDate1: formatDate(currentDate),
            yesterday1: formatDate(yesterday),
            dayBeforeYesterday1: formatDate(dayBeforeYesterday)
        };
    }

    // Method to switch between charts
    selectChart(chart) {
        this.setState({ selectedChart: chart });
    }

    renderData() {
        this.trailersData();
        this.driversData();
        this.trailersPerformance();
        this.driversPerformance();
        this.tripsPerformance();
    }

    componentDidMount() {
        this.renderData();
    }

    trailersData() {
        AppAPI.homeTrailers.get(null, null).then((result) => {
            console.log("Trailers Data 1: ", result);
            var totTr = result.trailers;
            let data = [];
            for (let key in result.trailers) {
                const obj = {
                    key: Constants.strings.CFSTrailersChart[key],
                    value: result.trailers[key]
                };
                if (key !== "all_trailers") {
                    data.push(obj)
                }
                this.setState({
                    allTrailers: totTr.all_trailers,
                    getApi: true
                })
            }
            this.props.setTrailersChartData(data);
        }).catch(e => console.log(e))
    }

    driversData() {
        AppAPI.homeDrivers.get(null, null)
            .then((result) => {
                console.log("Drivers Data: ", result.drivers);
                var totPay = result.drivers;
                let data = [];
                let time = this.state.time;
                if (time >= 8 && time <= 20) {
                    for (let key in result.drivers) {
                        const obj = {
                            key: Constants.strings.CFSDriversDayChart[key],
                            value: result.drivers[key]
                        };
                        if (key !== "on_pay" && key !== "shift1_cnt" && key !== "shift2_cnt" && key !== "shift2_leave" && key !== "shift2_absent" && key !== "date") {
                            data.push(obj)
                        }
                    }
                    this.setState({
                        color1: "#332c6f"
                    })
                } else if (time >= 20 && time <= 8) {
                    for (let key in result.drivers) {
                        const obj = {
                            key: Constants.strings.CFSDriversNightChart[key],
                            value: result.drivers[key]
                        };
                        if (key !== "on_pay" && key !== "shift1_cnt" && key !== "shift2_cnt" && key !== "on_leave" && key !== "on_absent" && key !== "date") {
                            data.push(obj)
                        }
                    }
                    this.setState({
                        color2: "#332c6f"
                    })
                }
                this.setState({
                    onPay: totPay.on_pay,
                    shift1Cnt: totPay.shift1_cnt,
                    shift2Cnt: totPay.shift2_cnt,
                    getApi: true
                })
                console.log(data, "Drivers Day Object");
                this.props.setDriversChartData(data);
            }).catch(e => {
                if (e.code === 500) {
                    this.setState({
                        errMessage: e.serverMessage
                    })
                }
                console.log(e, "Error");
            })
    }

    trailersPerformance() {
        AppAPI.homePerformanceTrailers.get(null, null)
            .then((result) => {
                const _resultData = result.trailers; // Using the entire array
    
                let data = [];
                _resultData.forEach((trailer, index) => {
                    for (let key in trailer) {
                        const chartKey = Constants.strings.CEOTrailersPerformanceChart[key] || key;
                        
                        // Append trip index to keys to avoid merging
                        const uniqueKey = `${chartKey}_${index}`;
                        
                        const obj = {
                            key: uniqueKey,  // Unique key with index
                            value: trailer[key]
                        };
                        console.log("object", obj);
                        data.push(obj);
                    }
                });
    
                this.setState({
                    getApi: true
                });
                this.props.setTrailersPerformanceChartData(data);
            })
            .catch(e => console.log(e));
        // AppAPI.homePerformanceTrailers.get(null, null).then((result) => {
        //     const _resultData = result.trailers[0];
        //     let data = [];
        //     for (let key in _resultData) {
        //         const obj = {
        //             key: Constants.strings.CEOTrailersPerformanceChart[key],
        //             value: _resultData[key]
        //         };
        //         this.setState({
        //             getApi: true
        //         })
        //         data.push(obj)
        //     }
        //     this.props.setTrailersPerformanceChartData(data);
        // }).catch(e => console.log(e))
    }

    driversPerformance() {
        AppAPI.homePerformanceDrivers.get(null, null).then((result) => {
            const _resultData = result.drivers[0];
            console.log("driversPerformance", result)
            let data = [];
            for (let key in _resultData) {
                const chartKey = Constants.strings.CEODriversPerformanceChart[key] || key;
                if (chartKey === "date") {
                    this.setState({
                        driversDate: _resultData[key],
                    })
                }
                const obj = {
                    key: chartKey,
                    value: _resultData[key]
                };
                this.setState({
                    getApi: true
                })
                data.push(obj)
            }
            this.props.setDriversPerformanceChartData(data);
        }).catch(e => console.log(e))
    }

    tripsPerformance() {
        AppAPI.homePerformanceTrips.get(null, null)
            .then((result) => {
                const _resultData = result.trips; // Using the entire array
                console.log("tripsPerformance", result.trips);
    
                let data = [];
                let formattedDates = [];
                _resultData.forEach((trip, index) => {
                    let formattedDate = '';
                    for (let key in trip) {
                        const chartKey = Constants.strings.CEOTripsPerformanceChart[key] || key;
                        
                        // Append trip index to keys to avoid merging
                        const uniqueKey = `${chartKey}_${index}`;
                        
                        // If the key is "date", format and store the date
                        if (chartKey === "date") {
                            const rawDate = new Date(trip[key]);
                            if (!isNaN(rawDate)) {
                                // Format the date as "YYYY-MM-DD"
                                const year = rawDate.getFullYear();
                                const month = (rawDate.getMonth() + 1).toString().padStart(2, '0');
                                const day = rawDate.getDate().toString().padStart(2, '0');
                                formattedDate = `${year}-${month}-${day}`;
                            } else {
                                console.error("Invalid date format:", trip[key]);
                            }
                        }
                        
                        const obj = {
                            key: uniqueKey,  // Unique key with index
                            value: trip[key]
                        };
                        data.push(obj);
                    }

                    // After each trip loop, push the formatted date
                    if (formattedDate) {
                        formattedDates.push({
                            tripIndex: index, 
                            date: formattedDate
                        });
                    }
                });
    
                this.setState({
                    getApi: true,
                    tripsData: data, 
                    formattedTripDates: formattedDates,
                });

                // Optional: update the last trip's date to `tripsDate` state if needed
                if (formattedDates.length > 0) {
                    const lastTripDate = formattedDates[formattedDates.length - 1].date;
                    this.setState({
                        tripsDate: lastTripDate
                    });
                }

                this.props.setTripsPerformanceChartData(data);
                this.formatTripsDate();
            })
            .catch(e => console.log(e));
    }
    
    // tripsPerformance() {
    //     AppAPI.homePerformanceTrips.get(null, null)
    //         .then((result) => {
    //             const _resultData = result.trips[0];
    //             console.log("tripsPerformance-1", result.trips)
    //             // console.log("tripsPerformance-2", result.trips[0])
    //             let data = [];
    //             for (let key in _resultData) {
    //                 const chartKey = Constants.strings.CEOTripsPerformanceChart[key] || key;
    //                 if (chartKey === "date") {
    //                     this.setState({
    //                         tripsDate: _resultData[key],
    //                     })
    //                 }
    //                 const obj = {
    //                     key: chartKey,
    //                     value: _resultData[key]
    //                 };
    //                 console.log("object", obj)
    //                 this.setState({
    //                     getApi: true
    //                 })
    //                 data.push(obj)
    //             }
    //             this.props.setTripsPerformanceChartData(data);
    //             this.formatTripsDate();
    //         }).catch(e => console.log(e))
    // }

    renderDriversChart() {
        const chartData = this.props.state.drivers.chartData;
        console.log("renderDriversChart", chartData)
        return chartData.length > 0
            ?
            <DonutChart data={chartData} />
            :
            <div className="d-flex justify-content-center">
                <Loading />
            </div>;
    }

    renderTrailerChart() {
        const chartData = this.props.state.trailers.chartData;
        console.log("renderTrailerChart", chartData)
        return chartData.length > 0
            ?
            <DonutChart data={chartData} />
            :
            <div className="d-flex justify-content-center">
                <Loading />
            </div>;
    }

    renderTrailerPerformance() {
        const chartData = this.props.state.trailerPerformance.chartData;
        return chartData.length > 0
            ?
            <BarChart data={chartData} />
            :
            <div className="d-flex justify-content-center">
                <Loading />
            </div>;
    }

    renderDriverTrips() {
        const chartData = this.props.state.driverTrips.chartData;

        const filteredChartData = chartData.filter(entry => {
            const hasDate = entry.key !== "date" && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(entry.value);

            return hasDate;
        });
        const filteredChartData1 = filteredChartData.map(entry => ({
            ...entry,
            key: entry.key === undefined || entry.key === "driver_5" ? 'Five Trips' : entry.key,
            value: typeof entry.value === 'string' ? Number(entry.value) : entry.value
        }));

        return filteredChartData1.length > 0
            ? <BarChart data={filteredChartData1} />
            : (
                <div className="d-flex justify-content-center">
                    <Loading />
                </div>
            );
    }

    // renderDriverTrips() {
    //     const chartData = this.props.state.driverTrips.chartData;
    //     return chartData.length > 0
    //         ?
    //         <BarChart data={chartData} />
    //         :
    //         <div className="d-flex justify-content-center">
    //             <Loading />
    //         </div>;
    // }

    renderTrips(selectedDate) {
        const chartData = this.props.state.trips.chartData;
        const chartData1 = this.props.state.trailerPerformance.chartData;
        const { currentDate, yesterday, dayBeforeYesterday } = this.getDateButtons();

        const combinedChartData = [...chartData, ...chartData1];
        let filterData = [];
        console.log("filterData",filterData)
        console.log("currentDate",currentDate)
        console.log("selectedDate",selectedDate)


        // console.log("chartDataTrips", chartData);
        // console.log("chartDatatrailerPerformance", chartData1);
        console.log("combinedChartData", combinedChartData);
        // console.log("tripdate", this.state.tripdate);
        // console.log("currentdate", this.state.currentDate);

        if(currentDate == selectedDate){
            const keysToFilter = [
                "ceo_tdr_planned_0",
                "ceo_tdr_loaded_0",
                "ceo_tdr_empty_0",
                "ceo_tdr_issign_0",
                "Completed_0",
                "Pending_0",
                "Probability_0",
                "date_0",
                "Trips Done_0",
                "Diesel Issued_0"
            ];
            let filterdata = combinedChartData.filter((data)=>keysToFilter.includes(data.key))
            filterData.push(filterdata)
        } else if(yesterday == selectedDate){
            const keysToFilter = [
                "ceo_tdr_planned_1",
                "ceo_tdr_loaded_1",
                "ceo_tdr_empty_1",
                "ceo_tdr_issign_1",
                "Completed_1",
                "Pending_1",
                "Probability_1",
                "date_1",
                "Trips Done_1",
                "Diesel Issued_1"
            ];
            let filterdata = combinedChartData.filter((data)=>keysToFilter.includes(data.key))
            filterData.push(filterdata)
        } else if(dayBeforeYesterday == selectedDate){
            const keysToFilter = [
                "ceo_tdr_planned_2",
                "ceo_tdr_loaded_2",
                "ceo_tdr_empty_2",
                "ceo_tdr_issign_2",
                "Completed_2",
                "Pending_2",
                "Probability_2",
                "date_2",
                "Trips Done_2",
                "Diesel Issued_2"
            ];
            let filterdata = combinedChartData.filter((data)=>keysToFilter.includes(data.key))
            filterData.push(filterdata)
        } 
        console.log("filterData-1",filterData)


        const colors = ["#c9a3d7", "#a9b1e0", "#85d7b1", "#f7e4ab", "#f3c5a8", "#e07362", "#f7e4bc", "#ffcc5c"];
        const items = ["Planned", "Loaded", "Empty", "Assigned", "Completed", "Pending", "Trips Done", "Diesel Issued"];
        const flatFilterData = filterData.flat();


        return chartData.length > 0
            ? (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {flatFilterData && flatFilterData
                        .filter(item => item.value !== null && item.key !== "Probability" && item.key !== "date" && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(item.value))
                        .map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column', // Stack box and text in a column
                                    alignItems: 'center',
                                }}
                            >
                                <div
                                    key={index}
                                    style={{
                                        width: '100px',
                                        height: '25px',
                                        flex: '1',
                                        backgroundColor: colors[index],
                                        margin: '0 5px',
                                        padding: '10px',
                                        textAlign: 'center',
                                        borderRadius: '4px'
                                    }}
                                >
                                    <Typography variant="h5" style={{ color: '#333' }}>
                                        {item.value}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="subtitle1" style={{ color: '#555' }}>
                                        {items[index]}
                                    </Typography>
                                </div>
                            </div>
                        ))}
                </div>
            )
            : (
                <div className="d-flex justify-content-center">
                    <Loading />
                </div>
            );
    }

    // renderTrips() {
    //     const chartData = this.props.state.trips.chartData;
    //     console.log("renderTrips", chartData)
    //     return chartData.length > 0
    //         ?
    //         <BarChart data={chartData} />
    //         :
    //         <div className="d-flex justify-content-center">
    //             <Loading />
    //         </div>;
    // }

    // Function to render trips or display no match message
    renderTripsBasedOnDate() {
        const { currentDate, yesterday, dayBeforeYesterday } = this.getDateButtons();
        const { selectedDate, tripdate, formattedTripDates } = this.state;
        // console.log("formattedTripDates",formattedTripDates)

        const selectedTripDate =
            selectedDate === "currentDate" ? currentDate :
                selectedDate === "yesterday" ? yesterday :
                    dayBeforeYesterday;

        console.log(selectedTripDate)

        // Check if tripdate matches the selected date
        // if (tripdate === selectedTripDate) {
        if (formattedTripDates.some(trdt => trdt.date === selectedTripDate)) {
            return (
                <div className="row">
                    <div className="col-sm-12">
                        <Paper className={this.props.classes.paper}>
                            <h6 className="titleColor">Trips</h6>
                            {this.renderTrips(selectedTripDate)}
                        </Paper>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="row">
                    <div className="col-sm-12">
                        <Paper className={this.props.classes.paper}>
                            <h6 className="titleColor">No trips matched the selected date</h6>
                        </Paper>
                    </div>
                </div>
            );
        }
    }

    // Function to render trips or display no match message
    renderDriversBasedOnDate() {
        const { currentDate1, yesterday1, dayBeforeYesterday1 } = this.getDriverDateButtons();
        const { selectedDate1, driverdate } = this.state;

        const selectedDriverDate =
            selectedDate1 === "currentDate" ? currentDate1 :
                selectedDate1 === "yesterday" ? yesterday1 :
                    dayBeforeYesterday1;

        // Check if tripdate matches the selected date
        if (driverdate === selectedDriverDate) {
            return (
                <>
                    <h6 className="titleColor">Driver Trips</h6>
                    {this.renderDriverTrips()}
                </>

                // <div className="row">
                //     <div className="col-sm-12">
                //         {this.renderDriverTrips()}
                //         {/* <Paper className={this.props.classes.paper}>
                //             <h6 className="titleColor">Driver Trips</h6>
                //             {this.renderDriverTrips()}
                //         </Paper> */}
                //     </div>
                // </div>
            );
        } else {
            return (
                <>
                    <h6 className="titleColor">No driver trips matched the selected date</h6>
                </>
                // <div className="row">
                //     <div className="col-sm-12">
                //         <h6 className="titleColor">No driver trips matched the selected date</h6>
                //         {/* <Paper className={this.props.classes.paper}>
                //             <h6 className="titleColor">No driver trips matched the selected date</h6>
                //         </Paper> */}
                //     </div>
                // </div>
            );
        }
    }


    loader() {
        this.setState({
            submitted: true
        }
            , () => {
                setTimeout(() => this.setState({
                    submitted: false
                }), 4000);
            });
    }

    refresh() {
        this.loader();
        this.renderData();
    }

    render() {
        const { classes } = this.props;
        const { getApi, submitted } = this.state;

        const { currentDate, yesterday, dayBeforeYesterday } = this.getDateButtons();
        const { currentDate1, yesterday1, dayBeforeYesterday1 } = this.getDriverDateButtons();
        const { selectedDate, selectedDate1, tripdate } = this.state;

        return (
            <main className={classes.main}>
                <CssBaseline />
                <div style={{ height: "50px" }}>
                    <h6 className={classes.textMuted}>Dashboard
                        <span className="float-right">
                            <Button
                                color="secondary"
                                variant="outlined"
                                className={classes.button}
                                onClick={() => { this.refresh() }}
                                disabled={submitted}>
                                {
                                    (submitted && <Progress />)
                                    ||
                                    (!submitted && <Refresh />)
                                }
                            </Button>
                        </span>
                    </h6>
                </div>

                {/* Buttons to toggle between charts */}
                {/* <div className="row mb-4"> */}
                {/* Half-width for Trailers button */}
                {/* <div className="col-sm-3 d-flex justify-content-end">
                        <Button
                            variant="contained"
                            fullWidth
                            color={this.state.selectedChart === 'trailers' ? 'primary' : 'default'}
                            onClick={() => this.selectChart('trailers')}>
                            Trailers
                        </Button>
                    </div> */}

                {/* Half-width for Drivers button */}
                {/* <div className="col-sm-3 d-flex justify-content-start">
                        <Button
                            variant="contained"
                            fullWidth
                            color={this.state.selectedChart === 'drivers' ? 'primary' : 'default'}
                            onClick={() => this.selectChart('drivers')}>
                            Drivers
                        </Button>
                    </div> */}
                {/* </div> */}

                {/* Conditionally render the charts based on the selectedChart state */}
                <div className="row">
                    <div className="col-sm-6">
                        <Paper className={classes.paper}>

                            {/* Buttons to toggle between charts */}
                            <div className="row  mb-1 d-flex justify-content-center align-items-center">
                                {/* Half-width for Trailers button */}
                                <div className="col-sm-6 d-flex justify-content-center">
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        color={this.state.selectedChart === 'trailers' ? 'primary' : 'default'}
                                        onClick={() => this.selectChart('trailers')}>
                                        Trailers
                                    </Button>
                                </div>

                                {/* Half-width for Drivers button */}
                                <div className="col-sm-6 d-flex justify-content-center">
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        color={this.state.selectedChart === 'drivers' ? 'primary' : 'default'}
                                        onClick={() => this.selectChart('drivers')}>
                                        Drivers
                                    </Button>
                                </div>
                            </div>

                            <Typography className="titleColor" variant="button" component="h6" align="center">
                                {/* {this.state.selectedChart === 'trailers' ? 'Trailers' : 'Drivers'} */}
                                <br />
                                <br />
                                {this.state.selectedChart === 'trailers' ? (
                                    <>
                                        {getApi === true ? (
                                            <span className="float-right">
                                                All Trailers: {this.state.allTrailers}
                                            </span>
                                        ) : null}
                                        {this.renderTrailerChart()}
                                    </>
                                ) : (
                                    <>
                                        {getApi === true ? (
                                            <>
                                                <span className="float-left">
                                                    <span style={{ color: this.state.color1 }}>
                                                        Shift-1: {this.state.shift1Cnt}
                                                    </span>
                                                    &nbsp; - &nbsp;
                                                    <span style={{ color: this.state.color2 }}>
                                                        Shift-2: {this.state.shift2Cnt}
                                                    </span>
                                                </span>
                                                <span className="float-right">
                                                    Payroll: {this.state.onPay}
                                                </span>
                                            </>
                                        ) : null}
                                        {this.renderDriversChart()}
                                    </>
                                )}
                            </Typography>
                        </Paper>
                    </div>

                    <div className="col-sm-6">
                        <Paper className={classes.paper}>
                            <div className="row mb-4">
                                <div className="col-sm-4 d-flex justify-content-center">
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        color={selectedDate1 === "dayBeforeYesterday" ? "primary" : "default"}
                                        onClick={() => this.handleDriverDateSelection("dayBeforeYesterday")}
                                    >
                                        {dayBeforeYesterday1}
                                    </Button>
                                </div>
                                <div className="col-sm-4 d-flex justify-content-center">
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        color={selectedDate1 === "yesterday" ? "primary" : "default"}
                                        onClick={() => this.handleDriverDateSelection("yesterday")}
                                    >
                                        {yesterday1}
                                    </Button>
                                </div>
                                <div className="col-sm-4 d-flex justify-content-center">
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        color={selectedDate1 === "currentDate" ? "primary" : "default"}
                                        onClick={() => this.handleDriverDateSelection("currentDate")}
                                    >
                                        {currentDate1}
                                    </Button>
                                </div>
                            </div>

                            {/* <h6 className="titleColor">Driver Trips</h6> */}
                            {this.renderDriversBasedOnDate()}
                        </Paper>
                    </div>
                </div>

                {/* <div className="row">
                    <div className="col-sm-6">
                        <Paper className={classes.paper}>
                            <h6 className="titleColor">Trailer Performance</h6>
                            {this.renderTrailerPerformance()}
                        </Paper>
                    </div>
                    <div className="col-sm-6">
                        <Paper className={classes.paper}>
                            <h6 className="titleColor">Driver Trips</h6>
                            {this.renderDriverTrips()}
                        </Paper>
                    </div>
                </div> */}

                {/* Date buttons */}
                <div className="row mb-4">
                    <div className="col-sm-4 d-flex justify-content-center">
                        <Button
                            variant="contained"
                            fullWidth
                            color={selectedDate === "dayBeforeYesterday" ? "primary" : "default"}
                            onClick={() => this.handleDateSelection("dayBeforeYesterday")}
                        >
                            {dayBeforeYesterday}
                        </Button>
                    </div>
                    <div className="col-sm-4 d-flex justify-content-center">
                        <Button
                            variant="contained"
                            fullWidth
                            color={selectedDate === "yesterday" ? "primary" : "default"}
                            onClick={() => this.handleDateSelection("yesterday")}
                        >
                            {yesterday}
                        </Button>
                    </div>
                    <div className="col-sm-4 d-flex justify-content-center">
                        <Button
                            variant="contained"
                            fullWidth
                            color={selectedDate === "currentDate" ? "primary" : "default"}
                            onClick={() => this.handleDateSelection("currentDate")}
                        >
                            {currentDate}
                        </Button>
                    </div>
                </div>
                {this.renderTripsBasedOnDate()}

                {/* <div className="row">
                    <div className="col-sm-12">
                        <Paper className={classes.paper}>
                            <h6 className="titleColor">Trips</h6>
                            {this.renderTrips()}
                        </Paper>
                    </div>
                </div> */}
            </main>
        )
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(CEODashBoard));










// import React from 'react';
// import { connect } from "react-redux";
// import {
//     withStyles,
//     Typography,
//     Button
// } from "@material-ui/core";
// import Refresh from '@material-ui/icons/Refresh';
// import styles from "./CEODashboard.styles";
// import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
// import Paper from "@material-ui/core/es/Paper/Paper";
// import DonutChart from "../../Components/Charts/DonutChart";
// import BarChart from "../../Components/Charts/BarChart";
// import AppAPI from '../../API';
// import Constants from '../../API/constants';
// import CEODashboardActions from './+state/ceodashboard.actions';
// import Loading from "../../Components/Loading/Loading";
// import Progress from "../../Components/Loading/Progress";

// const mapStateToProps = state => ({
//     auth: state.auth,
//     state: state.CEODashboard
// });

// const mapDispatchToProps = (dispatch) => {
//     return {
//         setDriversChartData: (data) => {
//             dispatch(CEODashboardActions.SET_CEO_CHART_DATA({ data: data, key: 'drivers' }))
//         },
//         setTrailersChartData: (data) => {
//             dispatch(CEODashboardActions.SET_CEO_CHART_DATA({ data: data, key: 'trailers' }))
//         },
//         setTrailersPerformanceChartData: (data) => {
//             dispatch(CEODashboardActions.SET_CEO_CHART_DATA({ data: data, key: 'trailerPerformance' }))
//         },
//         setDriversPerformanceChartData: (data) => {
//             dispatch(CEODashboardActions.SET_CEO_CHART_DATA({ data: data, key: 'driverTrips' }))
//         },
//         setTripsPerformanceChartData: (data) => {
//             dispatch(CEODashboardActions.SET_CEO_CHART_DATA({ data: data, key: 'trips' }))
//         }
//     };
// };

// class CEODashBoard extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             errMessage: "",
//             allTrailers: "",
//             onPay: "",
//             submitted: false,
//             getApi: false,
//             time: new Date().getHours(),
//             color1: "none",
//             color2: "none",
//             selectedChart: 'trailers',

//             selectedDate: "currentDate",
//             selectedDate1: "currentDate",
//             tripsDate: "",
//             tripsDate1: "",
//             tripsDate2: "",
//             driversDate: "",
//             currentDate: "",

//             tripdate: "",
//             tripdate1: "",
//             tripdate2: "",
            
//             driverdate: "",

//             trpdata1: [],
//             trpdata2: [],
//             trpdata3: [],

//         };
//         this.refresh = this.refresh.bind(this);
//         this.selectChart = this.selectChart.bind(this);
//         this.formatTripsDate = this.formatTripsDate.bind(this);
//         this.handleDateSelection = this.handleDateSelection.bind(this);
//         this.handleDriverDateSelection = this.handleDriverDateSelection.bind(this);

//     }

//     // Handle date button click
//     handleDateSelection(dateType) {
//         this.setState({ selectedDate: dateType });
//     }

//     // Handle date button click
//     handleDriverDateSelection(dateType) {
//         this.setState({ selectedDate1: dateType });
//     }

//     formatTripsDate(dt) {
//         // Convert the string to a Date object
//         const dateObject = new Date(dt);
        
//         if (!isNaN(dateObject)) {
//             // Extract year, month, and day
//             const year = dateObject.getFullYear();
//             const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');  // Months are 0-indexed, so we add 1
//             const day = dateObject.getDate().toString().padStart(2, '0');

//             // Format the date as "YYYY-MM-DD"
//             const formattedDate = `${year}-${month}-${day}`;

//             return formattedDate;
//         } else {
//             console.error("Invalid date format:", this.state.tripsDate);
//         }

//         const date = new Date();
//         const curyear = date.getFullYear();
//         const curmonth = (date.getMonth() + 1).toString().padStart(2, '0');
//         const curday = date.getDate().toString().padStart(2, '0');

//         const curformattedDate = `${curyear}-${curmonth}-${curday}`;
//         this.setState({
//             currentDate: curformattedDate,
//         })
//     }

//     getDateButtons() {
//         const currentDate = new Date();
//         const yesterday = new Date(currentDate);
//         yesterday.setDate(currentDate.getDate() - 1);
//         const dayBeforeYesterday = new Date(currentDate);
//         dayBeforeYesterday.setDate(currentDate.getDate() - 2);

//         const formatDate = (date) => {
//             const year = date.getFullYear();
//             const month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed
//             const day = date.getDate().toString().padStart(2, '0');
//             return `${year}-${month}-${day}`;
//         };

//         return {
//             currentDate: formatDate(currentDate),
//             yesterday: formatDate(yesterday),
//             dayBeforeYesterday: formatDate(dayBeforeYesterday)
//         };
//     }

//     getDriverDateButtons() {
//         const currentDate = new Date();
//         const yesterday = new Date(currentDate);
//         yesterday.setDate(currentDate.getDate() - 1);
//         const dayBeforeYesterday = new Date(currentDate);
//         dayBeforeYesterday.setDate(currentDate.getDate() - 2);

//         const formatDate = (date) => {
//             const year = date.getFullYear();
//             const month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed
//             const day = date.getDate().toString().padStart(2, '0');
//             return `${year}-${month}-${day}`;
//         };

//         return {
//             currentDate1: formatDate(currentDate),
//             yesterday1: formatDate(yesterday),
//             dayBeforeYesterday1: formatDate(dayBeforeYesterday)
//         };
//     }

//     // Method to switch between charts
//     selectChart(chart) {
//         this.setState({ selectedChart: chart });
//     }

//     renderData() {
//         this.trailersData();
//         this.driversData();
//         this.trailersPerformance();
//         this.driversPerformance();
//         this.tripsPerformance();
//     }

//     componentDidMount() {
//         this.renderData();
//     }

//     trailersData() {
//         AppAPI.homeTrailers.get(null, null).then((result) => {
//             console.log("Trailers Data 1: ", result);
//             var totTr = result.trailers;
//             let data = [];
//             for (let key in result.trailers) {
//                 const obj = {
//                     key: Constants.strings.CFSTrailersChart[key],
//                     value: result.trailers[key]
//                 };
//                 if (key !== "all_trailers") {
//                     data.push(obj)
//                 }
//                 this.setState({
//                     allTrailers: totTr.all_trailers,
//                     getApi: true
//                 })
//             }
//             this.props.setTrailersChartData(data);
//         }).catch(e => console.log(e))
//     }

//     driversData() {
//         AppAPI.homeDrivers.get(null, null)
//             .then((result) => {
//                 console.log("Drivers Data: ", result.drivers);
//                 var totPay = result.drivers;
//                 let data = [];
//                 let time = this.state.time;
//                 if (time >= 8 && time <= 15) {
//                     for (let key in result.drivers) {
//                         const obj = {
//                             key: Constants.strings.CFSDriversDayChart[key],
//                             value: result.drivers[key]
//                         };
//                         if (key !== "on_pay" && key !== "shift1_cnt" && key !== "shift2_cnt" && key !== "shift2_leave" && key !== "shift2_absent" && key !== "date") {
//                             data.push(obj)
//                         }
//                     }
//                     this.setState({
//                         color1: "#332c6f"
//                     })
//                 } else if (time >= 15 && time <= 8) {
//                     for (let key in result.drivers) {
//                         const obj = {
//                             key: Constants.strings.CFSDriversNightChart[key],
//                             value: result.drivers[key]
//                         };
//                         if (key !== "on_pay" && key !== "shift1_cnt" && key !== "shift2_cnt" && key !== "shift1_leave" && key !== "shift1_absent" && key !== "date") {
//                             data.push(obj)
//                         }
//                     }
//                     this.setState({
//                         color2: "#332c6f"
//                     })
//                 }
//                 this.setState({
//                     onPay: totPay.on_pay,
//                     shift1Cnt: totPay.shift1_cnt,
//                     shift2Cnt: totPay.shift2_cnt,
//                     getApi: true
//                 })
//                 console.log(data, "Drivers Day Object");
//                 this.props.setDriversChartData(data);
//             }).catch(e => {
//                 if (e.code === 500) {
//                     this.setState({
//                         errMessage: e.serverMessage
//                     })
//                 }
//                 console.log(e, "Error");
//             })
//     }

//     trailersPerformance() {
//         AppAPI.homePerformanceTrailers.get(null, null).then((result) => {
//             const _resultData = result.trailers[0];
//             let data = [];
//             for (let key in _resultData) {
//                 const obj = {
//                     key: Constants.strings.CEOTrailersPerformanceChart[key],
//                     value: _resultData[key]
//                 };
//                 this.setState({
//                     getApi: true
//                 })
//                 data.push(obj)
//             }
//             this.props.setTrailersPerformanceChartData(data);
//         }).catch(e => console.log(e))
//     }

//     driversPerformance() {
//         AppAPI.homePerformanceDrivers.get(null, null).then((result) => {
//             const _resultData = result.drivers[0];
//             console.log("driversPerformance", result)
//             let data = [];
//             for (let key in _resultData) {
//                 const chartKey = Constants.strings.CEODriversPerformanceChart[key] || key;
//                 if (chartKey === "date") {
//                     this.setState({
//                         driversDate: _resultData[key],
//                     })
//                 }
//                 const obj = {
//                     key: chartKey,
//                     value: _resultData[key]
//                 };
//                 this.setState({
//                     getApi: true
//                 })
//                 data.push(obj)
//             }
//             this.props.setDriversPerformanceChartData(data);
//         }).catch(e => console.log(e))
//     }

//     tripsPerformance() {
//         AppAPI.homePerformanceTrips.get(null, null)
//             .then((result) => {
//                 const _resultData = result.trips[0];
//                 console.log("tripsPerformance-1", result.trips)
//                 console.log("tripsPerformance-2", result.trips[0])
//                 let data = [];
//                 for (let key in _resultData) {
//                     const chartKey = Constants.strings.CEOTripsPerformanceChart[key] || key;
//                     if (chartKey === "date") {
//                         this.setState({
//                             tripsDate: _resultData[key],
//                         })
//                     }
//                     const obj = {
//                         key: chartKey,
//                         value: _resultData[key]
//                     };
//                     console.log("object", obj)
//                     this.setState({
//                         getApi: true,
//                     })
//                     data.push(obj)
//                 }
//                 this.setState({
//                     trpdata1: data
//                 })
//                 // this.props.setTripsPerformanceChartData(data);
//                 this.setState({tripdate:this.formatTripsDate(this.state.tripsDate)})

//                 const _resultData1 = result.trips[1];
//                 console.log("tripsPerformance-1", result.trips)
//                 console.log("tripsPerformance-2", result.trips[1])
//                 let data1 = [];
//                 for (let key in _resultData1) {
//                     const chartKey = Constants.strings.CEOTripsPerformanceChart[key] || key;
//                     if (chartKey === "date") {
//                         this.setState({
//                             tripsDate1: _resultData1[key],
//                         })
//                     }
//                     const obj = {
//                         key: chartKey,
//                         value: _resultData1[key]
//                     };
//                     console.log("object", obj)
//                     this.setState({
//                         getApi: true,
//                     })
//                     data1.push(obj)
//                 }
//                 this.setState({
//                     trpdata2: data1
//                 })
//                 // this.props.setTripsPerformanceChartData(data1);
//                 this.setState({tripdate1:this.formatTripsDate(this.state.tripsDate1)})

//                 const _resultData2 = result.trips[2];
//                 console.log("tripsPerformance-2", result.trips[2])
//                 let data2 = [];
//                 for (let key in _resultData2) {
//                     const chartKey = Constants.strings.CEOTripsPerformanceChart[key] || key;
//                     if (chartKey === "date") {
//                         this.setState({
//                             tripsDate2: _resultData2[key],
//                         })
//                     }
//                     const obj = {
//                         key: chartKey,
//                         value: _resultData2[key]
//                     };
//                     console.log("object", obj)
//                     this.setState({
//                         getApi: true,
//                     })
//                     data2.push(obj)
//                 }
//                 this.setState({
//                     trpdata3: data2
//                 })
//                 // this.props.setTripsPerformanceChartData(data2);
//                 this.setState({tripdate2:this.formatTripsDate(this.state.tripsDate2)})
//             }).catch(e => console.log(e))
//     }

//     renderDriversChart() {
//         const chartData = this.props.state.drivers.chartData;
//         console.log("renderDriversChart", chartData)
//         return chartData.length > 0
//             ?
//             <DonutChart data={chartData} />
//             :
//             <div className="d-flex justify-content-center">
//                 <Loading />
//             </div>;
//     }

//     renderTrailerChart() {
//         const chartData = this.props.state.trailers.chartData;
//         console.log("renderTrailerChart", chartData)
//         return chartData.length > 0
//             ?
//             <DonutChart data={chartData} />
//             :
//             <div className="d-flex justify-content-center">
//                 <Loading />
//             </div>;
//     }

//     renderTrailerPerformance() {
//         const chartData = this.props.state.trailerPerformance.chartData;
//         return chartData.length > 0
//             ?
//             <BarChart data={chartData} />
//             :
//             <div className="d-flex justify-content-center">
//                 <Loading />
//             </div>;
//     }

//     renderDriverTrips() {
//         const chartData = this.props.state.driverTrips.chartData;

//         const filteredChartData = chartData.filter(entry => {
//             const hasDate = entry.key !== "date" && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(entry.value);

//             return hasDate;
//         });
//         const filteredChartData1 = filteredChartData.map(entry => ({
//             ...entry,
//             key: entry.key === undefined || entry.key === "driver_5" ? 'Five Trips' : entry.key,
//             value: typeof entry.value === 'string' ? Number(entry.value) : entry.value
//         }));

//         return filteredChartData1.length > 0
//             ? <BarChart data={filteredChartData1} />
//             : (
//                 <div className="d-flex justify-content-center">
//                     <Loading />
//                 </div>
//             );
//     }

//     // renderDriverTrips() {
//     //     const chartData = this.props.state.driverTrips.chartData;
//     //     return chartData.length > 0
//     //         ?
//     //         <BarChart data={chartData} />
//     //         :
//     //         <div className="d-flex justify-content-center">
//     //             <Loading />
//     //         </div>;
//     // }

//     renderTrips() {
//         const chartData = this.props.state.trips.chartData;
//         const chartData1 = this.props.state.trailerPerformance.chartData;

//         const combinedChartData = [...chartData, ...chartData1];

//         console.log("chartDataTrips", chartData);
//         // console.log("chartDatatrailerPerformance", chartData1);
//         console.log("combinedChartData", combinedChartData);
//         // console.log("tripdate", this.state.tripdate);
//         // console.log("currentdate", this.state.currentDate);



//         const colors = ["#c9a3d7", "#a9b1e0", "#85d7b1", "#f7e4ab", "#f3c5a8", "#e07362", "#f7e4bc", "#ffcc5c"];
//         const items = ["Planned", "Loaded", "Empty", "Assigned", "Completed", "Pending", "Trips Done", "Diesel Issued"];

//         return chartData.length > 0
//             ? (
//                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                     {combinedChartData
//                         .filter(item => item.value !== null && item.key !== "Probability" && item.key !== "date" && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(item.value))
//                         .map((item, index) => (
//                             <div
//                                 key={index}
//                                 style={{
//                                     display: 'flex',
//                                     flexDirection: 'column', // Stack box and text in a column
//                                     alignItems: 'center',
//                                 }}
//                             >
//                                 <div
//                                     key={index}
//                                     style={{
//                                         width: '100px',
//                                         height: '25px',
//                                         flex: '1',
//                                         backgroundColor: colors[index],
//                                         margin: '0 5px',
//                                         padding: '10px',
//                                         textAlign: 'center',
//                                         borderRadius: '4px'
//                                     }}
//                                 >
//                                     <Typography variant="h5" style={{ color: '#333' }}>
//                                         {item.value}
//                                     </Typography>
//                                 </div>
//                                 <div>
//                                     <Typography variant="subtitle1" style={{ color: '#555' }}>
//                                         {items[index]}
//                                     </Typography>
//                                 </div>
//                             </div>
//                         ))}
//                 </div>
//             )
//             : (
//                 <div className="d-flex justify-content-center">
//                     <Loading />
//                 </div>
//             );
//     }

//     // renderTrips() {
//     //     const chartData = this.props.state.trips.chartData;
//     //     console.log("renderTrips", chartData)
//     //     return chartData.length > 0
//     //         ?
//     //         <BarChart data={chartData} />
//     //         :
//     //         <div className="d-flex justify-content-center">
//     //             <Loading />
//     //         </div>;
//     // }

//     // Function to render trips or display no match message
//     renderTripsBasedOnDate() {
//         const { currentDate, yesterday, dayBeforeYesterday } = this.getDateButtons();
//         const { selectedDate, tripdate, tripdate1, tripdate2, trpdata1, trpdata2, trpdata3 } = this.state;

//         console.log("trpdata1",this.state.trpdata1);


//         const selectedTripDate =
//             selectedDate === "currentDate" ? currentDate :
//                 selectedDate === "yesterday" ? yesterday :
//                     dayBeforeYesterday;

//         // Check if tripdate matches the selected date
//         if (tripdate === selectedTripDate) {
//             return (
//                 <div className="row">
//                     <div className="col-sm-12">
//                         <Paper className={this.props.classes.paper}>
//                             <h6 className="titleColor">Trips</h6>
//                             {this.props.setTripsPerformanceChartData(trpdata1 && trpdata1)}
//                             {this.renderTrips()}
//                         </Paper>
//                     </div>
//                 </div>
//             );
//         } else if (tripdate1 === selectedTripDate) {
//             return (
//                 <div className="row">
//                     <div className="col-sm-12">
//                         <Paper className={this.props.classes.paper}>
//                             <h6 className="titleColor">Trips</h6>
//                             {this.props.setTripsPerformanceChartData(trpdata2 && trpdata2)}
//                             {this.renderTrips()}
//                         </Paper>
//                     </div>
//                 </div>
//             );
//         } else if (tripdate2 === selectedTripDate) {
//             return (
//                 <div className="row">
//                     <div className="col-sm-12">
//                         <Paper className={this.props.classes.paper}>
//                             <h6 className="titleColor">Trips</h6>
//                             {this.props.setTripsPerformanceChartData(trpdata3 && trpdata3)}
//                             {this.renderTrips()}
//                         </Paper>
//                     </div>
//                 </div>
//             );
//         } else {
//             return (
//                 <div className="row">
//                     <div className="col-sm-12">
//                         <Paper className={this.props.classes.paper}>
//                             <h6 className="titleColor">No trips matched the selected date</h6>
//                         </Paper>
//                     </div>
//                 </div>
//             );
//         }
//     }

//     // Function to render trips or display no match message
//     renderDriversBasedOnDate() {
//         const { currentDate1, yesterday1, dayBeforeYesterday1 } = this.getDriverDateButtons();
//         const { selectedDate1, driverdate } = this.state;

//         const selectedDriverDate =
//             selectedDate1 === "currentDate" ? currentDate1 :
//                 selectedDate1 === "yesterday" ? yesterday1 :
//                     dayBeforeYesterday1;

//         // Check if tripdate matches the selected date
//         if (driverdate === selectedDriverDate) {
//             return (
//                 <>
//                     <h6 className="titleColor">Driver Trips</h6>
//                     {this.renderDriverTrips()}
//                 </>

//                 // <div className="row">
//                 //     <div className="col-sm-12">
//                 //         {this.renderDriverTrips()}
//                 //         {/* <Paper className={this.props.classes.paper}>
//                 //             <h6 className="titleColor">Driver Trips</h6>
//                 //             {this.renderDriverTrips()}
//                 //         </Paper> */}
//                 //     </div>
//                 // </div>
//             );
//         } else {
//             return (
//                 <>
//                     <h6 className="titleColor">No driver trips matched the selected date</h6>
//                 </>
//                 // <div className="row">
//                 //     <div className="col-sm-12">
//                 //         <h6 className="titleColor">No driver trips matched the selected date</h6>
//                 //         {/* <Paper className={this.props.classes.paper}>
//                 //             <h6 className="titleColor">No driver trips matched the selected date</h6>
//                 //         </Paper> */}
//                 //     </div>
//                 // </div>
//             );
//         }
//     }


//     loader() {
//         this.setState({
//             submitted: true
//         }
//             , () => {
//                 setTimeout(() => this.setState({
//                     submitted: false
//                 }), 4000);
//             });
//     }

//     refresh() {
//         this.loader();
//         this.renderData();
//     }

//     render() {
//         const { classes } = this.props;
//         const { getApi, submitted } = this.state;

//         const { currentDate, yesterday, dayBeforeYesterday } = this.getDateButtons();
//         const { currentDate1, yesterday1, dayBeforeYesterday1 } = this.getDriverDateButtons();
//         const { selectedDate, selectedDate1, tripdate } = this.state;

//         return (
//             <main className={classes.main}>
//                 <CssBaseline />
//                 <div style={{ height: "50px" }}>
//                     <h6 className={classes.textMuted}>Dashboard
//                         <span className="float-right">
//                             <Button
//                                 color="secondary"
//                                 variant="outlined"
//                                 className={classes.button}
//                                 onClick={() => { this.refresh() }}
//                                 disabled={submitted}>
//                                 {
//                                     (submitted && <Progress />)
//                                     ||
//                                     (!submitted && <Refresh />)
//                                 }
//                             </Button>
//                         </span>
//                     </h6>
//                 </div>

//                 {/* Buttons to toggle between charts */}
//                 {/* <div className="row mb-4"> */}
//                 {/* Half-width for Trailers button */}
//                 {/* <div className="col-sm-3 d-flex justify-content-end">
//                         <Button
//                             variant="contained"
//                             fullWidth
//                             color={this.state.selectedChart === 'trailers' ? 'primary' : 'default'}
//                             onClick={() => this.selectChart('trailers')}>
//                             Trailers
//                         </Button>
//                     </div> */}

//                 {/* Half-width for Drivers button */}
//                 {/* <div className="col-sm-3 d-flex justify-content-start">
//                         <Button
//                             variant="contained"
//                             fullWidth
//                             color={this.state.selectedChart === 'drivers' ? 'primary' : 'default'}
//                             onClick={() => this.selectChart('drivers')}>
//                             Drivers
//                         </Button>
//                     </div> */}
//                 {/* </div> */}

//                 {/* Conditionally render the charts based on the selectedChart state */}
//                 <div className="row">
//                     <div className="col-sm-6">
//                         <Paper className={classes.paper}>

//                             {/* Buttons to toggle between charts */}
//                             <div className="row  mb-1 d-flex justify-content-center align-items-center">
//                                 {/* Half-width for Trailers button */}
//                                 <div className="col-sm-6 d-flex justify-content-center">
//                                     <Button
//                                         variant="contained"
//                                         fullWidth
//                                         color={this.state.selectedChart === 'trailers' ? 'primary' : 'default'}
//                                         onClick={() => this.selectChart('trailers')}>
//                                         Trailers
//                                     </Button>
//                                 </div>

//                                 {/* Half-width for Drivers button */}
//                                 <div className="col-sm-6 d-flex justify-content-center">
//                                     <Button
//                                         variant="contained"
//                                         fullWidth
//                                         color={this.state.selectedChart === 'drivers' ? 'primary' : 'default'}
//                                         onClick={() => this.selectChart('drivers')}>
//                                         Drivers
//                                     </Button>
//                                 </div>
//                             </div>

//                             <Typography className="titleColor" variant="button" component="h6" align="center">
//                                 {/* {this.state.selectedChart === 'trailers' ? 'Trailers' : 'Drivers'} */}
//                                 <br />
//                                 <br />
//                                 {this.state.selectedChart === 'trailers' ? (
//                                     <>
//                                         {getApi === true ? (
//                                             <span className="float-right">
//                                                 All Trailers: {this.state.allTrailers}
//                                             </span>
//                                         ) : null}
//                                         {this.renderTrailerChart()}
//                                     </>
//                                 ) : (
//                                     <>
//                                         {getApi === true ? (
//                                             <>
//                                                 <span className="float-left">
//                                                     <span style={{ color: this.state.color1 }}>
//                                                         Shift-1: {this.state.shift1Cnt}
//                                                     </span>
//                                                     &nbsp; - &nbsp;
//                                                     <span style={{ color: this.state.color2 }}>
//                                                         Shift-2: {this.state.shift2Cnt}
//                                                     </span>
//                                                 </span>
//                                                 <span className="float-right">
//                                                     Payroll: {this.state.onPay}
//                                                 </span>
//                                             </>
//                                         ) : null}
//                                         {this.renderDriversChart()}
//                                     </>
//                                 )}
//                             </Typography>
//                         </Paper>
//                     </div>

//                     <div className="col-sm-6">
//                         <Paper className={classes.paper}>
//                             <div className="row mb-4">
//                                 <div className="col-sm-4 d-flex justify-content-center">
//                                     <Button
//                                         variant="contained"
//                                         fullWidth
//                                         color={selectedDate1 === "dayBeforeYesterday" ? "primary" : "default"}
//                                         onClick={() => this.handleDriverDateSelection("dayBeforeYesterday")}
//                                     >
//                                         {dayBeforeYesterday1}
//                                     </Button>
//                                 </div>
//                                 <div className="col-sm-4 d-flex justify-content-center">
//                                     <Button
//                                         variant="contained"
//                                         fullWidth
//                                         color={selectedDate1 === "yesterday" ? "primary" : "default"}
//                                         onClick={() => this.handleDriverDateSelection("yesterday")}
//                                     >
//                                         {yesterday1}
//                                     </Button>
//                                 </div>
//                                 <div className="col-sm-4 d-flex justify-content-center">
//                                     <Button
//                                         variant="contained"
//                                         fullWidth
//                                         color={selectedDate1 === "currentDate" ? "primary" : "default"}
//                                         onClick={() => this.handleDriverDateSelection("currentDate")}
//                                     >
//                                         {currentDate1}
//                                     </Button>
//                                 </div>
//                             </div>

//                             {/* <h6 className="titleColor">Driver Trips</h6> */}
//                             {this.renderDriversBasedOnDate()}
//                         </Paper>
//                     </div>
//                 </div>

//                 {/* <div className="row">
//                     <div className="col-sm-6">
//                         <Paper className={classes.paper}>
//                             <h6 className="titleColor">Trailer Performance</h6>
//                             {this.renderTrailerPerformance()}
//                         </Paper>
//                     </div>
//                     <div className="col-sm-6">
//                         <Paper className={classes.paper}>
//                             <h6 className="titleColor">Driver Trips</h6>
//                             {this.renderDriverTrips()}
//                         </Paper>
//                     </div>
//                 </div> */}

//                 {/* Date buttons */}
//                 <div className="row mb-4">
//                     <div className="col-sm-4 d-flex justify-content-center">
//                         <Button
//                             variant="contained"
//                             fullWidth
//                             color={selectedDate === "dayBeforeYesterday" ? "primary" : "default"}
//                             onClick={() => this.handleDateSelection("dayBeforeYesterday")}
//                         >
//                             {dayBeforeYesterday}
//                         </Button>
//                     </div>
//                     <div className="col-sm-4 d-flex justify-content-center">
//                         <Button
//                             variant="contained"
//                             fullWidth
//                             color={selectedDate === "yesterday" ? "primary" : "default"}
//                             onClick={() => this.handleDateSelection("yesterday")}
//                         >
//                             {yesterday}
//                         </Button>
//                     </div>
//                     <div className="col-sm-4 d-flex justify-content-center">
//                         <Button
//                             variant="contained"
//                             fullWidth
//                             color={selectedDate === "currentDate" ? "primary" : "default"}
//                             onClick={() => this.handleDateSelection("currentDate")}
//                         >
//                             {currentDate}
//                         </Button>
//                     </div>
//                 </div>
//                 {this.renderTripsBasedOnDate()}

//                 {/* <div className="row">
//                     <div className="col-sm-12">
//                         <Paper className={classes.paper}>
//                             <h6 className="titleColor">Trips</h6>
//                             {this.renderTrips()}
//                         </Paper>
//                     </div>
//                 </div> */}
//             </main>
//         )
//     };
// }

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(withStyles(styles)(CEODashBoard));







// import React from 'react';
// import { connect } from "react-redux";
// import {
//     withStyles,
//     Typography,
//     Button
// } from "@material-ui/core";
// import Refresh from '@material-ui/icons/Refresh';
// import styles from "./CEODashboard.styles";
// import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
// import Paper from "@material-ui/core/es/Paper/Paper";
// import DonutChart from "../../Components/Charts/DonutChart";
// import BarChart from "../../Components/Charts/BarChart";
// import AppAPI from '../../API';
// import Constants from '../../API/constants';
// import CEODashboardActions from './+state/ceodashboard.actions';
// import Loading from "../../Components/Loading/Loading";
// import Progress from "../../Components/Loading/Progress";

// const mapStateToProps = state => ({
//     auth: state.auth,
//     state: state.CEODashboard
// });

// const mapDispatchToProps = (dispatch) => {
//     return {
//         setDriversChartData: (data) => {
//             dispatch(CEODashboardActions.SET_CEO_CHART_DATA({ data: data, key: 'drivers' }))
//         },
//         setTrailersChartData: (data) => {
//             dispatch(CEODashboardActions.SET_CEO_CHART_DATA({ data: data, key: 'trailers' }))
//         },
//         setTrailersPerformanceChartData: (data) => {
//             dispatch(CEODashboardActions.SET_CEO_CHART_DATA({ data: data, key: 'trailerPerformance' }))
//         },
//         setDriversPerformanceChartData: (data) => {
//             dispatch(CEODashboardActions.SET_CEO_CHART_DATA({ data: data, key: 'driverTrips' }))
//         },
//         setTripsPerformanceChartData: (data) => {
//             dispatch(CEODashboardActions.SET_CEO_CHART_DATA({ data: data, key: 'trips' }))
//         }
//     };
// };

// class CEODashBoard extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             errMessage: "",
//             allTrailers: "",
//             onPay: "",
//             submitted: false,
//             getApi: false,
//             time: new Date().getHours(),
//             color1: "none",
//             color2: "none"
//         };
//         this.refresh = this.refresh.bind(this);
//     }

//     renderData() {
//         this.trailersData();
//         this.driversData();
//         this.trailersPerformance();
//         this.driversPerformance();
//         this.tripsPerformance();
//     }

//     componentDidMount() {
//         this.renderData();
//     }

//     trailersData() {
//         AppAPI.homeTrailers.get(null, null).then((result) => {
//             console.log("Trailers Data 1: ", result);
//             var totTr = result.trailers;
//             let data = [];
//             for (let key in result.trailers) {
//                 const obj = {
//                     key: Constants.strings.CFSTrailersChart[key],
//                     value: result.trailers[key]
//                 };
//                 if (key !== "all_trailers") {
//                     data.push(obj)
//                 }
//                 this.setState({
//                     allTrailers: totTr.all_trailers,
//                     getApi: true
//                 })
//             }
//             this.props.setTrailersChartData(data);
//         }).catch(e => console.log(e))
//     }

//     driversData() {
//         AppAPI.homeDrivers.get(null, null)
//             .then((result) => {
//                 console.log("Drivers Data: ", result.drivers);
//                 var totPay = result.drivers;
//                 let data = [];
//                 let time = this.state.time;
//                 if (time >= 8 && time <= 20) {
//                     for (let key in result.drivers) {
//                         const obj = {
//                             key: Constants.strings.CFSDriversDayChart[key],
//                             value: result.drivers[key]
//                         };
//                         if (key !== "on_pay" && key !== "shift1_cnt" && key !== "shift2_cnt" && key !== "shift2_leave" && key !== "shift2_absent" && key !== "date") {
//                             data.push(obj)
//                         }
//                     }
//                     this.setState({
//                         color1: "#332c6f"
//                     })
//                 } else if (time >= 20 && time <= 8) {
//                     for (let key in result.drivers) {
//                         const obj = {
//                             key: Constants.strings.CFSDriversNightChart[key],
//                             value: result.drivers[key]
//                         };
//                         if (key !== "on_pay" && key !== "shift1_cnt" && key !== "shift2_cnt" && key !== "on_leave" && key !== "on_absent" && key !== "date") {
//                             data.push(obj)
//                         }
//                     }
//                     this.setState({
//                         color2: "#332c6f"
//                     })
//                 }
//                 this.setState({
//                     onPay: totPay.on_pay,
//                     shift1Cnt: totPay.shift1_cnt,
//                     shift2Cnt: totPay.shift2_cnt,
//                     getApi: true
//                 })
//                 console.log(data, "Drivers Day Object");
//                 this.props.setDriversChartData(data);
//             }).catch(e => {
//                 if (e.code === 500) {
//                     this.setState({
//                         errMessage: e.serverMessage
//                     })
//                 }
//                 console.log(e, "Error");
//             })
//     }

//     trailersPerformance() {
//         AppAPI.homePerformanceTrailers.get(null, null).then((result) => {
//             const _resultData = result.trailers[0];
//             let data = [];
//             for (let key in _resultData) {
//                 const obj = {
//                     key: Constants.strings.CEOTrailersPerformanceChart[key],
//                     value: _resultData[key]
//                 };
//                 this.setState({
//                     getApi: true
//                 })
//                 data.push(obj)
//             }
//             this.props.setTrailersPerformanceChartData(data);
//         }).catch(e => console.log(e))
//     }

//     driversPerformance() {
//         AppAPI.homePerformanceDrivers.get(null, null).then((result) => {
//             const _resultData = result.drivers[0];
//             let data = [];
//             for (let key in _resultData) {
//                 const obj = {
//                     key: Constants.strings.CEODriversPerformanceChart[key],
//                     value: _resultData[key]
//                 };
//                 this.setState({
//                     getApi: true
//                 })
//                 data.push(obj)
//             }
//             this.props.setDriversPerformanceChartData(data);
//         }).catch(e => console.log(e))
//     }

//     tripsPerformance() {
//         AppAPI.homePerformanceTrips.get(null, null)
//             .then((result) => {
//                 const _resultData = result.trips[0];
//                 let data = [];
//                 for (let key in _resultData) {
//                     const obj = {
//                         key: Constants.strings.CEOTripsPerformanceChart[key],
//                         value: _resultData[key]
//                     };
//                     this.setState({
//                         getApi: true
//                     })
//                     data.push(obj)
//                 }
//                 this.props.setTripsPerformanceChartData(data);
//             }).catch(e => console.log(e))
//     }

//     renderDriversChart() {
//         const chartData = this.props.state.drivers.chartData;
//         return chartData.length > 0
//             ?
//             <DonutChart data={chartData} />
//             :
//             <div className="d-flex justify-content-center">
//                 <Loading />
//             </div>;
//     }

//     renderTrailerChart() {
//         const chartData = this.props.state.trailers.chartData;
//         return chartData.length > 0
//             ?
//             <DonutChart data={chartData} />
//             :
//             <div className="d-flex justify-content-center">
//                 <Loading />
//             </div>;
//     }

//     renderTrailerPerformance() {
//         const chartData = this.props.state.trailerPerformance.chartData;
//         return chartData.length > 0
//             ?
//             <BarChart data={chartData} />
//             :
//             <div className="d-flex justify-content-center">
//                 <Loading />
//             </div>;
//     }

//     renderDriverTrips() {
//         const chartData = this.props.state.driverTrips.chartData;
//         return chartData.length > 0
//             ?
//             <BarChart data={chartData} />
//             :
//             <div className="d-flex justify-content-center">
//                 <Loading />
//             </div>;
//     }

//     renderTrips() {
//         const chartData = this.props.state.trips.chartData;
//         return chartData.length > 0
//             ?
//             <BarChart data={chartData} />
//             :
//             <div className="d-flex justify-content-center">
//                 <Loading />
//             </div>;
//     }

//     loader() {
//         this.setState({
//             submitted: true
//         }
//             , () => {
//                 setTimeout(() => this.setState({
//                     submitted: false
//                 }), 4000);
//             });
//     }

//     refresh() {
//         this.loader();
//         this.renderData();
//     }

//     render() {
//         const { classes } = this.props;
//         const { getApi, submitted } = this.state;
//         return (
//             <main className={classes.main}>
//                 <CssBaseline />
//                 <div style={{ height: "50px" }}>
//                     <h6 className={classes.textMuted}>Dashboard
//                         <span className="float-right">
//                             <Button
//                                 color="secondary"
//                                 variant="outlined"
//                                 className={classes.button}
//                                 onClick={() => { this.refresh() }}
//                                 disabled={submitted}>
//                                 {
//                                     (submitted && <Progress />)
//                                     ||
//                                     (!submitted && <Refresh />)
//                                 }
//                             </Button>
//                         </span>
//                     </h6>
//                 </div>
//                 <div className="row">
//                     <div className="col-sm-6">
//                         <Paper className={classes.paper}>
//                             <Typography className="titleColor" variant="button" component="h6" align="center">
//                                 Trailers
//                                 <br />
//                                 <br />
//                                 {getApi === true ? <span className="float-right" >All Trailers: {this.state.allTrailers}</span> : null}
//                                 {this.renderTrailerChart()}
//                             </Typography>
//                         </Paper>
//                     </div>
//                     <div className="col-sm-6">
//                         <Paper className={classes.paper}>
//                             <Typography className="titleColor" variant="button" component="h6" align="center">
//                                 Drivers
//                                 <br />
//                                 <br />
//                                 {
//                                     getApi === true ?
//                                         <>
//                                             <span className="float-left">
//                                                 <span
//                                                     style={{ color: this.state.color1 }}
//                                                 >Shift-1: {this.state.shift1Cnt}</span>
//                                                 &nbsp;
//                                                 -
//                                                 &nbsp;
//                                                 <span
//                                                     style={{ color: this.state.color2 }}
//                                                 >Shift-2: {this.state.shift2Cnt}</span>
//                                             </span>
//                                             <span className="float-right">Payroll: {this.state.onPay}</span>
//                                         </>
//                                         :
//                                         null
//                                 }
//                                 {/* { getApi === true ? <span className="float-right" >Payroll: {this.state.onPay}</span> : null}                                 */}
//                                 {this.renderDriversChart()}
//                             </Typography>
//                         </Paper>
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-sm-6">
//                         <Paper className={classes.paper}>
//                             <h6 className="titleColor">Trailer Performance</h6>
//                             {this.renderTrailerPerformance()}
//                         </Paper>
//                     </div>
//                     <div className="col-sm-6">
//                         <Paper className={classes.paper}>
//                             <h6 className="titleColor">Driver Trips</h6>
//                             {this.renderDriverTrips()}
//                         </Paper>
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-sm-12">
//                         <Paper className={classes.paper}>
//                             <h6 className="titleColor">Trips</h6>
//                             {this.renderTrips()}
//                         </Paper>
//                     </div>
//                 </div>
//             </main>
//         )
//     };
// }

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(withStyles(styles)(CEODashBoard));