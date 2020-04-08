import { Injectable } from '@angular/core';
export enum VersionCodeName {
	Anemone,
	Blue,
	Calla,
	Dietes,
	Erigeron,
	Freesia,
	Gardenia,
	Honeysuckle,
	Iberis,
	Jaborosa,
	Kalmia,
	Lily,
	Magnolia,
	Nierembergia,
	Ox,
	Peony,
	Queens,
	Rose,
	Scaevola,
	Trillium,
	Uva,
	Viola,
	Wind,
	Xylosma,
	Yellow,
	Zenobia
}

@Injectable({
	providedIn: 'root'
})

export class VersionService {
	public currentVersion: VersionCodeName = VersionCodeName.Anemone;
}
