// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: "https://us-central1-testapp-c07dd.cloudfunctions.net",
  firebase: {
    apiKey: "AIzaSyD7VowwzsD8Ka8YFPRz0ZahCwwyW6oYm8E",
    authDomain: "testapp-c07dd.firebaseapp.com",
    databaseURL: "https://testapp-c07dd.firebaseio.com",
    projectId: "testapp-c07dd",
    storageBucket: "testapp-c07dd.appspot.com",
    messagingSenderId: "835710133089",
    appId: "1:835710133089:web:42b17839b922d5b2a0db20"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
