import React, {Component} from 'react';
import {    
    Paper,
    withStyles,
    Grid,
    Dialog,
    DialogContent,
    DialogContentText,
    Button,
    Typography,
    Snackbar,
    IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import Progress from '../../../Components/Loading/Progress';
import Loading from '../../../Components/Loading/Loading';
import AppAPI from '../../../API';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',      
    },
    button: {
        margin: theme.spacing.unit,
        minHeight: "35px",
        marginTop: "1rem",
        marginLeft: 0
    },
    label: {
        textTransform: 'capitalize',
        fontWeight: 600
    },
});
class TripIntelligence extends Component{
	constructor(props){
        super(props);           
		this.state = {    
            getApi: false,       
            idleTime: "",
            balShiftTime: "",
            pendency: "",			
            pickUpLoc: "",
            compRoundTrip: "",
            groundRent: "",
            open: false,
            validators:['required','isNumber', 'minNumber:0', 'maxNumber:99'],
            status: false,
            submitted: false,
            message:"",
            errMessage: "",
            alert: false,
            alertMessage: ""
        }
        let { idleTime, balShiftTime, pendency, pickUpLoc, compRoundTrip, groundRent } = {...this.state};
        this.initialState = { idleTime, balShiftTime, pendency, pickUpLoc, compRoundTrip, groundRent }
        this.onInputChange = this.onInputChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.resetData = this.resetData.bind(this);
    }

	onInputChange(event) {
        this.setState({ [event.target.name]: Number(event.target.value)});
    } 

    resetData() {       
        this.setState(
            this.initialState
        )
    }    

    openModal() {   
        this.setState({ open: true, submitted: false }, () => {
            setTimeout(() => this.setState({ 
                open: false
            }), 5000);            
        });
        this.resetData();
    }
    
    closeModal() {
        this.setState({
            open: false,
            alert: false
        })
    }  

    fetchIntel(){
        AppAPI.adminTripsIntel.get().then((resp) => {
            console.log(resp, "Trip Intelligence.............");
            if(resp.success === true) {    
               if(resp.intel.length>0) {
                    var intel = resp.intel[0];
                    this.setState({ getApi: true, idleTime:intel.idleTime, balShiftTime:intel.balShiftTime, 
                    pendency:intel.pendency, pickUpLoc:intel.pickUpLoc, compRoundTrip:intel.compRoundTrip,
                    groundRent: intel.groundRent })
               }
            } 
        }).catch(e => {             
            if (e.code === 500) {
                this.openModal();
                this.setState({
                    errMessage: e.serverMessage
                })
            }
            console.log(e, "Error");
        })
    }
    
    componentWillMount() {
        this.fetchIntel();
    }

    createTripIntel(data) {
        AppAPI.adminTripsIntel.post(null, data).then((resp) => {
            console.log(resp, "Trip Intelligence.............");
            var msg = resp.message;
            if(resp.success === true) {                
               this.openModal();               
               this.setState({
                message: msg,
                })
            } 
        }).catch(e => {             
            if (e.code === 500) {
                this.openModal();
                this.setState({
                    errMessage: e.serverMessage
                })
            }
            console.log(e, "Error");
        })
    }

    loader() {
        this.setState({ 
            submitted: true 
        })
        this.createTripIntel(this.state);  
        this.fetchIntel();
    }

	onSubmit(){
        const arrayTrip = [this.state.idleTime, this.state.balShiftTime, this.state.pendency, this.state.pickUpLoc, this.state.compRoundTrip, this.state.groundRent]
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        const count = arrayTrip.reduce(reducer);
        return count === 100  ? this.loader() :  this.setState({ alert: true, alertMessage: "Please check the Count it must be Equal to 100" })
    }

