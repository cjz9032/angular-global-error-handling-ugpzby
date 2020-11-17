import { FeatureStatus } from '../common/feature-status.model';
import { AntiTheftResponse } from '../antiTheft/antiTheft.model';
import { SuperResolutionResponse } from './superResolution/superResolution.model';
import { HsaIntelligentSecurityResponse } from './hsa-intelligent-security.model/hsa-intelligent-security.model';

export class SmartAssistCapability {
	public isIntelligentSecuritySupported = false;
	public isLenovoVoiceSupported = false;
	public isIntelligentScreenSupported = false;
	public isIntelligentMediaSupported: FeatureStatus = new FeatureStatus(false, false); // promise is returning object
	public isAPSSupported = false;
	public isSuperResolutionSupported: SuperResolutionResponse = new SuperResolutionResponse(false, false,'');
	public isAntiTheftSupported: AntiTheftResponse = new AntiTheftResponse(false, false,false,false,false);
	public isAPSCapable = false;
	public isAPSSensorSupported = false;
	public isAPSHDDStatus = -1;
	public isHsaIntelligentSecuritySupported: HsaIntelligentSecurityResponse = new HsaIntelligentSecurityResponse(false, false);
}
