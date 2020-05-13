import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'vtr-modal-smart-performance-feedback',
  templateUrl: './modal-smart-performance-feedback.component.html',
  styleUrls: ['./modal-smart-performance-feedback.component.scss']
})
export class ModalSmartPerformanceFeedbackComponent implements OnInit {
	selected: number;
	radioSelected: any;

	questions = [
		{
			likelyValues: [1, 2, 3, 4, 5],
			name: 'remommendVantageToFriend',
			question: 'smartPerformance.feedbackContainer.questions.q1',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r1',
				'smartPerformance.feedbackContainer.rating.r2',
			]
		},
		{
			likelyValues: [6, 7, 8, 9, 10],
			name: 'remommendVantageToFriend',
			question: 'smartPerformance.feedbackContainer.questions.q2',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r3',
				'smartPerformance.feedbackContainer.rating.r4',
			]
		},
		{
			likelyValues: [11, 12, 13, 14, 15],
			name: 'remommendVantageToFriend',
			question: 'smartPerformance.feedbackContainer.questions.q3',
			ratingValue: [
				'smartPerformance.feedbackContainer.rating.r5',
				'smartPerformance.feedbackContainer.rating.r6',
			]
		}
	];
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

closeModal() {
		this.activeModal.close('close');
	}

	isSelected(value: number, secondValue: number, thirdValue: number) {
		this.selected = value;
		this.radioSelected = this.questions[thirdValue].question[secondValue];
		}
}
