import React from "react"
import { Component } from "react"
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
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
        return (
            <div>
                <AppBar color="primary" position="static">
                    <Toolbar>
                        <Typography variant="title" color="inherit" className={classes.grow}>
                            {this.props.title}
                        </Typography>
                        <Button color="inherit" variant="outlined" onClick={this.logout}>
                            退出
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }

    logout() {
        location.href = config.httpHost + config.logoutRouter
    }
}

export default withStyles(styles)(AdminBar)