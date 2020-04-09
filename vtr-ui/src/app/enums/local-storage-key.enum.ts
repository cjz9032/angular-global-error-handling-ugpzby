/**
 * this enum is for local storage keys. new keys can be added here. please give meaningful names to key.
 */
export enum LocalStorageKey {
	EyeCareModeResetStatus = '[LocalStorageKey] EyeCareModeResetStatus',
	WelcomeTutorial = '[LocalStorageKey] WelcomeTutorial',
	GamingTutorial = '[LocalStorageKey] GamingTutorial',
	SecurityVPNStatus = '[LocalStorageKey] SecurityVPNStatus',
	SecurityPasswordManagerStatus = '[LocalStorageKey] SecurityPasswordManagerStatus',
	SecurityLandingPasswordManagerShowOwn = '[LocalStorageKey] SecurityLandingPasswordManagerShowOwn',
	SecurityLandingWifiSecurityShowOwn = '[LocalStorageKey] SecurityLandingWifiSecurityShowOwn',
	SecurityLandingVPNShowOwn = '[LocalStorageKey] SecurityLandingVPNShowOwn',
	SecurityWindowsHelloStatus = '[LocalStorageKey] SecurityWindowsHelloStatus',
	SecurityWindowsActiveStatus = '[LocalStorageKey] SecurityWindowsActiveStatus',
	SecurityUacStatus = '[LocalStorageKey] SecurityUacStatus',
	SecurityBitLockerStatus = '[LocalStorageKey] SecurityBitLockerStatus',
	SecurityShowWindowsHello = '[LocalStorageKey] SecurityShowWindowsHello',
	SecurityShowWifiSecurity = '[LocalStorageKey] SecurityShowWifiSecurity',
	SecurityMcAfee = '[LocalStorageKey] SecurityMcAfee',
	SecurityWindowsDefender = '[LocalStorageKey] SecurityWindowsDefender',
	SecurityOtherAntiVirus = '[LocalStorageKey] SecurityOtherAntiVirus',
	SecurityOtherFirewall = '[LocalStorageKey] SecurityOtherFirewall',
	SecurityMcAfeeStatusList = '[LocalStorageKey] SecurityMcAfeeStatusList',
	SecurityMcAfeeMetricList = '[LocalStorageKey] SecurityMcAfeeMetricList',
	SecurityMcAfeeTrialUrl = '[LocalStorageKey] SecurityMcAfeeTrialUrl',
	SecurityShowMetricList = '[LocalStorageKey] SecurityShowMetricList',
	SecurityShowMcafee = '[LocalStorageKey] SecurityShowMcafee',
	SecurityShowMetricButton = '[LocalStorageKey] SecurityShowMetricButton',
	SecurityWindowsDefenderStatusList = '[LocalStorageKey] SecurityWindowsDefenderStatusList',
	SecurityOthersAntiStatusList = '[LocalStorageKey] SecurityOthersAntiStatusList',
	SecurityOthersFirewallStatusList = '[LocalStorageKey] SecurityOthersFirewallStatusList',
	SecurityCurrentPage = '[LocalStorageKey] SecurityCurrentPage',
	SecurityFirewallLink = '[LocalStorageKey] SecurityFirewallLink',
	SecurityWifiSecurityState = '[LocalStorageKey] SecurityWifiSecurityState',
	SecurityWifiSecurityHistorys = '[LocalStorageKey] SecurityWifiSecurityHistorys',
	SecurityWifiSecurityIsLocationServiceOn = '[LocalStorageKey] SecurityWifiSecurityIsLocationServiceOn',
	SecurityHomeProtectionChsConsoleUrl = '[LocalStorageKey] SecurityHomeProtectionChsConsoleUrl',
	SecurityHomeProtectionStatus = '[LocalStorageKey] SecurityHomeProtectionStatus',
	SecurityHomeProtectionFamilyId = '[LocalStorageKey] SecurityHomeProtectionFamilyId',
	SecurityLandingAntivirusStatus = '[LocalStorageKey] SecurityLandingAntivirusStatus',
	SecurityLandingAntivirusFirewallStatus = '[LocalStorageKey] SecurityLandingAntivirusFirewallStatus',
	SecurityLandingWindowsHelloFingerprintStatus = '[LocalStorageKey] SecurityLandingWindowsHelloFingerprintStatus',
	SecurityLandingLevel = '[LocalStorageKey] SecurityLandingLevel',
	SecurityLandingMaliciousWifi = '[LocalStorageKey] SecurityLandingMaliciousWifi',
	DesktopMachine = '[LocalStorageKey] DesktopMachine',
	HadRunApp = '[LocalStorageKey] HadRunApp',
	LidFakeDeviceID = '[LocalStorageKey] LidFakeDeviceID',
	LidStarterAccount = '[LocalStorageKey] LidStarterAccount',
	LidFirstSignInDate = '[LocalStorageKey] LidFirstSignInDate',
	LidHasCreateStarterAccount = '[LocalStorageKey] LidHasCreateStarterAccount',
	LidUserFirstName = '[LocalStorageKey] LidUserFirstName',
	LidSsoDevMode = '[LocalStorageKey] LidSsoDevMode',
	CpuOCStatus = '[LocalStorageKey] CpuOCStatus',
	GpuOCStatus = '[LocalStorageKey] GpuOCStatus',
	RealThermalModeStatus = '[LocalStorageKey] RealThermalModeStatus',
	CurrentThermalModeStatus = '[LocalStorageKey] CurrentThermalModeStatus',
	CurrentThermalModeFeature = '[LocalStorageKey] CurrentThermalModeFeature',
	PrevThermalModeStatus = '[LocalStorageKey] PrevThermalModeStatus',
	IsSmartAssistSupported = '[LocalStorageKey] IsSmartAssistSupported',
	ConnectedHomeSecurityShowWelcome = '[LocalStorageKey] ConnectedHomeSecurityShowWelcome',
	ConnectedHomeSecurityAllDevices = '[LocalStorageKey] ConnectedHomeSecurityAllDevices',
	ConnectedHomeSecurityAccount = '[LocalStorageKey] ConnectedHomeSecurityAccount',
	ConnectedHomeSecurityMyDevice = '[LocalStorageKey] ConnectedHomeSecurityMyDevice',
	ConnectedHomeSecurityNotifications = '[LocalStorageKey] ConnectedHomeSecurityNotifications',
	ConnectedHomeSecurityDevicePosture = '[LocalStorageKey] ConnectedHomeSecurityDevicePosture',
	ConnectedHomeSecurityLocation = '[LocalStorageKey] ConnectedHomeSecurityLocation',
	NetworkBoostStatus = '[LocalStorageKey] NetworkBoostStatus',
	NetworkBoostList = '[LocalStorageKey] NetworkBoostList',
	NetworkBoosNeedToAskPopup = '[LocalStorageKey] NetworkBoosNeedToAskPopup',

