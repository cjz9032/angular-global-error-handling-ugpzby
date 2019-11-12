
export class VantageFocusHelper {
	private shellFocus = false;
	private webUIFocus = false;
	private sessionAwake = null;
	constructor() {
	}

	start() {
		const win = window as any;
		// invoked by the external shell
		win.shellFocus = () => {
			this.shellFocus = true;
			this.onAppFocus();
		};

		win.addEventListener('focus', () => {
			this.webUIFocus = true;
			this.onAppFocus();
		});

		// invoked by the external shell
		win.shellBlur = () => {
			this.shellFocus = false;
			this.onAppBlur();
		};

		win.addEventListener('blur', () => {
			this.webUIFocus = false;
			this.onAppBlur();
		});

		document.addEventListener('visibilitychange', () => {
			if (document.hidden) {
				this.onInvisable();
			} else {
				this.onVisable();
			}
		});
	}

	private onAppFocus() {
		const getFocusEvent = document.createEvent('Event');
		getFocusEvent.initEvent('vantageGetFocus', true, true);
		document.dispatchEvent(getFocusEvent);

		this.onResumeSession();
	}

	private onAppBlur() {
		if (this.webUIFocus || this.shellFocus) {
			return true;
		}

		const blurEvent = document.createEvent('Event');
		blurEvent.initEvent('vantageLoseFocus', true, true);
		document.dispatchEvent(blurEvent);
		this.onLoseSession();
	}

	private onVisable(): void {
		this.onResumeSession();
	}

	private onInvisable(): void {
		this.onLoseSession();
	}

	private onLoseSession() {
		if (this.sessionAwake === false) {
			return;
		}

		this.sessionAwake = false;
		const vantageSessionLose = document.createEvent('Event');
		vantageSessionLose.initEvent('vantageSessionLose', true, true);
		document.dispatchEvent(vantageSessionLose);
	}

	private onResumeSession() {
		if (this.sessionAwake) {
			return;
		}

		this.sessionAwake = true;
		const vantageSessionLose = document.createEvent('Event');
		vantageSessionLose.initEvent('vantageSessionResume', true, true);
		document.dispatchEvent(vantageSessionLose);
	}

}

