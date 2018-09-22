import React from "react"
import { Component } from "react"
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import ColorSnackbar from "./ColorSnackbar.jsx"
import post from "../utils/post"
import config from "../../config/config"

const styles = (theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    }
})

class AdminBar extends Component {
    render() {
        const { classes } = this.props
        const { anchorEl } = this.state
        const open = Boolean(anchorEl)
        return (
            <div>
                <AppBar color="primary" position="static">
                    <Toolbar>
                        <Typography variant="title" color="inherit" className={classes.grow}>
                            {this.props.title}
                        </Typography>
                        <IconButton
                            aria-owns={open ? 'menu-appbar' : null}
                            aria-haspopup="true"
                            onClick={this.handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={this.closeUserMenu}
                        >
                            <MenuItem onClick={this.closeUserMenu}>{this.props.userId}</MenuItem>
                            <MenuItem onClick={this.signOut}>退出账号</MenuItem>
                            <MenuItem onClick={() => {
                                this.closeUserMenu()
                                this.openChangePasswordForm()
                            }}>更改密码</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Dialog
                    open={this.state.isChangePasswordFormOpen}
                    onClose={this.closeChangePasswordForm}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">更改密码</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        </DialogContentText>
                        <TextField margin="dense" label="新密码"
                            onChange={this.setNewPassword}
                            type="password" fullWidth
                            defaultValue={this.state.newPassword}
                        />
                        <TextField margin="dense" label="确认新密码"
                            onChange={this.setNewPasswordAgain} 
                            type="password" fullWidth
                            defaultValue={this.state.newPasswordAgain}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeChangePasswordForm} color="primary">
                            取消
                        </Button>
                        <Button onClick={this.changePassword} color="primary">
                            确认更改
                        </Button>
                    </DialogActions>
                </Dialog>
                <ColorSnackbar onClose={this.closeSnackbar}
                    message={this.state.snackbarMessage}
                    open={this.state.isSnackbarOpen} type={this.state.snackbarType}
                    autoHideDuration={4000}
                />
            </div>
        )
    }

    constructor(props) {
        super(props)
        this.state = {
            anchorEl: null,
            isChangePasswordFormOpen: false,
            newPassword: "",
            newPasswordAgain: "",
            snackbarMessage: "",
            isSnackbarOpen: false,
            snackbarType: "error"
        }
        this.handleMenu = this.handleMenu.bind(this)
        this.closeUserMenu = this.closeUserMenu.bind(this)
        this.openChangePasswordForm = this.openChangePasswordForm.bind(this)
        this.closeChangePasswordForm = this.closeChangePasswordForm.bind(this)
        this.setNewPassword = this.setNewPassword.bind(this)
        this.setNewPasswordAgain = this.setNewPasswordAgain.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.closeSnackbar = this.closeSnackbar.bind(this)
        this.signOut = this.signOut.bind(this)
    }

    closeSnackbar() {
        this.setState({
            isSnackbarOpen: false
        })
    }

    handleMenu(event) {
        this.setState({ anchorEl: event.currentTarget })
    }

    closeUserMenu() {
        this.setState({ anchorEl: null })
    }

    openChangePasswordForm() {
        this.setState({
            isChangePasswordFormOpen: true
        })
    }
    closeChangePasswordForm() {
        this.setState({
            isChangePasswordFormOpen: false
        })
    }
    setNewPassword(event) {
        this.setState({
            newPassword: event.target.value
        })
    }
    setNewPasswordAgain(event) {
        this.setState({
            newPasswordAgain: event.target.value
        })
    }
    changePassword() {
        if (this.state.newPassword !== this.state.newPasswordAgain) {
            this.setState({
                isSnackbarOpen: true,
                snackbarMessage: "两次密码输入不同",
                snackbarType: "error"
            })
            return
        }
        if (this.state.newPassword.length < 5) {
            this.setState({
                isSnackbarOpen: true,
                snackbarMessage: "请确保新密码长度超过5位",
                snackbarType: "warning"
            })
            return
        }
        let newPassword = this.state.newPassword
        let user = JSON.parse(sessionStorage.getItem("user"))
        post(config.httpHost + config.changePasswordRouter, JSON.stringify({
            id: user.id,
            password: user.password,
            newPassword
        })).then((res) => (
            res.json()
        )).then((data) => {
            if (data.isSuccess) {
                this.setState({
                    isSnackbarOpen: true,
                    snackbarMessage: "成功修改密码",
                    snackbarType: "success",
                    isChangePasswordFormOpen: false
                })
                sessionStorage.setItem("user", JSON.stringify(Object.assign({}, 
                    user, {
                    password: newPassword
                })))
            } else {
                this.setState({
                    isSnackbarOpen: true,
                    snackbarMessage: data.err,
                    snackbarType: "error"
                })
            }
        })
    }

    signOut() {
        sessionStorage.setItem("user", "")
        this.closeUserMenu()
        this.props.showLoginPage()
    }
}

export default withStyles(styles)(AdminBar)