import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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

let auth;
let adminUser;
// if(!window.localStorage.getItem("auth")){
// 	adminUser = "";
// } else{
// 	auth = JSON.parse(window.localStorage.getItem({"auth":""}));
//     adminUser = auth.user.user_id;
// }
// console.log(auth.user.user_id)

let resetFormFields;

class VendorServices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Input fields
            labelWidth: 0,

            vendorId: '',
            vendorserviceid: '',
            vname: '',
            categorytype: '',
            departmenttype: '',
            servicetype: '',
            serviceplantype: '',
            servicecosttype: '',
            servicebasiccost: '',

            vendortypeid: '',
            adminid: '',
            vendorServiceTaxId: [],

            taxFields: [{ taxName: '', percentage: '', totalValue: '' }],

            // Other states
            selectedValue: 'Create Service', // Default to 'Create Service'
            message: '',
            submitted: false,
            code: '',
            open: false,
            alert: false,
            alertMessage: "",

            Data1: [],
            Data2: [],
            Data3: [],
            Data4: [],
            Data5: [],

            vendors: [],
            vendorServices: [],
            vendorServicesTax: [],
        };

        resetFormFields = () => {
            this.setState({
                vendorid: '',
                vendorserviceid:'',
                vname: '',
                categorytype: '',
                departmenttype: '',
                servicetype: '',
                serviceplantype: '',
                servicecosttype: '',
                servicebasiccost: '',
                taxFields: [{ taxName: '', percentage: '', totalValue: '' }],
            })
        }

        this.handleCheckedCreate = this.handleCheckedCreate.bind(this);
        this.handleCheckedUpdate = this.handleCheckedUpdate.bind(this);

        this.handleTaxChange = this.handleTaxChange.bind(this);
        this.handleServiceBasicCostChange = this.handleServiceBasicCostChange.bind(this);

        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.fetchTypes = this.fetchTypes.bind(this);
        this.fetchServices = this.fetchServices.bind(this);
        this.fetchVendors = this.fetchVendors.bind(this);
        this.fillVendorDetails = this.fillVendorDetails.bind(this);
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

    fetchTypes() {
        AppAPI.adminGetTypes.get()
            .then((response) => {
                // console.log("Get Types :: ", response.getTypes);

                var processedResult = response.getTypes.map((row) => {
                    if (row.categoryTypeName) {
                        this.setState(prevState => ({
                            Data1: [...prevState.Data1, row.categoryTypeName]  // Append to Data1 array
                        }));
                        // return { categoryTypeName: row.categoryTypeName };
                    } else if (row.departmentTypeName) {
                        this.setState(prevState => ({
                            Data2: [...prevState.Data2, row.departmentTypeName]  // Append to Data2 array
                        }));
                        // return { departmentTypeName: row.departmentTypeName };
                    } else if (row.serviceTypeName) {
                        this.setState(prevState => ({
                            Data3: [...prevState.Data3, row.serviceTypeName]  // Append to Data3 array
                        }));
                        // return { serviceTypeName: row.serviceTypeName };
                    } else if (row.servicePlanTypeName) {
                        this.setState(prevState => ({
                            Data4: [...prevState.Data4, row.servicePlanTypeName]  // Append to Data4 array
                        }));
                        // return { serviceCostTypeName: row.serviceCostTypeName };
                    } else if (row.serviceCostTypeName) {
                        this.setState(prevState => ({
                            Data5: [...prevState.Data5, row.serviceCostTypeName]  // Append to Data4 array
                        }));
                        // return { serviceCostTypeName: row.serviceCostTypeName };
                    } else if (row.vendorTypeName) {
                        console.log({ vendorTypeName: row.vendorTypeName })
                        // return { vendorTypeName: row.vendorTypeName };
                    }
                });
                // this.setState({ vendors: response.vendors });
            }).catch((error) => {
                console.error("Error fetching vendors:", error);
            });
    }

    fetchVendors() {
        AppAPI.adminGetVendors.get()
            .then((response) => {
                this.setState({ vendors: response.vendors });
                console.log("Vendors : ", response.vendors);
            }).catch((error) => {
                console.error("Error fetching vendors:", error);
            });
    }

    fetchServices() {
        AppAPI.adminVendorService.get()
            .then((response) => {
                this.setState({ vendorServices: response.service.serviceData, vendorServicesTax: response.service.taxData });
                // console.log("Vendor services : ", this.state.vendorServices);
                // console.log("Vendor services Tax : ", this.state.vendorServicesTax);
            }).catch((error) => {
                console.error("Error fetching vendors:", error);
            });
    }

    // Fetch vendors from backend to populate dropdown/select
    componentDidMount() {
        this.setState({
            labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
        });

        this.fetchTypes();
        this.fetchServices();
        this.fetchVendors();

        if (!window.localStorage.getItem("auth")) {
            adminUser = "";
        } else {
            auth = JSON.parse(window.localStorage.getItem("auth"));
            adminUser = auth.user.user_id;
        }
    }


    fillVendorDetails(event) {
        const vendorServiceID = event.target.value;
        // console.log("vendorServiceID :: ",vendorServiceID)

        const selectedServiceVendor = this.state.vendorServices.find(vendor => vendor.vendorServiceId === parseInt(vendorServiceID));
        console.log("findVendorService :: ", selectedServiceVendor);

        const selectedServiceVendorTax = this.state.vendorServicesTax.filter(vendor => vendor.vendorServiceIdtax === parseInt(vendorServiceID));
        console.log("findVendorServiceTax :: ", selectedServiceVendorTax);

        if (selectedServiceVendorTax && selectedServiceVendor) {
            this.setState({
                vendorServiceID: selectedServiceVendor.vendorServiceId,
                vname: selectedServiceVendor.vendorName,
                categorytype: selectedServiceVendor.vendorCategoryId,
                departmenttype: selectedServiceVendor.departmentId,
                servicetype: selectedServiceVendor.serviceTypeId,
                servicecosttype: selectedServiceVendor.serviceCostTypeId,
                servicebasiccost: selectedServiceVendor.serviceBaseCost,
                vendortypeid: selectedServiceVendor.vendorTypeId,
                adminid: selectedServiceVendor.adminId,
            })
            const servicetaxfields = selectedServiceVendorTax.map((field) => {
                this.setState(prevState => ({
                    taxFields: [...prevState.taxFields, { taxName: field.serviceTaxName, percentage: field.serviceTaxPercentage, totalValue: field.serviceTaxCost }],
                    vendorServiceTaxId: [...prevState.vendorServiceTaxId, field.vendorServiceTaxId]
                }))
            })
        } else {
            resetFormFields();
        }

    }

    fillVendorName(event) {
        const vendorid = event.target.value;

        const selectedVendor = this.state.vendors.find(vendor => vendor.vendorId === parseInt(vendorid));
        console.log("findVendor :: ", selectedVendor);

        if (selectedVendor) {
            this.setState({
                vname: selectedVendor.vendorname,
            })
        }
        else {
            this.setState({
                vname: "",
            })
        }
    }

    // Method to handle input field changes
    onInputChange(event) {
        const { name, value } = event.target;
        this.setState({ [event.target.name]: event.target.value });
        if (name === 'vendorserviceid') {
            this.fillVendorDetails(event);
        }
        else if (name === 'vendorId') {
            this.fillVendorName(event);
        }
    }

    // Handle the change in the input fields
    handleTaxChange(index, event) {
        const { name, value } = event.target;
        const taxFields = [...this.state.taxFields];
        taxFields[index][name] = value;

        if (name === 'percentage') {
            const percentageValue = parseFloat(value) || 0;
            const basicCost = parseFloat(this.state.servicebasiccost) || 0;
            const totalValue = (basicCost * percentageValue) / 100;
            taxFields[index].totalValue = totalValue.toFixed(2);
        }

        this.setState({ taxFields });
    }

    // Handle changes to the servicebasiccost input field
    handleServiceBasicCostChange(event) {
        const servicebasiccost = parseFloat(event.target.value) || 0;

        // Recalculate totalValue for each tax field when servicebasiccost is changed
        const taxFields = this.state.taxFields.map((field) => {
            const percentageValue = parseFloat(field.percentage) || 0;
            const totalValue = (servicebasiccost * percentageValue) / 100;
            return {
                ...field,
                totalValue: totalValue.toFixed(2),
            };
        });

        this.setState({ servicebasiccost, taxFields });
    }

    // Add a new tax field row
    addTaxField = () => {
        this.setState((prevState) => ({
            taxFields: [...prevState.taxFields, { taxName: '', percentage: '', totalValue: '' }],
        }));
    };

    // Method to handle form submission
    onSubmit(event) {
        event.preventDefault();

        const {
            vendorserviceid,
            adminid,
            vendorServiceTaxId,
            vname,
            categorytype,
            departmenttype,
            servicetype,
            servicecosttype,
            serviceplantype,
            servicebasiccost,
            vendortypeid,
            taxFields,
        } = this.state;

        const servicetaxFields = taxFields.filter(field => field.taxName && field.percentage);


        const inputs = {
            vname: vname,
            categorytype: categorytype,
            departmenttype: departmenttype,
            servicetype: servicetype,
            servicecosttype: servicecosttype,
            serviceplantype: serviceplantype,
            servicebasiccost: servicebasiccost,
            taxFields: servicetaxFields,
        };
        console.log(inputs)
        let formData;

        if (this.state.selectedValue === 'Create Service') {
            this.setState({ submitted: true });

            formData = {
                vname: inputs.vname,
                categorytype: inputs.categorytype,
                departmenttype: inputs.departmenttype,
                servicetype: inputs.servicetype,
                servicecosttype: inputs.servicecosttype,
                serviceplantype: inputs.serviceplantype,
                servicebasiccost: inputs.servicebasiccost,
                taxFields: inputs.taxFields,
                adminUser: adminUser,
            }
            console.log('Form Data Submitted: ', formData);

            AppAPI.adminVendorService.post(null, formData)
                .then((resp) => {
                    this.openModal();
                    this.setState({
                        code: resp.status,
                        message: resp.message
                    })
                    console.log('Vendor Service:', resp);
                    this.setState({ message: resp.message, submitted: false });
                    resetFormFields();
                })
                .catch((error) => {
                    this.openModal();
                    this.setState({
                        errMessage: error.serverMessage
                    })
                    console.error('Error Create Vendor Service:', error);
                    this.setState({ message: error.message, submitted: false });
                    alert("Vendor name not found");
                });

            // Reset form fields after submission
            this.setState({
                vendorId: '',
                vname: '',
                categorytype: '',
                departmenttype: '',
                servicetype: '',
                servicecosttype: '',
                serviceplantype: '',
                servicebasiccost: '',
                taxFields: [{ taxName: '', percentage: '', totalValue: '' },],
            });
        } else if (this.state.selectedValue === 'Update Service') {
            this.setState({ submitted: true });

            formData = {
                vendorserviceid: vendorserviceid,
                adminid: adminid,
                vendorServiceTaxId: vendorServiceTaxId,
                vname: vname,
                categorytype: categorytype,
                departmenttype: departmenttype,
                servicetype: servicetype,
                servicecosttype: servicecosttype,
                serviceplantype: serviceplantype,
                servicebasiccost: servicebasiccost,
                vendortypeid: vendortypeid,
                taxFields: servicetaxFields,
            }
            console.log("Update details :: ", formData)

            AppAPI.adminVendorUpdateService.put(vendorserviceid, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((resp) => {
                    this.openModal();
                    this.setState({
                        code: resp.status,
                        message: resp.message
                    })
                    console.log('Vendor Service:', resp);
                    this.setState({ message: resp.message, submitted: false });
                    resetFormFields();
                })
                .catch((error) => {
                    this.openModal();
                    this.setState({
                        errMessage: error.serverMessage
                    })
                    console.error('Error Create Vendor Service:', error);
                    this.setState({ message: error.message, submitted: false });
                });
        } else {
            alert('All fields are required!');
        }
    }

    // Method to handle selection of 'Register Vendor'
    handleCheckedCreate() {
        this.setState({ selectedValue: 'Create Service' });
        resetFormFields();
    }

    // Method to handle selection of 'Update Vendor'
    handleCheckedUpdate() {
        this.setState({ selectedValue: 'Update Service' });
        resetFormFields();
    }

    render() {
        const { classes } = this.props;
        const { submitted, selectedValue, taxFields } = this.state;

        return (
            <div>
                <p className="titleCard">Menu / Vendor Services</p>
                <div className="d-flex justify-content-center">
                    <Paper style={{ width: '80%' }}>
                        <h6 className="customHeader">Vendor Services</h6>
                        <div className="container p-4">
                            <div className={classes.root}>
                                <Grid container spacing={24}>
                                    <Grid item xs={12} sm={6}>
                                        <Radio
                                            checked={this.state.selectedValue === 'Create Service'}
                                            onChange={this.handleCheckedCreate}
                                            value="Create Service"
                                            name="radio-button-demo"
                                            classes={{
                                                root: classes.radio,
                                            }}
                                        />
                                        <label>Create Service</label>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Radio
                                            checked={this.state.selectedValue === 'Update Service'}
                                            onChange={this.handleCheckedUpdate}
                                            value="Update Service"
                                            name="radio-button-demo"
                                            classes={{
                                                root: classes.radio,
                                            }}
                                        />
                                        <label>Update Service</label>
                                    </Grid>
                                </Grid>
                            </div>

                            {selectedValue === 'Create Service' ? (
                                <>
                                    <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                                        <div className={classes.root}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <TextValidator
                                                        fullWidth
                                                        margin="normal"
                                                        name="vendorId"
                                                        label="Vendor ID"
                                                        value={this.state.vendorId}
                                                        onChange={this.onInputChange}
                                                        validators={['required']}
                                                        errorMessages={['Vendor ID is required']}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </ValidatorForm>

                                    <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                                        <div className={classes.root}>
                                            <Grid container spacing={24}>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <TextValidator
                                                        fullWidth
                                                        margin="normal"
                                                        name="vname"
                                                        label="Name"
                                                        value={this.state.vname}
                                                        onChange={this.onInputChange}
                                                        validators={['required']}
                                                        errorMessages={['Name is required']}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6} md={4}>
                                                    <FormControl
                                                        style={{ marginTop: '1rem' }}
                                                        fullWidth
                                                        variant="outlined"
                                                        className="form"
                                                    >
                                                        <InputLabel
                                                            ref={ref => {
                                                                this.InputLabelRef = ref;
                                                            }}
                                                            htmlFor="category-type"
                                                        >Category Type</InputLabel>
                                                        <Select
                                                            value={this.state.categorytype}
                                                            onChange={this.onInputChange}
                                                            input={
                                                                <OutlinedInput
                                                                    labelWidth={this.state.labelWidth}
                                                                    name="categorytype"
                                                                    id="category-type"
                                                                />
                                                            }
                                                        >
                                                            {this.state.Data1.map((item, index) => (
                                                                <MenuItem key={index} value={index + 1}>
                                                                    {item}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} sm={6} md={4}>
                                                    <FormControl
                                                        style={{ marginTop: '1rem' }}
                                                        fullWidth
                                                        variant="outlined"
                                                        className="form"
                                                    >
                                                        <InputLabel
                                                            ref={ref => {
                                                                this.InputLabelRef = ref;
                                                            }}
                                                            htmlFor="department-type"
                                                        >Department Type</InputLabel>
                                                        <Select
                                                            value={this.state.departmenttype}
                                                            onChange={this.onInputChange}
                                                            input={
                                                                <OutlinedInput
                                                                    labelWidth={this.state.labelWidth}
                                                                    name="departmenttype"
                                                                    id="department-type"
                                                                />
                                                            }
                                                        >
                                                            {this.state.Data2.map((item, index) => (
                                                                <MenuItem key={index} value={index + 1}>
                                                                    {item}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </div>

                                        <div className={classes.root}>
                                            <Grid container spacing={24}>
                                                <Grid item xs={12} sm={6}>
                                                    <FormControl
                                                        style={{ marginTop: '1rem' }}
                                                        fullWidth
                                                        variant="outlined"
                                                        className="form"
                                                    >
                                                        <InputLabel
                                                            ref={ref => {
                                                                this.InputLabelRef = ref;
                                                            }}
                                                            htmlFor="service-type"
                                                        >Service Type</InputLabel>
                                                        <Select
                                                            value={this.state.servicetype}
                                                            onChange={this.onInputChange}
                                                            input={
                                                                <OutlinedInput
                                                                    labelWidth={this.state.labelWidth}
                                                                    name="servicetype"
                                                                    id="service-type"
                                                                />
                                                            }
                                                        >
                                                            {this.state.Data3.map((item, index) => (
                                                                <MenuItem key={index} value={index + 1}>
                                                                    {item}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <FormControl
                                                        style={{ marginTop: '1rem' }}
                                                        fullWidth
                                                        variant="outlined"
                                                        className="form"
                                                    >
                                                        <InputLabel
                                                            ref={ref => {
                                                                this.InputLabelRef = ref;
                                                            }}
                                                            htmlFor="service-plan-type"
                                                        >Service Plan Type</InputLabel>
                                                        <Select
                                                            value={this.state.serviceplantype}
                                                            onChange={this.onInputChange}
                                                            input={
                                                                <OutlinedInput
                                                                    labelWidth={this.state.labelWidth}
                                                                    name="serviceplantype"
                                                                    id="service-plan-type"
                                                                />
                                                            }
                                                        >
                                                            {this.state.Data4.map((item, index) => (
                                                                <MenuItem key={index} value={index + 1}>
                                                                    {item}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </div>

                                        <div className={classes.root}>
                                            <Grid container spacing={24}>
                                                <Grid item xs={12} sm={6}>
                                                    <FormControl
                                                        style={{ marginTop: '1rem' }}
                                                        fullWidth
                                                        variant="outlined"
                                                        className="form"
                                                    >
                                                        <InputLabel
                                                            ref={ref => {
                                                                this.InputLabelRef = ref;
                                                            }}
                                                            htmlFor="service-cost-type"
                                                        >Service Cost Type</InputLabel>
                                                        <Select
                                                            value={this.state.servicecosttype}
                                                            onChange={this.onInputChange}
                                                            input={
                                                                <OutlinedInput
                                                                    labelWidth={this.state.labelWidth}
                                                                    name="servicecosttype"
                                                                    id="service-cost-type"
                                                                />
                                                            }
                                                        >
                                                            {this.state.Data5.map((item, index) => (
                                                                <MenuItem key={index} value={index + 1}>
                                                                    {item}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <TextValidator
                                                        fullWidth
                                                        margin="normal"
                                                        name="servicebasiccost"
                                                        label="Service Basic Cost"
                                                        value={this.state.servicebasiccost}
                                                        onChange={(event) => this.handleServiceBasicCostChange(event)}
                                                        validators={['required']}
                                                        errorMessages={['Service Basic Cost is required']}
                                                        type="number"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>

                                        <div className={classes.root}>
                                            <Grid container spacing={24}>
                                                {this.state.taxFields.map((field, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <Grid item xs={12} sm={4} md={3}>
                                                                <TextValidator
                                                                    fullWidth
                                                                    margin="normal"
                                                                    label="Tax Name"
                                                                    name="taxName"
                                                                    value={field.taxName}
                                                                    onChange={(event) => this.handleTaxChange(index, event)}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={3}>
                                                                <TextValidator
                                                                    fullWidth
                                                                    margin="normal"
                                                                    label="Percentage"
                                                                    name="percentage"
                                                                    value={field.percentage}
                                                                    type="number"
                                                                    onChange={(event) => this.handleTaxChange(index, event)}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} md={4}>
                                                                <TextValidator
                                                                    fullWidth
                                                                    margin="normal"
                                                                    label="Total Value"
                                                                    name="totalValue"
                                                                    value={field.totalValue}
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                />
                                                            </Grid>
                                                            {index === this.state.taxFields.length - 1 && (
                                                                <Grid item xs={12} sm={12} md={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="secondary"
                                                                        onClick={() => this.addTaxField()}
                                                                    >
                                                                        +
                                                                    </Button>
                                                                </Grid>
                                                            )}
                                                        </React.Fragment>
                                                    );
                                                })}
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
                                </>
                            ) : (
                                <>
                                    <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                                        <div className={classes.root}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <TextValidator
                                                        fullWidth
                                                        margin="normal"
                                                        name="vendorserviceid"
                                                        label="Vendor Service ID"
                                                        value={this.state.vendorserviceid}
                                                        onChange={this.onInputChange}
                                                        validators={['required']}
                                                        errorMessages={['Vendor Service ID is required']}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </ValidatorForm>

                                    <ValidatorForm ref="form" onSubmit={this.onSubmit}>
                                        <div className={classes.root}>
                                            <Grid container spacing={24}>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <TextValidator
                                                        fullWidth
                                                        margin="normal"
                                                        name="vname"
                                                        label="Vendor Name"
                                                        value={this.state.vname}
                                                        onChange={this.onInputChange}
                                                        // validators={['required']}
                                                        errorMessages={['Vendor Name is required']}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6} md={4}>
                                                    <TextValidator
                                                        fullWidth
                                                        margin="normal"
                                                        name="categorytype"
                                                        label="Category Type Id"
                                                        value={this.state.categorytype}
                                                        onChange={this.onInputChange}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6} md={4}>
                                                    <TextValidator
                                                        fullWidth
                                                        margin="normal"
                                                        name="departmenttype"
                                                        label="Department Type Id"
                                                        value={this.state.departmenttype}
                                                        onChange={this.onInputChange}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>

                                        <div className={classes.root}>
                                            <Grid container spacing={24}>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <TextValidator
                                                        fullWidth
                                                        margin="normal"
                                                        name="servicetype"
                                                        label="Service Type Id"
                                                        value={this.state.servicetype}
                                                        onChange={this.onInputChange}
                                                    // validators={['required']}
                                                    // errorMessages={['Designation is required']}
                                                    />
                                                </Grid>

                                                {/* <Grid item xs={3}>
                                                    <TextValidator
                                                        fullWidth
                                                        margin="normal"
                                                        name="serviceplantype"
                                                        label="Service Plan Type Id"
                                                        value={this.state.serviceplantype}
                                                        onChange={this.onInputChange}
                                                    />
                                                </Grid> */}

                                                <Grid item xs={12} sm={6} md={4}>
                                                    <TextValidator
                                                        fullWidth
                                                        margin="normal"
                                                        name="servicecosttype"
                                                        label="Service Cost Type Id"
                                                        value={this.state.servicecosttype}
                                                        onChange={this.onInputChange}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6} md={4}>
                                                    <TextValidator
                                                        fullWidth
                                                        margin="normal"
                                                        name="servicebasiccost"
                                                        label="Service Basic Cost"
                                                        value={this.state.servicebasiccost}
                                                        onChange={(event) => this.handleServiceBasicCostChange(event)}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>

                                        <div className={classes.root}>
                                            <Grid container spacing={24}>
                                                {this.state.taxFields
                                                    // .filter(field => field.taxName && field.percentage && field.totalValue)
                                                    .map((field, index) => {
                                                        const shouldRenderField = field.taxName || field.percentage || index === this.state.taxFields.length - 1;
                                                        return shouldRenderField ? (
                                                            <React.Fragment key={index}>
                                                                <Grid item xs={12} sm={4} md={3}>
                                                                    <TextValidator
                                                                        fullWidth
                                                                        margin="normal"
                                                                        label="Tax Name"
                                                                        name="taxName"
                                                                        value={field.taxName}
                                                                        onChange={(event) => this.handleTaxChange(index, event)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={3}>
                                                                    <TextValidator
                                                                        fullWidth
                                                                        margin="normal"
                                                                        label="Percentage"
                                                                        name="percentage"
                                                                        value={field.percentage}
                                                                        type="number"
                                                                        onChange={(event) => this.handleTaxChange(index, event)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4} md={4}>
                                                                    <TextValidator
                                                                        fullWidth
                                                                        margin="normal"
                                                                        label="Total Value"
                                                                        name="totalValue"
                                                                        value={field.totalValue}
                                                                        InputProps={{
                                                                            readOnly: true,
                                                                        }}
                                                                    />
                                                                </Grid>
                                                                {index === this.state.taxFields.length - 1 && (
                                                                    <Grid item xs={12} sm={12} md={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                                                        <Button
                                                                            variant="contained"
                                                                            color="secondary"
                                                                            onClick={() => this.addTaxField()}
                                                                        >
                                                                            +
                                                                        </Button>
                                                                    </Grid>
                                                                )}
                                                            </React.Fragment>
                                                        ) : null;
                                                    })}
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
                                                {submitted ? 'Updating...' : 'Update Vendor'}
                                            </Button>
                                        </div>
                                    </ValidatorForm>
                                </>
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
export default withStyles(styles)(VendorServices);









{/* <ValidatorForm ref="form" onSubmit={this.onSubmit}>
    <div className={classes.root}>
        <Grid container spacing={24}>
            <Grid item xs={6}>
                <FormControl
                    style={{ marginTop: '1rem' }}
                    fullWidth
                    variant="outlined"
                    className="form"
                >
                    <InputLabel htmlFor="category-type">Category Type</InputLabel>
                    <Select
                        value={this.state.categorytype}
                        onChange={this.onInputChange}
                        input={
                            <OutlinedInput
                                labelWidth={this.state.labelWidth}
                                name="categorytype"
                                id="category-type"
                            />
                        }
                    >
                        {this.state.Data1.map((item, index) => (
                            <MenuItem key={index} value={index}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={6}>
                <FormControl
                    style={{ marginTop: '1rem' }}
                    fullWidth
                    variant="outlined"
                    className="form"
                >
                    <InputLabel htmlFor="department-type">Department Type</InputLabel>
                    <Select
                        value={this.state.departmenttype}
                        onChange={this.onInputChange}
                        input={
                            <OutlinedInput
                                labelWidth={this.state.labelWidth}
                                name="departmenttype"
                                id="department-type"
                            />
                        }
                    >
                        {this.state.Data2.map((item, index) => (
                            <MenuItem key={index} value={index}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    </div>

    <div className={classes.root}>
        <Grid container spacing={24}>
            <Grid item xs={6}>
                <FormControl
                    style={{ marginTop: '1rem' }}
                    fullWidth
                    variant="outlined"
                    className="form"
                >
                    <InputLabel htmlFor="service-type">Service Type</InputLabel>
                    <Select
                        value={this.state.servicetype}
                        onChange={this.onInputChange}
                        input={
                            <OutlinedInput
                                labelWidth={this.state.labelWidth}
                                name="servicetype"
                                id="service-type"
                            />
                        }
                    >
                        {this.state.Data3.map((item, index) => (
                            <MenuItem key={index} value={index}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={6}>
                <FormControl
                    style={{ marginTop: '1rem' }}
                    fullWidth
                    variant="outlined"
                    className="form"
                >
                    <InputLabel htmlFor="service-cost-type">Service Cost Type</InputLabel>
                    <Select
                        value={this.state.servicecosttype}
                        onChange={this.onInputChange}
                        input={
                            <OutlinedInput
                                labelWidth={this.state.labelWidth}
                                name="servicecosttype"
                                id="service-cost-type"
                            />
                        }
                    >
                        {this.state.Data3.map((item, index) => (
                            <MenuItem key={index} value={index}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    </div>

    <div className={classes.root}>
        <Grid container spacing={24}>
            <Grid item xs={6}>
                <TextValidator
                    fullWidth
                    margin="normal"
                    name="servicebasiccost"
                    label="Service Basic Cost"
                    value={this.state.servicebasiccost}
                    onChange={this.onInputChange}
                    validators={['required']}
                    errorMessages={['Service Basic Cost is required']}
                />
            </Grid>

            <Grid item xs={6}>
                <TextValidator
                    fullWidth
                    margin="normal"
                    name="Tax1"
                    label="Tax 1"
                    value={this.state.Tax1}
                    onChange={this.onInputChange}
                    validators={['required']}
                    errorMessages={['Tax 1 is required']}
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
                    name="Tax2"
                    label="Tax 2"
                    value={this.state.Tax2}
                    onChange={this.onInputChange}
                    validators={['required']}
                    errorMessages={['Tax 2 is required']}
                />
            </Grid>

            <Grid item xs={6}>
                <TextValidator
                    fullWidth
                    margin="normal"
                    name="Tax3"
                    label="Tax 3"
                    value={this.state.Tax3}
                    onChange={this.onInputChange}
                    validators={['required']}
                    errorMessages={['Tax 3 is required']}
                />
            </Grid>
        </Grid>
    </div>

    <div className="d-flex justify-content-start pt-4">
        <Typography variant="caption" gutterBottom>
            Note: All Fields are Mandatory Except Remarks
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
            {submitted ? 'Updating...' : 'Update Vendor'}
        </Button>
    </div>
</ValidatorForm> */}