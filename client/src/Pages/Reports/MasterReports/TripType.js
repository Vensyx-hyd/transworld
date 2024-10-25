import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  withStyles,
  Paper,
  IconButton,
  Divider,
  InputBase
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import {GridToolbar,Grid,GridColumn} from '@progress/kendo-react-grid';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import '@progress/kendo-theme-material/dist/all.css';

import AppAPI from './../../../API';
import tableStyles from '../../../Styles/tableStyles';
import Loading from '../../../Components/Loading/Loading';
class TripType extends React.Component {

  gridExcelExport;

  constructor(props){
    super(props);
    this.state = {
      getApi: false,
      rows: [],
      total: [],
      pageNo: 5,
      filter: false
    }
    this.handleInputSearch = this.handleInputSearch.bind(this);
  }

  getTripTypes() {
    AppAPI.tripsReport.get(null, null).then((resp) => {
      console.log(resp.trips, "Get Trips");
      this.setState({
        rows: resp.trips,
        getApi: true,
        total: resp.trips.length
      })  
      this.setState(this.createState(0, this.state.pageNo));
    }).catch((err) => console.log(err))
  }

  componentWillMount(){
    this.getTripTypes();    
  }

  pageChange = (event) => {
    this.setState(this.createState(event.page.skip, event.page.take));
  }

  tripType(){
    if (this.state.filter === true) {
      return this.state.items
    } else if (this.state.filter === false) {
      return this.state.rows
    }
  }
  handleInputSearch(event) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
    let sortByLoc = this.tripType();
    if (event.target.value !== "") {
      sortByLoc = sortByLoc.filter(function(item){
        if (item.startLoc && item.endLoc !== null) {
        return (
        item.startLoc.toLowerCase().search(event.target.value.toLowerCase()) !== -1 
        ||
        item.endLoc.toLowerCase().search(event.target.value.toLowerCase()) !== -1
        );
        }
      });    
      this.setState({
        items: sortByLoc,
        filter: true,
        total: sortByLoc.length,
        pageNo: sortByLoc.length
      })
    } else {
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
            <Paper className={classes.tripBarRoot} elevation={1}>
              <IconButton className={classes.searchIcon} aria-label="Menu">
                <SearchIcon />
              </IconButton>
              <InputBase 
              className={classes.barInput} 
              placeholder="Search From Location & To Location"  
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
        <GridColumn field='tripId' title='Trip Id' width='100'/>
        <GridColumn field='tripTypeId' title='Trip Type' width='200'/>
        <GridColumn field='contType' title='Container Type (ft)' width='180'/>
        <GridColumn field='contWt' title='Container Gross Wt. (Ts)' width='200'/>
        <GridColumn field='' title='No. of Containers Per Trip' width='250'/>
        <GridColumn field='startLoc' title='From Location' width='250'/>
        <GridColumn field='endLoc' title='To Location' width='250'/>
        <GridColumn field='distance' title='Distance (Km)' width='150' />
        <GridColumn field='fuelReq' title='Est. Fuel (Ltr)' width="150"/>
        <GridColumn field='driInc' title='Incentive' width='150'/>
        <GridColumn field='status' title='Status' width='100'/>
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
        <p className="titleCard">Reports / Master / Trip Type</p>
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

TripType.propTypes = {
  classes: PropTypes.object.isRequired,
};
  
export default withStyles(tableStyles) (TripType);