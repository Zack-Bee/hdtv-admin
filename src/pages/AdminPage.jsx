import React from "react"
import { Component } from "react"
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import DataTable from "../components/DataTable.jsx"
import ColorSnackbar from "../components/ColorSnackbar.jsx"
import AdminBar from "../components/AdminBar.jsx"
import AdminButtonGroup from "../components/AdminButtonGroup.jsx"
import post from "../utils/post";
import config from "../../config/config"
import LiveCard from "../components/LiveCard.jsx"

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

const userTableHeads = [
    { disablePadding: true, label: '账号ID' },
    { disablePadding: false, label: '频道名' },
    { disablePadding: false, label: '创建时间' },
    { disablePadding: false, label: '创建者' },
]

const adminTableHeads = [
    { disablePadding: true, label: '账号ID' },
    { disablePadding: false, label: '创建时间' },
    { disablePadding: false, label: '创建者' },
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
                        showLoginPage={this.props.showLoginPage}
                        authority={authority} channelName={channelName}
                    />
                    { authority !== 1 && <AdminButtonGroup authority={authority} 
                        freshAdminList={this.freshAdminList}
                        freshUserList={this.freshUserList}
                    />}
                </MuiThemeProvider>
                {authority === 1 &&
                    <div className={classes.cardWrapper}>
                        <LiveCard />
                    </div>
                }
                {authority >= 2 &&
                    <DataTable title="用户列表" tableHeads={userTableHeads}
                        selected={this.state.selectedUser}
                        rows={this.state.userList} 
                        onSelectAll={this.selectAllUser}
                        onSelectOne={this.selectOneUser} 
                        isSelected={this.isUserSelected}
                        onClickDelete={this.deleteUser}
                    />
                }
                {authority >= 3 &&
                    <DataTable title="管理员列表" tableHeads={adminTableHeads}
                        selected={this.state.selectedAdmin}
                        rows={this.state.adminList} 
                        onSelectAll={this.selectAllAdmin}
                        onSelectOne={this.selectOneAdmin} 
                        isSelected={this.isAdminSelected}
                        onClickDelete={this.deleteAdmin}
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

        let user = JSON.parse(sessionStorage.getItem("user"))
        this.state = {
            userId: user.id,
            channelName: user.channelName,
            userList: [],
            adminList: [],
            selectedUser: [],
            selectedAdmin: [],
            authority: user.authority,
            isCreateUserFormOpen: false,
            isCreateAdminFormOpen: false,
            isCreateNewLiveFormOpen: false,
            isSnackbarOpen: false,
            snackbarMessage: "",
            snackbarType: "error"
        }

        this.selectOneUser = this.selectOneUser.bind(this)
        this.selectAllUser = this.selectAllUser.bind(this)
        this.isUserSelected = this.isUserSelected.bind(this)
        this.selectOneAdmin = this.selectOneAdmin.bind(this)
        this.selectAllAdmin = this.selectAllAdmin.bind(this)
        this.isAdminSelected = this.isAdminSelected.bind(this)
        this.closeSnackbar = this.closeSnackbar.bind(this)
        this.freshAdminList = this.freshAdminList.bind(this)
        this.freshUserList = this.freshUserList.bind(this)
        this.deleteAdmin = this.deleteAdmin.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
    }

    componentDidMount() {
        if (this.state.authority >= 2) {
            this.freshUserList()
        }
        if (this.state.authority === 3) {
            this.freshAdminList()
        }
    }

    deleteUser() {
        console.log(1)
        let user = JSON.parse(sessionStorage.getItem("user"))
        post(config.httpHost + config.deleteUserRouter, JSON.stringify({
            id: user.id,
            password: user.password,
            deleteList: this.state.selectedUser
        })).then((res) => (
            res.json()
        )).then((data) => {
            console.log(data)
            if (data.isSuccess) {
                this.freshUserList()
                this.setState({
                    isSnackbarOpen: true,
                    snackbarMessage: "删除成功",
                    snackbarType: "success",
                    selectedUser: []
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

    deleteAdmin() {
        let user = JSON.parse(sessionStorage.getItem("user"))
        post(config.httpHost + config.deleteAdminRouter, JSON.stringify({
            id: user.id,
            password: user.password,
            deleteList: this.state.selectedAdmin
        })).then((res) => (
            res.json()
        )).then((data) => {
            if (data.isSuccess) {
                this.freshAdminList()
                this.setState({
                    isSnackbarOpen: true,
                    snackbarMessage: "删除成功",
                    snackbarType: "success",
                    selectedAdmin: []
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

    freshUserList() {
        let user = JSON.parse(sessionStorage.getItem("user"))
        post(config.httpHost + config.userListRouter, JSON.stringify({
            id: user.id,
            password: user.password
        })).then((res) => (
            res.json()
        )).then((data) => {
            if (data.isSuccess) {
                this.setState({
                    userList: data.list
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

    freshAdminList() {
        let user = JSON.parse(sessionStorage.getItem("user"))
        post(config.httpHost + config.adminListRouter, JSON.stringify({
            id: user.id,
            password: user.password
        })).then((res) => (
            res.json()
        )).then((data) => {
            if (data.isSuccess) {
                this.setState({
                    adminList: data.list
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

    selectOneUser(event, id) {
        const { selectedUser } = this.state
        const selectedIndex = selectedUser.indexOf(id)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedUser, id)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedUser.slice(1))
        } else if (selectedIndex === selectedUser.length - 1) {
            newSelected = newSelected.concat(selectedUser.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedUser.slice(0, selectedIndex),
                selectedUser.slice(selectedIndex + 1),
            )
        }

        this.setState({ selectedUser: newSelected })
    }

    selectOneAdmin(event, id) {
        const { selectedAdmin } = this.state
        const selectedIndex = selectedAdmin.indexOf(id)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedAdmin, id)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedAdmin.slice(1))
        } else if (selectedIndex === selectedAdmin.length - 1) {
            newSelected = newSelected.concat(selectedAdmin.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedAdmin.slice(0, selectedIndex),
                selectedAdmin.slice(selectedIndex + 1),
            )
        }

        this.setState({ selectedAdmin: newSelected })
    }

    selectAllUser(event) {
        if (event.target.checked) {
            this.setState({ selectedUser: this.state.userList.map(list => list[0]) })
            return
        }
        this.setState({ selectedUser: [] })
    }

    selectAllAdmin(event) {
        if (event.target.checked) {
            this.setState({ selectedAdmin: this.state.adminList.map(list => list[0]) })
            return
        }
        this.setState({ selectedAdmin: [] })
    }

    isUserSelected(id) {
        return this.state.selectedUser.indexOf(id) !== -1
    }

    isAdminSelected(id) {
        return this.state.selectedAdmin.indexOf(id) !== -1
    }
}

export default withStyles(styles)(AdminPage)