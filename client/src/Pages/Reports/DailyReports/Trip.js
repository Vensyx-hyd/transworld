import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  withStyles,
  Paper,
  InputBase,
  Divider,
  IconButton,
  Button,
} from '@material-ui/core';

import moment from 'moment';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import SearchIcon from '@material-ui/icons/Search';
import {GridToolbar,Grid,GridColumn} from '@progress/kendo-react-grid';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import '@progress/kendo-theme-material/dist/all.css';

import AppAPI from './../../../API';
import tableStyles from '../../../Styles/tableStyles';
import Loading from '../../../Components/Loading/Loading';
import Spinner from '../../../Components/Loading/Spinner';
class Trip extends React.Component {

  gridExcelExport;

  constructor(props){
    super(props);
    this.state = {
      getApi: false,
      rows: [],
      total: [],
      reItems: [],
      pageNo: 5,
      dateSelectFrom: null,
      fromDate: "",
      dateSelectTo: null,
      toDate: "",
      filter: false,
      apply: false,
      submit: false
    }
    this.handleInputSearch = this.handleInputSearch.bind(this);
    this.handleDateChangeFrom = this.handleDateChangeFrom.bind(this);
    this.handleDateChangeTo = this.handleDateChangeTo.bind(this);
    this.getDateRange = this.getDateRange.bind(this);
    this.clear = this.clear.bind(this);
  }

  getTrips() {
    AppAPI.dailyTripReport.get(null, null).then((resp) => {
      console.log(resp.dailyTrips, "Get Trips");
      this.setState({
        rows: resp.dailyTrips,
        getApi: true,
        total: resp.dailyTrips.length
      })
      this.setState(this.createState(0, this.state.pageNo));
    }).catch((err) => console.log(err))
  }

  componentWillMount(){
    this.getTrips();    
  }

  pageChange = (event) => {
    this.setState(this.createState(event.page.skip, event.page.take));
  }

  dailyTrips(){
    if (this.state.filter === true) {
      return this.state.items
    } else if (this.state.filter === false) {
      return this.state.rows
    }
  }

