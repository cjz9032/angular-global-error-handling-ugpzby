import packageFile from '../../package.json';

export const environment = {
	production: false,
	cmsApiRoot: 'https://vantage.csw.lenovo.com',
	appVersion: packageFile.version
};
