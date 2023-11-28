import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

async function LoginWithEmailPassword(email, password) {
  await signInWithEmailAndPassword(auth, email, password),
    then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      return user;
    }).catch((error) => {
      return error;
    });
}

async function ResetPassword(email) {
  await sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Email sent");
    })
    .catch((error) => {
      console.log(error);
      alert("Something went wrong, Please try again.");
    });

  return;
}

export { LoginWithEmailPassword, ResetPassword };
