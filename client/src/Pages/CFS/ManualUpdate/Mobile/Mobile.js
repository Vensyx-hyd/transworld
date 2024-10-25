import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import { 
    Paper,
    Grid,
    Radio,
    Dialog,
    DialogContent,
    DialogContentText,
    Button,
    Typography
} from '@material-ui/core';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import Progress from '../../../../Components/Loading/Progress';
import AppAPI from '../../../../API';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',        
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
    cssUnderlineUpdate: {    
        color: "#14A474",     
    }, 
    cssUnderline: {    
        color: "#dc3545c9",     
    },  
});

class Mobile extends Component{
	constructor(props){
		super(props);
		this.state = {            
            vehNo:"",    
            mobileNum:"",  
            model:"",
            imei:"",
            os:"",  
            remarks:"",

            info:{},
            trailerData: {},
            userId:"",
            vNo: "",
            vehMobNo:"",
            vehMobModel:"",
            mobOs:"",
            imeiNo:"",
            open: false,
            submitted: false,
            status: "",
            message: "",
            errMessage: "",
            code: ""
        }
        let { vehNo, mobileNum, model, os, imei, remarks, vNo, vehMobNo, vehMobModel, mobOs, imeiNo } = {...this.state};
        this.initialState = { vehNo, mobileNum, model, os, imei, remarks, vNo, vehMobNo, vehMobModel, mobOs, imeiNo }
        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.resetData = this.resetData.bind(this);
    } 

    getMobile() {
        AppAPI.adminConnectMobileGet.get(null, null).then((resp) => {
            let data = resp.tags
            console.log(data, "+++++++++ Get Details +++++++++");
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

    componentDidMount(){
        this.getMobile();
    } 

    resetData() {       
        this.setState(
            this.initialState,
        )
    } 

    // handleChecked = event => {
    //     this.resetData();
    //     this.setState({selectedValue: event.target.value});
    //     if (this.state.selectedValue === "Update Mobile") {
    //         this.getMobile()
    //     }
    // }; 

    onInputChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleInputSearch(event) {
        event.preventDefault();
        this.setState({ [event.target.name]: event.target.value });
        var trailerInfo = this.state.info;  
        let obj = trailerInfo.find(obj => obj.vehNo === event.target.value);
        if (obj !== undefined) {
            this.setState({
                trailerData: obj,
                status: obj.vehNo,
                vehMobNo: obj.vehMobNo,
                vehMobModel: obj.vehMobModel,
                mobOs:obj.mobOs,
                imeiNo: obj.imei
            })
        }
        else {
            this.setState({
                vehMobNo:"",
                vehMobModel: "",
                mobOs: "",
                imeiNo: ""
            })
        }       
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
            open: false
        })
    } 

    createMobile(data) {
        AppAPI.adminConnectMobile.post(null, data).then((resp) => {
            let msgCreate = resp.message;
                    if(resp.status === 201) {                
                    this.openModal();               
                    this.setState({
                        code: resp.status,
                        message: msgCreate,
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

    updateMobile(id, data) {
        AppAPI.adminConnectMobile.put('/' + id, data).then((resp) => {
            let msgUpdate = resp.message;
            if(resp.success === true) {                
               this.openModal();               
               this.setState({
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
        this.loader();                   
        var id  = this.state.trailerData.tagId;
        var vehNo = this.state.vNo;
        var mobileNum = this.state.vehMobNo;
        var remarks = this.state.remarks;
        this.updateMobile(id, {
            vehNo,
            mobileNum,
            remarks
        })
    }
    
	render() {
        const { classes } = this.props;
        const { submitted } = this.state;
        const isSelected = this.state.selectedValue;
		return(
			<div style={{margin: 'auto'}}>
                <div className="d-flex justify-content-center">
                <Paper style={{width: "550px"}}>
                	    <div className="container p-4">
                            {/* <div className={classes.root}>
                                <Grid container spacing={24}>
                                    <Grid item xs={6}>
                                        <Radio
                                            checked={this.state.selectedValue === 'Create Mobile'}
                                            onChange={this.handleChecked}
                                            value="Create Mobile"
                                            name="radio-button-demo"
                                            classes={{
                                                root: classes.radio,
                                            }}
                                        />
                                        <label>Create</label>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Radio
                                            checked={this.state.selectedValue === 'Update Mobile'}
                                            onChange={this.handleChecked}
                                            value="Update Mobile"
                                            name="radio-button-demo"
                                            classes={{
                                                root: classes.radio,
                                            }}
                                        />
                                        <label>Update</label> 
                                    </Grid>
                                </Grid>
                            </div>                             */}
                            <div>                                                      
                            
                            
                                <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                                <div className={classes.root}>
                                    <Grid container spacing={24}>
                                        <Grid item xs={6}>
                                            <TextValidator 
                                                fullWidth 
                                                margin="normal"
                                                name="vNo"
                                                label="Trailer No." 
                                                value={this.state.vNo}
                                                onChange={this.handleInputSearch.bind(this)}
                                                InputProps={{
                                                    classes: {
                                                        underline: classes.cssUnderlineUpdate
                                                    },
                                                }}
                                            />  
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextValidator 
                                                fullWidth 
                                                margin="normal"
                                                name="vehMobNo"
                                                label="Mobile No."
                                                value={this.state.vehMobNo}
                                                onChange={this.onInputChange}  
                                                validators={['matchRegexp:^[6-9][0-9]{9}$']}  
                                                errorMessages={['Enter Valid Mobile No.']}                             
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
                                                name="vehMobModel"
                                                label="Device Name"  
                                                value={this.state.vehMobModel}
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
                                                name="mobOs"
                                                label="Operating System" 
                                                value={this.state.mobOs}
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
                                                name="imeiNo"
                                                label="IMEI No."                                                 
                                                value={this.state.imeiNo}  
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
                                                name="remarks"
                                                label="Remarks"
                                                value={this.state.remarks}
                                                onChange={this.onInputChange}  
                                            />    
                                        </Grid>
                                    </Grid>
                                </div>  
                                <div className="d-flex justify-content-start pt-4">
                                    <Typography variant="caption" gutterBottom>
                                        Note: Please Search for Trailer No. To Update Mobile No.
                                    </Typography> 
                                </div>                             
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
                            </div>                            
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
                </div>
            </div>
		);
	}
}
export default withStyles(styles)(Mobile);