	ConnectedHomeSecurityWelcomeComplete = '[LocalStorageKey] ConnectedHomeSecurityWelcomeComplete',
	/**
	 * 0  means "ideaPad",
	 * 1  means "thinkPad",
	 * 2 means "ideaCenter",
	 * 3 means "thinkCenter"
	 */
	MachineType = '[LocalStorageKey] MachineType',
	MachineFamilyName = '[LocalStorageKey] MachineFamilyName',
	TouchpadLockStatus = '[LocalStorageKey] TouchpadLockStatus',
	DolbyModeCache = '[LocalStorageKey] DolbyModeCache',
	RapidChargeCache = '[LocalStorageKey] RapidChargeCache',
	WifiSecurityCache = '[LocalStorageKey] WifiSecurityCache',
	LightingProfileById = '[LocalStorageKey] LightingProfileById',
	LightingProfileBrightness = '[LocalStorageKey] LightingProfileBrightness',
	LightingProfileEffectColor = '[LocalStorageKey] LightingProfileEffectColor',
	LightingProfileEffectColorTop = '[LocalStorageKey] LightingProfileEffectColorTop',
	LightingProfileEffectColorSide = '[LocalStorageKey] LightingProfileEffectColorSide',
	LedDriver = '[LocalStorageKey] LedDriver',
	ProfileBrightness = '[LocalStorageKey] ProfileBrightness',
	LightingCapabilities = '[LocalStorageKey] LightingCapabilities',
	ProfileId = '[LocalStorageKey] ProfileId',
	LightingRGBTop = '[LocalStorageKey] LightingRGBTop',
	LightingRGBSide = '[LocalStorageKey] LightingRGBSide',
	LightingSetDefaultProfile = '[LocalStorageKey] LightingSetDefaultProfile',

	// DTX50 lighting page
	LightingCapabilitiesNewversionDesk = '[LocalStorageKey] LightingCapabilitiesNewversionDesk',
	ledLayoutVersion = '[LocalStorageKey] ledLayoutVersion',

