import React from 'react'
import { Component } from "react"
import Typography from "@material-ui/core/Typography"
import Switch from '@material-ui/core/Switch'
import config from "../../config/config"
import get from "../utils/get"
import { withStyles } from '@material-ui/core/styles'


const styles = {
    flexWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
}

class SettingSwitcher extends Component {
    render() {
        const { classes } = this.props
        let message = ""
        if (this.state.isLoading) {
            message = "加载中"
        } else {
            if (this.state.isAllowEveryOneLive) {
                message = "允许所有人直播(黑名单用户除外)"
            } else {
                message = "禁止所有人直播(白名单用户除外)"
            }
        }
        return (
            <div className={classes.flexWrapper}>
                <Switch
                    checked={this.state.isAllowEveryOneLive}
                    onChange={this.handlerChange}
                    disabled={this.state.isLoading}
                    value="true"
                    color="primary"
                />
                <Typography component="p" gutterBottom={false}>
                    {message}
                </Typography>
            </div>
        )
    }

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            isAllowEveryOneLive: false
        }
        this.handlerChange = this.handlerChange.bind(this)
    }

    componentDidMount() {
        this.getIsAllowEveryOneLive()
    }

    getIsAllowEveryOneLive() {
        get(config.httpHost + config.isAllowEveryOneLiveRouter).then((res) => (
            res.json()
        )).then((data) => {
            this.setState({
                isAllowEveryOneLive: data.isAllowEveryOneLive,
                isLoading: false
            })
        })
    }

    handlerChange(event) {
        if (this.state.isAllowEveryOneLive) {
            get(config.httpHost + config.forbidEveryOneLiveRouter).then(() => {
                this.getIsAllowEveryOneLive()
            })
        } else {
            get(config.httpHost + config.allowEveryOneLiveRouter).then(() => {
                this.getIsAllowEveryOneLive()
            })
        }
    }
}

export default withStyles(styles)(SettingSwitcher)