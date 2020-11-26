import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';

@Component({
	selector: 'vtr-user',
	templateUrl: './page-user.component.html',
	styleUrls: ['./page-user.component.scss'],
})
export class PageUserComponent implements OnInit {
	title = 'User Settings';

	constructor(public userService: UserService) {}

	ngOnInit() {}
}
