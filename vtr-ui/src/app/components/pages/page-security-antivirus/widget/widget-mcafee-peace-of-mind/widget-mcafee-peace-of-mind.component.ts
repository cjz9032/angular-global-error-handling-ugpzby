import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vtr-widget-mcafee-peace-of-mind',
  templateUrl: './widget-mcafee-peace-of-mind.component.html',
  styleUrls: ['./widget-mcafee-peace-of-mind.component.scss']
})
export class WidgetMcafeePeaceOfMindComponent implements OnInit {
	items= [{
		image: '../../../../../../assets/images/antivirus/million_device_icon.svg',
		title: 'security.antivirus.others.peaceOfMindTitle1',
		desc: 'security.antivirus.others.peaceOfMindTitle1'
	}, {
		image: '../../../../../../assets/images/antivirus/billion_real_threat_icon.svg',
		title: 'security.antivirus.others.peaceOfMindTitle2',
		desc: 'security.antivirus.others.peaceOfMindTitle2'
	}, {
		image: '../../../../../../assets/images/antivirus/threat_icon.svg',
		title: 'security.antivirus.others.peaceOfMindTitle3',
		desc: 'security.antivirus.others.peaceOfMindTitle3'
	}]
  constructor() { }

  ngOnInit(): void {
  }

}
