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

console.log("%cgithub: https://github.com/Zack-Bee/hdtv-admin", `color: #333; 
font-size: 20px; 
background-image: linear-gradient(to right, #4facfe, #00f2fe); 
padding: 10px; 
border-radius: 20px;`)

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <AdminPage />
            </React.Fragment>
        )
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