	LightingProfileByIdDesk1 = '[LocalStorageKey] LightingProfileByIdDesk1',
	LightingProfileByIdDesk2 = '[LocalStorageKey] LightingProfileByIdDesk2',
	LightingProfileByIdDesk3= '[LocalStorageKey] LightingProfileByIdDesk3',

	LightingProfileDeskDefault1 = '[LocalStorageKey] LightingProfileDeskDefault1',
	LightingProfileDeskDefault2 = '[LocalStorageKey] LightingProfileDeskDefault2',
	LightingProfileDeskDefault3= '[LocalStorageKey] LightingProfileDeskDefault3',

	// LNBX50 lighting page
	KeyboardToggleStatusLNBx50 = '[LocalStorageKey] KeyboardToggleStatusLNBx50',
	LightingCapabilitiesNewversionNote = '[LocalStorageKey] LightingCapabilitiesNewversionNote',
	LightingProfileByIdNewversionNote = '[LocalStorageKey] LightingProfileByIdNewversionNote',
	LedSwitchButtonFeature = '[LocalStorageKey] LedSwitchButtonFeature',

	LightingProfileByIdNoteOff1 = '[LocalStorageKey] LightingProfileByIdNoteOff1',
	LightingProfileByIdNoteOn1 = '[LocalStorageKey] LightingProfileByIdNoteOn1',
	LightingProfileByIdNoteOff2 = '[LocalStorageKey] LightingProfileByIdNoteOff2',
	LightingProfileByIdNoteOn2 = '[LocalStorageKey] LightingProfileByIdNoteOn2',
	LightingProfileByIdNoteOff3 = '[LocalStorageKey] LightingProfileByIdNoteOff3',
	LightingProfileByIdNoteOn3 = '[LocalStorageKey] LightingProfileByIdNoteOn3',

	LightingProfileByIdDefault1 = '[LocalStorageKey] LightingProfileByIdDefault1',
	LightingProfileByIdDefault2 = '[LocalStorageKey] LightingProfileByIdDefault2',
	LightingProfileByIdDefault3 = '[LocalStorageKey] LightingProfileByIdDefault3',

	SystemUpdateCriticalUpdateStatus = '[LocalStorageKey] SystemUpdateCriticalUpdateStatus',
	SystemUpdateRecommendUpdateStatus = '[LocalStorageKey] SystemUpdateRecommendUpdateStatus',
	SystemUpdateLastScanTime = '[LocalStorageKey] SystemUpdateLastScanTime',
	SystemUpdateLastInstallTime = '[LocalStorageKey] SystemUpdateLastInstallTime',
	SystemUpdateNextScheduleScanTime = '[LocalStorageKey] SystemUpdateNextScheduleScanTime',
	SystemUpdateInstallationHistoryList = '[LocalStorageKey] SystemUpdateInstallationHistoryList',

