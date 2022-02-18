function download(url, ok, ng)
{
	let start_time = Date.now();
	let next_sec = 0;

	function on_load_start(e) {
		progress.value = "";
		time.value = "";
	}

	function on_progress(e) {
		let sec = (Date.now() - start_time) / 1000;
		if (sec >= next_sec) {
			progress.value = e.loaded + "/" + e.total;
			time.value = sec.toFixed(3) + " [sec]";
			next_sec += 0.25;
		}
	}

	function on_loadend(e) {
		let sec = (Date.now() - start_time) / 1000;
		progress.value = e.loaded + "/" + e.total;
		time.value = sec.toFixed(3) + " [sec]";

		let xhr = e.target;
		let st = (xhr.status != 0) ? (xhr.status + " " + xhr.statusText) : "error";
		stat.value = st;

		if (xhr.status == 200) {
			let megabps = e.loaded * 8 / sec / (1024 * 1024);
			ok(megabps);
		}
		else {
			ng(st);
		}
	}

	const xhr = new XMLHttpRequest();
	xhr.responseType = "arraybuffer";
	xhr.onloadstart = on_load_start;
	xhr.onprogress = on_progress;
	xhr.onloadend = on_loadend;
	xhr.open("GET", url, true);
	xhr.setRequestHeader("Pragma", "no-cache"); // HTTP/1.0
	xhr.setRequestHeader("Cache-Control", "no-cache"); // HTTP/1.1
	xhr.setRequestHeader("If-Modified-Since", "Thu, 01 Jun 1970 00:00:00 GMT"); // IE
	xhr.send(null);
}

async function test()
{
	const url = "../lib/gentleman.mp4";
	const result = [];

	bstart.disabled = true;
	log.value = url + "\n";

	for (let i = 0; i < 10; i++) {
		await new Promise((ok, ng) => {
			download(url, ok, ng);
		})
		.then((megabps) => {
			log.value += megabps.toFixed(2) + " [Mbps]\n";
			result.push(megabps);
		})
		.catch((error_message) => {
			log.value += error_message + "\n";
		});
	}

	log.value += "-".repeat(20) + "\n";
	result.sort();
	if (result.length >= 3) {
		result.pop();
		result.shift();
		log.value += "except for min and max.\n";
	}
	if (result.length > 0) {
		let ave = result.reduce((x, y) => x + y) / result.length;
		log.value += "ave=" + ave.toFixed(2) + " [Mbps]\n";
	}

	bstart.disabled = false;
}

function init()
{
	log.value = "";
	progress.value = "";
	time.value = "";
	stat.value = "";
	bstart.disabled = false;
}
