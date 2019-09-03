import { Url } from 'url';
import { HomeSecurityDevice } from './home-security-device.model';

export class HomeSecurityHomeGroup {
    id: string;
    avatar: Url;
    name: string;
    devices: Map<string, Map<string, HomeSecurityDevice>>;
}