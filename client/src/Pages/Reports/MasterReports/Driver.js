import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  withStyles,
  Paper,
  InputBase,
  Divider,
  IconButton
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import {GridToolbar,Grid,GridColumn} from '@progress/kendo-react-grid';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import '@progress/kendo-theme-material/dist/all.css';

import AppAPI from './../../../API';
import tableStyles from '../../../Styles/tableStyles';
import Loading from '../../../Components/Loading/Loading';
class Driver extends React.Component {

  gridExcelExport;

  constructor(props){
    super(props);
    this.state = {
      getApi: false,
      rows: [],
      total: [],
      reItems: [],
      pageNo: 5,
      filter: false
    }
    this.handleInputSearch = this.handleInputSearch.bind(this);
  }

  getDrivers() {
    AppAPI.driversReport.get(null, null).then((resp) => {
      console.log(resp.drivers, "Get Drivers");
      this.setState({
        rows: resp.drivers,
        getApi: true,
        total: resp.drivers.length
      })
      this.setState(this.createState(0, this.state.pageNo));
    }).catch((err) => console.log(err))
  }

  componentWillMount(){
    this.getDrivers();    
  }

  pageChange = (event) => {
    this.setState(this.createState(event.page.skip, event.page.take));
  }

  driverNames() {
    if (this.state.filter === true) {
      return this.state.items
    } else if (this.state.filter === false) {
      return this.state.rows
    }
  }
  
  handleInputSearch(event) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
    let reItemsData = this.state.reItems;
    let sortByDriverName = this.driverNames();
    if (event.target.value !== "") {
      sortByDriverName = sortByDriverName.filter(function(item){
        if (item.driverName !== null) {
        return item.driverName.toLowerCase().search(
          event.target.value.toLowerCase()) !== -1;
         
        }
      });    
      this.setState({
        items: sortByDriverName,
        filter: true,
        total: sortByDriverName.length,
        pageNo: sortByDriverName.length
      })
    } else {
      this.state.pageNo= 5;
      this.setState({
        filter: false,
        total: this.state.rows.length,
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

  render(){
    const { getApi, rows } = this.state;
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
        <div className="row float-right">
            <Paper className={classes.barRoot} elevation={1}>
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
        </GridToolbar>       
        {/* <GridColumn field='' title='S.No' width='120'/> */}
        <GridColumn field='driverName' title='Driver Name' width='250'/>
        <GridColumn field='eCode' title='E-Code' width='150'/>
        <GridColumn field='contactNo' title='Contact No.' width='150'/>
        <GridColumn field='fatherName' title='Father Name' width='200'/>
        <GridColumn field='altContactNo' title='Alternate Mobile No.' width='180' />
        <GridColumn field='dob' title='D.O.B' width="150"/>
        <GridColumn field='permanentAddress' title='Permanent Address' width='200'/>
        <GridColumn field='currentAddress' title='Current Address' width='200'/>
        <GridColumn field='dlNo' title='DL No.' width='200'/>
        <GridColumn field='dlValidity' title='DL Validity' width='200'/>
        <GridColumn field='doj' title='D.O.J' width='150'/>
        <GridColumn field='pan' title='PAN No.' width='150'/>
        <GridColumn field='aadhar' title='Aadhar No.' width='200'/>
        <GridColumn field='accountDetails' title='Bank Account Details' width='200'/>
        <GridColumn field='pf' title='PF No.' width='320'/>
        <GridColumn field='esicNo' title='ESIC No.' width='250'/>
        <GridColumn field='remarks' title='Remarks' width='150' />
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
        <p className="titleCard">Reports / Master / Driver</p>
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

Driver.propTypes = {
  classes: PropTypes.object.isRequired,
};
  
export default withStyles(tableStyles)(Driver);