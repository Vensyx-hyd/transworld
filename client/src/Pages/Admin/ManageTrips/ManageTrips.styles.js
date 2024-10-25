const styles = theme => ({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    button: {
        margin: theme.spacing.unit,
    },
    modButton: {
        margin: 0,
        marginRight: "20px",
        padding: 0,
        paddingLeft: "10px",
        paddingRight: "10px",  
    },    
    label: {
        textTransform: 'capitalize',
        fontWeight: 600
    },    
    table: {
        minWidth: 700,
    },
    toolBar: {
        paddingRight: theme.spacing.unit,
    },
    spacer: {
        flex:'1 1 80%'
    },
    tableCellPagination: {
        position: "absolute",
        right: 30,
    },
    tablePagination: {
        color: "#12A474",
        fontWeight: 600
    },
    barRoot: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 300,
        height: 40,
        marginRight: 20,
        marginTop: "1.5rem"
    },
});

export default styles;