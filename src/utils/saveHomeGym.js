import { Alert } from "react-native";
import { db } from "../../firebase";
import {
  updateDoc,
  doc,
  collection,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

async function saveGym(gym) {
  // Check if gym is already in gyms collection
  let gymsRef = collection(db, "gyms");
  let q = query(gymsRef, where("place_id", "==", gym.place_id));
  let querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    let gymRef = doc(db, "gyms", gym.place_id);
    await setDoc(gymRef, {
      name: gym.name,
      address: gym.vicinity,
      location: {
        lat: gym.geometry.location.lat,
        lng: gym.geometry.location.lng,
      },
      place_id: gym.place_id,
      equipment: [],
    })
      .then(() => {
        console.log("Gym successfully saved!");
      })
      .catch((error) => {
        console.error("Error saving gym: ", error);
      });
  }

  //Add gym to gyms collection
}

export default async function saveHomeGym(uuid, gym) {
  let userGym = {
    name: gym.name,
    address: gym.vicinity,
    location: {
      lat: gym.geometry.location.lat,
      lng: gym.geometry.location.lng,
    },
    place_id: gym.place_id,
  };
  let userRef = doc(db, "users", uuid);
  await updateDoc(userRef, {
    homeGym: userGym,
  })
    .then(() => {
      Alert.alert("Home gym successfully saved!");
    })
    .catch((error) => {
      console.error("Error saving home gym: ", error);
    });
  saveGym(gym);
  return;
}
