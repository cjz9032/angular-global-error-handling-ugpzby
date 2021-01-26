import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vtr-subpage-meeting-manager',
  templateUrl: './subpage-meeting-manager.component.html',
  styleUrls: ['./subpage-meeting-manager.component.scss']
})
export class SubpageMeetingManagerComponent implements OnInit {

  constructor() { }
  headerMenuItems = [
    {
				title: 'smb.meetingExperience.meetingManager.aiMeetingManager.title',
				path: 'meetingManager',
				metricsItem: 'PowerSmartSettings',
				order: 1,
			},
    {
				title: 'smb.meetingExperience.meetingManager.microPhone.title',
				path: 'microPhone',
				metricsItem: 'PowerSmartSettings',
				order: 2,
      },
      {
				title: 'smb.meetingExperience.meetingManager.smartAppearance.title',
				path: 'smartAppearance',
				metricsItem: 'PowerSmartSettings',
				order: 3,
			},
  ];

  ngOnInit(): void {
  }

}
