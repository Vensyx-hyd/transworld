import React, {Component} from 'react';
import SelectList from 'react-select';
import { 
    Paper,
    Button,
    withStyles,
    Grid,
    Typography,
    Snackbar,
    IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import moment from 'moment';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';

import Progress from './../../../../../Components/Loading/Progress';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    formControl: {
        minWidth: '100%',
        marginTop: theme.spacing.unit*2
    },
    button: {
        margin: theme.spacing.unit
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

class CreateTripModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            berthingDate: this.props.sendData.date,
            id: this.props.sendData.id,
            cycle: this.props.sendData.cycle,
            tripTyper: this.props.sendData.tripType,
            startLoc: this.props.sendData.startLoc,
            startLocId: "",
            startLocLatLong: "",
            endLoc: this.props.sendData.endLoc,
            endLocId: "",
            endLocLatLong: "",
            cont1: this.props.sendData.cont1,
            cont2: this.props.sendData.cont2,
            sizer: this.props.sendData.size,
            locations: this.props.locations,
            trailers: this.props.trailers,
            driverId:"",           
            trailerNo:"", 
            adminTripId:"",
            dateSelectFrom: null,
            expStartTime:"",
            dateSelectTo: null,
            expEndTime:"",   
            drivers: this.props.drivers, 
            selectedDriverName: "",
            submitted: this.props.submitted,
            alert: false,
            alertMessage: "",
            selectedTrailerOption: "",
            switch: false
        }
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputChangeType = this.onInputChangeType.bind(this);
        this.handleTrailerChange = this.handleTrailerChange.bind(this);
        this.handleDateChangeFrom = this.handleDateChangeFrom.bind(this);
        this.handleDateChangeTo = this.handleDateChangeTo.bind(this);
        this.handleDriverChange = this.handleDriverChange.bind(this);
        this.handleStartLocationChange = this.handleStartLocationChange.bind(this);
        this.handleEndLocationChange = this.handleEndLocationChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    findLocData(name) {    
        if (this.state.locations !== []) {
            return this.state.locations.find(obj => obj.locName === name)
        }        
    }

    componentDidMount() {
        const startLocData = this.findLocData(this.state.startLoc);
        const endLocData = this.findLocData(this.state.endLoc);
        if ((startLocData && endLocData) !== undefined)  {
            this.setState({
                startLocId: startLocData.locId,
                startLocLatLong: startLocData.latLong,
                endLocId: endLocData.locId,
                endLocLatLong: endLocData.latLong
            })
        }        
    }

    onInputChange = event => {
        this.setState({[event.target.name]: event.target.value});
    }

    check(value) {
        console.log(value, "Trip Type");
        if(value === 1)                {
            this.setState({
                switch: true
            })
        } else if(value === 2 || 3) {
            this.setState({
                switch: false
            })
        }
    }

    onInputChangeType = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
        this.check(event.target.value);        
    };
    
    handleTrailerChange = (selectedTrailerOption) => {
        if (selectedTrailerOption !== null) {
            this.setState({ selectedTrailerOption });
            this.setState({ 
                trailerNo: selectedTrailerOption.label
            });
        }        
    } 

    handleDriverChange = (selectedDriverOption) => {
        if (selectedDriverOption !== null) {
            this.setState({ selectedDriverOption });
            this.setState({ driverId: selectedDriverOption.systemUserId });
        }        
    } 

    handleStartLocationChange = (selectedStartLocationOption) => {
        if (selectedStartLocationOption !== null) {
            this.setState({ selectedStartLocationOption });
            this.setState({ startLoc: selectedStartLocationOption.locName });
            this.setState({ startLocId: selectedStartLocationOption.locId });
            this.setState({ startLocLatLong: selectedStartLocationOption.latLong });
        }        
    }  

    handleEndLocationChange = (selectedEndLocationOption) => {
        if (selectedEndLocationOption !== null) {
            this.setState({ selectedEndLocationOption });
            this.setState({ endLoc: selectedEndLocationOption.locName });
            this.setState({ endLocId: selectedEndLocationOption.locId });
            this.setState({ endLocLatLong: selectedEndLocationOption.latLong });
        }        
    }  

    handleDateChangeFrom = date => {
        if (date) {
            var selectedFrom = moment(date);
            this.setState({
                dateSelectFrom: date,
                expStartTime: selectedFrom,
            });
        }
    };
    
    handleDateChangeTo = date => {
        if (date) {
            var selectedTo = moment(date);
            this.setState({
                dateSelectTo: date,
                expEndTime: selectedTo,
            });
        }   
    }

    calculateDaysLeft(dateSelectFrom,dateSelectTo){
            if (!moment.isMoment(dateSelectFrom)) dateSelectFrom = moment(dateSelectFrom);
            if (!moment.isMoment(dateSelectTo)) dateSelectTo = moment(dateSelectTo);
        return dateSelectTo.diff(dateSelectFrom, "days");
    }
    
    loader() {
        this.setState({ submitted: true });
    } 

    closeModal() {
        this.setState({
            alert: false
        })
    }

    tripConvert(type) {
        return type === "Empty" ? 3 : 2;
    }

    sizeConvert(size) {
        return size.slice(0,2);
    }

    onSubmit() {
        let { adminTripId, cont1, cont2, tripTyper, startLoc, startLocId, startLocLatLong, endLoc, endLocId, endLocLatLong, expStartTime, expEndTime, driverId, trailerNo, id, cycle, sizer, berthingDate } = {...this.state}                       
        const tripType = this.tripConvert(tripTyper);
        const size = this.sizeConvert(sizer);    
        if ((expEndTime && expEndTime && trailerNo && driverId) !== "")     {
            this.loader();
            this.props.createTrip({
                adminTripId,
                tripType,
                startLoc,
                startLocId,
                startLocLatLong,            
                endLoc,
                endLocId,
                endLocLatLong,
                expStartTime,   
                expEndTime,
                driverId,
                trailerNo,
                id,
                cycle,
                size,
                cont1,
                cont2,
                berthingDate
            }); 
        } else {
            this.setState({
                alert: true,
                alertMessage: "Est. Start Time & End Time, Trailer No. & Driver Name are Required"
            })
        }
                  
    }    

    backToTable() {
        this.props.closeModal();
    }

    render() {
        const { classes } = this.props;
        const { submitted, selectedTrailerOption, dateSelectFrom, dateSelectTo, selectedDriverOption } = this.state;       
        return (
                <div className="d-flex justify-content-center">
                    <Paper style={{width: "550px"}}>
                    <h6 className="custom">Create Trip</h6>
                        <div className="container pl-4 pr-4">
                            <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                                <div className={classes.root}>
                                    <Grid container spacing={24}>
                                        <Grid item xs={4}>
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                label="Trip Type"
                                                name="tripType"
                                                value={this.state.tripTyper}                                                
                                            />
                                        </Grid>    
                                        <Grid item xs={4}>
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                label="Size"
                                                name="size"
                                                value={this.state.sizer}                                                
                                            />
                                        </Grid>  
                                        <Grid item xs={4}>
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                label="Cycle"
                                                name="cycle"
                                                value={this.state.cycle}                                                
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
                                                label="Start Location"
                                                name="startLoc"
                                                value={this.state.startLoc}                                                
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                label="End Location"
                                                name="endLoc"
                                                value={this.state.endLoc}                                                
                                            />
                                        </Grid>
                                    </Grid>
                                </div>                                
                                <div className={classes.root}>
                                    <Grid container spacing={24}>
                                        <Grid item xs={6}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <DateTimePicker
                                                    keyboard
                                                    fullWidth
                                                    clearable
                                                    disablePast                                                 
                                                    margin="normal"
                                                    label="Est. Start Date Time"
                                                    maxDate={dateSelectTo}
                                                    minDateMessage                                                    
                                                    value={dateSelectFrom}
                                                    onChange={this.handleDateChangeFrom}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>                                           
                                                <DateTimePicker
                                                    keyboard
                                                    fullWidth
                                                    clearable                                                
                                                    margin="normal"
                                                    label="Est. End Date Time"
                                                    minDate={dateSelectFrom}
                                                    maxDateMessage
                                                    value={dateSelectTo}
                                                    onChange={this.handleDateChangeTo}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className={classes.root}>
                                    <Grid container spacing={24}>
                                        <Grid item xs={3}>
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                label="Container 1"
                                                name="cont1"
                                                value={this.state.cont1}                                                
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                label="Container 2"
                                                name="cont2"
                                                value={this.state.cont2}                                                
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                        <label className="calendarLable">Trailer No.</label>
                                        <SelectList                                                                                                                                           
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
                                                label="Trailer No."
                                                name="trailerNo"
                                                value={this.state.trailerNo}
                                                onChange={this.onInputChange}
                                                validators={['required']}
                                                errorMessages={['Trailer No. is required']}
                                            /> */}
                                        </Grid> 
                                    </Grid>
                                </div>
                                <div className={classes.root}>
                                    <Grid container spacing={24}>                                        
                                        <Grid item xs={12}>
                                            <label className="calendarLable">Driver Name</label>
                                            <SelectList
                                                defaultInputValue=""
                                                classNamePrefix="select"
                                                value={selectedDriverOption}
                                                onChange={this.handleDriverChange}
                                                options={this.state.drivers}
                                                backspaceRemovesValue={true}
                                                isClearable={true}
                                                isSearchable={true}
                                                isOptionSelected={true}
                                                blurInputOnSelect={true}
                                            />
                                        </Grid>                                        
                                    </Grid>
                                </div>
                                <div className="d-flex justify-content-start pt-3">
                                    <Typography variant="caption" gutterBottom>
                                    Note: All Fields are Mandatory
                                    </Typography> 
                                </div>
                                <div className="d-flex justify-content-center pt-2 pb-3" >
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        classes={{
                                            root: classes.button, 
                                            label: classes.saveLabel,
                                        }} 
                                        disabled={submitted}>                        	
                                        {
                                            (submitted && <Progress/>)
                                                || 
                                            (!submitted && 'Submit')
                                        }
                                    </Button>    
                                    <Button 
                                        variant="contained" 
                                        classes={{
                                            root: classes.button, 
                                            label: classes.cancelLabel,
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

export default withStyles(styles)(CreateTripModal);