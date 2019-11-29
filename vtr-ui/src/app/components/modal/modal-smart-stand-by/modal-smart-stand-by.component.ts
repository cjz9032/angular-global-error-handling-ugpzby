import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import * as d3 from 'd3';
import SmartStandbyActivityModel from 'src/app/data-models/smart-standby-graph/smart-standby-activity.model';
import { PowerService } from 'src/app/services/power/power.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EMPTY } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-modal-smart-stand-by',
	templateUrl: './modal-smart-stand-by.component.html',
	styleUrls: ['./modal-smart-stand-by.component.scss']
})
export class ModalSmartStandByComponent implements OnInit {
	@ViewChildren('chartContainer') chartContainer: QueryList<ElementRef>;
	public activities: SmartStandbyActivityModel[] = [];
	public scheduleList: SmartStandbyActivityModel[] = [];
	public items: any = [
		{ tittle: 'device.deviceSettings.power.smartStandby.graph.graph1Tittle', subTittle: '' },
		{ tittle: 'device.deviceSettings.power.smartStandby.graph.graph2Tittle', subTittle: 'device.deviceSettings.power.smartStandby.graph.graphSubtittle' }
	];

	private colors = {
		first: ['#FFFFFF', '#d1d0ff', '#918fff', '#413DFF', '#0602CA'],
		second: ['#FFFFFF', '#EAB029', '#EAB029', '#EAB029', '#EAB029']
	};
	private days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	private legends = [0, 1, 2, 3, 4];
	constructor(
		private http: HttpClient,
		private powerService: PowerService,
		public activeModal: NgbActiveModal,
	) {


	}

	ngOnInit() {
		this.getActiviesData();
		this.getSmartStandbyActiveHours();
	}
	public getActivities(): Observable<SmartStandbyActivityModel[]> {
		return this.http.get<SmartStandbyActivityModel[]>('/assets/activities.json');
	}

	public renderToFirstChart(data: SmartStandbyActivityModel[]) {
		const element = this.chartContainer.first.nativeElement;
		const margin: any = { top: 40, bottom: 30, left: 30, right: 30 };
		const width = element.offsetWidth - (margin.left - margin.right);
		const height = element.offsetHeight - (margin.top - margin.bottom);
		const boxWidth = Math.floor(35);
		const boxHeight = 25;
		const cellWidth = boxWidth / 4;
		const hours = data[0].activities.map((d) => d.hour);

		const svg = d3.select(element).append('svg')
			.attr('preserveAspectRatio', 'xMinYMin meet')
			.attr('viewBox', '0 0 960 250');

		// chart plot area
		const chart = svg.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);	
		chart.selectAll('g')
			.data(hours)
			.enter()
			.append('text')
			.text(d => d)
			.attr('x', (d) => (boxWidth * (d + 1)) + 9)
			.attr('y', 0)
			.attr('text-anchor', 'end')
			.attr('font-size', 13)
			.attr('font-weight', 550);

		// y-axis labels
		chart.selectAll('g')
			.data(this.days)
			.enter()
			.append('text')
			.text(d => d)
			.attr('x', margin.left - 10)
			.attr('y', (d, i) => boxHeight * (i + 1))
			.attr('text-anchor', 'end')
			.attr('font-size', 13)
			.attr('font-weight', 550);

		const table = chart.selectAll('g')
			.append('g')
			.data(data)
			.join('g')
			.attr('transform', (d, i) => `translate(${margin.left}, ${((i) * boxHeight) + 10})`);

		const cells = table
			.selectAll('g')
			.data(d => d.activities)
			.join('g')
			.attr('width', boxWidth - margin.left)
			.attr('height', boxHeight)
			.attr('class', 'cell-container')
			.attr('transform', (d, i) => `translate(${(i * boxWidth)}, 0)`);

		// draw activity cell for each hour, each hour has 4 cells
		cells
			.selectAll('g')
			.data(d => d.usage)
			.join('rect')
			.attr('class', 'cell-activity')
			.attr('width', Math.floor(boxWidth / 4) + 2)
			.attr('height', boxHeight)
			.attr('fill', (d, i) => this.colors.first[d])
			.attr('x', (d, i) => (i * cellWidth));

