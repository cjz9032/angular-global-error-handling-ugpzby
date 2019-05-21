import packageFile from '../../package.json';

export const environment = {
	production: true,
	cmsApiRoot: 'https://vantage.csw.lenovo.com',
	appVersion: packageFile.version
};
