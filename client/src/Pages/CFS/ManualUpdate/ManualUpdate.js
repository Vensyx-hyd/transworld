import React, {Component} from 'react';
import { 
    withStyles,
    Dialog,
    DialogContent,
    DialogContentText
} from '@material-ui/core';

import manualTrips from './PreloadedData/manualTrips.json';

import Attendance from './Attendance/Attendance';
import Trips from './Trips/Trips';
import Mobile from './Mobile/Mobile';

import tableStyles from '../../../Styles/tableStyles';
import AppAPI from '../../../API';
import Loading from '../../../Components/Loading/Loading.js';

class ManualUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trips: manualTrips,
            tabSelection: "Attendance",
            rows:[],
            scheduleTrips: [],
            drivers:[],
            locations:[],
            open: false,
            submitted: false,
            message: "",
            errMessage: "",
            viewRows: [],
            getApi: false,
            getRowsApi: false,
            total: 0
        }
        this.closeModal = this.closeModal.bind(this);
        this.createScheduleTrip = this.createScheduleTrip.bind(this);
        this.closeTrip = this.closeTrip.bind(this);
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
        AppAPI.activeDriversSysId.get(null, null).then((resp) => {
            console.log(resp,"Drivers List");              
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

    closeModal() {
        this.setState({
            open: false,
            selectedModal: ""
        })
    }

    renderApprovals() {
        let html = null;
        switch (this.state.tabSelection) {
            case 'Attendance' :
                html = 
                <Attendance />;
                break;
            case 'Trips' :
                html = 
                <Trips 
                    rows={this.state.rows} 
                    getApi = {this.state.getRowsApi} 
                    drivers = {this.state.drivers} 
                    locations = {this.state.locations}
                />;  
                break;
            case 'Mobile' :
                html = 
                <Mobile 
                // rows={this.state.rows} getApi = {this.state.getRowsApi} drivers = {this.state.drivers} locations = {this.state.locations}
                />;
                break;
            default:
                break;
        }
        return html;
    }
    
    renderModalContent() {
        if (this.state.selectedModal === 'message') {
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
                    Menu / Manual Update                  
                </p>  
                <div className="row tablePad">
                    {(this.state.trips.map((item, idx) => {
                        if (tabSelection === item.title) {
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

export default withStyles(tableStyles)(ManualUpdate);