const drawerWidth = 260;
const styles = theme => ({
    root: {
        display: 'flex',
        minHeight: '100vh',
        overflow: 'hidden !important'
    },
    title: {
        color: "#ffffff",
        fontSize: "1rem"
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth
    },
    menuButton: {
        marginLeft: 0,
        marginRight: 20,
    },
    right: {
        marginLeft: 250,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        background: "#332c6f"
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        ...theme.mixins.toolbar,
        justifyContent: 'center',
        background: "#fff"
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: "hidden",
        width: theme.spacing.unit * 7 + 1,
        [theme.breakpoints.up("sm")]: {
            // width: theme.spacing.unit * 9 + 1
            width: 0
        }
    },
    //content
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3, 
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),    
        overflow: 'auto !important'
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
});
export default styles;