import React, {Component} from 'react';
import { 
    Paper, 
    Typography, 
    Grid, 
    withStyles, 
    Dialog, 
    DialogContent,
    DialogContentText,
    Button
 } from '@material-ui/core';
import { 
    AccountCircle 
} from '@material-ui/icons';
import moment from 'moment';
import ModifyProfileModal from './Modals/ModifyProfile.modal';

import Loading from '../../Components/Loading/Loading';
import AppAPI from '../../API';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    button: {
        margin: theme.spacing.unit
    },    
    label: {
    textTransform: 'capitalize',
    fontWeight: 600
    },
});
class Profile extends Component{
	constructor(props){
		super(props);
		this.state = {
            getApi: false,
            info: [0],
        }
        this.updateProfile = this.updateProfile.bind(this);
        this.convert = this.convert.bind(this);
        this.closeProfile = this.closeProfile.bind(this);
    }

    getProfile() {
        AppAPI.profile.get(null, null).then((resp) => {
            console.log(resp.profileDetails, "Profile Info");
            this.setState({
                info: resp.profileDetails,
                getApi: true
            }) 
          }).catch((err) => console.log(err))
    }

    closeProfile (isFetch) {
        if (isFetch) {
            this.getProfile();
        }
        this.setState({
            open: false,
            selectedModal: ''
        })
      }  

    msgUpdated() {
        this.setState({
            open: true,
            submitted: false,
            selectedModal: "message",
        }, () => {
            setTimeout(() => this.setState({ 
                open: false
            }), 5000);            
        });
    }

    updateProfile(id, data) {
        AppAPI.profileUpdate.put(id, data).then((resp) => {
            console.log(resp, "Updated Profile");
            this.closeProfile(true)
            var mCreated = resp.message;
                if(resp.success === true) {                
                    this.msgUpdated();               
                    this.setState({
                        message: mCreated,
                })
            }    
        }).catch(error => console.log(error))
    }    
    
    componentWillMount() {
        this.getProfile();         
    }

    modifyProfileDetails(data){
		this.setState({
            open: true,
            selectedModal: "modify",
			sendData: data
		})
    }

    handleClose() {
        this.setState({
            open: false,
            selectedModal: ""
        })
    }
    
    backToProfile(){
		this.setState({
			open: false
		})
    }
    
    renderModalContent() {
        if (this.state.selectedModal === 'modify') {
            return (
            <DialogContent style={{padding: 0}}>
            <ModifyProfileModal backToProfile={this.backToProfile.bind(this)} 
                sendData={this.state.sendData} 
                updateProfile = {this.updateProfile} 
                convert = {this.convert} />                        
            </DialogContent>    
            );        
        } else if (this.state.selectedModal === 'message') {
            return (
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                <img src="/assets/icons/tick.svg" alt="Tick Mark"
                     className="img-fluied d-flex justify-content-center tick"/>
                    {this.state.message}
                </DialogContentText>
            </DialogContent>   
            );
        } else {
            return null
        }
    }
	
    convert(date) {
        return date !== null || date !== "" || date !== 0 ? moment(date).format("L") : ""
    }
	
	render(){
        const {classes, fullScreen} = this.props;
        const {getApi, info} = this.state;
		return(            
            getApi === false 
            ? 
            <div className="container" style={{position:"relative", top:"15rem"}}> 
                <div className="d-flex justify-content-center pt-50">
                    <Loading/>
                </div>
            </div> 
            : 
            info.length === 0 
            ? 
            <div className="container" style={{position:"relative", top:"15rem"}}> 
                <div className="d-flex justify-content-center pt-50">
                    No Data Found !
                </div>
            </div> 
            :
			<div className="container">            
                <div className="d-flex justify-content-center">                
                { info.map((data) => {
                    return (
                        <Paper style={{width: "400px", marginTop:"2vh"}}>
                            <h6 className="customHeader">Profile</h6>
                            <div className="container p-4">
                                <div className={classes.root}>
                                    <Grid container alignItems="center" justify="center">  
                                        <AccountCircle style={{color:"#989595", fontSize:"12vh"}} />
                                    </Grid>
                                </div>  
                                <hr />     
                                <div className={classes.root}>
                                    <Grid container spacing={24}>       
                                        <Grid item xs={4}>
                                            <Typography className="titleColor" variant="subheading" component="h3" align="left">
                                                Name
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography className="fieldColor" variant="subheading" component="h3" align="left">
                                                {data.driverName}
                                            </Typography>
                                        </Grid>       
                                    </Grid>
                                </div>
                                <hr />
                                <div className={classes.root}>
                                    <Grid container spacing={24}>       
                                        <Grid item xs={4}>
                                            <Typography className="titleColor" variant="subheading" component="h3" align="left">
                                                Mobile
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography className="fieldColor" variant="subheading" component="h3" align="left">
                                                {data.contactNo}
                                            </Typography>
                                        </Grid>       
                                    </Grid>
                                </div>     
                                <hr />
                                <div className={classes.root}>
                                    <Grid container spacing={24}>       
                                        <Grid item xs={4}>
                                            <Typography className="titleColor" variant="subheading" component="h3" align="left">
                                                Email
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography className="fieldColor" variant="subheading" component="h3" align="left">
                                                {/* {data.email} */}
                                            </Typography>
                                        </Grid>       
                                    </Grid>
                                </div>   
                                <hr />
                                <div className={classes.root}>
                                    <Grid container spacing={24}>       
                                        <Grid item xs={4}>
                                            <Typography className="titleColor" variant="subheading" component="h3" align="left">
                                                D.O.B
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography className="fieldColor" variant="subheading" component="h3" align="left">
                                                {this.convert(data.dob)}
                                            </Typography>
                                        </Grid>       
                                    </Grid>
                                </div> 
                                <hr />
                                <div className={classes.root}>
                                    <Grid container spacing={24}>       
                                        <Grid item xs={4}>
                                            <Typography className="titleColor" variant="subheading" component="h3" align="left">
                                                D.O.J
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography className="fieldColor" variant="subheading" component="h3" align="left">
                                                {/* {this.convert(data.doj)} */}
                                            </Typography>
                                        </Grid>       
                                    </Grid>
                                </div>
                                <hr />
                                <div className={classes.root}>
                                    <Grid container spacing={24}>       
                                        <Grid item xs={4}>
                                            <Typography className="titleColor" variant="subheading" component="h3" align="left">
                                                Address
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography className="fieldColor" variant="subheading" component="h3" align="left">
                                                {data.permanentAddress}
                                            </Typography>
                                        </Grid>       
                                    </Grid>
                                </div> 
                                <hr />   
                                <div className="d-flex justify-content-center pt-4">
                                    <Button
                                        type="submit"                                        
                                        variant="contained"
                                        color="primary"
                                        classes={{
                                            root: classes.button,
                                            label: classes.label
                                        }}
                                        onClick={this.modifyProfileDetails.bind(this, data)}
                                    >
                                        Update
                                    </Button>                                    
                                </div>
                            </div>
                        </Paper>
                    )
                })}
                </div>
                <Dialog 
                    fullScreen={fullScreen}
                    open={this.state.open}
                    onClose={this.handleClose.bind(this)}
                    aria-labelledby="responsive-dialog-title"
                    classes={{paper: classes.dialogPaper}}>
                    {this.renderModalContent()}                   
                </Dialog>
            </div>
		);
	}
}
export default withStyles(styles)(Profile);