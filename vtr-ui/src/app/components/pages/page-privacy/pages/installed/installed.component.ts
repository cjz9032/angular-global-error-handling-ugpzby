import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountsStoredByFigleaf, FigleafAccountsService } from '../../common-services/figleaf-accounts.service';
import { takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../shared/custom-rxjs-operators/instance-destroyed';

@Component({
	// selector: 'app-admin',
	templateUrl: './installed.component.html',
	styleUrls: ['./installed.component.scss', './privacy-dashboard.component.scss']
})
export class InstalledComponent implements OnInit, OnDestroy {
	accountsStoredByFigleaf: AccountsStoredByFigleaf[];
	// static Data for html
	browserStoredAccountsData = {showDetailAction: 'link'};
	error: string;

	constructor(private figleafAccountsService: FigleafAccountsService) {
	}

	ngOnInit() {
		this.figleafAccountsService.getAccountsStoredByFigleaf().pipe(
			takeUntil(instanceDestroyed(this)),
		).subscribe(
			(value => this.accountsStoredByFigleaf = value.payload.figleaf_accounts),
			(error => this.error = error)
		);
	}

	ngOnDestroy() {
	}
}
