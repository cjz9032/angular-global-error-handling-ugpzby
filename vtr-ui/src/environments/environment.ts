import packageFile from '../../package.json';

export const environment = {
	production: false,
	cmsApiRoot: 'https://vantage-qa.csw.lenovo.com',
	appVersion: packageFile.version
};
