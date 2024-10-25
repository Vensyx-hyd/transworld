import React, {Component} from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import moment from 'moment';
import { 
    Paper, 
    Grid, 
    withStyles,
    Dialog,
    DialogContent,
    DialogContentText,
    Button,
    Radio,
    Snackbar,
    IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {  ValidatorForm } from 'react-material-ui-form-validator';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';

import Progress from '../../../Components/Loading/Progress';
import AppAPI from '../../../API';
import drivers from '../../../Components/cards/drivers';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    button: {
        margin: theme.spacing.unit,
    },
    label: {
        textTransform: 'capitalize',
        fontWeight: 600
    },
});

class AdminDriverRoaster extends Component{
	constructor(props, context){
		super(props, context);
		this.state = {   
            selectedValue: "Create Roaster", 
            trailers: drivers,
            selectedTrailerOption: "",
            drivers: drivers,           
            roasterFromDate:"",
            roasterToDate: "",
            selectedDriverOption1: "",
            selectedDriverOption2: "",
            selectedLeaveDay: "",
            selectedDriverOption3: "",
            selectedDriverOption4: "",
            selectedDriverOptionUpdate1: "",
            selectedDriverOptionUpdate2: "",
            selectedDriverOptionUpdate3: "",
            selectedDriverOptionUpdate4: "",
            trailerSearch: "",
            selectedTrailerOptionUpdate: "",
            yearCalendarSearch: null, 
            yearCalendar: null,           
            roasterYear:"",
            roasterMonth:"",
            roasterTrailerNo:"",
            roasterDriShift1:"",
            roasterDriShiftID1: "",            
            roasterDriShift2:"",
            roasterDriShiftID2:"",
            leaveDay:"",
            roasterDriShift3Leave:"",
            roasterDriShift3LeaveID:"",
            roasterDriShift4Leave:"",
            roasterDriShift4LeaveID:"",
            shift1Leave:"",
            shift1LeaveID:"",
            shift2Leave:"",
            shift2LeaveID:"",
            submitted: false,
            applied:false,
            status: "",
            message: "",
            response: "",
            errMessage: "",
            code: "",
            alert: false,
            alertMessage: "",
            open: false,
            dateSelectFrom: null,
            startDate: "", 
            dateSelectTo: null,
            endDate: "",
            info: [],
            change: false,
            id: 0,
            click1: false,
            click2: false,           
            roasterYearSearch: "",
            roasterMonthSearch: "",
            driChange: false,
            shift1: "",
            shiftID1: "",
            shift2: "",
            shiftID2: "",
            month: 0,
            yearCreate: 0,
            monthCreate: 0,
            hit:false,
            getObj: {}
        }
        let { yearCalendar, selectedTrailerOption, selectedDriverOption1,hit, selectedDriverOption2, selectedLeaveDay, selectedDriverOption3, selectedDriverOption4, leaveDay, selectedDriverOptionUpdate1, selectedDriverOptionUpdate2, selectedDriverOptionUpdate3, selectedDriverOptionUpdate4, roasterMonth, roasterTrailerNo, roasterDriShift1, roasterDriShift2,roasterDriShift3Leave,roasterDriShift4Leave, trailerSearch, startDate, endDate, yearCalendarSearch, dateSelectFrom, dateSelectTo, click1, click2,selectedTrailerOptionUpdate } = {...this.state};
        this.initialState = { yearCalendar, selectedTrailerOption, hit,selectedDriverOption1, selectedDriverOption2, selectedLeaveDay, selectedDriverOption3, selectedDriverOption4, leaveDay, selectedDriverOptionUpdate1, selectedDriverOptionUpdate2,selectedDriverOptionUpdate3, selectedDriverOptionUpdate4, roasterMonth, roasterTrailerNo, roasterDriShift1, roasterDriShift2,roasterDriShift3Leave,roasterDriShift4Leave, trailerSearch, startDate, endDate, yearCalendarSearch, dateSelectFrom, dateSelectTo, click1, click2, selectedTrailerOptionUpdate }
        this.handleTrailerChange = this.handleTrailerChange.bind(this);
        this.handleTrailerChangeUpdate = this.handleTrailerChangeUpdate.bind(this);
        this.handleDriverChange = this.handleDriverChange.bind(this);
        this.handleLeaveDayChange = this.handleLeaveDayChange.bind(this);
        this.handleDriverChangeUpdate = this.handleDriverChangeUpdate.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDateChangeFrom = this.handleDateChangeFrom.bind(this);
        this.handleDateChangeTo = this.handleDateChangeTo.bind(this);
        this.onInputChange = this.onInputChange.bind(this);  
        this.validateChange = this.validateChange.bind(this);
        this.onInputChangeUpdate = this.onInputChangeUpdate.bind(this);  
        this.handleTrailerSearch = this.handleTrailerSearch.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.resetData = this.resetData.bind(this);
        this.handleDateChangeFromCreate = this.handleDateChangeFromCreate.bind(this);
        this.handleDateChangeToCreate = this.handleDateChangeToCreate.bind(this);
    }

