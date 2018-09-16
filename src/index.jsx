import { Component } from "react"
import React from "react"
import reactDOM from "react-dom"
import LoginPage from "./pages/LoginPage.jsx"

class App extends Component {
    render() {
        return (
            <LoginPage/>
        )
    }
}

reactDOM.render(<App/>, document.getElementById("root"))