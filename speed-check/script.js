let break_flag = false;

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

async function start()
{
	const url = "../lib/" + (file.value ?? "gentleman") + ".mp4";
	const result = [];

	bstart.disabled = true;
	bstop.disabled = false;
	break_flag = false;
	log.value = url + "\n";
	log.value += "-".repeat(22) + "\n";

	const N = 10;
	for (let i = 1; i <= N; i++) {
		await new Promise((ok, ng) => {
			download(url, ok, ng);
		})
		.then((megabps) => {
			log.value += `${i}/${N}: ${megabps.toFixed(2)} [Mbps]\n`;
			result.push(megabps);
		})
		.catch((error_message) => {
			log.value += error_message + "\n";
		});
		if (break_flag) {
			log.value += "stopped by user.\n";
			break;
		}
	}

	log.value += "-".repeat(22) + "\n";
	result.sort();
	if (result.length >= 3) {
		result.pop();
		result.shift();
		log.value += "excluding max and min.\n";
	}
	if (result.length > 0) {
		let ave = result.reduce((x, y) => x + y) / result.length;
		log.value += "average " + ave.toFixed(2) + " [Mbps]\n";
	}

	bstop.disabled = true;
	bstart.disabled = false;
	break_flag = false;
}

function stop()
{
	bstop.disabled = true;
	break_flag = true;
}

function init()
{
	vid.selectedIndex = 0;
	bstart.disabled = false;
	bstop.disabled = true;
}
