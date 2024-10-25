import React from 'react';
import {
    withStyles,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Dialog,
    DialogContent,
    DialogContentText
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircleRounded';
import Delete from '@material-ui/icons/Delete';

import styles from './Notificaitons.styles';
import AppAPI from './../../../../API';
import Loading from '../../../../Components/Loading/Loading';
import Progress from '../../../../Components/Loading/Progress';

class NotificationsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            getApi: false,
            msgData: [],
            hover: false,
            code: 0,
            submitted: false,
            open: false
        }
        this.mouseOver = this.mouseOver.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    getMessages(){
        AppAPI.homeMessages.get(null, null).then((res) => {
            console.log(res.msg, "Messages");
            this.setState({
                msgData: res.msg,
                getApi: true,                
            })                
        }).catch(e => {             
            if (e.code === 500) {
                // this.updateModal();    
                this.setState({
                    errMessage: e.serverMessage
                })
            }
            console.log(e, "Error");
        }) 
    }      

    messageDelete(id) {
        AppAPI.deleteMessage.delete('/' + id, null).then((res) => {
            console.log(res, "Message Deleted");
            if (res.status === 200) {
                // this.openModal();
                this.setState({
                    code: res.status,
                    // submitted: false
                })
            }               
            this.getMessages();
        }).catch(e => {             
            if (e.code === 500) {
                // this.updateModal();    
                this.setState({
                    errMessage: e.serverMessage
                })
            }
            console.log(e, "Error");
        }) 
    }

    componentDidMount() {
        this.getMessages();
    }

    openModal() {   
        this.setState({ open: true }, () => {
            setTimeout(() => this.setState({ 
                open: false
            }), 5000);            
        });
    }

    closeModal() {
        this.setState({
            open: false
        })
    } 

    mouseOver=(e)=> {
        this.setState({
            hover: true
        })
    }

    mouseOut() {
        this.setState({
            hover: false
        })
    }

    loader() {
        this.setState({ 
            submitted: true 
        });
    }

    onSubmit(e){
        // this.loader();
        this.messageDelete(e);
    }

    renderList() {
        const {classes} = this.props;
        const { getApi, msgData, hover, submitted } = {...this.state};
        return (
        getApi === false
        ?
        <div className="d-flex justify-content-center center">
            <Loading/>
        </div>
        :
        msgData.length === 0
        ?
        <div className="d-flex justify-content-center center">
            <label>No Data Found !</label>
        </div>        
        :
        msgData.map((ele, index) => 
        <ListItem key={index + Date.now()} alignItems="flex-start" className={classes.listItem} 
        onMouseEnter={(ele)=>{this.mouseOver(this,ele)}} 
        onMouseLeave={(ele)=>{this.mouseOut(this,ele)}}
        >
            <ListItemAvatar>
                <AccountCircle style={{color: "rgba(51, 44, 111, 0.64)", fontSize: "6vh"}}/>
            </ListItemAvatar>
            <ListItemText 
                style={{textTransform:"capitalize"}}
                primary={ele.DrivName}
                secondary={
                    <React.Fragment>  
                        <label className={classes.font}>
                            {ele.notifyDesc}
                        </label>                         
                    </React.Fragment>
                }
            /> 
            {
                hover === true
                ?
                (<Button 
                    variant="flat" 
                    className={classes.button}
                    onClick={()=>{this.onSubmit(ele.dMsgId)}}
                    disabled={submitted}>                        	
                    {
                        (submitted && <Progress/>)
                            || 
                        (!submitted && <Delete className={classes.delete} />)
                    }                        
                </Button> )
                :
                null
            }      
            <Dialog
                    open={this.state.open}
                    onClose={this.closeModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    >                    
                    <DialogContent>  
                    {
                        this.state.code === 200
                        ?
                        <DialogContentText id="alert-dialog-description">
                            <img src="/assets/icons/tick.svg" alt="Success"
                            className="img-fluied d-flex justify-content-center tick"/>
                            Successfully Deleted Message
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
        </ListItem>
        )
    )}

    render() {
        const {classes} = this.props;

        return (
            <List className={classes.notificationContainer}>
                {this.renderList()}
            </List>
        );
    }
}

export default withStyles(styles)(NotificationsComponent);