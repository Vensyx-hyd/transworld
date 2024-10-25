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
class TrailerPerformance extends React.Component {

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
   // this.handleDateChangeTo = this.handleDateChangeTo.bind(this);
    this.getDateRange = this.getDateRange.bind(this);
    this.clear = this.clear.bind(this);
  }

  getTrailerPer() {
    AppAPI.traiPerReport.get(null, null).then((resp) => {
      console.log(resp.traiPer, "Get Trailer Performance");
      this.setState({
        rows: resp.traiPer,
        getApi: true,
        total: resp.traiPer.length
      })
      this.setState(this.createState(0, this.state.pageNo));
    }).catch((err) => console.log(err))
  }

  componentWillMount(){
    this.getTrailerPer();    
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
    let sortBytrailor_no = this.trailerNo();
    if (event.target.value !== "") {
      sortBytrailor_no= sortBytrailor_no.filter(function(item){
        if (item.trailor_no !== null) {
        return item.trailor_no.toLowerCase().search(
          event.target.value.toLowerCase()) !== -1;
        }
      });    
      this.setState({
        items: sortBytrailor_no,
        total: sortBytrailor_no.length,
        pageNo: sortBytrailor_no.length
      })
    }  else if((event.target.value === "") && (this.state.apply === true)) {
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
        var selectedFrom = moment(date).format("MM-YYYY");
        this.setState({
            dateSelectFrom: date,
            fromDate: selectedFrom,
        });
    }
  }

  getDateRange(from) { 
    if (from  !== "") {
      this.setState({submit: true})
      AppAPI.traiPerReport.get(('?from='+from), null).then((resp) => {
        console.log(resp.traiPer, "Get Trailer");
        this.setState({
          items: resp.traiPer,
          reItems: resp.traiPer,
          filter: true,
          total: resp.traiPer.length,
          pageNo: resp.traiPer.length,
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
      fromDate: "",
      filter: false,
      apply: false,
      total: this.state.rows.length,
      submit: false
    })
  }

  render(){
    const { getApi, rows, dateSelectFrom, fromDate, submit } = this.state;
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
            <div className="col-3 col-sm-3 col-md-3 col-lg-3">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                      className={classes.calendarRoot}
                      keyboard
                      fullWidth
                      clearable
                      margin="normal"
                      label="Year &amp; Month"
                      views={["year", "month"]}
                      value={dateSelectFrom}
                      onChange={this.handleDateChangeFrom}
                  />
              </MuiPickersUtilsProvider>
            </div>
            <div className="col-5 col-sm-5 col-md-5 col-lg-5">
              <Button
                disabled={submit}
                variant="contained"
                color="primary" 
                classes={{
                  root: classes.mainButtonCss, 
                  label: classes.label,
                }}               
                onClick={() => { this.getDateRange(fromDate)}}                  
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
        {/* <GridColumn field='' title='S.No.' width='120'/> */}
        <GridColumn field='month' title='Month' width='150'/>
        <GridColumn field='trailor_no' title='Trailer No.' width='200'/>
        <GridColumn field='name' title='Driver Name' width='140'/>
        <GridColumn field='shift2' title='Shift' width='240'/>        
        <GridColumn field='Tot_Trips_Done' title='Tot. Trips Done' width='240'/>   
        <GridColumn field='TEU_Loaded_Moved' title='Tot. TEU Loaded Moved' width='240'/>   
        <GridColumn field='TEU_Empty_Moved' title='Tot. TEU Empty	Moved' width='240'/>   
        <GridColumn field='Tot_Distance_Travelled' title='Tot. Distance Travelled (Km)' width='240'/>   
        <GridColumn field='Tot_Diesel_spent' title='Tot. Diesel spent (Ltr)' width='240'/>   
        <GridColumn field='Tot_Running' title='Tot. Running (Hrs)' width='240'/>   
        {/* <GridColumn field='' title='Idle Time' width='240'/>   
        <GridColumn field='' title='Maintenance Time' width='240'/>   
        <GridColumn field='' title='No. of Accidents' width='240'/>    */}
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
         <p className="titleCard">Reports / Operational / Trailer Performance</p>
          <Paper className={classNames(classes.root)}> 
            <ExcelExport
              data={this.state.items}
              ref={exporter => this.gridExcelExport = exporter}              
            >
              {grid}
            </ExcelExport>
        </Paper>  
      </div>      
    );
  }
}

TrailerPerformance.propTypes = {
  classes: PropTypes.object.isRequired,
};
  
export default withStyles(tableStyles)(TrailerPerformance);