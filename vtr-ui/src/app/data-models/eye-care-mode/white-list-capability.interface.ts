// export interface WhiteListCapability {
// 	"NotSupport": Do not support ECM, remove the feature and reset all data.
// 	"NotAvailable": Support but the driver is uninstalled or disabled, hide the UI but do not reset data.
// 	"Support": Support the feature, display the UI just as before.
// }
export type WhiteListCapability = 'NotSupport' | 'NotAvailable' | 'Support';
