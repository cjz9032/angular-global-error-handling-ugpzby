import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-progress-bar',
	styles: [`
		.progress-outer {
			width: 96%;
			padding: 7px 11px;
			border: 1px solid #ECF0F1;
			border-radius: 15px;
			background-color: #F5F7F8;
			color: #fff;
			text-align: center;
		}

		.progress-inner {
			height: 8px;
			min-width: 1%;
			white-space: nowrap;
			overflow: hidden;
			padding: 0;
			border-radius: 4px;
			background: linear-gradient(90deg, #5BE8AA 0%, #4DE099 32.7%, #3BD481 69.11%, #2ECC71 100%);
		}
	`],
	template: `
		<div class=\"progress-outer\">
			<div class=\"progress-inner\" [style.width]=\"whichProgress(progress) + '%'\"
				 [style.background-color]=\"degraded == null ? color : whichColor(progress)\">
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
	@Input() progress = 0;
	@Input() color = '#488aff';
	@Input() degraded: any;

	whichColor(percent: string) {
		let k: Array<any> = Object.keys(this.degraded);
		k.forEach((e, i) => k[i] = +e);
		k = k.sort((a, b) => a - b);
		const p = +percent;
		let last = k[0];
		for (const val of k) {
			if (val < p) {
				last = val;
			} else if (val >= p - 1) {
				return this.degraded[last];
			}
		}
		return this.degraded[last];
	}

	whichProgress(progress: number) {
		try {
			return Math.round(+progress * 100) / 100;
		} catch {
			return progress;
		}
	}

}
