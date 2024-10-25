import React, {Component} from 'react';
import SelectList from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import { 
    Grid, 
    Paper,
    withStyles,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    IconButton
 } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import Progress from '../../../../Components/Loading/Progress';

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
});

class CreateTripModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: this.props.locations,
            contType:"",
            contWt:"",
            type:"",
            tripTypeId: "",
            tripType: "",
            startLoc: "",
            startLocId:"",
            startLocLatLong:"", 
            endLoc: "",
            endLocId:"",
            endLocLatLong:"",
            distance: "",
            fuelReq: "",
            driInc: "",
            submitted: false,
            alert: false,
            alertMessage: "",
            switch: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeType = this.handleChangeType.bind(this);
        this.handleStartLocationChange = this.handleStartLocationChange.bind(this);
        this.handleEndLocationChange = this.handleEndLocationChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.check = this.check.bind(this);
    }

    handleChange = event => {       
        this.setState({[event.target.name]: event.target.value});
    };  

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
    
    handleChangeType = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
        this.check(event.target.value);        
    }; 

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

    loader() {
        this.setState({ submitted: true }, () => {
            setTimeout(() => this.setState({ submitted: false }), 5000);
        });
    }

    closeModal() {
        this.setState({
            alert: false
        })
    }   

    onSubmit() {
        let { type, startLoc, endLoc, distance, fuelReq, driInc, tripTypeId, startLocLatLong, endLocLatLong } = {...this.state}                
        if (( (type !== "" && this.state.contType !== "" && this.state.contWt !== "") && (tripTypeId === 2 || 3) && (startLoc && endLoc) !== "") && (startLoc !== endLoc)) {
            this.loader();
            let contType = this.state.contType;
            let contWt = this.state.contWt;
            this.props.createTrip({
                type,
                startLoc,
                endLoc,
                distance,
                fuelReq,
                driInc,
                tripTypeId,
                contType,
                contWt
            })
        } else if (( (type !== "") && (tripTypeId === 1) && (startLoc && endLoc) !== "") && (startLoc !== endLoc)) {
            this.loader();
            let contType = 0;            
            let contWt = 0;
            this.props.createTrip({
                type,
                startLoc,
                endLoc,
                distance,
                fuelReq,
                driInc,
                tripTypeId,
                contType,
                contWt
            })
        } else if ((tripTypeId && startLoc && endLoc) === "") {
            this.setState({
                alert: true,
                alertMessage: "Trip Type, Container Type, Type, Start Location & End Location are Required"
            })
        } else if ((startLoc && endLoc) !== "" && startLoc === endLoc) {
            this.setState({
                alert: true,
                alertMessage: "Start Location & End Location should not Match"
            })
        } else if ((this.state.tripTypeId === 2 || 3) && (this.state.contWt === "")) {
            this.setState({
                alert: true,
                alertMessage: "Container Wt (Ts) should not be Empty"
            })
        }
    }

    render() {
        const {classes} = this.props;
        const { submitted, selectedStartLocationOption, selectedEndLocationOption } = this.state;
        let typeList = ['BULK','CF','DC','FR','HARDTOP','HC','OP','OS','OT','PF','RF','TANK','TC'];
        return (
                <div className="d-flex justify-content-center">
                    <Paper style={{width: "600px"}}>
                        <h6 className="custom">Create Trip</h6>
                        <div className="container p-3">
                            <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                                <div className={classes.root}>
                                    <Grid container spacing={24}>                                        
                                        <Grid item xs={4}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="tripId">Trip Type</InputLabel>
                                                    <Select
                                                        value={this.state.tripTypeId}
                                                        onChange={this.handleChangeType}
                                                        inputProps={{
                                                            name: 'tripTypeId',
                                                            id: 'tripId',
                                                        }}
                                                    >
                                                    <MenuItem value={1}>Empty</MenuItem>
                                                    <MenuItem value={2}>Loaded</MenuItem>
                                                    <MenuItem value={3}>Empty Container</MenuItem>
                                                    </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="containterType">Container Type</InputLabel>
                                                    <Select
                                                        value={this.state.contType}
                                                        onChange={this.handleChange}
                                                        disabled={this.state.switch}
                                                        inputProps={{
                                                            name: 'contType',
                                                            id: 'containerType',
                                                        }}
                                                    >
                                                    <MenuItem value={20}>20 Feet</MenuItem>
                                                    <MenuItem value={40}>40 Feet</MenuItem>
                                                    </Select>
                                            </FormControl>
                                        </Grid> 
                                        <Grid item xs={4}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="typeId">Type</InputLabel>
                                                    <Select
                                                        value={this.state.type}
                                                        onChange={this.handleChangeType}
                                                        inputProps={{
                                                            name: 'type',
                                                            id: 'typeId',
                                                        }}
                                                    >
                                                    {
                                                        typeList.map((i)=>
                                                            <MenuItem value={i}>{i}</MenuItem>
                                                        )
                                                    }                                       
                                                    </Select>
                                            </FormControl>
                                        </Grid>                                                                            
                                    </Grid>
                                </div>                               
                                <div className={classes.root} style={{paddingTop: 20}}>
                                    <Grid container spacing={24}>
                                    <Grid item xs={6}>
                                            <label className="calendarLable"></label>
                                            <SelectList                                                
                                                defaultInputValue=""
                                                classNamePrefix="select"
                                                components={makeAnimated()}
                                                value={selectedStartLocationOption}
                                                onChange={this.handleStartLocationChange}
                                                options={this.state.locations}
                                                backspaceRemovesValue
                                                isClearable
                                                isSearchable
                                                isOptionSelected                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                                                blurInputOnSelect
                                                placeholder="Start Location"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <label className="calendarLable"></label>
                                            <SelectList
                                                defaultInputValue=""
                                                classNamePrefix="select"
                                                components={makeAnimated()}
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
                                        <Grid item xs={4}>
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                name="contWt"
                                                label="Container Wt (Ts)"
                                                value={this.state.contWt}
                                                onChange={this.handleChange}
                                                disabled={this.state.switch}
                                                // validators={['required', 'isFloat']}
                                                // errorMessages={['Container weight is required']}
                                            />
                                        </Grid>   
                                        <Grid item xs={3}>
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                name="distance"
                                                label="Distance (Km)"
                                                value={this.state.distance}
                                                onChange={this.handleChange}
                                                validators={['required', 'isFloat']}
                                                errorMessages={['Distance is required']}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                        <TextValidator
                                                 fullWidth
                                                margin="normal"
                                                name="fuelReq"
                                                label="Fuel (Ltr)"
                                                value={this.state.fuelReq}
                                                onChange={this.handleChange}
                                                validators={['required', 'isFloat']}
                                                errorMessages={['Fuel is required']}
                                            />                                        
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextValidator
                                                fullWidth
                                                margin="normal"
                                                name="driInc"
                                                label="Incentive (₹)"
                                                value={this.state.driInc}
                                                onChange={this.handleChange}
                                                validators={['required', 'isFloat']}
                                                errorMessages={['Incentive is required']}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className="d-flex justify-content-start pt-4">
                                    <Typography variant="caption" gutterBottom>
                                        Note: All Fields are Mandatory
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
                                        (!submitted && 'Submit')
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