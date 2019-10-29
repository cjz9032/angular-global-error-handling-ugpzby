import { environment } from '../../../../environments/environment';

const productionEnvironment = {
	backendUrl: 'https://api.figleafapp.com',
	staticUrl: 'https://static.figleafapp.com/anti-tracking/img/'
};

const developEnvironment = {
	backendUrl: 'https://api.tz.figleafapp.com',
	staticUrl: 'https://static.figleafapp.com/anti-tracking/img/'
};

export function getPrivacyEnvironment() {
	return environment.production ? productionEnvironment : developEnvironment;
}
