import { db } from "../../firebase";
import { updateDoc, collection } from "firebase/firestore";

export default async function updateUserLocation(uuid, location) {
  const userRef = collection(db, "users", uuid);
  const docRef = await updateDoc(userRef, {
    location: location,
  });
  console.log(docRef);
  return;
}
