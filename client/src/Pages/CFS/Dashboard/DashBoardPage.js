import React from 'react';
import {
    withStyles,
    Paper,
    Typography,
    Dialog,
    DialogContent,
    DialogContentText,
    Grid // Import Grid from Material-UI
} from '@material-ui/core';
import MapContainer from './MapContainer';
import NotificationsComponent from "./Notifications/NotificationsComponent";
import DonutChart from "../../../Components/Charts/DonutChart";
import { connect } from "react-redux";
import AppAPI from '../../../API';
import Constants from '../../../API/constants';
import DashboardActions from './+state/dashboard.actions';
import Loading from "../../../Components/Loading/Loading";

const styles = theme => ({
    gridRoot: {
        flexGrow: 1,
        padding: theme.spacing.unit * 2,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
[theme.breakpoints.up('sm')]: {
    // Styles for small devices and up (tablets, desktops)
    margin: theme.spacing.unit * 2,
},
[theme.breakpoints.down('xs')]: {
    // Styles for extra small devices (mobile)
    margin: theme.spacing.unit * 1,
},
    },
});

const mapStateToProps = state => ({
    auth: state.auth,
    state: state.dashboard
});

const mapDispatchToProps = (dispatch) => {
    return {
        setDriversChartData: (data) => {
            dispatch(DashboardActions.SET_CHART_DATA({ data: data, key: 'drivers' }));
        },
        setTrailersChartData: (data) => {
            dispatch(DashboardActions.SET_CHART_DATA({ data: data, key: 'trailers' }));
        }
    };
};

class DashBoardPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errMessage: "",
            allTrailers: "",
            onPay: "",
            shift1Cnt: "",
            shift2Cnt: "",
            getApi: false,
            time: new Date().getHours(),
            color1: "none",
            color2: "none"
        };
    }

    componentDidMount() {
        this.trailersData();
        this.driversData();
        this.liveTrips();
    }

    trailersData() {
        AppAPI.homeTrailers.get(null, null).then((result) => {
            let data = [];
            var totTr = result.trailers;
            console.log(result.trailers, "Dashboard Trailers Data");
            for (let key in result.trailers) {
                const obj = {
                    key: Constants.strings.CFSTrailersChart[key],
                    value: result.trailers[key]
                };
                if (key !== "all_trailers") {
                    data.push(obj);
                }
                this.setState({
                    allTrailers: totTr.all_trailers,
                    getApi: true
                });
            }
            this.props.setTrailersChartData(data);
        }).catch(e => {
            if (e.code === 500) {
                this.setState({
                    errMessage: e.serverMessage
                });
            }
            console.log(e, "Error");
        });
    }

    driversData() {
        AppAPI.homeDrivers.get(null, null).then((result) => {
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
                    if (key !== "on_pay" && key !== "shift1_cnt" && key !== "shift2_cnt" && key !== "shift2_leave" && key !== "shift2_absent" && key !== "shift2_present" && key !== "shift2_excess" && key !== "date") {
                        data.push(obj);
                    }
                }
                this.setState({
                    color1: "#332c6f"
                });
            } else if (time >= 20 && time <= 8) {
                for (let key in result.drivers) {
                    const obj = {
                        key: Constants.strings.CFSDriversNightChart[key],
                        value: result.drivers[key]
                    };
                    if (key !== "on_pay" && key !== "shift1_cnt" && key !== "shift2_cnt" && key !== "on_leave" && key !== "on_absent" && key !== "shift1_present" && key !== "shift1_excess" && key !== "date") {
                        data.push(obj);
                    }
                }
                this.setState({
                    color2: "#332c6f"
                });
            }
            this.setState({
                onPay: totPay.on_pay,
                shift1Cnt: totPay.shift1_cnt,
                shift2Cnt: totPay.shift2_cnt,
                getApi: true
            });
            console.log(data, "Drivers Day Object");
            this.props.setDriversChartData(data);
        }).catch(e => {
            if (e.code === 500) {
                this.setState({
                    errMessage: e.serverMessage
                });
            }
            console.log(e, "Error");
        });
    }

    liveTrips() {
        AppAPI.homeTrips.get(null, null).then((result) => {
            console.log(result);
        }).catch(e => {
            if (e.code === 500) {
                this.setState({
                    errMessage: e.serverMessage
                });
            }
            console.log(e, "Error");
        });
    }

    renderChart(chartData) {
        return chartData.length > 0
            ?
            <DonutChart data={chartData} />
            :
            <div className="d-flex justify-content-center">
                <Loading />
            </div>
    }

    render() {
        const { classes, state } = this.props;
        const { getApi, allTrailers } = this.state;
        return (
            <div className={classes.gridRoot}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Paper className={classes.paper}>
                                    <Typography className="titleColor" variant="h6" component="h6" align="left">
                                        Trailers availability for the day
                                        <hr />
                                        {getApi === true ? <span className="float-right" >All Trailers: {allTrailers}</span> : null}
                                        {this.renderChart(state.trailers.chartData)}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper className={classes.paper}>
                                    <Typography className="titleColor" variant="h6" component="h6" align="left">
                                        Drivers
                                        <hr />
                                        {
                                            getApi === true ?
                                                <>
                                                    <span className="float-left">
                                                        <span
                                                            style={{ color: this.state.color1 }}
                                                        >Shift-1: {this.state.shift1Cnt}</span>
                                                        &nbsp;
                                                        -
                                                        &nbsp;
                                                        <span
                                                            style={{ color: this.state.color2 }}
                                                        >Shift-2: {this.state.shift2Cnt}</span>
                                                    </span>
                                                    <span className="float-right">Payroll: {this.state.onPay}</span>
                                                </>
                                                :
                                                null
                                        }
                                        {this.renderChart(state.drivers.chartData)}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} className="pt-4 mt-2">
                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                    <Typography className="titleColor" variant="h6" component="h6" align="left">
                                        Live Tracking
                                        <hr />
                                        <MapContainer />
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper className={classes.paper}>
                            <Typography className="titleColor" variant="h6" component="h6" align="left">
                                Messages
                                <hr />
                                <NotificationsComponent />
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
                {/* <Dialog
                    open={this.state.open}
                    onClose={this.closeModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent>
                        {
                            this.state.code === 200
                                ?
                                <DialogContentText id="alert-dialog-description">
                                    <img src="/assets/icons/tick.svg" alt="Success"
                                        className="img-fluied d-flex justify-content-center tick" />
                                    Successfully Deleted Message
                                </DialogContentText>
                                :
                                <DialogContentText id="alert-dialog-description">
                                    <img src="/assets/icons/error.svg" alt="Failed"
                                        className="img-fluied d-flex justify-content-center error" />
                                    Error while Deleting Message
                                </DialogContentText>
                        }
                    </DialogContent>
                </Dialog> */}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DashBoardPage));









