import React from 'react'
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import classnames from 'classnames'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import QRCode from "qrcode.react"
import logo from "../icon/icon.png"
import config from "../../config/config"
import post from "../utils/post"
import ColorSnackbar from "../components/ColorSnackbar.jsx"
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import EditIcon from "@material-ui/icons/Edit"
import Tooltip from '@material-ui/core/Tooltip'
import blue from "@material-ui/core/colors/blue"
import { stringify } from 'querystring';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: blue[500],
            dark: blue[500]
        }
    }
})

const styles = theme => ({
    card: {
        maxWidth: 400,
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    }
})

class LiveCard extends React.Component {
    render() {
        const { classes } = this.props

        return (
            <div>
                <MuiThemeProvider theme={theme}>
                    <ColorSnackbar open={this.state.isSnackbarOpen}
                        type={this.state.snackbarType} autoHideDuration={4000}
                        onClose={this.closeSnackbar}
                        message={this.state.snackbarMessage}
                    />
                    <Dialog
                        open={this.state.isChangeTitleFormOpen}
                        onClose={this.closeChangeTitleForm}
                        aria-labelledby="changeTitleForm">
                        <DialogTitle id="changeTitleForm">更改节目标题</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                            </DialogContentText>
                            <TextField margin="dense" label="新的节目标题"
                                onChange={this.setNewTitle}
                                type="text" fullWidth
                                defaultValue={this.state.newTitle}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.closeChangeTitleForm} color="primary">
                                取消
                        </Button>
                            <Button onClick={this.changeTitle} color="primary">
                                确认更改
                        </Button>
                        </DialogActions>
                    </Dialog>
                    <Card className={classes.card}>
                        <CardHeader
                            avatar={
                                <Avatar aria-label="Recipe" src={logo} imgProps={{
                                    style: {
                                        width: "36px",
                                        height: "36px"
                                    }
                                }} />
                            }
                            title={this.state.title}
                            subheader={"更新于: " + this.state.updateAt}
                        />
                        <CardContent>
                            <Typography component="p" gutterBottom={true}>
                                推流地址: {this.state.pushUrl}
                            </Typography>
                            <Typography component="p" gutterBottom={true}
                                align="center" color="textSecondary">
                                [扫码推流]
                    </Typography>
                            <QRCode value={this.state.pushUrl} size={325}
                                fgColor="#2196f3" bgColor="#fff" renderAs="svg"
                            />
                        </CardContent>
                        <CardActions className={classes.actions} disableActionSpacing>
                            <Tooltip title="修改节目标题">
                                <IconButton aria-label="修改节目标题"
                                    onClick={this.openChangeTitleForm}>
                                    <EditIcon color="secondary" />
                                </IconButton>
                            </Tooltip>
                            <IconButton
                                className={classnames(classes.expand, {
                                    [classes.expandOpen]: this.state.expanded,
                                })}
                                onClick={this.handleExpandClick}
                                aria-expanded={this.state.expanded}
                                aria-label="Show more"
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                        </CardActions>
                        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                <Typography component="p" gutterBottom={true}>
                                    HDTV直播地址: {this.state.hdtvLiveUrl}
                                </Typography>
                                <Typography component="p" gutterBottom={true}
                                    align="center" color="textSecondary">
                                    [扫码观看]
                        </Typography>
                                <QRCode value={this.state.hdtvLiveUrl} size={325}
                                    fgColor="#2196f3" bgColor="#fff" renderAs="svg"
                                />
                                <Typography component="p" gutterBottom={true}>
                                </Typography>
                                <Typography component="p" gutterBottom={true}>
                                    RTMP直播地址: {this.state.rtmpLiveUrl}
                                </Typography>
                                <Typography component="p" gutterBottom={true}
                                    align="center" color="textSecondary">
                                    [扫码观看]
                        </Typography>
                                <QRCode value={this.state.rtmpLiveUrl} size={325}
                                    fgColor="#2196f3" bgColor="#fff" renderAs="svg"
                                />

                            </CardContent>
                        </Collapse>
                    </Card>
                </MuiThemeProvider>
            </div>
        )
    }

    constructor(props) {
        super(props)

        this.state = {
            expanded: false,
            title: "东北大学95周年校庆",
            pushUrl: "rtmp://hdtv.neu6.edu.cn/live/test?key=123456",
            updateAt: "2018-07-27",
            hdtvLiveUrl: "https://hdtv.neu6.edu.cn/v1/live/test",
            rtmpLiveUrl: "rtmp://hdtv.neu6.edu.cn/live/test",
            isSnackbarOpen: false,
            snackbarMessage: "",
            snackbarType: "error",
            isChangeTitleFormOpen: false,
            newTitle: ""
        }
        this.handleExpandClick = this.handleExpandClick.bind(this)
        this.closeSnackbar = this.closeSnackbar.bind(this)
        this.setNewTitle = this.setNewTitle.bind(this)
        this.changeTitle = this.changeTitle.bind(this)
        this.closeChangeTitleForm = this.closeChangeTitleForm.bind(this)
        this.openChangeTitleForm = this.openChangeTitleForm.bind(this)
    }

    componentDidMount() {
        let user = JSON.parse(sessionStorage.getItem("user"))
        this.getDetail(user).then((data) => {
            if (data.isSuccess) {
                this.setState({
                    title: data.title,
                    updateAt: data.updateAt,
                    pushUrl: `${config.baseLiveUrl}${user.id}?key=${data.key}`,
                    hdtvLiveUrl: `${config.hdtvLiveBaseUrl}${user.id}`,
                    rtmpLiveUrl: `${config.baseLiveUrl}${user.id}`
                })
            }
        }, () => {
            this.setState({
                isSnackbarOpen: true,
                snackbarType: "error",
                snackbarMessage: "网络请求发生错误, 请检查网络状态后向管理员反映"
            })
        })
    }

    openChangeTitleForm() {
        this.setState({
            isChangeTitleFormOpen: true
        })
    }

    changeTitle() {
        if (this.state.newTitle.length === 0) {
            this.setState({
                isSnackbarOpen: true,
                snackbarType: "warning",
                snackbarMessage: "节目标题不能为空"
            })
            return
        }
        let user = JSON.parse(sessionStorage.getItem("user"))
        post(config.httpHost + config.chnageLiveTitleRouter, JSON.stringify({
            id: user.id,
            password: user.password,
            newTitle: this.state.newTitle
        })).then((res) => (
            res.json()
        )).then((data) => {
            if (data.isSuccess) {
                this.getDetail(user).then((data) => {
                    if (data.isSuccess) {
                        this.setState({
                            title: data.title,
                            updateAt: data.updateAt,
                            pushUrl: `${config.baseLiveUrl}${user.id}?key=${data.key}`,
                            hdtvLiveUrl: `${config.hdtvLiveBaseUrl}${user.id}`,
                            rtmpLiveUrl: `${config.baseLiveUrl}${user.id}`
                        })
                    }
                }, () => {
                    this.setState({
                        isSnackbarOpen: true,
                        snackbarType: "error",
                        snackbarMessage: "刷新信息发生错误, 请检查网络状态后向管理员反映"
                    })
                })
                this.setState({
                    isSnackbarOpen: true,
                    snackbarType: "success",
                    snackbarMessage: "修改标题成功, 推流地址等信息已经刷新",
                    isChangeTitleFormOpen: false
                })
            }
        })
    }

    setNewTitle(event) {
        this.setState({
            newTitle: event.target.value
        })
    }

    closeChangeTitleForm() {
        this.setState({
            isChangeTitleFormOpen: false
        })
    }

    getDetail(user) {
        return post(config.httpHost + config.liveDetailRouter, JSON.stringify({
            id: user.id,
            password: user.password
        })).then((res) => (
            res.json()
        ))
    }

    handleExpandClick() {
        this.setState(state => ({ expanded: !state.expanded }))
    }

    closeSnackbar() {
        this.setState({
            isSnackbarOpen: false
        })
    }
}

export default withStyles(styles)(LiveCard)