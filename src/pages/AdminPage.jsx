import React from "react"
import { Component } from "react"
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import DataTable from "../components/DataTable.jsx"
import ColorSnackbar from "../components/ColorSnackbar.jsx"
import AdminBar from "../components/AdminBar.jsx"
import AdminButtonGroup from "../components/AdminButtonGroup.jsx"
import post from "../utils/post"
import get from "../utils/get"
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
                        showLoginPage={this.props.showLoginPage}
                        authority={authority} channelName={channelName}
                    />
                    { authority !== 1 && <AdminButtonGroup authority={authority} 
                        freshWhiteList={this.freshWhiteList}
                        freshBlackList={this.freshBlackList}
                    />}
                </MuiThemeProvider>
                {authority === 1 &&
                    <div className={classes.cardWrapper}>
                        <LiveCard />
                    </div>
                }
                {authority >= 2 &&
                    <DataTable title="用户列表" tableHeads={blackListTableHeads}
                        selected={this.state.selectedUserInBlackList}
                        rows={this.state.blackList} 
                        onSelectAll={this.selectAllUserInBlackList}
                        onSelectOne={this.selectOneUserInBlackList}
                        isSelected={this.isUserInBlackListSelected}
                        onClickDelete={this.deleteUserFromBlackList}
                    />
                }
                {authority >= 3 &&
                    <DataTable title="管理员列表" tableHeads={whiteListTableHeads}
                        selected={this.state.selectedUserInWhiteList}
                        rows={this.state.whiteList} 
                        onSelectAll={this.selectAllUserInWhiteList}
                        onSelectOne={this.selectOneUserInWhiteList} 
                        isSelected={this.isUserInWhiteListSelected}
                        onClickDelete={this.deleteUserFromWhiteList}
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
            channelName: "",
            blackList: [],
            whiteList: [],
            selectedUserInBlackList: [],
            selectedUserInWhiteList: [],
            authority: 0,
            isCreateUserFormOpen: false,
            isCreateAdminFormOpen: false,
            isCreateNewLiveFormOpen: false,
            isSnackbarOpen: false,
            snackbarMessage: "",
            snackbarType: "error"
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
    }

    componentDidMount() {
        if (this.state.authority >= 2) {
            // this.freshBlackList()
        }
        if (this.state.authority === 3) {
            // this.freshWhiteList()
        }
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