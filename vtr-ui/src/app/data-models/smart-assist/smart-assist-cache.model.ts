import { FeatureStatus } from '../common/feature-status.model';
import { IntelligentSecurity } from './intelligent-security.model';
import { IntelligentScreen } from './intelligent-screen.model';

export class SmartAssistCache {
	public intelligentSecurity: IntelligentSecurity;
	public intelligentScreen: IntelligentScreen;
	public intelligentMedia = new FeatureStatus(false, true);
	public isAPSAvailable = false;
	public hpdSensorType = 0;
	public sensitivityVisibility: boolean;
}
