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
    color: "#dc3545c9"   
  }  
});
class ModifyRunningTripModal extends Component{
	constructor(props){
		super(props);
		this.state = {
			tripsId: this.props.sendData.tripNo,
            tripsType: this.props.sendData.tripType,
            trailerNumber: this.props.sendData.trailerNo,
            startLocation: this.props.sendData.startLocationName,            
            startTime: this.props.sendData.startDate,
            endTime: this.props.sendData.endDate,

            driverName: this.props.sendData.driverName,
            endLocationName: this.props.sendData.endLocationName,

            driverId: "",
            endLocId: "",

            selectedDriverName: this.props.sendData.driverName,
            selectedEndLocation: this.props.sendData.endLocationName,           
            
            driverNames: this.props.dList,
            locNames: this.props.lList,

            submitted: this.props.submitted,
            
            selectedDriverOption: "",
            selectedLocationOption: null,
            driverActive: false,
            locationActive: false
        }
        this.handleDriverChange = this.handleDriverChange.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
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

    updateLocId(locations,endLocationName){
        var filteredLoc = locations.filter(function(loc){
        return loc.locName === endLocationName;
        }); 
        if(filteredLoc.length === 1) {
            return filteredLoc[0].locId;
        }
        
    }

    componentDidMount(){     
        var driverId = this.updateDriverSid(this.state.driverNames, this.state.driverName);
        this.setState({
            driverId: driverId
        })
        var endLocId = this.updateLocId(this.state.locNames, this.state.endLocationName);
        console.log(endLocId, "End Location Name 1");
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

    handleDriverChange = (selectedDriverOption) => {
        if (selectedDriverOption !== null) {
            this.setState({ selectedDriverOption });
            this.setState({ driverId: selectedDriverOption.systemUserId, driverActive: true });
        }  
    }                                                                                                                                                                                                                                                                                                                           

    handleLocationChange = (selectedLocationOption) => {
        if (selectedLocationOption !== null) {
            this.setState({ selectedLocationOption });
            this.setState({ endLocId: selectedLocationOption.locId, locationActive: true });
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
        if (((this.state.driverActive || this.state.locationActive) === true) && this.state.driverId !== "" && this.state.endLocId !== "") {
            var sysId = this.state.driverId;
            var lId = this.state.endLocId;
            console.log(lId, "End Location ID");
            const { tripsId } = {...this.state}
            this.props.updateTrip(tripsId,{
                driver: sysId,
                endLocId: lId
            });
            this.loader();
        }  
        else {
            this.setState({
                alert: true,
                alertMessage: "Please Select Driver Name or End Location to proceed"
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
        const { selectedDriverOption, selectedLocationOption } = this.state;  
		return(
                <div className="d-flex justify-content-center">
                <Paper style={{width: "550px"}}>
                	<h6 className="custom">Modify Trips</h6>
                    <div className="container p-4">
                    <ValidatorForm ref="form" onSubmit={this.onSubmit} style={{textAlign: "left"}}>
                    <div className={classes.root}>
                        <Grid container spacing={24}>       
                            <Grid item xs={6}>
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
                            <Grid item xs={6}>
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
                        </Grid>
                        </div>
                        <div className={classes.root}>
                        <Grid container spacing={24}>   
                            <Grid item xs={6}>
                                <TextValidator 
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
                                />     
                            </Grid>       
                            <Grid item xs={6}>
                                <TextValidator 
                                    fullWidth 
                                    margin="normal"
                                    name="startLocation"
                                    label="Start Location"
                                    value={this.state.startLocation}
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
                                <label className="calendarLable">Driver Name</label>
                                <Select
                                    defaultInputValue={this.state.driverName === null || "" ? "" : this.state.driverName}
                                    classNamePrefix="select"
                                    options={this.state.driverNames}
                                    value={selectedDriverOption}
                                    onChange={this.handleDriverChange}                                    
                                    backspaceRemovesValue={true}
                                    isClearable={true}
                                    isSearchable={true}
                                    isOptionSelected={true}
                                    blurInputOnSelect={true}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <label className="calendarLable">End Location</label>
                                <Select
                                    defaultInputValue={this.state.endLocationName === null || "" ? "" : this.state.endLocationName}
                                    classNamePrefix="select"
                                    value={selectedLocationOption}
                                    onChange={this.handleLocationChange}
                                    options={this.state.locNames}
                                    backspaceRemovesValue={true}
                                    isClearable={true}
                                    isSearchable={true}
                                    isOptionSelected={true}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                    blurInputOnSelect={true}
                                />
                            </Grid>
                        </Grid>
                        </div>  
                        <div className="d-flex justify-content-start pt-4">
                            <Typography variant="caption" gutterBottom>
                                Note: Only Driver Name and End Location Fields are Editable
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

export default withStyles(styles)(ModifyRunningTripModal);