import React, {Component} from 'react';
import { 
    withStyles,
    Paper,
    Grid,
    Button,
    Typography
 } from '@material-ui/core';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import Progress from '../../../Components/Loading/Progress';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    formControl: {
        minWidth: '100%',
    },
    button: {
        margin: theme.spacing.unit,
        backgroundColor: "#e0e0e0"  
    },
    saveLabel: {
        textTransform: 'capitalize',
        fontWeight: 600,
        color: "#14A474"
    },
    cancelLabel: {
        textTransform: 'capitalize',
        fontWeight: 600,
        color: "#dc3545c9"
    },
    cssUnderline: {    
        color: "#dc3545c9",  
    },  
});
class ModifyProfileModal extends Component{
	constructor(props){
		super(props);
		this.state = {
            cfsEcode: "",
			cfsName: "",
			cfsMobile: "",
            cfsEmail: "",
			cfsDob: "",
            cfsDoj: "",
            cfsAddress: "",
            submitted: false
        }
        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    
    componentDidMount(){
        this.setState({
            cfsEcode: this.props.sendData.eCode,
            cfsName: this.props.sendData.driverName,
            cfsMobile: this.props.sendData.contactNo,
            cfsEmail: this.props.sendData.email,
            cfsDob: this.props.sendData.dob,
            cfsDoj: this.props.sendData.doj,
            cfsAddress: this.props.sendData.permanentAddress,
        })
    }
    componentWillReceiveProps(newProps){
        this.setState({
            cfsEcode: newProps.sendData.eCode,
            cfsName: newProps.sendData.driverName,
            cfsMobile: newProps.sendData.contactNo,
            cfsEmail: newProps.sendData.email,
            cfsDob: newProps.sendData.dob,
            cfsDoj: newProps.sendData.doj,
            cfsAddress: newProps.sendData.permanentAddress,
        })
    }

    onInputChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    loader() {
        this.setState({ submitted: true });
    } 
    
	onSubmit(){
        this.loader();       
        let { cfsEcode, cfsName, cfsMobile, cfsAddress} = {...this.state}
        let inputId = cfsEcode;
        this.props.updateProfile(inputId,{
            name: cfsName,
            ContactNo: cfsMobile,
            address: cfsAddress,
        });
	}
    
    backToProfilePage(){
        this.props.backToProfile();
    }

	render(){
        const { classes } = this.props;
        const { submitted } = this.state;
        return(
			<div className="container" style = {{paddingLeft: "0px", paddingRight: "0px"}}>
                <div className="d-flex justify-content-center">
                <Paper style={{width: "400px"}}>               
                	<h6 className="custom">Update Profile</h6>           
                    <div className="container p-4">
                    <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                        <div className={classes.root}>
                            <Grid container spacing={24}>
                                <Grid item xs={6}>
                                    <TextValidator
                                        fullWidth
                                        margin="normal"
                                        name="cfsName"
                                        label="Name"
                                        value={this.state.cfsName}
                                        onChange={this.onInputChange}
                                        validators={['required']}
                                        errorMessages={['Name is required']}
                                    />   
                                </Grid>
                                <Grid item xs={6}>
                                    <TextValidator
                                        fullWidth
                                        margin="normal"
                                        name="cfsMobile"
                                        label="Mobile No."
                                        value={this.state.cfsMobile}
                                        onChange={this.onInputChange}
                                        validators={['matchRegexp:^[6-9][0-9]{9}$']}
                                    />  
                                </Grid>
                            </Grid>
                        </div> 
                        <div className={classes.root}> 
                            <TextValidator
                                fullWidth
                                margin="normal"
                                name="cfsEmail"
                                label="Email"
                                value={this.state.cfsEmail}
                                onChange={this.onInputChange}
                                InputProps={{
                                    classes: {
                                        underline: classes.cssUnderline
                                    },
                                }}
                            />
                            <div className={classes.root}>
                                <Grid container spacing={24}>
                                    <Grid item xs={6}>
                                        <TextValidator
                                            fullWidth
                                            margin="normal"
                                            name="cfsDob"
                                            label="Date of Birth"
                                            value={this.props.convert(this.state.cfsDob)}
                                            InputProps={{
                                                classes: {
                                                    underline: classes.cssUnderline
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextValidator
                                            fullWidth
                                            margin="normal"
                                            name="cfsDoj"
                                            label="Date of Joining"
                                            value={this.props.convert(this.state.cfsDoj)}
                                            InputProps={{
                                                classes: {
                                                    underline: classes.cssUnderline
                                                },
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </div> 
                            <TextValidator
                                fullWidth
                                margin="normal"
                                name="cfsAddress"
                                label="Address"
                                value={this.state.cfsAddress}
                                onChange={this.onInputChange}
                            />
                        </div>
                        <div className="d-flex justify-content-start pt-4">
                            <Typography variant="caption" gutterBottom>
                            Note: Only Name, Mobile No. and Address Fields are Editable
                            </Typography> 
                        </div>
                        <div className="d-flex justify-content-center pt-4">
                            <Button 
                                type="submit" 
                                variant="contained"
                                classes={{
                                    root: classes.button,
                                    label: classes.saveLabel
                                }}
                                disabled={submitted}>                        	
                            {
                                (submitted && <Progress/>)
                                    || 
                                (!submitted && 'Save')
                            }
                            </Button>
                            <Button 
                                variant="contained" 
                                classes={{
                                    root: classes.button,
                                    label: classes.cancelLabel
                                }}
                                onClick={this.backToProfilePage.bind(this)}>
                                Cancel
                            </Button>
                        </div>
                    </ValidatorForm>
                    </div>
                </Paper>
                </div>
            </div>
		);
	}
}

export default withStyles(styles)(ModifyProfileModal);