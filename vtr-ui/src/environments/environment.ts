import packageFile from '../../package.json';

export const environment = {
	production: false,
	cmsApiRoot: 'https://dev.csw.lenovo.com',
	appVersion: packageFile.version
};
