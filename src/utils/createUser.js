import { db, auth } from "../../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export default async function createUser(uid, name, email) {
  let userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    name: name,
    email: email,
    uid: uid,
    image:
      "https://firebasestorage.googleapis.com/v0/b/gymshare-2cbf8.appspot.com/o/logo.png?alt=media&token=f18d2713-a4c2-4139-9e9f-af7020b154a8" /* Add a default profile image */,
    streak: 0, // Defaults to zero for new users
    pastWorkouts: [], // empty array for new users
    weight: 0, // User can set this property in the Profile screen
    height: 0, // User can set this property in the Profile screen
    following: [], // User will not be following any users to start
    visibility: "public", // Set visibility to public by default
    homeGym: {}, // User can set this property in the Profile screen
  })
    .then(() => {
      console.log("User successfully created!");
      updateProfile(auth.currentUser, {
        displayName: name,
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/gymshare-2cbf8.appspot.com/o/logo.png?alt=media&token=f18d2713-a4c2-4139-9e9f-af7020b154a8",
      });
    })
    .catch((error) => {
      console.error("Error creating user: ", error);
    });
}
