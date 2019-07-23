import { environment } from '../../../../environments/environment';

const productionEnvironment = {
	backendUrl: 'https://api.figleafapp.com'
};

const developEnvironment = {
	backendUrl: 'https://api.sz.figleafapp.com'
};

export function getPrivacyEnvironment() {
	return environment.production ? productionEnvironment : developEnvironment;
}
