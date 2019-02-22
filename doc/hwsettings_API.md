#Hardware Settings UI APIs

This document descripts the APIs between UI and feature set of Hardware Settings.

We expose the APIs as "FeatureSet", these classes would hide the requests to hardware or plugins. For UI level, we can simply invoke functions, or get properties.

We use "data" as property prefix string because there are so many fields for Javascript, it is hard to remember or find the key information. "data" prefix can help us to use intellisense of IDE like VS Code.


##1.Audio
Audio related features need import “hws.audio-feature.js”.

For audio feature, we have two clesses which named "DolbyFeature" and "MicrophoneFeatre". You **MUST** create instance from them.

They can support most of audio APIs.

###Dolby

####Feature List:
- Turn on/off Dolby profile
- Change Dolby mode

####Command
*DolbyFeature*.getDolbySettings()

	Get all the Dolby related settigns. Please notice that here DolbyFeature is the instance object.

*DolbyFeature*.setDolbyProfile(value)

	True means turn on Dolby profile. Here value is bool type.

*DolbyFeature*.setDolbyMode(value)

	Pass the Dolby mode with const string. Here value is string type, you can use Dynamic/Movie/Music/Games/Voip


####Comment
Maxx audio and Dolby are different vendors, at most only one feature will supported for one systems. Currently, most of Lenovo systems support Dolby, please check API response.

"Dynamic" is one of Dolby mode, but not all the systems support it.


###Microphone
####Feature List:
- Microphone mute/unmute
- Change microphone volume
- Change microphone optimization
- Turn on/off “Suppress keyboard noise”
- Turn on/off “Acoustic Echo Cancellation”
- Turn on/off “Automatic Audio optimization”

####Command
*MicrophoneFeature*.getMicrophoneSettings()

	Get all the microphone settings. Please notice that here MicrophoneFeature is the instance object.

*MicrophoneFeature*.setMicrophoneMute(mute)

	If you want to mute microphone, you should pass true, else use false.

*MicrophoneFeature*.setMicrophoneVolume(volume)

	Pass the value user selected from the slider control. volume is the int number.

*MicrophoneFeature*.setMicrophoneOptimization(name)

	Pass the index of the microphone opitimaztion. name is the string,   VoiceRecognition/MultipleVoices/OnlyMyVoice/Normal

*MicrophoneFeature*.setMicrophoneAutoOptimization(value)

	True means this feature will be enabled. Here value is bool value.

*MicrophoneFeature*.setMicrophoneAEC(value)

	True means this feature will be enabled.. Here value is bool value.

*MicrophoneFeature*.setMicrophoneKeyboardNoiseSuppression(value)

	True means this feature will be enabled. Here value is bool value.

*MicrophoneFeature*.startMonitor(callback)

	You should call this function when user enter the audio page or dashboard page. Or restore the app at these pages. The background is user may use hotkey to change microphone settings outside the Vantage app, so we need to monitor these changes, and update our stauts as well.

	The argument "callback" is the fucntion we will invoke when change happens.

*MicrophoneFeature*.stopMonitor()

	You should call this funtion when user leave the audio page or dashboard page. Or minimum the app, then plugin will stop to monitor the microphone changes.


####Comment
Please notice that, not all the systems support “Suppress keyboard noise”, "Acoustic Echo Cancellation”, “Automatic Audio optimization” features, please check API response.

##2.Display
Display related features need import “hws.display-feature.js”.

###EyeCare Mode

####Feature List:
- Turn on/off eye care mode to 4500K
- Change value of eye care mode
- Turn on/off auto care mode

####Command
*EyeCareModeFeature*.getSettings()

	Get all the settings for Eye Care Mode. Please notice that here EyeCareModeFeature is the instance object.

*EyeCareModeFeature*.setQuickMode(value)

	True means the pluign will change to 4500K directly.

*EyeCareModeFeature*.setEyeCareValue(value)

	Plugin will change the color tempreture to this value.

*EyeCareModeFeature*.setAutoMode(value)

	Plugin will change the color tempreture based on user location.

*EyeCareModeFeature*.resetSettings()

	Reset all the settings to the default settings from hardware or plugin.

*EyeCareModeFeature*.startMonitor(callback)

	You should call this function when user enter the audio page or dashboard page. Or restore the app at these pages. The background is user may change color tempreture in Windows Settings, so we need to monitor and update our stauts as well.

	The argument "callback" is the fucntion we will invoke when change happens.

*EyeCareModeFeature*.stopMonitor()

	You should call this funtion when user leave the audio page or dashboard page. Or minimum the app, then plugin will stop to monitor the change.


####Comment
We support this feature from Win10 RS2.

##3.Camera
Camera related features need import “hws.camera-feature.js”.
###Camera Privew

*CameraFeature*.startCameraPrivew(id)

	Init and start camera privew for video UI control, need video control id
	code sample: 
	<video id="cameraPreview" class="cameraPreview"></video>
	CameraFeature.startCameraPrivew(cameraPreview)


*CameraFeature*.stopCameraPrivew(id)

	Stop and clean camera privew stream. 
###Camera Settings
*CameraFeature*.getCameraSettings()

	Get all camera settings state, include brigtness, contrast, exposure, focus
	mock data:
	{
		"brightness": {
		"supported": true, // true means brightness slider bar can be shown
		"min": -64, // slider bar min value
		"max": 64, // slider bar max value
		"step": 1, // step frequnce
		"default": 0, // 
		"value": 0 // current value
		},
		"contrast": {
		"supported": true,
		"min": 0,
		"max": 95,
		"step": 1,
		"default": 0,
		"value": 0
		},
		"exposure": {
		"autoModeSupported": true, // true means auto exposure mode toggle button can be shown 
		"autoValue": true, // true means auto exposure mode enabled
		"supported": true, // true means exposure slider bar can be shown
		"min": -10,
		"max": -2,
		"default": -5,
		"value": -5
		},
		"focus": {
		"autoModeSupported": false,
		"autoValue": false,
		"supported": false,
		"min": 0,
		"max": 0,
		"default": 0,
		"value": 0
		}
	}

###Camera Privacy
*CameraFeature*.getCameraPrivacyStatus()

	Get camera privacy mode status
	{
		available: true|false, // false mean camara not exist,
		status:true|false, //true means on otherwise off
	}

*CameraFeature*.setCameraPrivacyStatus(state)

	Set camera privacy mode status, true/false
####Feature List:
- Show camera privew
- Get/Set camera settings
- Turn on/off camera privacy

##4.Smart Settings
Smart Settings related features need import “hws.smartsettings-feature.js”.

###Application-based Settings

####Feature List:
- Turn on/off "Automatic Dolby Audio Settings" (key: Audio)
- Turn on/off "Smart Mute" function (key: SmartMute)
- Turn on/off "Full Screen" function (key: FullScreen)
- Turn on/off "Touch Screen" function (key: TouchScreen)

####Command
*ABSFeature*.getFeatureStatus()

	ABSFeature is the instance object, and the function is to list the supported ABS features and status. Please show the feature toggles depends on the response list, and please notice the item "Touch Screen" function will always be returned, but you can show it only if the "Full Screen" function are supported.

*ABSFeature*.setFeatureStatus(key, value)

	key is one of features you need to set in the Feature List upper, and the value is Open/Close.


####Comment
