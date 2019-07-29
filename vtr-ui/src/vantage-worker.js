if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register("/ngsw-worker.js").then(registration => {
		console.log("success!");
		if (registration.installing) {
			registration.installing.postMessage("sw installed");
		}
	}, err => {
		console.error("sw installation failed!", err);
	});
}
