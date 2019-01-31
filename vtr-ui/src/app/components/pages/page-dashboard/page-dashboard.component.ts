import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard/dashboard.service';

@Component({
	selector: 'vtr-page-dashboard',
	templateUrl: './page-dashboard.component.html',
	styleUrls: ['./page-dashboard.component.scss']
})
export class PageDashboardComponent implements OnInit {

	title = 'Dashboard';
	forwardLink = {
		path: 'dashboard-customize',
		label: 'Customize Dashboard'
	}

  data: any=[{
    "albumId": 1,
    "id": 1,
    "title": "accusamus beatae ad facilis cum similique qui sunt",
    "url": "assets/images/banner1.jpeg",
    "thumbnailUrl": "https://via.placeholder.com/150/92c952"
  },
    {
      "albumId": 1,
      "id": 2,
      "title": "reprehenderit est deserunt velit ipsam",
      "url": "assets/images/banner2.jpeg",
      "thumbnailUrl": "https://via.placeholder.com/150/771796"
    },
    {
      "albumId": 1,
      "id": 3,
      "title": "officia porro iure quia iusto qui ipsa ut modi",
      "url": "assets/images/banner2.jpeg",
      "thumbnailUrl": "https://via.placeholder.com/150/24f355"
    },
    {
      "albumId": 1,
      "id": 4,
      "title": "culpa odio esse rerum omnis laboriosam voluptate repudiandae",
      "url": "assets/images/banner1.jpeg",
      "thumbnailUrl": "https://via.placeholder.com/150/d32776"
    }];
	constructor(
		public dashboardService: DashboardService
	) { }

	ngOnInit() {
	}

}
