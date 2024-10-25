import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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
    Toolbar,
} from '@material-ui/core';

import TablePaginationActions from '../../../Components/TablePaginationActionsWrapped';
import CreateMessageModal from './Modals/CreateMessage.modal';
import SendMessageModal from './Modals/SendMessage.modal';
import tableStyles from '../../../Styles/tableStyles';
import Loading from '../../../Components/Loading/Loading';
import AppAPI from '../../../API';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  }
});

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

class Communication extends Component{
  constructor(props){
    super(props);
    this.state = {
      getApi: false,
      rows: [],
      page: 0,
      rowsPerPage: 5,          
      selectedModal: "",
      selectedRow: {},
      drivers:[],
      open: false,
      message: "",
      submitted: false,
      errMessage: ""
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.createMessage = this.createMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.sendModal = this.sendModal.bind(this);
    this.msgUpdated = this.msgUpdated.bind(this);
    this.closeMessage = this.closeMessage.bind(this);
  }

  getMessages() {
    AppAPI.messages.get(null, null).then((resp) => {
      console.log(resp, "Messages Response");
      console.log(resp.msg, "Get Message");
      this.setState({
        rows: resp.msg,
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

  createMessage(data) {
    AppAPI.messageCreate.post(null, data).then((resp) => {
      console.log(resp, "Response");          
      this.closeMessage(true)
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
    this.getMessages();
  }

  sendMessage(data) {
    AppAPI.messageSend.post(null, data).then((resp) => {
      console.log(resp, "Response*******");          
      this.closeModal()
      var mSent = resp.message;
      console.log(mSent, "Sent Message +++++++++");
          if(resp.success === true) {  
            this.msgUpdated();               
            this.setState({
              message: mSent,
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

  getDrivers() {
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

  componentDidMount(){
    this.getMessages();
    this.getDrivers();
  }

  openModal(){
    this.setState({
      open: true,
      selectedModal: "create"
    })
  }

  sendModal(data){
    this.setState({
      selectedModal: "send",
      selectedRow: data,
      open: true
    })
  }

  msgUpdated() {
    this.setState({
        open: true,
        submitted: false,
        selectedModal: "message"
    }, () => {
      setTimeout(() => this.setState({ 
          open: false,                
      }), 5000);            
    });
  }

  closeModal(){
    this.setState({
      open: false,
      selectedModal: ""
    })
  }

  closeMessage (isFetch) {
    if (isFetch) {
        this.getMessages();
    }
    this.setState({
        open: false,
        selectedModal: ''
    })
  }    
  
  renderModalContent() {
    if (this.state.selectedModal === 'create') {
        return (
        // <DialogContent style={{padding: 0}}>
          <CreateMessageModal 
            createMessage={this.createMessage} 
            closeModal={this.closeModal}   
            submitted = {this.state.submitted}         
          />
        // </DialogContent>    
        );        
    } else if (this.state.selectedModal === 'send') {
        return (
        // <DialogContent style={{padding: 0}}>
          <SendMessageModal 
            sendMessage = {this.sendMessage}
            selectedRow={this.state.selectedRow}
            drivers = {this.state.drivers} 
            closeModal={this.closeModal}   
            submitted = {this.state.submitted}            
          />
        // </DialogContent>   
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

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };

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
        <TableCell>{row.cfs_msg_con_title}</TableCell>         
        <TableCell>{row.cfs_msg_con_body}</TableCell>
        <TableCell>
          <div className="d-flex">
            <Button 
              color="secondary" 
              variant="outlined" 
              classes={{
                  root: classes.button, 
                  label: classes.label,
              }} 
              onClick={ () => {this.sendModal(row)} } 
              >
              Send
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
    ))
  }

  render(){
  const { classes } = this.props;
  const { rows, rowsPerPage, page } = this.state;
    return(
      <div>
          <p className="titleCard">Menu / Communication</p>             
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
                          onClick={this.openModal}>
                          Create Message
                        </Button>
                      </div>
                  </div>
              </Toolbar>
              <div className={classes.tableWrapper}>
                <Table className={classes.table}>    
                 <TableHead>
                    <TableRow>
                      <TableCell>S.No.</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Message</TableCell>
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
                <DialogContent style={{padding: 0}}>
                  {this.renderModalContent()}
                </DialogContent>                 
            </Dialog>
      </div>
    );
  }
}
Communication.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(tableStyles)(Communication);