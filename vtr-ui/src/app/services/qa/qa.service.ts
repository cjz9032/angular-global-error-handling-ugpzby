import { Injectable } from '@angular/core';
import { QA } from '../../data-models/qa/qa.model';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Injectable({
	providedIn: 'root'
})
export class QaService {
	title = `${this.translate.instant('faq.pageTitle')}`; //sahinul, 24June2019 VAN-5534
	imagePath = 'assets/images/qa';
	qas: QA[] = [
		{
			id: 1,
			category: 'q&a',
			path: '/device/support-detail/1',
			iconPath: `${this.imagePath}/svg_icon_qa_backup.svg`,
			title: `${this.translate.instant('faq.question1.title')}`,
			like: false,
			dislike: false,
			keys: [
				'faq.question1.title',
				'faq.question1.para1.line1',
				'faq.question1.para1.line2',
				'faq.question1.heading1',
				'faq.question1.para2.span1',
				'faq.question1.para2.span2',
				'faq.question1.para2.span3',
				'faq.question1.para2.span4',
				'faq.question1.para2.span5',
				'faq.question1.para2.span6',
				'faq.question1.para2.span7',
				'faq.question1.para2.span8',
				'faq.question1.para3.span1',
				'faq.question1.para3.span2',
				'faq.question1.para3.span3',
				'faq.question1.para3.span4',
				'faq.question1.heading2',
				'faq.question1.para4',
				'faq.question1.para5.span1',
				'faq.question1.para5.span2',
				'faq.question1.para5.span3',
				'faq.question1.para5.span4',
				'faq.question1.para5.span5',
				'faq.question1.para5.span6',
				'faq.question1.para5.span7',
				'faq.question1.para5.span8',
				'faq.question1.para5.span9',
				'faq.question1.para5.span10',
				'faq.question1.para5.span11',
				'faq.question1.para5.span12'
			],
			description: `faq.question1.description`,
			getDescription: function () {
				return `<div>
				<div style='font-size:4rem;font-weight:bold;'>
					${this.keys['faq.question1.title']}
				</div>
				<hr />
				<div style='margin-bottom:7rem;'>
					${this.keys['faq.question1.para1.line1']}
					${this.keys['faq.question1.para1.line2']}
				</div>
				<div style='font-size:3rem;font-weight:bold;'>
					${this.keys['faq.question1.heading1']}
				</div>
				<hr />
				<div class='mb-5'>
					${this.keys['faq.question1.para2.span1']} <span style='font-weight:bold'>
					${this.keys['faq.question1.para2.span2']}</span>
					${this.keys['faq.question1.para2.span3']}
					<span style='font-weight:bold'>${this.keys['faq.question1.para2.span4']}</span> &gt;
					<span style='font-weight:bold'>${this.keys['faq.question1.para2.span5']}</span> &gt;
					<span style='font-weight:bold'>${this.keys['faq.question1.para2.span6']}</span> &gt;
					<span style='font-weight:bold'>${this.keys['faq.question1.para2.span7']}</span>
					${this.keys['faq.question1.para2.span8']}
				</div>
				<div class='mb-5'>
					<img src='./../../../../assets/images/qa/1.1.png' />
				</div>
				<div class='mb-5'>
				${this.keys['faq.question1.para3.span1']} ${this.keys['faq.question1.para3.span2']}
				${this.keys['faq.question1.para3.span3']}
					<span style='font-weight:bold;'>${this.keys['faq.question1.para3.span4']}</span>
				</div>
				<div style='font-size:3rem;font-weight:bold;'>
					${this.keys['faq.question1.heading2']}
				</div>
				<div class='mb-5'>
					${this.keys['faq.question1.para4']}
				</div>
				<div>

				<div class='mb-3'>
						${this.keys['faq.question1.para5.span1']}
					<span style='font-weight:bold;'>${this.keys['faq.question1.para5.span2']}</span>
					${this.keys['faq.question1.para5.span3']}
					<span class='font-weight:bold'>${this.keys['faq.question1.para5.span4']}</span></div>
					<div class='mb-3'>${this.keys['faq.question1.para5.span5']}</div>
					<div class='mb-3'>${this.keys['faq.question1.para5.span6']}
						<span style='font-weight:bold'>${this.keys['faq.question1.para5.span7']}</span>
						${this.keys['faq.question1.para5.span8']}
						<span style='font-weight:bold'>${this.keys['faq.question1.para5.span9']}</span> ${this.keys[
					'faq.question1.para5.span10'
					]} <span style='font-weight:bold'>
						${this.keys['faq.question1.para5.span11']}</span>
						&nbsp;${this.keys['faq.question1.para5.span12']}</div>

				</div>
			</div>
			`;
			}
		},
		{
			id: 2,
			category: 'q&a',
			path: '/device/support-detail/2',
			iconPath: `${this.imagePath}/svg_icon_qa_refresh.svg`,
			title: `${this.translate.instant('faq.question2.title')}`,
			like: false,
			dislike: false,
			keys: [
				'faq.question2.title',
				'faq.question2.heading1',
				'faq.question2.para1.span1',
				'faq.question2.para1.span2',
				'faq.question2.para2',
				'faq.question2.para3.span1',
				'faq.question2.para3.span2',
				'faq.question2.para3.span3',
				'faq.question2.para3.span4',
				'faq.question2.heading2',
				'faq.question2.para4',
				'faq.question2.heading3',
				'faq.question2.para5',
				'faq.question2.heading4',
				'faq.question2.para6',
				'faq.question2.para7.span1.line1',
				'faq.question2.para7.span1.line2',
				'faq.question2.para7.span2.line1',
				'faq.question2.para7.span2.line2',
				'faq.question2.para7.span3.line1',
				'faq.question2.para7.span3.line2',
				'faq.question2.para7.span4.line1',
				'faq.question2.para7.span4.line2',
				'faq.question2.para7.span5.line1',
				'faq.question2.para7.span5.line2',
				'faq.question2.para7.span6.line1',
				'faq.question2.para7.span6.line2',
				'faq.question2.para7.span6.line3',
				'faq.question2.para7.span7',
				'faq.question2.para7.span8',
				'faq.question2.para8',
				'faq.question2.para9.span1.line1',
				'faq.question2.para9.span1.line2',
				'faq.question2.para9.span1.line3',
				'faq.question2.para9.span2.line1',
				'faq.question2.para9.span2.line2',
				'faq.question2.para9.span2.line3',
				'faq.question2.para9.span3.line1',
				'faq.question2.para9.span3.line2',
				'faq.question2.para9.span3.line3',
				'faq.question2.para9.span3.line4',
				'faq.question2.para9.span3.line5',
				'faq.question2.header5',
				'faq.question2.para10',
				'faq.question2.para11'
			],
			description: `faq.question2.description`,
			getDescription: function () {
				return `<div>
				<div style='font-size:4rem;font-weight:bold;'>
				${this.keys['faq.question2.title']}
				</div>
				<hr>
				<div style='font-size:2.5rem;font-weight:bold;padding:5px 0;'>
				${this.keys['faq.question2.heading1']}
				</div>
				<div style='padding:5px 0;'>
				${this.keys['faq.question2.para1.span1']} ${this.keys['faq.question2.para1.span2']}
				</div>
				<div style='padding:5px 0;'>
					${this.keys['faq.question2.para2']}
				</div>
				<div style='padding:5px 0;'>
					<ul>
						<li>${this.keys['faq.question2.para3.span1']}</li>
						<li>${this.keys['faq.question2.para3.span2']}</li>
						<li>${this.keys['faq.question2.para3.span3']}</li>
						<li>${this.keys['faq.question2.para3.span4']}</li>
					</ul>
				</div>

				<div style='font-size:2.5rem;font-weight:bold;padding:10px 0;'>
					${this.keys['faq.question2.heading2']}
				</div>

				<div>
					<ul>
						<li>${this.keys['faq.question2.para4']}</li>

					</ul>
				</div>

				<div style='font-size:2.5rem;font-weight:bold;padding:10px 0;'>
					${this.keys['faq.question2.heading3']}
				</div>

				<div>
					<ul>
						<li>${this.keys['faq.question2.para5']}</li>
					</ul>
				</div>

				<div style='font-size:2.5rem;font-weight:bold;padding:10px 0;'>
					${this.keys['faq.question2.heading4']}
				</div>

				<div>
					<ul class='list-unstyled'>
						<li>
							<span style='text-decoration: underline;padding:10px 0;font-weight: bold'>
								${this.keys['faq.question2.para6']}</span>
							<ol>
								<li style='padding:5px 0;'>
									${this.keys['faq.question2.para7.span1.line1']}
									<span style='font-weight:bold;'> ${this.keys['faq.question2.para7.span1.line2']} </span>
								</li>

								<li style='padding:5px 0;'>
									${this.keys['faq.question2.para7.span2.line1']}
									<span style='font-weight:bold;'>${this.keys['faq.question2.para7.span2.line2']}</span>
								</li>

								<li style='padding:5px 0;'>
									<div>${this.keys['faq.question2.para7.span3.line1']}
									<span style='font-weight:bold;'> ${this.keys['faq.question2.para7.span3.line2']}</span></div>
									<div style='padding:5px 0'>${this.keys['faq.question2.para7.span4.line1']}
										<span style='font-weight:bold;'>
											${this.keys['faq.question2.para7.span4.line2']}
										</span>
									</div>
									<div><img src='./../../../../assets/images/qa/2.1.png' /></div>

								</li>

								<li style='padding:5px 0;'>
									${this.keys['faq.question2.para7.span5.line1']}
									<span style='font-weight:bold;'> ${this.keys['faq.question2.para7.span5.line2']}</span>
								</li>

								<li style='padding:5px 0;'>
									${this.keys['faq.question2.para7.span6.line1']}
									<span style='font-weight:bold;'>
										${this.keys['faq.question2.para7.span6.line2']}
									</span>
									${this.keys['faq.question2.para7.span6.line3']}
								</li>
								<li style='padding:5px 0;'>
									${this.keys['faq.question2.para7.span7']}
								</li>

								<li style='padding:5px 0;'>
									${this.keys['faq.question2.para7.span8']}
								</li>
							</ol>
						</li>
						<li style='padding:10px 0;'>
							<span style='text-decoration: underline;font-weight: bold'>
								${this.keys['faq.question2.para8']}
							</span>
							<ol>
								<li style='padding:5px 0;'> ${this.keys['faq.question2.para9.span1.line1']}
									<span style='font-weight:bold;'> ${this.keys['faq.question2.para9.span1.line2']} </span>
									${this.keys['faq.question2.para9.span1.line3']}</li>
								<li style='padding:5px 0;'>
									<div>${this.keys['faq.question2.para9.span2.line1']}
									<span style='font-weight:bold;'>
										${this.keys['faq.question2.para9.span2.line2']}
									</span> ${this.keys['faq.question2.para9.span2.line3']}</div>
									<div><img src='./../../../../assets/images/qa/2.2.jpg' /></div>
								</li>
								<li style='padding:5px 0;'>
									<div>${this.keys['faq.question2.para9.span3.line1']}
										<span style='font-weight:bold;'>${this.keys['faq.question2.para9.span3.line2']}</span>
											${this.keys['faq.question2.para9.span3.line3']}
										<span style='font-weight:bold;'>
											${this.keys['faq.question2.para9.span3.line4']}
										</span>
										${this.keys['faq.question2.para9.span3.line5']}</div>
									<div><img src='./../../../../assets/images/qa/2.3.jpg' /></div>
								</li>
							</ol>
						</li>
					</ul>
				</div>

				<div style='font-size:2.5rem;font-weight:bold;'>
					${this.keys['faq.question2.header5']}
				</div>

				<div>
					${this.keys['faq.question2.para10']}
				</div>
				<div style='padding:10px 0'>
					${this.keys['faq.question2.para11']}
				</div>
			</div>
			`;
			}
		},
		{
			id: 3,
			category: 'q&a',
			path: '/device/support-detail/3',
			iconPath: `${this.imagePath}/svg_icon_qa_pcbit.svg`,
			title: `${this.translate.instant('faq.question3.title')}`,
			like: false,
			dislike: false,
			keys: [
				'faq.question3.title',
				'faq.question3.heading1',
				'faq.question3.para1',
				'faq.question3.heading2',

				'faq.question3.para2',
				'faq.question3.para3',
				'faq.question3.heading3',
				'faq.question3.para4',

				'faq.question3.heading4',
				'faq.question3.para5',
				'faq.question3.para6.span1.line1',

				'faq.question3.para6.span1.line2',
				'faq.question3.para6.span1.line3',
				'faq.question3.para6.span2',

				'faq.question3.para7',

				'faq.question3.para8.span1.line1',
				'faq.question3.para8.span1.line2',

				'faq.question3.para8.span2.line1',
				'faq.question3.para8.span2.line2',
				'faq.question3.para8.span2.line3',
				'faq.question3.para8.span2.line4',

				'faq.question3.para8.span3.line1',
				'faq.question3.para8.span3.line2',
				'faq.question3.para8.span3.line3',
				'faq.question3.para8.span3.line4',

				'faq.question3.para8.span4.line1',
				'faq.question3.para8.span4.line2',

				'faq.question3.para8.span5.line1',
				'faq.question3.para8.span5.line2',
				'faq.question3.para8.span5.line3',
				'faq.question3.para8.span5.line4',
				'faq.question3.para8.span5.line5',
				'faq.question3.para8.span5.line6',

				'faq.question3.para8.span6.line1',
				'faq.question3.para8.span6.line2',

				'faq.question3.para8.span7.line1',
				'faq.question3.para8.span7.line2',
				'faq.question3.para8.span7.line3',
				'faq.question3.para8.span7.line4',

				'faq.question3.para8.span8.line1',
				'faq.question3.para8.span8.line2',

				'faq.question3.para8.span9.line1',
				'faq.question3.para8.span9.line2',
				'faq.question3.para8.span9.line3',
				'faq.question3.para8.span9.line4',
				'faq.question3.para8.span9.line5',
				'faq.question3.para8.span9.line6',

				'faq.question3.para8.span10.line1',
				'faq.question3.para8.span10.line2',
				'faq.question3.para8.span10.line3',
				'faq.question3.para8.span10.line4',
				'faq.question3.para8.span10.line5',
				'faq.question3.para8.span10.line6',

				'faq.question3.para9.line1',
				'faq.question3.para9.line2',
				'faq.question3.para9.line3',
				'faq.question3.para9.line4',
				'faq.question3.para9.line5'
			],
			description: `faq.question3.description`,
			getDescription: function () {
				return `<div style='font-size:4rem;font-weight:bold;'>
					${this.keys['faq.question3.title']}
			</div>
			<hr>
			<h3 style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
				${this.keys['faq.question3.heading1']}
			</h3>
			<p>${this.keys['faq.question3.para1']}</p>

			<h3 style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
				${this.keys['faq.question3.heading2']}
			</h3>
			<p>
				${this.keys['faq.question3.para2']}
			</p>
			<ul>
				<li>${this.keys['faq.question3.para3']}</li>
			</ul>
			<h3 style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
				${this.keys['faq.question3.heading3']}
			</h3>
			<ul>
				<li>${this.keys['faq.question3.para4']}</li>
			</ul>
			<h3 style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
				${this.keys['faq.question3.heading4']}
			</h3>

			<p><strong><u>${this.keys['faq.question3.para5']}</u></strong></p>
			<ol>
				<li>${this.keys['faq.question3.para6.span1.line1']}
					<strong>${this.keys['faq.question3.para6.span1.line2']} </strong>
					${this.keys['faq.question3.para6.span1.line3']}&nbsp;&nbsp;</li>
				<li>${this.keys['faq.question3.para6.span2']}</li>
			</ol>
			<p  style="text-decoration: underline;font-weight: bold">
					<strong><u>${this.keys['faq.question3.para7']}</u></strong>
			</p>



			<p><strong>${this.keys['faq.question3.para8.span1.line1']}</strong>
				${this.keys['faq.question3.para8.span1.line2']}
			</p>
			<ol>
				<li>${this.keys['faq.question3.para8.span2.line1']}<strong>
					${this.keys['faq.question3.para8.span2.line2']}</strong>
					${this.keys['faq.question3.para8.span2.line3']}
					<strong>${this.keys['faq.question3.para8.span2.line4']}</strong>
				</li>
				<li>${this.keys['faq.question3.para8.span3.line1']}
					<strong>${this.keys['faq.question3.para8.span3.line2']}</strong>
					${this.keys['faq.question3.para8.span3.line3']}
					<strong>${this.keys['faq.question3.para8.span3.line4']}</strong></li>
				<li> ${this.keys['faq.question3.para8.span4.line1']}
					<strong>${this.keys['faq.question3.para8.span4.line2']}</strong>
				</li>
				<li>${this.keys['faq.question3.para8.span5.line1']}
					<strong>${this.keys['faq.question3.para8.span5.line2']}</strong>
					${this.keys['faq.question3.para8.span5.line3']}
					${this.keys['faq.question3.para8.span5.line4']}
					<strong>${this.keys['faq.question3.para8.span5.line5']}</strong>
					${this.keys['faq.question3.para8.span5.line6']}<br />
					&nbsp;</li>
			</ol>

			<p>
				<strong>${this.keys['faq.question3.para8.span6.line1']}</strong>
				${this.keys['faq.question3.para8.span6.line2']}
			</p>
			<ol>
				<li>${this.keys['faq.question3.para8.span7.line1']} &nbsp;
					<strong>${this.keys['faq.question3.para8.span7.line2']}</strong>
					${this.keys['faq.question3.para8.span7.line3']}&nbsp;
					<strong>${this.keys['faq.question3.para8.span7.line4']}</strong>
				</li>
				<li>${this.keys['faq.question3.para8.span8.line1']} &nbsp;
					<strong>${this.keys['faq.question3.para8.span8.line2']}</strong>
				</li>

				<li>${this.keys['faq.question3.para8.span9.line1']}
					<strong>${this.keys['faq.question3.para8.span9.line2']}</strong>
						${this.keys['faq.question3.para8.span9.line3']}
					<strong>${this.keys['faq.question3.para8.span9.line4']}</strong>
						${this.keys['faq.question3.para8.span9.line5']}
					 <strong>${this.keys['faq.question3.para8.span9.line6']}</strong>
				</li>

				<li>${this.keys['faq.question3.para8.span10.line1']}
					<strong>${this.keys['faq.question3.para8.span10.line2']}</strong>
					<strong>${this.keys['faq.question3.para8.span10.line3']}</strong>
					${this.keys['faq.question3.para8.span10.line4']}
					<strong>${this.keys['faq.question3.para8.span10.line5']}</strong>
					&nbsp;${this.keys['faq.question3.para8.span10.line6']}<br /> <br />
					${this.keys['faq.question3.para9.line1']}
					<strong> ${this.keys['faq.question3.para9.line2']}</strong>
					${this.keys['faq.question3.para9.line3']}
					<strong>${this.keys['faq.question3.para9.line4']}</strong>
					${this.keys['faq.question3.para9.line5']}
					</li>
			</ol>
			<p>&nbsp;</p>`;
			}
		},
		{
			id: 4,
			category: 'q&a',
			path: '/device/support-detail/4',
			iconPath: `${this.imagePath}/svg_icon_qa_battery.svg`,
			title: `${this.translate.instant('faq.question4.title')}`,
			like: false,
			dislike: false,
			keys: [
				'faq.question4.title',
				'faq.question4.heading1',
				'faq.question4.para1.span1',
				'faq.question4.para1.span2',
				'faq.question4.para1.span3',
				'faq.question4.heading2',
				'faq.question4.para2',
				'faq.question4.heading3',
				'faq.question4.para3',
				'faq.question4.heading4',
				'faq.question4.para4',
				'faq.question4.heading5',
				'faq.question4.para5.line1',
				'faq.question4.para5.line2',
				'faq.question4.para5.line3',
				'faq.question4.para5.line4',
				'faq.question4.para5.line5',
				'faq.question4.para6.span1',
				'faq.question4.para6.span2.line1',
				'faq.question4.para6.span2.line2',
				'faq.question4.para6.span2.line3',
				'faq.question4.para6.span3.line1',
				'faq.question4.para6.span3.line2',
				'faq.question4.para6.span3.line3',
				'faq.question4.para6.span3.line4',
				'faq.question4.para6.span3.line5',
				'faq.question4.para6.span3.line6',
				'faq.question4.para6.span4.line1',
				'faq.question4.para6.span4.line2',
				'faq.question4.para6.span4.line3',
				'faq.question4.para6.span5',
				'faq.question4.para6.span6',
				'faq.question4.para6.span7.line1',
				'faq.question4.para6.span7.line2',
				'faq.question4.para6.span7.line3',
				'faq.question4.para6.span7.line4',
				'faq.question4.para6.span7.line5',
				'faq.question4.para6.span7.line6',
				'faq.question4.para6.span8.line1',
				'faq.question4.para6.span8.line2',
				'faq.question4.para6.span8.line3',
				'faq.question4.para6.span8.line4',
				'faq.question4.para6.span8.line5',
				'faq.question4.para6.span9.line1',
				'faq.question4.para6.span9.line2',
				'faq.question4.para6.span9.line3',
				'faq.question4.para6.span10'
			],
			description: `faq.question4.description`,
			getDescription: function () {
				return `<div style='font-size:4rem;font-weight:bold;'>
				${this.keys['faq.question4.title']}
			</div>
			<hr>
			<h3 style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
				${this.keys['faq.question4.heading1']}
			</h3>

			<p>${this.keys['faq.question4.para1.span1']}
				<strong>${this.keys['faq.question4.para1.span2']} </strong>
				${this.keys['faq.question4.para1.span3']}
			</p>

			<h3 style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
				${this.keys['faq.question4.heading2']}
			</h3>

			<ul>
				<li>${this.keys['faq.question4.para2']}</li>
			</ul>

			<h3 style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
				${this.keys['faq.question4.heading3']}
			</h3>
			<ul>
				<li>${this.keys['faq.question4.para3']}</li>
			</ul>

			<h3 style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
				${this.keys['faq.question4.heading4']}
			</h3>

			<ul>
				<li>${this.keys['faq.question4.para4']}</li>
			</ul>
			<h3 style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
				${this.keys['faq.question4.heading5']}
			</h3>
			<p>
				${this.keys['faq.question4.para5.line1']}
				<strong>${this.keys['faq.question4.para5.line2']}</strong>
				${this.keys['faq.question4.para5.line3']}
				<strong>${this.keys['faq.question4.para5.line4']}</strong>
				${this.keys['faq.question4.para5.line5']}
			</p>
			<p><br /> </p>
			<p>
				<h3 style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
					${this.keys['faq.question4.para6.span1']}
				</h3>
			</p>

			<p>
				${this.keys['faq.question4.para6.span2.line1']}
				<strong>
					${this.keys['faq.question4.para6.span2.line2']}
				</strong>
				${this.keys['faq.question4.para6.span2.line3']}
			</p>

			<p>
				${this.keys['faq.question4.para6.span3.line1']}
				<strong>
					${this.keys['faq.question4.para6.span3.line2']}
				</strong>
					${this.keys['faq.question4.para6.span3.line3']}
				<strong>
					${this.keys['faq.question4.para6.span3.line4']}
				</strong>
					${this.keys['faq.question4.para6.span3.line5']}
				<strong>
					${this.keys['faq.question4.para6.span3.line6']}<br /><br />
				 </strong>
			</p>

			<p>
				<img src='./../../../assets/images/qa/4.1.jpg' />
				<strong><br /> <br /> </strong>
			</p>

			<p>
				${this.keys['faq.question4.para6.span4.line1']}&nbsp;
				<strong>${this.keys['faq.question4.para6.span4.line2']}</strong>
				${this.keys['faq.question4.para6.span4.line3']}
			</p>

			<p>&nbsp;</p>

			<h3 style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
				${this.keys['faq.question4.para6.span5']}
			</h3>
			<p>${this.keys['faq.question4.para6.span6']}</p>
			<p>${this.keys['faq.question4.para6.span7.line1']}
				<strong>${this.keys['faq.question4.para6.span7.line2']}</strong>
				<strong>${this.keys['faq.question4.para6.span7.line3']}</strong>
				${this.keys['faq.question4.para6.span7.line4']}
				<strong>${this.keys['faq.question4.para6.span7.line5']}</strong>
				&nbsp;${this.keys['faq.question4.para6.span7.line6']}
			</p>

			<p>${this.keys['faq.question4.para6.span8.line1']}
				<strong>${this.keys['faq.question4.para6.span8.line2']}</strong>
				${this.keys['faq.question4.para6.span8.line3']}
				<strong>${this.keys['faq.question4.para6.span8.line4']}</strong>
				${this.keys['faq.question4.para6.span8.line5']}
			</p>

			<p>
				${this.keys['faq.question4.para6.span9.line1']}&nbsp;
				<strong>
					${this.keys['faq.question4.para6.span9.line2']}&nbsp;
				</strong>
				${this.keys['faq.question4.para6.span9.line3']}
			</p>

				<p>${this.keys['faq.question4.para6.span10']}</p>

			<p><img src='./../../../assets/images/qa/4.2.jpg' /></p>

			<p>&nbsp;</p>`;
			}
		},
		{
			id: 5,
			category: 'q&a',
			path: '/device/support-detail/5',
			iconPath: `${this.imagePath}/svg_icon_qa_tablet.svg`,
			title: `${this.translate.instant('faq.question5.title')}`,
			like: false,
			dislike: false,
			keys: [
				'faq.question5.title',
				'faq.question5.para1',
				'faq.question5.heading1',
				'faq.question5.para2.span1',
				'faq.question5.para2.span2',
				'faq.question5.para2.span3',
				'faq.question5.para2.span4',
				'faq.question5.heading2',
				'faq.question5.para3',
				'faq.question5.para4',
				'faq.question5.heading3',
				'faq.question5.para5.span1',
				'faq.question5.para5.span2',
				'faq.question5.para5.span3',
				'faq.question5.para5.span4',
				'faq.question5.para5.span5',
				'faq.question5.para5.span6',
				'faq.question5.para5.span7',
				'faq.question5.para5.span8',
				'faq.question5.para5.span9',
				'faq.question5.para5.span10',
				'faq.question5.heading4',
				'faq.question5.para6',
				'faq.question5.para7',
				'faq.question5.para8.span1',
				'faq.question5.para8.span2.line1',
				'faq.question5.para8.span2.line2',
				'faq.question5.para8.span2.line3',
				'faq.question5.para8.span3'
			],
			description: `faq.question5.description`,
			getDescription: function () {
				return `<div style='font-size:4rem;font-weight:bold;'>
				${this.keys['faq.question5.title']}
			</div>
			<hr>

			<p>${this.keys['faq.question5.para1']}</p>

			<h3 style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
				${this.keys['faq.question5.heading1']}
			</h3>

			<p>
				${this.keys['faq.question5.para2.span1']}
				<strong>${this.keys['faq.question5.para2.span2']}</strong>
				${this.keys['faq.question5.para2.span3']}
				<strong>${this.keys['faq.question5.para2.span4']}</strong>
			</p>

			<p>&nbsp;</p>

			<p><img src='./../../../assets/images/qa/5.1.jpg' /></p>

			<h3 style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
				${this.keys['faq.question5.heading2']}
			</h3>

			<p>${this.keys['faq.question5.para3']}&nbsp;</p>

			<p>&nbsp;</p>

			<p>${this.keys['faq.question5.para4']}</p>

			<p>&nbsp;</p>

			<h3 style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
				${this.keys['faq.question5.heading3']}
			</h3>

			<p>
				${this.keys['faq.question5.para5.span1']}
				${this.keys['faq.question5.para5.span2']}<strong>${this.keys['faq.question5.para5.span3']} </strong>
				${this.keys['faq.question5.para5.span4']}
				<strong>${this.keys['faq.question5.para5.span5']} </strong>&gt;
				<strong>${this.keys['faq.question5.para5.span6']} </strong>&gt;
				<strong>${this.keys['faq.question5.para5.span7']}</strong>
				,&nbsp;${this.keys['faq.question5.para5.span8']}
				<strong>${this.keys['faq.question5.para5.span9']}</strong>
				${this.keys['faq.question5.para5.span10']}
			</p>

			<h3 style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
				${this.keys['faq.question5.heading4']}
			</h3>

			<p>${this.keys['faq.question5.para6']}</p>

			<p>${this.keys['faq.question5.para7']}< /p>

			<ul>
				<li>${this.keys['faq.question5.para8.span1']}</li>
				<li> ${this.keys['faq.question5.para8.span2.line1']}
					<strong> ${this.keys['faq.question5.para8.span2.line2']}</strong>
					${this.keys['faq.question5.para8.span2.line3']}
				</li>
				<li>${this.keys['faq.question5.para8.span3']}
				</li>
			</ul>

			<p>&nbsp;</p>`;
			}
		},
		{
			id: 6,
			category: 'q&a',
			path: '/device/support-detail/6',
			iconPath: `${this.imagePath}/svg_icon_qa_cortana.svg`,
			title: `${this.translate.instant('faq.question6.title')}`,
			like: false,
			dislike: false,
			keys: [
				'faq.question6.title',
				'faq.question6.heading1',
				'faq.question6.para1',
				'faq.question6.para2',
				'faq.question6.para3',
				'faq.question6.para4',
				'faq.question6.para5',
				'faq.question6.para6',
				'faq.question6.bulletset1.span1',
				'faq.question6.bulletset1.span2',
				'faq.question6.bulletset1.span3',
				'faq.question6.bulletset1.span4',
				'faq.question6.bulletset1.span5',
				'faq.question6.bulletset1.span6',
				'faq.question6.bulletset1.span7',
				'faq.question6.bulletset1.span8',
				'faq.question6.heading2',
				'faq.question6.para7',
				'faq.question6.para8',
				'faq.question6.para9',
				'faq.question6.para10',
				'faq.question6.heading3',
				'faq.question6.para11.span1',
				'faq.question6.para11.span2.line1',
				'faq.question6.para11.span2.line2',
				'faq.question6.para11.span2.line3',
				'faq.question6.para11.span2.line4',
				'faq.question6.para12',
				'faq.question6.para13'
			],
			description: `faq.question6.description`,
			getDescription: function () {
				return `

			<div style='font-size:4rem;font-weight:bold;'>
				${this.keys['faq.question6.title']}
			</div>

			<hr>

			<h3 style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
				${this.keys['faq.question6.heading1']}
			</h3>

			<hr />

			<p>${this.keys['faq.question6.para1']}</p>

			<p>${this.keys['faq.question6.para2']}</p>

			<p>${this.keys['faq.question6.para3']}</p>

			<p>${this.keys['faq.question6.para4']}</p>

			<p><img src='./../../../assets/images/qa/6.1.png' /></p>

			<ol>
				<li>${this.keys['faq.question6.para5']}</li>
			</ol>

			<p>${this.keys['faq.question6.para6']}</p>

			<ul>
				<li>${this.keys['faq.question6.bulletset1.span1']}</li>
				<li>${this.keys['faq.question6.bulletset1.span2']}</li>
				<li>${this.keys['faq.question6.bulletset1.span3']}</li>
				<li>${this.keys['faq.question6.bulletset1.span4']}</li>
				<li>${this.keys['faq.question6.bulletset1.span5']}</li>
				<li>${this.keys['faq.question6.bulletset1.span6']}</li>
				<li>${this.keys['faq.question6.bulletset1.span7']}</li>
				<li>${this.keys['faq.question6.bulletset1.span8']}</li>
			</ul>

			<h3 style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
				${this.keys['faq.question6.heading2']}
			</h3>

			<hr />
			<p>
				${this.keys['faq.question6.para7']}
			</p>
			<p>
				${this.keys['faq.question6.para8']}
			</p>
			<p>
			    ${this.keys['faq.question6.para9']}
			</p>
			<p>
				${this.keys['faq.question6.para10']}
			</p>
			<p><img src='./../../../assets/images/qa/6.2.png' /></p>

			<h3 style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
				${this.keys['faq.question6.heading3']}
			</h3>
			<hr />

			<p> ${this.keys['faq.question6.para11.span1']}
				&nbsp; ${this.keys['faq.question6.para11.span2.line1']}&nbsp;
				<strong>${this.keys['faq.question6.para11.span2.line2']}</strong>
				&nbsp;&nbsp;${this.keys['faq.question6.para11.span2.line3']}&nbsp;
				<strong>${this.keys['faq.question6.para11.span2.line4']}</strong>
			</p>

			<p><img src='./../../../assets/images/qa/6.3.png' /></p>

			<p style='font-weight:bold;font-size:2.5rem;padding:10px 0'>
				${this.keys['faq.question6.para12']}
			</p>

			<p>${this.keys['faq.question6.para13']} </p>
			<p>&nbsp;</p>`;
			}
		}
	];

