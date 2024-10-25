import React, {Component} from 'react';
import moment from 'moment';
import { 
  withStyles,
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableFooter, 
  TableRow, 
  TablePagination, 
  Button,
  Dialog,
  DialogContent,
  DialogContentText
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

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

class MaintenanceApprovals extends Component{
	constructor(props){
		super(props);
		this.state = {
      getApi: false,
			maintenanceApprovalDetails: [],
			rows: [],
      page: 0,
      rowsPerPage: 5,
      hoverIdx: "",
      tick: "",
      close: "",
      status: "",
      trailer: "",
      open: false,
      code: 0,
      click: 0
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  } 

  componentDidMount() {
    this.fetchMaintenanceRequests();
  }

  fetchMaintenanceRequests = ()=> {
      AppAPI.maintenanceReq.get().then((result) => {
          console.log("Maintenance Requests Data: ", result);
          this.setState({maintenanceApprovalDetails:result.notifications});
          this.setState({
              rows: result.notifications,
              getApi: true
          });
      }).catch(e => console.log(e))
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

  approve = (data,status) => {   
    this.setState({
      status: status,
      click: 1
    })
    console.log(data);
    AppAPI.maintenanceApprove.post(null,{ notifyId: data.notifyId, status: status}).then((result) => {
        console.log("Maintenance Approvals Data: ", result);
        if (result.status === 200) {
          this.openModal();
          this.setState({
              code: result.status,
              trailer: data.trailerNo
          })
        }
        this.fetchMaintenanceRequests();
    }).catch(e => console.log(e))
  }  

	handleChangePage = (event, page) => {
    	this.setState({ page });
  	};

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };

  hoveredRow(idx){
    this.setState({
      hoverIdx: idx
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
        <TableRow>
            <TableCell>{row.notifyId}</TableCell>
            <TableCell>{moment(row.created).format("L")}</TableCell>
            <TableCell>{row.driverName}</TableCell>
            <TableCell>{row.trailerNo}</TableCell>
            <TableCell>{row.notifyType}</TableCell>
            <TableCell>                                           
                {
                    row.status === 'Approved' || row.status === 'completed'
                    ?
                    <img src="/assets/icons/tickMark.svg" alt="Approved" 
                    className="img-fluied d-flex justify-content-center mark"/>
                    :           
                    row.status === 'Rejected'
                    ?         
                    <img src="/assets/icons/closeMark.svg" alt="Rejected" 
                    className="img-fluied d-flex justify-content-center mark"/>
                    :
                    row.status === 'Pending'|| row.status === 'inCompleted'
                    ? 
                    <img src="/assets/icons/questionMark.svg" alt="Pending" 
                    className="img-fluied d-flex justify-content-center mark"/>                    
                    :
                    null
                }
            </TableCell>                                         
            <TableCell>
                <div className="d-flex justify-content-centre">
                    <Button
                        classes={{
                            root: classes.button, 
                            label: classes.label,
                        }} 
                        variant="outlined"                                                                                                 
                        color="secondary"      
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
                </div> 
            </TableCell>
        </TableRow>
        )
    )
  }

	render(){
    const { classes } = this.props;
    const { rows, rowsPerPage, page } = this.state;
		return(
				<Paper className={classes.root}>
        <div className={classes.tableWrapper}>
        <Table className={classes.table} >
           <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Driver Name</TableCell>
                <TableCell>Trailer No.</TableCell>
                <TableCell>Service</TableCell>
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
                  Successfully Approved Maintenance Request for Trailer: {this.state.trailer}
              </DialogContentText>
              :
              this.state.code === 200 && this.state.status === 'Rejected'
              ?
              <DialogContentText id="alert-dialog-description">
                  <img src="/assets/icons/exclamation-mark.svg" alt="Caution"
                  className="img-fluied d-flex justify-content-center tick"/>
                  Successfully Rejected Maintenance Request for Trailer: {this.state.trailer}
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

export default withStyles(tableStyles)(MaintenanceApprovals);