import { Component } from "react"
import React from "react"
import reactDOM from "react-dom"
import { Transition } from "react-transition-group"
import CssBaseline from '@material-ui/core/CssBaseline'
import LoginPage from "./pages/LoginPage.jsx"
import AdminPage from "./pages/AdminPage.jsx"

const duration = 500

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
    position: "relative",
    height: "100vh",
    width: "100vw"
}

const transitionStyle = {
    entering: {
        opacity: 1
    },
    entered: {
        opacity: 1
    },
    exiting: {
        opacity: 0
    },
    exited: {
        opacity: 0
    }
}

console.log("%c被你发现了, 欢迎到github: https://github.com/Zack-Bee/hdtv-admin 围观", "color: #fff; font-size: 30px; background-color: #2196f3; padding: 10px; border-radius: 25px;")

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <Transition unmountOnExit={true} in={!this.state.isLoginHide} timeout={duration}>
                    {(state) => (
                        <div style={Object.assign({}, defaultStyle, transitionStyle[state])}>
                            <LoginPage hideLoginPage={this.hideLoginPage}/>
                        </div>
                    )}
                </Transition>
                {this.state.isLoginHide && <AdminPage showLoginPage={this.showLoginPage}/>}
            </React.Fragment>
        )
    }

    constructor(props) {
        super(props)
        let user = sessionStorage.getItem("user")
        if (user) {
            this.state = {
                isLoginHide: true
            }
        } else {
            this.state = {
                isLoginHide: false
            }
        }
        
        this.hideLoginPage = this.hideLoginPage.bind(this)
        this.showLoginPage = this.showLoginPage.bind(this)
    }

    hideLoginPage() {
        this.setState({
            isLoginHide: true
        })
    }
    showLoginPage() {
        this.setState({
            isLoginHide: false
        })
    }
}

reactDOM.render(<App />, document.getElementById("root"))