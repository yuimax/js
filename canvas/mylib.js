function getOffset(degree, distance)
{
    let t = Math.PI / 180 * degree;
    let x = Math.sin(t) * distance;
    let y = - Math.cos(t) * distance;
    return [x, y];
}

function get_canvas(id)
{
	return document.querySelector("canvas#" + id);
}

function get_canvas_context(id)
{
	return get_canvas(id).getContext("2d");
}

function fillRect(g, x, y, width, height, color)
{
    g.save();
    g.fillStyle = color;
    g.fillRect(x, y, width, height);
    g.restore();
}

function drawCircle(g, x, y, radius, options)
{
    if (options == null) {
        g.beginPath();
        g.arc(x, y, radius, 0, Math.PI * 2, true);
        g.stroke();
    }
    else {
        g.save();
        if ('color' in options) { g.strokeStyle = options.color; }
        if ('width' in options) { g.lineWidth = options.width; }
        g.beginPath();
        g.arc(x, y, radius, 0, Math.PI * 2, true);
        g.stroke();
        g.restore();
    }
}

function drawLine(g, x1, y1, x2, y2, options)
{
    if (options == null) {
        g.beginPath();
        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
        g.stroke();
    }
    else {
        g.save();
        if ('color' in options) { g.strokeStyle = options.color; }
        if ('width' in options) { g.lineWidth = options.width; }
        g.beginPath();
        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
        g.stroke();
        g.restore();
    }
}

function drawImage(g, img, x, y, options)
{
    if (options == null) {
        g.drawImage(img, x, y);
    }
    else {
        let aspect = (img.height == 0) ? 1 : (img.width / img.height);
        if ('width' in options) {
            if ('height' in options) {
                g.drawImage(img, x, y, options.width, options.height);
            } else {
                g.drawImage(img, x, y, options.width, options.width / aspect);
            }
        } else {
            if ('height' in options) {
                g.drawImage(img, x, y, options.height * aspect, options.height);
            } else {
                g.drawImage(img, x, y);
            }
        }
    }
}

function drawText(g, x, y, text, options)
{
    function drawLines(g, x, y, text, height = 20)
    {
        g.beginPath();
        for (let str of text.split("\n")) {
            g.fillText(str, x, y);
            y += height;
        }
        g.stroke();
    }

    if (options == null) {
        drawLines(g, x, y, text);
    }
    else {
        g.save();
        if ('font' in options) { g.font = options.font; }
        if ('color' in options) { g.fillStyle = options.color; }
        if ('align' in options) { g.textAlign = options.align; }
        drawLines(g, x, y, text, options.height);
        g.restore();
    }
}

function clear(g, color)
{
    fillRect(g, 0, 0, g.canvas.width, g.canvas.height, color);
}

function create_imagelist()
{
	const my_images = [];
	let my_loading = 0;

	function load_images(urls, callback)
	{
		if (++my_loading >= 2) {
			window.setTimeout(load_images, 100, urls, callback);
			--my_loading;
			return;
		}

		urls ??= [];
		callback ??= function() {};

		if (urls.length == 0) {
			callback();
			--my_loading;
			return;
		}

		let n = 0;
		function checker() {
			if (++n >= urls.length) {
				callback();
				--my_loading;
			}
		}

		for (let url of urls) {
			const img = new Image();
			my_images.push(img);
			img.onload = checker;
			img.onerror = checker;
			img.src = url;
		}
	}

	my_images.load = load_images;

	return my_images;
}

function fps_checker()
{
	const my_size = 30;
	const my_buf = new Array(my_size);
	my_buf.fill(0);
	let my_idx = 0;
	let my_fps = 0;

	function my_check()
	{
		let time = my_buf[my_idx] = Date.now();
		if (++my_idx >= my_size) {
			my_idx = 0;
		}
		let span = (time - my_buf[my_idx]) / (my_size - 1);
		if (span < 1) {
			span = 1;
		}
		my_fps = 1000 / span;
		return my_fps;
	}
	
	function my_tostr(n)
	{
		return my_fps.toFixed(n);
	}

	function my_msec(n)
	{
		if (my_fps < 1)
			return "***";
		else
			return (1000 / my_fps).toFixed(n);
	}

	return {
		check: my_check,
		tostr: my_tostr,
		msec:  my_msec,
	};

}

function anime_handler()
{
	let my_id = 0;
	let my_work_job = function() {};
	let my_stop_job = function() {};
	let my_alive = false;

	function my_start(on_work, on_stop)
	{
		my_id = window.requestAnimationFrame(on_work);
		my_work_job = on_work;
		my_stop_job = on_stop;
		my_alive = true;
	}

	function my_stop()
	{
		window.cancelAnimationFrame(my_id);
		my_stop_job();
		my_alive = false;
	}

	function my_toggle(on_work, on_stop)
	{
		if (my_alive)
			my_stop();
		else
			my_start(on_work, on_stop);
	}

	function my_restart()
	{
		my_start(my_work_job, my_stop_job);
	}

	return {
		start:   my_start,
		stop:    my_stop,
		toggle:  my_toggle,
		restart: my_restart,
	};
}

function timing_checker(wait)
{
	let my_time = 0;
	let my_wait = wait;

	function my_check(callback)
	{
		let n = Math.floor((Date.now() - my_time) / my_wait);
		if (n > 0) {
			callback();
			my_time += my_wait * n;
		}
		return n;
	}

	return	{
		check: my_check,
	};
}

const IMAGES = create_imagelist();
const FPS = fps_checker();
const ANIME = anime_handler();

function init()
{
	const g = get_canvas_context("img");
    clear(g, "#fafafa");
	const urls = [
		'../lib/banzai.png',
	];
	IMAGES.load(urls, function() {
		for (let btn of document.querySelectorAll('button')) {
			btn.disabled = false;
		}
	});
}
