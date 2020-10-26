import { OverlayContainer } from '@angular/cdk/overlay';

export class VantageOverlayContainer extends OverlayContainer {
	_createContainer(): void {
		const container = document.createElement('div');
		container.classList.add('cdk-overlay-container');
		document.querySelector('#main-wrapper').appendChild(container);
		this._containerElement = container;
	}
}
