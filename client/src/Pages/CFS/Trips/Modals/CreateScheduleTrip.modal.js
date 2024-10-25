import React, {Component} from 'react';
import SelectList from 'react-select';
import { 
    Paper,
    Button,
    withStyles,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
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

import AppAPI from '../../../../API'
import Progress from './../../../../Components/Loading/Progress';
import Loading from './../../../../Components/Loading/Loading';

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

class CreateScheduleTripModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contNo:"", 
            tripType:"",         
            contType: "",
            dateSelectFrom: null,
            expStartTime:"",
            dateSelectTo: null,
            expEndTime:"",   
            trailers: this.props.trailers,
            selectedTrailerOption: "",
            drivers: this.props.drivers, 
            selectedDriverName: "",        
            driverId:"",
            locations: this.props.locations,
            startLoc:"",
            startLocId:"",
            startLocLatLong:"",            
            endLoc:"",
            endLocId:"",
            endLocLatLong:"",
            trailerNo: "",             
            submitted: this.props.submitted,
            alert: false,
            alertMessage: "",
            switch: false,
            loading: false
        }
        let { trailerNo, loading } = {...this.state};
        this.initialState = { trailerNo, loading }
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputChangeType = this.onInputChangeType.bind(this);
        this.handleDateChangeFrom = this.handleDateChangeFrom.bind(this);
        this.handleDateChangeTo = this.handleDateChangeTo.bind(this);
        this.handleTrailerChange = this.handleTrailerChange.bind(this);
        this.handleDriverChange = this.handleDriverChange.bind(this);
        this.handleStartLocationChange = this.handleStartLocationChange.bind(this);
        this.handleEndLocationChange = this.handleEndLocationChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.resetTrailer = this.resetTrailer.bind(this);
    }

    onInputChange = event => {
        this.setState({[event.target.name]: event.target.value});
    }

    check(value) {
        if(value === 1)              
          {
            this.setState({                
                switch: true,
                contType: 0
            })
        } else if(value === 2 || 3) {
            this.setState({
                switch: false,
                contType: ""
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
                trailerNo: selectedTrailerOption.label,
                trailerActive: true
            });
        }        
    } 

    resetTrailer() {
        this.setState(
            this.initialState,
        )
    }

    getTrailerBySysId(data) { 
        this.setState({ loading: true});        
        AppAPI.trailerBySysid.post(null, data).then((res) => {
            this.resetTrailer();
            console.log(res.trailers.length, "RES TRAILER LEN")
            let trailer = res.trailers[0].trailerNo; 
            this.setState({ trailerNo: trailer })
        }).catch(e => console.log(e))  
    }

    handleDriverChange = (selectedDriverOption) => {        
        if (selectedDriverOption !== null) {
            this.setState({ selectedDriverOption });
            this.setState({ driverId: selectedDriverOption.systemUserId });
            let data = {
                id: selectedDriverOption.systemUserId
            }            
            this.getTrailerBySysId(data);
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

    onSubmit() {
        let { contNo, tripType, contType, startLoc, endLoc, startLocId, endLocId, expStartTime, expEndTime, driverId, trailerNo,startLocLatLong,endLocLatLong} = {...this.state}        
        let startLocName = this.state.startLoc;
        let endLocName = this.state.endLoc;       
        if ( ((tripType && contType && startLoc && endLoc && expStartTime && expEndTime && driverId) !== "") && (trailerNo !== "") && (startLoc !== endLoc)) {
            this.loader()
            startLoc=startLocLatLong;
            endLoc=endLocLatLong;            
            this.props.createScheduleTrip({
                contNo,
                tripType,
                contType,
                startLoc,
                startLocName,
                endLocName,
                startLocId,
                endLocId,
                endLoc,
                expStartTime,   
                expEndTime,
                driverId,
                trailerNo
            });
        } else if ((tripType && this.state.contType && startLoc && endLoc && expStartTime && expEndTime  && driverId) === "") {
            this.setState({
                alert: true,
                alertMessage: "Trip Type, Container Type, Start & End Location, Est. Start Time & End Time & Driver Name are Required"
            })
        } else if ((tripType && startLoc && endLoc && expStartTime && expEndTime && driverId) === "") {
            this.setState({
                alert: true,
            })
        } else if ((startLoc && endLoc) !== "" && startLoc === endLoc) {
            this.setState({
                alert: true,
                alertMessage: "Start Location & End Location should not Match"
            })
        } else if (trailerNo === "") {
            this.setState({
                alert: true,
                alertMessage: "Trailer No. should not be Empty !"
            })
        }
    }    

    backToTable() {
        this.props.closeModal();
    }

    render() {
        const { classes } = this.props;
        const { submitted, dateSelectFrom, dateSelectTo, selectedTrailerOption, selectedDriverOption, selectedStartLocationOption, selectedEndLocationOption, loading } = this.state;       
        return (
                <div className="d-flex justify-content-center">
                    <Paper style={{width: "550px"}}>
                    <h6 className="custom">Create Trip</h6>
                        <div className="container pl-4 pr-4">
                            <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                                <div className={classes.root}>
                                    <Grid container spacing={24}>
                                        <Grid item xs={6}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="trType">Trip Type</InputLabel>
                                                    <Select
                                                        value={this.state.tripType}
                                                        onChange={this.onInputChangeType}
                                                        inputProps={{
                                                            name: 'tripType',
                                                            id: 'trType',
                                                        }}
                                                    >
                                                    <MenuItem value={1}>Empty</MenuItem>
                                                    <MenuItem value={2}>Loaded</MenuItem>
                                                    <MenuItem value={3}>Empty Container</MenuItem>
                                                    </Select>
                                            </FormControl>
                                        </Grid>    
                                        <Grid item xs={6}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="conType">Container Type</InputLabel>
                                                    <Select
                                                        value={this.state.contType}
                                                        onChange={this.onInputChange}
                                                        disabled={this.state.switch}
                                                        inputProps={{
                                                            name: 'contType',
                                                            id: 'conType',
                                                        }}
                                                    >
                                                    <MenuItem value={20}>20 Feet</MenuItem>
                                                    <MenuItem value={40}>40 Feet</MenuItem>
                                                    </Select>
                                            </FormControl>
                                        </Grid>  
                                        {/* <Grid item xs={4}>
                                            <label className="calendarLable"></label>
                                            <SelectList   
                                                defaultInputValue=""
                                                classNamePrefix="select"
                                                value={selectedTrailerOption}
                                                onChange={this.handleTrailerChange}
                                                options={this.state.trailers}
                                                backspaceRemovesValue={true}
                                                isClearable={true}
                                                isSearchable={true}
                                                isOptionSelected={true}
                                                blurInputOnSelect={true}
                                                placeholder="Trailer No."
                                            />
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                label="Trailer No."
                                                name="trailerNo"
                                                value={this.state.trailerNo}
                                                onChange={this.onInputChange}
                                                validators={['required']}
                                                errorMessages={['Trailer No. is required']}
                                            />
                                        </Grid>                            */}
                                    </Grid>
                                </div>      
                                <div className={classes.root}>
                                    <Grid container spacing={24}>
                                        <Grid item xs={6}>
                                            <label className="calendarLable"></label>
                                            <SelectList
                                                defaultInputValue=""
                                                classNamePrefix="select"
                                                value={selectedStartLocationOption}
                                                onChange={this.handleStartLocationChange}
                                                options={this.state.locations}
                                                backspaceRemovesValue={true}
                                                isClearable={true}
                                                isSearchable={true}
                                                isOptionSelected={true}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                                blurInputOnSelect={true}
                                                placeholder="Start Location"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <label className="calendarLable"></label>
                                            <SelectList
                                                defaultInputValue=""
                                                classNamePrefix="select"
                                                value={selectedEndLocationOption}
                                                onChange={this.handleEndLocationChange}
                                                options={this.state.locations}
                                                backspaceRemovesValue={true}
                                                isClearable={true}
                                                isSearchable={true}
                                                isOptionSelected={true}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                                blurInputOnSelect={true}
                                                placeholder="End Location"
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
                                        <Grid item xs={6}>
                                            <label className="calendarLable"></label>
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
                                                placeholder="Driver Name"
                                            />
                                        </Grid> 
                                        <Grid item xs={6}>                                       
                                            <TextValidator 
                                                fullWidth 
                                                margin="normal"
                                                name="trailerNumber"
                                                label="Trailer No."
                                                // value={this.state.trailerNo}
                                                value={ loading ? "please wait..." : this.state.trailerNo}
                                                InputProps={{
                                                    classes: {
                                                        underline: classes.cssUnderline
                                                    },
                                                }}
                                            />                                                
                                            {/* <label className="calendarLable"></label>
                                            <SelectList        
                                                defaultInputValue=""
                                                classNamePrefix="select"
                                                value={selectedTrailerOption}
                                                onChange={this.handleTrailerChange}
                                                options={this.state.trailers}
                                                backspaceRemovesValue={true}
                                                isClearable={true}
                                                isSearchable={true}
                                                isOptionSelected={true}
                                                blurInputOnSelect={true}
                                                placeholder="Trailer No."
                                            /> */}
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

export default withStyles(styles)(CreateScheduleTripModal);