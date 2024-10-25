import React from 'react';
import ReactDOM from 'react-dom';
import {
    Grid,
    Snackbar,
    IconButton,
    InputAdornment,
    Button,
    OutlinedInput,
    InputLabel,
    MenuItem,
    FormControl,
    Select
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { VisibilityOff, Visibility } from '@material-ui/icons/';
import mainStyles from '../../Styles/mainStyles';

import AuthActions from './+state/Auth.actions';
import { connect } from "react-redux";

import AppAPI from '../../API';
import Constants from '../../API/constants';
import Progress from './../../Components/Loading/Progress';

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: (user) => {
            dispatch(AuthActions.SET_USER(user))
        }
    };
};

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            labelWidth: 0,
            user: "",
            userType: "",
            mobile: "",
            password: "",
            showPassword: false,
            toggleForm: true,
            submitted: false,
            alert: false,
            alertMessage: ""
        };
        this.toggleSelection = true;
        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.showHide = this.showHide.bind(this);
        this.hideNotification = this.hideNotification.bind(this);
        this.showNotification = this.showNotification.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.redirectToLogin = this.redirectToLogin.bind(this);
    }

    componentDidMount() {
        this.setState({
            labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
        });

        if (this.props.auth.token) {
            this.redirectByRole(this.props.auth)
        }
    }

    onInputChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    showHide() {
        this.setState(state => ({ showPassword: !state.showPassword }));
    }

    forgotPassword() {
        this.setState({
            toggleForm: false
        })
    }

    showNotification = (message) => {
        this.setState({
            showNotification: true,
            notification: message
        });
    };

    hideNotification = () => {
        this.setState({ showNotification: false });
    };

    loader() {
        this.setState({
            submitted: true
        }
            // , () => {
            //     setTimeout(() => this.setState({ submitted: false }), 5000);
            // }
        );
    }

    closeModal() {
        this.setState({
            alert: false
        })
    }

    onSubmit() {
        if (this.state.user !== "") {
            let { mobile, password, user } = this.state;

            console.log("Login Details:");
            console.log("User Type: ", user);
            console.log("Mobile Number: ", mobile);
            console.log("Password: ", password);

            if (mobile && password && user) {
                this.loader();
                this.doAuthenticate(mobile, password, user);
            }
        } else {
            this.setState({
                alert: true,
                alertMessage: "Please Select User Type to Proceed"
            })
        }
    }

    doAuthenticate(phone, password, user) {
        AppAPI.auth.post(null, {
            phone,
            password
        }).then((result) => {
            if (result.status === 400 && result.error === "Not a registered mobile number") {
                alert("Not a registered mobile number");
                this.setState({
                    alert: true,
                    submitted: false,
                    alertMessage: "Your Mobile No. is Not Registered with us !"
                })
            }
            if (result.status === 400 && result.error === "invalid password") {
                this.setState({
                    alert: true,
                    submitted: false,
                    alertMessage: "Your Password is Incorrect !"
                })
            }
            // if (Constants.roles[result.user.user_type_code] == user) {
            if ( user === 'CEO' || user === 'Admin' || user === 'CFSManager' ) { //user === 'CEO' || user === 'Admin' || user === 'CFSManager'
                // alert("User_type_code :: ",Constants.roles[result.user.user_type_code])
                // console.log(Constants.roles[result.user.user_type_code]);
                const Obj = {
                    // role: Constants.roles[result.user.user_type_code],
                    role: user,
                    token: result.token,
                    user: result.user
                };
                this.redirectByRole(Obj);
            } else {
                // alert('Error')
                this.setState({
                    alert: true,
                    submitted: false,
                    alertMessage: "You are not Authorized !"
                })
            }
        }).catch(e => {
            alert('Catch error')
            console.log(e)
        })
    }

    redirectByRole(result) {
        console.log("result", result);
        this.props.setUser(result);
        if (result.role === 'Admin') {
            this.props.history.push('./manage-users')
        }
        else if (result.role === 'CEO') {
            this.props.history.push('./ceo-dashboard')
        } else {
            this.props.history.push('./dashboard')
        }
    }

    redirectToLogin() {
        window.location.pathname = '/'
    }

    render() {
        const { classes } = this.props;
        const { submitted } = this.state;

        if (window.location.pathname === "/login") {
            this.toggleSelection = false;
        }
        return (
            <div>
                <div className="row signin-page">
                    <div className="col-sm-0 col-md-6 col-lg-6 primary-design  justify-content-center align-items-center d-flex">
                        <img src="assets/images/Transworld_Logo.png" alt="Transworld Logo"
                            className="img-fluied d-flex justify-content-center logo"
                            onClick={() => { this.redirectToLogin() }}
                        />
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6 background-design justify-content-center align-items-center d-flex">
                        <div className="container p-5">
                            <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                                <FormControl
                                    variant="outlined"
                                    className={classes.formControlLogin}
                                >
                                    <InputLabel
                                        className={classes.label}
                                        ref={ref => {
                                            this.InputLabelRef = ref;
                                        }}
                                        htmlFor="user-type"
                                    >
                                        User Type
                                    </InputLabel>
                                    <Select
                                        className={classes.OutlinedInput}
                                        inputProps={{
                                            classes: {
                                                icon: classes.visibleIcon,
                                            },
                                        }}
                                        value={this.state.user}
                                        onChange={this.onInputChange}
                                        input={
                                            <OutlinedInput
                                                labelWidth={this.state.labelWidth}
                                                name="user"
                                                id="user-type"
                                            />
                                        }
                                    >
                                        <MenuItem value="CEO">CEO</MenuItem>
                                        <MenuItem value="Admin">Admin</MenuItem>
                                        <MenuItem value="CFSManager">CFS Manager</MenuItem>
                                    </Select>
                                </FormControl>
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
                                <TextValidator
                                    fullWidth
                                    margin="normal"
                                    label="Password"
                                    name="password"
                                    type={this.state.showPassword ? 'text' : 'password'}
                                    value={this.state.password}
                                    onChange={this.onInputChange}
                                    validators={['required']}
                                    errorMessages={['password is required']}
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
                                                    onClick={this.showHide}
                                                >
                                                    {this.state.showPassword ?
                                                        <VisibilityOff className={classes.visibleIcon} /> :
                                                        <Visibility className={classes.visibleIcon} />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button
                                    size="small"
                                    classes={{
                                        root: classes.secondaryButton,
                                        label: classes.secondaryLabel
                                    }}
                                    component={Link} to="/otp"
                                >
                                    Forgot Password ?
                                </Button>
                                <Grid container direction="row" className="d-flex justify-content-center"
                                    spacing={32}>
                                    <Grid item>
                                        <Button
                                            type="submit"
                                            classes={{
                                                root: classes.mainButton,
                                                label: classes.mainLabel
                                            }}
                                            disabled={submitted}>
                                            {
                                                (submitted && <Progress />)
                                                ||
                                                (!submitted && 'Login')
                                            }
                                        </Button>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(mainStyles)(Login));