import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
    initializeAuth,
    getReactNativePersistence
} from "firebase/auth";

const config = {
  apiKey: "AIzaSyCJTbOsk1QS1hOms2Fsa4U_EOye_oa2SyM",
  authDomain: "landing-place-94d0e.firebaseapp.com",
  projectId: "landing-place-94d0e",
  storageBucket: "landing-place-94d0e.appspot.com",
  messagingSenderId: "224726490527",
  appId: "1:224726490527:web:59ccce7170db58baa731aa",
  measurementId: "G-SDHGS0T1W5"
}

const app = initializeApp(config)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})
