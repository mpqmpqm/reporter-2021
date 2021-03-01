import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/functions"

let db
let FieldValue

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
  // if (location.hostname === `localhost`) {
  //   firebase.functions().useEmulator("localhost", 5001)
  //   firebase.auth().useEmulator("http://localhost:9099")
  //   db.useEmulator(`localhost`, 8080)
  // }
  db.enablePersistence().catch((err) => console.error(err))

  FieldValue = firebase.firestore.FieldValue
}

export { firebase, db, FieldValue }
