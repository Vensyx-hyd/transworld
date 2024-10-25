import {lighten} from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    toolBar: {
        paddingRight: theme.spacing.unit,
        color: theme.palette.secondary.main,
        backgroundColor: 'white',
    },
    spacer: {
        flex:'1 1 80%'
    }
});

export default styles;
