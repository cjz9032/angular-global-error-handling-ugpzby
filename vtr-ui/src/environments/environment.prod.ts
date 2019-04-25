import packageFile from '../../package.json';

export const environment = {
	production: true,
	cmsApiRoot: 'https://vantage-qa.csw.lenovo.com',
	appVersion: packageFile.version
};
