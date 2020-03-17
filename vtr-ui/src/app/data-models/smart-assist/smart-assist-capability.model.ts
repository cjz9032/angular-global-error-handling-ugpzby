import { FeatureStatus } from '../common/feature-status.model';
import { HsaIntelligentSecurityResponse } from './HsaIntelligentSecurity/intelligentSecurity.model';

export class SmartAssistCapability {
	public isIntelligentSecuritySupported = false;
	public isLenovoVoiceSupported = false;
	public isIntelligentScreenSupported = false;
	public isIntelligentMediaSupported: FeatureStatus = new FeatureStatus(false, false); // promise is returning object
	public isAPSSupported = false;
	public isSuperResolutionSupported: FeatureStatus = new FeatureStatus(false, false);
	public isAPSCapable = false;
	public isAPSSensorSupported = false;
	public isAPSHDDStatus = -1;
	public isHsaIntelligentSecuritySupported: HsaIntelligentSecurityResponse = new HsaIntelligentSecurityResponse(false, 0, false);
}
