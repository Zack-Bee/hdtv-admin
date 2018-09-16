import React from "react"
import { Component } from "react"
import Paper from '@material-ui/core/Paper'
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import blue from "@material-ui/core/colors/blue"
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import CssBaseline from '@material-ui/core/CssBaseline'
import classNames from "classnames"
import logo from "../icon/icon.png"
import "../css/reset.css"


const theme = createMuiTheme({
    palette: {
        primary: {
            main: blue[500],
            dark: blue[500]
        }
    }
})

const styles = {
    alignCenter: {
        display: "flex",
        justifyContent: "center"
    },
    marginLeftAndRight: {
        margin: "0 40px"
    },
    padding: {
        padding: "20px 0"
    },
    marginTopAndBottom: {
        margin: "12px 0"
    }
}

class LoginPage extends Component {
    render() {
        const { classes } = this.props
        return (
            <div style={{ width: "450px" }}>
                <CssBaseline/>
                <Paper>
                    <div className={classes.marginLeftAndRight}>
                        <div className={classNames(classes.alignCenter, classes.padding)}>
                            <img width="40" height="40" src={logo} />
                        </div>
                        <div className={classes.alignCenter}>
                            <Typography variant="title">
                                登陆
                            </Typography>
                        </div>
                        <div className={classNames(classes.alignCenter, classes.marginTopAndBottom)}>
                            <Typography>
                                使用你的HDTV管理账号登陆
                            </Typography>
                        </div>
                        <MuiThemeProvider theme={theme}>
                            <div className={classes.alignCenter}>
                                <FormControl fullWidth
                                    margin="normal" >
                                    <InputLabel htmlFor="user-id">账号ID</InputLabel>
                                    <Input placeholder="张三" id="user-id" 
                                    autoFocus={true} autoComplete="on"/>
                                </FormControl>
                            </div>
                            <div className={classes.alignCenter}>
                                <FormControl fullWidth
                                    margin="normal" >
                                    <InputLabel htmlFor="user-pass">密码</InputLabel>
                                    <Input type="password" autoComplete="on"
                                        id="user-pass"
                                    />
                                </FormControl>
                            </div>
                        </MuiThemeProvider>
                        <div className={classes.alignCenter}>
                            <MuiThemeProvider theme={theme}>
                            <a href="mailto:wzk#synet.edu.cn">
                                <Typography color="primary">
                                    联系管理员申请账户
                                </Typography>
                            </a>
                            </MuiThemeProvider>
                        </div>
                    </div>
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles)(LoginPage)