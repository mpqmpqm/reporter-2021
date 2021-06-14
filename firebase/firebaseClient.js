import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/functions"

let db
let FieldValue

// const dev = process.env.NODE_ENV === `development`

if (typeof window !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
  })
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

  db = firebase.firestore()
  // if (dev) {
  //   firebase.functions().useEmulator(process.env.NEXT_PUBLIC_HOST, 5001)
  //   firebase.auth().useEmulator(`http://${process.env.NEXT_PUBLIC_HOST}:9099`)
  //   db.useEmulator(process.env.NEXT_PUBLIC_HOST, 8080)
  // }
  // if (!dev) db.enablePersistence().catch((err) => console.error(err))
  db.enablePersistence().catch((err) => console.error(err))

  FieldValue = firebase.firestore.FieldValue
}

export { firebase, db, FieldValue }
