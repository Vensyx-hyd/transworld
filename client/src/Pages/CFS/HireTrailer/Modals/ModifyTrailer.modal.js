import React, {Component} from 'react';
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import { 
    Paper, 
    Grid, 
    withStyles,
    Button,
    Typography
} from '@material-ui/core';
import moment from 'moment';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';

import Progress from './../../../../Components/Loading/Progress';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    formControl: {
        minWidth: '100%',
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
    dialogPaper: {
        overflow: 'hidden'
    },
    cssUnderline: {    
        color: "#dc3545c9",  
    },  
});

class ModifyTrailerModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detId: this.props.selectedRow.detId,
            vendorId: this.props.selectedRow.vendorId,
            vendorName: this.props.selectedRow.vendorName,
            tripType: this.props.selectedRow.type,
            trailerNumber: this.props.selectedRow.trailerNo,
            contactNumber: this.props.selectedRow.contactNo,
            fromDate: this.props.selectedRow.startDate,
            toDate: this.props.selectedRow.endDate,
            rate: this.props.selectedRow.rate,
            open: true,
            submitted: this.props.submitted
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChangeFrom = this.handleDateChangeFrom.bind(this);
        this.handleDateChangeTo = this.handleDateChangeTo.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }   

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

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

    // handleDateChangeFrom = date => {
    //     this.setState({ 
    //         fromDate: date
    //     });   
    // };
    
    // handleDateChangeTo = date => {
    //     this.setState({ 
    //         toDate: date
    //     }); 
    // };     

    calculateDaysLeft(fromDate,toDate){
        if (!moment.isMoment(fromDate)) fromDate = moment(fromDate);
        if (!moment.isMoment(toDate)) toDate = moment(toDate);
    return toDate.diff(fromDate, "days");
}

    handleClose = event => {
        this.setState({
            open: false
        }, () => {
            this.props.closeModal();
        });
    }    

    backToTable() {
        this.props.backToHire();
    }

    loader() {
        this.setState({ submitted: true });
    }    

    onSubmit() {
        this.loader();
        const { detId, fromDate, toDate, rate } = {...this.state};
        const days = this.calculateDaysLeft(fromDate, toDate);
        this.props.modifyTrailer(detId,{
            fromDate: fromDate,
            toDate: toDate,
            days: days,
            rate: rate
        })
        console.log(this.state.fromDate, this.state.toDate, this.state.days, this.state.rate, days , "Details");
    }

    render() {
        const {classes,} = this.props;
        const { submitted, fromDate, toDate } = this.state; 
        return (
            <div className="d-flex justify-content-center">
                <Paper style={{width: "550px"}}>
                    <h6 className="custom">Modify Trialer</h6>
                    <div className="container pl-4 pr-4">
                        <ValidatorForm ref="form" onSubmit={this.onSubmit} style={{textAlign: "left"}}>
                            <div className={classes.root}>
                                <Grid container spacing={24}>
                                    <Grid item xs={6}>
                                        <TextValidator
                                            fullWidth
                                            margin="normal"
                                            name="vendorId"
                                            label="Vendor ID"
                                            value={this.state.vendorId}
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
                                            name="vendorName"
                                            label="Vendor Name"
                                            value={this.state.vendorName}
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
                                            name="tripType"
                                            label="Trip Type"
                                            value={this.state.tripType === "1" ? "Empty" : this.state.tripType === "2" ? "Loaded" : "Empty Container"}
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
                                </Grid>
                            </div>                                        
                            <div className={classes.root}>
                                <Grid container spacing={24}>
                                    <Grid item xs={6}>
                                        <TextValidator
                                            fullWidth
                                            margin="normal"
                                            name="contactNumber"
                                            label="Mobile No."
                                            value={this.state.contactNumber}
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
                                            name="rate"
                                            label="Hire Price"
                                            value={this.state.rate}
                                            onChange = {this.handleChange}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div className="pt-3 pb-2">
                                <Grid container spacing={24}>
                                    <Grid item xs={6}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <DatePicker
                                                keyboard
                                                fullWidth
                                                clearable
                                                minDate={fromDate}
                                                maxDate={toDate}
                                                margin="normal"
                                                label="From Date"
                                                value={fromDate}
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
                                            minDate={fromDate}
                                            margin="normal"
                                            label="To Date"
                                            value={toDate}
                                            onChange={this.handleDateChangeTo}
                                        />
                                    </MuiPickersUtilsProvider>
                                    </Grid>
                                </Grid>
                            </div>
                            <div className="d-flex justify-content-start pt-4">
                                <Typography variant="caption" gutterBottom>
                                Note: Only Hire Price, From Date and To Date Fields are Editable
                                </Typography> 
                            </div>
                            <div className="d-flex justify-content-center pt-3 pb-3">
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
                                        (!submitted && 'Save')
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
            </div>
        );
    }
}

export default withStyles(styles)(ModifyTrailerModal);