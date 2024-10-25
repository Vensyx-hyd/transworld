import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Paper,
    Grid,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    OutlinedInput,
    Radio,
    Typography,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    Snackbar,
    IconButton,
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

class VendorMaster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Input fields
            categoryName: '',
            categoryDescription: '',
            departmentName: '',
            departmentDescription: '',
            kycTypeName: '',
            kycTypeDescription: '',
            serviceName: '',
            serviceDescription: '',
            serviceCostTypeName: '',
            serviceCostTypeDescription: '',
            servicePlanTypeName: '',
            servicePlanTypeDescription: '',
            vendorTypeName: '',
            vendorTypeDescription: '',

            // Other states
            selectedValue: 'Category Type', // Default to 'Category Type'
            message: '',
            submitted: false,

            code: '',
            open: false,
            alert: false,
            alertMessage: "",
            errMessage:"",
        };

        let { categoryName, categoryDescription, departmentName, departmentDescription, kycTypeName, kycTypeDescription, serviceName, serviceDescription, serviceCostTypeName, serviceCostTypeDescription, servicePlanTypeName, servicePlanTypeDescription, vendorTypeName, vendorTypeDescription, } = { ...this.state };
        this.initialState = { categoryName, categoryDescription, departmentName, departmentDescription, kycTypeName, kycTypeDescription, serviceName, serviceDescription, serviceCostTypeName, serviceCostTypeDescription, servicePlanTypeName, servicePlanTypeDescription, vendorTypeName, vendorTypeDescription, }

        this.handleCheckedCreate = this.handleCheckedCreate.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
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
    }

    closeModal() {
        this.setState({
            open: false,
            alert: false
        })
    }

    // Method to handle input field changes
    onInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    // Method to handle form submission
    onSubmit(event) {
        event.preventDefault();

        const { selectedValue } = this.state;

        // Initialize formData and apiUrl
        let formData;

        if (selectedValue === 'Category Type') {
            this.setState({ submitted: true });
            formData = {
                categoryName: this.state.categoryName.trim(),
                categoryDescription: this.state.categoryDescription.trim(),
                type: "Category Type",
            };
            // console.log(formData)

            AppAPI.adminVendorCreateCategoryType
                .post(null, formData)
                .then((resp) => {
                    this.setState({
                        code: resp.status,
                        message: resp.message
                    })
                    this.openModal();
                    // console.log("Category type :: ", resp);
                    this.resetData();
                }).catch(e => {
                    this.setState({
                        errMessage: e.serverMessage
                    })
                    this.openModal();
                    console.error(e, "Error");
                })

        } else if (selectedValue === 'Department Type') {
            this.setState({ submitted: true });
            formData = {
                departmentName: this.state.departmentName.trim(),
                departmentDescription: this.state.departmentDescription.trim(),
                type: "Department Type",
            };
            // console.log(formData)

            AppAPI.adminVendorCreateCategoryType
                .post(null, formData)
                .then((resp) => {
                    this.setState({
                        code: resp.status,
                        message: resp.message
                    })
                    this.openModal();
                    // console.log("Department type :: ", resp);
                    this.resetData();
                }).catch(e => {
                    this.setState({
                        errMessage: e.serverMessage
                    })
                    this.openModal();
                    console.error(e, "Error");
                })

        } else if (selectedValue === 'KYC Type') {
            this.setState({ submitted: true });
            formData = {
                kycTypeName: this.state.kycTypeName.trim(),
                kycTypeDescription: this.state.kycTypeDescription.trim(),
                type: "KYC Type",
            };
            // console.log(formData)

            AppAPI.adminVendorCreateCategoryType
                .post(null, formData)
                .then((resp) => {
                    this.setState({
                        code: resp.status,
                        message: resp.message
                    })
                    this.openModal();
                    // console.log("KYC type :: ", resp);
                    this.resetData();
                }).catch(e => {
                    this.setState({
                        errMessage: e.serverMessage
                    })
                    this.openModal();
                    console.error(e, "Error");
                })

        } else if (selectedValue === 'Service Type') {
            this.setState({ submitted: true });
            formData = {
                serviceName: this.state.serviceName.trim(),
                serviceDescription: this.state.serviceDescription.trim(),
                type: "Service Type",
            };
            // console.log(formData)

            AppAPI.adminVendorCreateCategoryType
                .post(null, formData)
                .then((resp) => {
                    this.setState({
                        code: resp.status,
                        message: resp.message
                    })
                    this.openModal();
                    // console.log("Service type :: ", resp);
                    this.resetData();
                }).catch(e => {
                    this.setState({
                        errMessage: e.serverMessage
                    })
                    this.openModal();
                    console.error(e, "Error");
                })

        } else if (selectedValue === 'Service Cost Type') {
            this.setState({ submitted: true });
            formData = {
                serviceCostTypeName: this.state.serviceCostTypeName.trim(),
                serviceCostTypeDescription: this.state.serviceCostTypeDescription.trim(),
                type: "Service Cost Type",
            };
            // console.log(formData)

            AppAPI.adminVendorCreateCategoryType
                .post(null, formData)
                .then((resp) => {
                    this.setState({
                        code: resp.status,
                        message: resp.message
                    })
                    this.openModal();
                    // console.log("Service Cost type :: ", resp);
                    this.resetData();
                }).catch(e => {
                    this.setState({
                        errMessage: e.serverMessage
                    })
                    this.openModal();
                    console.error(e, "Error");
                })

        } else if (selectedValue === 'Service Plan Type') {
            this.setState({ submitted: true });
            formData = {
                servicePlanTypeName: this.state.servicePlanTypeName.trim(),
                servicePlanTypeDescription: this.state.servicePlanTypeDescription.trim(),
                type: "Service Plan Type",
            };
            // console.log(formData)

            AppAPI.adminVendorCreateCategoryType
                .post(null, formData)
                .then((resp) => {
                    this.setState({
                        code: resp.status,
                        message: resp.message
                    })
                    this.openModal();
                    // console.log("Service Plan type :: ", resp);
                    this.resetData();
                }).catch(e => {
                    this.setState({
                        errMessage: e.serverMessage
                    })
                    this.openModal();
                    console.error(e, "Error");
                })

        } else if (selectedValue === 'Vendor Type') {
            this.setState({ submitted: true });
            formData = {
                vendorTypeName: this.state.vendorTypeName.trim(),
                vendorTypeDescription: this.state.vendorTypeDescription.trim(),
                type: "Vendor Type",
            };
            // console.log(formData)

            AppAPI.adminVendorCreateCategoryType
                .post(null, formData)
                .then((resp) => {
                    this.setState({
                        code: resp.status,
                        message: resp.message
                    })
                    this.openModal();
                    // console.log("Vendor Type :: ", resp);
                    this.resetData();
                }).catch(e => {
                    this.setState({
                        errMessage: e.serverMessage
                    })
                    this.openModal();
                    console.error(e, "Error");
                })

        } else {
            alert('All fields are required!');
        }
    }

    // Method to handle selection of 'Register Vendor'
    handleCheckedCreate(event) {
        this.setState({ selectedValue: event.target.value });
    }

    render() {
        const { classes } = this.props;
        const { submitted, selectedValue } = this.state;

        return (
            <div>
                <p className="titleCard">Menu / Vendor Master</p>
                <div className="d-flex justify-content-center">
                    <Paper style={{ width: '100%' }}>
                        <h6 className="customHeader">Vendor Master</h6>
                        <div className="container p-4">
                            <div className={classes.root}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Radio
                                            checked={this.state.selectedValue === 'Category Type'}
                                            onChange={this.handleCheckedCreate}
                                            value="Category Type"
                                            name="radio-button-demo"
                                            classes={{
                                                root: classes.radio,
                                            }}
                                        />
                                        <label>Category Type</label>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Radio
                                            checked={this.state.selectedValue === 'Department Type'}
                                            onChange={this.handleCheckedCreate}
                                            value="Department Type"
                                            name="radio-button-demo"
                                            classes={{
                                                root: classes.radio,
                                            }}
                                        />
                                        <label>Department Type</label>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Radio
                                            checked={this.state.selectedValue === 'KYC Type'}
                                            onChange={this.handleCheckedCreate}
                                            value="KYC Type"
                                            name="radio-button-demo"
                                            classes={{
                                                root: classes.radio,
                                            }}
                                        />
                                        <label>KYC Type</label>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Radio
                                            checked={this.state.selectedValue === 'Service Type'}
                                            onChange={this.handleCheckedCreate}
                                            value="Service Type"
                                            name="radio-button-demo"
                                            classes={{
                                                root: classes.radio,
                                            }}
                                        />
                                        <label>Service Type</label>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Radio
                                            checked={this.state.selectedValue === 'Service Cost Type'}
                                            onChange={this.handleCheckedCreate}
                                            value="Service Cost Type"
                                            name="radio-button-demo"
                                            classes={{
                                                root: classes.radio,
                                            }}
                                        />
                                        <label>Service Cost Type</label>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Radio
                                            checked={this.state.selectedValue === 'Service Plan Type'}
                                            onChange={this.handleCheckedCreate}
                                            value="Service Plan Type"
                                            name="radio-button-demo"
                                            classes={{
                                                root: classes.radio,
                                            }}
                                        />
                                        <label>Service Plan Type</label>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Radio
                                            checked={this.state.selectedValue === 'Vendor Type'}
                                            onChange={this.handleCheckedCreate}
                                            value="Vendor Type"
                                            name="radio-button-demo"
                                            classes={{
                                                root: classes.radio,
                                            }}
                                        />
                                        <label>Vendor Type</label>
                                    </Grid>
                                </Grid>
                            </div>

                            {/* Category Type */}

                            {selectedValue === 'Category Type' && (
                                <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                                    <div className={classes.root}>
                                        <Grid container spacing={24}>
                                            <Grid item xs={12} sm={6}>
                                                <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    name="categoryName"
                                                    label="Category Name"
                                                    value={this.state.categoryName}
                                                    onChange={this.onInputChange}
                                                    validators={['required']}
                                                    errorMessages={['Category Name is required']}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    name="categoryDescription"
                                                    label="Category Description"
                                                    value={this.state.categoryDescription}
                                                    onChange={this.onInputChange}
                                                />
                                            </Grid>
                                        </Grid>
                                    </div>

                                    <div className="d-flex justify-content-start pt-4">
                                        <Typography variant="caption" gutterBottom>
                                            Note: All Fields are Mandatory
                                        </Typography>
                                    </div>

                                    <div className="d-flex justify-content-center pt-4">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            disabled={submitted}
                                        >
                                            {submitted ? 'Your form is submitting' : 'Submit'}
                                        </Button>
                                    </div>
                                </ValidatorForm>
                            )
                            }

                            {/* Department Type */}

                            {selectedValue === 'Department Type' && (
                                <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                                    <div className={classes.root}>
                                        <Grid container spacing={24}>
                                            <Grid item xs={12} sm={6}>
                                                <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    name="departmentName"
                                                    label="Department Name"
                                                    value={this.state.departmentName}
                                                    onChange={this.onInputChange}
                                                    validators={['required']}
                                                    errorMessages={['Department Name is required']}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    name="departmentDescription"
                                                    label="Department Description"
                                                    value={this.state.departmentDescription}
                                                    onChange={this.onInputChange}
                                                />
                                            </Grid>
                                        </Grid>
                                    </div>

                                    <div className="d-flex justify-content-start pt-4">
                                        <Typography variant="caption" gutterBottom>
                                            Note: All Fields are Mandatory
                                        </Typography>
                                    </div>

                                    <div className="d-flex justify-content-center pt-4">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            disabled={submitted}
                                        >
                                            {submitted ? 'Your form is submitting' : 'Submit'}
                                        </Button>
                                    </div>
                                </ValidatorForm>
                            )}

                            {/* KYC Type */}

                            {selectedValue === 'KYC Type' && (
                                <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                                    <div className={classes.root}>
                                        <Grid container spacing={24}>
                                            <Grid item xs={12} sm={6}>
                                                <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    name="kycTypeName"
                                                    label="KYC Type Name"
                                                    value={this.state.kycTypeName}
                                                    onChange={this.onInputChange}
                                                    validators={['required']}
                                                    errorMessages={['KYC Type Name is required']}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    name="kycTypeDescription"
                                                    label="KYC Type Description"
                                                    value={this.state.kycTypeDescription}
                                                    onChange={this.onInputChange}
                                                />
                                            </Grid>
                                        </Grid>
                                    </div>

                                    <div className="d-flex justify-content-start pt-4">
                                        <Typography variant="caption" gutterBottom>
                                            Note: All Fields are Mandatory
                                        </Typography>
                                    </div>

                                    <div className="d-flex justify-content-center pt-4">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            disabled={submitted}
                                        >
                                            {submitted ? 'Your form is submitting' : 'Submit'}
                                        </Button>
                                    </div>
                                </ValidatorForm>
                            )}

                            {/* Service Type */}

                            {selectedValue === 'Service Type' && (
                                <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                                    <div className={classes.root}>
                                        <Grid container spacing={24}>
                                            <Grid item xs={12} sm={6}>
                                                <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    name="serviceName"
                                                    label="Service Name"
                                                    value={this.state.serviceName}
                                                    onChange={this.onInputChange}
                                                    validators={['required']}
                                                    errorMessages={['Service Name is required']}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    name="serviceDescription"
                                                    label="Service Description"
                                                    value={this.state.serviceDescription}
                                                    onChange={this.onInputChange}
                                                />
                                            </Grid>
                                        </Grid>
                                    </div>

                                    <div className="d-flex justify-content-start pt-4">
                                        <Typography variant="caption" gutterBottom>
                                            Note: All Fields are Mandatory
                                        </Typography>
                                    </div>

                                    <div className="d-flex justify-content-center pt-4">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            disabled={submitted}
                                        >
                                            {submitted ? 'Your form is submitting' : 'Submit'}
                                        </Button>
                                    </div>
                                </ValidatorForm>
                            )}

                            {/* Service Cost Type */}

                            {selectedValue === 'Service Cost Type' && (
                                <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                                    <div className={classes.root}>
                                        <Grid container spacing={24}>
                                            <Grid item xs={12} sm={6}>
                                                <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    name="serviceCostTypeName"
                                                    label="Service Cost Type Name"
                                                    value={this.state.serviceCostTypeName}
                                                    onChange={this.onInputChange}
                                                    validators={['required']}
                                                    errorMessages={['Service Cost Type Name is required']}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    name="serviceCostTypeDescription"
                                                    label="Service Cost Type Description"
                                                    value={this.state.serviceCostTypeDescription}
                                                    onChange={this.onInputChange}
                                                />
                                            </Grid>
                                        </Grid>
                                    </div>

                                    <div className="d-flex justify-content-start pt-4">
                                        <Typography variant="caption" gutterBottom>
                                            Note: All Fields are Mandatory
                                        </Typography>
                                    </div>

                                    <div className="d-flex justify-content-center pt-4">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            disabled={submitted}
                                        >
                                            {submitted ? 'Your form is submitting' : 'Submit'}
                                        </Button>
                                    </div>
                                </ValidatorForm>
                            )}

                            {/* Service Plan Type */}

                            {selectedValue === 'Service Plan Type' && (
                                <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                                    <div className={classes.root}>
                                        <Grid container spacing={24}>
                                            <Grid item xs={12} sm={6}>
                                                <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    name="servicePlanTypeName"
                                                    label="Service Plan Type Name"
                                                    value={this.state.servicePlanTypeName}
                                                    onChange={this.onInputChange}
                                                    validators={['required']}
                                                    errorMessages={['Service Plan Type Name is required']}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    name="servicePlanTypeDescription"
                                                    label="Service Plan Type Description"
                                                    value={this.state.servicePlanTypeDescription}
                                                    onChange={this.onInputChange}
                                                />
                                            </Grid>
                                        </Grid>
                                    </div>

                                    <div className="d-flex justify-content-start pt-4">
                                        <Typography variant="caption" gutterBottom>
                                            Note: All Fields are Mandatory
                                        </Typography>
                                    </div>

                                    <div className="d-flex justify-content-center pt-4">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            disabled={submitted}
                                        >
                                            {submitted ? 'Your form is submitting' : 'Submit'}
                                        </Button>
                                    </div>
                                </ValidatorForm>
                            )}

                            {/* Vendor Type */}

                            {selectedValue === 'Vendor Type' && (
                                <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                                    <div className={classes.root}>
                                        <Grid container spacing={24}>
                                            <Grid item xs={12} sm={6}>
                                                <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    name="vendorTypeName"
                                                    label="Vendor Type Name"
                                                    value={this.state.vendorTypeName}
                                                    onChange={this.onInputChange}
                                                    validators={['required']}
                                                    errorMessages={['Vendor Type Name is required']}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <TextValidator
                                                    fullWidth
                                                    margin="normal"
                                                    name="vendorTypeDescription"
                                                    label="Vendor Type Description"
                                                    value={this.state.vendorTypeDescription}
                                                    onChange={this.onInputChange}
                                                />
                                            </Grid>
                                        </Grid>
                                    </div>

                                    <div className="d-flex justify-content-start pt-4">
                                        <Typography variant="caption" gutterBottom>
                                            Note: All Fields are Mandatory
                                        </Typography>
                                    </div>

                                    <div className="d-flex justify-content-center pt-4">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            disabled={submitted}
                                        >
                                            {submitted ? 'Your form is submitting' : 'Submit'}
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
                                                    className="img-fluied d-flex justify-content-center tick" />
                                                :
                                                <img src="/assets/icons/tick.svg" alt="Success"
                                                    className="img-fluied d-flex justify-content-center tick" />
                                        }
                                        {this.state.message}: {this.state.status}
                                    </DialogContentText>
                                    :
                                    <DialogContentText id="alert-dialog-description">
                                        <img src="/assets/icons/notification.svg" alt="No Internet"
                                            className="img-fluied d-flex justify-content-center tick" />
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
export default withStyles(styles)(VendorMaster);





// if (this.state.selectedValue === "Category Type") {
//     this.setState({ submitted: true });

//     const formData = {
//         categoryName: categoryName,
//         categoryDescription: categoryDescription,
//     }
//     console.log(formData);

//     // Reset form fields after submission
//     this.setState({
//         categoryName: '',
//         categoryDescription: '',
//     });
// } else {
//     alert('All fields are required!');
// }

// if (this.state.selectedValue === "Department Type") {
//     this.setState({ submitted: true });

//     const formData1 = {
//         departmentName: departmentName,
//         departmentDescription: departmentDescription,
//     }
//     console.log(formData1);

//     // Reset form fields after submission
//     this.setState({
//         departmentName: '',
//         departmentDescription: '',
//     });


// } else {
//     alert('All fields are required!');
// }

// // if (Object.values(inputs).every(input => input) ) {
// //     this.setState({ submitted: true });

// //     console.log('Input values: ', inputs);

// //     // const formData = {
// //     //   ...inputs,
// //     // };
// //     const formData = {
// //         categoryName: inputs.categoryName,
// //         categoryDescription: inputs.categoryDescription,
// //     }

// //     const formData1 = {
// //         departmentName: inputs.departmentName,
// //         departmentDescription: inputs.departmentDescription,
// //     }

// //     const formData2 = {
// //         kycTypeName: inputs.kycTypeName,
// //         kycTypeDescription: inputs.kycTypeDescription,
// //     }

// //     const formData3 = {
// //         serviceName: inputs.serviceName,
// //         serviceDescription: inputs.serviceDescription,
// //     }

// //     const formData4 = {
// //         servicePlanTypeName: inputs.servicePlanTypeName,
// //         servicePlanTypeDescription: inputs.servicePlanTypeDescription,
// //     }


// //     console.log('Form Data1 Submitted: ', formData);
// //     console.log('Form Data2 Submitted: ', formData1);
// //     console.log('Form Data3 Submitted: ', formData2);
// //     console.log('Form Data4 Submitted: ', formData3);
// //     console.log('Form Data5 Submitted: ', formData4);


// //     // Reset form fields after submission
// //     this.setState({
// //         categoryName: '',
// //         categoryDescription: '',
// //         departmentName: '',
// //         departmentDescription: '',
// //         kycTypeName:'',
// //         kycTypeDescription:'',
// //         serviceName:'',
// //         serviceDescription:'',
// //         servicePlanTypeName:'',
// //         servicePlanTypeDescription:'',
// //     });
// // } else {
// //     alert('All fields are required!');
// // }



// import React, { Component } from 'react';
// import { withStyles } from '@material-ui/core/styles';
// import {
//   Paper,
//   Grid,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   OutlinedInput,
//   Radio,
//   Typography,
//   Button,
// } from '@material-ui/core';
// import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

// import Progress from '../../../Components/Loading/Progress';
// import AppAPI from '../../../API';

// const styles = theme => ({
//     root: {
//         display: 'flex',
//         flexWrap: 'wrap'
//     },
//     radio: {
//         color: "#332c6fba",
//     },
//     button: {
//         margin: theme.spacing.unit,
//     },
//     label: {
//         textTransform: 'capitalize',
//         fontWeight: 600
//     },
//     cssUnderline: {
//         color: "#dc3545c9",
//     },
// });

// class VendorMaster extends Component {

//     render() {
//         return (
//             <div>
//                 <p className="titleCard">Menu / Vendor Master</p>
//                 <div className="d-flex justify-content-center">
//                     <img src="/assets/images/coming-soon.png" alt="Coming Soon"
//                         className="img-fluied d-flex justify-content-center" style={{ height: "250px", width: "200px", paddingTop: "10vh" }} />
//                 </div>
//             </div>
//         );
//     }
// }
// export default withStyles(styles)(VendorMaster);