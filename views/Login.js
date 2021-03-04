import nookies from "nookies"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { firebase } from "../firebase/firebaseClient"
import View from "./View"

const emailPattern = new RegExp(
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
)

// const TogglePassword = forwardRef((_, ref) => {
//   const [passwordVisible, setPasswordVisible] = useState(false)

//   const handleToggle = () => setPasswordVisible(!passwordVisible)

//   return (
//     <div>
//       <input
//         name="password"
//         placeholder="Password"
//         type={passwordVisible ? `text` : `password`}
//         ref={ref}
//         onChange={() => console.log(ref)}
//       />
//       <button
//         type="button"
//         onClick={() => {
//           setPasswordVisible(!passwordVisible)
//           console.log(ref)
//         }}
//       >
//         {passwordVisible ? `🙈` : `👁`}
//       </button>
//     </div>
//   )
// })

export const SignUp = () => {
  const { register, handleSubmit, errors } = useForm()
  const [showPassword, setShowPassword] = useState(false)

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
    console.log(Object.entries(errors)[0])
    const [target, { message, ref }] = Object.entries(errors)[0]
    alert(message)
    ref.focus()
    if (target === `password`) ref.select()
  }

  return (
    <View pageTitle="Sign up">
      <form onSubmit={handleSubmit(handleUserCreate, handleFail)}>
        <input
          name="email"
          placeholder="Email"
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
        <input
          name="password"
          placeholder="Password"
          type="password"
          ref={register({
            required: { value: true, message: `Password required.` },
          })}
        />
        <button type="submit">Sign up</button>
      </form>
    </View>
  )
}

export const Login = () => {
  const { register, handleSubmit } = useForm()

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
    console.log(Object.entries(errors)[0])
    const [target, { message, ref }] = Object.entries(errors)[0]
    alert(message)
    ref.focus()
    if (target === `password`) ref.select()
  }

  return (
    <View pageTitle="Sign in">
      <form onSubmit={handleSubmit(handleSignIn, handleFail)}>
        <input
          name="email"
          placeholder="Email"
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
        <input
          name="password"
          placeholder="Password"
          type="password"
          ref={register({
            required: { value: true, message: `Password required.` },
          })}
        />
        <button type="submit">Sign in</button>
      </form>
    </View>
  )
}