	render(){
        const { classes } = this.props;
        const { getApi, submitted, idleTime, balShiftTime, pendency, pickUpLoc, compRoundTrip, groundRent } = this.state;
		return(
			<div>
				<p className="titleCard">Menu / Trip Intelligence</p>
                {
                    getApi === false 
                    ? 
                    <div className="container" style={{position:"relative", top:"15rem"}}> 
                        <div className="d-flex justify-content-center pt-50">
                            <Loading/>
                        </div>
                    </div> 
                    :
                    <div className="d-flex justify-content-center">
                    <Paper style={{width: "550px"}}>
                        <h6 className="customHeader">Trip Intelligence</h6>
                        <div className="container p-4">
                        <ValidatorForm ref="form" onSubmit={this.onSubmit}>                        
                            <div className={classes.root}>
                                <Grid container spacing={24}>
                                    <Grid item xs={6}>
                                        <TextValidator                                                                         
                                            fullWidth 
                                            margin="normal"
                                            name="idleTime"
                                            label="Idle Time"
                                            value={this.state.idleTime}
                                            onChange={this.onInputChange}
                                            validators={this.state.validators}
                                            errorMessages={['Idle Time is required']}
                                        />  
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextValidator 
                                            fullWidth 
                                            margin="normal"
                                            name="balShiftTime"
                                            label="Balance Shift Time"
                                            value={this.state.balShiftTime}
                                            onChange={this.onInputChange}
                                            validators={this.state.validators}
                                            errorMessages={['Balance Shift Time is required']}
                                        />          
                                    </Grid>
                                </Grid>
                            </div>
                            <div className={classes.root}>
                                <Grid container spacing={24}>
                                    <Grid item xs={6}>
                                        <TextValidator 
                                            fullWidth 
                                            margin="normal"
                                            name="pendency"
                                            label="Pendency"
                                            value={this.state.pendency}
                                            onChange={this.onInputChange}
                                            validators={this.state.validators}
                                            errorMessages={['Pendency is required']}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextValidator 
                                            fullWidth 
                                            margin="normal"
                                            name="pickUpLoc"
                                            label="Near Pickup Location"
                                            value={this.state.pickUpLoc}
                                            onChange={this.onInputChange}
                                            validators={this.state.validators}
                                            errorMessages={['Pickup Location is required']}
                                        />   
                                    </Grid>
                                </Grid>
                            </div>
                            <div className={classes.root}>
                                <Grid container spacing={24}>
                                    <Grid item xs={6}>
                                        <TextValidator 
                                            fullWidth 
                                            margin="normal"
                                            name="compRoundTrip"
                                            label="Complete Round Trip"
                                            value={this.state.compRoundTrip}
                                            onChange={this.onInputChange}
                                            validators={this.state.validators}
                                            errorMessages={['Round Trip is required']}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextValidator 
                                            fullWidth 
                                            margin="normal"
                                            name="groundRent"
                                            label="Ground Rent"
                                            value={this.state.groundRent}
                                            onChange={this.onInputChange}
                                            validators={this.state.validators}
                                            errorMessages={['Ground Rent is required']}
                                        />   
                                    </Grid>
                                </Grid>
                            </div>
                            <div className={classes.root}>
                                <Grid container spacing={24}>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" className="d-flex pt-4">
                                            Note: All Fields Sum Must be Equal to 100
                                        </Typography> 
                                    </Grid>
                                    <Grid item xs={6}>  
                                        <Button                                        
                                            color="secondary" 
                                            variant="outlined" 
                                            classes={{
                                                root: classes.button,
                                                label: classes.label
                                            }}>
                                            {idleTime + balShiftTime + pendency + pickUpLoc + compRoundTrip + groundRent}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                            <div className="d-flex justify-content-center pt-2">    
                                <Button 
                                    type="submit" 
                                    color="primary" 
                                    variant="contained" 
                                    classes={{
                                        root: classes.button,
                                        label: classes.label
                                    }}
                                    disabled={submitted}>                        	
                                {
                                    (submitted && <Progress/>)
                                        || 
                                    (!submitted && 'Submit')
                                }
                                </Button>  
                            </div>
                        </ValidatorForm>
                        </div>
                    </Paper>
                    <Dialog
                        open={this.state.open}
                        onClose={this.closeModal}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        >
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
                    </Dialog>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={this.state.alert}
                        autoHideDuration={5000}
                        onClose={this.closeModal}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">{this.state.alertMessage}</span>}
                        action={[            
                            <IconButton
                            key="close"
                            aria-label="Close"
                            color="primary"
                            className={classes.close}
                            onClick={this.closeModal}
                            >
                            <CloseIcon />
                            </IconButton>,
                        ]}
                    />
                </div>
                }
                
            </div>
		);
	}
}
export default withStyles(styles)(TripIntelligence);