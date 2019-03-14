import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class MetricService {

	constructor() {
		this.registerAllEvents();
	}

	registerAllEvents() {

		/*const DOMEvents = {
			UIEvent: 'abort DOMActivate error load resize scroll select unload',
			ProgressEvent: 'abort error load loadend loadstart progress progress timeout',
			Event: 'abort afterprint beforeprint cached canplay canplaythrough change chargingchange chargingtimechange checking close dischargingtimechange DOMContentLoaded downloading durationchange emptied ended ended error error error error fullscreenchange fullscreenerror input invalid languagechange levelchange loadeddata loadedmetadata noupdate obsolete offline online open open orientationchange pause pointerlockchange pointerlockerror play playing ratechange readystatechange reset seeked seeking stalled submit success suspend timeupdate updateready visibilitychange volumechange waiting',
			AnimationEvent: 'animationend animationiteration animationstart',
			AudioProcessingEvent: 'audioprocess',
			BeforeUnloadEvent: 'beforeunload',
			TimeEvent: 'beginEvent endEvent repeatEvent',
			OtherEvent: 'blocked complete upgradeneeded versionchange',
			FocusEvent: 'blur DOMFocusIn  Unimplemented DOMFocusOut  Unimplemented focus focusin focusout',
			MouseEvent: 'click contextmenu dblclick mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup show',
			SensorEvent: 'compassneedscalibration Unimplemented userproximity',
			OfflineAudioCompletionEvent: 'complete',
			CompositionEvent: 'compositionend compositionstart compositionupdate',
			ClipboardEvent: 'copy cut paste',
			DeviceLightEvent: 'devicelight',
			DeviceMotionEvent: 'devicemotion',
			DeviceOrientationEvent: 'deviceorientation',
			DeviceProximityEvent: 'deviceproximity',
			MutationNameEvent: 'DOMAttributeNameChanged DOMElementNameChanged',
			MutationEvent: 'DOMAttrModified DOMCharacterDataModified DOMNodeInserted DOMNodeInsertedIntoDocument DOMNodeRemoved DOMNodeRemovedFromDocument DOMSubtreeModified',
			DragEvent: 'drag dragend dragenter dragleave dragover dragstart drop',
			GamepadEvent: 'gamepadconnected gamepaddisconnected',
			HashChangeEvent: 'hashchange',
			KeyboardEvent: 'keydown keypress keyup',
			MessageEvent: 'message message message message',
			PageTransitionEvent: 'pagehide pageshow',
			PopStateEvent: 'popstate',
			StorageEvent: 'storage',
			SVGEvent: 'SVGAbort SVGError SVGLoad SVGResize SVGScroll SVGUnload',
			SVGZoomEvent: 'SVGZoom',
			TouchEvent: 'touchcancel touchend touchenter touchleave touchmove touchstart',
			TransitionEvent: 'transitionend',
			WheelEvent: 'wheel'
		};*/

		const DOMEvents={
			MouseEvent: 'click dblclick'

		}

		const RecentlyLoggedDOMEventTypes = {};

		for ( const DOMEvent in DOMEvents) {

			const DOMEventTypes = DOMEvents[DOMEvent].split(' ');

			DOMEventTypes.filter(function(DOMEventType) {
				const DOMEventCategory = DOMEvent + ' ' + DOMEventType;
				document.addEventListener(DOMEventType, function(e) {
					var index=window.location.href.indexOf('#')+2;
					var path= window.location.href.substring(index).split('/').join('.');
					var logModel=new LogModel();
					logModel.ItemParent="page."+path;
					logModel.ItemType=DOMEventType;
					if(document.activeElement.tagName==='A'){
						logModel.ItemType="Anchor";
						logModel.ItemName=document.activeElement.getAttribute('href').split('/').slice(1).join(".");
					}else if(document.activeElement.tagName==='BUTTON'){
						logModel.ItemType="Button";
						logModel.ItemName=document.activeElement.innerHTML;
					}else if(document.activeElement.tagName==='INPUT') {

						if(document.activeElement.getAttribute('type')=='radio'){
							logModel.ItemType="Radio";
							logModel.ItemName=document.activeElement.getAttribute('value');
						}else if (document.activeElement.getAttribute('type')=='checkbox'){
							logModel.ItemType="Checkbox";
							logModel.ItemName=document.activeElement.nextSibling.innerHTML;
						}else{
							console.log('input tpye is not known')
						}

					}else{
						console.log(document.activeElement);
					}
					console.log(logModel);
					/*if (isActive) {
						console.info(DOMEventCategory,
							' target=', e.target,
							' active=', document.activeElement,
							' isActive=', true );
					} else {
						console.log(DOMEventCategory,
							' target=', e.target,
							' active=', document.activeElement,
							' isActive=', false );
					}*/

				}, true);
			});

		}
	}
}

export class LogModel{
	ItemName:string;
	ItemType:string;
	ItemParent:string;
	ItemParam:string;
	ItemValue:string;
}
