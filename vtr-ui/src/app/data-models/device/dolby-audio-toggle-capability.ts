import { DolbyModeResponse } from '../audio/dolby-mode-response';

export class DolbyAudioToggleCapability {
	public available = true;
	public status = false;
	public loader = true;
	public icon = [];
	public dolbyModeResponse: DolbyModeResponse;
}
