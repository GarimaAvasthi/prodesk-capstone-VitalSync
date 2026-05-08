/**
 * Firebase initialization and configuration
 * Handles Firebase setup and exports auth and database instances
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, initializeFirestore } from "firebase/firestore";
import "firebase/firestore";
import { logger } from "./logger";
import { env } from "./env";

const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
};

// Validate Firebase configuration
function validateFirebaseConfig(): void {
  const requiredFields = ["apiKey", "authDomain", "projectId", "appId"] as const;
  const missingFields = requiredFields.filter((field) => !firebaseConfig[field]);

  if (missingFields.length > 0) {
    logger.error(
      `Firebase configuration incomplete: missing ${missingFields.join(", ")}`,
      "firebase"
    );
  }
}

validateFirebaseConfig();

// Prevent re-initialization in Next.js dev hot-reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services
export const auth = getAuth(app);

let dbInstance: any;
try {
  dbInstance = getFirestore(app);
} catch (e) {
  // If getFirestore fails, try initializeFirestore which is more explicit
  dbInstance = initializeFirestore(app, {
    ignoreUndefinedProperties: true,
  });
}

export const db = dbInstance;

// Development: Use emulator for faster testing
if (
  env.app.isDevelopment &&
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true"
) {
  try {
    connectAuthEmulator(auth, "http://localhost:9099", {
      disableWarnings: true,
    });
    connectFirestoreEmulator(db, "localhost", 8080);
    logger.info("Connected to Firebase emulator", "firebase");
  } catch (error) {
    logger.warn("Could not connect to Firebase emulator", "firebase", {
      error: String(error),
    });
  }
}

// Log Firebase initialization
logger.info("Firebase initialized successfully", "firebase", {
  projectId: firebaseConfig.projectId,
  environment: env.app.env,
});

export default app;
