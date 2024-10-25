import React, {Component} from 'react';
import Select from 'react-select';
import moment from 'moment';
import { 
    Paper,
    Grid, 
    Button,
    withStyles,
    Typography,
    Snackbar,
    IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import Progress from './../../../../../Components/Loading/Progress';

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

class ModifyScheduledTripModal extends Component{
	constructor(props){
		super(props);
		this.state = {
			tripsId: this.props.sendData.tripNo,
            tripsType: this.props.sendData.tripType,
            trailerNumber: this.props.sendData.trailerNo,
            startLocationName: this.props.sendData.startLocationName,            
            startTime: this.props.sendData.startDate,
            endTime: this.props.sendData.endDate,
            trailers: this.props.trailers,
            selectedTrailerOption: "",

            driverName: this.props.sendData.driverName,
            endLocationName: this.props.sendData.endLocationName,
            
            driverId: "",
            startLocId: "",
            endLocId: "",

            selectedDriverName: this.props.sendData.driverName,
            selectedEndLocation: this.props.sendData.endLocationName,           
            
            driverNames: this.props.dList,
            locNames: this.props.lList,

            submitted: this.props.submitted,
            
            selectedDriverOption: "",
            selectedFromLocationOption: null,
            selectedToLocationOption: null,
            driverActive: false,
            trailerActive: false,
            startLocationActive: false,
            endLocationActive: false,
            alert: false,
            alertMessage: ""

        }        
        // this.onInputChange = this.onInputChange.bind(this);
        this.handleDriverChange = this.handleDriverChange.bind(this);
        this.handleTrailerChange = this.handleTrailerChange.bind(this);
        this.handleStartLocationChange = this.handleStartLocationChange.bind(this);
        this.handleEndLocationChange = this.handleEndLocationChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    updateDriverSid(driversList,driverName){  
        var filteredDriver = driversList.filter(function(driver){            
        return driver.name === driverName;
        });
        console.log(filteredDriver, "PRINT DATA");
        if(filteredDriver.length === 1) {
            return filteredDriver[0].systemUserId;
        }
    }

    updateLocId(locations,locationName){
        var filteredLoc = locations.filter(function(loc){
        return loc.locName === locationName;
        }); 
        if(filteredLoc.length === 1) {
            return filteredLoc[0].locId;            
            // console.log(filteredLoc[0].locId, "Location ID");
        }
        
    }

    componentDidMount(){     
        console.log(this.state.trailers, "Trailers List");
        var driverId = this.updateDriverSid(this.state.driverNames, this.state.driverName);
        this.setState({
            driverId: driverId
        })
        var startLocId = this.updateLocId(this.state.locNames, this.state.startLocationName);
        // console.log(startLocId, "Start Location");
        this.setState({
            startLocId: startLocId
        })
        var endLocId = this.updateLocId(this.state.locNames, this.state.endLocationName);
        // console.log(endLocId, "End Location");
        this.setState({
            endLocId: endLocId
        })

        if (this.state.tripsType === 1){
            this.setState({
                tripsType: "Empty"
            })
        }
        else if (this.state.tripsType === 2) {
            this.setState({
                tripsType: "Loaded"
            })
        }
        else if (this.state.tripsType === 3) {
            this.setState({
                tripsType: "Empty Container"
            })
        }
    }   
    
	// onInputChange(event) {
    //     const target = event.target;
    //     const value = target.type === 'checkbox' ? target.checked : target.value;
    //     const name = target.name;
    //     this.setState({ [name]: value }, () => {
    //         this.validateField(name, value);
    //     });
    // }

    // validateField(fieldName, value) {
    //     switch (fieldName) {           
    //         case 'endLocation':
    //             this.setState({ endLocationValid: value.length > 0 }, this.validateForm); break;          
    //         case 'driverName':
    //             this.setState({ driverNameValid: value.length > 0 }, this.validateForm); break;            
    //         default: break;
    //     }
    // }
    
    // validateForm() {
    //     this.setState({
    //         formValid: this.state.endLocation && this.state.driverName
    //     });
    // }

    handleTrailerChange = (selectedTrailerOption) => {
        if (selectedTrailerOption !== null) {
            this.setState({ selectedTrailerOption });
            this.setState({ 
                trailerNumber: selectedTrailerOption.label,
                trailerActive: true
            });
        }        
    } 

    handleDriverChange = (selectedDriverOption) => {
        if (selectedDriverOption !== null) {
            this.setState({ selectedDriverOption });
            this.setState({ driverId: selectedDriverOption.systemUserId, driverActive: true });
        }        
    }   
    
    handleStartLocationChange = (selectedFromLocationOption) => {
        if (selectedFromLocationOption !== null) {
            this.setState({ selectedFromLocationOption });
            this.setState({ startLocId: selectedFromLocationOption.locId, startLocationActive: true });
        }        
    } 

    handleEndLocationChange = (selectedToLocationOption) => {
        if (selectedToLocationOption !== null) {
            this.setState({ selectedToLocationOption });
            this.setState({ endLocId: selectedToLocationOption.locId, endLocationActive: true });
        }        
    }    

    loader() {
        this.setState({ 
            submitted: true 
        })
    }

    closeModal() {
        this.setState({
            alert: false
        })
    }
  
	onSubmit() {  
        const { trailerNumber } = this.state;
        if (((this.state.driverActive || this.state.trailerActive) === true) && this.state.driverId !== "") {
            var sysId = this.state.driverId;            
            var sId = this.state.startLocId;
            console.log(sId, "Start Location");
            var eId = this.state.endLocId;
            const { tripsId } = {...this.state}
            this.props.updateTrip(tripsId,{
                driver: sysId,
                trailerNumber
                // startLocId: sId,
                // endLocId: eId
            });
            this.loader();
        } 
        // else if (this.state.startLocId === this.state.endLocId) {
        //     this.setState({
        //         alert: true,
        //         alertMessage: "Start Location and End Location should not be same"
        //     })
        // } 
        else {
            this.setState({
                alert: true,
                alertMessage: "Please Select Driver Name to proceed"
            })
        }
        
    }

    backToTable(){
        this.props.backToTrips();
    } 

    convert(data){
        return data !== null || data !== "" ? moment(data).format("DD/MM/YYYY h:mm:ss A") : null
    }

	render(){
        const { classes } = this.props;
        const { submitted } = this.state;     
        const { selectedDriverOption, selectedTrailerOption, selectedFromLocationOption, selectedToLocationOption } = this.state;  
		return(			
            <div className="d-flex justify-content-center">
                <Paper style={{width: "850px"}}>
                	<h6 className="custom">Modify Trips</h6>
                    <div className="container p-4">
                    <ValidatorForm ref="form" onSubmit={this.onSubmit} style={{textAlign: "left"}}>
                    <div className={classes.root}>
                        <Grid container spacing={24}>       
                            <Grid item xs={3}>
                                <TextValidator 
                                    fullWidth 
                                    margin="normal"
                                    name="tripsId"
                                    label="Trip ID"
                                    value={this.state.tripsId}
                                    InputProps={{
                                        classes: {
                                            underline: classes.cssUnderline
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextValidator 
                                    fullWidth 
                                    margin="normal"
                                    name="tripsType"
                                    label="Trip Type"
                                    value={this.state.tripsType}
                                    InputProps={{
                                        classes: {
                                            underline: classes.cssUnderline
                                        },
                                    }}
                                />
                            </Grid> 
                            <Grid item xs={6}>
                                <label className="calendarLable">Trailer No.</label>
                                <Select                                                                                                   
                                    defaultInputValue={this.state.startLocationName === null || "" ? "" : this.state.trailerNumber}
                                    classNamePrefix="select"
                                    value={selectedTrailerOption}
                                    onChange={this.handleTrailerChange}
                                    options={this.state.trailers}
                                    backspaceRemovesValue={true}
                                    isClearable={true}
                                    isSearchable={true}
                                    isOptionSelected={true}
                                    blurInputOnSelect={true}
                                />
                                {/* <TextValidator 
                                    fullWidth 
                                    margin="normal"
                                    name="trailerNumber"
                                    label="Trailer No."
                                    value={this.state.trailerNumber}
                                    InputProps={{
                                        classes: {
                                            underline: classes.cssUnderline
                                        },
                                    }}
                                />      */}
                            </Grid>   
                        </Grid>
                        </div>
                        {/* <div className={classes.root}>
                        <Grid container spacing={24}>                                   
                            <Grid item xs={6}>
                                <TextValidator 
                                    fullWidth 
                                    margin="normal"
                                    name="startLocation"
                                    label="Start Location"
                                    value={this.state.startLocationName}
                                    InputProps={{
                                        classes: {
                                            underline: classes.cssUnderline
                                        },
                                    }}
                                />
                            </Grid> 
                        </Grid>
                        </div> */}
                        <div className={classes.root}>
                        <Grid container spacing={24}>       
                            <Grid item xs={6}>
                                <TextValidator 
                                    fullWidth 
                                    margin="normal"
                                    name="startTime"
                                    label="Start Time"
                                    value={this.convert(this.state.startTime)}
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
                                    name="endTime"
                                    label="End Time"
                                    value={this.convert(this.state.endTime)}
                                    InputProps={{
                                        classes: {
                                            underline: classes.cssUnderline
                                        },
                                    }}
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
                                    name="startLoc"
                                    label="From Location"
                                    value={this.state.startLocationName}
                                    InputProps={{
                                        classes: {
                                            underline: classes.cssUnderline
                                        },
                                    }}
                                />
                                {/* <label className="calendarLable">From Location</label>
                                <Select
                                    defaultInputValue={this.state.startLocationName === null || "" ? "" : this.state.startLocationName}
                                    classNamePrefix="select"
                                    value={selectedFromLocationOption}
                                    onChange={this.handleStartLocationChange}
                                    options={this.state.locNames}
                                    backspaceRemovesValue={true}
                                    isClearable={true}
                                    isSearchable={true}
                                    isOptionSelected={true}
                                    blurInputOnSelect={true}
                                /> */}
                            </Grid>
                            <Grid item xs={6}>
                                <TextValidator 
                                    fullWidth 
                                    margin="normal"
                                    name="startLoc"
                                    label="To Location"
                                    value={this.state.endLocationName}
                                    InputProps={{
                                        classes: {
                                            underline: classes.cssUnderline
                                        },
                                    }}
                                />
                                {/* <label className="calendarLable">End Location</label>
                                <Select
                                    defaultInputValue={this.state.endLocationName === null || "" ? "" : this.state.endLocationName}
                                    classNamePrefix="select"
                                    value={selectedToLocationOption}
                                    onChange={this.handleEndLocationChange}
                                    options={this.state.locNames}
                                    backspaceRemovesValue={true}
                                    isClearable={true}
                                    isSearchable={true}
                                    isOptionSelected={true}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                    blurInputOnSelect={true}
                                /> */}
                            </Grid>
                        </Grid>
                        </div>  
                        <div>
                            <label className="calendarLable">Driver Name</label>
                            <Select
                                defaultInputValue={this.state.driverName === null || "" ? "" : this.state.driverName}
                                classNamePrefix="select"
                                value={selectedDriverOption}
                                onChange={this.handleDriverChange}
                                options={this.state.driverNames}
                                backspaceRemovesValue={true}
                                isClearable={true}
                                isSearchable={true}
                                isOptionSelected={true}
                                blurInputOnSelect={true}
                            />
                        </div>
                        <div className="d-flex justify-content-start pt-4">
                            <Typography variant="caption" gutterBottom>
                            Note: Only Driver Name, From Location and End Location Fields are Editable
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
                                onClick={this.backToTable.bind(this)}>
                                Cancel
                            </Button>   
                        </div>                       
                    </ValidatorForm>
                    </div>
                </Paper>
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
		);
	}
}

export default withStyles(styles)(ModifyScheduledTripModal);