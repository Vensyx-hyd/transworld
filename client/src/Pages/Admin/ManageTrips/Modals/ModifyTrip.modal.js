import React, {Component} from 'react';
import {
    Paper,
    Grid, 
    Typography,
    withStyles,
    Button
} from '@material-ui/core';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import Progress from '../../../../Components/Loading/Progress';

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

class ModifyManageTrips extends Component {
    constructor(props) {
        super(props);
        this.state = {           
            id: this.props.selectedRow.tripId,
            type: this.props.selectedRow.type,
            tripTypeId: this.props.selectedRow.tripTypeId,            
            startLoc: this.props.selectedRow.startLoc,
            endLoc: this.props.selectedRow.endLoc,
            distance: this.props.selectedRow.distance,
            fuelReq: this.props.selectedRow.fuelReq,
            driInc: this.props.selectedRow.driInc    ,
            tripType:this.props.selectedRow.tripTypeId,
            contType: this.props.selectedRow.contType,
            contWt: this.props.selectedRow.contWt,
            submitted: false
        };        
        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }    

    onInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    loader() {
        this.setState({ submitted: true }, () => {
            setTimeout(() => this.setState({ submitted: false }), 5000);
        });
    }

    onSubmit() {
        this.loader();
        const { id, fuelReq, driInc} = {...this.state};
        this.props.modifyTrip(id, {           
            fuelReq,
            driInc
        })
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };


    render() {
        const {classes} = this.props;
        const { submitted } = this.state;
        return (
            <div className="container" style={{paddingLeft: "0px", paddingRight: "0px"}}>
                <div className="d-flex justify-content-center">
                    <Paper style={{width: "550px"}}>
                        <h6 className="custom">Modify Trip</h6>
                        <div className="container p-4">
                            <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                            <div className={classes.root}>
                                    <Grid container spacing={24}>
                                         <Grid item xs={4}>
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                name="tripTypeId"
                                                label="Trip ID"
                                                value={this.state.id}
                                                InputProps={{
                                                    classes: {
                                                        underline: classes.cssUnderline
                                                    },
                                                }}
                                            />
                                        </Grid>                                            
                                        <Grid item xs={4}>
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                name="tripType"
                                                label="Trip Type"
                                                value={this.state.tripType === 1 ? "Empty" : this.state.tripType === 2 ? "Loaded" : "Empty Container"}
                                                InputProps={{
                                                    classes: {
                                                        underline: classes.cssUnderline
                                                    },
                                                }}
                                            />
                                        </Grid>                                        
                                        <Grid item xs={4}>
                                        <TextValidator 
                                                fullWidth
                                                margin="normal"
                                                name="contType"
                                                label="Container Type"
                                                value={this.state.contType}
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
                                                    name="contWt"
                                                    label="Container Wt"
                                                    value={this.state.contWt}
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
                                                    name="type"
                                                    label="Type"
                                                    value={this.state.type}
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
                                                    value={this.state.startLoc}
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
                                                    name="endLoc"
                                                    label="To Location"
                                                    value={this.state.endLoc}
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
                                            <Grid item xs={4}>
                                                <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    name="distance"
                                                    label="Distance (Km)"
                                                    value={this.state.distance}
                                                    InputProps={{
                                                        classes: {
                                                            underline: classes.cssUnderline
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                            <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    name="fuelReq"
                                                    label="Fuel (Ltr)"
                                                    value={this.state.fuelReq}
                                                    onChange={this.onInputChange}
                                                    validators={['required', 'isNumber']}
                                                    errorMessages={['Fuel is required']}
                                                />                                        
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    name="driInc"
                                                    label="Incentive (₹)"
                                                    value={this.state.driInc}
                                                    onChange={this.onInputChange}
                                                    validators={['required', 'isNumber']}
                                                    errorMessages={['Incentive is required']}
                                                />
                                            </Grid>
                                        </Grid>
                                    </div>
                                    <div className="d-flex justify-content-start pt-4">
                                        <Typography variant="caption" gutterBottom>
                                            Note: Only Fuel and Incentive Fields are Editable
                                        </Typography> 
                                    </div>       
                                    <div className="d-flex justify-content-center pt-3">
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
                                            onClick={() => this.props.closeModal(false)}>
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

export default withStyles(styles)(ModifyManageTrips);