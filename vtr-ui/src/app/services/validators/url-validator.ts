export default class URLValidator {
	private readonly regExForUrlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
	private readonly regExForUrl = new RegExp(this.regExForUrlPattern, 'i');

	public isValid(url: string): boolean {
		if (url && url.length > 0) {
			return this.regExForUrl.test(url);
		}
		return false;
	}
}
