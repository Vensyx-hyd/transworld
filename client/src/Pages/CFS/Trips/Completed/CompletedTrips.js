import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import moment from 'moment';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableFooter,
    TableRow,
    TablePagination
} from '@material-ui/core/';

import TablePaginationActions from '../../../../Components/TablePaginationActionsWrapped';
import tableStyles from '../../../../Styles/tableStyles';
import Loading from '../../../../Components/Loading/Loading';
import AppAPI from '../../../../API';

const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5,
    },
});

const TablePaginationActionsWrapped = withStyles(actionsStyles, {withTheme: true})(
    TablePaginationActions,
);
class CompletedTrips extends Component {
    constructor(props) {
        super(props);
        this.state = {
            getApi: false,
            rows: [],
            page: 0,
            rowsPerPage: 5      
        }
    }

    getCompletedTripsData(){
        AppAPI.trips.get(null, null).then((res) => {
            console.log(res.trips, "Total Trips");
            const data = res.trips;  
            const currentDate = moment(new Date()).format("DD/MM/YYYY");
            const completed = data.filter(function(trip){
                const actStartDate = moment(trip.actStartTime).format("DD/MM/YYYY");
                return trip.tripStatus === "TRIP_COMPLETED";
                // && actStartDate === currentDate;
            });           
            console.log(completed, "Completed Trips")
            this.setState({
                rows: completed,
                getApi: true
            })                
        }).catch(e => console.log(e))
    }

    // getCompletedTripsData(){
    //     const data = this.props.rows;
    //     const completed = data.filter(function(trip){
    //         return trip.tripStatus === "TRIP_COMPLETED";
    //     });           
    //     console.log(completed, "Completed Trips")
    //     this.setState({
    //         rows: completed,
    //         getApi: true
    //     })  
    // }

    componentDidMount() {
        this.getCompletedTripsData();
    }   

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({page: 0, rowsPerPage: event.target.value});
    };

    // convert(data){
    //     return data !== null || data !== "" ? moment(data).format("DD/MM/YYYY h:mm:ss A") : null
    // }

    convert(data){
        console.log(data,'date');
        if (data !== null) {
            return moment(data).format("DD/MM/YYYY h:mm:ss A");
        } else if(data === null) {
            return null
        }
    }
    
    renderList() {
        const { getApi, rows, rowsPerPage, page } = this.state;
        return (
            getApi === false
            ?         
            <TableRow>
              <TableCell colSpan={12}>
                <div className="d-flex justify-content-center">
                  <Loading/>
                </div>
              </TableCell>
            </TableRow>  
            :
            rows.length === 0
            ?  
            <TableRow>
              <TableCell colSpan={12}>
                <div className="d-flex justify-content-center">
                  No Data Found !
                </div>
              </TableCell>
            </TableRow>   
            :
            rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, id) => 
                <TableRow key={id}>
                    <TableCell>{id + 1}</TableCell>    
                    <TableCell>{row.tripNo}</TableCell>
                    <TableCell>{row.tripType === 1 ? "Empty" : row.tripType === 2 ? "Loaded" : "Empty Container"}</TableCell>
                    <TableCell>{row.startLocationName}</TableCell>
                    <TableCell>{row.endLocationName}</TableCell>
                    <TableCell>{this.convert(row.startDate)}</TableCell>
                    <TableCell>{this.convert(row.endDate)}</TableCell>                   
                    <TableCell>{this.convert(row.actStartTime)}</TableCell>
                    <TableCell>{this.convert(row.actEndTime)}</TableCell>                  
                    <TableCell>{row.driverName}</TableCell>
                    <TableCell>{row.trailerNo}</TableCell>  
                </TableRow>
            )
        )       
    }

    render() {
        const {classes} = this.props;
        const {rows, rowsPerPage, page} = this.state;
        return (
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>                            
                                <TableCell>S.No.</TableCell>   
                                <TableCell>Trip No.</TableCell>
                                <TableCell>Trip Type</TableCell>
                                <TableCell>Start Location</TableCell>
                                <TableCell>End Location</TableCell>
                                <TableCell>Est. Start Date Time</TableCell>
                                <TableCell>Est. End Date Time</TableCell>
                                <TableCell>Act. Start Date Time</TableCell>
                                <TableCell>Act. End Date Time</TableCell>
                                <TableCell>Driver Name</TableCell>
                                <TableCell>Trailer No.</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.renderList()}                           
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    className={classes.tablePagination}
                                    rowsPerPageOptions={[5, 10, 25]}
                                    colSpan={3}
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActionsWrapped}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </Paper>
        );
    }
}

export default withStyles(tableStyles)(CompletedTrips);