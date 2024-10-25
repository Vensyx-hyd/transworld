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
  Dialog,
  DialogContent,
  DialogContentText,
  Typography,
  Button,
  Snackbar,
  IconButton
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
// 	auth = JSON.parse(window.localStorage.getItem("auth"));
// 	adminUser = auth.user.user_id;
// }
// console.log(auth.user.user_id)

const vendorsList = [
	[{"vendorId":1},{"vendorname":"Srinath"},{"location":"Hyderabad"},{"contactperson":"Sai"},{"designation":"Supervisor"},{"contactnumber":"9876543210"},{"contactemail":"sai@gmail.com"},{"kycTypeId":"2"},{"kycNumber":"KKYCS7459W"},{"selectedVendorType":"Individual"}],
	[{"vendorId":2},{"vendorname":"Ganesh"},{"location":"Mumbai"},{"contactperson":"Venky"},{"designation":"Asst.Supervisor"},{"contactnumber":"9547812360"},{"contactemail":"venky@gmail.com"},{"contactperson2":"Shiva"},{"designation2":"Jr Asst.Supervisor"},{"contactnumber2":"9632587410"},{"contactemail2":"shiva@gmail.com"},{"kycTypeId":"1"},{"kycNumber":"123456789000"},{"selectedVendorType":"Business"}],
	[{"vendorId":3},{"vendorname":"Srinath"},{"location":"Hyderabad"},{"contactperson":"Sai"},{"designation":"Supervisor"},{"contactnumber":"9876543210"},{"contactemail":"sai@gmail.com"},{"kycTypeId":"2"},{"kycNumber":"KKYCS7459W"},{"selectedVendorType":"Individual"}],
];

let selectedVendorType = ''; 
let findVendorType = '';
let resetFormFields;