    getTrailersList() {
        AppAPI.trailersReport.get(null, null).then((result) => {
            console.log(result.trailers,"Trailers List");  
            let tNo = result.trailers.map(({ label }) => label)
            console.log(tNo, "No's of Trailers...........");
            this.setState({
                trailers: result.trailers
            })
            console.log("Trailer No's", this.state.trailers);
        }).catch(error => console.log(error))
    }

    getDriversEmpId() {
        AppAPI.driversEmpId.get(null,null).then((resp) => {
            console.log(resp,"Drivers Emp Id");
            let names =resp.map(({name}) => name)
            console.log(names,"Names of drivers");
            this.setState({
                drivers: resp
            })
        }).catch(error => console.log(error))
    }

    componentDidMount() {
        this.getTrailersList();
        this.getDriversEmpId();
    }  

    componentWillReceiveProps(nextProps){
        this.setState({
            value: nextProps.value || 'N/A',
        })
    }

    handleDateChange(date) {        
        if (date) {
            var yearMonth = moment(date).format("YYYY MMMM");
            var month = moment(date).format("M");
            console.log(month, "Month");
            this.setState({
                yearCalendar: date,
                yearCalendarSearch: date,
                roasterYearSearch: yearMonth.substr(0,4),
                roasterMonthSearch: yearMonth.substr(5),
                month: month
            });
        } 
        this.getRoaster(month);
    }

    handleDateChangeFromCreate = date => {
        if (date) {
            var selectedFrom = moment(date).format("L");
            var yearMonth = moment(date).format("YYYY MMMM");
            var month = moment(date).format("M");
            var year = moment(date).format("YYYY");
            console.log(yearMonth, "From Date");
            this.setState({
                dateSelectFrom: date,
                roasterFromDate: selectedFrom,
                roasterYear: yearMonth.substr(0,4),
                roasterMonth: yearMonth.substr(5),
                yearCreate: year,
                monthCreate: month
            });
        }
    };

    handleDateChangeToCreate = date => {
        if (date) {
            var selectedTo = moment(date).format("L");
            this.setState({
                dateSelectTo: date,
                roasterToDate: selectedTo,
            });
        }   
    } 

    handleDateChangeFrom = date => {
        if (date) {
            var selectedFrom = moment(date).format("L");
            var yearMonth = moment(date).format("YYYY MMMM");           
            this.setState({
                dateSelectFrom: date,
                startDate: selectedFrom,
                roasterYear: yearMonth.substr(0,4),
                roasterMonth: yearMonth.substr(5)               
            });
        }
    };
    
    handleDateChangeTo = date => {
        if (date) {
            var selectedTo = moment(date).format("L");
            this.setState({
                dateSelectTo: date,
                endDate: selectedTo,
            });
        }   
    }

    onInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    validateChange(event) {
        let { change } = this.state;
        if (change === true) {
            this.onInputChangeUpdate(event)
        } else if (change === false) {
            this.onInputChangeUpdate(event)
        }
    }
    
    onInputChangeUpdate(event) {        
        this.setState({ 
            [event.target.name]: event.target.value,
            change: true 
        });
    }

    resetData() {       
        this.setState(
            this.initialState
        )
    }    
    
