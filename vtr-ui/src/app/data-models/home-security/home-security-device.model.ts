import { Url } from 'url';
import { HomeSecurityDeviceType } from './home-security-device-type.model';

export class HomeSecurityDevice {
    id: string;
    icon: Url;
    name: string;
    safe: boolean;
    type: HomeSecurityDeviceType;
}