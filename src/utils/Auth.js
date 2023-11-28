import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const navigation = useNavigation();

async function LoginWithEmailPassword(email, password) {
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      if (userCredential.user) {
        navigation.navigate("Home");
      }
    })
    .catch((error) => {
      console.log(error);
      alert("Something went wrong, Please try again.");
    });

  return;
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
