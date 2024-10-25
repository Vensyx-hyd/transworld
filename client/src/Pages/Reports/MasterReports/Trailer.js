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
class Trailer extends React.Component {

  gridExcelExport;

  constructor(props){
    super(props);
    this.state = {
      getApi: false,
      rows: [],
      total: [],
      pageNo: 5,
      reItem:[],
      filter: false
    }
    this.handleInputSearch = this.handleInputSearch.bind(this);
  }

  getTrailers() {
    AppAPI.trailersReport.get(null, null).then((resp) => {
      console.log(resp.trailers, "Get Trailers");
      this.setState({
        rows: resp.trailers,
        getApi: true,
        total: resp.trailers.length
      })
      this.setState(this.createState(0, this.state.pageNo));
    }).catch((err) => console.log(err))    
  }

  componentWillMount(){
    this.getTrailers();    
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
    var sortByTrailerNo = this.trailerNo();
    if (event.target.value !== "") {
      sortByTrailerNo = sortByTrailerNo.filter(function(item){
        if (item.trailerNo !== null) {
        return item.trailerNo.toLowerCase().search(
          event.target.value.toLowerCase()) !== -1;
        }
      });    
      this.setState({
        items: sortByTrailerNo,
        filter: true,
        total: sortByTrailerNo.length,
        pageNo: sortByTrailerNo.length
      })
    } else {
      this.state.pageNo =5;
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
            <Paper className={classes.barRoot} elevation={1}>
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
        </GridToolbar>        
        <GridColumn field='trailerNo' title='Trailer No.' width='150'/>
        <GridColumn field='purchaseDate' title='Date of Purchase' width='150'/>
        <GridColumn field='vehicleModel' title='Vehicle Model' width='150'/>
        <GridColumn field='brand' title='Vehicle Make' width='150'/>
        <GridColumn field='gvv' title='GVW (Kg)' width='120'/>
        <GridColumn field='payLoadCap' title='Payload Capacity (Kg)' width='180' />
        <GridColumn field='length' title='Length (ft)' width="120"/>
        <GridColumn field='width' title='Width (ft)' width='120'/>
        <GridColumn field='height' title='Height (ft)' width='120'/>
        <GridColumn field='tyres' title='No. of Tyres (inc spare)' width='200'/>
        <GridColumn field='fuelCap' title='Fuel Tank (Ltr)' width='180'/>
        <GridColumn field='rcNo' title='RC.No' width='200'/>
        <GridColumn field='rcValidity' title='RC Validity' width='150'/>
        <GridColumn field='insNo' title='Insurance No.' width='300'/>
        <GridColumn field='insValidity' title='Insurance Validity' width='150'/>
        <GridColumn field='pucValidity' title='PUC Validity' width='150'/>
        <GridColumn field='fitnessCert' title='Fitness Certificate' width='150'/>
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
        <p className="titleCard">Reports / Master / Trailer</p>
        <Paper className={classNames(classes.root)}> 
          <ExcelExport
            data={ this.state.items }
            ref = { exporter => this.gridExcelExport = exporter }            
          >
            { grid }
          </ExcelExport>
        </Paper> 
      </div>       
    );
  }
}

Trailer.propTypes = {
  classes: PropTypes.object.isRequired,
};
  
export default withStyles(tableStyles)(Trailer);