export enum UpdateRebootType {
	Unknown = 'Unknown',
	RebootDelayed = 'RebootDelayed', // 1st priority
	RebootForced = 'RebootForced', // 2nd priority
	PowerOffForced = 'PowerOffForced', // 3rd priority
	RebootRequested = 'RebootRequested', // 4 priority and no need to show pop up before install
}
