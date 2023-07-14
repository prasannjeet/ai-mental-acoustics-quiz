/**
 This is a template for the environment.ts file. Replace the placeholders with your actual values.
 Use environment.ts for development settings, and environment.prod.ts for production settings.
 When building the application for production, use environment.prod.ts and set the 'production' property to true.
 For development settings, use environment.ts and set the 'production' property to false.
 */
export const environment = {
  production: true, // Set to false for development environment
  hostname: '<hostname>', // The hostname of your server, e.g., 'https://aima.ooguy.com'
  serverContextUrl: '<serverContextUrl>', // The context URL of your server, e.g., '/api'
  appUrl: '<appUrl>', // The URL of your app, e.g., 'https://aimaback.ooguy.com'
  keycloak: {
    issuer: '<issuer>', // The issuer URL of your Keycloak server, e.g., 'https://keycloak.ooguy.com/'
    realm: '<realm>', // The realm of your Keycloak server, e.g., 'aima'
    clientId: '<clientId>', // The client ID of your Keycloak server, e.g., 'aima-frontend'
  },
  downloadMp3ToBrowser: false, // Set to true if you want to download MP3 files to the browser
  totalQuestions: 10, // The total number of questions in the quiz
  recordingTimeSeconds: 5, // The time limit for recording in seconds
  quizTimeSeconds: 10, // The time limit for the quiz in seconds
  firebase: {
    apiKey: "<apiKey>", // Your Firebase API key, e.g., "AIzaSyBvgKVMS18XioQoOdTM5FTnM88sLIE3T8o"
    authDomain: "<authDomain>", // Your Firebase auth domain, e.g., "chatapplication-95de4.firebaseapp.com"
    projectId: "<projectId>", // Your Firebase project ID, e.g., "chatapplication-95de4"
    storageBucket: "<storageBucket>", // Your Firebase storage bucket, e.g., "chatapplication-95de4.appspot.com"
    messagingSenderId: "<messagingSenderId>", // Your Firebase messaging sender ID, e.g., "798307463282"
    appId: "<appId>", // Your Firebase app ID, e.g., "1:798307463282:web:baade03a2578272831d2eb"
  }
};
