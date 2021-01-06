enum Category {
	dashboard = 'appSearch.features.dashboard',
	myDevice = 'appSearch.features.myDevice',
	systemUpdate = 'appSearch.features.systemUpdate',
	mySecurity = 'appSearch.features.mySecurity',
	smartPerformance = 'appSearch.features.smartPerformance',
	hardwareScan = 'appSearch.features.hardwareScan',
	power = 'appSearch.features.power',
	cameraAndDisplay = 'appSearch.features.cameraAndDisplay',
	audio = 'appSearch.features.audio',
	input = 'appSearch.features.input',
	smartAssist = 'appSearch.features.smartAssist',
};

enum MenuID {
	dashboard = 'dashboard',
	device = 'device',
	systemUpdates = 'system-updates',
	security = 'security',
	smartPerformance = 'smart-performance',
	hardwareScan = 'hardware-scan',
	deviceSettings = 'device-settings',
	power = 'power',
	displayCamera = 'display-camera',
	audio = 'audio',
	inputAccessories = 'input-accessories',
	smartAssist = 'smart-assist',
};

export const featureSource = [
	/***
	 * appSearch.features.dashboard
	 */
	{
		id: `${Category.dashboard}.page`,
		categoryId: Category.dashboard,
		featureName: `${Category.dashboard}.page.featureName`, // if the featureName and category is omited, we will fill it with the according id
		category: `${Category.dashboard}.category`,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: MenuID.dashboard,
			route: '',
			params: [],
		},
	},

	/***
	 * appSearch.features.myDevice
	 */
	{
		id: `${Category.myDevice}.page`,
		categoryId: Category.myDevice,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: MenuID.device,
			route: '',
			params: [],
		},
	},

	/***
	 * appSearch.features.systemUpdate
	 */
	{
		id: `${Category.systemUpdate}.page`,
		categoryId: Category.systemUpdate,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: MenuID.systemUpdates,
			route: '',
			params: [],
		},
	},

	/***
	 * appSearch.features.mySecurity
	 */
	{
		id: `${Category.mySecurity}.page`,
		categoryId: Category.mySecurity,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: MenuID.security,
			route: '',
			params: [],
		},
	},

	/***
	 * appSearch.pages.smartPerformance
	 */
	{
		id: `${Category.smartPerformance}.page`,
		categoryId: Category.smartPerformance,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: MenuID.smartPerformance,
			route: '',
			params: [],
		},
	},

	/***
	 * appSearch.pages.hwScan
	 */
	{
		id: `${Category.hardwareScan}.page`,
		categoryId: Category.hardwareScan,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: MenuID.hardwareScan,
			route: '',
			params: [],
		},
	},

	/***
	 * appSearch.features.power
	 */
	{
		id: `${Category.power}.batteryInformation`,
		categoryId: Category.power,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.power, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.power}.batteryDetails`,
		categoryId: Category.power,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.power, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.power}.smartStandby`,
		categoryId: Category.power,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.power, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.power}.alwaysOnUSB`,
		categoryId: Category.power,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.power, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.power}.batteryChargeThreshold`,
		categoryId: Category.power,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.power, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.power}.intelligentCooling`,
		categoryId: Category.power,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.power, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.power}.dynamicThermalControl`,
		categoryId: Category.power,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.power, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.power}.easyResume`,
		categoryId: Category.power,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.power, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.power}.rapidCharge`,
		categoryId: Category.power,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.power, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.power}.vantageToolbar`,
		categoryId: Category.power,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.power, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},

	/***
	 * appSearch.features.cameraAndDisplay
	 */
	{
		id: `${Category.cameraAndDisplay}.cameraPrivacyMode`,
		categoryId: Category.cameraAndDisplay,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.displayCamera, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.cameraAndDisplay}.privacyGuard`,
		categoryId: Category.cameraAndDisplay,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.displayCamera, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.cameraAndDisplay}.eyeCareMode`,
		categoryId: Category.cameraAndDisplay,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.displayCamera, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.cameraAndDisplay}.cameraSettings`,
		categoryId: Category.cameraAndDisplay,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.displayCamera, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.cameraAndDisplay}.cameraBackgroundBlur`,
		categoryId: Category.cameraAndDisplay,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.displayCamera, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},

	/***
	 * appSearch.features.audio
	 */
	{
		id: `${Category.audio}.dolbyAudio`,
		categoryId: Category.audio,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.audio, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.audio}.microphoneSettings`,
		categoryId: Category.audio,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.audio, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.audio}.automaticOptimizationForECourse`,
		categoryId: Category.audio,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.audio, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},

	/***
	 * appSearch.features.input
	 */
	{
		id: `${Category.input}.touchPadSettings`,
		categoryId: Category.input,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId:  [MenuID.inputAccessories, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.input}.trackPointSettings`,
		categoryId: Category.input,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.inputAccessories, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.input}.keyboardBacklight`,
		categoryId: Category.input,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.inputAccessories, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.input}.smartKeyboardBacklight`,
		categoryId: Category.input,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.inputAccessories, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.input}.hiddenKeyboardFunctions`,
		categoryId: Category.input,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.inputAccessories, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.input}.voIPHotkeyFunction`,
		categoryId: Category.input,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.inputAccessories, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.input}.topRowKeyFunctions`,
		categoryId: Category.input,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.inputAccessories, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.input}.userDefinedKey`,
		categoryId: Category.input,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.inputAccessories, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.input}.fnAndCtrlKeySwap`,
		categoryId: Category.input,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: [MenuID.inputAccessories, MenuID.deviceSettings],
			route: '',
			params: [],
		},
	},

	/***
	 * appSearch.features.smartAssist
	 */
	{
		id: `${Category.smartAssist}.activeProtectionSystem`,
		categoryId: Category.smartAssist,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: MenuID.smartAssist,
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.smartAssist}.intelligentSensing`,
		categoryId: Category.smartAssist,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: MenuID.smartAssist,
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.smartAssist}.zeroTouchLogin`,
		categoryId: Category.smartAssist,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: MenuID.smartAssist,
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.smartAssist}.zeroTouchLock`,
		categoryId: Category.smartAssist,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: MenuID.smartAssist,
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.smartAssist}.zeroTouchVideoPlayback`,
		categoryId: Category.smartAssist,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: MenuID.smartAssist,
			route: '',
			params: [],
		},
	},
	{
		id: `${Category.smartAssist}.videoResolutionUpscalingSR`,
		categoryId: Category.smartAssist,
		icon: ['fal', 'gem'],
		action: {
			type: 'navigation',
			menuId: MenuID.smartAssist,
			route: '',
			params: [],
		},
	},
];