	// this enum is for local storage keys. new keys can be added here. Please give meaningful names to key
	desktopType = '[LocalStorageKey] DesktopType',
	liteGaming = '[LocalStorageKey] LiteGaming',
	cpuInfoFeature = '[LocalStorageKey] CpuInfoFeature',
	gpuInfoFeature = '[LocalStorageKey] GpuInfoFeature',
	memoryInfoFeature = '[LocalStorageKey] MemoryInfoFeature',
	hddInfoFeature = '[LocalStorage] HddInfoFeature',
	touchpadLockFeature = '[LocalStorageKey] TouchpadLockFeature',
	winKeyLockfeature = '[LocalStorageKey] WinKeyLockFeature',
	networkBoostFeature = '[LocalStorageKey] NetworkBoostFeature',
	cpuOCFeature = '[LocalStorageKey] CpuOCFeature',
	gpuOCFeature = '[LocalStorageKey] GpuOCFeature',
	advanceCPUOCFeature = '[LocalStorageKey] AdvanceCPUOCFeature',
	advanceGPUOCFeature = '[LocalStorageKey] AdvanceGPUOCFeature',
	ledSetFeature = '[LocalStorageKey] LedSetFeature',
	memOCFeature = '[LocalStorageKey] MemOCFeature',
	macroKeyFeature = '[LocalStorageKey] MacroKeyFeature',
	hybridModeFeature = '[LocalStorageKey] HybridModeFeature',
	optimizationFeature = '[LocalStorageKey] OptimizationFeature',
	smartFanFeature = '[LocalStorageKey] SmartFanFeature',
	thermalModeVersion = '[LocalStorageKey] ThermalModeVersion',
	supporttedThermalMode = '[LocalStorageKey] SupporttedThermalMode',
	xtuService = '[LocalStorageKey] XtuService',
	nvDriver = '[LocalStorageKey] NvDriver',
	fbNetFilter = '[LocalStorageKey] FbNetFilter',
	ledDriver = '[LocalStorageKey] LedDriver',
	winKeyLockFeature = '[LocalStorageKey] WinKeyLockFeature',
	cpuUsage = '[LocalStorageKey] cpuUsage',
	cpuCapacity = '[LocalStorageKey] cpuCapacity',
	gpuUsage = '[LocalStorageKey] gpuUsage',
	gpuCapacity = '[LocalStorageKey] gpuCapacity',
	ramUsage = '[LocalStorageKey] ramUsage',
	ramCapacity = '[LocalStorageKey] ramCapaity',
	cpuBaseFrequency = '[LocalStorageKey] cpuBaseFrequency',
	disksList = '[LocalStorageKey] disksList',
	gpuModulename = '[LocalStorageKey] gpuModulename',
	gpuMaxFrequency = '[LocalStorageKey] gpuMaxFrequency',
	memorySize = '[LocalStorageKey] ramMemorySize',
	hddList = '[LocalStorageKey] hddList',
	ramOver = '[LocalStorageKey] ramModuleName',
	gpuOver = '[LocalStorageKey] gpuModuleName ',
	cpuOver = '[LocalStorageKey] cpuModuleName',
	type = '[LocalStorageKey] type',
	capacity = '[LocalStorageKey] capacity',
	diskUsage = '[LocalStorageKey] diskUsage',
	hddName = '[LocalStorageKey] hddName',
	isSystemDisk = '[LocalStorageKey] isSystemDisk',
	usedDisk = '[LocalStorageKey] usedDisk',
	autoSwitchStatus = '[LocalStorageKey] AutoSwitchStatus',
	// Version 3.3: over drive
	overDriveFeature = '[LocalStorageKey] OverDriveFeature',
	overDriveStatus = '[LocalStorageKey] OverDriveStatus',

	// this enum is for macrokey local storage key
	MacroKeyType = '[LocalStorageKey] MacroKeyType',
	MacroKeyStatus = '[LocalStorageKey] MacroKeyStatus',
	MacroKey = '[LocalStorageKey] MacroKey',
	MacroKeyRecordedStatus = '[LocalStorageKey] MacroKeyRecordedStatus',
	MacroKeyChangeStatus = '[LocalStorageKey] MacroKeyChangeStatus',
	PrevMacroKeyStatus = '[LocalStorageKey] PrevMacroKeyStatus',
	PrevMacroKey = '[LocalStorageKey] PrevMacroKey',
	PrevMacroKeyRepeat = '[LocalStorageKey] PrevMacroKeyRepeat',
	PrevMacroKeyInterval = '[LocalStorageKey] PrevMacroKeyInterval',
	InitialKeyMacroKeyData = '[LocalStorageKey] InitialKeyMacroKeyData',
	CurrentMacroKeyRepeat = '[LocalStorageKey] CurrentMacroKeyRepeat',
	CurrentMacroKeyInterval = '[LocalStorageKey] CurrentMacroKeyInterval',
	SubBrand = '[LocalStorageKey] SubBrand',

	UserDeterminePrivacy = '[LocalStorageKey] UserDeterminePrivacy',

	SmartAssistCapability = '[LocalStorageKey] SmartAssistCapability',
	// server switch strorage key
	ServerSwitchKey = '[LocalStorageKey] ServerSwitch',
	memOCFeatureStatus = '[LocalStorageKey] MemOCFeatureStatus',
	hybridModeFeatureStatus = '[LocalStorageKey] HybridModeFeatureStatus',
	allGamingCapabilities = '[LocalStorageKey] AllGamingCapabilities',

	LastSystemUpdateStatus = '[LocalStorageKey] SystemUpdateStatus',
	LastWarrantyStatus = '[LocalStorageKey] LastWarrantyStatus',
	InputAccessoriesCapability = '[LocalStorageKey] InputAccessoriesCapability',
	VOIPCapability = '[LocalStorageKey] VOIPCapability',
	DashboardCameraPrivacy = '[LocalStorageKey] DashboardCameraPrivacy',
	// DashboardMicrophoneStatus = '[LocalStorageKey] DashboardMicrophoneStatus',
	// DashboardEyeCareMode = '[LocalStorageKey] DashboardEyeCareMode',

