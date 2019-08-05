import packageFile from '../../package.json';

export const environment = {
	production: true,
	cmsApiRoot: 'https://vantage.csw.lenovo.com',
	upeApiRoot: 'https://api.uds-dev.lenovo.com',
	appVersion: packageFile.version,
	upeClientID: '5d725ff1-8cbf-49a4-8f0f-61bc3d70e88c'
};
