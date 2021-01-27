import { ForteClient } from './forte-client.interface';
import { DolbyFusionClient } from './dolby-fusion-client.interface';
import { VantageShellService } from '../../../../../services/vantage-shell/vantage-shell.service';
import { DeviceService } from '../../../../../services/device/device.service';
import { ForteService } from './forte.service';
import { DolbyFusionService } from './dolby-fusion.service';
import { NoRecognizedVendorService } from './no-recognized-vendor.service';

export const AudioVendorFactory = (
	forteClient: ForteClient,
	dolbyFusionClient: DolbyFusionClient,
	vantageShellService: VantageShellService,
	deviceService: DeviceService
) => {
	if (forteClient.getHSASupported() && !forteClient.isClassicLayout) {
		return new ForteService(vantageShellService, deviceService);
	}
	if (dolbyFusionClient.getDolbyFusionSupported()) {
		return new DolbyFusionService(vantageShellService, deviceService);
	}
	return new NoRecognizedVendorService();
};
