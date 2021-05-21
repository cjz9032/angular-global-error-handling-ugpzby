import { IEnvironment } from './environment-base';
import packageFile from '../../package.json';

export const environment: IEnvironment = {
	production: true,
	debuggingSnackbar: true,
	cmsApiRoot: 'https://vantage.csw.lenovo.com',
	upeApiRoot: 'https://portal.naea1.uds.lenovo.com',
	appVersion: packageFile.version,
	// Refer https://lnvusconf.lenovonet.lenovo.local/display/UPE3/Agent+id+for+App
	upeClientID: '5d725ff1-8cbf-49a4-8f0f-61bc3d70e88c',
	upeSharedKey: 'MmIwNTFjMTAtNTQwM',
	allowMockService: false,
	isLoggingEnabled: true,
	isServerSwitchEnabled: true,
	pcSupportApiRoot: 'https://uatpcsupport.lenovo.com'
};
