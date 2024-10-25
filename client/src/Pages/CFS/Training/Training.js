import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
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
    DialogContentText,
    Button,
    Toolbar
} from '@material-ui/core';

import CreateTrainingModal from './Modals/CreateTraining.modal';
import AssignTrainingModal from './Modals/AssignTraining.modal';
import TablePaginationActions from '../../../Components/TablePaginationActionsWrapped';
import tableStyles from '../../../Styles/tableStyles';
import Loading from '../../../Components/Loading/Loading';
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
class Training extends Component {
    constructor(props) {
        super(props);
        this.state = {
            getApi: false,
            rows: [],
            page: 0,
            rowsPerPage: 5,                        
            selectedModal: "",
            selectedRow: {},
            drivers: [],
            open: false,
            message: "",
            submitted: false,
            errMessage: ""
        }
        this.createModal = this.createModal.bind(this);
        this.assignModal = this.assignModal.bind(this);
        this.msgUpdated = this.msgUpdated.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.createTraining = this.createTraining.bind(this);
        this.assignTraining = this.assignTraining.bind(this);
        this.closeTraining = this.closeTraining.bind(this);
    }

    getTrainingList() {
        AppAPI.trainingList.get(null, null).then((resp) => {
          console.log(resp.trainings, "Get Training List");
          this.setState({
            rows: resp.trainings,
            getApi: true
          })
        }).catch((err) => console.log(err))
    }

    getDriversList() {
        AppAPI.driversList.get(null, null).then((resp) => {
            console.log(resp,"Drivers List");  
            let dNames = resp.map(({ name }) => name)
            console.log(dNames, "Names of Drivers...........");
            this.setState({
                drivers: resp
            })
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

    componentDidMount() {
        this.getTrainingList();
        this.getDriversList();
    }

    createTraining(data) {
        AppAPI.trainingCreate.post(null, data).then((resp) => {
           console.log(resp, "Response"); 
           this.closeTraining(true);
            const msg = resp.message;
                if(resp.success === true) {                
                    this.msgUpdated();               
                    this.setState({
                        message: msg,
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
        this.getTrainingList();
    }  

    assignTraining(data) { 
        AppAPI.trainingAssign.post(null, data).then((resp) => {
            console.log(resp, "Assign");
            this.handleClose();
            const msg = resp.message;
                if(resp.success === true) {                
                    this.msgUpdated();               
                    this.setState({
                        message: msg,
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

    createModal() {
        this.setState({
            open: true,
            selectedModal: "create"
        })
    }

    assignModal(data) {
        this.setState({
            open: true,
            selectedModal: "assign",
            selectedRow: data
        })
    }

    closeTraining (isFetch) {
        if (isFetch) {
            this.getTrainingList();
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

    handleClose() {
        this.setState({
            open: false,
            selectedModal: ""
        })
    }

    backToTraining() {
        this.setState({
            open: false
        })
    }

    renderModalContent() {
        if (this.state.selectedModal === 'create') {
            return (
            <DialogContent style={{padding: 0}}>
            <CreateTrainingModal  
              createTraining={this.createTraining}
              backToTraining={this.backToTraining.bind(this)}
              submitted = {this.state.submitted}
            />
            </DialogContent>    
            );        
        } else if (this.state.selectedModal === 'assign') {
            return (
            <DialogContent style={{padding: 0}}>
              <AssignTrainingModal    
                assignTraining = {this.assignTraining}            
                selectedRow = {this.state.selectedRow}           
                drivers = {this.state.drivers}
                backToTraining = {this.backToTraining.bind(this)} 
                submitted = {this.state.submitted} 
              />
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

    convert(data){
        return data !== null || data !== "" ? moment(data).format("L") : null
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
            rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => 
            <TableRow >
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{row.trainingType === 1 ? "Driver Loading Training" : "App Training"}</TableCell>
                <TableCell>{row.trainingName}</TableCell>         
                <TableCell>{row.trainingLoc}</TableCell>
                <TableCell>{row.trainerName}</TableCell>
                <TableCell>{this.convert(row.trainingDate)}</TableCell>  
                <TableCell>
                <div className="d-flex">
                    <Button 
                    color="secondary" 
                    variant="outlined" 
                    classes={{
                        root: classes.button, 
                        label: classes.label,
                    }} 
                    onClick={() => {
                        this.assignModal(row)
                        }} 
                    >
                    Assign
                    </Button>
                    {/* <Button 
                    variant="contained" 
                    className={classes.button}
                    >
                    <Delete color="action" />    
                    </Button>  */}
                </div>
                </TableCell>
            </TableRow>
            )
        )
    } 
    
    handleChangePage = (event, page) => {
    this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
    };

    render() {
        const {classes} = this.props;
        const {rows, rowsPerPage, page} = this.state;        
        return (
            <div>
                <p className="titleCard">Menu / Training</p>                
                <Paper className={classes.root}>
                    <Toolbar className={classes.toolBar}>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 ">               
                        <div className="row float-right">
                            <Button 
                                color="primary" 
                                variant="contained" 
                                classes={{
                                    root: classes.mainButton, 
                                    label: classes.label,
                                }} 
                                onClick={this.createModal}>
                                Create Training
                            </Button>
                        </div>
                    </div>
                    </Toolbar>
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>S.No.</TableCell>
                                    <TableCell>Training Type</TableCell>
                                    <TableCell>Training Name</TableCell>
                                    <TableCell>Training Location</TableCell>
                                    <TableCell>Trainer Name</TableCell>
                                    <TableCell>Date</TableCell>
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
                </Paper>
                <Dialog 
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                    classes={{paper: classes.dialogPaper}}>   
                        {this.renderModalContent()}
                </Dialog>
            </div>
        );
    }
}


Training.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(tableStyles)(Training);