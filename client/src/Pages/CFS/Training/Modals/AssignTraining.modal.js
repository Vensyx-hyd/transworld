import React, {Component} from 'react';
import { 
    Paper,
    Radio,
    Button,
    withStyles,
    Typography,
    Snackbar,
    IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {ValidatorForm} from 'react-material-ui-form-validator';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';

import Progress from './../../../../Components/Loading/Progress';

const styles = theme => ({
    root: {
        color: "#332c6fba",
        padding: "12px 12px 12px 0 !important",
        '&$checked': {
            color: "#332c6f",
        },
    },
    checked: {},
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
});

class AssignTrainingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trainings: this.props.selectedRow,
            drivers: this.props.drivers,
            trainingId: "",
            driverNames:[],
            selectedValue: '',
            submitted: this.props.submitted, 
            alert: false,
            alertMessage: "" 
        }
        this.handleChecked = this.handleChecked.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }   

    componentDidMount() {
        var trs = this.state.trainings;
        var tId = trs.trainingId;
        this.setState({
            trainingId: tId
        })
    }

    loader() {
        this.setState({ submitted: true });
    }

    handleChecked = event => {
        this.setState({selectedValue: event.target.value});
    };

    handleChangeSelect = (driverNames) => {
        this.setState({ driverNames });
        console.log(`Selected Drivers:`, driverNames);
    }    

    closeModal() {
        this.setState({
            alert: false
        })
    }

    onSubmit() {
        const id = this.state.trainingId;
        if ( this.state.selectedValue === 'All' ) {
            var initDrivers = [];
            if(this.state.drivers.length>0) {
                this.state.drivers.forEach(function(obj) {
                    console.log(obj, "Objects of Drivers............");
                    initDrivers.push(obj.name);
                })
                this.loader();
            } 
            console.log(initDrivers, "-----------Drivers list-----------");
            this.props.assignTraining({ trainingId: id, driverNames: initDrivers });
        } 
        else if ( this.state.selectedValue === 'Choose Drivers Name' ) {
            var driverNames = [];
            if(this.state.driverNames.length>0) {
                this.state.driverNames.forEach(function(obj) {
                    console.log(obj, "Objects of Drivers............");
                    driverNames.push(obj.name);
                })
                this.loader();
            } 
            console.log(driverNames, driverNames);
            if (driverNames.length !== 0) {
                this.props.assignTraining({trainingId: id, driverNames: driverNames});            
            } else {
                this.setState({
                    alert: true,
                    alertMessage: "Please Select Driver's to Proceed"
                })
            }            
        } else {
            this.setState({
                alert: true,
                alertMessage: "Please Select Option to Proceed"
            })
        }
    }

    backToTable() {
        this.props.backToTraining();
    }

    render() {
        const {classes} = this.props;
        const { submitted } = this.state;
        const { drivers } = this.state;
        return (
                    <Paper style={{width: "550px"}}>
                        <h6 className="custom">Assign Training</h6>
                        <div className="container p-4">
                            <ValidatorForm ref="form" onSubmit={this.onSubmit} style={{textAlign: "left"}}>
                                <Radio
                                    checked={this.state.selectedValue === 'All'}
                                    onChange={this.handleChecked}
                                    value="All"
                                    name="radio-button-demo"
                                    classes={{
                                        root: classes.root,
                                        checked: classes.checked,
                                    }}
                                />
                                <label>All Driver's</label>
                                <br/>
                                <Radio
                                    checked={this.state.selectedValue === 'Choose Drivers Name'}
                                    onChange={this.handleChecked}
                                    value="Choose Drivers Name"
                                    name="radio-button-demo"
                                    classes={{
                                        root: classes.root,
                                        checked: classes.checked,
                                    }}
                                />
                                <label>Choose Driver's</label>
                                {
                                    this.state.selectedValue === 'Choose Drivers Name' 
                                    ? 
                                    <Select
                                        isMulti
                                        closeMenuOnSelect={false}
                                        components={makeAnimated()}
                                        name="driverNames"
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        options={drivers}                                        
                                        value={this.state.driverNames}                                        
                                        onChange={this.handleChangeSelect}
                                        placeholder="Select Driver Names"
                                    /> 
                                    : 
                                    null

                                }
                                <div className="d-flex justify-content-start pt-3">
                                    <Typography variant="caption" gutterBottom>
                                        Note: Please Select One Option
                                    </Typography> 
                                </div>                                 
                                <div className="d-flex justify-content-center pt-3">
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
                    </Paper>
        );
    }
}

export default withStyles(styles)(AssignTrainingModal);