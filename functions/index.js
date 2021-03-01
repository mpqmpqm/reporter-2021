// const functions = require("firebase-functions")
// const admin = require("firebase-admin")
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// admin.initializeApp()

// const db = admin.firestore()
// // db.useEmulator(`localhost`, 8080)

// exports.createUserFirestore = functions.auth.user().onCreate(async (user) => {
//   const { uid } = user

//   const createdDoc = await db
//     .collection(`users`)
//     .doc(uid)
//     .collection(`boards`)
//     .add({
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//       title: `Mood`,
//       symbols: [`😘`, `😔`],
//     })
//     .then((createdDoc) => createdDoc.id)
//     .catch((err) => {
//       console.error(err)
//       return null
//     })

//   return (
//     createdDoc &&
//     db.collection(`users`).doc(uid).collection(`boards`).doc(`selected`).set({
//       selected: createdDoc,
//     })
//   )
// })
