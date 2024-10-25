const styles = theme => ({
    main: {
        width: '70vw',
        margin: '20px auto',
        display: 'block'
    },
    paper: {
        marginBottom: "2rem",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    textMuted:{
        color:'#989595',
        fontWeight: 600
    }
});

export default styles;