import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'vtr-voice',
  templateUrl: './voice.component.html',
  styleUrls: ['./voice.component.scss']
})
export class VoiceComponent implements OnInit {
	voiceToText: any  = 'voiceToText';
	translation: any = 'translation';
  constructor() { }

  ngOnInit() {
  }

}
