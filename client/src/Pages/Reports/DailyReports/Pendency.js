import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  withStyles,
  Paper,
  IconButton,
  Button,
} from '@material-ui/core';

import moment from 'moment';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import {GridToolbar,Grid,GridColumn} from '@progress/kendo-react-grid';
import { ExcelExport } from '@progress/kendo-react-excel-export'
import '@progress/kendo-theme-material/dist/all.css';

import AppAPI from './../../../API';
import tableStyles from '../../../Styles/tableStyles';
import Loading from '../../../Components/Loading/Loading';
import Spinner from '../../../Components/Loading/Spinner';

class Pendency extends React.Component {

  gridExcelExport;
  
  constructor(props){
    super(props);
    this.state = {
      getApi: false,
      rows: [],  
      total:[],
      pageNo: 5,    
      dateSelectFrom: null,
      fromDate: "",
      dateSelectTo: null,
      toDate: "",
      filter: false,
      apply: false,
      submit: false      
    }
    this.handleDateChangeFrom = this.handleDateChangeFrom.bind(this);
    this.handleDateChangeTo = this.handleDateChangeTo.bind(this);
    this.getDateRange = this.getDateRange.bind(this);
    this.clear = this.clear.bind(this);
  }

  getPendency() {
    AppAPI.pendencyReport.get(null, null).then((resp) => {
      console.log(resp.pendency, "Get Pendency");
      this.setState({
        rows: resp.pendency,
        getApi: true,
        total: resp.pendency.length
      })
      this.setState(this.createState(0, this.state.pageNo));
    }).catch((err) => console.log(err))
  }

  componentWillMount(){
    this.getPendency();    
  }

  pageChange = (event) => {
    this.setState(this.createState(event.page.skip, event.page.take));
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
    if (from !== "") {
        this.setState({submit: true})
        AppAPI.pendencyReport.get(('?from='+from), null).then((resp) => {
        console.log(resp.pendency, "Get Pendency");
        this.setState({
          items: resp.pendency,
          filter: true,
          total: resp.pendency.length,
          pageNo: resp.pendency.length,
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
      filter: false,
      apply: false,
      total: this.state.rows.length,
      submit: false
    })
  }

  render(){
    const { getApi, rows, dateSelectFrom, dateSelectTo, fromDate, submit} = this.state;
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
           
            <div className="col-9 col-sm-9 col-md-9 col-lg-9">
              <Button                
                disabled={submit}
                variant="contained"
                color="primary" 
                classes={{
                  root: classes.mainButtonCss, 
                  label: classes.label,
                }}   
                onClick={() => { this.getDateRange(fromDate) }}             
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
                  label: classes.label
                }}            
                onClick={() => { this.clear() }}
                >
                Clear
              </Button>                 
            </div>   
            <div className="col-1 col-sm-1 col-md-1 col-lg-1">
              <IconButton title="Export Excel" color="primary" className={classes.barIconButton} style={{float: 'right'}}
                  aria-label="Directions" onClick={this.exportExcel} >                   
                      <img src="/assets/icons/export_excel.png" className="selectionControlPdf" alt="Excel"/>
                </IconButton> 
            </div>                      
          </div>
        </div>        
        </GridToolbar>      
        {/* <GridColumn field='' title='S.No' width='100'/> */}
        <GridColumn field='date' title='Date' width='150'/>
        <GridColumn field='vesselName' title='Vessel Name' width='250'/>
        <GridColumn field='containerNo' title='Container No.' width='150'/>
        <GridColumn field='size' title='Size' width='100'/>
        <GridColumn field='type' title='Type' width='80'/>
        <GridColumn field='berthing_Date' title='Berthing Date Time' width='210' />
        <GridColumn field='cycle' title='Cycle' width="150"/>
        <GridColumn field='line' title='Line' width='200'/>
        <GridColumn field='dwellDaysatPortCFS' title='Dwell Days at Port/CFS' width='200'/>
        <GridColumn field='plannedDateforMovement' title='Planned Date for Movement' width='220'/>        
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
         <p className="titleCard">Reports / Daily / Pendency</p>
          <Paper className={classNames(classes.root)}> 
            <ExcelExport
              data={this.state.items}
              ref = { exporter => this.gridExcelExport = exporter }
            >
              {grid}
            </ExcelExport>          
        </Paper>  
      </div>      
    );
  }
}

Pendency.propTypes = {
  classes: PropTypes.object.isRequired,
};
  
export default withStyles(tableStyles) (Pendency);