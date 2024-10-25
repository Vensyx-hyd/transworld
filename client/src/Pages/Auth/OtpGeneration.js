import React from 'react';
import { 
    Grid, 
    Snackbar, 
    Button,
    withStyles,
    IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';

import AppAPI from '../../API';
import mainStyles from '../../Styles/mainStyles';
import ResetPassword from './ResetPassword';
import Progress from './../../Components/Loading/Progress';

class OtpGeneration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: "",
            otp: "",           
            toggleForm: true,
            reset: false,
            submitted: false,
            alert: false,
        };
        this.toggleSelection = true;
        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmitOtp = this.onSubmitOtp.bind(this);
        this.onSubmitVerifyOtp = this.onSubmitVerifyOtp.bind(this);
        this.getResendOtp = this.getResendOtp.bind(this);
        this.redirectToLogin = this.redirectToLogin.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    onInputChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };
    
    showNotification = (message) => {
        this.setState({
            showNotification: true,
            notification: message
        });
    }

    hideNotification = () => {
        this.setState({showNotification: false});
    }

    getOtp(phone) {
        AppAPI.otp.get(phone, null).then((result) => {
            console.log(result, "Mobile Response");
            if (result.status === 200) {
                this.setState({
                    toggleForm: false,
                    submitted: false
                }) 
            } else if (result.status === 400) {   
                this.setState({
                    alert: true,
                    submitted: false,
                    alertMessage: "Please Enter Valid Registered Mobile No."
                }) 
            }
        }).catch(e => {
            console.log(e)
            // if (e.code === 500) {   
            //     this.setState({
            //         alert: true,
            //         submitted: false,
            //         alertMessage: "Please Enter Valid Mobile No."
            //     }) 
            // }
        })
    }

    getResendOtp() {
        let phone = this.state.mobile;
        AppAPI.reOtp.get(phone, null).then((result) => {
            console.log(result, "Response");
        }).catch(e => console.log(e))
    }

    getVerifyOtp(phone,otp) {
        AppAPI.verifyOtp.get((phone + '/' + otp), null).then((result) => {
            console.log(result, "OTP Response");
            if (result.status === 200) {
                this.setState({
                    toggleForm: "",
                    reset: true,
                    submitted: false
                })  
            } else if (result.status === 400) {   
                this.setState({
                    alert: true,
                    submitted: false,
                    alertMessage: "Please Enter Valid OTP Sent to Your Mobile"
                }) 
            }
        }).catch(e => {
            console.log(e)
            // if (e.code === 500) {   
            //     this.setState({
            //         alert: true,
            //         submitted: false,
            //         alertMessage: "Please Enter Valid OTP Sent to Your Mobile"
            //     }) 
            // }
        })
    }

    loader() {
        this.setState({ 
            submitted: true 
        });
    }

    closeModal() {
        this.setState({
            alert: false
        })
    }

    onSubmitOtp() {
        let phone = this.state.mobile;
        this.loader();
        this.getOtp(phone);
    }

    onSubmitVerifyOtp() {
        let phone = this.state.mobile;
        let otp = this.state.otp;
        this.loader();
        this.getVerifyOtp(phone,otp)         
    }

    redirectToLogin() {
        window.location.pathname = '/'
    }

    render() {
        const {classes} = this.props;
        const {toggleForm, submitted} = this.state;
        return (
            <div>                
                <div className="row signin-page">
                    <div className="col-sm-0 col-md-6 col-lg-6 primary-design  justify-content-center align-items-center d-flex">
                        <img src="assets/images/Transworld_Logo.png" alt="Transworld Logo"
                        className="img-fluied d-flex justify-content-center logo"
                        onClick={() => {this.redirectToLogin()}}                            
                        />
                    </div>
                    <div
                        className="col-sm-12 col-md-6 col-lg-6 background-design justify-content-center align-items-center d-flex">
                        <div className="container p-5">
                            {   
                                toggleForm === true
                                ? 
                                <ValidatorForm ref="form" onSubmit={this.onSubmitOtp}>
                                    <div>
                                        <p className="text-white mb-0">We'll send you a OTP to your Mobile No. to reset
                                            your Password</p>
                                        <TextValidator
                                            fullWidth
                                            margin="normal"
                                            label="Mobile No."
                                            name="mobile"
                                            value={this.state.mobile}
                                            onChange={this.onInputChange}
                                            validators={['required', 'matchRegexp:^[6-9][0-9]{9}$']}
                                            errorMessages={['Mobile No. is required']}
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
                                            }}
                                        />
                                    </div>                                   
                                    <Grid container direction="row" className="d-flex justify-content-center" spacing={32}>
                                        <Grid item>
                                            <br/>
                                            <Button 
                                                type="submit" 
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
                                :
                                toggleForm === false
                                ?
                                <ValidatorForm ref="form" onSubmit={this.onSubmitVerifyOtp}>
                                    <div>
                                     <p className="text-white mb-0">Enter your OTP to Reset your Password</p>                               
                                     <TextValidator 
                                         fullWidth
                                         margin="normal"
                                         label="OTP"
                                         name="otp"
                                         value={this.state.otp}
                                         onChange={this.onInputChange}
                                         validators={['required', 'matchRegexp:^[0-9]{4}$']}
                                         errorMessages={['OTP is required']}
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
                                         }}
                                     />
                                     <Button                                         
                                         size="small" 
                                         classes={{
                                             root: classes.secondaryButton,
                                             label: classes.secondaryLabel
                                         }}
                                         onClick={this.getResendOtp}
                                         >
                                         Resend OTP
                                     </Button>   
                                    </div>
                                    <Grid container direction="row" className="d-flex justify-content-center" spacing={32}>
                                        <Grid item>
                                            <br/>
                                            <Button 
                                                type="submit" 
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
                                :
                                <ResetPassword phone={this.state.mobile}/>
                            }                               
                        </div>
                    </div>
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
            </div>
        );
    }
}

export default withStyles(mainStyles)(OtpGeneration);