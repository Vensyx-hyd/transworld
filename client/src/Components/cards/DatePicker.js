import 'date-fns';
import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';

const styles = {
  grid: {
    width: '60%',
  },
};

class MaterialUIPickers extends React.Component {
  state = {
    // The first commit of Material-UI
    selectedDate: new Date(),
  };

  handleDateChange = date => {
    this.setState({ selectedDate: date });   
    console.log(this.state.selectedDate, "Date Selected"); 
  };

  render() {
    const { classes } = this.props;
    const { selectedDate } = this.state;

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container className={classes.grid} justify="space-around">
          <DatePicker
            fullWidth
            margin="normal"
            label="Date picker"
            value={selectedDate}
            onChange={this.handleDateChange}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    );
  }
}

MaterialUIPickers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MaterialUIPickers);