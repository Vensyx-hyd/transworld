import React from 'react';
import {
    Grid, 
    IconButton, 
    InputAdornment, 
    Button,
    withStyles,
    Dialog,
    DialogContent,
    DialogContentText
} from '@material-ui/core';
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import AppAPI from '../../API';
import mainStyles from '../../Styles/mainStyles';
import Progress from './../../Components/Loading/Progress';
class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: this.props.phone,
            password: "",
            confirmPassword: "",
            showPasswordNew: false,
            showPasswordConfirm: false,
            formValid: false,
            toggleForm: true,
            reset: true,
            open: false,
            status: 0,
            submitted: false
        };
        this.toggleSelection = true;
        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.showHideNew = this.showHideNew.bind(this);
        this.showHideConfirm = this.showHideConfirm.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    onInputChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    showHideNew() {
        this.setState(state => ({showPasswordNew: !state.showPasswordNew}));
    }

    showHideConfirm() {
        this.setState(state => ({showPasswordConfirm: !state.showPasswordConfirm}));
    }

    getOtp() {
        this.setState({
            toggleForm: false,
        })
    }

    forgotPassword() {
        this.setState({
            toggleForm: false
        })
    }

    openModal() {  
        this.setState({ 
            open: true
        });  
    }

    closeModal() {
        this.setState({
            open: false
        })
    }

    loader() {
        this.setState({ 
            submitted: true 
        })
    }

    getResetOtp(data) {
        AppAPI.reset.put(null, data).then((result) => {
            console.log(result, "Response");
            if (result.status === 200) {              
                this.openModal();                     
                this.setState({
                    status: result.status,
                    submitted: false
                })  
                setTimeout(() => this.locateHome(), 3000);
            }
        }).catch(e => console.log(e))  
        this.setState({
            reset: false
        })  
    }    

    locateHome() {
        window.location.pathname = '/'
    }

    onSubmit() {
        let {phone, password, confirmPassword} = {...this.state};        
        if (password === confirmPassword) {
            this.loader();
            this.getResetOtp({phone, password});              
        } else {
            this.setState({
                alert: true,
                alertMessage: "Your Password doesn't Match !"
            })
        }        
    }

    render() {
        const {classes} = this.props;
        const { submitted } = this.state;
        return (
            <div>
                    <ValidatorForm ref="form" onSubmit={this.onSubmit}>                               
                                <div className="container">
                                <p className="text-white mb-0">Reset your Password</p>
                                <TextValidator 
                                    fullWidth 
                                    margin="normal"
                                    name="password"
                                    label="New Password"
                                    type={this.state.showPasswordNew ? 'text' : 'password'}
                                    value={this.state.password}
                                    onChange={this.onInputChange}
                                    validators={['required']}
                                    errorMessages={['New Password is required']}
                                    InputLabelProps={{
                                    classes: {
                                        root: classes.cssLabel,
                                        focused: classes.cssFocused,
                                    },
                                    }}
                                    InputProps={{
                                        classes: {
                                        root: classes.cssOutlinedInput,
                                        focused: classes.cssFocused,
                                        underline: classes.cssUnderline,
                                    },
                                        endAdornment: (
                                            <InputAdornment variant="filled" position="end">
                                                <IconButton
                                                    onClick={this.showHideNew}
                                                >
                                                    {this.state.showPasswordNew ? <VisibilityOff className={classes.visibleIcon} /> : <Visibility className={classes.visibleIcon} />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <TextValidator 
                                    fullWidth 
                                    margin="normal"
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type={this.state.showPasswordConfirm ? 'text' : 'password'}
                                    value={this.state.confirmPassword}
                                    onChange={this.onInputChange}
                                    validators={['required']}
                                    errorMessages={['Confirm Password is required']}
                                    InputLabelProps={{
                                    classes: {
                                        root: classes.cssLabel,
                                        focused: classes.cssFocused,
                                    },
                                    }}
                                    InputProps={{
                                        classes: {
                                        root: classes.cssOutlinedInput,
                                        focused: classes.cssFocused,
                                        underline: classes.cssUnderline,
                                    },
                                        endAdornment: (
                                            <InputAdornment variant="filled" position="end">
                                                <IconButton
                                                    onClick={this.showHideConfirm}
                                                >
                                                    {this.state.showPasswordConfirm ? <VisibilityOff className={classes.visibleIcon} /> : <Visibility className={classes.visibleIcon} />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />                       
                            </div>   
                            <Grid container direction="row" className="d-flex justify-content-center" spacing={32} >
                                <Grid item>
                                    <br/>
                                    <Button 
                                        type="submit" 
                                        color="primary" 
                                        classes={{
                                            root: classes.mainButton,
                                            label: classes.mainLabel
                                        }}
                                        disabled={submitted}>                        	
                                        {
                                            (submitted && <Progress/>)
                                                || 
                                            (!submitted && 'Submit')
                                        }
                                    </Button>
                                </Grid>
                            </Grid>     
                    </ValidatorForm> 
                    <Dialog
                    open={this.state.open}
                    onClose={this.closeModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    >
                    <DialogContent>
                        {
                            this.state.status === 200
                            ?
                            <DialogContentText id="alert-dialog-description">
                                <img src="/assets/icons/tick.svg" alt="Success"
                                className="img-fluied d-flex justify-content-center tick"/>
                                Successfully Your Password has been Changed
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
            </div>
        );
    }
}

export default withStyles(mainStyles)(ResetPassword);