import React, {Component} from 'react';
import {
    Paper,
    Grid, 
    InputLabel, 
    MenuItem, 
    FormControl, 
    Select,
    Button,
    withStyles,
    Typography,
    Snackbar,
    IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
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
});
class CreateTrainingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trainingName: "",
            trainerName: "",
            trainingLoc: "",
            trainingDate: null,
            type: "",
            submitted: this.props.submitted, 
            open: false,
            alert: false,
            alertMessage: ""
        };
        this.onInputChange = this.onInputChange.bind(this);
        this.handleDateChange= this.handleDateChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]: value}, () => {
            this.validateField(name, value);
        });
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleDateChange = date => {
        this.setState({ 
            trainingDate: date
        });   
    };

    validateField(fieldName, value) {
        switch (fieldName) {
            case 'trainingId':
                this.setState({trainingIdValid: value.length > 0}, this.validateForm);
                break;
            case 'trainingName':
                this.setState({trainingNameValid: value.length > 0}, this.validateForm);
                break;
            case 'location':
                this.setState({locationValid: value.length > 0}, this.validateForm);
                break;
            case 'trainingType':
                this.setState({trainingTypeValid: value.length > 0}, this.validateForm);
                break;
            case 'trainingDate':
                this.setState({trainingDateValid: value.length > 0}, this.validateForm);
                break;
            default:
                break;
        }
    }

    loader() {
        this.setState({ submitted: true }, () => {
            setTimeout(() => this.setState({ submitted: false }), 3000);
        });
    }      

    closeModal() {
        this.setState({
            alert: false
        })
    }

    onSubmit() {
        if (this.state.type !== "" && this.state.trainingDate !== null) {
            this.loader();
            this.props.createTraining(this.state);
        } else {
            this.setState({
                alert: true,
                alertMessage: "Training Type & Date are Required"
            })
        }       
    }    

    backToTable() {
        this.props.backToTraining();
    }

    render() {
        const {classes} = this.props;
        const { submitted, trainingDate } = this.state;
        return (
                <div className="d-flex justify-content-center">
                    <Paper style={{width: "550px"}}>
                        <h6 className="custom">Create Training</h6>
                        <div className="container p-3">
                            <ValidatorForm ref="form" onSubmit={this.onSubmit} style={{textAlign: "left"}}>
                                <div className={classes.root}>
                                    <Grid container spacing={24}>
                                        <Grid item xs={4}>
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                name="trainingName"
                                                label="Training Name"
                                                value={this.state.trainingName}
                                                onChange={this.onInputChange}
                                                validators={['required']}
                                                errorMessages={['Training Name is required']}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                name="trainingLoc"
                                                label="Training Location"
                                                value={this.state.trainingLoc}
                                                onChange={this.onInputChange}
                                                validators={['required']}
                                                errorMessages={['Training Location is required']}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                name="trainerName"
                                                label="Trainer Name"
                                                value={this.state.trainerName}
                                                onChange={this.onInputChange}
                                                validators={['required']}
                                                errorMessages={['Trainer Name is required']}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className={classes.root}>
                                    <Grid container spacing={24}>                                        
                                        <Grid item xs={6}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="training">Training Type</InputLabel>
                                                    <Select
                                                        value={this.state.type}
                                                        onChange={this.handleChange}
                                                        inputProps={{
                                                            name: 'type',
                                                            id: 'training',
                                                        }}
                                                    >
                                                    <MenuItem value={1}>Driver Loading Training</MenuItem>
                                                    <MenuItem value={2}>App Training</MenuItem>
                                                    </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <DatePicker
                                                    keyboard
                                                    fullWidth
                                                    clearable
                                                    disablePast                                                    
                                                    margin="normal"
                                                    label="Date"
                                                    value={trainingDate}
                                                    onChange={this.handleDateChange}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className="d-flex justify-content-start pt-4">
                                    <Typography variant="caption" gutterBottom>
                                        Note: All Fields are Mandatory
                                    </Typography> 
                                </div> 
                                <div className="d-flex justify-content-center pt-2" >
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

export default withStyles(styles)(CreateTrainingModal);