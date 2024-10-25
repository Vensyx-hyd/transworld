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
    Toolbar,
    Button,
    Dialog,
    DialogContent,
    DialogContentText
} from '@material-ui/core/';

import CreateTrailerModal from './Modals/CreateTrailer.modal';
import ModifyTrailerModal from './Modals/ModifyTrailer.modal';
import TablePaginationActions from '../../../Components/TablePaginationActionsWrapped';
import tableStyles from '../../../Styles/tableStyles';
import Loading from '../../../Components/Loading/Loading';
import AppAPI from './../../../API';

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
class HireTrailer extends Component {
    constructor(props) {
        super();
        this.state = {
            getApi: false,
            rows: [],
            page: 0,
            rowsPerPage: 5,
            selectedModal: "",
            selectedRow: {},
            open: false,
            message: "",
            submitted: false,
            errMessage: ""
        }
        this.createModal = this.createModal.bind(this);
        this.updateModal = this.updateModal.bind(this);
        this.createTrailer = this.createTrailer.bind(this);
        this.modifyTrailer = this.modifyTrailer.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.backToHire = this.backToHire.bind(this);
        this.closeTrailer = this.closeTrailer.bind(this);
    }
    
    getTrailers() {
        AppAPI.trailers.get(null, null).then((resp) => {
          console.log(resp.trailers, "Trailers List");
          this.setState({
            rows: resp.trailers,
            getApi: true
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
       this.getTrailers();
    }    

    createTrailer(data) {
        console.log(data, "Print Data");
        AppAPI.trailerCreate.post(null, data).then((resp) => {
           console.log(resp, "Response"); 
           this.closeTrailer(true)
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
        this.getTrailers();
    }

    modifyTrailer(id, data) {
        AppAPI.trailers.put('/' + id, data).then((resp) => {
            console.log(resp, "Update Trailer Data");
            this.closeTrailer(true)
            var mUpdate = resp.message;
                if(resp.success === true) {                
                    this.msgUpdated();               
                    this.setState({
                        message: mUpdate,
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
        this.getTrailers();
    } 

    createModal() {
        this.setState({
            open: true,
            selectedModal: "create"
        })
    }   
    
    updateModal(data) {
        this.setState({
            open: true,
            selectedModal: "modify",
            selectedRow: data
        })
    }

    closeTrailer (isFetch) {
        if (isFetch) {
            this.getTrailers();
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

    closeModal() {
        this.setState({
            open: false,
            selectedModal: ""
        })
    }

    backToHire() {
        this.setState({
            open: false
        })
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };
    
    handleChangeRowsPerPage = event => {
        this.setState({ page: 0, rowsPerPage: event.target.value });
    };

    renderModalContent() {
        if (this.state.selectedModal === 'create') {
            return (
            <DialogContent style={{padding: 0}}>
            <CreateTrailerModal  
                createTrailer={this.createTrailer}
                backToHire={this.backToHire}
                submitted = {this.state.submitted}
            />
            </DialogContent>    
            );        
        } else if (this.state.selectedModal === 'modify') {
            return (
            <DialogContent style={{padding: 0}}>
                <ModifyTrailerModal 
                    modifyTrailer={this.modifyTrailer}
                    selectedRow={this.state.selectedRow} 
                    closeModal={this.closeModal} 
                    backToHire={this.backToHire}
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
        const {classes} = this.props;
        const { getApi, rows, rowsPerPage, page} = this.state; 
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
            <TableRow>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{row.vendorId}</TableCell>
                <TableCell>{row.vendorName}</TableCell>
                <TableCell>{row.type === "1" ? "Empty" : row.type === "2" ? "Loaded" : "Empty Container"}</TableCell>
                <TableCell>{row.trailerNo}</TableCell>
                <TableCell>{row.contactNo}</TableCell>
                <TableCell>{this.convert(row.startDate)}</TableCell>               
                <TableCell>{this.convert(row.endDate)}</TableCell>
                <TableCell>{row.rate}</TableCell>
                <TableCell>
                <div className="d-flex">
                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        classes={{
                            root: classes.button, 
                            label: classes.label,
                        }} 
                        onClick={() => {
                            this.updateModal(row)
                            }} 
                        >
                        Modify
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

    render() {
        const {classes} = this.props;
        const {rows, rowsPerPage, page} = this.state;      
        return (
            <div>
                <p className="titleCard">Menu / Hire Trailer</p>                
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
                                    onClick={this.createModal}
                                    >
                                    Create Trailer
                                </Button>
                            </div>
                        </div>
                    </Toolbar>
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>S.No.</TableCell>
                                    <TableCell>Vendor ID</TableCell>
                                    <TableCell>Vendor Name</TableCell>
                                    <TableCell>Trip Type</TableCell>
                                    <TableCell>Trailer No.</TableCell>
                                    <TableCell>Mobile No.</TableCell>
                                    <TableCell>From Date</TableCell>
                                    <TableCell>To Date</TableCell>
                                    <TableCell>Price</TableCell>
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
                    onClose={this.closeModal}
                    aria-labelledby="responsive-dialog-title"
                    classes={{paper: classes.dialogPaper}}>   
                        {this.renderModalContent()}
                </Dialog>
            </div>
        );
    }
}

HireTrailer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(tableStyles)(HireTrailer);