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

class LeaveApprovals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            getApi: false,
            leaveApprovalDetails: [],
            rows: [],
            page: 0,
            rowsPerPage: 5,
            hoverIdx: "",
            modalOpen: false,
            displayLeaveDetails: {},
            toggleApprove: true,
            status: "",
            driver: "",
            open: false,
            code: 0,
            click: 0
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    fetchLeaves = ()=> {
        AppAPI.cfsLeaves.get().then((result) => {
            console.log(result, "Leave Details");
            this.setState({leaveApprovalDetails:result.leaves});
            this.setState({
                rows: result.leaves,
                getApi: true
            });
        }).catch(e => console.log(e))
    }

    componentDidMount() {
        this.fetchLeaves();
    }

    componentWillMount() {
        this.setState({
            rows: this.state.leaveApprovalDetails
        })
    }

    openModal() {   
        this.setState({ open: true}, () => {
            setTimeout(() => this.setState({ 
                open: false
            }), 5000);            
        });
    }

    closeModal() {
        this.setState({
            open: false
        })
    } 

    approve = (data, status) => {  
        this.setState({
            status: status,
            click: 1
        })
        AppAPI.leaveApprove.post(null,{leaveId:data.leaveId,status:status}).then((result) => {
            console.log("Leave Approvals Data: ", result);
            if (result.status === 200) {
                this.openModal();
                this.setState({
                    code: result.status,
                    driver: data.driverName
                })
            }
            this.fetchLeaves();
        }).catch(e => console.log(e))
    }   
    
    cancel = (data) => {
        this.setState({
            status: false
        })
    }  

    showLeaveDetails = (data) => {
        this.setState({
            open: true,
            displayLeaveDetails: {}
        }, () => {
            this.setState({
                displayLeaveDetails: data
            }, () => {
                console.log("object", this.state.displayLeaveDetails)
            })
        });
    };

    handleClose = () => {
        this.setState({open: false});
    };


    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({page: 0, rowsPerPage: event.target.value});
    };


    hoveredRow(idx) {
        this.setState({
            hoverIdx: idx
        })
    }

    decisionTaken() {
        this.setState({
            toggleApprove: !this.state.toggleApprove
        })
    }

    renderList() {
        const { classes } = this.props;
        const { getApi, rows, rowsPerPage, page, click} = this.state; 
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
            rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => 
            <TableRow >
                <TableCell>{row.leaveId}</TableCell>
                <TableCell>{moment(row.appliedOn).format("L")}</TableCell>
                <TableCell>{row.driverName}</TableCell>
                <TableCell>{row.noOfDays}</TableCell>
                <TableCell>{row.fromDate}</TableCell>
                <TableCell>{row.toDate}</TableCell>
                <TableCell>                                           
                    {
                        row.status === 'Approved'
                        ?
                        <img src="/assets/icons/tickMark.svg" alt="Tick" 
                        className="img-fluied d-flex justify-content-center mark"/>
                        :           
                        row.status === 'Rejected'
                        ?         
                        <img src="/assets/icons/closeMark.svg" alt="Close" 
                        className="img-fluied d-flex justify-content-center mark"/>
                        :
                        <img src="/assets/icons/questionMark.svg" alt="Pending" 
                        className="img-fluied d-flex justify-content-center mark"/>
                    }
                </TableCell>                                                  
                <TableCell>
                    <div className="d-flex justify-content-left">
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            classes={{
                                root: classes.button, 
                                label: classes.label,
                            }} 
                            onClick={this.approve.bind(this,row,'Approved')} 
                            disabled={(row.status !== 'Pending')|| (click === 1) }
                        >
                            Approve
                        </Button>
                        <Button 
                            variant="contained" 
                            classes={{
                                root: classes.cancelButton, 
                                label: classes.cancelLabel,
                            }} 
                            onClick={this.approve.bind(this,row,'Rejected')}                            
                            disabled={(row.status !== 'Pending')|| (click === 1) }
                        >
                            Reject
                        </Button> 
                        {/* <Button 
                            variant="contained" 
                            classes={{
                                root: classes.cancelButton, 
                                label: classes.cancelLabel,
                            }} 
                            onClick={this.showLeaveDetails.bind(this, row)}>
                            View
                        </Button>  */}
                    </div> 
                </TableCell>
            </TableRow>
            )
        )
    }   

    render() {
        const {classes} = this.props;
        const {rows, rowsPerPage, page} = this.state;
        return (
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Driver Name</TableCell>
                                <TableCell>No. of Days</TableCell>
                                <TableCell>From Date</TableCell>
                                <TableCell>To Date</TableCell>
                                <TableCell>Status</TableCell>
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
                {/* <Dialog fullScreen={fullScreen}
                        open={this.state.open}
                        onClose={this.handleClose.bind(this)}
                        aria-labelledby="responsive-dialog-title"
                        classes={(this.state.mode === 0) ? "" : {paper: classes.dialogPaper}}>
                    <DialogContent style={{padding: "0"}}>
                        <div className="modal-body" style={{minWidth: "500px"}}>

                            {(this.state.toggleApprove) ?
                                <div>
                                    <p>Leave <span className="float-right primary-text selectionControl"
                                                   onClick={this.handleClose.bind(this)}>Cancel</span></p>
                                    <hr/>
                                    <p>Name: {this.state.displayLeaveDetails.driverName}</p>
                                    <p>Available Leave for Driver: <b>10 Days</b></p>
                                    <p>Past Two Approved Leaves: <b>10 Days</b></p>
                                    <p>Current Leave Request</p>
                                    <p>From Date: {this.state.displayLeaveDetails.fromDate} To Date: {this.state.displayLeaveDetails.toDate} No. of Days: {this.state.displayLeaveDetails.noOfDays}</p>
                                    <p>
                                        {(this.state.displayLeaveDetails) ?
                                            <div>
                                                <p>{this.state.displayLeaveDetails.fromDate}  &nbsp; - &nbsp;  {this.state.displayLeaveDetails.toDate} : {this.state.displayLeaveDetails.noOfDays} DAYS <span
                                                            className="pl-4 primary-text selectionControl"
                                                            onClick={this.decisionTaken.bind(this)}>View Possiblity</span>
                                                </p>
                                            </div>
                                            : null}
                                    </p>
                                </div> :
                                <div>
                                    <p><img onClick={this.decisionTaken.bind(this)} className="selectionControl"
                                            src="/assets/icons/left.png" width="20px" height="20px" alt="Back"/> <span
                                        className="float-right primary-text selectionControl"
                                        onClick={this.handleClose.bind(this)}>Cancel</span></p>
                                    <hr/>
                                    {(this.state.displayLeaveDetails) ?
                                        <div>
                                            <p>{this.state.displayLeaveDetails.fromDate}  &nbsp; - &nbsp;  {this.state.displayLeaveDetails.toDate} : {this.state.displayLeaveDetails.noOfDays} DAYS</p>
                                        </div>
                                        : null}
                                    <div className="float-right">
                                        <label style={{color: "red"}} className="selectionControl"
                                               onClick={this.approve.bind(this,this.state.displayLeaveDetails,'Rejected')}>Deny</label>
                                        <label onClick={this.approve.bind(this,this.state.displayLeaveDetails,'Approved')} className="ml-3 approveButton">Approve</label>
                                    </div>

                                </div>
                            }
                        </div>
                    </DialogContent>
                </Dialog> */}
                <Dialog
                    open={this.state.open}
                    onClose={this.closeModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    >                    
                    <DialogContent>  
                    {
                        this.state.code === 200 && this.state.status === 'Approved'
                        ?
                        <DialogContentText id="alert-dialog-description">
                            <img src="/assets/icons/tick.svg" alt="Success"
                            className="img-fluied d-flex justify-content-center tick"/>
                            Successfully Approved Leave Request for Driver: {this.state.driver}
                        </DialogContentText>
                        :
                        this.state.code === 200 && this.state.status === 'Rejected'
                        ?
                        <DialogContentText id="alert-dialog-description">
                            <img src="/assets/icons/exclamation-mark.svg" alt="Caution"
                            className="img-fluied d-flex justify-content-center tick"/>
                            Successfully Rejected Leave Request for Driver: {this.state.driver}
                        </DialogContentText>
                        :
                        this.state.code !== 200
                        ?
                        <DialogContentText id="alert-dialog-description">
                            <img src="/assets/icons/notification.svg" alt="No Internet"
                            className="img-fluied d-flex justify-content-center tick"/>
                            Please, Check your Internet Connection
                        </DialogContentText>
                        :
                        null
                    }                        
                    </DialogContent>
                </Dialog>

            </Paper>
        );
    }
}

export default withStyles(tableStyles)(LeaveApprovals);