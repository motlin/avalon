import {selectFirebaseConfig} from './firebase-configs';

// Set VITE_FIREBASE_PROJECT at build time to target a different project,
// e.g. `yarn build --mode georgyo-avalon`.
const config = selectFirebaseConfig(import.meta.env.VITE_FIREBASE_PROJECT);

export default config;
