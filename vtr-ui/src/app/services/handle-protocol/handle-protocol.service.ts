import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HandleProtocolService {
  vantage3xSchema = 'lenovo-vantage3:';
  semanticToPath: { [semantic: string]: string } = {
	'dashboard': '',
	'device': 'device',
	'device-settings': 'device/device-settings/power',
	'system-updates': 'device/system-updates',
	'security': 'security',
	'anti-virus': 'security/anti-virus',
	'wifi-security': 'security/wifi-security',
	'password-protection': 'security/password-protection',
	'internet-protection': 'security/internet-protection',
	'windows-hello': 'security/windows-hello',
	'support': 'support',
	'power': 'device/device-settings/power',
	'display-camera': 'device/device-settings/display-camera',
	'audio': 'device/device-settings/audio',
	'input': 'device/device-settings/input-accessories',
	'smart-settings': 'device/smart-assist',
	'home-security': 'home-security',
	'modern-preload': '?action=modernpreload',
	'toolbar': '',
	'preference': 'settings',
	'gaming-autoclose': 'gaming/autoclose',
	'gaming-networkboost': 'gaming/networkboost',
	'gaming-macrokey': 'gaming/macrokey',
	'gaming-lighting0': 'gaming/lightingcustomize/0',
	'gaming-lighting1': 'gaming/lightingcustomize/1',
	'gaming-lighting2': 'gaming/lightingcustomize/2',
	'gaming-lighting3': 'gaming/lightingcustomize/3'
  }

  backwardCompatibilitySchemas = [
	'lenovo-metro-discovery:',
	'lenovo-metro-companion:',
	'lenovo-companion:'
  ];

  sectionToSemantic: { [section: string]: string } = {
	'powersection': 'power',
	'multimedia': 'display-camera',
	'input': 'input',
	'multimodesection': 'smart-settings'
  }

  featureIdToSemantic: { [featureId: string]: string } = {
	'5fbdca5f-02ca-4159-8f1c-725703e31473': 'power',
	'4efe8c3d-db66-4f91-87fc-31e9aa1cbadf': 'display-camera',
	'd0ff2f49-ca94-4dd7-a30f-d3d950d5e720': 'input',
	'9c37804e-6043-4f81-80bb-c4ffbb61ab12': 'smart-settings',
	'6f486cf5-5d51-4ae8-aba9-089b5cb96420': 'wifi-security',
	'2885591f-f5a8-477a-9744-d1b9f30b5b79': 'wifi-security',
	'a191bf9f-60be-4843-b4ba-441dd0aeb12e': 'support',
	'883b56c4-1348-4478-ab2e-a0909dd121c8': 'support',
	'e40b12ce-c5dd-4571-bbc6-7ea5879a8472': 'system-updates',
	'cd300e9b-e1b9-44eb-9634-a91bb32faf79': 'display-camera',
	'19841a14-32b9-4f67-9d3a-605ee6cef187': 'wifi-security',
	'5e5800d8-e4ea-4cb0-b628-68d1bdae8622': 'dashboard',
	'18e12fc0-eacb-43cb-8231-87d9c09ee0df': 'support',
	'f45a1a5c-44eb-42c3-b361-025ed702dd7c': 'modern-preload',
  }

  constructor() { }

  public initializeUrl() {
	const url = this.processUrl(window.location.href);
	if (url !== window.location.href) {
		window.location.href = url;
	}
  }

  public decodeBase64String(args: string) {
	try {
		return atob(args);
	} catch(e) {
		return '';
	}
  }

  public constructURL(args: string) : URL | undefined {
	try {
		return new URL(args);
	} catch(e) {
		return undefined;
	}
  }

  public processUrl(args: string) : string {
	let url = this.constructURL(args);
	if (!url) return args;

	let hash = url.hash;
	let characteristicCode = '#/?protocol=';
	if (!hash.startsWith(characteristicCode)) return args;

	let origin = url.origin;
	let pathname = url.pathname;
	let homePageUrl = `${origin}${pathname}#/`;
	let encodedProtocol = hash.slice(hash.indexOf(characteristicCode) + characteristicCode.length);

	let originalProtocol = this.decodeBase64String(encodedProtocol);
	if (!originalProtocol) return homePageUrl;

	let newUrl = this.convertToUrlAssumeProtocolIs3x(originalProtocol);
	if (!newUrl) {
		newUrl = this.convertToUrlAssumeProtocolIs2x(originalProtocol);
	}
	if (!newUrl) return homePageUrl;

	return `${homePageUrl}${newUrl}`;
  }

  public convertToUrlAssumeProtocolIs3x(rawData: string) : string {
	let url = this.constructURL(rawData);
	if (!url) return '';
	const schema = url.protocol;
	const semantic = url.pathname;
	const query = url.search;

	if (schema !== this.vantage3xSchema || !semantic) return '';

	const path: string | undefined = this.semanticToPath[semantic];
	if (!path) return '';

	return `${path}${query}`;
  }

  public convertToUrlAssumeProtocolIs2x(rawData: string) : string {
	let url = this.constructURL(rawData);
	if (!url) return '';
	const schema = url.protocol;
	const pathName = url.pathname;
	const query = url.search;
	const queryParams = url.searchParams;

	if (!this.backwardCompatibilitySchemas.includes(schema) || pathName !== 'PARAM') return '';

	const featureId: string | null = queryParams.get('featureId');
	if (featureId) {
		const featureSemantic: string | undefined = this.featureIdToSemantic[featureId];
		if (featureSemantic) {
			const path: string | undefined = this.semanticToPath[featureSemantic];
			if (path) return `${path}${query}`;
		}
	}

	const section: string | null = queryParams.get('section');
	if (section) {
		const sectionSemantic: string | undefined = this.sectionToSemantic[section];
		if (sectionSemantic) {
			const path = this.semanticToPath[sectionSemantic];
			if (path) return `${path}${query}`;
		}
	}

	return '';
  }
}