	//VAN-5872, server switch feature
	//only preserving those keys that are used in html
	preserveTransKeys: any = {
		pageTitle: 'faq.pageTitle',
		qasTransKeys: {},
		isPreserved: false,
		isSubscribed: <any>false
	};

	constructor(private translate: TranslateService) { }

	setTranslationService(translate: TranslateService) {
		this.translate = translate;
	}

	getById(id: number): QA {
		return this.qas.find((element, index, array) => {
			return element.id === id;
		});
	}

	setCurrentLangTranslations() {
		//Evaluate the translations for QA on language Change
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.qas.forEach((qa) => {
				try {
					qa.title = this.translate.instant(qa.title);
					this.translate.stream(qa.title).subscribe((value) => {
						qa.title = value;
					});
				} catch (e) {
					console.log('QA title translation : already translated');
				}

				try {
					//console.log(qa.description);
					qa.description = this.translate.instant(qa.description);
					this.translate.stream(qa.description).subscribe((value) => {
						qa.description = value;
					});

					//console.log(qa.description);
				} catch (e) {
					console.log('QA description by HTML MAP : already translated');
				}

				try {
					this.translate.get(qa.keys).subscribe((translation: [string]) => {
						// console.log(JSON.stringify(translation));
						qa.keys = translation;
						// console.log(JSON.stringify(qa.keys));
					});
				} catch (e) {
					console.log('QA description by KEY_VALUE MAP : already translated');
				}
			});

			// this.qas = this.qaService.qas;

			//sahinul, 24June2019 VAN-5534
			try {
				this.title = this.translate.instant(this.title);
				this.translate.stream(this.title).subscribe((value) => {
					this.title = value;
				});
			} catch (e) {
				console.log('QA Page title translation : already translated');
			}
		});

		this.qas.forEach((qa) => {
			try {
				//console.log(qa.title);
				qa.title = this.translate.instant(qa.title);
				//console.log(qa.title);
				this.translate.stream(qa.title).subscribe((value) => {
					qa.title = value;
				});
			} catch (e) {
				console.log('QA title translation : already translated');
			}

			try {
				//console.log(qa.description);
				qa.description = this.translate.instant(qa.description);
				this.translate.stream(qa.description).subscribe((value) => {
					qa.description = value;
				});

				//console.log(qa.description);
			} catch (e) {
				console.log('QA description by HTML MAP : already translated');
			}

			try {
				this.translate.get(qa.keys).subscribe((translation: [string]) => {
					// console.log(JSON.stringify(translation));
					qa.keys = translation;
					// console.log(JSON.stringify(qa.keys));
				});
			} catch (e) {
				console.log('QA description by KEY_VALUE MAP : already translated');
			}
		});

		//sahinul, 24June2019 VAN-5534
		try {
			this.title = this.translate.instant(this.title);
			this.translate.stream(this.title).subscribe((value) => {
				this.title = value;
			});
		} catch (e) {
			console.log('QA Page title translation : already translated');
		}
	}

	//VAN-5872, server switch feature
	getQATranslation(translateQA: TranslateService) {
		try {
			//preserving translation keys to use every time
			if (!this.preserveTransKeys.isPreserved) {
				this.qas.forEach((qa) => {
					this.preserveTransKeys.qasTransKeys[qa.id] = {
						title: 'faq.question' + qa.id + '.title',
						description: 'faq.question' + qa.id + '.description'
					};
				});

				this.preserveTransKeys.isPreserved = true;
			}

			//respond to onLangChange
			if (!this.preserveTransKeys.isSubscribed) {
				this.preserveTransKeys.isSubscribed = translateQA.onLangChange.subscribe((event: LangChangeEvent) => {
					//Page Title
					this.title = this.getObjectValue(event.translations, this.preserveTransKeys.pageTitle); //setting this again
					//console.log('@sahinul in getQATranslation onLangChange', event.lang, this.preserveTransKeys.pageTitle, this.title);

					this.qas.forEach((qa) => {
						//segment or list Title
						let qaTitleKey = this.preserveTransKeys.qasTransKeys[qa.id].title;
						qa.title = this.getObjectValue(event.translations, qaTitleKey);
						// console.log('@sahinul in getQATranslation onLangChange qa', qaTitleKey, qa.title);

						let qaDescriptionKey = this.preserveTransKeys.qasTransKeys[qa.id].description;
						qa.description = this.getObjectValue(event.translations, qaDescriptionKey);
					});
				});
			}

			//Stream all the values
			translateQA.stream(this.preserveTransKeys.pageTitle).subscribe((value) => {
				this.title = value;
			});

			this.qas.forEach((qa) => {
				let qaTitleKey = this.preserveTransKeys.qasTransKeys[qa.id].title;
				translateQA.stream(qaTitleKey).subscribe((value) => {
					qa.title = value;
				});
				//console.log('@sahinul in getQATranslation', translateQA.currentLang, qa.title);

				let qaDescriptionKey = this.preserveTransKeys.qasTransKeys[qa.id].description;
				translateQA.stream(qaDescriptionKey).subscribe((value) => {
					qa.description = value;
				});
				/*console.log('@sahinul in getQATranslation keys', translateQA.currentLang, qa.keys);
				if (isArray(qa.keys)) {
					translateQA.stream(qa.keys).subscribe((translation: [string]) => {
						qa.keys = translation;
					});
				}*/
			});
		} catch (err) {
			console.log('getQATranslation Error', err);
		}
	}

	//key=> faq.question1.title
	getObjectValue(sourceValue: object, key: string): any {
		if (!sourceValue) {
			return null;
		}

		let parents = key.split('.');
		let returnValue = sourceValue;
		parents.forEach((v) => {
			returnValue = returnValue[v];
		});
		return returnValue;
	}

	destroyChangeSubscribed() {
		if (this.preserveTransKeys.isSubscribed) {
			this.preserveTransKeys.isSubscribed.unsubscribe();
		}
		console.log('@destroyChangeSubscribed');
	}
}