  handleInputSearch(event) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
    this.setState({ filter: true })
    let reItemsData = this.state.reItems;
    let sortByDriverName = this.dailyTrips();
    if (event.target.value !== "") {
      sortByDriverName = sortByDriverName.filter(function(item){
        if (item.driverName !== null) {
        return item.driverName.toLowerCase().search(
          event.target.value.toLowerCase()) !== -1;
        }
      });    
      this.setState({
        items: sortByDriverName,
        total: sortByDriverName.length,
        pageNo: sortByDriverName.length
      })
    } else if((event.target.value === "") && (this.state.apply === true)) {
      this.setState({
        items: reItemsData,
        total: reItemsData.length,
        pageNo: reItemsData.length
      })
    } else if ((event.target.value === "") && (this.state.apply === false) ) {      
      this.state.pageNo = 5;
      this.setState({
        filter: false,
        total: this.state.rows.length
      })
      this.setState(this.createState(0, this.state.pageNo));
    }
  }

  createState(skip, take) {
    return {
        items: this.state.rows.slice(skip, skip + take),
        skip: skip,
        pageSize: take
    };
  }

  exportExcel = () => {
    var data = null;
    if (this.state.filter === true) {    
      data = this.state.items;
    } else if (this.state.filter === false) {    
      data = this.state.rows;
    }  
    this.gridExcelExport.save(data);  
  }

  handleDateChangeFrom = date => {
    if (date) {
        var selectedFrom = moment(date).format("DD-MM-YYYY");
        this.setState({
            dateSelectFrom: date,
            fromDate: selectedFrom,
        });
    }
  };

  handleDateChangeTo = date => {
      if (date) {
          var selectedTo = moment(date).format("DD-MM-YYYY");
          this.setState({
              dateSelectTo: date,
              toDate: selectedTo,
          });
      }   
  }  

  getDateRange(from) { 
   if (from  !== "") {
       this.setState({submit: true})
       AppAPI.dailyTripReport.get(('?from='+from), null).then((resp) => {
        console.log(resp.dailyTrips, "Get Date Range Trip");
        this.setState({
          items: resp.dailyTrips,
          reItems: resp.dailyTrips,
          filter: true,
          total: resp.dailyTrips.length,
          pageNo: resp.dailyTrips.length,
          apply: true,
          submit: false
        })
      }).catch((err) => console.log(err))
    }
  }

  clear() {
    this.state.pageNo = 5;
    this.setState(this.createState(0, this.state.pageNo));
    this.setState({
      dateSelectFrom: null,
      dateSelectTo: null,
      fromDate: "",
      toDate: "",
      filter: false,
      apply: false,
      total: this.state.rows.length,
      submit: false
    })
  }

  render(){
    const { getApi, rows, dateSelectFrom, dateSelectTo, fromDate, toDate, submit } = this.state;
    const { classes } = this.props;
    const grid =(      
      <Grid 
        total={this.state.total}
        pageSize={this.state.pageNo}
        onPageChange={this.pageChange.bind(this)}
        data={this.state.items}
        skip={this.state.skip}
        pageable={true}
      >        
        <GridToolbar>       
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 ">
          <div className="row">
            <div className="col-2 col-sm-2 col-md-2 col-lg-2">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                    className={classes.calendarRoot}
                    keyboard
                    fullWidth
                    clearable
                    maxDate={dateSelectTo}
                    margin="normal"
                    label="Select Date"
                    value={dateSelectFrom}
                    onChange={this.handleDateChangeFrom}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div className="col-6 col-sm-6 col-md-6 col-lg-6">
              <Button              
                disabled={submit}
                variant="contained"
                color="primary" 
                classes={{
                  root: classes.mainButtonCss, 
                  label: classes.label,
                }}                
                onClick={() => { this.getDateRange(fromDate, toDate) }}             
                >
                {
                  (submit && <Spinner/>)
                  ||
                  (!submit && 'Apply')
                }
              </Button>
              <Button
                variant="outlined"
                color="secondary" 
                classes={{
                  root: classes.mainButtonCssClear, 
                  label: classes.label,
                }}            
                onClick={() => { this.clear() }}
                >
                Clear
              </Button>                   
            </div> 
            <div className="col-4 col-sm-4 col-md-4 col-lg-4">
              <Paper className={classes.barRootAuto} elevation={1}>
                <IconButton className={classes.searchIcon} aria-label="Menu">
                  <SearchIcon />
                </IconButton>
                <InputBase 
                  className={classes.barInput} 
                  placeholder="Search Driver Name"  
                  onChange={this.handleInputSearch}                    
                />
                <Divider className={classes.barDivider} />
                <IconButton title="Export Excel" color="primary" className={classes.barIconButton} 
                  aria-label="Directions" onClick={this.exportExcel}>                    
                        <img src="/assets/icons/export_excel.png" className="selectionControlPdf" alt="Excel"/>                       
                </IconButton>
              </Paper>
            </div>                    
          </div>         
        </div>        
        </GridToolbar>    
        {/* <GridColumn field='' title='S.No' width='100'/> */}
        <GridColumn field='date' title='Date' width='150'/>
        <GridColumn field='tripNo' title='Trip No.' width='100'/>
        <GridColumn field='tripType' title='Trip Type' width='200'/>
        <GridColumn field='trailerNo' title='Trailer No.' width='150' />
        <GridColumn field='driverName' title='Driver Name' width='240'/>
        <GridColumn field='startLoc' title='Start Location' width='250' />
        <GridColumn field='endLoc' title='End Location' width="250"/>
        <GridColumn field='cycle' title='Cycle' width='200'/>
        <GridColumn field='cont1' title='Container No.1' width='220'/>
        <GridColumn field='cont2' title='Container No.2' width='220'/>
        <GridColumn field='size' title='Size' width='220'/>     
        {/* <GridColumn field='' title='Start Km' width='220'/>        
        <GridColumn field='' title='End Km' width='220'/>        
        <GridColumn field='' title='Avg. Mileage' width='220'/>         */}
        <GridColumn field='dieselUsage' title='Diesel Usage' width='220'/>        
        <GridColumn field='startTime' title='Act. Start Time' width='150'/>           
        <GridColumn field='endTime' title='Act. End Time' width='150'/>           
        <GridColumn field='TAT' title='TAT' width='220'/>           
        {/* <GridColumn field='' title='Remarks' width='220'/>            */}
      </Grid>
    );
    return(   
      getApi === false
      ?
      <div className="container" style={{position:"relative", top:"15rem"}}> 
        <div className="d-flex justify-content-center pt-50">
          <Loading/>
        </div>
      </div>     
      :       
      rows.length === 0
      ?
      <div className="container" style={{position:"relative", top:"15rem"}}> 
        <div className="d-flex justify-content-center pt-50">
          No Data Found !
        </div>  
      </div>
      :
      <div>
         <p className="titleCard">Reports / Daily / Trip</p>
          <Paper className={classNames(classes.root)}> 
            <ExcelExport
              data={this.state.items}
              ref = { exporter => this.gridExcelExport = exporter }
            >
              { grid }
            </ExcelExport>
        </Paper>  
      </div>      
    );
  }
}

Trip.propTypes = {
  classes: PropTypes.object.isRequired,
};
  
export default withStyles(tableStyles)(Trip);