import packageFile from '../../package.json';

export const environment = {
	production: true,
	cmsApiRoot: 'https://cms.csw.lenovo.com',
	appVersion: packageFile.version
};
