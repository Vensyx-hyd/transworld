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
class TrainingCalender extends React.Component {

  gridExcelExport;

  constructor(props){
    super(props);
    this.state = {
      getApi: false,
      rows: [],
      total:[],
      pageNo:5,
      filter: false
    }
    this.handleInputSearch = this.handleInputSearch.bind(this);
  }

  getTrainings() {
    AppAPI.trainingsReport.get(null, null).then((resp) => {
      console.log(resp.trainings, "Get Trainings");
        this.setState({
        rows: resp.trainings,     
        getApi: true,
        total: resp.trainings.length
           
      })
      this.setState(this.createState(0, this.state.pageNo));
    }).catch((err) => console.log(err))
  }

  componentWillMount(){
    this.getTrainings();    
  }

  pageChange = (event) => {
    this.setState(this.createState(event.page.skip, event.page.take));
  }

  trainingName(){
    if (this.state.filter === true) {
      return this.state.items
    } else if (this.state.filter === false) {
      return this.state.rows
    }
  }

  handleInputSearch(event) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
    let sortByTrainingName = this.trainingName();
    if (event.target.value !== "") {
      sortByTrainingName = sortByTrainingName.filter(function(item){
        if (item.trainingName !== null) {
        return item.trainingName.toLowerCase().search(
          event.target.value.toLowerCase()) !== -1;
        }
      });    
      this.setState({
        items: sortByTrainingName,
        filter: true,
        total: sortByTrainingName.length,
        pageNo: sortByTrainingName.length
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
        // pageSize={5}
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
              placeholder="Search Training Name"  
              onChange={this.handleInputSearch}                    
                />
              <Divider className={classes.barDivider} />
              <IconButton title="Export Excel" color="primary" className={classes.barIconButton} 
                aria-label="Directions" onClick={this.exportExcel} >
                  <img src="/assets/icons/export_excel.png" className="selectionControlPdf" alt="Excel"/>   
              </IconButton>
            </Paper>
        </div> 
        </GridToolbar>       
        {/* <GridColumn field='masterUserId' title='S.No' width='100' /> */}
        <GridColumn field='trainingDate' title='Training Date' width='150'/>
        <GridColumn field='trainingName' title='Training Name' width='200'/>
        <GridColumn field='trainingType' title='Training Type' width='150'/>
        <GridColumn field='trainingLoc' title='Training Location' width='200'/>
        <GridColumn field='trainerName' title='Trainer Name'/>        
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
        <p className="titleCard">Reports / Master / Training</p>
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

TrainingCalender.propTypes = {
  classes: PropTypes.object.isRequired,
};
  
export default withStyles(tableStyles)(TrainingCalender);