		// add rect with border, repeat once
		cells
			.selectAll('g')
			.data([1])
			.join('rect')
			.attr('class', 'cell-rect')
			.attr('width', boxWidth)
			.attr('height', boxHeight)
			.attr('style', 'stroke: #000; stroke-width: 1; fill-opacity: 0;')
			.attr('x', (d, i) => (i * cellWidth));
	}

	public renderToSecondChart(data: SmartStandbyActivityModel[]) {
		const element = this.chartContainer.last.nativeElement;
		const margin: any = { top: 30, bottom: 30, left: 30, right: 30 };
		const width = element.offsetWidth - (margin.left - margin.right);
		const height = element.offsetHeight - (margin.top - margin.bottom);
		const boxWidth = Math.floor(35);
		const boxHeight = 25;
		const cellWidth = boxWidth / 4;
		const hours = data[0].activities.map((d) => d.hour);

		const svg = d3.select(element).append('svg')
			// .attr('width', '100%')
			// .attr('height', element.offsetHeight)
			.attr('preserveAspectRatio', 'xMinYMin meet')
			.attr('viewBox', '0 0 960 250');

		// chart plot area
		const chart = svg.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);	
		// x-axis labels
		chart.selectAll('g')
			.data(hours)
			.enter()
			.append('text')
			.text(d => d)
			.attr('x', (d) => (boxWidth * (d + 1)) + 9)
			.attr('y', 0)
			.attr('text-anchor', 'end')
			.attr('font-size', 13)
			.attr('font-weight', 550);

		// y-axis labels
		chart.selectAll('g')
			.data(this.days)
			.enter()
			.append('text')
			.text(d => d)
			.attr('x', margin.left - 10)
			.attr('y', (d, i) => boxHeight * (i + 1))
			.attr('text-anchor', 'end')
			.attr('font-size', 13)
			.attr('font-weight', 550);

		const table = chart.selectAll('g')
			.append('g')
			.data(data)
			.join('g')
			.attr('transform', (d, i) => `translate(${margin.left}, ${((i) * boxHeight) + 10})`);

		const cells = table
			.selectAll('g')
			.data(d => d.activities)
			.join('g')
			.attr('width', boxWidth - margin.left)
			.attr('height', boxHeight)
			.attr('class', 'cell-container')
			.attr('transform', (d, i) => `translate(${(i * boxWidth)}, 0)`);

		// draw activity cell for each hour, each hour has 4 cells
		cells
			.selectAll('g')
			.data(d => d.usage)
			.join('rect')
			.attr('class', 'cell-activity')
			.attr('width', Math.floor(boxWidth / 2))
			.attr('height', boxHeight)
			.attr('fill', (d, i) => this.colors.second[d])
			.attr('x', (d, i) => (i * cellWidth));

		// add rect with border, repeat once
		cells
			.selectAll('g')
			.data([1])
			.join('rect')
			.attr('class', 'cell-rect')
			.attr('width', boxWidth)
			.attr('height', boxHeight)
			.attr('style', 'stroke: #000; stroke-width: 1; fill-opacity: 0;')
			.attr('x', (d, i) => (i * cellWidth));

	}

	public getActiviesData() {
		this.powerService.getSmartStandbyPresenceData().then(data => {
			// console.log('a', data);
			this.activities = data;
			console.log(data);
			this.renderToFirstChart(data);
		}).catch(error => {
			console.log('getSmartStandbyPresenceData error', error.message);
			return EMPTY;
		});
	}

	public getSmartStandbyActiveHours() {
		this.powerService.GetSmartStandbyActiveHours().then(data => {
			this.activities = data;
			console.log(data);
			this.renderToSecondChart(data);
		}).catch(error => {
			console.log('getSmartStandbyActiveHours error', error.message);
			return EMPTY;
		});
	}
	closeModal() {
		this.activeModal.close('close');
	}
}
