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

class ScheduledTrips extends Component {
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
            page: 0,
            rowsPerPage: 5,
            open: false,
            selectedModal: "",
            message: "",
            status:"",
            submitted: false,
            errMessage: ""
        }
        this.modifyDetails = this.modifyDetails.bind(this);
        this.updateModal = this.updateModal.bind(this);
        this.closeTrip = this.closeTrip.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.updateTrip = this.updateTrip.bind(this);
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

    componentDidMount() {
        this.getScheduledTripsData();
    } 

    updateTrip(id, data) {
        AppAPI.tripUpdate.put('/' + id, data).then((resp) => {
            console.log(resp, "Scheduled Update Data");
            this.closeTrip(true);
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

    closeTrip(isFetch) {
        if (isFetch) {
            this.getScheduledTripsData();
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

        // return 
        // (data !== null || data !== "" 
        // ? 
        // moment(data).format("DD/MM/YYYY h:mm:ss A") 
        // : 
        // null);
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
                            {/* <Button 
                                variant="contained"
                                className={classes.button}>
                                <Delete color="action" />    
                            </Button>  */}
                        </div>                                                                      
                    </TableCell>     
                </TableRow>
            )
        ) 
    }

    renderModalContent() {
        if (this.state.selectedModal === 'update') {
            return (
                <ModifyScheduledTripModal 
                    backToTrips={this.backToTrips.bind(this)} 
                    tabSelection={this.state.tabSelection} sendData={this.state.sendData}  
                    submitted = {this.state.submitted}
                    dList={this.state.dList} lList={this.state.lList} updateTrip={this.updateTrip}   
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
                        {this.state.message} Scheduled Trip Details {this.state.status}
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
                    <Table className={classes.table}>
                        <TableHead>
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

export default withStyles(tableStyles)(ScheduledTrips);