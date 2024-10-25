import React from 'react';
import {Link} from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LeftNavigation from './Navigation';
import Routes from './Routes'
import menus from './menus.json';
import {
    AppBar,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    Toolbar,
    Typography,
    MenuItem,
    Menu,
    MuiThemeProvider,
    createMuiTheme
} from '@material-ui/core/';
import {withStyles} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import classNames from 'classnames';

import styles from './Layout.styles';
import {connect} from "react-redux";

import LayoutActions from './+state/Layout.actions';

import AuthActions from '../Auth/+state/Auth.actions';

import AppAPI from '../../API';
import { saveUserState } from '../../Pages/Auth/+state/loadUserState';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#14A474",
        },  
        secondary: {
            // main: "#00b9f5",
            main : "#332c6f"
        },
        optional: {
            main: "#dc3545c9"
        },
        typography: { 
            useNextVariants: true,           
            fontSize: 12,
        },
    },
    overrides: {
        MuiButton: {
        text: {
            background: 'none',
            borderRadius: 3,
            border: 0,
            color: '#dc3545c9',
            textTransform:'capitalize',
            fontWeight: 600,
            height: 48,
        },
    },
    }
  });

const mapStateToProps = function (state) {
    return {
        state: state.layout,
        auth: state.auth
    }
};

const mapDispatchToProps = dispatch => {
    return {
        toggleMenu: () => dispatch(LayoutActions.TOGGLE_MENU()),
        toggleProfilePop: (element) => {
            dispatch(LayoutActions.TOGGLE_PROFILE_POP(element))
        },
        logOutuser: () => {
            dispatch(AuthActions.LOGOUT_USER());
            dispatch(LayoutActions.TOGGLE_PROFILE_POP(null));
        },
        removeMenu: () => dispatch(LayoutActions.REMOVE_MENU()),
        removeProfile: () => dispatch(LayoutActions.REMOVE_PROFILE())
    }
};

class Layout extends React.Component {
    constructor(props) {
        super(props);

        console.log(props.auth);
        this.state = {
            menus: [menus[props.auth.role], menus['reports']],
            getUserAvatar: "",
            getUserName: {
                firstName: "",
                lastName: ""
            },
            userName: props.auth.user.name,
            getPath: ""
        };
        this.handleClose = this.handleClose.bind(this);
    }

    componentWillMount() {
        console.log(this.props.auth);
        if (!this.props.auth.role) {
            this.props.history.push('./')
        }
        else if (this.props.auth.role === 'CEO') {
            this.props.removeMenu();
            this.props.removeProfile();
        }
        else if (this.props.auth.role === 'Admin') {
            this.props.removeProfile();
        }
    }

    profileAccount() {
        this.props.toggleProfilePop(null);
        this.props.history.push('./profile');
    }
    
    logoutAccount() {
        var xhr = new XMLHttpRequest();    
        const formData = new FormData();
        formData.append(null, null);  
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
              console.log(xhr, "Logout");  
                window.location.pathname = '/login'                               
            }           
        }        
        xhr.open("POST", "https://cfsmanager-dev.azurewebsites.net/api/authenticate/logout");
        var authState = localStorage.getItem("auth");
        console.log(' Token ',JSON.parse(authState).token);
        xhr.setRequestHeader("Authorization",JSON.parse(authState).token);   
        xhr.send(formData);
        this.props.logOutuser(); 
    }    

    handleClose() {
        this.props.toggleProfilePop(null);
    }

    handleClick(event) {
        this.props.toggleProfilePop(event.currentTarget);
    }

    renderPageByPath() {
        let pathName = null;
        if (this.props && this.props.location) {
            pathName = this.props.location.pathname.substring(1, this.props.location.pathname.length);
        }
        if (Routes.PrivateRoutes.Reports.get(pathName)) {
            let Component = Routes.PrivateRoutes.Reports.get(pathName);
            return <Component/>
        } else if (Routes.PrivateRoutes[this.props.auth.role].get(pathName)) {
            let Component = Routes.PrivateRoutes[this.props.auth.role].get(pathName);
            return <Component/>
        } else {
            let Component = Routes.PrivateRoutes.NotFoundPage;
            return <Component/>
        }
    }

    renderMenuButton() {
        const {classes, state} = this.props;
        const {isOpen} = this.props.state;

        return state.isMenuHidden ? null : <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={this.props.toggleMenu}
            className={classNames(classes.menuButton, isOpen && classes.hide)}>
            <MenuIcon/>
        </IconButton>;
    }

    renderProfile() {
        const {state} = this.props;
        return state.isProfileHidden 
        ? 
        null 
        :
        <MenuItem
            style={{color: "#332c6f"}}
            onClick={this.profileAccount.bind(this)}
            component={Link}   
            to="/profile"
            >
            Profile
        </MenuItem>;
    }

    render() {
        const {classes} = this.props;
        const {anchorEl, isOpen} = this.props.state;

        return (
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar
                    style={{background: '#332c6f'}}
                    position="fixed"
                    className={
                        classNames(classes.appBar, {[classes.appBarShift]: isOpen})}>
                    <Toolbar>
                        {this.renderMenuButton()}
                        <Typography className={classes.title} variant="h6">
                            {this.props.auth.role}
                        </Typography>
                        <div className="profileAvatar">
                            <div className="d-flex pt-2" 
                                 aria-haspopup="true"
                                 onClose={this.handleClose}
                                 >
                                <Typography 
                                    variant="h6" 
                                    color="inherit" 
                                    align="right"
                                    >
                                    {this.state.getUserName.firstName}&nbsp;{this.state.getUserName.lastName}
                                </Typography>
                                <label className="pt-1 pr-2">
                                    {this.state.userName}
                                </label>
                                <AccountCircle 
                                    aria-owns={anchorEl ? 'simple-menu' : undefined}
                                    onClick={this.handleClick.bind(this)}
                                    style={{fontSize: '40px', cursor: "pointer"}}                                    
                                />
                            </div>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                style={{top: "3rem", width: "125px", right: "1rem"}}
                                open={Boolean(anchorEl)}
                                onClose={this.handleClose}
                            >
                                {this.renderProfile()}
                                <MenuItem 
                                    style={{color: "#332c6f"}} 
                                    onClick={this.logoutAccount.bind(this)}
                                    >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="persistent"
                    anchor="left"
                    open={isOpen}
                    className={classNames(classes.drawer, {
                        [classes.drawerOpen]: isOpen,
                        [classes.drawerClose]: !isOpen
                    })}
                    classes={{
                        paper: classNames(classes.drawerPaper, {
                            [classes.drawerOpen]: isOpen,
                            [classes.drawerClose]: !isOpen
                        })
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <img src="/assets/images/Transworld_Logo.png" alt="Transworld Logo"
                             className="img-fluied d-flex justify-content-center logo1"/>
                    </div>
                    <List>
                        {
                            this.state.menus.map((menu, index) => {
                                return (<LeftNavigation menus={menu} key={index}/>)
                            })
                        }
                    </List>
                </Drawer>

                  
                <main
                    className={classes.content}>
                    <div className="mt-1 pt-1 mb-5"/>
                    <div>
                        <MuiThemeProvider theme={theme}>      
                            {this.renderPageByPath()}
                        </MuiThemeProvider>
                    </div>
                </main>
                
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Layout));