import React from "react"
import { Component } from "react"
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import DataTable from "../components/DataTable.jsx"
import ColorSnackbar from "../components/ColorSnackbar.jsx"
import AdminBar from "../components/AdminBar.jsx"
import post from "../utils/post"
import get from "../utils/get"
import config from "../../config/config"
import LiveCard from "../components/LiveCard.jsx"
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import SettingSwitcher from "../components/SettingSwitcher.jsx"

const styles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    buttonWrapper: {
        display: "flex",
        justifyContent: "space-around",
        margin: "30px 0"
    },
    cardWrapper: {
        display: "flex",
        justifyContent: "space-around",
        margin: "30px 0"
    }
})

const theme = createMuiTheme({
    palette: {
        primary: {
            main: blue[500],
            dark: blue[500]
        }
    }
})

const blackListTableHeads = [
    { disablePadding: true, label: '账号ID' },
    { disablePadding: false, label: '频道名' },
    { disablePadding: false, label: '节目标题' },
]

const whiteListTableHeads = [
    { disablePadding: true, label: '账号ID' },
    { disablePadding: false, label: '频道名' },
    { disablePadding: false, label: '节目标题' },
]

class AdminPage extends Component {
    render() {
        const { classes } = this.props
        const { authority, channelName } = this.state
        return (
            <div className={classes.root}>
                <MuiThemeProvider theme={theme}>
                    <AdminBar title={this.state.channelName}
                        userId={this.state.userId}
                    />

                    <Dialog
                        open={this.state.isAddUserToBlackListFormOpen}
                        onClose={this.closeAddUserToBlackListForm}
                        aria-labelledby="form-dialog-title">
                        <DialogTitle>将用户加入黑名单</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                            </DialogContentText>
                            <TextField margin="dense" label="用户ID"
                                onChange={this.setIdInputAddToBlackList}
                                type="text" fullWidth
                                defaultValue={this.state.idInputAddToBlackList}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.closeAddUserToBlackListForm} color="primary">
                                取消
                            </Button>
                            <Button onClick={this.addUserToBlackList} color="primary">
                                加入黑名单
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={this.state.isAddUserToWhiteLIstFormOpen}
                        onClose={this.closeAddUserToWhiteListForm}
                        aria-labelledby="form-dialog-title">
                        <DialogTitle>将用户加入白名单</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                            </DialogContentText>
                            <TextField margin="dense" label="用户ID"
                                onChange={this.setIdInputAddToWhiteList}
                                type="text" fullWidth
                                defaultValue={this.state.idInputAddToWhiteList}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.closeAddUserToWhiteListForm} color="primary">
                                取消
                            </Button>
                            <Button onClick={this.addUserToWhiteList} color="primary">
                                加入白名单
                            </Button>
                        </DialogActions>
                    </Dialog>
                </MuiThemeProvider>
                <div className={classes.cardWrapper}>
                    <LiveCard />
                </div>
                {authority == 2 &&
                    <MuiThemeProvider theme={theme}>
                        <div>
                            <SettingSwitcher />
                        </div>
                    </MuiThemeProvider>
                }
                {authority == 2 &&
                    <DataTable title="黑名单" tableHeads={blackListTableHeads}
                        selected={this.state.selectedUserInBlackList}
                        rows={this.state.blackList}
                        onSelectAll={this.selectAllUserInBlackList}
                        onSelectOne={this.selectOneUserInBlackList}
                        isSelected={this.isUserInBlackListSelected}
                        onClickDelete={this.deleteUserFromBlackList}
                        onClickAdd={this.openAddUserToBlackListForm}
                    />
                }
                {authority == 2 &&
                    <DataTable title="白名单" tableHeads={whiteListTableHeads}
                        selected={this.state.selectedUserInWhiteList}
                        rows={this.state.whiteList}
                        onSelectAll={this.selectAllUserInWhiteList}
                        onSelectOne={this.selectOneUserInWhiteList}
                        isSelected={this.isUserInWhiteListSelected}
                        onClickDelete={this.deleteUserFromWhiteList}
                        onClickAdd={this.openAddUserToWhiteListForm}
                    />
                }
                <ColorSnackbar open={this.state.isSnackbarOpen}
                    type={this.state.snackbarType} autoHideDuration={4000}
                    onClose={this.closeSnackbar}
                    message={this.state.snackbarMessage}
                />
            </div>
        )
    }

    constructor(props) {
        super(props)

        this.state = {
            userId: "",
            channelName: "加载中",
            blackList: [],
            whiteList: [],
            selectedUserInBlackList: [],
            selectedUserInWhiteList: [],
            authority: 1,
            isSnackbarOpen: false,
            snackbarMessage: "",
            snackbarType: "error",
            isAddUserToBlackListFormOpen: false,
            isAddUserToWhiteLIstFormOpen: false,
            idInputAddToBlackList: "",
            idInputAddToWhiteList: ""
        }

        this.selectOneUserInBlackList = this.selectOneUserInBlackList.bind(this)
        this.selectAllUserInBlackList = this.selectAllUserInBlackList.bind(this)
        this.isUserInBlackListSelected = this.isUserInBlackListSelected.bind(this)
        this.selectOneUserInWhiteList = this.selectOneUserInWhiteList.bind(this)
        this.selectAllUserInWhiteList = this.selectAllUserInWhiteList.bind(this)
        this.isUserInWhiteListSelected = this.isUserInWhiteListSelected.bind(this)
        this.closeSnackbar = this.closeSnackbar.bind(this)
        this.freshWhiteList = this.freshWhiteList.bind(this)
        this.freshBlackList = this.freshBlackList.bind(this)
        this.deleteUserFromWhiteList = this.deleteUserFromWhiteList.bind(this)
        this.deleteUserFromBlackList = this.deleteUserFromBlackList.bind(this)
        this.freshAuthority = this.freshAuthority.bind(this)
        this.openAddUserToBlackListForm = this.openAddUserToBlackListForm.bind(this)
        this.openAddUserToWhiteListForm = this.openAddUserToWhiteListForm.bind(this)
        this.closeAddUserToBlackListForm = this.closeAddUserToBlackListForm.bind(this)
        this.closeAddUserToWhiteListForm = this.closeAddUserToWhiteListForm.bind(this)
        this.addUserToBlackList = this.addUserToBlackList.bind(this)
        this.addUserToWhiteList = this.addUserToWhiteList.bind(this)
        this.setIdInputAddToBlackList = this.setIdInputAddToBlackList.bind(this)
        this.setIdInputAddToWhiteList = this.setIdInputAddToWhiteList.bind(this)
    }

    componentDidMount() {
        get(config.httpHost + config.authorityRouter).then((res) => (
            res.json()
        )).then((data) => {
            this.setState({
                authority: data.authority
            }, () => {
                if (data.authority === 2) {
                    this.freshBlackList()
                    this.freshWhiteList()
                }
            })
        })

        get(config.httpHost + config.channelNameRouter).then((res) => (
            res.json()
        )).then((data) => {
            this.setState({
                channelName: data.channelName
            })
        })
    }

    addUserToBlackList() {
        if (this.state.idInputAddToBlackList.trim().length === 0) {
            this.setState({
                snackbarMessage: "ID号不允许为空",
                snackbarType: "warning",
                isSnackbarOpen: true
            })
            return
        }
        this.closeAddUserToBlackListForm()
        post(config.httpHost + config.addUserToBlackListRouter,
            this.state.idInputAddToBlackList).then((res) => (
                res.json()
            )).then((data) => {
                if (data.isSuccess) {
                    this.setState({
                        snackbarMessage: "成功添加用户到黑名单",
                        snackbarType: "success",
                        isSnackbarOpen: true
                    })
                    this.freshBlackList()
                } else {
                    this.setState({
                        snackbarMessage: data.error,
                        snackbarType: "error",
                        isSnackbarOpen: true
                    })
                }
            })
    }

    addUserToWhiteList() {
        if (this.state.idInputAddToWhiteList.trim().length === 0) {
            this.setState({
                snackbarMessage: "ID号不允许为空",
                snackbarType: "warning",
                isSnackbarOpen: true
            })
            return
        }
        this.closeAddUserToWhiteListForm()
        post(config.httpHost + config.addUserToWhiteListRouter,
            this.state.idInputAddToWhiteList).then((res) => (
                res.json()
            )).then((data) => {
                if (data.isSuccess) {
                    this.setState({
                        snackbarMessage: "成功添加用户到白名单",
                        snackbarType: "success",
                        isSnackbarOpen: true
                    })
                    this.freshWhiteList()
                } else {
                    this.setState({
                        snackbarMessage: data.error,
                        snackbarType: "error",
                        isSnackbarOpen: true
                    })
                }
            })
    }

    setIdInputAddToBlackList(event) {
        this.setState({
            idInputAddToBlackList: event.target.value
        })
    }

    setIdInputAddToWhiteList(event) {
        this.setState({
            idInputAddToWhiteList: event.target.value
        })
    }

    openAddUserToBlackListForm() {
        this.setState({
            isAddUserToBlackListFormOpen: true
        })
    }

    openAddUserToWhiteListForm() {
        this.setState({
            isAddUserToWhiteLIstFormOpen: true
        })
    }

    closeAddUserToBlackListForm() {
        this.setState({
            isAddUserToBlackListFormOpen: false
        })
    }
    closeAddUserToWhiteListForm() {
        this.setState({
            isAddUserToWhiteLIstFormOpen: false
        })
    }

    freshAuthority(callBack) {
        return get(config.httpHost + config.authorityRouter).then((res) => (
            res.json()
        )).then((data) => {
            this.setState({
                authority: data.authority
            }, callBack)
        })
    }

    deleteUserFromBlackList() {
        post(config.httpHost + config.deleteUserFromBlackListRouter, JSON.stringify({
            list: this.state.selectedUserInBlackList
        })).then((res) => (
            res.json()
        )).then((data) => {
            console.log(data)
            if (data.isSuccess) {
                this.freshBlackList()
                this.setState({
                    isSnackbarOpen: true,
                    snackbarMessage: "删除成功",
                    snackbarType: "success",
                    selectedUserInBlackList: []
                })
            } else {
                this.setState({
                    isSnackbarOpen: true,
                    snackbarMessage: data.err,
                    snackbarType: "error"
                })
            }
        })
    }

    deleteUserFromWhiteList() {
        post(config.httpHost + config.deleteUserFromWhiteListRouter, JSON.stringify({
            list: this.state.selectedUserInWhiteList
        })).then((res) => (
            res.json()
        )).then((data) => {
            if (data.isSuccess) {
                this.freshWhiteList()
                this.setState({
                    isSnackbarOpen: true,
                    snackbarMessage: "删除成功",
                    snackbarType: "success",
                    selectedUserInWhiteList: []
                })
            } else {
                this.setState({
                    isSnackbarOpen: true,
                    snackbarMessage: data.err,
                    snackbarType: "error"
                })
            }
        })
    }

    closeSnackbar() {
        this.setState({
            isSnackbarOpen: false
        })
    }

    freshBlackList() {
        get(config.httpHost + config.blackListRouter).then((res) => (
            res.json()
        )).then((data) => {
            if (data.isSuccess) {
                this.setState({
                    blackList: data.list
                })
            } else {
                this.setState({
                    isSnackbarOpen: true,
                    snackbarMessage: data.err,
                    snackbarType: "error"
                })
            }
        })
    }

    freshWhiteList() {
        get(config.httpHost + config.whiteListRouter).then((res) => (
            res.json()
        )).then((data) => {
            if (data.isSuccess) {
                this.setState({
                    whiteList: data.list
                })
            } else {
                this.setState({
                    isSnackbarOpen: true,
                    snackbarMessage: data.err,
                    snackbarType: "error"
                })
            }
        })
    }

    selectOneUserInBlackList(event, id) {
        const { selectedUserInBlackList } = this.state
        const selectedIndex = selectedUserInBlackList.indexOf(id)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedUserInBlackList, id)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedUserInBlackList.slice(1))
        } else if (selectedIndex === selectedUserInBlackList.length - 1) {
            newSelected = newSelected.concat(selectedUserInBlackList.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedUserInBlackList.slice(0, selectedIndex),
                selectedUserInBlackList.slice(selectedIndex + 1),
            )
        }

        this.setState({ selectedUserInBlackList: newSelected })
    }

    selectOneUserInWhiteList(event, id) {
        const { selectedUserInWhiteList } = this.state
        const selectedIndex = selectedUserInWhiteList.indexOf(id)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedUserInWhiteList, id)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedUserInWhiteList.slice(1))
        } else if (selectedIndex === selectedUserInWhiteList.length - 1) {
            newSelected = newSelected.concat(selectedUserInWhiteList.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedUserInWhiteList.slice(0, selectedIndex),
                selectedUserInWhiteList.slice(selectedIndex + 1),
            )
        }

        this.setState({ selectedUserInWhiteList: newSelected })
    }

    selectAllUserInBlackList(event) {
        if (event.target.checked) {
            this.setState({ selectedUserInBlackList: this.state.blackList.map(list => list[0]) })
            return
        }
        this.setState({ selectedUserInBlackList: [] })
    }

    selectAllUserInWhiteList(event) {
        if (event.target.checked) {
            this.setState({ selectedUserInWhiteList: this.state.whiteList.map(list => list[0]) })
            return
        }
        this.setState({ selectedUserInWhiteList: [] })
    }

    isUserInBlackListSelected(id) {
        return this.state.selectedUserInBlackList.indexOf(id) !== -1
    }

    isUserInWhiteListSelected(id) {
        return this.state.selectedUserInWhiteList.indexOf(id) !== -1
    }
}

export default withStyles(styles)(AdminPage)