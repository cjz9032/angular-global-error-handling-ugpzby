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
			<div class=\"progress-inner\" [style.width]=\"whichProgress(progress) + '%'\">
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
	@Input() progress = 0;

	whichProgress(progress: number) {
		try {
			return Math.round(+progress * 100) / 100;
		} catch {
			return progress;
		}
	}

}
