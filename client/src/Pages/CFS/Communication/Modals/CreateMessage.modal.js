import React, {Component} from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import {
    Paper,
    Button,
    withStyles,
    Typography
} from '@material-ui/core';

import Progress from './../../../../Components/Loading/Progress';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    formControl: {
        minWidth: '100%',
    },
    button: {
        margin: theme.spacing.unit
    },  
    saveLabel: {
        textTransform: 'capitalize',
        fontWeight: 600,
        color: "#14A474"
    },
    cancelLabel: {
        textTransform: 'capitalize',
        fontWeight: 600,
        color: "#dc3545c9"
    },
});
class CreateMessageModal extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: "",
            body: "",
            submitted: this.props.submitted
        }
        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }  

	onInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value }, () => {
            this.validateField(name, value);
        });
    }

    validateField(fieldName, value) {
        switch (fieldName) {
            case 'title':
                this.setState({ titleValid: value.length > 0 }, this.validateForm); break;
            case 'message':
                this.setState({ messageValid: value.length > 0 }, this.validateForm); break;
            default: break;
        }
    } 

    loader() {
        this.setState({ submitted: true });
    }
 
    onSubmit() {        
        this.loader();
        this.props.createMessage(this.state);
    }   
    
    backToTable(){
        this.props.backToCommunication();
    }

	render(){
        const { classes } = this.props;
        const { submitted } = this.state;
		return(
			// <div className="container messageContainer" >
                <div className="d-flex justify-content-center">
                <Paper style={{width: "350px"}}>
                	<h6 className="custom">Create Message</h6>
                    <div className="container pr-4 pl-4" >
                    <ValidatorForm ref="form" onSubmit={this.onSubmit} >
                        <TextValidator                            
                            fullWidth 
                            margin="normal"
                            name="title"
                            label="Title"
                            value={this.state.title}
                            onChange={this.onInputChange}
                            validators={['required']}
                            errorMessages={['Title is required']}
                        />                        
                        <TextValidator 
                            fullWidth 
                            margin="normal"
                            name="body"
                            label="Message"
                            value={this.state.body}
                            onChange={this.onInputChange}
                            validators={['required']}
                            errorMessages={['Message is required']}
                        />
                        <div className="d-flex justify-content-start pt-4">
                            <Typography variant="caption" gutterBottom>
                                Note: All Fields are Mandatory
                            </Typography> 
                        </div> 
                        <div className="d-flex justify-content-center pt-2 msgPad" >
                            <Button 
                                type="submit" 
                                variant="contained" 
                                classes={{
                                    root: classes.button, 
                                    label: classes.saveLabel,
                                }} 
                                disabled={submitted}>                        	
                                {
                                    (submitted && <Progress/>)
                                        || 
                                    (!submitted && 'Submit')
                                }
                            </Button>    
                            <Button 
                                variant="contained" 
                                classes={{
                                    root: classes.button, 
                                    label: classes.cancelLabel,
                                }} 
                                onClick={() => this.props.closeModal(false)}>
                                Cancel
                            </Button>   
                       	</div>
                    </ValidatorForm>
                    </div>
                </Paper>
                </div>
            // </div>
		);
	}
}

export default withStyles(styles)(CreateMessageModal);