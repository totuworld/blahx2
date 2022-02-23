import { initializeApp, getApps } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const FirebaseCredentials = {
  apiKey: publicRuntimeConfig.publicApiKey,
  authDomain: publicRuntimeConfig.authDomain,
  projectId: publicRuntimeConfig.projectId,
};

export default class FirebaseAuthClient {
  public static instance: FirebaseAuthClient;

  private auth: Auth;

  public constructor() {
    const apps = getApps();
    if (!!apps.length === false) {
      console.log('firebase initializeApp');
      initializeApp(FirebaseCredentials);
    }
    this.auth = getAuth();
    console.log('firebase auth client constructor');
  }

  public static getInstance(): FirebaseAuthClient {
    if (!FirebaseAuthClient.instance) {
      FirebaseAuthClient.instance = new FirebaseAuthClient();
    }
    return FirebaseAuthClient.instance;
  }

  public get Auth(): Auth {
    return this.auth;
  }
}
