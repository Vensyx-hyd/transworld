import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {withStyles} from '@material-ui/core/styles';
import { 
    Paper, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    OutlinedInput, 
    Radio,
    Dialog,
    DialogContent,
    DialogContentText,
    Button,
    Snackbar,
    IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import Progress from '../../../Components/Loading/Progress';
import AppAPI from '../../../API';

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
class ManageUsers extends Component{
	constructor(props){
		super(props);
		this.state = {
            labelWidth: 0,
            selectedValue: "Create User",
            userType:"",
            userTypeUpdate:"",
            eCode:"",
            name:"",
            phone:"",
            info: [],	
            updateInfo: [],
            driverInfo: [],
            securityInfo: [],
            executiveInfo: [],
            cfsManagerInfo: [],
            userData: [],
            uName:"",
            mobile:"",
            message: "",
            eMessage: "",
            status: "",
            submitted: false,
            errMessage: "",
            hit: "",
            code: "",
            alert: false,
            alertMessage: "",
            open: false
        }
        let { userType, userTypeUpdate, eCode, model, name, phone, uName, mobile } = {...this.state};
        this.initialState = {userType, userTypeUpdate, eCode, model, name, phone, uName, mobile}
        this.onInputChangeUserType = this.onInputChangeUserType.bind(this);
        this.onInputChangeUpdate = this.onInputChangeUpdate.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.validateChange = this.validateChange.bind(this);
        this.handleInputSearchCreate = this.handleInputSearchCreate.bind(this);
        this.handleInputSearchUpdate = this.handleInputSearchUpdate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.openModal = this.openModal.bind(this);        
        this.closeModal = this.closeModal.bind(this);
    }

    getUsers(){
        AppAPI.adminManageUsersList.get().then((resp) => {
            let data = resp.users
            console.log(data, "Users Create List");
            this.setState({
                info: data
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

    getManageUsers(){
        AppAPI.adminManageUsersActive.get().then((resp) => {
            console.log(resp.users, "Users Update List");
            const data = resp.users;
            const drivers = data.filter((dri)=> {
                return dri.user_type_code === 10
            })
            const security = data.filter((sec) => {
                return sec.user_type_code === 20
            })
            const executive = data.filter((exe) => {
                return exe.user_type_code === 30
            })
            const cfsManager = data.filter((cfs) => {
                return cfs.user_type_code === 50
            })
            this.setState({
                updateInfo: data,
                driverInfo: drivers,
                securityInfo: security,
                executiveInfo: executive,
                cfsManagerInfo: cfsManager
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

    componentDidMount() {
        this.setState({
            labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
        });
        this.getUsers();
    }   

    handleCheckedCreate = event => {
        this.setState({
            selectedValue: event.target.value,
            userType: "",
            eCode: "",
            name: "",
            phone: ""
        });
        this.getUsers();
    };

    handleCheckedUpdate = event => {
        this.setState({
            selectedValue: event.target.value,
            userTypeUpdate: "",
            eCode: "",
            uName: "",
            mobile: ""
        });
        this.getManageUsers();
    };

    validateChange(event) {
        let { userType } = this.state;
        if (userType === 1) {
            this.setState({
                alert: true,
                alertMessage: "User Name Can't be Changed !"
            })
        } else if (userType !== 1) {
            this.onInputChange(event)
        }
    }

	onInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    } 

    onInputChangeUserType(event) {
        this.setState({ [event.target.name]: event.target.value });                
        this.state.userType !== 1 ? this.handleInputSearchCreate(event) : this.setState({ eCode: "",name: ""})
    } 

    handleInputSearchCreate(event) {
        event.preventDefault();
        this.setState({ [event.target.name]: event.target.value });
        if (this.state.userType === 1) {
            var userInfo = this.state.info;  
            let obj = userInfo.find(obj => obj.eCode === event.target.value);   
            if(obj !== undefined) {
                if (obj.name !== null || obj.name !== "") {
                    this.setState({
                        userData: obj,
                        name: obj.name
                    })                
                } else if (obj.name === null || obj.name === "") {
                    this.setState({
                        name: "",                       
                    })
                }
            } else if (obj === undefined){
                this.setState({
                    userData: obj,
                    name: "",
                    hit: "True"
                })
            }                  
        } 
    }   

    onInputChangeUpdate(event) {
        this.setState({ 
            [event.target.name]: event.target.value,
            eCode: "",
            uName: ""
        });
    }

    updatedData(data, event) {
        let obj = data.find(obj => obj.system_user_id === event.target.value);
        if (obj !== undefined) {
            this.setState({
                userData: obj,
                eCode: obj.system_user_id,
                uName: obj.name
            })
        } else {
            this.setState({
                uName:""
            })
        }       
    }
    
    handleInputSearchUpdate(event) {
        event.preventDefault();
        this.setState({ [event.target.name]: event.target.value });
        let { userTypeUpdate, driverInfo, securityInfo, executiveInfo, cfsManagerInfo } = this.state;
        if (userTypeUpdate === 1) {
            this.updatedData(driverInfo, event);
        } else if (userTypeUpdate === 2) {
            this.updatedData(securityInfo, event);
        } else if (userTypeUpdate === 3) {
            this.updatedData(executiveInfo, event);
        } else if (userTypeUpdate === 5) {
            this.updatedData(cfsManagerInfo, event);
        }        
    }       

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

    createUser(data) {
        AppAPI.adminManageUsers.post(null, data).then((resp) => {
            console.log(resp, "Created User Details");
                if(resp.status === 201) {                
                    this.openModal();               
                    this.setState({
                        code: resp.status,
                        message: resp.message
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
        this.getUsers();
    } 

    updateUser(id, data) {
        data.eCode = id;
        AppAPI.adminManageUsers.put(null, data).then((resp) => {            
            console.log(resp, "Updated User Details");
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
                    errMessage: e.serverMessage
                })
            }
            console.log(e, "Error");
        })
    }    

    loader() {
        this.setState({ 
            submitted: true 
        })
    }
   
	onSubmit(){
        let { userType, userTypeUpdate, name, uName } = this.state;
        this.setState({
            status: this.state.eCode
        })
        if ( this.state.selectedValue === 'Create User' ) {   
            if ( (userType && name) !== "") {
                this.loader();
                this.createUser(this.state)
            } else if (userType === 1 && name === "") {
                this.setState({
                    alert: true,
                    alertMessage: "Can't Create Driver, Employee ID Not Found ! in Master Data"
                })
            }
            else {
                this.setState({
                    alert: true,
                    alertMessage: "User Type and User Name are Required"
                })
            }
        }
        else {  
            if ( (userTypeUpdate && uName) !== "") {
                this.loader();
                const id= this.state.eCode;
                const mob = this.state.mobile;
                this.updateUser(id, {name:this.state.uName,phone:mob,userType:this.state.userTypeUpdate})
            } else {
                this.setState({
                    alert: true,
                    alertMessage: "User Type and User Name are Required"
                })
            }            
        }        
    }
    
	render(){
        const { classes } = this.props;
        const { submitted } = this.state;
        const isSelected = this.state.selectedValue;
		return(
			<div>
				<p className="titleCard">Menu / Manage Users</p>
                <div className="d-flex justify-content-center">
                <Paper style={{width: "350px"}}>
                	<h6 className="customHeader">Manage Users</h6>
                	<div className="container p-4">                   
                    <Radio     
                        checked={this.state.selectedValue === 'Create User'}
                        onChange={this.handleCheckedCreate}
                        value="Create User"
                        name="radio-button-demo"
                        classes={{
                            root: classes.radio,
                        }}
                    />
                    <label>Create User </label>
                    <Radio
                        checked={this.state.selectedValue === 'Update User'}
                        onChange={this.handleCheckedUpdate}
                        value="Update User"
                        name="radio-button-demo"
                        classes={{
                            root: classes.radio,
                        }}
                    />
                    <label>Update User</label>

                    { isSelected === 'Create User' ? (
                        <ValidatorForm ref="form" onSubmit={this.onSubmit}>
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
                            User Type
                        </InputLabel>
                        <Select                           
                            value={this.state.userType}
                            onChange={this.onInputChangeUserType}
                            input={
                                <OutlinedInput
                                    labelWidth={this.state.labelWidth}
                                    name="userType"
                                    id="user-type"
                                />

                            }
                        >                            
                            <MenuItem value={5}>CFS Manager</MenuItem>
                            <MenuItem value={1}>Driver</MenuItem>
                            <MenuItem value={2}>Security</MenuItem>
                            <MenuItem value={3}>Executive</MenuItem>
                            <MenuItem value={7}>Diesel Issuer</MenuItem> 
                        </Select>      
                       </FormControl>                 
                       <TextValidator 
                            fullWidth 
                            margin="normal"
                            name="eCode"
                            label="Employee ID"
                            value={this.state.eCode}
                            onChange={this.handleInputSearchCreate}
                            validators={['required']}
                            errorMessages={['Employee ID is required']}
                        />  
                        <TextValidator 
                            fullWidth 
                            margin="normal"
                            name="name"
                            label="User Name"
                            value={this.state.name}
                            onChange = {this.validateChange}
                        />                         
                        <TextValidator 
                            fullWidth 
                            margin="normal"
                            name="phone"
                            label="Mobile No."
                            value={this.state.phone}
                            onChange={this.onInputChange}
                            validators={['required', 'matchRegexp:^[6-9][0-9]{9}$']}
                            errorMessages={['Mobile Number is required']}
                        />
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
                    ):(
                        <ValidatorForm ref="form" onSubmit={this.onSubmit}>
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
                            User Type
                        </InputLabel>
                        <Select                           
                            value={this.state.userTypeUpdate}
                            onChange={this.onInputChangeUpdate}
                            input={
                                <OutlinedInput
                                    labelWidth={this.state.labelWidth}
                                    name="userTypeUpdate"
                                    id="user-type"
                                />

                            }
                        >                            
                            <MenuItem value={5}>CFS Manager</MenuItem>
                            <MenuItem value={1}>Driver</MenuItem>
                            <MenuItem value={2}>Security</MenuItem>
                            <MenuItem value={3}>Executive</MenuItem>
                        </Select>      
                       </FormControl>                 
                       <TextValidator 
                            fullWidth 
                            margin="normal"
                            name="eCode"
                            label="Employee ID"
                            value={this.state.eCode}
                            onChange={this.handleInputSearchUpdate}
                            validators={['required']}
                            errorMessages={['Employee ID is required']}
                        />  
                        <TextValidator 
                            fullWidth 
                            margin="normal"
                            name="uName"
                            label="User Name"
                            value={this.state.uName}
                            InputProps={{
                                classes: {
                                    underline: classes.cssUnderline
                                },
                            }}
                        />                         
                        <TextValidator 
                            fullWidth 
                            margin="normal"
                            name="mobile"
                            label="Mobile No."
                            value={this.state.mobile}
                            onChange={this.onInputChange}
                            validators={['required', 'matchRegexp:^[6-9][0-9]{9}$']}
                            errorMessages={['Mobile Number is required']}
                        />
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
                                    (!submitted && 'Save')
                                }
                            </Button>  
                        </div>
                        </ValidatorForm>
                    )}                   
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

export default withStyles(styles)(ManageUsers);