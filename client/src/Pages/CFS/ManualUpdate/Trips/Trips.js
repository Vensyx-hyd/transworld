import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import moment from 'moment';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableFooter,
    TableRow,
    TablePagination,
    Dialog,
    DialogContent,
    DialogContentText,
    Button
} from '@material-ui/core/';

import ModifyScheduledTripModal from './Modals/ModifyScheduledTrip.modal';
import CreateTripModal from './Modals/CreateTrip.modal';
import TablePaginationActions from '../../../../Components/TablePaginationActionsWrapped';
import tableStyles from '../../../../Styles/tableStyles';
import Loading from '../../../../Components/Loading/Loading';
import AppAPI from '../../../../API';

const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5,
    },
});

const TablePaginationActionsWrapped = withStyles(actionsStyles, {withTheme: true})(
    TablePaginationActions,
);

class Trips extends Component {
    constructor(props) {
        super(props);
        this.state = {
            getApi: false,
            rows: [],
            sendData: this.props.scheduled,
            drivers: this.props.drivers,
            dList: this.props.drivers,
            locations: this.props.locations,
            lList: this.props.locations,
            trailers: [],
            page: 0,
            rowsPerPage: 5,
            open: false,
            selectedModal: "",
            message: "",
            status:"",
            submitted: false,
            errMessage: "",
            schedule: true,
            pendency: false
        }
        this.modifyDetails = this.modifyDetails.bind(this);
        this.updateModal = this.updateModal.bind(this);
        this.closeUpdatedTrip = this.closeUpdatedTrip.bind(this);
        this.closeCreatedTrip = this.closeCreatedTrip.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.updateTrip = this.updateTrip.bind(this);
        this.createTrip = this.createTrip.bind(this);
        this.scheduleTrips = this.scheduleTrips.bind(this);
        this.pendencyData = this.pendencyData.bind(this);
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

    getScheduledTripsData(){
        AppAPI.scheduledTrips.get(null, null).then((res) => {
            const data = res.trips;            
            const scheduled = data.filter(function(trip){
                return trip.tripStatus === "TRIP_SCHEDULED";
            });           
            this.setState({
                rows: scheduled,
                getApi: true
            })                
        }).catch(e => {             
            if (e.code === 500) {
                this.updateModal();    
                this.setState({
                    errMessage: e.serverMessage
                })
            }
            console.log(e, "Error");
        }) 
    }
    
    getPendency(){
        AppAPI.pendencyData.get(null, null).then((res) => {
            console.log(res.pendency, "Pendency Data");            
            this.setState({
                rows: res.pendency,
                getApi: true
            })                
        }).catch(e => {             
            if (e.code === 500) {
                this.updateModal();    
                this.setState({
                    errMessage: e.serverMessage
                })
            }
            console.log(e, "Error");
        }) 
    }

    componentDidMount() {
        this.getScheduledTripsData(); 
        this.getTrailersList();
    } 

    scheduleTrips() {
        this.setState({
            getApi: false
        })
        this.getScheduledTripsData();
        this.setState({
            schedule: true,
            pendency: false                      
        })
    }
    
    pendencyData() {
        this.setState({
            getApi: false
        })
        this.getPendency();
        this.setState({
            pendency: true,
            schedule: false
        })
    }

    updateTrip(id, data) {
        AppAPI.pendencyUpdateTrip.put('/' + id, data).then((resp) => {
            console.log(resp, "Scheduled Update Data");
            this.closeUpdatedTrip(true);
            var mUpdated = resp.message;
            if(resp.success === true) { 
                this.updateModal();
                this.setState({
                    message: mUpdated,
                    status: resp.trips
                })               
             }
        }).catch(e => {             
            if (e.code === 500) {
                this.updateModal();    
                this.setState({
                    errMessage: e.serverMessage
                })
            }
            console.log(e, "Error");
        }) 
    }   

    createTrip(data) {
        console.log(data, "Print Data");
        AppAPI.pendencyCreateTrip.post(null, data).then((resp) => {
           console.log(resp, "Response"); 
           this.closeCreatedTrip(true);
           var mCreated = resp.message;
               if(resp.success === true) {                
                this.updateModal();             
                 this.setState({
                     message: mCreated,
               })
           }          
        }).catch(e => {             
            if (e.code === 500) {
                this.updateModal();   
                this.setState({
                    errMessage: e.serverMessage
                })
            }
            console.log(e, "Error");
        })
    }

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({page: 0, rowsPerPage: event.target.value});
    };   