    openModal() {        
        this.setState({open:true,  submitted: false }, () => {
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

    createRoaster(data){        
        AppAPI.adminDriverRoaster.post(null, data).then((resp) => {            
            console.log(resp, "Create Roaster");
            var msg = resp.message;
                if(resp.status === 201) {                
                    this.openModal();               
                    this.setState({
                        code: resp.status,
                        message: msg,
                    })
                } else if (resp.status === 400) {
                    this.openModal();
                    this.setState({
                        code: resp.status,
                        message: resp.error
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

    updateRoaster(id, data) {
        AppAPI.adminDriverRoaster.put('/' + id, data).then((resp) => {            
            console.log(resp, "Updated Roaster Details");
            let msgUpdate = resp.message;
            if(resp.status === 200) {                
               this.openModal();               
               this.setState({
                code: resp.status,
                message: msgUpdate,
              
                })
            }  
        }).catch(e => {             
            if (e.code === 500) {
                this.openModal();
                this.setState({
                    errMessage: e.serverMessage,
                  
                })
            }
            console.log(e, "Error");
        })
    }  

    handleCheckedCreate = event => {
        this.setState({
            selectedValue: event.target.value,
            yearCalendar: null,        
            dateSelectFrom: null,
            dateSelectTo: null,   
            roasterYr:"",
            roasterMonth:"",
            roasterTrailerNo:"",
            roasterDriShift1:"",
            roasterDriShift2:"",
            selectedLeaveDay: "",
            selectedDriverOption3: "",
            selectedDriverOption4: "",
            selectedTrailerOption: "",
            selectedDriverOption1: "",
            selectedDriverOption2: "",
            hit:false
        });
    };

    handleCheckedUpdate = event => {
        this.setState({
            selectedValue: event.target.value,
            trailerSearch: "",
            selectedTrailerOptionUpdate: "",
            yearCalendarSearch: null, 
            roasterTrailerNo:"",
            roasterDriShift1:"",
            roasterDriShift2:"",
            leaveDay:"",
            roasterDriShift3Leave:"",
            roasterDriShift4Leave:"",
            dateSelectFrom: null,
            startDate: "", 
            dateSelectTo: null,
            endDate: "",  
            click1: false,
            click2: false,
            hit:false  
        });
    };

    getRoaster(month) {    
        AppAPI.adminDriverRoasterSearch.get('/' + month, null).then((resp) => {            
            console.log(resp, "Get Roaster"); 
            console.log(resp.roaster, "Get Roaster Data"); 
            this.setState({
                info: resp.roaster,
                hit:true
            })     
        }).catch(e => {     
            console.log(e, "Error");
        })
        
    }    

    handleTrailerSearch() {   
        var info = this.state.info;    
        console.log(info, "Trailers Data");   
        var tNo=this.state.trailerSearch;
        var yC= this.state.yearCalendarSearch;
        if (tNo !== "" && yC !== null && info !== []) {             
            let obj = info.find(obj => ((obj.roasterTrailerNo === this.state.trailerSearch)));            
            console.log(obj, "OBJ");
            let values = drivers.map((value)=>value);
            console.log(values, "Values");
            if(obj !== undefined) {
                console.log(obj, "SHIFT 1");
                if (obj.roasterDriShift1 !== null || obj.roasterDriShift1 !== "") {
                    this.setState({
                        getObj: obj,
                        roasterDriShift1: obj.shift1+' - '+obj.shiftID1 ,
                        roasterDriShift2: obj.shift2+' - '+obj.shiftID2,
                        shift1: obj.shift1,
                        shiftID1: obj.shiftID1,
                        shift2: obj.shift2,
                        shiftID2: obj.shiftID2,
                        roasterDriShift3Leave: obj.shift1Leave+' - '+obj.shiftID1Leave ,
                        roasterDriShift4Leave: obj.shift2leave+' - '+obj.shift2IDLeave ,
                        shift1Leave: obj.shift1Leave,
                        shiftID1Leave: obj.shiftID1Leave,
                        shift2Leave: obj.shift2leave,
                        shiftID2Leave: obj.shift2IDLeave,
                        leaveDay:obj.leaveDay,
                        id: obj.roasterId,
                        hit:false
                        
                    })           
                } else if (obj.roasterDriShift1 === null || obj.roasterDriShift1 === "") {
                    this.setState({
                        roasterDriShift1: "",  
                        roasterDriShift2: "" ,
                        roasterDriShift3Leave: "",
                        roasterDriShift4Leave: ""  
                                    
                    })
                }          
            } else if (obj === undefined){
                this.setState({
                    roasterDriShift1: "",
                    roasterDriShift2: "",
                    roasterDriShift3Leave: "",
                    roasterDriShift4Leave: "" ,
                    alert: true, alertMessage: "Driver Roaster is not yet Created !",
                    hit:false
                })
            }          
        } else {
            this.setState({ alert: true, alertMessage: "Please Select Trailer No. and Year & Month to Proceed" })
        }
    }

    handleTrailerChange = (selectedTrailerOption) => {
        if (selectedTrailerOption !== null) {
            this.setState({ selectedTrailerOption });
            this.setState({ 
                roasterTrailerNo: selectedTrailerOption.label
            });
        }        
    } 

    handleTrailerChangeUpdate = (selectedTrailerOptionUpdate) => {
        if (selectedTrailerOptionUpdate !== null) {
            this.setState({ selectedTrailerOptionUpdate });
            this.setState({ 
                trailerSearch: selectedTrailerOptionUpdate.label
            });
        }        
    }

    splitName(i) {
        let name = i.split("-");
        return name[0];
    }    

    handleDriverChange = (i,a,b) => {        
        if (i !== null) {
            this.setState({   
                i,             
                [a]: this.splitName(i.label),
                [b]: i.value
            });       
        }
    }    
            
    handleLeaveDayChange = (selectedLeaveDay) => {
        if (selectedLeaveDay !== null) {
            this.setState({ selectedLeaveDay });
            this.setState({ leaveDay: selectedLeaveDay.label});
        }        
    }

    handleDriverChangeUpdate = (i,a,b,c) => {        
        if (i !== null) {
            this.setState({   
                i,
                [a]: i.label,
                [b]: this.splitName(i.label),
                [c]: i.value
            });       
        }
    }
         
    loader() {
        this.setState({ 
            submitted: true, 
         
        })
        this.createRoaster(this.state)
    }

    loaderUpdate() {
        const { id, trailerSearch,startDate, endDate, roasterYear, roasterMonth } = this.state;
        const roasterTrailerNo = trailerSearch;
        const roasterStatus = "A";
        let roasterDriShift1 = this.state.shift1;
        let roasterDriShiftID1 = this.state.shiftID1;
        let roasterDriShift2 = this.state.shift2;
        let roasterDriShiftID2= this.state.shiftID2;
        let roasterDriShift3Leave = this.state.shift1Leave;
        let roasterDriShift3LeaveID= this.state.shiftID1Leave;
        let roasterDriShift4Leave = this.state.shift2Leave;
        let roasterDriShift4LeaveID= this.state.shiftID2Leave;
        let leaveDay=this.state.leaveDay;
        this.setState({          
            submitted: true 
        })
        this.updateRoaster(id, {           
            roasterTrailerNo,
            roasterDriShift1,
            roasterDriShiftID1,
            roasterDriShift2,
            roasterDriShiftID2,
            roasterDriShift3Leave,
            roasterDriShift3LeaveID,
            roasterDriShift4Leave,
            roasterDriShift4LeaveID,
            roasterStatus,
            leaveDay,
            startDate,
            endDate,
            roasterYear,
            roasterMonth            
        })        
    }

    create() {
        let { dateSelectFrom, dateSelectTo, roasterTrailerNo, roasterDriShift1, roasterDriShift2, leaveDay, roasterDriShift3Leave, roasterDriShift4Leave } = {...this.state}
        let a = roasterDriShift1;
        let b = roasterDriShift2;
        let c = roasterDriShift3Leave;
        let d = roasterDriShift4Leave;
        if ((dateSelectFrom && dateSelectTo) !== null && (roasterTrailerNo && leaveDay && roasterDriShift1 && roasterDriShift2) !== "") {
            // this.loader();
            alert("Success");
        } else if (((a && b && c && d) !== "") && (a === b) || (a === c) || (a === d) || (b === c) || (b === d) || (c === d)) {
            this.setState({ alert: true, alertMessage: "Drivers should not be Same !" });
        } else {
            this.setState({ alert: true, alertMessage: "From & To Date, Trailer No., Leave Day and Drivers should not be Empty !" })
        }
        this.setState({
            status: this.state.roasterTrailerNo
        }) 
    }

    update() {
        if (this.state.startDate !== "" && this.state.endDate !== "" && this.state.roasterDriShift1 !== "" && this.state.roasterDriShift2 !== "" && this.state.startDate !== "" && this.state.endDate !== "" && (this.state.roasterDriShift1 !== this.state.roasterDriShift2) ) {
            // this.loaderUpdate();
            alert("Success");
        } else if(this.state.roasterDriShift1 === this.state.roasterDriShift2) {
            this.setState({ alert: true, alertMessage: "Drivers should not be Same !" })
        } else {
            this.setState({ alert: true, alertMessage: "Drivers and From & To Date should not be Empty !" })
        }  
        this.setState({
            status: this.state.trailerSearch
        }) 
        this.getTrailersList();
        this.getDriversEmpId();
    }

	onSubmit(){       
        if ( this.state.selectedValue === 'Create Roaster' ) {               
            this.create();            
        } else if (this.state.selectedValue === 'Update Roaster') {
            this.update();
        }       
    }
    
	render(){
        const {classes} = this.props;
        const { selectedTrailerOption, selectedDriverOption1, selectedDriverOption2, selectedLeaveDay, selectedDriverOption3, selectedDriverOption4, selectedDriverOptionUpdate1, selectedDriverOptionUpdate2,selectedDriverOptionUpdate3,selectedDriverOptionUpdate4, submitted, applied,dateSelectFrom, dateSelectTo, trailerSearch, yearCalendarSearch, selectedTrailerOptionUpdate, roasterDriShift1, roasterDriShift2, roasterDriShiftID1, roasterDriShiftID2, roasterDriShift3Leave, roasterDriShift3LeaveID, roasterDriShift4Leave, roasterDriShift4LeaveID, shift1, shift2, shiftID1, shiftID2, shift1Leave, shift1LeaveID, shift2Leave, shift2LeaveID} = this.state;
        const isSelected = this.state.selectedValue;
        const days = [
            { value: 'Sunday', label: 'Sunday' },
            { value: 'Monday', label: 'Monday' },
            { value: 'Tuesday', label: 'Tuesday' },
            { value: 'Wednesday', label: 'Wednesday' },
            { value: 'Thursday', label: 'Thursday' },
            { value: 'Friday', label: 'Friday' },
            { value: 'Saturday', label: 'Saturday' }
        ];
		return(
			<div>
				<p className="titleCard">Menu / Driver Roaster</p>
                <div className="d-flex justify-content-center">
                <Paper style={{width: "750px"}}>
                	<h6 className="customHeader">Driver Roaster</h6>
                	<div className="container p-3">
                        <div className ={ classes.root }>
                            <Grid container spacing={24}>       
                                <Grid item xs={6}>
                                    <Radio     
                                        checked={this.state.selectedValue === 'Create Roaster'}
                                        onChange={this.handleCheckedCreate}
                                        value="Create Roaster"
                                        name="radio-button-demo"
                                        classes={{
                                            root: classes.radio,
                                        }}
                                    />
                                    <label>Create Roaster</label>
                                </Grid>
                                <Grid item xs={6}>
                                    <Radio
                                        checked={this.state.selectedValue === 'Update Roaster'}
                                        onChange={this.handleCheckedUpdate}
                                        value="Update Roaster"
                                        name="radio-button-demo"
                                        classes={{
                                            root: classes.radio,
                                        }}
                                    />
                                    <label>Update Roaster</label>
                                </Grid>
                            </Grid>
                        </div> 
                        <hr/>
                    {
                        isSelected === "Create Roaster"
                        ?                        
                    (<ValidatorForm ref="form" onSubmit={this.onSubmit}> 
                    <div className ={ classes.root }>
                        <Grid container spacing={24}>       
                            <Grid item xs={4}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                {
                                   dateSelectTo !== null
                                   ?
                                   <DatePicker
                                        className={classes.calendarRoot}
                                        keyboard
                                        fullWidth
                                        clearable
                                        disablePast                                    
                                        maxDate={dateSelectTo}
                                        margin="normal"
                                        label="From Date"
                                        value={dateSelectFrom}
                                        onChange={this.handleDateChangeFromCreate}
                                    />
                                    :
                                    <DatePicker
                                        className={classes.calendarRoot}
                                        keyboard
                                        fullWidth
                                        clearable
                                        disablePast  
                                        margin="normal"
                                        label="From Date"
                                        value={dateSelectFrom}
                                        onChange={this.handleDateChangeFromCreate}
                                    />
                                }
                                </MuiPickersUtilsProvider>                                
                            </Grid>  
                            <Grid item xs={4} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>                                           
                                    <DatePicker                                        
                                        className={classes.calendarRoot}
                                        keyboard
                                        fullWidth
                                        clearable
                                        minDate={dateSelectFrom}
                                        margin="normal"
                                        label="To Date"
                                        value={dateSelectTo}
                                        onChange={this.handleDateChangeToCreate}
                                    />
                                </MuiPickersUtilsProvider>                                                             
                            </Grid>
                            <Grid item xs={4} >
                                <label className="calendarLable">Trailer No.</label>
                                <Select                                                                                                   
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
                            </Grid>  
                        </Grid>
                    </div> 
                         <div className ={ classes.root } style={{paddingTop: 20}}>
                            <Grid container spacing={24}>       
                                <Grid item xs={6}>
                                    <label className="calendarLable">Driver (Shift-1)</label>
                                    <Select
                                        classNamePrefix="select"
                                        value={selectedDriverOption1}
                                        onChange={this.handleDriverChange(selectedDriverOption1, roasterDriShift1, roasterDriShiftID1)}
                                        options={this.state.drivers}
                                        backspaceRemovesValue={true}
                                        isClearable={true}
                                        isSearchable={true}
                                        isOptionSelected={true}
                                        blurInputOnSelect={true}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <label className="calendarLable">Driver (Shift-2)</label>
                                    <Select
                                        classNamePrefix="select"
                                        value={selectedDriverOption2}
                                        onChange={this.handleDriverChange(selectedDriverOption2, roasterDriShift2, roasterDriShiftID2)}
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
                        <div className ={ classes.root } style={{paddingTop: 20}}>
                            <Grid container spacing={24}>     
                                <Grid item xs={4}>                                   
                                    <label className="calendarLable">Leave Day</label>
                                    <Select
                                        classNamePrefix="select"
                                        value={selectedLeaveDay}
                                        onChange={this.handleLeaveDayChange}
                                        options={days}
                                        backspaceRemovesValue={true}
                                        isClearable={true}
                                        isSearchable={true}
                                        isOptionSelected={true}
                                        blurInputOnSelect={true}
                                    />                                      
                                </Grid>   
                                <Grid item xs={4}>
                                    <label className="calendarLable">Driver (Shift-1) Leave</label>
                                    <Select
                                        classNamePrefix="select"
                                        value={selectedDriverOption3}
                                        onChange={this.handleDriverChange(selectedDriverOption3(selectedDriverOption3, roasterDriShift3Leave, roasterDriShift3LeaveID))}
                                        options={this.state.drivers}
                                        backspaceRemovesValue={true}
                                        isClearable={true}
                                        isSearchable={true}
                                        isOptionSelected={true}
                                        blurInputOnSelect={true}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <label className="calendarLable">Driver (Shift-2) Leave</label>
                                    <Select
                                        classNamePrefix="select"
                                        value={selectedDriverOption4}
                                        onChange={this.handleDriverChange(selectedDriverOption4, roasterDriShift4Leave, roasterDriShift4LeaveID)}
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
                        <div className="d-flex justify-content-center pt-3">
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary"
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
                    </ValidatorForm>)
                    :
                    (<ValidatorForm ref="form" onSubmit={this.onSubmit}>
                        <div className ={ classes.root }>
                            <Grid container spacing={24}>       
                                <Grid item xs={5}>
                                    <label className="calendarLable">Trailer No.</label>
                                    <Select                                                                                                   
                                        classNamePrefix="select"
                                        value={selectedTrailerOptionUpdate}
                                        onChange={this.handleTrailerChangeUpdate}
                                        options={this.state.trailers}
                                        backspaceRemovesValue={true}
                                        isClearable={true}
                                        isSearchable={true}
                                        isOptionSelected={true}
                                        blurInputOnSelect={true}
                                    />
                                </Grid>                                 
                                <Grid item xs={4}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <DatePicker
                                            keyboard
                                            fullWidth
                                            clearable
                                            margin="normal"
                                            label="Year &amp; Month"
                                            views={["year", "month"]}
                                            value={this.state.yearCalendarSearch}
                                            onChange={this.handleDateChange}
                                           
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid> 
                                {
                                    this.state.hit === true && trailerSearch !=="" && yearCalendarSearch !== null
                                    ?
                                    <Grid style={{paddingTop: 30, paddingRight: '4%'}} item xs={3}>
                                        <Button 
                                            fullWidth
                                            variant="contained" 
                                            color="primary"
                                            onClick={() => { this.handleTrailerSearch(trailerSearch, yearCalendarSearch) }} 
                                            classes={{
                                                root: classes.button,
                                                label: classes.label
                                            }}
                                                disabled={applied}>                        	
                                        {
                                            (applied && <Progress/>)
                                                || 
                                            (!applied && 'Apply')
                                        }
                                        
                                        </Button>
                                    </Grid> 
                                :
                                this.state.hit === false && trailerSearch ==="" && yearCalendarSearch === null
                                ?
                                <Grid style={{paddingTop: 30, paddingRight: '4%'}} item xs={3}>
                                <Button 
                                    fullWidth
                                    variant="outlined" 
                                    color="primary" 
                                    onClick={() => { this.setState({ alert: true, alertMessage: "Please Select Trailer No. and Year & Month to Proceed" })}}
                                    classes={{
                                        root: classes.button,
                                        label: classes.label
                                    }}
                                        disabled={applied}>                        	
                                {
                                    (applied && <Progress/>)
                                        || 
                                    (!applied && 'Apply')
                                }
                                
                                </Button>
                            </Grid> 
                                :
                                this.state.hit === false && trailerSearch !=="" && yearCalendarSearch === null
                                ?
                                <Grid style={{paddingTop: 30, paddingRight: '4%'}} item xs={3}>
                                <Button 
                                    fullWidth
                                    variant="outlined" 
                                    color="primary" 
                                    onClick={() => { this.setState({ alert: true, alertMessage: "Please Select Year & Month to Proceed" })}}
                                    classes={{
                                        root: classes.button,
                                        label: classes.label
                                    }}
                                        disabled={applied}>                        	
                                {
                                    (applied && <Progress/>)
                                        || 
                                    (!applied && 'Apply')
                                }
                                
                                </Button>
                            </Grid> 
                            :
                            this.state.hit === false && trailerSearch ==="" && yearCalendarSearch !== null
                                ?
                                <Grid style={{paddingTop: 30, paddingRight: '4%'}} item xs={3}>
                                <Button 
                                    fullWidth
                                    variant="outlined" 
                                    color="primary" 
                                    onClick={() => { this.setState({ alert: true, alertMessage: "Please Select Trailer No. to Proceed" })}}
                                    classes={{
                                        root: classes.button,
                                        label: classes.label
                                    }}
                                        disabled={applied}>                        	
                                {
                                    (applied && <Progress/>)
                                        || 
                                    (!applied && 'Apply')
                                }
                                
                                </Button>
                            </Grid> 
                            :
                                <Grid style={{paddingTop: 30, paddingRight: '4%'}} item xs={3}>
                                <Button 
                                    fullWidth
                                    variant="outlined" 
                                    color="secondary"
                                    onClick={() => { this.setState({ alert: true, alertMessage: "Please Wait, Your request is progress..." })}}
                                    classes={{
                                        root: classes.button,
                                        label: classes.label
                                    }}
                                        disabled={applied}>                        	
                                {
                                    (applied && <Progress/>)
                                        || 
                                    (!applied && 'Apply')
                                }
                                
                                </Button>
                            </Grid> 
                                }  
                            </Grid>
                        </div>
                        <div className ={ classes.root } style={{paddingTop: 20}}>
                            <Grid container spacing={24}>       
                                <Grid item xs={6}>
                                    <label className="calendarLable">Driver (Shift-1)</label>
                                    <Select
                                        classNamePrefix="select"
                                         value={selectedDriverOptionUpdate1}
                                        value={{ value: this.state.roasterDriShift1, label: this.state.roasterDriShift1 }}
                                        onChange={this.handleDriverChangeUpdate(selectedDriverOptionUpdate1, roasterDriShift1, shift1, shiftID1)}
                                        options={this.state.drivers}
                                        backspaceRemovesValue={true}
                                        isClearable={true}
                                        isSearchable={true}
                                        isOptionSelected={true}
                                        blurInputOnSelect={true}
                                    />
                                </Grid>  
                                <Grid item xs={6}>
                                    <label className="calendarLable">Driver (Shift-2)</label>
                                    <Select                        
                                        classNamePrefix="select"
                                         value={selectedDriverOptionUpdate2}
                                        value={{ value: this.state.roasterDriShift2, label: this.state.roasterDriShift2 }}
                                        onChange={this.handleDriverChangeUpdate(selectedDriverOptionUpdate2, roasterDriShift2, shift2, shiftID2)}
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
                        <div className ={ classes.root } style={{paddingTop: 20}}>
                            <Grid container spacing={24}>     
                                <Grid item xs={4}>                                   
                                    <label className="calendarLable">Leave Day</label>
                                    <Select
                                        classNamePrefix="select"
                                        value={selectedLeaveDay}
                                        value={{ value: this.state.leaveDay, label: this.state.leaveDay }}
                                        onChange={this.handleLeaveDayChange}
                                        options={days}
                                        backspaceRemovesValue={true}
                                        isClearable={true}
                                        isSearchable={true}
                                        isOptionSelected={true}
                                        blurInputOnSelect={true}
                                    />                                      
                                </Grid>   
                                <Grid item xs={4}>
                                    <label className="calendarLable">Driver (Shift-1) Leave</label>
                                    <Select
                                        classNamePrefix="select"
                                        value={selectedDriverOptionUpdate3}
                                        value={{ value: this.state.roasterDriShift3Leave, label: this.state.roasterDriShift3Leave }}
                                        onChange={this.handleDriverChangeUpdate(selectedDriverOptionUpdate3, roasterDriShift3Leave, shift1Leave, shift1LeaveID)}
                                        options={this.state.drivers}
                                        backspaceRemovesValue={true}
                                        isClearable={true}
                                        isSearchable={true}
                                        isOptionSelected={true}
                                        blurInputOnSelect={true}
                                    /> 
                                </Grid>
                                <Grid item xs={4}>
                                    <label className="calendarLable">Driver (Shift-2) Leave</label>
                                    <Select
                                        classNamePrefix="select"
                                        value={selectedDriverOptionUpdate4}
                                        value={{ value: this.state.roasterDriShift4Leave, label: this.state.roasterDriShift4Leave }}
                                        onChange={this.handleDriverChangeUpdate(selectedDriverOptionUpdate4, roasterDriShift4Leave, shift2Leave, shift2LeaveID)}
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
                       
                        <div className="pt-2 pb-2">
                                    <Grid container spacing={24}>
                                        <Grid item xs={6}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <DatePicker
                                                    keyboard
                                                    fullWidth
                                                    clearable
                                                    disablePast
                                                    // maxDate={dateSelectTo}
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
                        <div className="d-flex justify-content-center pt-2">
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary"
                                classes={{
                                    root: classes.button,
                                    label: classes.label
                                }}
                                disabled={submitted}>                        	
                                {
                                    (submitted && <Progress/>)
                                        || 
                                    (!submitted && 'Save')
                                }
                            </Button>
                       	</div>
                    </ValidatorForm>)
                }
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

AdminDriverRoaster.propTypes = {
    value: PropTypes.string,
    onClick: PropTypes.func,
}
export default withStyles(styles)(AdminDriverRoaster);