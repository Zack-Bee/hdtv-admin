import React from "react"
import { Component } from "react"
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import post from "../utils/post"
import config from "../../config/config"
import ColorSnackbar from "../components/ColorSnackbar.jsx"

const styles = (theme) => ({
    buttonWrapper: {
        display: "flex",
        justifyContent: "space-around",
        margin: "30px 0"
    }
})

class AdminButtonGroup extends Component {
    render() {
        const { authority, classes } = this.props
        return (
            <div>
                <div className={classes.buttonWrapper}>
                    {authority >= 2 &&
                        <Button variant="contained" color="primary"
                            onClick={this.openCreateUserForm}>
                            创建用户
                        </Button>
                    }
                    {authority >= 3 &&
                        <Button variant="contained" color="primary"
                            onClick={this.openCreateAdminForm}>
                            创建管理员
                        </Button>
                    }
                </div>
                <Dialog
                    open={this.state.isCreateUserFormOpen}
                    onClose={this.closeCreateUserForm}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle>创建用户</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        </DialogContentText>
                        <TextField margin="dense" label="用户ID"
                            onChange={this.setUserId}
                            type="text" fullWidth 
                            defaultValue={this.state.userId}
                        />
                        <TextField margin="dense" label="频道名称"
                            onChange={this.setUserChannelName}
                            type="text" fullWidth 
                            defaultValue={this.state.userChannelName}
                        />
                        <TextField margin="dense" label="密码"
                            onChange={this.setUserPassword} 
                            type="password" fullWidth
                            defaultValue={this.state.userPassword}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeCreateUserForm} color="primary">
                            取消
                        </Button>
                        <Button onClick={this.createUser} color="primary">
                            创建用户
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.isCreateAdminFormOpen}
                    onClose={this.closeCreateAdminForm}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle>创建管理员</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        </DialogContentText>
                        <TextField margin="dense" label="用户ID"
                            onChange={this.setAdminId}
                            type="text" fullWidth
                        />
                        <TextField margin="dense" label="确认新密码"
                            onChange={this.setAdminPassword} 
                            type="password" fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeCreateAdminForm} color="primary">
                            取消
                        </Button>
                        <Button onClick={this.createAdmin} color="primary">
                            创建管理员
                        </Button>
                    </DialogActions>
                </Dialog>
                <ColorSnackbar type={this.state.snackbarType} 
                    message={this.state.snackbarMessage} autoHideDuration={4000}
                    onClose={this.closeSnackbar} 
                    open={this.state.isSnackbarOpen}
                />
            </div>
        )
    }

    constructor(props) {
        super(props)

        this.state = {
            isCreateUserFormOpen: false,
            isCreateAdminFormOpen: false,
            userId: "",
            userPassword: "",
            userChannelName: "",
            adminId: "",
            adminPassword: "",
            snackbarType: "error",
            snackbarMessage: "",
            isSnackbarOpen: false
        }

        this.openCreateUserForm = this.openCreateUserForm.bind(this)
        this.openCreateAdminForm = this.openCreateAdminForm.bind(this)
        this.closeCreateUserForm = this.closeCreateUserForm.bind(this)
        this.closeCreateAdminForm = this.closeCreateAdminForm.bind(this)
        this.setUserId = this.setUserId.bind(this)
        this.setAdminId = this.setAdminId.bind(this)
        this.setUserPassword = this.setUserPassword.bind(this)
        this.setAdminPassword = this.setAdminPassword.bind(this)
        this.setUserChannelName = this.setUserChannelName.bind(this)
        this.closeSnackbar = this.closeSnackbar.bind(this)
        this.createUser = this.createUser.bind(this)
        this.createAdmin = this.createAdmin.bind(this)
    }

    closeSnackbar() {
        this.setState({
            isSnackbarOpen: false
        })
    }

    createUser() {
        let userId = this.state.userId,
            userPassword = this.state.userPassword,
            userChannelName = this.state.userChannelName,
            user = JSON.parse(sessionStorage.getItem("user"))
        if (!userId) {
            this.setState({
                isSnackbarOpen: true,
                snackbarType: "warning",
                snackbarMessage: "ID不能为空"
            })
            return
        }
        if (userPassword.length <= 5) {
            this.setState({
                isSnackbarOpen: true,
                snackbarType: "warning",
                snackbarMessage: "密码长度必须超过5位"
            })
            return
        }
        if (!userChannelName) {
            this.setState({
                isSnackbarOpen: true,
                snackbarType: "warning",
                snackbarMessage: "频道名称不能为空"
            })
            return
        }
        post(config.httpHost + config.addUserRouter, JSON.stringify({
            id: user.id,
            password: user.password,
            userId,
            userPassword,
            userChannelName
        })).then((res) => (
            res.json()
        )).then((data) => {
            if (data.isSuccess) {
                this.setState({
                    isSnackbarOpen: true,
                    snackbarType: "success",
                    snackbarMessage: "创建用户成功",
                    isCreateUserFormOpen: false
                })
                if (typeof this.props.freshUserList === "function") {
                    this.props.freshUserList()
                }
            } else {
                this.setState({
                    isSnackbarOpen: true,
                    snackbarType: "error",
                    snackbarMessage: data.err
                })
            }
        })
    }

    createAdmin() {
        let userId = this.state.adminId,
            userPassword = this.state.adminPassword,
            user = JSON.parse(sessionStorage.getItem("user"))
        if (!userId) {
            this.setState({
                isSnackbarOpen: true,
                snackbarType: "warning",
                snackbarMessage: "ID不能为空"
            })
            return
        }
        if (userPassword.length <= 5) {
            this.setState({
                isSnackbarOpen: true,
                snackbarType: "warning",
                snackbarMessage: "密码长度必须超过5位"
            })
            return
        }
        post(config.httpHost + config.addAdminRouter, JSON.stringify({
            id: user.id,
            password: user.password,
            userId,
            userPassword,
        })).then((res) => (
            res.json()
        )).then((data) => {
            if (data.isSuccess) {
                this.setState({
                    isSnackbarOpen: true,
                    snackbarType: "success",
                    snackbarMessage: "创建管理员成功",
                    isCreateAdminFormOpen: false
                })
                if (typeof this.props.freshAdminList === "function") {
                    this.props.freshAdminList()
                }
            } else {
                this.setState({
                    isSnackbarOpen: true,
                    snackbarType: "error",
                    snackbarMessage: data.err
                })
            }
        })
    }

    setUserId(event) {
        this.setState({
            userId: event.target.value
        })
    }

    setAdminId(event) {
        this.setState({
            adminId: event.target.value
        })
    }

    setUserPassword(event) {
        this.setState({
            userPassword: event.target.value
        })
    }

    setAdminPassword(event) {
        this.setState({
            adminPassword: event.target.value
        })
    }

    setUserChannelName(event) {
        this.setState({
            userChannelName: event.target.value
        })
    }

    openCreateUserForm() {
        console.log(this.state.userId)
        this.setState({
            isCreateUserFormOpen: true
        })
    }

    openCreateAdminForm() {
        this.setState({
            isCreateAdminFormOpen: true
        })
    }

    closeCreateUserForm() {
        this.setState({
            isCreateUserFormOpen: false
        })
    }

    closeCreateAdminForm() {
        this.setState({
            isCreateAdminFormOpen: false
        })
    }
}

export default withStyles(styles)(AdminButtonGroup)