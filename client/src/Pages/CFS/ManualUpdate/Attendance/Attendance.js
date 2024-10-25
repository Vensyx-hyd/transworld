import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import SelectList from 'react-select';
import {withStyles} from '@material-ui/core/styles';
import { 
    Paper, 
    Dialog,
    DialogContent,
    DialogContentText,
    Button,
    Snackbar,
    IconButton,
    Select,
    OutlinedInput,
    MenuItem,
    FormControl,
    InputLabel
} from '@material-ui/core';
import moment from 'moment';
import 'date-fns';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';
import CloseIcon from '@material-ui/icons/Close';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import Progress from '../../../../Components/Loading/Progress';
import AppAPI from '../../../../API';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    radio: {
        color: "#332c6fba",      
    },
    button: {
        margin: theme.spacing.unit,
    },
    label: {
        textTransform: 'capitalize',
        fontWeight: 600
    },
    cssUnderline: {    
        color: "#dc3545c9",     
    },  
});

class Attendance extends Component{
	constructor(props){
		super(props);
		this.state = {
            selectedDate: null,
            date: null,
            time: null,
            labelWidth: 0,
            info: [],
            selectedEmpOption: "",
            eCode:"",
            name:"",
            shiftType:"M",             
            message: "",
            eMessage: "",
            status: "",
            submitted: false,
            errMessage: "",
            code: "",
            alert: false,
            alertMessage: "",
            open: false,
            touch: false
        }
        let { eCode, selectedEmpOption, name, shiftType, selectedDate} = {...this.state};
        this.initialState = {eCode, selectedEmpOption, name, shiftType, selectedDate}
        this.handleEmpChange = this.handleEmpChange.bind(this);
        this.handleDateChange  = this.handleDateChange.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.openModal = this.openModal.bind(this);        
        this.closeModal = this.closeModal.bind(this);
    }

    getDrivers(){
        AppAPI.driversActive.get().then((resp) => {
            console.log(resp, "Users List");
            const data = resp;
            this.setState({
                info: data,
            })     
        }).catch(e => {             
            if (e.code === 500) {
                this.openModal();
                this.setState({
                    errMessage: e.serverMessage
                })
            }
            console.log(e, "Error");
        })
    }

    createAttendanceDetails(data) {
        AppAPI.createAttendance.post(null, data).then((resp) => {
           console.log(resp, "Response"); 
           var mCreated = resp.message;
               if(resp.success === true) {                
                this.openModal();            
                 this.setState({
                     message: mCreated,
               })
           }          
        }).catch(e => {             
            if (e.code === 500) {
                this.openModal();   
                this.setState({
                    errMessage: e.serverMessage
                })
            }
            console.log(e, "Error");
        })
    }

    componentDidMount() {
        this.setState({
            labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
        });
        this.getDrivers();
    }

	onInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    } 

    handleEmpChange = (selectedEmpOption) => {
        console.log(selectedEmpOption, "Driver Name");
        if (selectedEmpOption !== null) {
            this.setState({                 
                selectedEmpOption,
                touch: true,
                eCode: selectedEmpOption.label,
                name: selectedEmpOption.driverName                
            });
        }        
    } 

    handleDateChange = date => {
        if (date) {
            var selectedFrom = moment(date);
            var dateData = moment(date).format("YYYY-MM-DD");
            var timeData = moment(date).format("HH:mm:ss");
            console.log(dateData, ':', timeData, "DATE & TIME");
            this.setState({
                selectedDate: selectedFrom,
                date: dateData,
                time: timeData
            });
        }
    };
   
    resetData() {       
        this.setState(
            this.initialState,
        )
    }    

    openModal() {   
        this.setState({ open: true, submitted: false }, () => {
            setTimeout(() => this.setState({ 
                open: false
            }), 5000);            
        });
        this.resetData();
    }
    
    closeModal() {
        this.setState({
            open: false,
            alert: false
        })
    }        

    loader() {
        this.setState({ 
            submitted: true 
        })
    }

    // shiftValue(shift) {
    //     return shift === "Shift-1" ? "M" : "N";
    // }
   
	onSubmit(){
        let { touch, eCode, name, shiftType, date, time } = this.state;
        this.setState({
            status: this.state.eCode
        })
        if ( touch === true && ((name && shiftType) !== "") && (date && time !== null)) { 
            // const shift = this.shiftValue(shiftType);
            const shift = shiftType;
            this.createAttendanceDetails({
                eCode, 
                name, 
                shift, 
                date, 
                time
            })
            this.loader();
        } else {
            this.setState({
                alert: true,
                alertMessage: "All Details are Required"
            })
        }
    }
    
	render(){
        const { classes } = this.props;
        const { selectedDate, selectedEmpOption, submitted } = this.state;
		return(
			<div style={{margin: 'auto'}}>
                <div className="d-flex justify-content-center">
                <Paper style={{width: "350px"}}>
                	<div className="container p-4"> 
                        <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                        <label className="calendarLable">Employee ID</label>
                        <SelectList                                                                                                   
                            classNamePrefix="select"
                            value={selectedEmpOption}
                            onChange={this.handleEmpChange}
                            options={this.state.info}
                            backspaceRemovesValue={true}
                            isClearable={true}
                            isSearchable={true}
                            isOptionSelected={true}
                            blurInputOnSelect={true}                            
                        />
                        <TextValidator 
                            fullWidth 
                            margin="normal"
                            name="name"
                            label="Driver Name"
                            value={this.state.name}
                        />      
                        <FormControl 
                        style={{marginTop: "1rem"}}
                        fullWidth                    
                        variant="outlined" 
                        className="form">
                        <InputLabel
                            ref={ref => {
                                this.InputLabelRef = ref;
                            }}
                            htmlFor="user-type"
                        >
                            
                        </InputLabel>     
                            <Select                           
                                value={this.state.shiftType}
                                onChange={this.onInputChange}
                                input={
                                    <OutlinedInput
                                        style={{height: "40px"}}
                                        labelWidth={this.state.labelWidth}
                                        name="shiftType"
                                        id="user-type"
                                    />

                                }
                            >                            
                                <MenuItem value={"M"}>Shift-1</MenuItem>
                                <MenuItem value={"N"}>Shift-2</MenuItem>
                            </Select> 
                        </FormControl>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DateTimePicker
                                keyboard
                                fullWidth
                                clearable
                                disablePast                                                   
                                disableFuture
                                margin="normal"
                                label="Date Time"
                                minDateMessage                                                    
                                value={selectedDate}
                                onChange={this.handleDateChange}
                            />
                        </MuiPickersUtilsProvider>
                        <div className="d-flex justify-content-center pt-4">
                            <Button 
                                type="submit" 
                                color="primary" 
                                variant="contained" 
                                classes={{
                                    root: classes.button,
                                    label: classes.label
                                }}
                                disabled={submitted}>                        	
                                {
                                    (submitted && <Progress/>)
                                        || 
                                    (!submitted && 'Submit')
                                }
                            </Button>  
                        </div>
                        </ValidatorForm>
                    </div>
                </Paper>
                <Dialog
                    open={this.state.open}
                    onClose={this.closeModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    >                    
                    <DialogContent>
                        {
                            this.state.message !== ""
                            ?
                            <DialogContentText id="alert-dialog-description">
                                {  
                                    this.state.code === 400
                                    ?
                                    <img src="/assets/icons/exclamation-mark.svg" alt="Caution"
                                    className="img-fluied d-flex justify-content-center tick"/>                                    
                                    :
                                    <img src="/assets/icons/tick.svg" alt="Success"
                                    className="img-fluied d-flex justify-content-center tick"/>
                                }                                
                                {this.state.message}: {this.state.status}
                            </DialogContentText>
                            :                            
                            <DialogContentText id="alert-dialog-description">
                                <img src="/assets/icons/notification.svg" alt="No Internet"
                                className="img-fluied d-flex justify-content-center tick"/>
                                Please, Check your Internet Connection
                            </DialogContentText>
                        } 
                    </DialogContent>
                </Dialog>
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
            </div>
		);
	}
}

export default withStyles(styles)(Attendance);