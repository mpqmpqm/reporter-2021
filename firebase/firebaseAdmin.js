import * as firebaseAdmin from "firebase-admin"

console.log(process.env.FIREBASE_AUTH_EMULATOR_HOST)

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
      clientEmail: process.env.CLIENT_EMAIL,
      projectId: process.env.PROJECT_ID,
    }),
  })
}

export { firebaseAdmin }
