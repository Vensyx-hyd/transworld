import React, {Component} from 'react';
import {connect} from "react-redux";
import {withStyles} from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Dialog,
    DialogContent,
    Toolbar,
    Button,
    DialogContentText,
} from '@material-ui/core/';

import Loading from '../../../Components/Loading/Loading';
import TablePaginationActions from '../../../Components/TablePaginationActionsWrapped';
import CreateTripModal from './Modals/CreateTrip.modal';
import ModifyTripModal from './Modals/ModifyTrip.modal';
import tableStyles from '../../../Styles/tableStyles';
import AdminManageTripsActions from './+state/admin.trips.actions';
import AppAPI from '../../../API';

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

const mapStateToProps = state => ({
    auth: state.auth,
    state: state.adminManageTrips
});

const mapDispatchToProps = (dispatch) => {
    return {
        setTripsData: (data) => {
            dispatch(AdminManageTripsActions.SET_ADMIN_MANAGE_TRIPS_DATA(data))
        }
    }
};

class ManageTrips extends Component {
    constructor(props) {
        super(props);
        this.state = {
            getApi: false,
            rows: [],
            locations: [],
            tripType:"",
            page: 0,
            rowsPerPage: 5,
            open: false,
            selectedModal: "",
            selectedRow: {},
            status: "",
            message: "",
            errMessage: ""
        };
        this.createTrip = this.createTrip.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeTrip = this.closeTrip.bind(this);
        this.messageModal = this.messageModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.modifyTrip = this.modifyTrip.bind(this);
    }

    getTrips() {
        AppAPI.adminManageTrips.get(null, null).then((resp) => {
            console.log(resp.trips, "CREATED TRIPS");
            this.props.setTripsData(resp.trips)
            this.setState({
                rows: resp.trips,
                tripType: resp.trips.tripTypeId,
                getApi: true
            })
        }).catch(e => {             
            if (e.code === 500) {
                this.messageModal();   
                this.setState({
                    errMessage: e.serverMessage
                })
            }
            console.log(e, "Error");
        })
    }

    getLocations() {
        AppAPI.endLocList.get(null, null).then((resp) => {
            console.log(resp.locations, "Locations List");
            this.setState({
                locations: resp.locations
            })
        }).catch(error => console.log(error))
    } 

    componentWillMount() {
        this.getTrips();
        this.getLocations();
        return this.state.tripType === 1 ? "Empty" : this.state.tripType === 2 ? "Loaded" : "Empty Container"
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
    };    

    createTrip(data) {
        AppAPI.adminManageTrips.post(null, data).then((resp) => {
            console.log(resp, "Create Trips");
            this.closeTrip(true)
            var mCreated = resp.message;
                if(resp.success === true) {                
                this.messageModal();               
                this.setState({
                    status: resp.trips,
                    message: mCreated,
                })
            } 
        }).catch(e => {             
            if (e.code === 500) {
                this.messageModal();   
                this.setState({
                    errMessage: e.serverMessage
                })
            }
            console.log(e, "Error");
        })
        this.getTrips();
    }

    modifyTrip(id, data) {
        console.log(data, "Before Update Data................");
        AppAPI.adminManageTrips.put('/' + id, data).then((resp) => {
            console.log(resp, "Update Data");
            this.closeTrip(true);
            var mUpdated = resp.message;
            if(resp.success === true) {                
                this.messageModal();
                this.setState({
                    status: resp.trips,
                    message: mUpdated,
                })               
             }
        }).catch(e => {             
            if (e.code === 500) {
                this.messageModal();   
                this.setState({
                    errMessage: e.serverMessage
                })
            }
            console.log(e, "Error");
        })
        this.getTrips();
    }    

    messageModal() {
        this.setState({ 
            open: true, 
            selectedModal: "message" 
        }, () => {
            setTimeout(() => this.setState({ 
                open: false,                
            }), 5000);            
        });
    }   

    closeModal() {
        this.setState({
            open: false,
            selectedModal: "",
        })
    }

    openModal() {
        this.setState({
            open: true,
            selectedModal: "create"
        })
    }    

