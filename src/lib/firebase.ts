import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { initializeFirestore, getFirestore, setLogLevel } from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfigData) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Silence verbose SDK offline / transient timeout notices
try {
  setLogLevel('error');
} catch {
  // Ignore if already set
}

// Google Docs & Drive OAuth Scopes
export const DOCS_SCOPES = [
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/documents.readonly',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
];

DOCS_SCOPES.forEach((scope) => {
  googleProvider.addScope(scope);
});

// Explicitly connect to the provisioned Firestore database ID with long-polling fallback for preview environments
export const FIRESTORE_DATABASE_ID = (firebaseConfigData as any).firestoreDatabaseId || 'ai-studio-eagletechnology-82a18861-ffdc-4950-ba50-d87fcd017921';

export const db = (() => {
  try {
    return initializeFirestore(app, {
      experimentalForceLongPolling: true,
    }, FIRESTORE_DATABASE_ID);
  } catch {
    return getFirestore(app, FIRESTORE_DATABASE_ID);
  }
})();

// In-memory access token cache (do not store in localStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

// Google sign-in with access token retrieval
export const googleSignIn = async (): Promise<{ user: FirebaseUser; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || '';
    if (accessToken) {
      cachedAccessToken = accessToken;
    }
    return { user: result.user, accessToken: cachedAccessToken || '' };
  } catch (err) {
    console.error('Sign in error:', err);
    throw err;
  } finally {
    isSigningIn = false;
  }
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Standard Firestore error handler per Firebase guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export { signInWithPopup, signOut, onAuthStateChanged };
export type { FirebaseUser };
