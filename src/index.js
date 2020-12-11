import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import Amplify from 'aws-amplify'
import awsconfig from './aws-exports'

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.

    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.

    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
)

const signInURI = awsconfig.oauth.redirectSignIn.split(',')
const signOutURI = awsconfig.oauth.redirectSignOut.split(',')

if (isLocalhost) {
  awsconfig.oauth.redirectSignIn = signInURI[1]
  awsconfig.oauth.redirectSignOut = signOutURI[1]
} else {
  awsconfig.oauth.redirectSignIn = signInURI[0]
  awsconfig.oauth.redirectSignOut = signOutURI[0]
}

Amplify.configure(awsconfig)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
