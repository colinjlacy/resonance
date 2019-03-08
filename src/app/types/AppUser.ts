export interface AppUser {
  apiKey: string;
  appName: string;
  authDomain: string;
  createdAt: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  lastLoginAt: string;
  phoneNumber: number;
  photoURL: string;
  providerData: Array<any>;
  redirectEventId: string;
  stsTokenManager: any;
  uid: string;
}