    modifyDetails(data){
		this.setState({
			open: true,
            sendData: data,
            selectedModal: "update",
		})
    }

    createDetails(data){
		this.setState({
			open: true,
            sendData: data,
            selectedModal: "create",
		})
    }

    closeUpdatedTrip(isFetch) {
        if (isFetch) {
            this.getScheduledTripsData();
        }
        this.setState({
            open: false,
            selectedModal: ''
        })
    } 

    closeCreatedTrip(isFetch) {
        if (isFetch) {
            this.getPendency();
        }
        this.setState({
            open: false,
            selectedModal: ''
        })
    }

    updateModal() {
        this.setState({ 
            open: true, 
            submitted: false,
            selectedModal: "statusUpdated" 
        }, () => {
            setTimeout(() => this.setState({ 
                open: false,                
            }), 5000);            
        });
    }

	handleClose(){
		this.setState({
			open: false
		})
	}
	backToTrips(){
		this.setState({
			open: false
		})
    }

    closeModal() {
        this.setState({
            open: false,
            selectedModal: "",
        })
    }

    convert(data){
        console.log(data,'date');
        if (data !== null) {
            return moment(data).format("DD/MM/YYYY h:mm:ss A");
        } else if(data === null) {
            return null
        }
    }
    
    renderList() {
        const { classes } = this.props;
        const { getApi, rows, rowsPerPage, page } = this.state;
        return (
            getApi === false
            ?         
            <TableRow>
              <TableCell colSpan={12}>
                <div className="d-flex justify-content-center">
                  <Loading/>
                </div>
              </TableCell>
            </TableRow>  
            :
            rows.length === 0
            ?  
            <TableRow>
              <TableCell colSpan={12}>
                <div className="d-flex justify-content-center">
                  No Data Found !
                </div>
              </TableCell>
            </TableRow>   
            :
            rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, id) =>
                <TableRow key={id}>
                {
                    this.state.schedule === true
                    ?
                    <>
                        <TableCell>{id + 1}</TableCell>     
                        <TableCell>{row.tripNo}</TableCell>                   
                        <TableCell>{row.tripType === 1 ? "Empty" : row.tripType === 2 ? "Loaded" : "Empty Container"}</TableCell>
                        <TableCell>{row.startLocationName}</TableCell>
                        <TableCell>{row.endLocationName}</TableCell>
                        <TableCell>{this.convert(row.startDate)}</TableCell>
                        <TableCell>{this.convert(row.endDate)}</TableCell> 
                        <TableCell>{row.driverName}</TableCell>
                        <TableCell>{row.trailerNo}</TableCell>
                        <TableCell>  
                        <div className="d-flex justify-content-center">   
                            <Button 
                                type="submit" 
                                color="secondary" 
                                variant="outlined" 
                                classes={{
                                    root: classes.button, 
                                    label: classes.label,
                                }} 
                                onClick={() => {
                                    this.modifyDetails(row)
                                }} 
                                >                        	
                                Modify
                            </Button>
                        </div>                                                                      
                    </TableCell>
                    </>
                    :
                    <>
                        <TableCell>{id + 1}</TableCell>     
                        <TableCell>{this.convert(row.date)}</TableCell>                   
                        <TableCell>{row.cycle}</TableCell>
                        <TableCell>{row.tripType}</TableCell>
                        <TableCell>{row.startLoc}</TableCell>
                        <TableCell>{row.endLoc}</TableCell>
                        <TableCell>{row.cont1}</TableCell>
                        <TableCell>{row.cont2}</TableCell>
                        <TableCell>{row.size}</TableCell>
                        <TableCell>  
                        <div className="d-flex justify-content-center">   
                            <Button 
                                type="submit" 
                                color="secondary" 
                                variant="outlined" 
                                classes={{
                                    root: classes.button, 
                                    label: classes.label,
                                }} 
                                onClick={() => {
                                    this.createDetails(row)
                                }} 
                                >                        	
                                Assign
                            </Button>
                        </div>                                                                      
                    </TableCell>
                    </>                  
                }                   
            </TableRow>
            )
        ) 
    }

    renderModalContent() {
        if (this.state.selectedModal === 'update') {
            return (
                <ModifyScheduledTripModal 
                    sendData={this.state.sendData}  
                    trailers= {this.state.trailers}
                    backToTrips={this.backToTrips.bind(this)} 
                    tabSelection={this.state.tabSelection}                     
                    submitted = {this.state.submitted}
                    dList={this.state.dList} 
                    lList={this.state.lList} 
                    updateTrip={this.updateTrip}   
                />  
            );        
        } else if (this.state.selectedModal === 'create') {
            return (
                <CreateTripModal 
                    sendData={this.state.sendData}    
                    trailers= {this.state.trailers}                  
                    backToTrips={this.backToTrips.bind(this)} 
                    submitted = {this.state.submitted}                      
                    drivers = {this.state.drivers}
                    locations = {this.state.locations}
                    createTrip = {this.createTrip}   
                    closeModal = {this.closeModal}                 
                />  
            );        
        } else if (this.state.selectedModal === 'statusUpdated') {
            return (
            <DialogContent>
                {
                    this.state.message !== ""
                    ?
                    <DialogContentText id="alert-dialog-description">
                        <img src="/assets/icons/tick.svg" alt="Tick Mark"
                        className="img-fluied d-flex justify-content-center tick"/>
                        {this.state.message}
                    </DialogContentText>
                    :
                    <DialogContentText id="alert-dialog-description">
                        <img src="/assets/icons/notification.svg" alt="No Internet"
                        className="img-fluied d-flex justify-content-center tick"/>
                        Please, Check your Internet Connection
                    </DialogContentText>
                }
            </DialogContent>
            );
        } else {
            return null
        }
    }

    render() {
        const { classes } = this.props;
        const {rows, rowsPerPage, page} = this.state;
        return (
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                <span className="float-right">
                    <Button
                        color = {this.state.schedule === true ? "primary" : "secondary" }
                        variant = {this.state.schedule === true ? "contained" : "outlined"}
                        classes={{
                            root: classes.mainButton, 
                            label: classes.label,
                        }}                        
                        onClick={this.scheduleTrips}
                        >
                        Scheduled
                    </Button>                   
                    <Button 
                        color = {this.state.pendency === true ? "primary" : "secondary" }
                        variant = {this.state.pendency === true ? "contained" : "outlined"}
                        classes={{
                            root: classes.mainButton, 
                            label: classes.label,
                        }} 
                        onClick={this.pendencyData}
                        >
                        Pendency
                    </Button>
                </span>
                    <Table className={classes.table}>                    
                        <TableHead>
                        {
                            this.state.schedule === true
                            ?
                            <TableRow>
                                <TableCell>S.No.</TableCell>                                
                                <TableCell>Trip No.</TableCell>
                                <TableCell>Trip Type</TableCell>
                                <TableCell>Start Location</TableCell>
                                <TableCell>End Location</TableCell>
                                <TableCell>Est. Start Date Time</TableCell>
                                <TableCell>Est. End Date Time</TableCell>                               
                                <TableCell>Driver Name</TableCell>
                                <TableCell>Trailer No.</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                            :
                            <TableRow>
                                <TableCell>S.No.</TableCell>  
                                <TableCell>Berthing Date</TableCell>  
                                <TableCell>Cycle</TableCell>
                                <TableCell>Trip Type</TableCell>
                                <TableCell>Start Location</TableCell>
                                <TableCell>End Location</TableCell>                            
                                <TableCell>Container 1</TableCell>
                                <TableCell>Container 2</TableCell>
                                <TableCell>Size Type</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        }   
                        </TableHead>
                        <TableBody>
                            {this.renderList()}                  
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    className={classes.tablePagination}
                                    rowsPerPageOptions={[5, 10, 25]}
                                    colSpan={3}
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActionsWrapped}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
                <Dialog 
                    open={this.state.open}
                    onClose={() => this.closeModal(false)}
                    aria-labelledby="responsive-dialog-title"
                    classes={{paper: classes.dialogPaper}}>                    
                        {this.renderModalContent()}
                </Dialog>
            </Paper>
        );
    }
}

export default withStyles(tableStyles)(Trips);