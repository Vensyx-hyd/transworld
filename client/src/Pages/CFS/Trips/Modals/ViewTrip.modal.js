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

import AppAPI from './../../../../API';
import tableStyles from './../../../../Styles/tableStyles';
import Loading from './../../../../Components/Loading/Loading';
import Spinner from './../../../../Components/Loading/Spinner';

class ViewTripModal extends React.Component {

  gridExcelExport;

  constructor(props){
    super(props);
    this.state = {
      getApi: this.props.getApi,
      rows: this.props.rows,
      total: this.props.total,
      reItems: [],
      pageNo: 5,
      dateSelectFrom: null,
      fromDate: "",
      dateSelectTo: null,
      toDate: "",
      filter: false,
      apply:false,
      submit: false
    }
    this.handleInputSearch = this.handleInputSearch.bind(this);
    this.handleDateChangeFrom = this.handleDateChangeFrom.bind(this);
    this.handleDateChangeTo = this.handleDateChangeTo.bind(this);
    this.getDateRange = this.getDateRange.bind(this);
    this.clear = this.clear.bind(this);
  }

  getManagerTrips() {    
    this.setState(this.createState(0, this.state.pageNo));    
  }

  componentWillMount(){
    // this.props.getManagerTrips();
    this.getManagerTrips();    
  }

  pageChange = (event) => {
    this.setState(this.createState(event.page.skip, event.page.take));
  }

  trailerNo(){
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
    let sortByTrailerNo = this.trailerNo();
    if (event.target.value !== "") {
      sortByTrailerNo = sortByTrailerNo.filter(function(item){
        if (item.trailerNo !== null) {
        return item.trailerNo.toLowerCase().search(
          event.target.value.toLowerCase()) !== -1;
        }
      });    
      this.setState({
        items: sortByTrailerNo,
        total: sortByTrailerNo.length,
        pageNo: sortByTrailerNo.length
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

  getDateRange(from, to) { 
    if (from && to !== "") {
      this.setState({submit: true})
      AppAPI.managerTrips.get(('?from='+from+'&to='+to), null).then((resp) => {
        console.log(resp.trips, "Get Date Range");
        this.setState({
          items: resp.trips,
          reItems: resp.trips,
          filter: true,
          total: resp.trips.length,
          pageNo:resp.trips.length,
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
                    label="From Date"
                    value={dateSelectFrom}
                    onChange={this.handleDateChangeFrom}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div className="col-2 col-sm-2 col-md-2 col-lg-2">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>                                           
                <DatePicker
                    className={classes.calendarRoot}
                    keyboard
                    fullWidth
                    clearable
                    minDate={dateSelectFrom}
                    margin="normal"
                    label="To Date"
                    value={dateSelectTo}
                    onChange={this.handleDateChangeTo}
                />
              </MuiPickersUtilsProvider>       
            </div>
            <div className="col-4 col-sm-4 col-md-4 col-lg-4">
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
                  placeholder="Search Trailer No."  
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
        <GridColumn field='tripNo' title='Trip No.' width='100'/>
        <GridColumn field='tripType' title='Trip Type' width='120'/>
        <GridColumn field='startLocationName' title='Start Location'/>
        <GridColumn field='endLocationName' title='End Location'/>
        <GridColumn field='startDate' title='Est. Start Date Time'/>
        <GridColumn field='endDate' title='Est. End Date Time'/>
        <GridColumn field='driverName' title='Driver Name'/>
        <GridColumn field='trailerNo' title='Trailer No.'/>
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
          <Paper className={classNames(classes.root)}>
            <ExcelExport
              data={this.state.items}
              ref ={exporter => this.gridExcelExport = exporter}
            >
              {grid}
            </ExcelExport> 
        </Paper>  
      </div>      
    );
  }
}

ViewTripModal.propTypes = {
  classes: PropTypes.object.isRequired,
};
  
export default withStyles(tableStyles)(ViewTripModal);