class VendorRegistrations extends Component {
	constructor(props) {
		super(props);
		this.state = {
		// Input fields
		labelWidth: 0,

		vendorid:'',
		vendorId:'',
		vendorname: '',
		location: '',
		contactperson: '',
		designation: '',
		contactnumber: '',
		contactemail: '',
		kycNumber: '',

		contactperson2:'',
		designation2:'',
		contactnumber2:'',
		contactemail2:'',

		// Select fields
		kycTypeId: '',

		// files
		file: null,
		fileError: '',

		// Other states
		selectedVendorType: '',
		selectedValue: 'Register Vendor', // Default to 'Register Vendor'
		message: '',
		submitted: false,
		code:'',
		open: false,
		alert: false,
        alertMessage: "",
		

		vendors: '',  // To store the list of vendors for auto-fill on select
		Data1: ["Individual", "Business"],

		vendortype: '', // add vendortype to state
		};

		// Helper method to reset all form fields
		resetFormFields = () => {
			this.setState({
				vendorid:'',
				vendorId:"",
				vendorname: '',
				location: '',
				contactperson: '',
				designation: '',
				contactnumber: '',
				contactemail: '',
				kycNumber: '',
				contactperson2: '',
				designation2: '',
				contactnumber2: '',
				contactemail2: '',
				kycTypeId: '',
				vendortype: '',
				file:null,
			});
		}



		this.handleCheckedCreate = this.handleCheckedCreate.bind(this);
		this.handleCheckedUpdate = this.handleCheckedUpdate.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
		this.handleVendorTypeChange = this.handleVendorTypeChange.bind(this); // Separate handler for vendortype
		this.handleFileChange = this.handleFileChange.bind(this); // File handler
		this.onSubmit = this.onSubmit.bind(this);
		this.openModal = this.openModal.bind(this);        
        this.closeModal = this.closeModal.bind(this);
		

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

  	fetchVendors() {
		AppAPI.adminGetVendors.get()
		.then((response) => {
			// console.log("Vendors :: ",response.vendors);
			this.setState({ vendors: response.vendors });
		}).catch((error) => {
			console.error("Error fetching vendors:", error);
		});
		// this.setState({ vendors: vendorsList });
  	}

	// Fetch vendors from backend to populate dropdown/select
	componentDidMount() {
		this.setState({
            labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
        });
		this.fetchVendors();

		if(!window.localStorage.getItem("auth")){
			adminUser = "";
		} else{
			auth = JSON.parse(window.localStorage.getItem("auth"));
			adminUser = auth.user.user_id;
		}
	}

	// Method to auto-fill vendor details based on selected vendorId
	fillVendorDetails(event) {
		const vendorID = event.target.value;
		// console.log(vendorID)
		// console.log(typeof(vendorID));

		const selectedVendor = this.state.vendors.find(vendor => vendor.vendorId === parseInt(vendorID));
		// const selectedVendor = this.state.vendors.find((vendor) => {
		// 	// Each vendor is an array of objects, so we need to find the object with vendorId
		// 	const vendorIdObject = vendor.find(v => v.vendorId === parseInt(vendorID));
		// 	return vendorIdObject; // Return the matching vendor
		// });

		// const selectedVendor = this.state.vendors.find((vendor,index) => vendor[index].vendorId === parseInt(vendorID));
		// console.log("Vendor find By ID :: ",selectedVendor)

		if (selectedVendor) {

		// 	const vendorDetails = selectedVendor.reduce((acc, curr) => {
		// 		return { ...acc, ...curr }; // Flatten the vendor details into one object
		// 	}, {});
		if(selectedVendor.typeId === 5){
			findVendorType = "Individual";
			// this.setState({vendortype:"Individual"});
		} else if(selectedVendor.typeId === 6){
			findVendorType = "Business";
			// this.setState({vendortype:"Business"});
		}


		// console.log(findVendorType);
		// 	findVendorType = vendorDetails;
		// 	console.log("findVendorType :: ",findVendorType)
		// 	console.log("findVendorType :: ",findVendorType.selectedVendorType)

			this.setState({
				vendorId: vendorID,
				vendorname: selectedVendor.vendorname,
				location: selectedVendor.location,
				designation: selectedVendor.designation,
				contactperson: selectedVendor.contactperson,
				contactnumber: selectedVendor.contactnumber,
				contactemail: selectedVendor.contactemail,
				designation2: selectedVendor.designation2,
				contactperson2: selectedVendor.contactperson2,
				contactnumber2: selectedVendor.contactnumber2,
				contactemail2: selectedVendor.contactemail2,
				kycTypeId: selectedVendor.kycTypeId,
				kycNumber: selectedVendor.kycNumber,
				vendortype:findVendorType,
			});
		} else{
			this.setState({
				vendorId: "",
				vendorname: "",
				location: "",
				designation: "",
				contactperson: "",
				contactnumber: "",
				contactemail: "",
				designation2: "",
				contactperson2: "",
				contactnumber2: "",
				contactemail2: "",
				kycTypeId: "",
				kycNumber: "",
				vendortype:"",
			});
			findVendorType = ""
		}
	}

	// Method to handle input field changes
	onInputChange(event) {
		const { name, value } = event.target;

		this.setState({ [event.target.name]: event.target.value });

		if (name === 'vendorid') {
			this.fillVendorDetails(event);
		}
	}

	// Separate handler for 'vendortype' select input
	handleVendorTypeChange(event) {
		const { value } = event.target;
		this.setState({ vendortype: value });  // Update vendortype state
		selectedVendorType = value;  // Set the selectedVendorType variable only when vendortype changes
	}

	// File Handling
	handleFileChange (e) {
		const inputfile = e.target.files[0];
		this.setState({file:inputfile});
		// console.log(inputfile);
	};

	// Method to handle form submission
	async onSubmit(event) {
		event.preventDefault();

		const {
		vendorId,
		vendorname,
		location,
		contactperson,
		designation,
		contactnumber,
		contactemail,
		contactperson2,
		designation2,
		contactnumber2,
		contactemail2,
		kycTypeId,
		kycNumber,
		file,
		vendortype,
		} = this.state;

		// console.log("submited",vendorname)
		// console.log("submited",location)
		// console.log("submited",file)

		

		const inputs = {
			vendorName: vendorname.trim(),
			location: location.trim(),
			designation: designation.trim(),
			contactperson: contactperson.trim(),
			contactnumber: contactnumber,
			contactemail: contactemail.trim(),
			designation2: designation2,
			contactperson2: contactperson2,
			contactnumber2: contactnumber2,
			contactemail2: contactemail2,
			kycTypeId:kycTypeId,
			kycNumber:kycNumber,
			adminId:'1',
			file:file,
			vendortype:vendortype,
		};
		// console.log(inputs)
		let formData;

		const authData = JSON.parse(localStorage.getItem("auth")); // Parse the stored JSON string
		let token = authData.token.replace("Bearer ", "");

		// const fileFormData = new FormData();
		// fileFormData.append('file',file);
		// fileFormData.append("vendorName",vendorname);
		// fileFormData.append("location",location);
		// fileFormData.append("contactperson",contactperson);
		// fileFormData.append("designation",designation);
		// fileFormData.append("contactnumber",contactemail);
		// fileFormData.append("contactemail",vendorname);
		// fileFormData.append("kycTypeId",kycTypeId);
		// fileFormData.append("kycNumber",kycNumber);
		// fileFormData.append("vendortype",vendortype);
		// fileFormData.append("adminUser",adminUser);


		// for (let [key, value] of fileFormData.entries()) {
		// 	console.log("Form Data after",key, value);
		// }

		// try {
		// 	const response = await fetch('http://localhost:3000/api/admin/vendorsfile', {
		// 		method: 'POST',
		// 		headers: {
		// 			// No need for Content-Type here as `fetch` will set it automatically for `FormData`.
		// 			'Authorization': `Bearer ${token}`,  // Use appropriate auth token if needed
		// 		},
		// 		body: fileFormData,
		// 	});
		// 	console.log("response",response);
	
		// 	const result = await response.json();
		// 	console.log("result",result);
		// 	if (response.ok) {
		// 		// this.openModal();
		// 		// this.setState({
		// 		// 	code: result.status,
		// 		// 	message: result.message
		// 		// })  
		// 		console.log('File successfully uploaded:', result.data);
		// 		this.setState({ message: result.message, submitted: false });
		// 	} else {
		// 		// this.openModal();
		// 		// this.setState({
		// 		// 	code: result.status,
		// 		// 	message: result.error
		// 		// })
		// 		console.error('Upload failed:', result.message);
		// 		this.setState({ message: result.message, submitted: false });
		// 	}
		// } catch (error) {
		// 	// this.openModal();
		// 	// this.setState({
		// 	// 	errMessage: error.serverMessage
		// 	// })
		// 	console.error('Error uploading file:', error);
		// 	this.setState({ message: error.message, submitted: false });
		// }


		if (this.state.selectedValue === 'Register Vendor' && selectedVendorType === "Individual") {
			this.setState({ submitted: true });

			const fileFormData = new FormData();
			fileFormData.append('file',file);
			fileFormData.append("vendorName",vendorname);
			fileFormData.append("location",location);
			fileFormData.append("contactperson",contactperson);
			fileFormData.append("designation",designation);
			fileFormData.append("contactnumber",contactnumber);
			fileFormData.append("contactemail",contactemail);
			fileFormData.append("kycTypeId",kycTypeId);
			fileFormData.append("kycNumber",kycNumber);
			fileFormData.append("vendortype",vendortype);
			fileFormData.append("adminUser",adminUser);


			for (let [key, value] of fileFormData.entries()) {
				console.log("Form Data after",key, value);
			}

			try {
				const response = await fetch('http://localhost:3000/api/admin/vendorsfile', {
					method: 'POST',
					headers: {
						// No need for Content-Type here as `fetch` will set it automatically for `FormData`.
						'Authorization': `Bearer ${token}`,  // Use appropriate auth token if needed
					},
					body: fileFormData,
				});
				console.log("response",response);
		
				const result = await response.json();
				console.log("result",result);
				if (response.ok) {
					this.openModal();
					this.setState({
						code: result.status,
						message: result.message
					})  
					console.log('Vendor created successfully:', result.data);
					this.setState({ message: result.message, submitted: false });
				} else {
					this.openModal();
					this.setState({
						code: result.status,
						message: result.error
					})
					console.error('Vendor created filed:', result.message);
					this.setState({ message: result.message, submitted: false });
				}
			} catch (error) {
				this.openModal();
				this.setState({
					errMessage: error.serverMessage
				})
				console.error('Error creating vendor:', error);
				this.setState({ message: error.message, submitted: false });
			}
			// formData = {
			// 	vendorname:inputs.vendorName,
			// 	location:inputs.location,
			// 	contactperson:inputs.contactperson,
			// 	designation:inputs.designation,
			// 	contactnumber:inputs.contactnumber,
			// 	contactemail:inputs.contactemail,
			// 	kycTypeId:inputs.kycTypeId,
			// 	kycNumber:inputs.kycNumber,
			// 	vendortype:inputs.vendortype,
			// 	adminUser:adminUser,
			// }
			// // console.log(formData);

			// AppAPI.adminVendorRegistered.post(null, formData)
			// .then((resp) => {
			// 	this.openModal();
			// 	this.setState({
			// 		code: resp.status,
			// 		message: resp.message
			// 	}) 
			// 	console.log('Vendor Registered:', resp);
			// 	this.setState({ message: resp.message, submitted: false });
			// 	this.fetchVendors();
			// 	resetFormFields();
			// })
			// .catch((error) => {
			// 	this.openModal();
			// 	this.setState({
			// 		errMessage: error.serverMessage
			// 	})
			// 	console.error('Error Registering Vendor:', error);
			// 	this.setState({ message: error.message, submitted: false });
			// });

		} else if (this.state.selectedValue === 'Register Vendor' && selectedVendorType === "Business") {
			this.setState({ submitted: true });

			const fileFormData = new FormData();
			fileFormData.append('file',file);
			fileFormData.append("vendorName",vendorname);
			fileFormData.append("location",location);
			fileFormData.append("contactperson",contactperson);
			fileFormData.append("designation",designation);
			fileFormData.append("contactnumber",contactnumber);
			fileFormData.append("contactemail",contactemail);
			fileFormData.append("kycTypeId",kycTypeId);
			fileFormData.append("kycNumber",kycNumber);
			fileFormData.append("vendortype",vendortype);
			fileFormData.append("adminUser",adminUser);
			fileFormData.append("contactperson2",contactperson2);
			fileFormData.append("designation2",designation2);
			fileFormData.append("contactnumber2",contactnumber2);
			fileFormData.append("contactemail2",contactemail2);


			for (let [key, value] of fileFormData.entries()) {
				console.log("Form Data after",key, value);
			}

			try {
				const response = await fetch('http://localhost:3000/api/admin/vendorsfile', {
					method: 'POST',
					headers: {
						// No need for Content-Type here as `fetch` will set it automatically for `FormData`.
						'Authorization': `Bearer ${token}`,  // Use appropriate auth token if needed
					},
					body: fileFormData,
				});
				console.log("response",response);
		
				const result = await response.json();
				console.log("result",result);
				if (response.ok) {
					this.openModal();
					this.setState({
						code: result.status,
						message: result.message
					})  
					console.log('Vendor created successfully:', result.data);
					this.setState({ message: result.message, submitted: false });
				} else {
					this.openModal();
					this.setState({
						code: result.status,
						message: result.error
					})
					console.error('Vendor created filed:', result.message);
					this.setState({ message: result.message, submitted: false });
				}
			} catch (error) {
				this.openModal();
				this.setState({
					errMessage: error.serverMessage
				})
				console.error('Error creating vendor:', error);
				this.setState({ message: error.message, submitted: false });
			}

			// this.setState({ submitted: true });

			// formData = {
			// 	vendorname:inputs.vendorName,
			// 	location:inputs.location,
			// 	contactperson:inputs.contactperson,
			// 	designation:inputs.designation,
			// 	contactnumber:inputs.contactnumber,
			// 	contactemail:inputs.contactemail,
			// 	contactperson2:inputs.contactperson2,
			// 	designation2:inputs.designation2,
			// 	contactnumber2:inputs.contactnumber2,
			// 	contactemail2:inputs.contactemail2,
			// 	kycTypeId:inputs.kycTypeId,
			// 	kycNumber:inputs.kycNumber,
			// 	vendortype:inputs.vendortype,
			// 	adminUser:adminUser,
			// }
			// // console.log(formData);

			// AppAPI.adminVendorRegistered.post(null, formData)
			// .then((resp) => {
			// 	this.openModal();
			// 	this.setState({
			// 		code: resp.status,
			// 		message: resp.message
			// 	})
			// 	console.log('Vendor Registered:', resp);
			// 	this.setState({ message: resp.message, submitted: false });
			// 	this.fetchVendors();
			// 	resetFormFields();
			// })
			// .catch((error) => {
			// 	this.openModal();
			// 	this.setState({
			// 		errMessage: error.serverMessage
			// 	})
			// 	console.error('Error Registering Vendor:', error);
			// 	this.setState({ message: error.message, submitted: false });
			// });

		} else if (this.state.selectedValue === 'Update Vendor' && (vendortype === "Individual")) {
			this.setState({ submitted: true });

			formData = {
				vendorId:vendorId,
				vendorname:vendorname,
				location:location,
				contactperson:contactperson,
				designation:designation,
				contactnumber:contactnumber,
				contactemail:contactemail,
				kycTypeId:kycTypeId,
				kycNumber:kycNumber,
				vendortype:vendortype,
				adminUser:adminUser,
			}
			console.log("Updated :: ",formData);

			AppAPI.adminVendorsUpdate.put(vendorId, formData, {
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
				console.log('Vendor Update:', resp);
				this.setState({ message: resp.message, submitted: false });
				this.fetchVendors();
				resetFormFields();
				this.setState({vendorId:""});
			})
			.catch((error) => {
				this.openModal();
				this.setState({
					errMessage: error.serverMessage
				})
				console.error('Error Update Vendor:', error);
				this.setState({ message: error.message, submitted: false });
			});

		} else if (this.state.selectedValue === 'Update Vendor' && vendortype === "Business") {
			this.setState({ submitted: true });

			formData = {
				vendorId:vendorId,
				vendorname:vendorname,
				location:location,
				contactperson:contactperson,
				designation:designation,
				contactnumber:contactnumber,
				contactemail:contactemail,
				kycTypeId:kycTypeId,
				kycNumber:kycNumber,
				vendortype:vendortype,
				adminUser:adminUser,
				contactperson2:contactperson2,
				designation2:designation2,
				contactnumber2:contactnumber2,
				contactemail2:contactemail2,
				file:null,
			}
			// console.log(formData);

			AppAPI.adminVendorsUpdate.put(vendorId, formData, {
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
				console.log('Vendor Update:', resp);
				this.setState({ message: resp.message, submitted: false });
				this.fetchVendors();
				resetFormFields();
				this.setState({vendorId:""})
			})
			.catch((error) => {
				this.openModal();
				this.setState({
					errMessage: error.serverMessage
				})
				console.error('Error Update Vendor:', error);
				this.setState({ message: error.message, submitted: false });
			});

		}
		else {
			alert('All fields are required!');
		}
	}

	// Method to handle selection of 'Register Vendor'
	handleCheckedCreate() {
		this.setState({ selectedValue: 'Register Vendor' });
		resetFormFields();
	}

	// Method to handle selection of 'Update Vendor'
	handleCheckedUpdate() {
		this.setState({ selectedValue: 'Update Vendor' });
		resetFormFields();
	}

  

  render() {
    const { classes } = this.props;
    const { submitted, selectedValue, vendors, fileError,  } = this.state;
	// console.log("Selected Vendor Type: ", selectedVendorType);
	// console.log("Find Vendor Type: ", findVendorType);

    return (
      <div>
        <p className="titleCard">Menu / Vendor Registration</p>
        <div className="d-flex justify-content-center">
          <Paper style={{ width: '100%' }}>
            <h6 className="customHeader">Vendor Registration</h6>
            <div className="container p-4">
				<div className={classes.root}>
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={6}>
							<Radio
								checked={this.state.selectedValue === 'Register Vendor'}
								onChange={this.handleCheckedCreate}
								value="Register Vendor"
								name="radio-button-demo"
								classes={{
								root: classes.radio,
								}}
							/>
							<label>Register Vendor</label>
						</Grid>
                        <Grid item xs={12} sm={6}>
							<Radio
								checked={this.state.selectedValue === 'Update Vendor'}
								onChange={this.handleCheckedUpdate}
								value="Update Vendor"
								name="radio-button-demo"
								classes={{
								root: classes.radio,
								}}
							/>
							<label>Update Vendor</label>
			  			</Grid>
					</Grid>
				</div> 

				{selectedValue === 'Register Vendor' &&  (
					<>
						<div className={classes.root}>
							<Grid container spacing={24}>
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
											htmlFor="vendor-type"
										>Vendor Type
										</InputLabel>
										<Select
											value={this.state.vendortype}
											onChange={this.handleVendorTypeChange}
											// onChange={this.onInputChange}
											input={
												<OutlinedInput
													labelWidth={this.state.labelWidth}
													name="vendortype"
													id="vendor-type"
												/>
											}
										>
											{this.state.Data1.map((item, index) => (
												<MenuItem key={index} value={item}>
													{item}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
							</Grid>
						</div>

						{
							selectedVendorType && selectedVendorType === "Individual" ? 
							(
								<ValidatorForm ref="form" onSubmit={this.onSubmit}>
									<div className={classes.root}>
										<Grid container spacing={24}>
											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
													fullWidth
													margin="normal"
													name="vendorname"
													label="Vendor Name"
													value={this.state.vendorname}
													onChange={this.onInputChange}
													validators={['required']}
													errorMessages={['Vendor Name is required']}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
													fullWidth
													margin="normal"
													name="location"
													label="Location"
													value={this.state.location}
													onChange={this.onInputChange}
													validators={['required']}
													errorMessages={['Location is required']}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
													fullWidth
													margin="normal"
													name="contactperson"
													label="Contact Person"
													value={this.state.contactperson}
													onChange={this.onInputChange}
													validators={['required']}
													errorMessages={['Contact Person is required']}
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
													name="designation"
													label="Designation"
													value={this.state.designation}
													onChange={this.onInputChange}
													validators={['required']}
													errorMessages={['Designation is required']}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
													fullWidth
													margin="normal"
													name="contactnumber"
													label="Contact Number"
													value={this.state.contactnumber}
													onChange={this.onInputChange}
													validators={['required', 'matchRegexp:^[6-9][0-9]{9}$']}
													errorMessages={['Contact Number is required']}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
													fullWidth
													margin="normal"
													name="contactemail"
													label="Contact Email"
													value={this.state.contactemail}
													onChange={this.onInputChange}
													validators={['required', 'isEmail']}
													errorMessages={['Email is required', 'Email is not valid']}
												/>
											</Grid>
										</Grid>
									</div>

									<div className={classes.root}>
										<Grid container spacing={24}>
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
														htmlFor="kyc-type-id"
													>KYC Type ID
													</InputLabel>
													<Select
													value={this.state.kycTypeId}
													onChange={this.onInputChange}
													input={
														<OutlinedInput
														labelWidth={this.state.labelWidth}
														name="kycTypeId"
														id="kyc-type-id"
														/>
													}
													>
														<MenuItem value={1}>Aadhar</MenuItem>
														<MenuItem value={2}>Pan Card</MenuItem>
														<MenuItem value={3}>Passport</MenuItem>
														<MenuItem value={4}>Driving Licence</MenuItem>
														<MenuItem value={5}>Voter ID</MenuItem>
													</Select>
												</FormControl>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
													fullWidth
													margin="normal"
													name="kycNumber"
													label="KYC Number"
													value={this.state.kycNumber}
													onChange={this.onInputChange}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
													fullWidth
													margin="normal"
													type="file"
													name="file"
													label="File"
													// accept=".pdf,.jpg,.jpeg"
													onChange={this.handleFileChange}
													InputProps={{
														disableUnderline: true, // Disables underline
													}}
													// validators={['required']}
													// errorMessages={['File is required']}
												/>
												{fileError && <Typography color="error">{fileError}</Typography>}
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
							: 
							(
								<ValidatorForm ref="form" onSubmit={this.onSubmit}>
									<div className={classes.root}>
										<Grid container spacing={24}>
											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
													fullWidth
													margin="normal"
													name="vendorname"
													label="Vendor Name"
													value={this.state.vendorname}
													onChange={this.onInputChange}
													validators={['required']}
													errorMessages={['Vendor Name is required']}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
													fullWidth
													margin="normal"
													name="location"
													label="Location"
													value={this.state.location}
													onChange={this.onInputChange}
													validators={['required']}
													errorMessages={['Location is required']}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
													fullWidth
													margin="normal"
													name="contactperson"
													label="Contact Person"
													value={this.state.contactperson}
													onChange={this.onInputChange}
													validators={['required']}
													errorMessages={['Contact Person is required']}
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
													name="designation"
													label="Designation"
													value={this.state.designation}
													onChange={this.onInputChange}
													validators={['required']}
													errorMessages={['Designation is required']}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
													fullWidth
													margin="normal"
													name="contactnumber"
													label="Contact Number"
													value={this.state.contactnumber}
													onChange={this.onInputChange}
													validators={['required', 'matchRegexp:^[6-9][0-9]{9}$']}
													errorMessages={['Contact Number is required']}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
													fullWidth
													margin="normal"
													name="contactemail"
													label="Contact Email"
													value={this.state.contactemail}
													onChange={this.onInputChange}
													validators={['required', 'isEmail']}
													errorMessages={['Email is required', 'Email is not valid']}
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
													name="contactperson2"
													label="Contact Person 2"
													value={this.state.contactperson2}
													onChange={this.onInputChange}
													validators={['required']}
													errorMessages={['Contact Person 2 is required']}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
													fullWidth
													margin="normal"
													name="designation2"
													label="Designation 2"
													value={this.state.designation2}
													onChange={this.onInputChange}
													validators={['required']}
													errorMessages={['Designation 2 is required']}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
													fullWidth
													margin="normal"
													name="contactnumber2"
													label="Contact Number 2"
													value={this.state.contactnumber2}
													onChange={this.onInputChange}
													validators={['required', 'matchRegexp:^[6-9][0-9]{9}$']}
													errorMessages={['Contact Number 2 is required']}
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
													name="contactemail2"
													label="Contact Email 2"
													value={this.state.contactemail2}
													onChange={this.onInputChange}
													validators={['required', 'isEmail']}
													errorMessages={['Email 2 is required', 'Email 2 is not valid']}
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
														htmlFor="kyc-type-id"
													>KYC Type ID</InputLabel>
													<Select
													value={this.state.kycTypeId}
													onChange={this.onInputChange}
													input={
														<OutlinedInput
														labelWidth={this.state.labelWidth}
														name="kycTypeId"
														id="kyc-type-id"
														/>
													}
													>
														<MenuItem value={1}>Aadhar</MenuItem>
														<MenuItem value={2}>Pan Card</MenuItem>
														<MenuItem value={3}>Passport</MenuItem>
														<MenuItem value={4}>Driving Licence</MenuItem>
														<MenuItem value={5}>Voter ID</MenuItem>
													</Select>
												</FormControl>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
													fullWidth
													margin="normal"
													name="kycNumber"
													label="KYC Number"
													value={this.state.kycNumber}
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
													type="file"
													name="file"
													label="File"
													// accept=".pdf,.jpg,.jpeg"
													onChange={this.handleFileChange}
													InputProps={{
														disableUnderline: true, // Disables underline
													}}
													// validators={['required']}
													// errorMessages={['File is required']}
												/>
												{fileError && <Typography color="error">{fileError}</Typography>}
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
						
					</>
				)}

				{selectedValue === 'Update Vendor' &&  (
					<>
						<ValidatorForm ref="form" onSubmit={this.onSubmit}>
							<div className={classes.root}>
								<Grid container spacing={24}>
									<Grid item xs={12} sm={6} md={4}>
										<TextValidator
										fullWidth
										margin="normal"
										name="vendorid"
										label="Vendor ID"
										value={this.state.vendorid}
										onChange={this.onInputChange}
										validators={['required']}
										errorMessages={['Vendor ID is required']}
										/>
									</Grid>
								</Grid>
							</div>
						</ValidatorForm>

						{
							findVendorType && findVendorType === "Individual" ?
							(
								<ValidatorForm ref="form" onSubmit={this.onSubmit}>
									<div className={classes.root}>
										<Grid container spacing={24}>
											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
												fullWidth
												margin="normal"
												name="vendorname"
												label="Vendor Name"
												value={this.state.vendorname}
												onChange={this.onInputChange}
												// validators={['required']}
												errorMessages={['Vendor Name is required']}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
												fullWidth
												margin="normal"
												name="location"
												label="Location"
												value={this.state.location}
												onChange={this.onInputChange}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
												fullWidth
												margin="normal"
												name="contactperson"
												label="Contact Person"
												value={this.state.contactperson}
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
												name="designation"
												label="Designation"
												value={this.state.designation}
												onChange={this.onInputChange}
												// validators={['required']}
												errorMessages={['Designation is required']}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
													fullWidth
													margin="normal"
													name="contactNumber"
													label="Contact Number"
													value={this.state.contactnumber}
													onChange={this.onInputChange}
													validators={['required', 'matchRegexp:^[6-9][0-9]{9}$']}
													errorMessages={['Contact Number is required', 'Invalid Contact Number']}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
												fullWidth
												margin="normal"
												name="contactemail"
												label="Contact Email"
												value={this.state.contactemail}
												onChange={this.onInputChange}
												validators={['required', 'isEmail']}
												errorMessages={['Email is required', 'Email is not valid']}
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
												name="kycNumber"
												label="KYC Number"
												value={this.state.kycNumber}
												onChange={this.onInputChange}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
												fullWidth
												margin="normal"
												name="kycTypeId"
												label="Type ID Number"
												value={this.state.kycTypeId}
												onChange={this.onInputChange}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
												fullWidth
												margin="normal"
												name="vendortype"
												label="Vendor Type"
												value={this.state.vendortype}
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
										{submitted ? 'Updating...' : 'Update Vendor'}
										</Button>
									</div>
								</ValidatorForm>
							)
							:
							(
								<ValidatorForm ref="form" onSubmit={this.onSubmit}>
									<div className={classes.root}>
										<Grid container spacing={24}>
											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
												fullWidth
												margin="normal"
												name="vendorname"
												label="Vendor Name"
												value={this.state.vendorname}
												onChange={this.onInputChange}
												// validators={['required']}
												errorMessages={['Vendor Name is required']}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
												fullWidth
												margin="normal"
												name="location"
												label="Location"
												value={this.state.location}
												onChange={this.onInputChange}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
												fullWidth
												margin="normal"
												name="contactperson"
												label="Contact Person"
												value={this.state.contactperson}
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
												name="designation"
												label="Designation"
												value={this.state.designation}
												onChange={this.onInputChange}
												// validators={['required']}
												errorMessages={['Designation is required']}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
													fullWidth
													margin="normal"
													name="contactnumber"
													label="Contact Number"
													value={this.state.contactnumber}
													onChange={this.onInputChange}
													validators={['required', 'matchRegexp:^[6-9][0-9]{9}$']}
													errorMessages={['Contact Number is required', 'Invalid Contact Number']}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
												fullWidth
												margin="normal"
												name="contactemail"
												label="Contact Email"
												value={this.state.contactemail}
												onChange={this.onInputChange}
												validators={['required', 'isEmail']}
												errorMessages={['Email is required', 'Email is not valid']}
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
												name="contactperson2"
												label="Contact Person 2"
												value={this.state.contactperson2}
												onChange={this.onInputChange}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
												fullWidth
												margin="normal"
												name="designation2"
												label="Designation 2"
												value={this.state.designation2}
												onChange={this.onInputChange}
												// validators={['required']}
												errorMessages={['Designation 2 is required']}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
													fullWidth
													margin="normal"
													name="contactnumber2"
													label="Contact Number 2"
													value={this.state.contactnumber2}
													onChange={this.onInputChange}
													validators={['required', 'matchRegexp:^[6-9][0-9]{9}$']}
													errorMessages={['Contact Number 2 is required', 'Invalid Contact Number']}
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
												name="contactemail2"
												label="Contact Email 2"
												value={this.state.contactemail2}
												onChange={this.onInputChange}
												validators={['required', 'isEmail']}
												errorMessages={['Email 2 is required', 'Email 2 is not valid']}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
												fullWidth
												margin="normal"
												name="kycNumber"
												label="KYC Number"
												value={this.state.kycNumber}
												onChange={this.onInputChange}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={4}>
												<TextValidator
												fullWidth
												margin="normal"
												name="kycTypeId"
												label="Type ID Number"
												value={this.state.kycTypeId}
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
												name="vendortype"
												label="Vendor Type"
												value={this.state.vendortype}
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
										{submitted ? 'Updating...' : 'Update Vendor'}
										</Button>
									</div>
								</ValidatorForm>
							)
						}
					
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

export default withStyles(styles)(VendorRegistrations);



















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

// class VendorRegistrations extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       // Input fields
// 	  vendorId:'',
//       name: '',
//       officeLocation: '',
//       designation: '',
//       contactPerson: '',
//       contactNumber: '',
//       contactEmail: '',
//       commonName: '',
//       kycNumber: '',

//       // Select fields
//       categoryId: '',
//       departmentId: '',
//       productServicePfId: '',
//       typeId: '',
//       kycTypeId: '',

//       // Other states
//       selectedValue: 'Register Vendor', // Default to 'Register Vendor'
//       message: '',
//       submitted: false,

// 	  vendors: [],  // To store the list of vendors for auto-fill on select
//     };

//     this.handleCheckedCreate = this.handleCheckedCreate.bind(this);
//     this.handleCheckedUpdate = this.handleCheckedUpdate.bind(this);
//     this.onInputChange = this.onInputChange.bind(this);
//     this.onSubmit = this.onSubmit.bind(this);

// 	this.fetchVendors = this.fetchVendors.bind(this);
//     this.fillVendorDetails = this.fillVendorDetails.bind(this);
//   }

//   fetchVendors() {
//     AppAPI.adminGetVendors.get()
// 	.then((response) => {
// 		console.log("Vendors :: ",response.vendors);
//       this.setState({ vendors: response.vendors });
//     }).catch((error) => {
//       console.error("Error fetching vendors:", error);
//     });
//   }

//   // Fetch vendors from backend to populate dropdown/select
//   componentDidMount() {
//     this.fetchVendors();
//   }
  
//   // Method to auto-fill vendor details based on selected vendorId
//   fillVendorDetails(event) {
//     const vendorId = event.target.value;
//     const selectedVendor = this.state.vendors.find(vendor => vendor.vendorId == vendorId);
// 	console.log("Vendor find By ID :: ",selectedVendor)

//     if (selectedVendor) {
//       this.setState({
//         vendorId: vendorId,
//         name: selectedVendor.vendorName,
//         officeLocation: selectedVendor.offLoc,
//         designation: selectedVendor.desig,
//         contactPerson: selectedVendor.conPerson,
//         contactNumber: selectedVendor.conNum,
//         contactEmail: selectedVendor.conEmail,
//         commonName: selectedVendor.comName,
//         categoryId: selectedVendor.catId,
//         departmentId: selectedVendor.deptId,
//         productServicePfId: selectedVendor.serPfId,
//         typeId: selectedVendor.typeId,
//         kycTypeId: selectedVendor.kycTypeId,
//         kycNumber: selectedVendor.kycNo,
//       });
//     }
//   }

//   // Method to handle input field changes
//   onInputChange(event) {
// 	const { name, value } = event.target;
//     this.setState({ [event.target.name]: event.target.value });
// 	if (name === 'vendorId') {
// 		this.fillVendorDetails(event);
// 	}
//   }

//   // Method to handle form submission
//   onSubmit(event) {
//     event.preventDefault();

//     const {
// 	  vendorId,
//       name,
//       officeLocation,
//       designation,
//       contactPerson,
//       contactNumber,
//       contactEmail,
//       commonName,
//       categoryId,
//       departmentId,
//       productServicePfId,
//       typeId,
//       kycTypeId,
// 	  kycNumber,
//     } = this.state;

	

// 	const inputs = {
// 		vendorName: name.trim(),
// 		offLoc: officeLocation.trim(),
// 		desig: designation.trim(),
// 		conPerson: contactPerson.trim(),
// 		conNum: contactNumber,
// 		conEmail: contactEmail.trim(),
// 		comName: commonName.trim(),
// 		catId:categoryId,
// 		deptId:departmentId,
// 		serPfId:productServicePfId,
// 		typeId:typeId,
// 		kycTypeId:kycTypeId,
// 		kycNo:kycNumber,
// 		adminId:'1',
// 	};
// 	// console.log(inputs)

// 	if (Object.values(inputs).every(input => input)) {
// 		this.setState({ submitted: true });
	
// 		console.log('Input values: ', inputs);
	
// 		// const formData = {
// 		//   ...inputs,
// 		// };
// 		const formData = {
// 			vendorName: inputs.vendorName,
// 			offLoc: inputs.offLoc,
// 			desig: inputs.desig,
// 			conPerson: inputs.conPerson,
// 			conNum: inputs.conNum,
// 			conEmail: inputs.conEmail,
// 			comName: inputs.comName,
// 			catId:inputs.catId,
// 			deptId:inputs.deptId,
// 			serPfId:inputs.serPfId,
// 			typeId:inputs.typeId,
// 			kycTypeId:inputs.kycTypeId,
// 			kycNo:inputs.kycNo,
// 			adminId:inputs.adminId,
// 		}

// 		const formData1 = {
// 			vendorId:vendorId,
// 			vendorName: inputs.vendorName,
// 			offLoc: inputs.offLoc,
// 			desig: inputs.desig,
// 			conPerson: inputs.conPerson,
// 			conNum: inputs.conNum,
// 			conEmail: inputs.conEmail,
// 			comName: inputs.comName,
// 			catId:inputs.catId,
// 			deptId:inputs.deptId,
// 			serPfId:inputs.serPfId,
// 			typeId:inputs.typeId,
// 			kycTypeId:inputs.kycTypeId,
// 			kycNo:inputs.kycNo,
// 			adminId:inputs.adminId,
// 		}

	
// 		console.log('Form Data Submitted: ', formData);

// 		if (this.state.selectedValue === 'Register Vendor') {
// 			// Create Vendor
// 			AppAPI.adminVendorRegistered.post(null, formData)
// 			  .then((resp) => {
// 				console.log('Vendor Registered:', resp);
// 				this.setState({ message: resp.message, submitted: false });
// 				this.fetchVendors(); // Update vendor list
// 			  })
// 			  .catch((error) => {
// 				console.error('Error Registering Vendor:', error);
// 				this.setState({ message: error.message, submitted: false });
// 			  });
// 		} else {
// 			console.log("Update details :: ",formData1)
// 			// Update Vendor

// 			AppAPI.adminVendorUpdate
// 			.put(vendorId, formData1)
// 			.then((res) => {
// 				console.log('Vendor Updated:', res);
// 				this.setState({ message: res.message, submitted: false });
// 				this.fetchVendors(); // Update vendor list
// 			})
// 			.catch((error) => {
// 				console.error('Error Updating Vendor:', error);
// 				this.setState({ message: error.message, submitted: false });
// 			});
			
// 		}

// 		// Reset form fields after submission
// 		this.setState({
// 			vendorId:'',
// 			name: '',
// 			officeLocation: '',
// 			designation: '',
// 			contactPerson: '',
// 			contactNumber: '',
// 			contactEmail: '',
// 			commonName: '',
// 			categoryId: '',
// 			departmentId: '',
// 			productServicePfId: '',
// 			typeId: '',
// 			kycTypeId: '',
// 			kycNumber:'',
// 		});
// 	} else {
// 		alert('All fields are required!');
// 	}
//   }

//   // Method to handle selection of 'Register Vendor'
//   handleCheckedCreate() {
//     this.setState({ selectedValue: 'Register Vendor' });
//   }

//   // Method to handle selection of 'Update Vendor'
//   handleCheckedUpdate() {
//     this.setState({ selectedValue: 'Update Vendor' });
//   }

//   render() {
//     const { classes } = this.props;
//     const { submitted, selectedValue, vendors } = this.state;

//     return (
//       <div>
//         <p className="titleCard">Menu / Vendor Registration</p>
//         <div className="d-flex justify-content-center">
//           <Paper style={{ width: '75%' }}>
//             <h6 className="customHeader">Vendor Registration</h6>
//             <div className="container p-4">
// 				<div className={classes.root}>
//                     <Grid container spacing={24}>
//                         <Grid item xs={6}>
// 							<Radio
// 								checked={this.state.selectedValue === 'Register Vendor'}
// 								onChange={this.handleCheckedCreate}
// 								value="Register Vendor"
// 								name="radio-button-demo"
// 								classes={{
// 								root: classes.radio,
// 								}}
// 							/>
// 							<label>Register Vendor</label>
// 						</Grid>
//                         <Grid item xs={6}>
// 							<Radio
// 								checked={this.state.selectedValue === 'Update Vendor'}
// 								onChange={this.handleCheckedUpdate}
// 								value="Update Vendor"
// 								name="radio-button-demo"
// 								classes={{
// 								root: classes.radio,
// 								}}
// 							/>
// 							<label>Update Vendor</label>
// 			  			</Grid>
// 					</Grid>
// 				</div> 

//               {selectedValue === 'Register Vendor' ? (
//                 <ValidatorForm ref="form" onSubmit={this.onSubmit}>
// 					<div className={classes.root}>
// 						<Grid container spacing={24}>
// 							<Grid item xs={6}>
// 								<TextValidator
// 									fullWidth
// 									margin="normal"
// 									name="name"
// 									label="Vendor Name"
// 									value={this.state.name}
// 									onChange={this.onInputChange}
// 									validators={['required']}
// 									errorMessages={['Vendor Name is required']}
// 								/>
// 							</Grid>

// 							<Grid item xs={6}>
// 								<TextValidator
// 									fullWidth
// 									margin="normal"
// 									name="officeLocation"
// 									label="Office Location"
// 									value={this.state.officeLocation}
// 									onChange={this.onInputChange}
// 								/>
// 							</Grid>
// 						</Grid>
// 					</div>

// 					<div className={classes.root}>
// 						<Grid container spacing={24}>
// 							<Grid item xs={6}>
// 								<TextValidator
// 									fullWidth
// 									margin="normal"
// 									name="designation"
// 									label="Designation"
// 									value={this.state.designation}
// 									onChange={this.onInputChange}
// 								/>
// 							</Grid>

// 							<Grid item xs={6}>
// 								<TextValidator
// 									fullWidth
// 									margin="normal"
// 									name="contactPerson"
// 									label="Contact Person"
// 									value={this.state.contactPerson}
// 									onChange={this.onInputChange}
// 								/>
// 							</Grid>
// 						</Grid>
// 					</div>

// 					<div className={classes.root}>
// 						<Grid container spacing={24}>
// 							<Grid item xs={6}>
// 								<TextValidator
// 									fullWidth
// 									margin="normal"
// 									name="contactNumber"
// 									label="Contact Number"
// 									value={this.state.contactNumber}
// 									onChange={this.onInputChange}
// 									validators={['required', 'matchRegexp:^[6-9][0-9]{9}$']}
// 									errorMessages={['Contact Number is required']}
// 								/>
// 							</Grid>

// 							<Grid item xs={6}>
// 								<TextValidator
// 									fullWidth
// 									margin="normal"
// 									name="contactEmail"
// 									label="Contact Email"
// 									value={this.state.contactEmail}
// 									onChange={this.onInputChange}
// 									validators={['required', 'isEmail']}
// 									errorMessages={['Email is required', 'Email is not valid']}
// 								/>
// 							</Grid>
// 						</Grid>
// 					</div>

// 					<div className={classes.root}>
// 						<Grid container spacing={24}>
// 							<Grid item xs={6}>
// 								<TextValidator
// 									fullWidth
// 									margin="normal"
// 									name="commonName"
// 									label="Common Name"
// 									value={this.state.commonName}
// 									onChange={this.onInputChange}
// 								/>
// 							</Grid>

// 							<Grid item xs={6}>
// 								<FormControl
// 									style={{ marginTop: '1rem' }}
// 									fullWidth
// 									variant="outlined"
// 									className="form"
// 								>
// 									<InputLabel htmlFor="category-id">Category ID</InputLabel>
// 									<Select
// 									value={this.state.categoryId}
// 									onChange={this.onInputChange}
// 									input={
// 										<OutlinedInput
// 										labelWidth={this.state.labelWidth}
// 										name="categoryId"
// 										id="category-id"
// 										/>
// 									}
// 									>
// 										<MenuItem value={1}>Category 1</MenuItem>
// 										<MenuItem value={2}>Category 2</MenuItem>
// 										<MenuItem value={3}>Category 3</MenuItem>
// 									</Select>
// 								</FormControl>
// 							</Grid>
// 						</Grid>
// 					</div>

// 					<div className={classes.root}>
// 						<Grid container spacing={24}>
// 							<Grid item xs={6}>
// 								<FormControl
// 									style={{ marginTop: '1rem' }}
// 									fullWidth
// 									variant="outlined"
// 									className="form"
// 								>
// 									<InputLabel htmlFor="department-id">Department ID</InputLabel>
// 									<Select
// 									value={this.state.departmentId}
// 									onChange={this.onInputChange}
// 									input={
// 										<OutlinedInput
// 										labelWidth={this.state.labelWidth}
// 										name="departmentId"
// 										id="department-id"
// 										/>
// 									}
// 									>
// 										<MenuItem value={1}>Department 1</MenuItem>
// 										<MenuItem value={2}>Department 2</MenuItem>
// 									</Select>
// 								</FormControl>
// 							</Grid>

// 							<Grid item xs={6}>
// 								<FormControl
// 									style={{ marginTop: '1rem' }}
// 									fullWidth
// 									variant="outlined"
// 									className="form"
// 								>
// 									<InputLabel htmlFor="product-service-pf-id">
// 									Product/Service PF ID
// 									</InputLabel>
// 									<Select
// 									value={this.state.productServicePfId}
// 									onChange={this.onInputChange}
// 									input={
// 										<OutlinedInput
// 										labelWidth={this.state.labelWidth}
// 										name="productServicePfId"
// 										id="product-service-pf-id"
// 										/>
// 									}
// 									>
// 										<MenuItem value={1}>Product 1</MenuItem>
// 										<MenuItem value={2}>Product 2</MenuItem>
// 									</Select>
// 								</FormControl>
// 							</Grid>
// 						</Grid>
// 					</div>

// 					<div className={classes.root}>
// 						<Grid container spacing={24}>
// 							<Grid item xs={6}>
// 								<FormControl
// 									style={{ marginTop: '1rem' }}
// 									fullWidth
// 									variant="outlined"
// 									className="form"
// 								>
// 									<InputLabel htmlFor="Vendor-type-id">Vendor Type ID</InputLabel>
// 									<Select
// 									value={this.state.typeId}
// 									onChange={this.onInputChange}
// 									input={
// 										<OutlinedInput
// 										labelWidth={this.state.labelWidth}
// 										name="typeId"
// 										id="type-id"
// 										/>
// 									}
// 									>
// 										<MenuItem value={1}>Type 1</MenuItem>
// 										<MenuItem value={2}>Type 2</MenuItem>
// 										<MenuItem value={3}>Type 3</MenuItem>
// 									</Select>
// 								</FormControl>
// 							</Grid>

// 							<Grid item xs={6}>
// 								<FormControl
// 									style={{ marginTop: '1rem' }}
// 									fullWidth
// 									variant="outlined"
// 									className="form"
// 								>
// 									<InputLabel htmlFor="kyc-type-id">KYC Type ID</InputLabel>
// 									<Select
// 									value={this.state.kycTypeId}
// 									onChange={this.onInputChange}
// 									input={
// 										<OutlinedInput
// 										labelWidth={this.state.labelWidth}
// 										name="kycTypeId"
// 										id="kyc-type-id"
// 										/>
// 									}
// 									>
// 										<MenuItem value={1}>Aadhar</MenuItem>
// 										<MenuItem value={2}>Pan Card</MenuItem>
// 										<MenuItem value={3}>Passport</MenuItem>
// 										<MenuItem value={4}>Driving Licence</MenuItem>
// 										<MenuItem value={5}>Voter ID</MenuItem>
// 									</Select>
// 								</FormControl>
// 							</Grid>
// 						</Grid>
// 					</div>

// 					<div className={classes.root}>
// 						<Grid container spacing={24}>
// 							<Grid item xs={6}>
// 								<TextValidator
// 									fullWidth
// 									margin="normal"
// 									name="kycNumber"
// 									label="KYC Number"
// 									value={this.state.kycNumber}
// 									onChange={this.onInputChange}
// 								/>
// 							</Grid>
// 						</Grid>
// 					</div>
// 					<div className="d-flex justify-content-start pt-4">
// 						<Typography variant="caption" gutterBottom>
// 							Note: All Fields are Mandatory Except Remarks
// 						</Typography> 
// 					</div> 

// 					<div className="d-flex justify-content-center pt-4">
// 						<Button
// 							type="submit"
// 							variant="contained"
// 							color="primary"
// 							className={classes.button}
// 							disabled={submitted}
// 						>
// 							{submitted ? 'Your form is submitting' : 'Submit'}
// 						</Button>
// 					</div>
//                 </ValidatorForm>
//               ) : (
//                 <ValidatorForm ref="form" onSubmit={this.onSubmit}>
// 					<div className={classes.root}>
// 						<Grid container spacing={24}>
// 							<Grid item xs={6}>
// 								<TextValidator
// 								fullWidth
// 								margin="normal"
// 								name="vendorId"
// 								label="Vendor ID"
// 								value={this.state.vendorId}
// 								onChange={this.onInputChange}
// 								validators={['required']}
// 								errorMessages={['Vendor ID is required']}
// 								/>
// 							</Grid>

// 							<Grid item xs={6}>
// 								<TextValidator
// 								fullWidth
// 								margin="normal"
// 								name="name"
// 								label="Vendor Name"
// 								value={this.state.name}
// 								onChange={this.onInputChange}
// 								// validators={['required']}
// 								errorMessages={['Vendor Name is required']}
// 								/>
// 							</Grid>
// 						</Grid>
// 					</div>

// 					<div className={classes.root}>
// 						<Grid container spacing={24}>
// 							<Grid item xs={6}>
// 								<TextValidator
// 								fullWidth
// 								margin="normal"
// 								name="officeLocation"
// 								label="Office Location"
// 								value={this.state.officeLocation}
// 								onChange={this.onInputChange}
// 								/>
// 							</Grid>

// 							<Grid item xs={6}>
// 								<TextValidator
// 								fullWidth
// 								margin="normal"
// 								name="designation"
// 								label="Designation"
// 								value={this.state.designation}
// 								onChange={this.onInputChange}
// 								/>
// 							</Grid>
// 						</Grid>
// 					</div>

// 					<div className={classes.root}>
// 						<Grid container spacing={24}>
// 							<Grid item xs={6}>
// 								<TextValidator
// 								fullWidth
// 								margin="normal"
// 								name="contactPerson"
// 								label="Contact Person"
// 								value={this.state.contactPerson}
// 								onChange={this.onInputChange}
// 								/>
// 							</Grid>

// 							<Grid item xs={6}>
// 								<TextValidator
// 								fullWidth
// 								margin="normal"
// 								name="contactNumber"
// 								label="Contact Number"
// 								value={this.state.contactNumber}
// 								onChange={this.onInputChange}
// 								validators={['required', 'matchRegexp:^[6-9][0-9]{9}$']}
// 								errorMessages={['Contact Number is required', 'Invalid Contact Number']}
// 								/>
// 							</Grid>
// 						</Grid>
// 					</div>

// 					<div className={classes.root}>
// 						<Grid container spacing={24}>
// 							<Grid item xs={6}>
// 								<TextValidator
// 								fullWidth
// 								margin="normal"
// 								name="contactEmail"
// 								label="Contact Email"
// 								value={this.state.contactEmail}
// 								onChange={this.onInputChange}
// 								validators={['required', 'isEmail']}
// 								errorMessages={['Email is required', 'Email is not valid']}
// 								/>
// 							</Grid>

// 							<Grid item xs={6}>
// 								<TextValidator
// 								fullWidth
// 								margin="normal"
// 								name="commonName"
// 								label="Common Name"
// 								value={this.state.commonName}
// 								onChange={this.onInputChange}
// 								/>
// 							</Grid>
// 						</Grid>
// 					</div>

// 					<div className={classes.root}>
// 						<Grid container spacing={24}>
// 							<Grid item xs={6}>
// 								<TextValidator
// 								fullWidth
// 								margin="normal"
// 								name="kycNumber"
// 								label="KYC Number"
// 								value={this.state.kycNumber}
// 								onChange={this.onInputChange}
// 								/>
// 							</Grid>

// 							<Grid item xs={6}>
// 								<TextValidator
// 								fullWidth
// 								margin="normal"
// 								name="categoryId"
// 								label="Category ID"
// 								value={this.state.categoryId}
// 								onChange={this.onInputChange}
// 								/>
// 							</Grid>
// 						</Grid>
// 					</div>

// 					<div className={classes.root}>
// 						<Grid container spacing={24}>
// 							<Grid item xs={6}>
// 								<TextValidator
// 								fullWidth
// 								margin="normal"
// 								name="departmentId"
// 								label="Department ID"
// 								value={this.state.departmentId}
// 								onChange={this.onInputChange}
// 								/>
// 							</Grid>

// 							<Grid item xs={6}>
// 								<TextValidator
// 								fullWidth
// 								margin="normal"
// 								name="productServicePfId"
// 								label="Product/Service PF ID"
// 								value={this.state.productServicePfId}
// 								onChange={this.onInputChange}
// 								/>
// 							</Grid>
// 						</Grid>
// 					</div>

// 					<div className={classes.root}>
// 						<Grid container spacing={24}>
// 							<Grid item xs={6}>
// 								<TextValidator
// 								fullWidth
// 								margin="normal"
// 								name="typeId"
// 								label="Type ID"
// 								value={this.state.typeId}
// 								onChange={this.onInputChange}
// 								/>
// 							</Grid>

// 							<Grid item xs={6}>
// 								<TextValidator
// 								fullWidth
// 								margin="normal"
// 								name="kycTypeId"
// 								label="Type ID Number"
// 								value={this.state.kycTypeId}
// 								onChange={this.onInputChange}
// 								/>
// 							</Grid>
// 						</Grid>
// 					</div>

// 					<div className="d-flex justify-content-start pt-4">
// 						<Typography variant="caption" gutterBottom>
// 							Note: All Fields are Mandatory Except Remarks
// 						</Typography> 
// 					</div> 

// 					<div className="d-flex justify-content-center pt-4">
// 						<Button
// 						type="submit"
// 						variant="contained"
// 						color="primary"
// 						className={classes.button}
// 						disabled={submitted}
// 						>
// 						{submitted ? 'Updating...' : 'Update Vendor'}
// 						</Button>
// 					</div>
// 				</ValidatorForm>
//               )}
//             </div>
//           </Paper>
//         </div>
//       </div>
//     );
//   }
// }

// export default withStyles(styles)(VendorRegistrations);



























// import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
// import {withStyles} from '@material-ui/core/styles';
// import { 
//     Paper, 
//     FormControl, 
//     InputLabel, 
//     MenuItem, 
//     Select, 
//     OutlinedInput, 
//     Radio,
//     Dialog,
//     DialogContent,
//     DialogContentText,
//     Button,
//     Snackbar,
//     IconButton
// } from '@material-ui/core';
// import CloseIcon from '@material-ui/icons/Close';
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

// class VendorRegistrations extends Component{
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			// Input fields
// 			name: "",
// 			officeLocation: "",
// 			designation: "",
// 			contactPerson: "",
// 			contactNumber: "",
// 			contactEmail: "",
// 			commonName: "",
// 			kycNumber: "",
	
// 			// Select fields
// 			categoryId: "",
// 			departmentId: "",
// 			productServicePfId: "",
// 			typeId: "",
// 			kycTypeId: "",
	
// 			// Other states
// 			info: [],
// 			updateInfo: [],
// 			userData: [],
// 			message: "",
// 			alert: false,
// 			alertMessage: "",
// 			submitted: false,
// 			open: false,
// 		};
	
// 		this.initialState = { ...this.state };
	
// 		// Bind methods
// 		this.onInputChange = this.onInputChange.bind(this);
// 		this.onSelectChange = this.onSelectChange.bind(this);
// 		this.onSubmit = this.onSubmit.bind(this);
// 		this.openModal = this.openModal.bind(this);
// 		this.closeModal = this.closeModal.bind(this);
// 	}
	
// 	// Method to handle input field changes
// 	onInputChange(event) {
// 		this.setState({ [event.target.name]: event.target.value });
// 	}
	
// 	// Method to handle select field changes
// 	onSelectChange(event) {
// 		this.setState({ [event.target.name]: event.target.value });
// 	}
	
// 	// Method to handle form submission
// 	onSubmit(event) {
// 		event.preventDefault();
	
// 		const {
// 			name, officeLocation, designation, contactPerson, contactNumber,
// 			contactEmail, commonName, kycNumber, categoryId, departmentId,
// 			productServicePfId, typeId, kycTypeId
// 		} = this.state;
	
// 		if (
// 			name && officeLocation && designation && contactPerson && contactNumber &&
// 			contactEmail && commonName && kycNumber && categoryId && departmentId &&
// 			productServicePfId && typeId && kycTypeId
// 		) {
// 			// All fields are filled, proceed with submission
// 			this.setState({ submitted: true });
	
// 			const formData = {
// 				name,
// 				officeLocation,
// 				designation,
// 				contactPerson,
// 				contactNumber,
// 				contactEmail,
// 				commonName,
// 				kycNumber,
// 				categoryId,
// 				departmentId,
// 				productServicePfId,
// 				typeId,
// 				kycTypeId
// 			};
	
// 			console.log("Form Data Submitted: ", formData);
	
// 			// Call the API or handle form submission logic here
// 			AppAPI.adminManageUsers.post(null, formData)
// 				.then((resp) => {
// 					console.log("User Created: ", resp);
// 					this.setState({
// 						message: resp.message,
// 						open: true,
// 						submitted: false
// 					});
// 				})
// 				.catch((error) => {
// 					console.error("Error Creating User: ", error);
// 					this.setState({
// 						alert: true,
// 						alertMessage: error.message,
// 						submitted: false
// 					});
// 				});
// 		} else {
// 			// If any field is missing, show an alert
// 			this.setState({
// 				alert: true,
// 				alertMessage: "All fields are required!"
// 			});
// 		}
// 	}
	
// 	// Open modal method
// 	openModal() {
// 		this.setState({ open: true });
// 	}
	
// 	// Close modal method
// 	closeModal() {
// 		this.setState({ open: false });
// 	}
	
// 	render(){
// 		const { classes } = this.props;
// const { submitted } = this.state;
// const isSelected = this.state.selectedValue;
// return (
//     <div>
//         <p className="titleCard">Vendor / Registration Form</p>
//         <div className="d-flex justify-content-center">
//             <Paper style={{ width: "400px" }}>
//                 <h6 className="customHeader">Vendor Registration</h6>
//                 <div className="container p-4">
// 				<Radio
//                         checked={this.state.selectedValue === 'Register Vendor'}
//                         onChange={this.handleCheckedCreate}
//                         value="Register Vendor"
//                         name="radio-button-demo"
//                         classes={{
//                             root: classes.radio,
//                         }}
//                     />
//                     <label>Register Vendor</label>
//                     <Radio
//                         checked={this.state.selectedValue === 'Update Vendor'}
//                         onChange={this.handleCheckedUpdate}
//                         value="Update Vendor"
//                         name="radio-button-demo"
//                         classes={{
//                             root: classes.radio,
//                         }}
//                     />
//                     <label>Update Vendor</label>

//                     {isSelected === 'Register Vendor' ? (
//                         <ValidatorForm ref="form" onSubmit={this.onSubmit}>
//                             <TextValidator
//                                 fullWidth
//                                 margin="normal"
//                                 name="name"
//                                 label="Vendor Name"
//                                 value={this.state.name}
//                                 onChange={this.validateChange}
//                                 validators={['required']}
//                                 errorMessages={['Vendor Name is required']}
//                             />

//                             <TextValidator
//                                 fullWidth
//                                 margin="normal"
//                                 name="office-location"
//                                 label="Office Location"
//                                 value={this.state.officeLocation}
//                                 onChange={this.validateChange}
//                             />

//                             <TextValidator
//                                 fullWidth
//                                 margin="normal"
//                                 name="designation"
//                                 label="Designation"
//                                 value={this.state.designation}
//                                 onChange={this.validateChange}
//                             />

//                             <TextValidator
//                                 fullWidth
//                                 margin="normal"
//                                 name="contact-person"
//                                 label="Contact Person"
//                                 value={this.state.contactPerson}
//                                 onChange={this.validateChange}
//                             />

//                             <TextValidator
//                                 fullWidth
//                                 margin="normal"
//                                 name="contact-number"
//                                 label="Contact Number"
//                                 value={this.state.contactNumber}
//                                 onChange={this.validateChange}
//                                 validators={['required', 'matchRegexp:^[6-9][0-9]{9}$']}
//                                 errorMessages={['Contact Number is required']}
//                             />

//                             <TextValidator
//                                 fullWidth
//                                 margin="normal"
//                                 name="contact-email"
//                                 label="Contact Email"
//                                 value={this.state.contactEmail}
//                                 onChange={this.validateChange}
//                                 validators={['required', 'isEmail']}
//                                 errorMessages={['Email is required', 'Email is not valid']}
//                             />

//                             <TextValidator
//                                 fullWidth
//                                 margin="normal"
//                                 name="common-name"
//                                 label="Common Name"
//                                 value={this.state.commonName}
//                                 onChange={this.validateChange}
//                             />

//                             <FormControl
//                                 style={{ marginTop: "1rem" }}
//                                 fullWidth
//                                 variant="outlined"
//                                 className="form">
//                                 <InputLabel htmlFor="category-id">Category ID</InputLabel>
//                                 <Select
//                                     value={this.state.categoryId}
//                                     onChange={this.onInputChangeCategoryId}
//                                     input={
//                                         <OutlinedInput
//                                             labelWidth={this.state.labelWidth}
//                                             name="categoryId"
//                                             id="category-id"
//                                         />
//                                     }>
//                                     <MenuItem value={1}>Category 1</MenuItem>
//                                     <MenuItem value={2}>Category 2</MenuItem>
//                                     <MenuItem value={3}>Category 3</MenuItem>
//                                 </Select>
//                             </FormControl>

//                             <FormControl
//                                 style={{ marginTop: "1rem" }}
//                                 fullWidth
//                                 variant="outlined"
//                                 className="form">
//                                 <InputLabel htmlFor="department-id">Department ID</InputLabel>
//                                 <Select
//                                     value={this.state.departmentId}
//                                     onChange={this.onInputChangeDepartmentId}
//                                     input={
//                                         <OutlinedInput
//                                             labelWidth={this.state.labelWidth}
//                                             name="departmentId"
//                                             id="department-id"
//                                         />
//                                     }>
//                                     <MenuItem value={1}>Department 1</MenuItem>
//                                     <MenuItem value={2}>Department 2</MenuItem>
//                                 </Select>
//                             </FormControl>

//                             <FormControl
//                                 style={{ marginTop: "1rem" }}
//                                 fullWidth
//                                 variant="outlined"
//                                 className="form">
//                                 <InputLabel htmlFor="product-service-pf-id">Product/Service PF ID</InputLabel>
//                                 <Select
//                                     value={this.state.productServicePfId}
//                                     onChange={this.onInputChangeProductServicePfId}
//                                     input={
//                                         <OutlinedInput
//                                             labelWidth={this.state.labelWidth}
//                                             name="productServicePfId"
//                                             id="product-service-pf-id"
//                                         />
//                                     }>
//                                     <MenuItem value={1}>Product 1</MenuItem>
//                                     <MenuItem value={2}>Product 2</MenuItem>
//                                 </Select>
//                             </FormControl>

//                             <FormControl
//                                 style={{ marginTop: "1rem" }}
//                                 fullWidth
//                                 variant="outlined"
//                                 className="form">
//                                 <InputLabel htmlFor="type_id">Type ID</InputLabel>
//                                 <Select
//                                     value={this.state.typeId}
//                                     onChange={this.onInputChangeTypeId}
//                                     input={
//                                         <OutlinedInput
//                                             labelWidth={this.state.labelWidth}
//                                             name="typeId"
//                                             id="type_id"
//                                         />
//                                     }>
//                                     <MenuItem value={1}>Type 1</MenuItem>
//                                     <MenuItem value={2}>Type 2</MenuItem>
//                                 </Select>
//                             </FormControl>

//                             <FormControl
//                                 style={{ marginTop: "1rem" }}
//                                 fullWidth
//                                 variant="outlined"
//                                 className="form">
//                                 <InputLabel htmlFor="kyc-type-id">KYC Type ID</InputLabel>
//                                 <Select
//                                     value={this.state.kycTypeId}
//                                     onChange={this.onInputChangeKycTypeId}
//                                     input={
//                                         <OutlinedInput
//                                             labelWidth={this.state.labelWidth}
//                                             name="kycTypeId"
//                                             id="kyc-type-id"
//                                         />
//                                     }>
//                                     <MenuItem value={1}>KYC Type 1</MenuItem>
//                                     <MenuItem value={2}>KYC Type 2</MenuItem>
//                                 </Select>
//                             </FormControl>

//                             <TextValidator
//                                 fullWidth
//                                 margin="normal"
//                                 name="kyc-number"
//                                 label="KYC Number"
//                                 value={this.state.kycNumber}
//                                 onChange={this.validateChange}
//                             />

//                             <div className="d-flex justify-content-center pt-4">
//                                 <Button
//                                     type="submit"
//                                     color="primary"
//                                     variant="contained"
//                                     classes={{
//                                         root: classes.button,
//                                         label: classes.label
//                                     }}
//                                     disabled={submitted}>
//                                     {(submitted && <Progress />) || (!submitted && 'Submit')}
//                                 </Button>
//                             </div>
//                         </ValidatorForm>
//                     ) : null
// 					}
//                 </div>
//             </Paper>
//         </div>
//     </div>
// );

		
// 	}
// }
// export default withStyles(styles)(VendorRegistrations);
















// import React, {Component} from 'react';
// class VendorRegistrations extends Component{
	
// 	render(){
// 		return(
// 			<div>
// 				<p className="titleCard">Menu / Vendor Registration</p>
//                 <div className="d-flex justify-content-center">
//                     <img src="/assets/images/coming-soon.png" alt="Coming Soon"
//                             className="img-fluied d-flex justify-content-center" style={{height: "250px", width:"200px", paddingTop: "10vh"}}/>
//                 </div>
//             </div>
// 		);
// 	}
// }
// export default (VendorRegistrations);