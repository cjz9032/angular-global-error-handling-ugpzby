window['_fs_debug'] = false;
window['_fs_host'] = 'fullstory.com';
window['_fs_script'] = 'edge.fullstory.com/s/fs.js';
window['_fs_org'] = '11WJMB';
window['_fs_namespace'] = 'FS';
(function (m, n, e, t, l, o, g, y) {
	var db, uuid;
	var DBOpenRequest = window.indexedDB.open('VantageExperience');
	DBOpenRequest.onsuccess = function (event) {
		db = DBOpenRequest.result;
		var transaction = db.transaction(['VantageExperience'], 'readwrite');
		var objectStore = transaction.objectStore('VantageExperience');

		var objectStoreRequest = objectStore.get('VantageExperienceCache');
		objectStoreRequest.onsuccess = function (event) {
			uuid = objectStoreRequest.result['[LocalStorageKey] LidUserFirstName'];
		};
	};

	if (e in m) {
		if (m.console && m.console.log) {
			m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');
		}
		return;
	}
	g = m[e] = function (a, b, s) {
		g.q ? g.q.push([a, b, s]) : g._api(a, b, s);
	};
	g.q = [];
	o = n.createElement(t);
	o.async = 1;
	o.crossOrigin = 'anonymous';
	o.src = 'https://' + _fs_script;
	y = n.getElementsByTagName(t)[0];
	y.parentNode.insertBefore(o, y);
	g.identify = function (i, v, s) {
		if (uuid) g(l, { uid: uuid }, s);
		else g(l, { uid: i }, s);
		if (v) g(l, v, s);
	};
	g.setUserVars = function (v, s) {
		g(l, v, s);
	};
	g.event = function (i, v, s) {
		g('event', { n: i, p: v }, s);
	};
	g.anonymize = function () {
		g.identify(!!0);
	};
	g.shutdown = function () {
		g('rec', !1);
	};
	g.restart = function () {
		g('rec', !0);
	};
	g.log = function (a, b) {
		g('log', [a, b]);
	};
	g.consent = function (a) {
		g('consent', !arguments.length || a);
	};
	g.identifyAccount = function (i, v) {
		o = 'account';
		v = v || {};
		v.acctId = i;
		g(o, v);
	};
	g.clearUserCookie = function () {};
	g.setVars = function (n, p) {
		g('setVars', [n, p]);
	};
	g._w = {};
	y = 'XMLHttpRequest';
	g._w[y] = m[y];
	y = 'fetch';
	g._w[y] = m[y];
	if (m[y])
		m[y] = function () {
			return g._w[y].apply(this, arguments);
		};
	g._v = '1.3.0';
})(window, document, window['_fs_namespace'], 'script', 'user');
