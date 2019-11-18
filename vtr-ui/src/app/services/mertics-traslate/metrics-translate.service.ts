import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class MetricsTranslateService {


	private baseLanguage;
	private targetLanguage;

	constructor(private translateService: TranslateService, private http: HttpClient) {
		setTimeout(() => {
			this.loadBaseAndTargetFile();
		}, 0);

	}

	public setBaseLanguage(baseLanguage) {
		this.baseLanguage = baseLanguage;
		// console.log('base', this.targetLanguage);
	}

	public setTargetLanguage(targetLanguage) {
		this.targetLanguage = this.flatten(targetLanguage);
		// console.log('target', this.targetLanguage);
	}

	public translate(sourceValue): string {
		// console.log('1.------', sourceValue);
		let matchedKey = '';
		for (const i in this.targetLanguage) {
			if (this.targetLanguage[i] === sourceValue) {
				matchedKey = i;
				break;
			}
		}
		// console.log('2.------', matchedKey);
		let targetValue = this.expand(this.baseLanguage, matchedKey);
		targetValue = targetValue ? targetValue : sourceValue; // if value found in en.json, else use given value
		// console.log('3.------', targetValue);
		return targetValue;
	}

	private flatten(ob) {
		const toReturn = {};

		for (const i in ob) {
			if (!ob.hasOwnProperty(i)) { continue; }

			if ((typeof ob[i]) === 'object' && ob[i] !== null) {
				const flatObject = this.flatten(ob[i]);
				for (const x in flatObject) {
					if (!flatObject.hasOwnProperty(x)) { continue; }

					toReturn[i + '.' + x] = flatObject[x];
				}
			} else {
				toReturn[i] = ob[i];
			}
		}
		return toReturn;
	}

	private expand(object, str) {
		if (object) {
			const items = str.split('.'); // split on dot notation

			//  loop through all nodes, except the last one
			for (const i of items) {
				if (i) {
					object = object[i]; // create a new element inside the reference
					// shift the reference to the newly created object
				}
			}
		}
		// apply the final value

		return object; // return the full object
	}

	loadBaseAndTargetFile() {
		this.http.get('./assets/i18n/en.json').subscribe((baseLanguage) => {
			if (this.translateService.currentLang) {
				return this.http.get('./assets/i18n/' + this.translateService.currentLang + '.json').subscribe((targetLanguage) => {
					this.setTargetLanguage(targetLanguage);
					this.setBaseLanguage(baseLanguage);
				});
			}
		});


	}
}
