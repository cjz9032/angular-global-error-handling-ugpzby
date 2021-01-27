import { isEmpty } from 'lodash';

export default class URLValidator {
	private readonly regExForUrlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
	private readonly regExForUrl = new RegExp(this.regExForUrlPattern, 'i');

	public isValid(url: string): boolean {
		if (isEmpty(url)) { return false; }
		return this.regExForUrl.test(url);
	}
}
