import { db } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";

export default async function getUser(uuid) {
  let userRef = doc(db, "users", uuid);
  let user = await getDoc(userRef);
  if (user.exists()) {
    return user.data();
  } else {
    console.log("No such document!");
    return;
  }
}
