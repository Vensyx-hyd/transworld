import React, {Component} from 'react';
import { 
    Paper,
    Button,
    withStyles,
    Dialog,
    DialogContent,
    DialogContentText,
    Typography,
    Snackbar,
    IconButton
} from '@material-ui/core';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import CloseIcon from '@material-ui/icons/Close';

import Progress from '../../../Components/Loading/Progress';
import AppAPI from '../../../API';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    button: {
        margin: theme.spacing.unit,
    },
    label: {
        textTransform: 'capitalize',
        fontWeight: 600
    },    
    cssUnderline: {    
        color: "#dc3545c9",     
    },  
});

class Fuel extends Component{
	constructor(props){
		super(props);
		this.state = {
            fuelInfo: [],
			trailerNumber: "",
			lastFill: "",
			travelInKm: "",
			fuelIssued: "",
            requestFuel: "",  
            submitted: false,
            open: false,
            status: "",
            message: "",
            errMessage: "",
            alert: false,
            alertMessage: ""
        }
        let { trailerNumber, lastFill, travelInKm, fuelIssued, requestFuel } = {...this.state};
        this.initialState = { trailerNumber, lastFill, travelInKm, fuelIssued, requestFuel }
        this.onInputChange = this.onInputChange.bind(this);
        this.handleInputSearch = this.handleInputSearch.bind(this);        
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    getFuel() {
        AppAPI.fuel.get(null, null).then((resp) => {
        console.log(resp.requests, "Get Fuel");
            this.setState({
                fuelInfo: resp.requests
            })       
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
    
    componentDidMount(){
        this.getFuel();
    }

    onInputChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    } 

    handleInputSearch(event) {
        event.preventDefault();
        this.setState({ [event.target.name]: event.target.value });
        var fuelList = this.state.fuelInfo;  
        let obj = fuelList.find(obj => obj.trailerNo === event.target.value);
        if (obj !== undefined) {
            this.setState({
                status: obj.trailerNo,
                lastFill: obj.lastIssuedDate,
                travelInKm: obj.kmDone,
                fuelIssued: obj.lastIssuedLitre,   
            })
        }
        else {
            this.setState({
                lastFill: "",
                travelInKm: "",
                fuelIssued: ""   
            })
        }       
    }   

    loader() {
        this.setState({ 
            submitted: true 
        })
    }

    createFuel(data) {
        AppAPI.fuelCreate.post(null, data).then((resp) => {
          console.log(resp, "Response");     
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

	onSubmit(){        
        const { trailerNumber, lastFill, travelInKm, fuelIssued, requestFuel } = {...this.state};  
        if ((lastFill && travelInKm && fuelIssued) !== "") {
            this.loader();
            this.createFuel({
                trailerNo: trailerNumber,
                kmsDone: travelInKm,
                lastIssuedDate: lastFill,
                lastIssuedLitre: fuelIssued,
                reqLitres: requestFuel
            });
        } else {
            this.setState({
                alert: true,
                alertMessage: "Please Enter Valid Trailer No. !"
            })
        }
	}
	render(){
        const { classes } = this.props;
        const { submitted } = this.state;
		return(			
            <div>
            <p className="titleCard">Menu / Fuel</p>
            <div className="d-flex justify-content-center">
                <Paper style={{width: "350px"}}>
                	<h6 className="customHeader">Fuel</h6>
                	<div className="container p-4">
                    <ValidatorForm ref="form" onSubmit={this.onSubmit}>                       
                       <TextValidator 
                            fullWidth 
                            margin="normal"
                            name="trailerNumber"
                            label="Trailer No."
                            value={this.state.trailerNumber}
                            onChange={this.handleInputSearch}
                            validators={['required']}
                            errorMessages={['Trailer No. is required']}
                        />  
                        <TextValidator 
                            fullWidth 
                            margin="normal"
                            name="lastFill"
                            label="Previous Issued Date"
                            value={this.state.lastFill}
                            InputProps={{
                                classes: {
                                    underline: classes.cssUnderline
                                },
                            }}
                        />                         
                        <TextValidator 
                            fullWidth 
                            margin="normal"
                            name="travelInKm"
                            label="Previous Distance Travelled (Km)"
                            value={this.state.travelInKm}
                            InputProps={{
                                classes: {
                                    underline: classes.cssUnderline
                                },
                            }}
                        />                          
                        <TextValidator 
                            fullWidth 
                            margin="normal"
                            name="fuelIssued"
                            label="Previous Fuel Issued (Ltr)"
                            value={this.state.fuelIssued}
                            InputProps={{
                                classes: {
                                    underline: classes.cssUnderline
                                },
                            }}
                        /> 
                        <TextValidator 
                            fullWidth 
                            margin="normal"
                            name="requestFuel"
                            label="Issue Fuel (Ltr)"
                            value={this.state.requestFuel}
                            onChange={this.onInputChange}
                            validators={['required', 'isNumber']}
                            errorMessages={['Request Fuel is required']}
                        />
                        <div className="d-flex justify-content-start pt-4">
                            <Typography variant="caption" gutterBottom>
                                Note: Trailer No. and Issue Fuel Fields are Mandatory
                            </Typography> 
                        </div>
                        <div className="d-flex justify-content-center pt-4">
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
        </div>
	    );
	}
}
export default withStyles(styles)(Fuel);