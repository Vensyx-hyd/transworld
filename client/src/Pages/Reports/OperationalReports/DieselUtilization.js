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
class DieselUtilization extends React.Component {

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

  getDieselUtilization() {
    AppAPI.dieselUtilReport.get(null, null).then((resp) => {
      console.log(resp.dieselUtil, "Get Diesel Util");
      this.setState({
        rows: resp.dieselUtil,
        getApi: true,
        total:resp.dieselUtil.length
      })
      this.setState(this.createState(0, this.state.pageNo));
    }).catch((err) => console.log(err))
  }

  componentWillMount(){
    this.getDieselUtilization();    
  }

  pageChange = (event) => {
    this.setState(this.createState(event.page.skip, event.page.take));
  }

  dieselUtil() {
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
    let sortBySearch = this.dieselUtil(); 
    if (event.target.value !== "") {
        sortBySearch = sortBySearch.filter(function(item){
        if (item.trailerNo && item.driverName !== null) {
        return (
          item.trailerNo.toLowerCase().search(event.target.value.toLowerCase()) !== -1
          ||
          item.driverName.toLowerCase().search(event.target.value.toLowerCase()) !== -1
          )
        }
      });    
      this.setState({
        items: sortBySearch,
        total: sortBySearch.length,
        pageNo: sortBySearch.length
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
      AppAPI.dieselUtilReport.get(('?from='+from+'&to='+to), null).then((resp) => {
        console.log(resp.dieselUtil, "Get Pendency");
        this.setState({
          items: resp.dieselUtil,
          filter: true,
          reItems: resp.dieselUtil,
          filter: true,
          total: resp.dieselUtil.length,
          pageNo: resp.dieselUtil.length,
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
      total: this.state.rows.length,
      apply: false,
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
            <div className="col-3 col-sm-3 col-md-3 col-lg-3">
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
            <div className="col-5 col-sm-5 col-md-5 col-lg-5">
              <Paper className={classes.barRootAuto} elevation={1}>
                <IconButton className={classes.searchIcon} aria-label="Menu">
                  <SearchIcon />
                </IconButton>
                <InputBase 
                className={classes.barInput} 
                placeholder="Search Trailer No. & Driver Name"  
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
        {/* <GridColumn field='' title='S.No' width='120'/> */}
        <GridColumn field='date' title='Date' width='150'/>
        <GridColumn field='trailerNo' title='Trailer No.' width='150'/>
        <GridColumn field='driverName' title='Driver Name' width='250'/>
        <GridColumn field='tripType' title='Trip Type' width='150'/>
        <GridColumn field='cycle' title='Cycle' width='150'/>
        <GridColumn field='cont1' title='Container No.1' width='150' /> 
        <GridColumn field='cont2' title='Container No.2' width='150' /> 
        <GridColumn field='size' title='Size' width='100' /> 
        {/* <GridColumn field='type' title='Type' width='100' />  */}
        {/* <GridColumn field='containerWt' title='Gross Wt. of container.1' width='200' /> 
        <GridColumn field='' title='Gross Wt. of container.2' width='200' /> */}
        {/* <GridColumn field='' title='Start Km' width='150' /> 
        <GridColumn field='' title='End Km' width='150' />  */}
        <GridColumn field='runkm' title='Run Km' width='150' /> 
        {/* <GridColumn field='opDiesel' title='OP Diesel' width='150' />  */}
        {/* <GridColumn field='' title='CI Diesel' width='150' />  */}
        {/* <GridColumn field='' title='Diesel Issued' width='200' />  */}
        <GridColumn field='dieselUsage' title='Diesel Spent' width='200' /> 
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
         <p className="titleCard">Reports / Operational / Diesel Utilization</p>
          <Paper className={classNames(classes.root)}> 
            <ExcelExport
              data={ this.state.items }
              ref = { exporter => this.gridExcelExport = exporter }
            >
              {grid}
            </ExcelExport>
        </Paper>  
      </div>      
    );
  }
}

DieselUtilization.propTypes = {
  classes: PropTypes.object.isRequired,
};
  
export default withStyles(tableStyles)(DieselUtilization);