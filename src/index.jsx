import { Component } from "react"
import React from "react"
import reactDOM from "react-dom"
import { Transition } from "react-transition-group"
import CssBaseline from '@material-ui/core/CssBaseline'

import LoginPage from "./pages/LoginPage.jsx"

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
            </React.Fragment>
        )
    }

    constructor(props) {
        super(props)

        this.state = {
            isLoginHide: false
        }
        this.hideLoginPage = this.hideLoginPage.bind(this)
    }

    hideLoginPage() {
        this.setState({
            isLoginHide: true
        })
    }
}

reactDOM.render(<App />, document.getElementById("root"))