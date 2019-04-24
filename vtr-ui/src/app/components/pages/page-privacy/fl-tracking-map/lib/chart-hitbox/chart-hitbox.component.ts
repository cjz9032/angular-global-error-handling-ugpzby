import {
	Component,
	OnInit,
	Input,
	EventEmitter,
	ViewChild,
	ElementRef,
	NgZone,
	Output,
	ChangeDetectionStrategy,
} from '@angular/core';
import { ChartPieLine } from '../../tracking-map-base/ChartCore/ChartPieLine';

@Component({
	selector: '[fl-chart-hitbox]',
	templateUrl: './chart-hitbox.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['./chart-hitbox.component.scss']
})
export class ChartHitboxComponent implements OnInit {
	@ViewChild('svgHitbox') hitbox: ElementRef<SVGPathElement>;

	@Input() p: ChartPieLine;

	@Input() enabled = true;

	@Output() selectTracker = new EventEmitter<ChartPieLine>();
	@Output() selectAll = new EventEmitter<null>();
	@Output() showDetails = new EventEmitter<ChartPieLine>();

	constructor(
		private zone: NgZone
	) {
	}

	ngOnInit() {
		this.zone.runOutsideAngular(() => {
			this.hitbox.nativeElement.onmouseenter = this.onHover.bind(this);
			this.hitbox.nativeElement.onmouseleave = this.onLeave.bind(this);
		});
	}

	get style() {
		const cursor = (this.enabled) ? 'pointer' : 'default';
		const style = {cursor};

		return style;
	}

	onHover() {
		if (!this.enabled) {
			return;
		}
		this.selectTracker.emit(this.p);
	}

	onLeave() {
		if (!this.enabled) {
			return;
		}
		this.selectAll.emit();
	}

	onClick() {
		if (!this.enabled) {
			return;
		}
		this.showDetails.emit(this.p);
	}
}
