#Hardware Settings UI APIs

This document descripts the APIs between UI and feature set of Hardware Settings.

##1.Audio
Audio related features need import “hwsettings_base.js” and “hwsettings_audio.js”.

We create an object named "hws.audio", which can support most of audio APIs, you can invoke its sub functions to get or set properties.

###Dolby

####Feature List:
- Turn on/off Dolby profile
- Change Dolby mode

####Command
hws.audio.dolby.getSettings()

	Get all the Dolby related settigns.

hws.audio.dolby.SetProfile(value)

	True means turn on Dolby profile.

hws.audio.dolby.SetMode(value)

	Pass the Dolby mode with const string


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
hws.audio.microphone.setMicrophoneMute(mute)

	If you want to mute microphone, you should pass true, else use false.

hws.audio.microphone.setMicrophoneVolume(volume)

	Pass the value user selected from the slider control.

hws.audio.microphone.setMicrophoneOptimization(index)

	Pass the index of the microphone opitimaztion

hws.audio.microphone.setMicrophoneAutoOptimization(value)

	True means this feature will be enabled.

hws.audio.microphone.setMicrophoneAEC(value)

	True means this feature will be enabled.

hws.audio.microphone.setMicrophoneSuppress(value)

	True means this feature will be enabled.


hws.audio.microphone.startMonitor(callback)

	You should call this function when user enter the audio page or dashboard page. Or restore the app at these pages. The background is user may use hotkey to change microphone settings outside the Vantage app, so we need to monitor these changes, and update our stauts as well.

	The argument "callback" is the fucntion we will invoke when change happens.

hws.audio.microphone.stopMonitor()

	You should call this funtion when user leave the audio page or dashboard page. Or minimum the app, then plugin will stop to monitor the microphone changes.


####Comment
Please notice that, not all the systems support “Suppress keyboard noise”, "Acoustic Echo Cancellation”, “Automatic Audio optimization” features, please check API response.

##2.Display
Audio related features need import “hwsettings_base.js” and “hwsettings_display.js”.
###EyeCare Mode

####Feature List:
- Turn on/off eye care mode to 4500K
- Change value of eye care mode
- Turn on/off auto care mode

####Command
hws.display.eyecaremode.setQuickMode(value)

	True means the pluign will change to 4500K directly.

hws.display.eyecaremode.setEyeCareValue(value)

	Plugin will change the color tempreture to this value.

hws.display.eyecaremode.setAutoMode(value)

	Plugin will change the color tempreture based on user location.

hws.display.eyecaremode.startMonitor()

	You should call this function when user enter the audio page or dashboard page. Or restore the app at these pages. The background is user may change color tempreture in Windows Settings, so we need to monitor and update our stauts as well.

	The argument "callback" is the fucntion we will invoke when change happens.

hws.display.eyecaremode.stopMonitor()

	You should call this funtion when user leave the audio page or dashboard page. Or minimum the app, then plugin will stop to monitor the change.


####Comment
We support this feature from Win10 RS2.

##3.Camera
###Camera Privacy

####Feature List:
- Turn on/off camera privacy
