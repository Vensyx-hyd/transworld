const tableStyles = theme => ({
    root: {
      width: '100%',
    },
    toolBar: {
      paddingRight: theme.spacing.unit,
    },
    spacer: {
        flex:'1 1 80%'
    },
    rightIcon: {
      marginLeft: theme.spacing.unit,
    },
    mainButton: {
      margin: theme.spacing.unit
    },
    mainButtonCss: {
      marginTop: "0.5rem",
    },
    mainButtonCssClear: {
      marginTop: "0.5rem",
      marginLeft: "1.5rem"
    },
    button: {
      margin: 0,
      marginRight: "20px",
      padding: 0,
      paddingLeft: "10px",
      paddingRight: "10px",  
    },
    cancelButton: {
      margin: 0,
      marginRight: "20px",
      padding: 0,
      paddingLeft: "10px",
      paddingRight: "10px",
      backgroundColor: "#e0e0e0"  
    },
    label: {
      textTransform: 'capitalize',
      fontWeight: 600
    },
    saveLabel: {
      textTransform: 'capitalize',
      fontWeight: 600,
      color: "#14A474"
    },
    cancelLabel: {
      textTransform: 'capitalize',
      fontWeight: 600,
      color: "#dc3545c9"
    },
    refreshButton: {
      backgroundColor:"#b8b5d766",
      color: '#332c6f',
      '&:hover': {
        color: '#ffffff',
        backgroundColor: "#332c6f",
      },
    },   
    paperMargin:{
      marginTop: "3.5rem",
    },
    table: {
      minWidth: 500,
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    toolbarRoot: {
     padding: "12px",
    },    
    tablePagination: {
      color: "#12A474",
      fontWeight: 600,
      // position: "absolute",
      // right: 30,
    },
    assignLabel: {
        color: "#12A474",
        fontWeight: 600,
        cursor: "pointer"
    },    
    lightTooltip: {
      backgroundColor: theme.palette.common.black,
      color: '#ffffff',
      boxShadow: theme.shadows[1],
      borderRadius: 22,
      fontSize: 12,
      paddingLeft: 10,
      paddingRight: 10
    },
    dateLable:{
      color: "#332c6f"
    },
    iconButton: {
      padding: 8,
      position: 'relative',
      right: "8vh",
      marginLeft: "1vh",
      color: "#12A474",
      borderRadius: 22
    },

    barRoot: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 300,
      height: 40,
      marginRight: 20,
      marginTop: "0.5em"
    },
    barRootAuto: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: "auto",
      height: 40,
      marginTop: "0.5em"
    },
    tripBarRoot: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
      height: 40,
      marginRight: 20,
      marginTop: "0.5em"
    },
    barInput: {
      marginLeft: 8,
      flex: 1,
    },
    barIconButton: {
      padding: 10,
    },
    barDivider: {
      width: 1,
      height: 28,
      margin: 4,
    },
    calendarRoot: {
      marginTop: 0,
      marginBottom: 0
    }
  });
  export default tableStyles;