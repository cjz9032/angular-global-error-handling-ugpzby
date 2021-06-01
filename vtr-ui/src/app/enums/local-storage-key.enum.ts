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
	SecurityMcAfeeStatisticDownload = '[LocalStorageKey] SecurityMcAfeeStatisticDownload',
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
	SecurityWifiSecurityPromptDialogPopUpDays = '[LocalStorageKey] SecurityWifiSecurityPromptDialogPopUpDays',
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

	IsSmartAssistSupported = '[LocalStorageKey] IsSmartAssistSupported',
	ConnectedHomeSecurityShowWelcome = '[LocalStorageKey] ConnectedHomeSecurityShowWelcome',
	ConnectedHomeSecurityAllDevices = '[LocalStorageKey] ConnectedHomeSecurityAllDevices',
	ConnectedHomeSecurityAccount = '[LocalStorageKey] ConnectedHomeSecurityAccount',
	ConnectedHomeSecurityMyDevice = '[LocalStorageKey] ConnectedHomeSecurityMyDevice',
	ConnectedHomeSecurityNotifications = '[LocalStorageKey] ConnectedHomeSecurityNotifications',
	ConnectedHomeSecurityDevicePosture = '[LocalStorageKey] ConnectedHomeSecurityDevicePosture',
	ConnectedHomeSecurityLocation = '[LocalStorageKey] ConnectedHomeSecurityLocation',
	ConnectedHomeSecurityWelcomeComplete = '[LocalStorageKey] ConnectedHomeSecurityWelcomeComplete',
	/**
	 * 0  means "ideaPad",
	 * 1  means "thinkPad",
	 * 2 means "ideaCenter",
	 * 3 means "thinkCenter"
	 */
	MachineType = '[LocalStorageKey] MachineType',
	MachineFamilyName = '[LocalStorageKey] MachineFamilyName',
	DolbyModeCache = '[LocalStorageKey] DolbyModeCache',
	SystemUpdateCriticalUpdateStatus = '[LocalStorageKey] SystemUpdateCriticalUpdateStatus',
	SystemUpdateRecommendUpdateStatus = '[LocalStorageKey] SystemUpdateRecommendUpdateStatus',
	SystemUpdateLastScanTime = '[LocalStorageKey] SystemUpdateLastScanTime',
	SystemUpdateLastInstallTime = '[LocalStorageKey] SystemUpdateLastInstallTime',
	SystemUpdateNextScheduleScanTime = '[LocalStorageKey] SystemUpdateNextScheduleScanTime',
	SystemUpdateInstallationHistoryList = '[LocalStorageKey] SystemUpdateInstallationHistoryList',

	// this enum is for local storage keys. new keys can be added here. Please give meaningful names to key
	hardwareScanFeature = '[LocalStorageKey] HardwareScanFeature',
	SubBrand = '[LocalStorageKey] SubBrand',
	UserDeterminePrivacy = '[LocalStorageKey] UserDeterminePrivacy',
	SmartAssistCapability = '[LocalStorageKey] SmartAssistCapability',

	AntiTheftCache = '[LocalStorageKey] AntiTheftCache',
	// server switch strorage key
	ServerSwitchKey = '[LocalStorageKey] ServerSwitch',

	LastSystemUpdateStatus = '[LocalStorageKey] SystemUpdateStatus',
	LastWarrantyStatus = '[LocalStorageKey] LastWarrantyStatus',
	LastWarrantyData = '[LocalStorageKey] LastWarrantyData',
	LastWarrantyLevels = '[LocalStorageKey] LastWarrantyLevels',
	InputAccessoriesCapability = '[LocalStorageKey] InputAccessoriesCapability',
	VOIPCapability = '[LocalStorageKey] VOIPCapability',
	DashboardDeviceStatusCardDate = '[LocalStorageKey] DashboardDeviceStatusCardDate',
	DashboardCameraPrivacy = '[LocalStorageKey] DashboardCameraPrivacy',
	// DashboardMicrophoneStatus = '[LocalStorageKey] DashboardMicrophoneStatus',
	// DashboardEyeCareMode = '[LocalStorageKey] DashboardEyeCareMode',

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
	IntelligentPerformanceSettings = '[LocalStorageKey] IntelligentPerformanceSettings',

	// Apps For You storage key
	UnreadMessageCount = '[LocalStorageKey] UnreadMessageCount',

	SmartAssistCache = '[LocalStorageKey] SmartAssistCache',
	DolbyAudioToggleCache = '[LocalStorageKey] DolbyAudioToggleCache',

	// Ad policy local storage key
	AdPolicyCache = '[LocalStorageKey] AdPolicyCache',
	// App Search
	FeaturesApplicableStatus = '[LocalStorageKey] FeaturesApplicableStatus',
	LastFullFeaturesDetectionTime = '[LocalStorageKey] LastFullFeaturesDetectionTime',

	TopRowFunctionsCapability = '[LocalStorageKey] TopRowFunctionsCapability',
	BacklightCapability = '[LocalStorageKey] BacklightCapability',
	GaugeResetInformation = '[LocalStorageKey] GaugeResetInformation',
	IsPowerPageAvailable = '[LocalStorageKey] isPowerPageAvailable',
	DashboardWelcomeTexts = '[LocalStorageKey] DashboardWelcomeTexts',
	IsDolbyModeAvailable = '[LocalStorageKey] IsDolbyModeAvailable',
	IsAudioPageAvailable = '[LocalStorageKey] IsAudioPageAvailable',
	IsBatteryQuickSettingAvailable = '[LocalStorageKey] IsBatteryQuickSettingAvailable',

	LocalInfoSegment = '[LocalStorageKey] LocalInfoSegment',
	ChangedSelfSelectConfig = '[LocalStorageKey] ChangedSelfSelectConfig',

	GaugeResetCapability = '[LocalStorageKey] GaugeResetCapability',

	// New feature tips
	NewFeatureTipsVersion = '[LocalStorageKey] NewFeatureTipsVersion',

	// Device Settings storage key
	MicrophoneCapability = '[LocalStorageKey] MicrophoneCapability',

	// TEMP battery condition
	BatteryCondition = '[LocalStorageKey] batteryCondition',
	// DPM
	DPMAllPowerPlans = '[LocalStorageKey] DPMAllPowerPlans',
	// UPE
	UPEChannelTags = '[LocalStorageKey] UPEChannelTags',
	PriorityControlCapability = '[LocalStorageKey] PriorityControlCapability',
	KBDBacklightThinkPadCapability = '[LocalStorageKey] KBDBacklightThinkPadCapability',

	// Store Rating
	RatingConditionMet = '[LocalStorageKey] RatingConditionMet',
	RatingLastPromptTime = '[LocalStorageKey] RatingLastPromptTime',
	RatingPromptCount = '[LocalStorageKey] RatingPromptCount',

	// Smart Performance Schedule Scan
	IsSPScheduleScanEnabled = '[LocalStorageKey] IsSPScheduleScanEnabled',
	IsSmartPerformanceFirstRun = '[LocalStorageKey] IsSmartPerformanceFirstRun',
	SPScheduleScanFrequency = '[LocalStorageKey] SPScheduleScanFrequency',
	isOldScheduleScanDeleted = '[LocalStorageKey] isOldScheduleScanDeleted',
	SPProcessStatus = '[LocalStorageKey] SPProcessStatus',
	IsFreePCScanRun = '[LocalStorageKey] IsFreePCScanRun',
	SmartPerformanceSubscriptionState = '[LocalStorageKey] SmartPerformanceSubscriptionState',

	IsSmartPerformanceForceClose = '[LocalStorageKey] IsSmartPerformanceForceClose',
	SmartPerformanceSubscriptionDetails = '[LocalStorageKey] SmartPerformanceSubscriptionDetails',
	SmartPerformanceLocalPrices = '[LocalStorageKey] SmartPerformanceLocalPrices',
	SmartPerformanceSubscriptionModalStatus = '[LocalStorageKey] SmartPerformanceSubscriptionModalStatus',
	HasSubscribedScanCompleted = '[LocalStorageKey] HasSubscribedScanCompleted',

	// Hide Camera Preview on some models
	IsCameraPreviewHidden = '[LocalStorageKey] IsCameraPreviewHidden',
	ShouldCameraSectionDisabled = '[LocalStorageKey] ShouldCameraSectionDisabled',

	// Moved here from DashboardLocalStorageKey enum, don't follow this definition
	DeviceInfo = '[DashboardLocalStorageKey] DeviceInfo',
	// OLED power control
	OledPowerSettings = '[LocalStorageKey] OledPowerSettings',
	// Battery Health
	BatteryHealth = '[LocalStorageKey] BatteryHealth',

	ExternalMetricsSettings = '[LocalStorageKey] ExternalMetricsSettings',
	DeviceCondition = '[LocalStorageKey] DeviceCondition',

	// Local storage key for gaming
	// All capabilities
	desktopType = '[LocalStorageKey] DesktopType',
	liteGaming = '[LocalStorageKey] LiteGaming',
	cpuInfoFeature = '[LocalStorageKey] CpuInfoFeature',
	gpuInfoFeature = '[LocalStorageKey] GpuInfoFeature',
	memoryInfoFeature = '[LocalStorageKey] MemoryInfoFeature',
	hddInfoFeature = '[LocalStorage] HddInfoFeature',
	macroKeyFeature = '[LocalStorageKey] MacroKeyFeature',
	smartFanFeature = '[LocalStorageKey] SmartFanFeature',
	thermalModeVersion = '[LocalStorageKey] ThermalModeVersion',
	supporttedThermalMode = '[LocalStorageKey] SupporttedThermalMode',
	cpuOCFeature = '[LocalStorageKey] CpuOCFeature',
	gpuOCFeature = '[LocalStorageKey] GpuOCFeature',
	gpuCoreOCFeature = '[LocalStorageKey] GpuCoreOCFeature', // Version 3.6
	gpuVramOCFeature = '[LocalStorageKey] GpuVramOCFeature', // Version 3.6
	advanceCPUOCFeature = '[LocalStorageKey] AdvanceCPUOCFeature',
	advanceGPUOCFeature = '[LocalStorageKey] AdvanceGPUOCFeature',
	xtuService = '[LocalStorageKey] XtuService',
	nvDriver = '[LocalStorageKey] NvDriver',
	memOCFeature = '[LocalStorageKey] MemOCFeature',
	networkBoostFeature = '[LocalStorageKey] NetworkBoostFeature',
	fbNetFilter = '[LocalStorageKey] FbNetFilter',
	optimizationFeature = '[LocalStorageKey] OptimizationFeature',
	hybridModeFeature = '[LocalStorageKey] HybridModeFeature',
	overDriveFeature = '[LocalStorageKey] OverDriveFeature',
	winKeyLockFeature = '[LocalStorageKey] WinKeyLockFeature',
	touchpadLockFeature = '[LocalStorageKey] TouchpadLockFeature',
	ledSetFeature = '[LocalStorageKey] LedSetFeature',
	ledLayoutVersion = '[LocalStorageKey] ledLayoutVersion',
	LedSwitchButtonFeature = '[LocalStorageKey] LedSwitchButtonFeature',
	ledDriver = '[LocalStorageKey] LedDriver',

	// Hardware info
	cpuModuleName = '[LocalStorageKey] cpuModuleName',
	cpuBaseFrequency = '[LocalStorageKey] cpuBaseFrequency',
	cpuCurrentFrequency = '[LocalStorageKey] cpuCurrentFrequency',
	cpuUsage = '[LocalStorageKey] cpuUsage',
	cpuInfoVersion = '[LocalStorageKey] cpuInfoVersion', // Version 3.6
	gpuModuleName = '[LocalStorageKey] gpuModuleName ',
	gpuMemorySize = '[LocalStorageKey] gpuMemorySize',
	gpuUsedMemory = '[LocalStorageKey] gpuUsedMemory',
	gpuUsage = '[LocalStorageKey] gpuUsage',
	gpuInfoVersion = '[LocalStorageKey] gpuInfoVersion', // Version 3.6
	ramModuleName = '[LocalStorageKey] ramModuleName',
	ramSize = '[LocalStorageKey] ramMemorySize',
	ramUsed = '[LocalStorageKey] ramUsed',
	ramUsage = '[LocalStorageKey] ramUsage',
	disksList = '[LocalStorageKey] disksList',
	diskInfoVersion = '[LocalStorageKey] diskInfoVersion', // Version 3.6
	cpuUtilization = '[LocalStorageKey] cpuUtilization', // Version 3.6

	// Macrokey
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

	// Third party app
	accessoryFeature = '[LocalStorageKey] AccessoryFeature', // Version 3.2
	nahimicFeature = '[LocalStorageKey] Nahicim',
	xRiteFeature = '[LocalStorageKey] XRite', // Version 3.5

	// Thermal mode
	CurrentThermalModeStatus = '[LocalStorageKey] CurrentThermalModeStatus',
	PrevThermalModeStatus = '[LocalStorageKey] PrevThermalModeStatus',
	RealThermalModeStatus = '[LocalStorageKey] RealThermalModeStatus', // Version 3.2 thermal mode 2
	autoAdjustSettings = '[LocalStorageKey] AutoAdjustSettings', // Version 3.5 auto adjust in thermal mode 3

	// Over clock
	CpuOCStatus = '[LocalStorageKey] CpuOCStatus',
	GpuOCStatus = '[LocalStorageKey] GpuOCStatus',
	autoSwitchStatus = '[LocalStorageKey] AutoSwitchStatus',
	AdvancedOCInfo = '[LocalStorageKey] AdvancedOCInfo', // Version 3.2 advanced OC
	memOCFeatureStatus = '[LocalStorageKey] MemOCFeatureStatus',

	// Network boost
	NetworkBoostStatus = '[LocalStorageKey] NetworkBoostStatus',
	NetworkBoostList = '[LocalStorageKey] NetworkBoostList',
	NetworkBoosNeedToAskPopup = '[LocalStorageKey] NetworkBoosNeedToAskPopup',

	// Auto close
	AutoCloseStatus = '[LocalStorageKey] AutoCloseStatus',
	AutoCloseList = '[LocalStorageKey] AutoCloseList',
	NeedToAsk = '[LocalStorageKey] NeedToAsk',

	// Hybrid mode
	hybridModeFeatureStatus = '[LocalStorageKey] HybridModeFeatureStatus',

	// Version 3.3 Over drive
	overDriveStatus = '[LocalStorageKey] OverDriveStatus',

	// Touchpad lock
	TouchpadLockStatus = '[LocalStorageKey] TouchpadLockStatus',

	// Quick Settings
	RapidChargeCache = '[LocalStorageKey] RapidChargeCache',
	WifiSecurityCache = '[LocalStorageKey] WifiSecurityCache',

	// Lighting
	LightingProfileById = '[LocalStorageKey] LightingProfileById',
	LightingProfileBrightness = '[LocalStorageKey] LightingProfileBrightness',
	LightingProfileEffectColor = '[LocalStorageKey] LightingProfileEffectColor',
	LightingProfileEffectColorTop = '[LocalStorageKey] LightingProfileEffectColorTop',
	LightingProfileEffectColorSide = '[LocalStorageKey] LightingProfileEffectColorSide',

	ProfileBrightness = '[LocalStorageKey] ProfileBrightness',
	LightingCapabilities = '[LocalStorageKey] LightingCapabilities',
	ProfileId = '[LocalStorageKey] ProfileId',
	LightingRGBTop = '[LocalStorageKey] LightingRGBTop',
	LightingRGBSide = '[LocalStorageKey] LightingRGBSide',
	LightingSetDefaultProfile = '[LocalStorageKey] LightingSetDefaultProfile',

	// DTX50 lighting page
	LightingCapabilitiesNewversionDesk = '[LocalStorageKey] LightingCapabilitiesNewversionDesk',

	LightingProfileByIdDesk1 = '[LocalStorageKey] LightingProfileByIdDesk1',
	LightingProfileByIdDesk2 = '[LocalStorageKey] LightingProfileByIdDesk2',
	LightingProfileByIdDesk3 = '[LocalStorageKey] LightingProfileByIdDesk3',

	LightingProfileDeskDefault1 = '[LocalStorageKey] LightingProfileDeskDefault1',
	LightingProfileDeskDefault2 = '[LocalStorageKey] LightingProfileDeskDefault2',
	LightingProfileDeskDefault3 = '[LocalStorageKey] LightingProfileDeskDefault3',

	// LNBX50 lighting page
	KeyboardToggleStatusLNBx50 = '[LocalStorageKey] KeyboardToggleStatusLNBx50',
	LightingCapabilitiesNewversionNote = '[LocalStorageKey] LightingCapabilitiesNewversionNote',
	LightingProfileByIdNewversionNote = '[LocalStorageKey] LightingProfileByIdNewversionNote',

	LightingProfileByIdNoteOff1 = '[LocalStorageKey] LightingProfileByIdNoteOff1',
	LightingProfileByIdNoteOn1 = '[LocalStorageKey] LightingProfileByIdNoteOn1',
	LightingProfileByIdNoteOff2 = '[LocalStorageKey] LightingProfileByIdNoteOff2',
	LightingProfileByIdNoteOn2 = '[LocalStorageKey] LightingProfileByIdNoteOn2',
	LightingProfileByIdNoteOff3 = '[LocalStorageKey] LightingProfileByIdNoteOff3',
	LightingProfileByIdNoteOn3 = '[LocalStorageKey] LightingProfileByIdNoteOn3',

	LightingProfileByIdDefault1 = '[LocalStorageKey] LightingProfileByIdDefault1',
	LightingProfileByIdDefault2 = '[LocalStorageKey] LightingProfileByIdDefault2',
	LightingProfileByIdDefault3 = '[LocalStorageKey] LightingProfileByIdDefault3',

	//SMB
	AiMeetingManagerInstalled = '[LocalStorageKey] AiMeetingManagerInstalled',
	SmartAppearanceInstalled = '[LocalStorageKey] SmartAppearanceInstalled',

	// Performance Boost
	PerformanceBoostAvailable = '[LocalStorageKey] PerformanceBoostAvailable',
	PerformanceBoostToggle = '[LocalStorageKey] PerformanceBoostToggle',
	PerformanceBoostList = '[LocalStorageKey] PerformanceBoostList',

	// Lenovo Service Bridge
	LenovoServiceBridgeStatus = '[LocalStorageKey] LenovoServiceBridgeStatus',
}
