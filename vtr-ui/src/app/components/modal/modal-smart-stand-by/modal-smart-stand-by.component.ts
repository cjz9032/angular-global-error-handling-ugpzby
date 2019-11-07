import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import * as d3 from 'd3';
import SmartStandbyActivityModel from 'src/app/data-models/smart-standby-graph/smart-standby-activity.model';
import { PowerService } from 'src/app/services/power/power.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'vtr-modal-smart-stand-by',
  templateUrl: './modal-smart-stand-by.component.html',
  styleUrls: ['./modal-smart-stand-by.component.scss']
})
export class ModalSmartStandByComponent implements OnInit {

  @ViewChild('activityChart', { static: false })
  @ViewChild('scheduleChart', { static: false })
  private chartContainer: ElementRef;
  public activities: SmartStandbyActivityModel[] = [];
  public scheduleList: SmartStandbyActivityModel[] = [];

  private colors = ['#FFFFFF', '#70B5F1', '#3489DF', '#2B77CC', '#14499C'];
  private days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  private legends = [0, 1, 2, 3, 4];
  constructor(private http: HttpClient, private powerService: PowerService, public activeModal: NgbActiveModal) {

  }

  ngOnInit() {
	this.getActiviesData();
	this.getSmartStandbyActiveHours();
	// this.getActivities().subscribe(
	// 	(data: SmartStandbyActivityModel[]) => {
	// 	this.activities = data;
	// 	// this.scheduleList = data;
	// 	// console.log(data);
	// 	this.renderChart(data);
	// 	this.renderToChart(data);
	// 	}
	// );
  }
  public getActivities(): Observable<SmartStandbyActivityModel[]> {
	return this.http.get<SmartStandbyActivityModel[]>('/assets/activities.json');
  }

  public renderChart(data: SmartStandbyActivityModel[]) {
	const element = this.chartContainer.nativeElement;
	const margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
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
	// svg.append('text')
	// .attr('x', 200)
	// .attr('y', 0)
	// .attr('text-anchor', 'middle')
	// .text('Sample Charts');
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
		.attr('font-size', 16)
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
		.attr('font-size', 16)
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
		.attr('fill', (d, i) => this.colors[d])
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

public renderToChart(data: SmartStandbyActivityModel[]) {
	  const element = this.chartContainer.nativeElement;
	  const margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
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
		 svg.append('text')
		  .attr('x', 200)
		  .attr('y', 100)
		  .attr('text-anchor', 'middle')
		  .text('Sample Charts');
	// x-axis labels
	  chart.selectAll('g')
		  .data(hours)
		  .enter()
		  .append('text')
		  .text(d => d)
		  .attr('x', (d) => (boxWidth * (d + 1)) + 9)
		  .attr('y', 0)
		  .attr('text-anchor', 'end')
		  .attr('font-size', 16)
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
		  .attr('font-size', 16)
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
		  .attr('fill', (d, i) => this.colors[d])
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
	console.log('=================== RES ===================');
	this.powerService.getSmartStandbyPresenceData().then(data => {
		// console.log('a', data);
	this.activities = data;
	console.log(data);
	this.renderChart(data);
	});
	console.log('=================== RES END ===================');
  }

  public getSmartStandbyActiveHours() {
	console.log('=================== Second  RES ===================');
	this.powerService.GetSmartStandbyActiveHours().then(data => {
		this.activities = data;
		console.log(data);
		this.renderToChart(data);
	});
	console.log('===================  second RES END ===================');
  }
  closeModal() {
		this.activeModal.close('close');
	}
}
