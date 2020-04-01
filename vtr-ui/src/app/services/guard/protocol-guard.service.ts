import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlSegment, UrlMatchResult, UrlTree, Router } from '@angular/router';
import { GuardConstants } from './guard-constants';


@Injectable({
  providedIn: 'root'
})
export class ProtocolGuardService implements CanActivate {
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

  constructor(
	private guardConstants: GuardConstants,
	private router: Router
  ) { }

  private decodeBase64String(args: string) {
	try {
		return atob(args);
	} catch(e) {
		return '';
	}
  }

  private constructURL(args: string) : URL | undefined {
	try {
		return new URL(args);
	} catch(e) {
		return undefined;
	}
  }

  public isRedirectUrlNeeded(args: string) : [boolean, string] {
	let tempUrl = this.processPath(args);
	if (tempUrl !== args) return [true, tempUrl];

	return [false, ''];
  }

  private processPath(path: string) : string {
	const characteristicCode = '/?protocol=';
	if (!path.startsWith(characteristicCode)) return path;

	let encodedProtocol = path.slice(path.indexOf(characteristicCode) + characteristicCode.length);
	let originalProtocol = this.decodeBase64String(encodedProtocol);
	if (!originalProtocol) return '/';

	let newPath = this.convertToUrlAssumeProtocolIs3x(originalProtocol);
	if (!newPath) {
		newPath = this.convertToUrlAssumeProtocolIs2x(originalProtocol);
	}

	return `/${newPath}`;
  }

  private convertToUrlAssumeProtocolIs3x(rawData: string) : string {
	let url = this.constructURL(rawData);
	if (!url) return '';
	const schema = url.protocol;
	const semantic = url.pathname;
	const query = url.search;

	if (schema !== this.vantage3xSchema || !semantic) return '';

	let path: string | undefined = this.semanticToPath[semantic];
	if (!path) {
		path = semantic;
	}

	return `${path}${query}`;
  }

  private convertToUrlAssumeProtocolIs2x(rawData: string) : string {
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

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean | UrlTree {
	const path = window.location.href.slice(window.location.href.indexOf('#') + 1);
	const checkResult = this.isRedirectUrlNeeded(path);
	if (checkResult[0]) return this.router.parseUrl(checkResult[1]);
	return this.guardConstants.defaultRoute;
  }
}

export function protocolUrl(url: UrlSegment[]) : UrlMatchResult {
	if (window.location.href.includes('/?protocol=') && url.length === 0) {
		return {consumed: url};
	}
	return null;
}

