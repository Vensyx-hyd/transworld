const mainStyles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
      },
      button: {
        marginTop: theme.spacing.unit * 3,
      },
      mainButton: {
        backgroundColor:"#ffffff",
        minWidth:"170px",
        minHeight: "25px",
        '&:hover': {
          backgroundColor:"#ffffff",
        },
      },
      mainLabel: {
        color: "#332c6f",
        fontSize: 16,
        fontWeight: 600,
        textTransform: "capitalize",
        '&:hover': {
          color: '#14A474'
        },        
      },
      secondaryButton: {
        display: 'flex',
        float: "right",
        marginTop: theme.spacing.unit * 1,
        '&:hover': {
          backgroundColor: "#332c6f"
        },
      },    
      secondaryLabel: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: 600,
        textTransform: "capitalize",
        '&:hover': {
          color: '#dc3545c9'
        },        
      },
      formControl: {
        marginBottom: theme.spacing.unit * 1.5,
        paddingBotton: theme.spacing.unit * 1,
        borderColor: "none",
      },
      formControlLogin: {
        marginBottom: theme.spacing.unit * 1,
        paddingBotton: theme.spacing.unit * 1,
        borderColor: "#ffffff",
        width: "150px"
      },
      label: {
        color: 'white',
        fontSize: 16,
        fontWeight: 600,
      }, 
      visibleIcon:{
        color: "#ffffff",
      },
      multilineColor:{
          color:'white'
      },
      cssUnderline: {    
        color: theme.palette.common.white,
          borderBottom: theme.palette.common.white,
          '&:after': {
              borderBottom: `2px solid ${theme.palette.common.white}`,			
          },				
          '&:focused::after': {
              borderBottom: `2px solid ${theme.palette.common.white}`,
          },		
          '&:before': {
              borderBottom: `1px solid ${theme.palette.common.white}`,			
          }         
      },
      notchedOutline: {
        borderColor: "#ffffff"
      }, 
      OutlinedInput: {
        borderColor: '#ffffff',
        color: '#ffffff',
        fontWeight: 600,
      },     
      cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
          borderColor: "none",
        },
      },  
      cssFocused: {
        '&:before': {
            borderBottomColor: '#ffffff',
          },
        '&:after': {
          borderBottomColor: '#ffffff',
        },
      },
      cssLabel: {
        color:'#ffffff',
        fontWeight: 600,
        fontSize: 14,
        textColor: '#ffffff',
        '&$cssFocused': {
          color:'#ffffff',
        },
      },
});
export default mainStyles;
