import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {
    withStyles,
    Paper, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    OutlinedInput, 
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    Snackbar,
    IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {ValidatorForm} from 'react-material-ui-form-validator';
import OpenInBrowser from '@material-ui/icons/OpenInBrowserRounded';
import Files from 'react-files';

import Progress from '../../../Components/Loading/Progress';
// import AppAPI from '../../../API';

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

class UploadMasterData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            labelWidth: 0,
            userType: "",
            files: [],
            open: false,
            submitted: false,
            message: "",
            errMessage: "",
            alert: false,
            alertMessage: ""
        }
        let { userType, files } = {...this.state};
        this.initialState = { userType, files }
        this.onInputChange = this.onInputChange.bind(this);
        this.onFilesChange = this.onFilesChange.bind(this);
        this.onFilesError = this.onFilesError.bind(this);
        this.filesUpload = this.filesUpload.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
    }

    onInputChange(event) {
        this.setState({ [event.target.name]: [event.target.value]});
    } 

    onFilesChange = (files) => {
        this.setState({
          files: files
        }, () => {
          console.log(this.state.files)
        })
    }

    filesRemoveOne = (file) => {
        this.refs.files.removeFile(file)
    }

    filesRemoveAll = () => {
        this.refs.files.removeFiles()
    }
     
    onFilesError(error, file) {
        console.log('error code ' + error.code + ': ' + error.message)
    }   

    resetData() {
        this.setState(
            this.initialState
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

    loader() {
        this.setState({ 
            submitted: true 
        })
    }

    // -------------------------- Harsha Working Code  --------------------------- //

    uploadFiles(url,file) {
        console.log(file, "New File");
        var xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append("adminFile", file, file.name);       
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
              console.log(xhr, "XHR");                                 
            }           
        }
        this.openModal();               
        this.setState({                                
            message: "Successfully Uploaded File",
        })   
        xhr.open("PUT", url);
        var authState = localStorage.getItem("auth");
        console.log(' Token ',JSON.parse(authState).token);
        xhr.setRequestHeader("Authorization",JSON.parse(authState).token);
        xhr.send(formData);        
    }     

    // uploadFiles(file) {
    //     AppAPI.fileUpload.put(`files`, file).then((resp) => {
    //         console.log(resp, "File Uploaded...");
    //         // resp.open("PUT", "http://localhost:8001/api/admin/files");
    //         // resp.send(formData);
    //         var msg = resp.message;
    //         if(resp.success === true) {                
    //             this.openModal();               
    //             this.setState({
    //             message: msg,
    //             })
    //         } 
    //     }).catch((err) => console.log(err)) 
    // }
   
    filesUpload = () => {
        if (this.state.userType !== "" && this.state.files.length !== 0) {
            this.loader();       
            const files = this.state.files;
            const file = files[0];
            console.log(files[0], "..........FILE Type...........");      

            // --------------------- Harsha Working Code ---------------------- //

            //this.uploadFiles("http://localhost:8001/api/admin/files",file);

            this.uploadFiles("https://cfsmanager-dev.azurewebsites.net/api/admin/files",file);

            //this.uploadFiles(file);   
        }      
        else {
            this.setState({
                alert: true,
                alertMessage: "Select Data & File are Required"
            })
        }  
    }

    componentDidMount() {
        this.setState({
            labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
        });
    }        

    onSubmit() {
    }

    render() {
        const { classes } = this.props;
        const { submitted } = this.state;
        return (
            <div>
                <p className="titleCard">Menu / Upload Master Data</p>
                <div className="d-flex justify-content-center">
                    <Paper style={{width: "350px"}}>
                        <h6 className="customHeader">Upload Master Data</h6>
                        <div className="container p-4">
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
                                        Select Data
                                    </InputLabel>
                                    <Select
                                        value={this.state.userType}
                                        onChange={this.onInputChange}
                                        input={
                                            <OutlinedInput
                                                labelWidth={this.state.labelWidth}
                                                name="userType"
                                                id="user-type"
                                            />

                                        }
                                    >
                                        <MenuItem value="trailer_info">Trailer Info</MenuItem>
                                        <MenuItem value="driver_info">Driver Info</MenuItem>
                                        <MenuItem value="maintenance_info">Maintenance Info</MenuItem>
                                    </Select>
                                </FormControl>
                                <div className="d-flex justify-content-center">
                                    <Files
                                        ref='files'
                                        className='files-dropzone'
                                        onChange={this.onFilesChange}
                                        onError={this.onFilesError}                                      
                                        accepts={['.csv']}
                                        multiple
                                        maxFiles={3}
                                        maxFileSize={10000000}
                                        minFileSize={0}
                                        clickable
                                        >
                                        <Button
                                            type="file"
                                            name="adminFile"
                                            variant="text"
                                            color="primary"
                                            classes={{
                                                root: classes.button,
                                                label: classes.label
                                            }}
                                            >
                                            <OpenInBrowser style={{fontSize: "3rem", cursor: "pointer"}}/>
                                        </Button>   
                                    </Files>
                                </div>
                                <h6 className="browse pb-2">Click Here to Browse File</h6>
                                {
                                    this.state.files.length > 0
                                    ? <div className='files-list'>
                                        <div>{this.state.files.map((file) =>                                        
                                        <div className='files-list-item col-12 col-sm-12 col-md-12 col-lg-12 pt-2 pb-2' key={file.id}>
                                            <div className="row">
                                            <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                                                <img src="/assets/icons/csv.svg" className="img-fluied d-flex justify-content-center csv" alt="CSV File"/>                                            
                                            </div>
                                            <div className='files-list-item-content col-6 col-sm-6 col-md-6 col-lg-6'>
                                                <div className='files-list-item-content-item files-list-item-content-item-1'>{file.name}</div>
                                                <div className='files-list-item-content-item files-list-item-content-item-2'>{file.sizeReadable}</div>
                                            </div>
                                            <div className="col-3 col-sm-3 col-md-3 col-lg-3 mt-3">
                                                <Button 
                                                    id={file.id}
                                                    variant="text"
                                                    className='files-list-item-remove '
                                                    onClick={this.filesRemoveOne.bind(this, file)}>
                                                    <img src="/assets/icons/cancel.svg" className="img-fluied d-flex justify-content-center cancelIcon" alt="Cancel"/>
                                                </Button>  
                                            </div> 
                                            </div>
                                            <hr/>
                                        </div>
                                        )}</div>
                                    </div>
                                    : null
                                }                                
                                {/* <Button 
                                    color="secondary"
                                    variant="outlined"
                                    onClick={this.filesRemoveAll.bind(this)}>
                                    Clear All
                                </Button> */}
                                <div className="d-flex justify-content-center pt-2">
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        color="primary" 
                                        classes={{
                                            root: classes.button,
                                            label: classes.label
                                        }}
                                        onClick={this.filesUpload}
                                        disabled={submitted}>                        	
                                        {
                                            (submitted && <Progress/>)
                                                || 
                                            (!submitted && 'Upload')
                                        }
                                    </Button>
                                </div>
                            </ValidatorForm>
                        </div>
                    </Paper>
                    <Dialog
                        open={this.state.open}
                        onClose={this.closeModal}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        >
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                            <img src="/assets/icons/tick.svg" alt="Tick Mark"
                                className="img-fluied d-flex justify-content-center tick"/>
                                {this.state.message}                               
                            </DialogContentText>
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
export default withStyles(styles)(UploadMasterData);

  // accepts={['image/png', '.pdf', 'audio/*','.csv']}

  // const formData = new FormData();
        // formData.append("adminFile", file);
        // console.log(formData, "..........Form data entries...........");

 // const formData = new FormData()
        // Object.keys(this.state.files).forEach((key) => {
        //     const file = this.state.files[key]
        //     console.log(file, "..........FILE...........");
        //     formData.append(key, new Blob([file], { type: file.type }), file.name || 'file')
        // })
        // console.log(formData, "..........Forms...........");