import { IEnvironment } from './environment-base';
import packageFile from '../../package.json';

export const environment: IEnvironment = {
	production: true,
	cmsApiRoot: 'https://stg.dxp.lenovo.com',
	upeApiRoot: 'https://api.uds-qa.lenovo.com',
	appVersion: packageFile.version,
	// Refer https://lnvusconf.lenovonet.lenovo.local/display/UPE3/Agent+id+for+App
	upeClientID: '5d725ff1-8cbf-49a4-8f0f-61bc3d70e88c',
	upeSharedKey: 'MmIwNTFjMTAtNTQwM',
	allowMockService: false,
	isLoggingEnabled: true,
	isServerSwitchEnabled: true,
	isCPTEnabled: false,
	paymentProcessApiRoot: 'https://uatpcsupport.lenovo.com/upgradewarranty?',
	getOrdersApiRoot: 'https://uatpcsupport.lenovo.com/api/v4/upsell/smart/getorders?serialNumber=',
	spPnListKey: 'U2FsdGVkX1+X2TVVOmuZWob7GGBAX0MqhbFG7Py5rjlN9MWpGuBkRkz23xBRr9xZllutntrWS2FDYJ9/CW0JIK8DaxmmShtyQEe+aqm9jYk='

};