// import React from 'react';
// import {
//     withStyles,
//     Paper,
//     Typography,
//     Dialog,
//     DialogContent,
//     DialogContentText
// } from '@material-ui/core';
// import MapContainer from './MapContainer';
// import NotificationsComponent from "./Notifications/NotificationsComponent";
// import DonutChart from "../../../Components/Charts/DonutChart";
// import {connect} from "react-redux";
// import AppAPI from '../../../API';
// import Constants from '../../../API/constants';

// import DashboardActions from './+state/dashboard.actions';
// import Loading from "../../../Components/Loading/Loading";

// const styles = theme => ({
//     gridRoot: {
//         flexGrow: 1,
//     },
//     paper: {
//         padding: theme.spacing.unit * 2,
//         textAlign: 'center',
//         color: theme.palette.text.secondary,
//     },
// });

// const mapStateToProps = state => ({
//     auth: state.auth,
//     state: state.dashboard
// });

// const mapDispatchToProps = (dispatch) => {
//     return {
//         setDriversChartData: (data) => {
//             dispatch(DashboardActions.SET_CHART_DATA({data: data, key: 'drivers'}))
//         },
//         setTrailersChartData: (data) => {
//             dispatch(DashboardActions.SET_CHART_DATA({data: data, key: 'trailers'}))
//         }
//     };
// };
// class DashBoardPage extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             errMessage: "",
//             allTrailers: "",
//             onPay: "",
//             shift1Cnt: "",
//             shift2Cnt: "",
//             getApi: false,
//             time: new Date().getHours(),
//             color1: "none",
//             color2: "none"
//             // open: false
//         };
//         // this.openModal = this.openModal.bind(this);
//         // this.closeModal = this.closeModal.bind(this);
//     }

//     componentDidMount() {
//         this.trailersData();
//         this.driversData();
//         this.liveTrips();
//     }

//     // openModal() {
//     //     this.setState({ open: true }, () => {
//     //         setTimeout(() => this.setState({
//     //             open: false
//     //         }), 5000);
//     //     });
//     // }

//     // closeModal() {
//     //     this.setState({
//     //         open: false
//     //     })
//     // }

//     trailersData() {
//         AppAPI.homeTrailers.get(null, null).then((result) => {
//             let data = [];
//             var totTr = result.trailers;
//             console.log(result.trailers, "Dashboard Trailers Data");
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
//         }).catch(e => {
//             if (e.code === 500) {
//                 this.setState({
//                     errMessage: e.serverMessage
//                 })
//             }
//             console.log(e, "Error");
//         })
//     }