    modifyDetails(data) {
        this.setState({
            open: true,
            selectedModal: "modify",
            selectedRow: data
        })
    }

    closeTrip (isFetch) {
        if (isFetch) {
            this.getTrips();
        }
        this.setState({
            open: false,
            selectedModal: ""
        })
    }        

    renderList() {
        const {classes, state} = this.props;
        const { getApi, rowsPerPage, page } = this.state;
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
            state.trips.length === 0 
            ?  
            <TableRow>
                <TableCell colSpan={12}>
                <div className="d-flex justify-content-center">
                    No Data Found !
                </div>
                </TableCell>
            </TableRow>    
            : 
            state.trips.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ele, index) =>
                <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{ele.tripId}</TableCell>                    
                    <TableCell>{ele.tripTypeId === 1 ? "Empty" : ele.tripTypeId === 2 ? "Loaded" : "Empty Container"}</TableCell>   
                    <TableCell>{ele.contType}</TableCell>                    
                    <TableCell>{ele.contWt}</TableCell>    
                    <TableCell>{ele.type}</TableCell>                                    
                    <TableCell>{ele.startLoc}</TableCell>
                    <TableCell>{ele.endLoc}</TableCell>
                    <TableCell>{ele.distance}</TableCell>
                    <TableCell>{ele.fuelReq}</TableCell>
                    <TableCell>{ele.driInc}</TableCell>
                    <TableCell>
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            classes={{
                                root: classes.button,
                                label: classes.label
                            }}
                            onClick={() => {
                                this.modifyDetails(ele)
                            }} 
                            >
                            Modify
                        </Button>
                    </TableCell>
                </TableRow>
            )        
        )
    }

    renderModalContent() {
        if (this.state.selectedModal === 'create') {
            return (
            <DialogContent style={{padding: 0}}>
                <CreateTripModal
                createTrip={this.createTrip}
                locations={this.state.locations}
                closeModal={this.closeModal}/>
            </DialogContent>    
            );        
        } else if (this.state.selectedModal === 'modify') {
            return (
            <DialogContent style={{padding: 0}}>
                <ModifyTripModal
                closeModal={this.closeModal}
                modifyTrip={this.modifyTrip}
                selectedRow={this.state.selectedRow}/>
            </DialogContent>   
            );
        } else if (this.state.selectedModal === 'message') {
            return (
            <DialogContent>
                {
                    this.state.message !== ""
                    ?
                    <DialogContentText id="alert-dialog-description">
                        <img src="/assets/icons/tick.svg" alt="Success"
                        className="img-fluied d-flex justify-content-center tick"/>
                        {this.state.message}: {this.state.status}
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
            <div>
                <p className="titleCard">Menu / Manage Trips</p>                
                <Paper className={classes.root}>
                <Toolbar className={classes.toolBar}> 
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 ">               
                <div className="row float-right">
                    <Button 
                        color="primary" 
                        variant="contained" 
                        classes={{
                            root: classes.mainButton,
                            label: classes.label
                        }}
                        onClick={this.openModal}
                        >
                        Create Trip
                    </Button>
                    </div>  
                </div>
                </Toolbar>
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>S.No.</TableCell>
                                    <TableCell>Trip ID</TableCell>                                     
                                    <TableCell>Trip Type</TableCell>
                                    <TableCell>Container Type</TableCell>
                                    <TableCell>Container Wt (Ts)</TableCell>  
                                    <TableCell>Type</TableCell>                                                                     
                                    <TableCell>From Location</TableCell>
                                    <TableCell>To Location</TableCell>
                                    <TableCell>Distance (Km)</TableCell>
                                    <TableCell>Fuel (Ltr)</TableCell>
                                    <TableCell>Incentive (₹)</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.renderList()}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                    className = {classes.tablePagination}
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
                </Paper>
                <Dialog 
                    open={this.state.open}
                    onClose={() => this.closeModal(false)}
                    aria-labelledby="responsive-dialog-title"
                    classes={{paper: classes.dialogPaper}}>                    
                        {this.renderModalContent()}
                </Dialog>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(tableStyles)(ManageTrips));