// Firebase web configs are public -- they ship in the client bundle -- so they live in
// source rather than in secrets. Which one a build uses is chosen by VITE_FIREBASE_PROJECT.
//
// No config carries a databaseURL: this app uses Firestore, not Realtime Database.
const FIREBASE_CONFIGS = {
  'avalon-cool': {
    apiKey: "AIzaSyARX8d_fjzy7_wd4JUdFuOyxA9EwTICodc",
    authDomain: "avalon-cool.firebaseapp.com",
    projectId: "avalon-cool",
    storageBucket: "avalon-cool.firebasestorage.app",
    messagingSenderId: "266781145190",
    appId: "1:266781145190:web:2e53b3df46819d5ec2d5a7"
  },
  'georgyo-avalon': {
    apiKey: "AIzaSyCwhCvO8NbTusBaHmHHnNT7yC0_11UL2RI",
    authDomain: "georgyo-avalon.firebaseapp.com",
    projectId: "georgyo-avalon",
    storageBucket: "georgyo-avalon.appspot.com",
    messagingSenderId: "1000859874531",
    appId: "1:1000859874531:web:789f785c58c574bff181d6"
  }
};

// avalon.cool is what this fork deploys, so an unset variable has to keep pointing there.
// Defaulting to upstream would silently write our players' games into someone else's project.
const DEFAULT_FIREBASE_PROJECT = 'avalon-cool';

function selectFirebaseConfig(projectId) {
  const requested = projectId || DEFAULT_FIREBASE_PROJECT;
  const config = FIREBASE_CONFIGS[requested];
  if (!config) {
    const known = Object.keys(FIREBASE_CONFIGS).join(', ');
    throw new Error(
      `Unknown Firebase project "${requested}" in VITE_FIREBASE_PROJECT. Known projects: ${known}`);
  }
  return config;
}

export {FIREBASE_CONFIGS, DEFAULT_FIREBASE_PROJECT, selectFirebaseConfig};
