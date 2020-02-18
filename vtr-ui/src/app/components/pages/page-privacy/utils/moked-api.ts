if (!window['Windows']) {}
export const MockWindows = {
	Foundation: {
		Collections: {
			ValueSet: function () {
				this.insert = function () {
				};
			}
		}
	},
	ApplicationModel: {
		AppService: {
			AppServiceConnection: function AppServiceConnection() {
				this.openAsync = function () {
					return Promise.resolve(0);
				};
				this.sendMessageAsync = function () {
					return Promise.resolve({
						status: 0,
						message: {
							result: JSON.stringify({
								status: 0
							})
						}
					});
				};
			},
			AppServiceConnectionStatus: {
				success: 0
			},
			AppServiceResponseStatus: {
				status: 0
			}
		}
	},
	Security: {
		Credentials: {
			PasswordVault: function PasswordVault() {
				this.retrieve = function (resource, username) {
					const password = 'qwerty';
					return password;
				};
				this.add = function (credentials) {
				};
			},
			PasswordCredential: function PasswordCredential() {
			}
		}
	},
	Storage: {
		ApplicationData: {
			current: {
				localSettings: {
					values: {
						remove: function (key) {
							if (this[key]) {
								delete this[key];
							}
						}
					}
				}
			}
		}
	}
};
