import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function isConfigured() {
  return !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
}

if (isConfigured() && getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      // env vars store \n as literal string — restore actual newlines
      privateKey:  process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });
}

export const db = isConfigured() ? getFirestore() : null;
export const FIREBASE_READY = isConfigured();
