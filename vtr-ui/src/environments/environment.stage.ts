import { IEnvironment } from './environment-base';
import packageFile from '../../package.json';

export const environment: IEnvironment = {
	production: true,
	cmsApiRoot: 'https://vantage.csw.lenovo.com',
	upeApiRoot: 'https://portal.naea1.uds.lenovo.com',
	appVersion: packageFile.version,
	// Refer https://lnvusconf.lenovonet.lenovo.local/display/UPE3/Agent+id+for+App
	upeClientID: '5d725ff1-8cbf-49a4-8f0f-61bc3d70e88c',
	upeSharedKey: '2b051c10-5401-4357-918f-bcc86df826f9',
	allowMockService: false
};
