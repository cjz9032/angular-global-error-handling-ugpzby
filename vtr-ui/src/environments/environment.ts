// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { ENDPOINTS } from './endpoints';

export const environment = {
	production: false,
	endpoints: ENDPOINTS,
	apiRoot: 'http://13.250.142.178:8082/',
	imgRoot: 'http://13.250.142.178:8082/',
	ssoCallback: 'http://13.250.142.178',
	ssoRoot: 'https://passport.lenovo.com/wauthen5/',
	ssoLogin: 'preLogin?lenovoid.action=uilogin&lenovoid.realm=lcp.local&lenovoid.ctx=U08&lenovoid.lang=en_US&lenovoid.cb=',
	ssoLogout: 'gateway?lenovoid.action=uilogout&lenovoid.cb=',
	bkgImg: 'apac/v1/image?deviceid=09067ba3-6886-44f3-ab43-d3e0bda2197f'
};
