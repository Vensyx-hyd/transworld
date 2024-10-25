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
class MaintenanceSchedule extends React.Component {

  gridExcelExport;

  constructor(props){
    super(props);
    this.state = {
      getApi: false,
      rows: [],
      total:[],
      reItems:[],
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

  getMaintenance() {
    AppAPI.maintenanceReport.get(null, null).then((resp) => {
      console.log(resp.details, "Get Drivers");
      this.setState({
        rows: resp.details,
        getApi: true,
        total: resp.details.length
      })
      this.setState(this.createState(0, this.state.pageNo));
    }).catch((err) => console.log(err))
  }

  componentWillMount(){
    this.getMaintenance();    
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
    }else if ((event.target.value === "") && (this.state.apply === false) ) {      
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
      AppAPI.maintenanceReport.get(('?from='+from+'&to='+to), null).then((resp) => {
        console.log(resp.details, "Get Data");
        this.setState({
          items: resp.details,
          reItems: resp.details,
          filter: true,
          total:resp.details.length,
          pageNo:resp.details.length,
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
                  aria-label="Directions" onClick={this.exportExcel} >                   
                      <img src="/assets/icons/export_excel.png" className="selectionControlPdf" alt="Excel"/>
                </IconButton>
              </Paper>
            </div>               
          </div>
        </div>        
        </GridToolbar>      
        {/* <GridColumn field='mainId' title='S.No' width='100'/> */}
        <GridColumn field='trailerNo' title='Trailer No.' width='150'/>
        <GridColumn field='kmsDone' title='Distance Travelled (Km)' width='220'/>
        <GridColumn field='lastServiceDate' title='Last Service Date' width='200'/>
        <GridColumn field='dueServiceDate' title='Due Service Date' width='200'/>
        <GridColumn field='lastServiceKm' title='Last Service (Km)' width='200' />
        <GridColumn field='dueKm' title='Due Service (Km)' width='200'/>        
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
         <p className="titleCard">Reports / Master / Maintenance</p>
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

MaintenanceSchedule.propTypes = {
  classes: PropTypes.object.isRequired,
};
  
export default withStyles(tableStyles) (MaintenanceSchedule);