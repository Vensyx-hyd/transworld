import React, {Component} from 'react';
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
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';

import Progress from './../../../../Components/Loading/Progress';
import AppAPI from './../../../../API';

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

class CreateTrailerModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: {},
            vendorId:"", 
            vendorName:"", 
            trailerNo:"", 
            contactNo:"",
            dateSelectFrom: null,
            fromDate: "", 
            dateSelectTo: null,
            toDate: "",
            rate:"", 
            type:"",
            submitted: this.props.submitted,
            filterFrom: "",
            filterTo: "",
            alert: false,
            alertMessage: ""
        }
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputChangeId = this.onInputChangeId.bind(this);
        this.handleDateChangeFrom = this.handleDateChangeFrom.bind(this);
        this.handleDateChangeTo = this.handleDateChangeTo.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    getVendors() {
        AppAPI.vendors.get(null, null).then((resp) => {
            let data = resp.vendors
            console.log(data, "+++++++++ Get Details +++++++++");
            this.setState({
                info: data
            })     
        }).catch(error => console.log(error))
    }

    componentDidMount(){
        this.getVendors();
    } 

    onInputChange = event => {
        this.setState({[event.target.name]: event.target.value});
    }

    onInputChangeId(event) {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value});
        var vendorInfo = this.state.info;
        let obj = vendorInfo.find(obj => obj.vendorId === Number(event.target.value))
        console.log(obj, "Vendor OBJ")
        if (obj !== undefined) {
            this.setState({
                vendorName: obj.vendorName
            })
        }
        else {
            this.setState({
                vendorName:"",
            })
        } 
    }

    handleDateChangeFrom = date => {
        if (date) {
            var selectedFrom = moment(date).format("L");
            this.setState({
                dateSelectFrom: date,
                fromDate: selectedFrom,
            });
        }
    };
    
    handleDateChangeTo = date => {
        if (date) {
            var selectedTo = moment(date).format("L");
            this.setState({
                dateSelectTo: date,
                toDate: selectedTo,
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
        let { vendorId, vendorName, type, trailerNo, contactNo, rate, fromDate, toDate, dateSelectFrom, dateSelectTo } = {...this.state}
        const days = this.calculateDaysLeft(dateSelectFrom, dateSelectTo);
        if ((type && fromDate &&  toDate) !== "" ) {
            this.loader();
            this.props.createTrailer({
                vendorId,
                vendorName,
                type,
                trailerNo,
                contactNo,
                rate,   
                fromDate,
                toDate,
                days
            });
        } else {
            this.setState({
                alert: true,
                alertMessage: "Trip Type, From Date & To Date are Required"
            })
        }        
    }    

    backToTable() {
        this.props.backToHire();
    }

    render() {
        const { classes } = this.props;
        const { submitted, dateSelectFrom, dateSelectTo } = this.state;       
        return (
                <div className="d-flex justify-content-center">
                    <Paper style={{width: "550px"}}>
                    <h6 className="custom">Create Trailer</h6>
                        <div className="container pl-4 pr-4">
                            <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                                <div className={classes.root}>
                                    <Grid container spacing={24}>
                                        <Grid item xs={6}>
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                label="Vendor ID"
                                                name="vendorId"
                                                value={this.state.vendorId}
                                                onChange={this.onInputChangeId}
                                                validators={['required', 'isNumber']}
                                                errorMessages={['Vendor ID is required']}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                label="Vendor Name"
                                                name="vendorName"
                                                value={this.state.vendorName}
                                                InputProps={{
                                                    classes: {
                                                        underline: classes.cssUnderline
                                                    },
                                                }}
                                                validators={['required']}
                                                errorMessages={['Vendor Name is required']}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>      
                                <div className={classes.root}>
                                    <Grid container spacing={24}>
                                        <Grid item xs={6}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="trailerType">Trip Type</InputLabel>
                                                    <Select
                                                        value={this.state.type}
                                                        onChange={this.onInputChange}
                                                        inputProps={{
                                                            name: 'type',
                                                            id: 'trailerType',
                                                        }}
                                                    >
                                                    <MenuItem value={1}>Empty</MenuItem>
                                                    <MenuItem value={2}>Loaded</MenuItem>
                                                    <MenuItem value={3}>Empty Container</MenuItem>
                                                    </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                label="Trailer No."
                                                name="trailerNo"
                                                value={this.state.trailerNo}
                                                onChange={this.onInputChange}
                                                validators={['required']}
                                                errorMessages={['Trailer Number is required']}
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
                                                label="Mobile No."
                                                name="contactNo"
                                                value={this.state.contactNo}
                                                onChange={this.onInputChange}    
                                                validators={['required', 'matchRegexp:^[6-9][0-9]{9}$']}
                                                errorMessages={['Contact Number is required']}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                label="Price"
                                                name="rate"
                                                value={this.state.rate}
                                                onChange={this.onInputChange}
                                                validators={['required', 'isNumber']}
                                                errorMessages={['Price is required']}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className="pt-2 pb-2">
                                    <Grid container spacing={24}>
                                        <Grid item xs={6}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <DatePicker
                                                    keyboard
                                                    fullWidth
                                                    clearable
                                                    disablePast
                                                    maxDate={dateSelectTo}
                                                    margin="normal"
                                                    label="From Date"
                                                    value={dateSelectFrom}
                                                    onChange={this.handleDateChangeFrom}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>                                           
                                                <DatePicker
                                                    keyboard
                                                    fullWidth
                                                    clearable
                                                    minDate={dateSelectFrom}
                                                    margin="normal"
                                                    label="To Date"
                                                    value={dateSelectTo}
                                                    onChange={this.handleDateChangeTo}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className="d-flex justify-content-start pt-2">
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

export default withStyles(styles)(CreateTrailerModal);