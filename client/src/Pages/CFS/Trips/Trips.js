import React, {Component} from 'react';
import { 
    withStyles,
    Button,
    Dialog,
    DialogContent,
    DialogContentText
} from '@material-ui/core';

import tripsData from './PreloadedData/trips.json';
import CompletedTrips from './Completed/CompletedTrips';
import RunningTrips from './Running/RunningTrips';
import ScheduledTrips from './Scheduled/ScheduledTrips';
import tableStyles from '../../../Styles/tableStyles';
import AppAPI from './../../../API';
import CreateScheduleTripModal from './Modals/CreateScheduleTrip.modal';
import ViewTripModal from './Modals/ViewTrip.modal.js';
import Loading from '../../../Components/Loading/Loading.js';
class Trips extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trips: tripsData,
            tabSelection: "Completed",
            rows:[],
            scheduleTrips: [],
            trailers: [],
            drivers:[],
            locations:[],
            open: false,
            submitted: false,
            message: "",
            errMessage: "",
            viewRows: [],
            getApi: false,
            getRowsApi: false,
            total: 0,
        }
        this.createModal = this.createModal.bind(this);
        this.viewModal = this.viewModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.createScheduleTrip = this.createScheduleTrip.bind(this);
        this.closeTrip = this.closeTrip.bind(this);
    } 

    getTrailersList() {
        AppAPI.trailersReport.get(null, null).then((result) => {
            console.log(result.trailers,"Trailers List");  
            let tNo = result.trailers.map(({ label }) => label)
            console.log(tNo, "No's of Trailers...........");
            this.setState({
                trailers: result.trailers
            })
            console.log("Trailer No's", this.state.trailers);
        }).catch(error => console.log(error))
    }
    
    getTripsData(){
        var data;
        AppAPI.trips.get(null, null).then((res) => {                        
            data = res.trips;               
            console.log(data, "Trips Data");
            this.setState({
                rows: data,
                getRowsApi: true
            }) 
        }).catch(e => console.log(e)) 
    }

    getDriversList() {
        AppAPI.driversList.get(null, null).then((resp) => {
            console.log(resp,"Drivers List");  
            let dNames = resp.map(({ name }) => name)
            console.log(dNames, "Names of Drivers...........");
            this.setState({
                drivers: resp
            })
        }).catch(error => console.log(error))
    }

    getEndLocList() {
        AppAPI.endLocList.get(null, null).then((resp) => {
            console.log(resp.locations, "Locations List");  
            const locs = resp.locations;
            // To get specific values from objects (Working)
            let lNames = locs.map(({ locName}) => locName )
            console.log(lNames, "Names of Locations...........");          
            this.setState({
                locations: locs
            })
        }).catch(error => console.log(error))
    } 

    getManagerTrips() {
        AppAPI.managerTrips.get(null, null).then((resp) => {
          console.log(resp.trips, "Get Manager Trips");
          this.setState({
            viewRows: resp.trips,
            getApi: true,
            total: resp.trips.length        
          })          
        }).catch((err) => console.log(err))        
      }

    componentDidMount(){
        this.getTrailersList();
        this.getTripsData();
        this.getDriversList();
        this.getEndLocList(); 
        this.getManagerTrips();
    }   

    createScheduleTrip(data) {
        console.log(data, "Print Data");
        AppAPI.scheduleCreateTrip.post(null, data).then((resp) => {
           console.log(resp, "Response"); 
           this.closeTrip(true)
           var mCreated = resp.message;
               if(resp.success === true) {                
                 this.msgUpdated();               
                 this.setState({
                     message: mCreated,
               })
           }          
        }).catch(e => {             
            if (e.code === 500) {
              this.msgUpdated();       
                this.setState({
                    errMessage: e.serverMessage
                })
            }
            console.log(e, "Error");
        })
    }

    closeTrip (isFetch) {
        if (isFetch) {
            this.getTripsData();
        }
        this.setState({
            open: false,
            selectedModal: ''
        })
    } 

    msgUpdated() {
        this.setState({
            open: true,
            submitted: false,
            selectedModal: "message",
        }, () => {
            setTimeout(() => this.setState({ 
                open: false
            }), 5000);            
        });
    }

    selectedTab(data) {
        this.setState({
            tabSelection: data
        })
    }

    createModal() {
        this.setState({
            open: true,
            selectedModal: "create"
        })
    }   

    viewModal() {
        this.setState({
            open: true,
            selectedModal: "view"
        })
    }  

    closeModal() {
        this.setState({
            open: false,
            selectedModal: ""
        })
    }

    renderApprovals() {
        let html = null;
        switch (this.state.tabSelection) {
            case 'Completed' :
                html = 
                // this.state.getRowsApi ? 
                <CompletedTrips                     
                    rows={this.state.rows} 
                    getApi = {this.state.getRowsApi}                      
                />;
                // : <Loading/>;
                break;
            case 'Running' :
                html = 
                // this.state.getRowsApi ? 
                <RunningTrips rows={this.state.rows} getApi = {this.state.getRowsApi} drivers = {this.state.drivers} locations = {this.state.locations}/>;
                // : <Loading/>;
                break;
            case 'Scheduled' :
                html = 
                // this.state.getRowsApi ? 
                <ScheduledTrips rows={this.state.rows} getApi = {this.state.getRowsApi} drivers = {this.state.drivers} locations = {this.state.locations}/>;
                //  : <Loading/> ;
                break;
            default:
                break;
        }
        return html;
    }
    
    renderModalContent() {
        if (this.state.selectedModal === 'create') {
            return (
            <CreateScheduleTripModal  
                closeModal = {this.closeModal}
                createScheduleTrip = {this.createScheduleTrip}                
                trailers = {this.state.trailers}
                drivers = {this.state.drivers}
                locations = {this.state.locations}
                submitted = {this.state.submitted}
            /> 
            );        
        } else if (this.state.selectedModal === 'view') {
            return (
                this.state.getApi
                ?
                <ViewTripModal  
                    getManagerTrips = {this.getManagerTrips}
                    closeModal = {this.closeModal}
                    createScheduleTrip = {this.createScheduleTrip}
                    rows = {this.state.viewRows}
                    getApi = {this.state.getApi}
                    total = {this.state.total}
                /> 
                :
                <Loading />
            );        
        } else if (this.state.selectedModal === 'message') {
            return (
                <DialogContentText id="alert-dialog-description" style={{padding: "24px"}}>
                  {
                  this.state.message !== ""
                  ?
                    <div>
                      <img src="/assets/icons/tick.svg" alt="Success"
                      className="img-fluied d-flex justify-content-center tick"/>
                      {this.state.message}
                    </div>
                  :
                    <div>
                      <img src="/assets/icons/notification.svg" alt="No Internet"
                      className="img-fluied d-flex justify-content-center tick"/>
                      Please, Check your Internet Connection
                    </div>
                  }  
                </DialogContentText>
              );
        } else {
            return null
        }
    }

    render() {
        const { classes } = this.props;
        const { tabSelection } = this.state;
        return (
            <div>
                <p className="titleCard createButton">
                    Menu / Trips   
                <span className="float-right">
                    <Button
                        color="secondary"
                        variant="outlined"
                        classes={{
                            root: classes.mainButton, 
                            label: classes.label,
                        }} 
                        onClick={this.viewModal}
                        >
                        View Trips
                    </Button>
                    {  
                        tabSelection === "Scheduled"
                        ?
                            <Button 
                                color="primary" 
                                variant="contained" 
                                classes={{
                                    root: classes.mainButton, 
                                    label: classes.label,
                                }} 
                                onClick={this.createModal}
                                >
                                Create Trip
                            </Button>
                        :
                        null
                    }      
                </span>
                </p>  
                <div className="row tablePad">
                    {(this.state.trips.map((item, idx) => {
                        if (this.state.tabSelection === item.title) {
                            return (
                                <div className={"col-12 col-sm-12 col-md-4 col-lg-4 text-white " + item.selectedMenu}
                                     onClick={this.selectedTab.bind(this, item.title)}>{item.title}</div>
                            );
                        }
                        return (
                            <div className="col-12 col-sm-12 col-md-4 col-lg-4 tabDesign "
                                 onClick={this.selectedTab.bind(this, item.title)}>{item.title}</div>
                        );
                    }))}
                    {this.renderApprovals()}
                </div>
                <Dialog 
                    maxWidth={"lg"}                                
                    open={this.state.open}
                    onClose={this.closeModal}
                    aria-labelledby="responsive-dialog-title"
                    classes={{paper: classes.dialogPaper}}
                    >   
                        <DialogContent style={{padding: 0}}>
                            {this.renderModalContent()}
                        </DialogContent>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(tableStyles)(Trips);