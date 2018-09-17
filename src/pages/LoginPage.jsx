import React from "react"
import { Component } from "react"
import Paper from '@material-ui/core/Paper'
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import blue from "@material-ui/core/colors/blue"
import green from "@material-ui/core/colors/green"
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import classNames from "classnames"
import logo from "../icon/icon.png"
import "../css/reset.css"
import config from "../../config/config"
import post from "../utils/post"
import ColorSnackbar from "../components/ColorSnackbar.jsx"


const theme = createMuiTheme({
    palette: {
        primary: {
            main: blue[500],
            dark: blue[500]
        }
    }
})

const styles = (theme) => ({
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
    },
    root: {
        [theme.breakpoints.down("500")]: {
            width: "100vw",
            height: "100vh"
        },
        [theme.breakpoints.up("500")]: {
            width: "450px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
        }
    },
    wrapper: {
        [theme.breakpoints.down("500")]: {
            height: "100vh"
        }
    },
    buttonProgress: {
        color: blue[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    relative: {
        position: "relative",
        margin: theme.spacing.unit
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    }
})

class LoginPage extends Component {
    render() {
        const { classes } = this.props
        const { isLoading, isSuccess } = this.state;
        const buttonClassname = classNames({
            [classes.buttonSuccess]: isSuccess,
        });
        return (
            <div className={classes.root}>
                <Paper>
                    <div className={classNames(classes.marginLeftAndRight, classes.wrapper)}>
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
                                使用你的HDTV管理账号
                            </Typography>
                        </div>
                        <MuiThemeProvider theme={theme}>
                            <div className={classes.alignCenter}>
                                <FormControl fullWidth
                                    margin="normal" >
                                    <InputLabel htmlFor="user-id">账号ID</InputLabel>
                                    <Input placeholder="张三" id="user-id"
                                        autoFocus={true} autoComplete="on"
                                        onChange={this.setId} />
                                </FormControl>
                            </div>
                            <div className={classes.alignCenter}>
                                <FormControl fullWidth
                                    margin="normal" >
                                    <InputLabel htmlFor="user-pass">密码</InputLabel>
                                    <Input type="password" autoComplete="on"
                                        id="user-pass" onChange={this.setPassword}
                                    />
                                </FormControl>
                            </div>
                        </MuiThemeProvider>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }} className={classes.padding}>
                            <MuiThemeProvider theme={theme}>
                                <div>
                                    <a href="mailto:wzk@synet.edu.cn">
                                        <Typography color="primary">
                                            联系管理员申请账号
                                    </Typography>
                                    </a>
                                    <Typography>
                                        wzk@synet.edu.cn
                                    </Typography>
                                </div>
                                <div className={classes.relative}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={buttonClassname}
                                        disabled={isLoading}
                                        onClick={this.login}
                                    >
                                        {isSuccess ? "登陆成功" : "登陆"}
                                    </Button>
                                    {isLoading && <CircularProgress size={24}
                                        className={classes.buttonProgress} />
                                    }
                                </div>
                            </MuiThemeProvider>
                            <ColorSnackbar onClose={this.closeSnackBar}
                                type="error" message="账号ID或者密码错误"
                                open={this.state.isSnackbarOpen}
                                autoHideDuration={3000}/>
                        </div>
                    </div>
                </Paper>
            </div>
        )
    }

    constructor(props) {
        super(props)

        this.setId = this.setId.bind(this)
        this.setPassword = this.setPassword.bind(this)
        this.login = this.login.bind(this)
        this.closeSnackBar = this.closeSnackBar.bind(this)
        this.state = {
            isLoading: false,
            isSuccess: false,
            id: "",
            password: "",
            isSnackbarOpen: false
        }
    }

    closeSnackBar(event, reason) {
        this.setState({
            isSnackbarOpen: false
        })
    }

    setId(event) {
        this.setState({
            id: event.target.value
        })
    }
    setPassword(event) {
        this.setState({
            password: event.target.value
        })
    }

    login() {
        if (this.state.isLoading || this.state.isSuccess) {
            return
        }
        this.setState({
            isLoading: true
        })
        let id = this.state.id,
            password = this.state.password
        post(config.loginUrl, JSON.stringify({
            id,
            password
        })).then((res) => {
            return res.json()
        }).then((data) => {
            console.log(data)
            if (data.isSuccess) {
                this.setState({
                    isLoading: false,
                    isSuccess: true
                })
                sessionStorage.setItem("user", JSON.stringify({
                    id,
                    password
                }))
                this.props.hideLoginPage()
            } else {
                this.setState({
                    isLoading: false,
                    isSuccess: false,
                    isSnackbarOpen: true
                })
            }
        })
    }
}

export default withStyles(styles)(LoginPage)