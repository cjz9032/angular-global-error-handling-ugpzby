import { FeatureStatus } from '../common/feature-status.model';

export class SmartAssistCapability {
	public isIntelligentSecuritySupported = false;
	public isLenovoVoiceSupported = false;
	public isIntelligentScreenSupported = false;
	public isIntelligentMediaSupported: FeatureStatus = new FeatureStatus(false, false); // promise is returning object
	public isAPSSupported = false;
}
