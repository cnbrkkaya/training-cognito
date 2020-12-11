/*eslint no-fallthrough: ["error", { "commentPattern": "break[\\s\\w]*omitted" }]*/

import React, { useState, useEffect } from 'react'
import { Auth, Hub } from 'aws-amplify'

const initialFormState = {
  username: '',
  password: '',
  email: '',
  authCode: '',
  formType: 'signUp',
}
function App() {
  const [formState, updateFormState] = useState(initialFormState)
  const [user, updateUser] = useState(null)
  const onChange = (e) => {
    e.persist()
    updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }))
  }

  const { formType } = formState

  useEffect(() => {
    checkUser()
    setAuthListener()
  }, [])

  async function setAuthListener() {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          checkUser()
          break
        case 'signOut':
          updateFormState(() => ({ ...formState, formType: 'signIn' }))
          updateUser(null)
          break
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data)
          break
        default:
          return
      }
    })
  }

  async function checkUser() {
    try {
      const user = await Auth.currentAuthenticatedUser()
      updateUser(user)
      console.log('user', user)
      updateFormState(() => ({ ...formState, formType: 'signedIn' }))
    } catch (error) {
      //updateUser(null)
    }
  }
  async function signUp() {
    const { username, email, password } = formState
    await Auth.signUp({ username, password, attributes: { email } })
    updateFormState(() => ({ ...formState, formType: 'confirmSignUp' }))
  }
  async function confirmSignUp() {
    const { username, authCode } = formState
    await Auth.confirmSignUp(username, authCode)
    updateFormState(() => ({ ...formState, formType: 'signIn' }))
  }
  async function signIn() {
    const { username, password } = formState
    await Auth.signIn({ username, password })
    const tempUser = await Auth.currentAuthenticatedUser()
    updateUser(tempUser)
    updateFormState(() => ({ ...formState, formType: 'signedIn' }))
  }

  return (
    <div>
      {formType === 'signUp' && (
        <div>
          <input name='username' onChange={onChange} placeholder='username' />
          <input
            name='password'
            type='password'
            onChange={onChange}
            placeholder='password'
          />
          <input
            name='email'
            type='email'
            onChange={onChange}
            placeholder='email'
          />
          <button onClick={signUp}>Sign Up</button>
          <button
            onClick={() =>
              updateFormState(() => ({
                ...formState,
                formType: 'signIn',
              }))
            }
          >
            Back to Sign In
          </button>
          <button
            onClick={() => Auth.federatedSignIn({ provider: 'Facebook' })}
          >
            Open Facebook
          </button>
        </div>
      )}
      {formType === 'confirmSignUp' && (
        <div>
          <input name='authCode' onChange={onChange} placeholder='authCode' />

          <button onClick={confirmSignUp}>Confirm Sign Up</button>
        </div>
      )}
      {formType === 'signIn' && (
        <div>
          <input name='username' onChange={onChange} placeholder='username' />
          <input
            name='password'
            type='password'
            onChange={onChange}
            placeholder='password'
          />

          <button onClick={signIn}>Sign In</button>
          <button
            onClick={() =>
              updateFormState(() => ({
                ...formState,
                formType: 'signUp',
              }))
            }
          >
            Sign Up
          </button>
          <button
            onClick={() => Auth.federatedSignIn({ provider: 'Facebook' })}
          >
            Open Facebook
          </button>
        </div>
      )}
      {formType === 'signedIn' && (
        <div>
          Hello {user.username}
          <button
            onClick={() => {
              Auth.signOut()
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

export default App
