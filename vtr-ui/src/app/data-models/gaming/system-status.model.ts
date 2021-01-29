import { LocalStorageKey } from '../../enums/local-storage-key.enum';
export default {
    hwOverClockInfo: {
		cpuOverClockInfo: {
			featureName: 'cpuOCState',
			featureLocalCache: LocalStorageKey.cpuOCFeature,
			driverLocalCache: LocalStorageKey.xtuService,
			isSupportOCFeature: false,
			isOverClocking: false
		},
		gpuOverClockInfo: {
			featureName: 'gpuOCState',
			featureLocalCache: LocalStorageKey.gpuCoreOCFeature,
			driverLocalCache: LocalStorageKey.nvDriver,
			isSupportOCFeature: false,
			isOverClocking: false
		},
		vramOverClockInfo: {
			featureName: 'gpuOCState',
			featureLocalCache: LocalStorageKey.gpuVramOCFeature,
			driverLocalCache: LocalStorageKey.nvDriver,
			isSupportOCFeature: false,
			isOverClocking: false
		}
	},
};
