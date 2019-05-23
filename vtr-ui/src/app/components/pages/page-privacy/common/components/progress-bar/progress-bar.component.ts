import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'vtr-progress-bar',
	styles: [`
		.progress-outer {
			width: 96%;
			margin: 10px 2%;
			padding: 3px;
			background-color: #f4f4f4;
			border: 1px solid #dcdcdc;
			color: #fff;
			border-radius: 20px;
			text-align: center;
		}

		.progress-inner {
			min-width: 1%;
			white-space: nowrap;
			overflow: hidden;
			padding: 0;
			border-radius: 20px;
		}
	`],
	template: `
		<div class=\"progress-outer\">
			<div class=\"progress-inner\" [style.width]=\"whichProgress(progress) + '%'\"
				 [style.background-color]=\"degraded == null ? color : whichColor(progress)\">
				{{whichProgress(progress)}}%
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
