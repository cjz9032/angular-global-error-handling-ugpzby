import { HomeSecurityDevice } from './home-security-device.model';
import { Url } from 'url';
export class HomeSecurityMemberGroup {
    id: string;
    avatar: Url;
    name: string;
    devices: Map<string, HomeSecurityDevice>;
}