import { FeatureStatus } from '../common/feature-status.model';
import { IntelligentCoolingMode } from 'src/app/enums/intelligent-cooling.enum';

export class IntelligentCoolingCapability {
	public showIC: number = 0;
	public captionText: string = "";
	public mode: IntelligentCoolingMode;
	public showIntelligentCoolingModes = false;
	public autoModeToggle: FeatureStatus = new FeatureStatus(true, false); // promise is returning object
	public apsState = false;
	public selectedModeText = "";
	public isAutoTransitionEnabled = false;
}
