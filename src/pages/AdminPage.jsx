import React from "react"
import { Component } from "react"
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import blue from '@material-ui/core/colors/blue'
import DataTable from "../components/DataTable.jsx"
import ColorSnackbar from "../components/ColorSnackbar.jsx"
import AdminBar from "../components/AdminBar.jsx"
import AdminButtonGroup from "../components/AdminButtonGroup.jsx"

const styles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    buttonWrapper: {
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
        const { authority } = this.state
        return (
            <div className={classes.root}>
                <MuiThemeProvider theme={theme}>
                    <AdminBar title={this.state.channelName} 
                        userId={this.state.userId} 
                        showLoginPage={this.props.showLoginPage}
                    />
                    <AdminButtonGroup authority={authority}/>
                </MuiThemeProvider>
                {authority >= 2 &&
                    <DataTable title="用户列表" tableHeads={userTableHeads}
                        selected={this.state.selectedUser}
                        rows={this.state.userList} onSelectAll={this.selectAllUser}
                        onSelectOne={this.selectOneUser} isSelected={this.isUserSelected}
                    />
                }
                {authority >= 3 &&
                    <DataTable title="管理员列表" tableHeads={adminTableHeads}
                        selected={this.state.selectedAdmin}
                        rows={this.state.adminList} onSelectAll={this.selectAllAdmin}
                        onSelectOne={this.selectOneAdmin} isSelected={this.isAdminSelected}
                    />
                }
            </div>
        )
    }

    constructor(props) {
        super(props)

        let user = JSON.parse(sessionStorage.getItem("user"))
        this.state = {
            userId: "张三",
            userList: [
                ["test0", "东北大学电视台", "2018-07-27", "admin"],
                ["test1", "东北大学电视台", "2018-07-27", "admin"],
                ["test2", "东北大学电视台", "2018-07-27", "admin"],
                ["test3", "东北大学电视台", "2018-07-27", "admin"],
                ["test4", "东北大学电视台", "2018-07-27", "admin"],
                ["test5", "东北大学电视台", "2018-07-27", "admin"],
                ["test6", "东北大学电视台", "2018-07-27", "admin"],
                ["test7", "东北大学电视台", "2018-07-27", "admin"],
            ],
            adminList: [
                ["zackbee1", "2018-07-27", "admin"],
                ["zackbee2", "2018-07-27", "admin"],
                ["zackbee3", "2018-07-27", "admin"],
                ["zackbee4", "2018-07-27", "admin"],
                ["zackbee5", "2018-07-27", "admin"],
                ["zackbee6", "2018-07-27", "admin"],
                ["zackbee7", "2018-07-27", "admin"],
                ["zackbee8", "2018-07-27", "admin"],
            ],
            selectedUser: [],
            selectedAdmin: [],
            authority: user.authority,
            isCreateUserFormOpen: false,
            isCreateAdminFormOpen: false,
            isCreateNewLiveFormOpen: false,
            channelName: "东大电视台",
        }

        this.selectOneUser = this.selectOneUser.bind(this)
        this.selectAllUser = this.selectAllUser.bind(this)
        this.isUserSelected = this.isUserSelected.bind(this)
        this.selectOneAdmin = this.selectOneAdmin.bind(this)
        this.selectAllAdmin = this.selectAllAdmin.bind(this)
        this.isAdminSelected = this.isAdminSelected.bind(this)
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