//     driversData() {
//         AppAPI.homeDrivers.get(null, null).then((result) => {
//             console.log("Drivers Data: ", result.drivers);
//             var totPay = result.drivers;
//             let data = [];
//             let time = this.state.time;
//             if (time >= 8 && time <= 20 ) {
//                 for (let key in result.drivers) {
//                     const obj = {
//                         key: Constants.strings.CFSDriversDayChart[key],
//                         value: result.drivers[key]
//                     };
//                     if (key !== "on_pay" && key !== "shift1_cnt" && key !== "shift2_cnt" && key !== "shift2_leave" && key !== "shift2_absent" && key !== "shift2_present" && key !== "shift2_excess" && key !== "date") {
//                         data.push(obj)
//                     }
//                 }
//                 this.setState({
//                     color1: "#332c6f"
//                 })
//             } else if (time >= 20 && time <= 8) {
//                 for (let key in result.drivers) {
//                     const obj = {
//                         key: Constants.strings.CFSDriversNightChart[key],
//                         value: result.drivers[key]
//                     };
//                     if (key !== "on_pay" && key !== "shift1_cnt" && key !== "shift2_cnt" && key !== "on_leave" && key !== "on_absent" && key !== "shift1_present" && key !== "shift1_excess" && key !== "date") {
//                         data.push(obj)
//                     }
//                 }
//                 this.setState({
//                     color2: "#332c6f"
//                 })
//             }
//             this.setState({
//                 onPay: totPay.on_pay,
//                 shift1Cnt: totPay.shift1_cnt,
//                 shift2Cnt: totPay.shift2_cnt,
//                 getApi: true
//             })
//             console.log(data, "Drivers Day Object");
//             this.props.setDriversChartData(data);
//         }).catch(e => {
//             if (e.code === 500) {
//                 this.setState({
//                     errMessage: e.serverMessage
//                 })
//             }
//             console.log(e, "Error");
//         })
//     }

//     liveTrips() {
//         AppAPI.homeTrips.get(null, null).then((result) => {
//             console.log(result)
//         }).catch(e => {
//             if (e.code === 500) {
//                 this.setState({
//                     errMessage: e.serverMessage
//                 })
//             }
//             console.log(e, "Error");
//         })
//     }

//     renderChart(chartData) {
//         return chartData.length > 0
//         ?
//         <DonutChart data={chartData}/>
//         :
//         <div className="d-flex justify-content-center">
//             <Loading/>
//         </div>
//     }

//     render() {
//         const {classes, state} = this.props;
//         const { getApi, allTrailers } = this.state;
//         return (
//             <div>
//                 <div className={classes.gridRoot}>
//                     <div className="row pt-2">
//                         <div className="col-sm-8">
//                             <div className="row">
//                                 <div className="col-sm-6">
//                                     <Paper className={classes.paper}>
//                                         <Typography className="titleColor" variant="button" component="h6" align="left">
//                                             Trailers availability for the day
//                                             <hr/>
//                                             { getApi === true ? <span className="float-right" >All Trailers: {allTrailers}</span> : null }
//                                             {this.renderChart(state.trailers.chartData)}
//                                         </Typography>
//                                     </Paper>
//                                 </div>
//                                 <div className="col-sm-6">
//                                     <Paper className={classes.paper}>
//                                         <Typography className="titleColor" variant="button" component="h6" align="left">
//                                             Drivers
//                                             <hr/>
//                                             {
//                                                 getApi === true ?
//                                                 <>
//                                                     <span className="float-left">
//                                                         <span
//                                                         style={{color: this.state.color1}}
//                                                         >Shift-1: {this.state.shift1Cnt}</span>
//                                                         &nbsp;
//                                                         -
//                                                         &nbsp;
//                                                         <span
//                                                         style={{color: this.state.color2}}
//                                                         >Shift-2: {this.state.shift2Cnt}</span>
//                                                     </span>
//                                                     <span className="float-right">Payroll: {this.state.onPay}</span>
//                                                 </>
//                                                 :
//                                                 null
//                                             }
//                                             {this.renderChart(state.drivers.chartData)}
//                                         </Typography>
//                                     </Paper>
//                                 </div>
//                             </div>
//                             <div className="row pt-4 mt-2">
//                                 <div className="col-sm-12">
//                                     <Paper className={classes.paper}>
//                                         <Typography className="titleColor" variant="button" component="h6" align="left">
//                                             Live Tracking
//                                             <hr/>
//                                             <MapContainer/>
//                                         </Typography>
//                                     </Paper>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="col-sm-4">
//                             <Paper className={classes.paper}>
//                                 <Typography className="titleColor" variant="button" component="h6" align="left">
//                                     Messages
//                                     <hr/>
//                                     <NotificationsComponent openModal={this.openModal} />
//                                 </Typography>
//                             </Paper>
//                         </div>
//                     </div>
//                 </div>
//                 {/* <Dialog
//                     open={this.state.open}
//                     onClose={this.closeModal}
//                     aria-labelledby="alert-dialog-title"
//                     aria-describedby="alert-dialog-description"
//                     >
//                     <DialogContent>
//                     {
//                         this.state.code === 200
//                         ?
//                         <DialogContentText id="alert-dialog-description">
//                             <img src="/assets/icons/tick.svg" alt="Success"
//                             className="img-fluied d-flex justify-content-center tick"/>
//                             Successfully Deleted Message
//                         </DialogContentText>
//                         :
//                         <DialogContentText id="alert-dialog-description">
//                             <img src="/assets/icons/notification.svg" alt="No Internet"
//                             className="img-fluied d-flex justify-content-center tick"/>
//                             Please, Check your Internet Connection
//                         </DialogContentText>
//                     }
//                     </DialogContent>
//                 </Dialog> */}
//             </div>
//         );
//     }
// }

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(withStyles(styles)(DashBoardPage));
