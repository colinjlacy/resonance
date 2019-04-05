// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  HOST_PROTO: `http://`,
  WS_PROTO: `ws://`,
  HOST_NAME: `raspberrypi.local`,
  HOST_PORT: `:3000`,
  JOB_PATH: `/job`,
  JOBS_PATH: `/jobs`,
  SCAN_PATH: `/scan`,
  IMAGE_PATH: `/image`,
  EMAIL_PATH: `/email`,
  STORE_PATH: `/store`,
  USER_PATH: `/user`,
  AUTH_PATH: `/auth`,
  SYNCED_PATH: `/user/synced`,
  SYNC_WS_PATH: `/sync`,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
