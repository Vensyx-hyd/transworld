const styles = theme => ({
    notificationContainer: {
        height: 738,
        maxWidth: '100%',
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto'
    },
    inline: {
        display: 'inline'
    },
    font: {
        fontSize: "12px",
        textTransfrom: "lowercase"
    },
    mutedText: {
        color: '#ddd'
    },
    card:{
        padding:'10px',
        backgroundColor:'white'
    },
    listItem:{
        borderBottom: '1px solid #ddd',
        padding:'5px',
        '&:hover': {
            backgroundColor: "#ddd",
            cursor: "pointer"
        }
    },
    button: {
        marginTop: 8,
        height: 30,
        padding: "4px 15px",  
        '&:hover': {
            backgroundColor: "#ddd"
        }
    },
    delete: {
        color: "#989595",
        fontSize: 20,
        '&:hover': {
            color: "#dc3545c9"
        }
    }
});

export default styles;