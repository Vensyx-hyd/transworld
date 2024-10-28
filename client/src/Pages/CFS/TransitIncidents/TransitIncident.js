import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Dialog,
    DialogContent,
    DialogContentText,
    Button,
    Toolbar
} from '@material-ui/core';

import TablePaginationActions from '../../../Components/TablePaginationActionsWrapped';
import tableStyles from '../../../Styles/tableStyles';
import Loading from '../../../Components/Loading/Loading';
import AppAPI from '../../../API';

const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5,
    },
});

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
    TablePaginationActions,
);

class TransitIncidents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            getApi: false,
            rows: [],
            page: 0,
            rowsPerPage: 5,
            selectedModal: "",
            selectedRow: {},
            drivers: [],
            open: false,
            message: "",
            submitted: false,
            errMessage: ""
        }
        this.msgUpdated = this.msgUpdated.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    getTransitList() {
        AppAPI.transitList.get(null, null).then((resp) => {
            console.log(resp.transitList, "Get Transit List");
            this.setState({
                rows: resp.transitList,
                getApi: true
            })
        }).catch((err) => console.log(err))
    }

    componentDidMount() {
        this.getTransitList();
    }

    msgUpdated() {
        this.setState({
            open: true,
            submitted: false,
        }, () => {
            setTimeout(() => this.setState({
                open: false
            }), 5000);
        });
    }

    handleClose() {
        this.setState({
            open: false,
        })
    }

    renderList() {
        const { classes } = this.props;
        const { getApi, rows, rowsPerPage, page } = this.state;
        return (
            getApi === false
                ?
                <TableRow>
                    <TableCell colSpan={12}>
                        <div className="d-flex justify-content-center">
                            <Loading />
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
                    rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) =>
                        <TableRow >
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{row.trip_no}</TableCell>
                            <TableCell>{row.driver_name}</TableCell>
                            <TableCell>{row.triler_no}</TableCell>
                            <TableCell>{row.trip_status}</TableCell>
                            <TableCell>{row.start_loc}</TableCell>
                            <TableCell>{row.end_loc}</TableCell>
                            <TableCell>{row.est_st_dt_ti}</TableCell>
                            <TableCell>{row.est_en_dt_ti}</TableCell>
                            <TableCell>{row.trip_issue}</TableCell>
                        </TableRow>
                    )
        )
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ page: 0, rowsPerPage: event.target.value });
    };

    render() {
        const { classes } = this.props;
        const { rows, rowsPerPage, page } = this.state;
        return (
            <div>
                <p className="titleCard">Menu / Transit Incident</p>
                <Paper className={classes.root}>
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>S.No.</TableCell>
                                    <TableCell>Trip No</TableCell>
                                    <TableCell>Driver Name</TableCell>
                                    <TableCell>Trailer No</TableCell>
                                    <TableCell>Trip Status</TableCell>
                                    <TableCell>Start Location</TableCell>
                                    <TableCell>End Location</TableCell>
                                    <TableCell>Est. Start Date Time</TableCell>
                                    <TableCell>Est. End Date Time</TableCell>
                                    <TableCell>Trip Issue</TableCell>
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
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                    classes={{ paper: classes.dialogPaper }}>
                </Dialog>
            </div>
        );
    }
}

TransitIncidents.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(tableStyles)(TransitIncidents);