import nookies from "nookies"
import { useForm } from "react-hook-form"
import { firebase } from "../firebase/firebaseClient"
import View from "./View"
import { ErrorMessage } from "@hookform/error-message"
import styled from "styled-components"

const emailPattern = new RegExp(
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
)

const AuthFormParent = styled.div`
  width: 90%;
  margin: 4vh auto;

  form {
    > div {
      display: flex;
      flex-direction: column;
      margin-bottom: 2vh;
      font-size: 1.1rem;
    }

    label {
      margin-bottom: 2px;
      color: #666;
    }

    input {
      background: none;
      border: none;
      border-radius: 0;
      border-bottom: 1px solid #666;
      font-size: 1.1em;
      color: whitesmoke;
      font-family: inherit;
      padding: 2px;
    }

    button {
      font-size: 1.3em;
      color: var(--nav-color);

      &[type="submit"] {
        font-size: 1.5em;
        font-weight: 600;
        color: var(--nav-color);
        justify-self: flex-start;
        align-self: flex-end;
        margin-top: 2vh;
      }
    }

    .form-error-container {
      min-height: 1.5em;

      .form-error {
        margin-top: 0.5em;
        color: #666;
        font-size: 0.75em;
        text-shadow: 0px 0px 2px rgb(189, 0, 0);
      }
    }
  }

  .switch {
    text-align: center;
    margin: 0 auto;
    margin-top: 15vh;
    border: 0.5px solid #666;
    padding: 16px;
    width: fit-content;
    border-radius: 6px;

    p {
      font-size: 1.1em;
      margin-bottom: 4px;
    }
  }
`

export const SignUp = ({ children }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // const [showPassword, setShowPassword] = useState(false)

  const handleUserCreate = async ({ email, password }) => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password)
      nookies.set(undefined, `firestoreNotInitialized`, "true", { path: `/` })
      nookies.set(undefined, `onboarded`, "false", { path: `/` })
      window.location.href = `/`
    } catch (err) {
      alert(err.message)
    }
  }

  const handleFail = (errors) => {
    const [target, { ref }] = Object.entries(errors)[0]

    ref.focus()
    if (target === `password`) ref.select()
  }

  return (
    <View pageTitle="Sign up" id="signUp">
      <AuthFormParent>
        <form onSubmit={handleSubmit(handleUserCreate, handleFail)}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              name="email"
              id="email"
              type="email"
              ref={register({
                required: {
                  value: true,
                  message: `Email address required.`,
                },
                pattern: {
                  value: emailPattern,
                  message: `Please enter a valid email address.`,
                },
              })}
            />
            <div className="form-error-container">
              <FormErrorMessage {...{ errors, name: "email" }} />
            </div>
          </div>
          <div>
            <label htmlFor="pass">Password</label>
            <input
              name="password"
              type="password"
              id="pass"
              ref={register({
                required: { value: true, message: `Password required.` },
              })}
            />
            <div className="form-error-container">
              <FormErrorMessage {...{ errors, name: "password" }} />
            </div>
          </div>
          <div>
            <button type="submit">Sign up &rarr;</button>
          </div>
        </form>
        {children}
      </AuthFormParent>
    </View>
  )
}

export const Login = ({ children }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleSignIn = async ({ email, password }, e) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
      window.location.href = `/`
    } catch (err) {
      let message
      if (err.code === `auth/user-not-found`)
        message = `Could not find a user with this email address. Please try again or create an account.`
      if (err.code === `auth/wrong-password`)
        message = `Incorrect password. Please try again.`
      alert(message || err.message)
    }
  }

  const handleFail = (errors) => {
    const [target, { ref }] = Object.entries(errors)[0]
    ref.focus()
    if (target === `password`) ref.select()
  }

  return (
    <View pageTitle="Sign in" id="signIn">
      <AuthFormParent>
        <form onSubmit={handleSubmit(handleSignIn, handleFail)}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              ref={register({
                required: {
                  value: true,
                  message: `Email address required.`,
                },
                pattern: {
                  value: emailPattern,
                  message: `Please enter a valid email address.`,
                },
              })}
            />
            <div className="form-error-container">
              <FormErrorMessage {...{ errors, name: "email" }} />
            </div>
          </div>
          <div>
            <label htmlFor="pass">Password</label>
            <input
              id="pass"
              name="password"
              type="password"
              ref={register({
                required: { value: true, message: `Password required.` },
              })}
            />
            <div className="form-error-container">
              <FormErrorMessage {...{ errors, name: "password" }} />
            </div>
          </div>
          <div>
            <button type="submit">Sign in &rarr;</button>
          </div>
        </form>
        {children}
      </AuthFormParent>
    </View>
  )
}

const FormErrorMessage = ({ errors, name }) => (
  <ErrorMessage
    errors={errors}
    name={name}
    render={({ message }) => <p className="form-error">{message}</p>}
  />
)
