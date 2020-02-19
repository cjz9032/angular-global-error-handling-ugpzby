import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import SmartStandbyActivityModel from 'src/app/data-models/smart-standby-graph/smart-standby-activity.model';
import { PowerService } from 'src/app/services/power/power.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ActivitiesData } from './activities-data.mock';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-modal-smart-stand-by',
	templateUrl: './modal-smart-stand-by.component.html',
	styleUrls: ['./modal-smart-stand-by.component.scss']
})
export class ModalSmartStandByComponent implements OnInit, AfterViewInit {
	@ViewChild('chartContainer1', { static: false }) private chartContainer1: ElementRef;
	@ViewChild('chartContainer2', { static: false }) private chartContainer2: ElementRef;

	public activities: SmartStandbyActivityModel[];
	public device = 'device.deviceSettings.power.smartStandby.';
	public items: any = [
		{ tittle: this.device + 'graph.graph1Tittle', subTittle: '', legends: `<div></div>` },
		{ tittle: this.device + 'graph.graph2Tittle', subTittle: this.device + 'graph.graphSubtittle', legends: '' }
	];

	public colors = {
		first: ['#FFFFFF', '#C5CAE9', '#7986CB', '#303F9F', '#1A237E'],
		second: ['#FFFFFF', '#EAB029', '#EAB029', '#EAB029', '#EAB029']
	};
	public weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
	public days = [];
	public isSufficient = true;
	public isAutomatic: boolean;

	constructor(
		private powerService: PowerService,
		public activeModal: NgbActiveModal,
		private translate: TranslateService,
		private loggerService: LoggerService
	) { }

	ngOnInit() {
		this.activities = ActivitiesData;
		this.getDays();
	}

	ngAfterViewInit() {
		this.getActivitiesData();
		this.getSmartStandbyActiveHours();
	}

	public getDays() {
		this.days = [];
		let day: any;
		const week: any = [];
		this.weekDays.forEach(d => {
			day = this.device + 'days.shortName.' + d;
			week.push(day);
		});
		this.days = week;
	}

	private renderActivityChart(chartContainer: ElementRef, data: SmartStandbyActivityModel[], colors: string[]) {
        const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
        const margin: any = { top: 40, bottom: 30, left: 30, right: 30 };
        const boxWidth = 20;
        const boxHeight = 14;
        const cellWidth = boxWidth / 4;
        const cellBorder = 'stroke: #E0E0E0; stroke-width: 1; fill-opacity: 0;';
        const fontStroke = 'fill: #34495e;';

        const element = chartContainer.nativeElement;

        const svg = d3.select(element).append('svg')
			.attr('preserveAspectRatio', 'xMinYMin meet')
			.attr('viewBox', '0 0 570 140');

        // chart plot area
        const chart = svg.append('g')
			.attr('transform', `translate(45 20)`);
        chart.selectAll('g')
			.data(hours)
			.enter()
			.append('text')
			.text(d => d)
			.attr('x', (d) => (boxWidth * (d + 1) + 7))
			.attr('y', 0)
			.attr('text-anchor', 'center')
			.attr('style', fontStroke);

        // y-axis labels
        chart.selectAll('g')
			.data(this.days)
			.enter()
			.append('text')
			.text(d => this.translate.instant(d).toUpperCase())
			.attr('x', margin.left - 10)
			.attr('y', (d, i) => boxHeight * (i + 1) + 6)
			.attr('text-anchor', 'end')
			.attr('style', fontStroke);

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
			.attr('fill', (d, i) => colors[d])
			.attr('x', (d, i) => (i * cellWidth));

        // add rect with border, repeat once
        cells
			.selectAll('g')
			.data([1])
			.join('rect')
			.attr('class', 'cell-rect')
			.attr('width', boxWidth + 2)
			.attr('height', boxHeight)
			.attr('style', cellBorder)
			.attr('x', (d, i) => (i * cellWidth));
    }

	private getActivitiesData() {
		// this.renderActivityChart(this.chartContainer1, this.activities, this.colors.first);
		// return;
		this.powerService.getSmartStandbyPresenceData().then((data: SmartStandbyActivityModel[]) => {
			if (data && data.length > 0) {
				this.renderActivityChart(this.chartContainer1, data, this.colors.first);
			} else {
				this.renderActivityChart(this.chartContainer1, this.activities, this.colors.first);
			}
		}).catch(error => {
			this.loggerService.exception('ModalSmartStandByComponent.getSmartStandbyPresenceData error', error);
		});
	}

	public getSmartStandbyActiveHours() {
		// this.renderActivityChart(this.chartContainer2, this.activities, this.colors.second);
		// return;
		this.powerService.GetSmartStandbyActiveHours().then((data: SmartStandbyActivityModel[]) => {
			if (data && data.length > 0) {
				this.renderActivityChart(this.chartContainer2, data, this.colors.second);
				this.getIsPresenceDataSufficientStatus();
			} else {
				this.renderActivityChart(this.chartContainer2, this.activities, this.colors.second);
			}
		}).catch(error => {
			this.loggerService.exception('ModalSmartStandByComponent.getSmartStandbyActiveHours error', error);
		});
	}

	public getIsPresenceDataSufficientStatus() {
		this.powerService.getIsPresenceDataSufficient().then(value => {
			this.isSufficient = value;
		});
	}

	closeModal() {
		this.activeModal.close('close');
	}
}