	// Auto close storage key
	AutoCloseStatus = '[LocalStorageKey] AutoCloseStatus',
	AutoCloseList = '[LocalStorageKey] AutoCloseList',
	NeedToAsk = '[LocalStorageKey] NeedToAsk',

	//Gaming 3.2 advanced OC
	AdvancedOCInfo = '[LocalStorageKey] AdvancedOCInfo',

	BetaUser = '[LocalStorageKey] BetaUser',
	BetaTag = '[LocalStorageKey] BetaTag',
	IntelligentCoolingCapability = '[LocalStorageKey] IntelligentCoolingCapability',
	SmartStandbyCapability = '[LocalStorageKey] SmartStandbyCapability',
	AlwaysOnUSBCapability = '[LocalStorageKey] AlwaysOnUSBCapability',
	EasyResumeCapability = '[LocalStorageKey] EasyResumeCapability',
	VantageToolbarCapability = '[LocalStorageKey] VantageToolbarCapability',
	EnergyStarCapability = '[LocalStorageKey] EnergyStarCapability',
	AirplanePowerModeCapability = '[LocalStorageKey] AirplanePowerModeCapability',
	BatteryChargeThresholdCapability = '[LocalStorageKey] BatteryChargeThresholdCapability',
	ExpressChargingCapability = '[LocalStorageKey] ExpressChargingCapability',
	ConservationModeCapability = '[LocalStorageKey] ConservationModeCapability',
	DisplayColorTempCapability = '[LocalStorageKey] DisplayColorTempCapability',
	DisplayEyeCareModeCapability = '[LocalStorageKey] DisplayEyeCareModeCapability',

	// Apps For You storage key
	UnreadMessageCount = '[LocalStorageKey] UnreadMessageCount',

	SmartAssistCache = '[LocalStorageKey] SmartAssistCache',
	DolbyAudioToggleCache = '[LocalStorageKey] DolbyAudioToggleCache',

	// Ad policy local storage key
	AdPolicyCache = '[LocalStorageKey] AdPolicyCache',
	// App Search
	UnSupportFeatures = '[LocalStorageKey] UnSupportFeatures',
	TopRowFunctionsCapability = '[LocalStorageKey] TopRowFunctionsCapability',
	BacklightCapability = '[LocalStorageKey] BacklightCapability',
	GaugeResetInformation = '[LocalStorageKey] GaugeResetInformation',
	IsSubscribed = '[LocalStorageKey] IsSubscribed',
	SubscribtionDetails = '[LocalStorageKey] SubscribtionDetails',
	IsPowerPageAvailable = '[LocalStorageKey] isPowerPageAvailable',
	DashboardLastWelcomeText = '[LocalStorageKey] DashboardLastWelcomeText',
	IsDolbyModeAvailable = '[LocalStorageKey] IsDolbyModeAvailable',
	IsAudioPageAvailable = '[LocalStorageKey] IsAudioPageAvailable',
	IsBatteryQuickSettingAvailable = '[LocalStorageKey] IsBatteryQuickSettingAvailable',

	LocalInfoSegment = '[LocalStorageKey] LocalInfoSegment',
	ChangedSelfSelectConfig = '[LocalStorageKey] ChangedSelfSelectConfig',

	GaugeResetCapability = '[LocalStorageKey] GaugeResetCapability',

		// New feature tips
	NewFeatureTipsVersion = '[LocalStorageKey] NewFeatureTipsVersion',

	// Device Settings storage key
	MicrohoneCapability = '[LocalStorageKey] MicrohoneCapability',

	// TEMP battery condition
	BatteryCondition = '[LocalStorageKey] batteryCondition',
	// DPM
	DPMAllPowerPlans = '[LocalStorageKey] DPMAllPowerPlans',
	// UPE
	UPEChannelTags = '[LocalStorageKey] UPEChannelTags',
	PriorityControlCapability = '[LocalStorageKey] PriorityControlCapability',
	KBDBacklightThinkPadCapability =  '[LocalStorageKey] KBDBacklightThinkPadCapability',

	// Store Rating
	RatingConditionMet = '[LocalStorageKey] RatingConditionMet',
	RatingLastPromptTime =  '[LocalStorageKey] RatingLastPromptTime',
	RatingPromptCount = '[LocalStorageKey] RatingPromptCount'
}
