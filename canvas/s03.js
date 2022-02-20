// s03.js

var s03 = (function() {

function animation()
{
	const g = get_canvas_context("img");
    clear(g, "#fafafa");
	g.font = "12pt sans-serif";

	const stat_height = 20;
	const stat = {
		x:      0,
		y:      g.canvas.height - stat_height,
		width:  g.canvas.width,
		height: stat_height,
	};

	const ball_width = 40;
	const ball_height = 30;
	const ball = {
		x:      0,
		y:      0,
		width:  ball_width,
		height: ball_height,
		xmin:   0,
		ymin:   0,
		xmax:   g.canvas.width - ball_width,
		ymax:   g.canvas.height - ball_height - stat_height,
	}

	const stat_timing = timing_checker(500);
	const ball_timing = timing_checker(1000/30);	

	function draw_stat(text)
	{
		fillRect(g, stat.x, stat.y, stat.width, stat.height, "#d8d8d8");
		drawText(g, stat.x + 10, stat.y + 16, text);
	}

	function get_pos(tick, min, max)
	{
		let half = max - min;
		let span = half * 2;
		let pos = tick % span;
		return (pos < half) ? pos : (span - pos);
	}

	function draw_ball(msec, force_flag = false)
	{
		let tick = Math.floor(msec / 5);
		let x = get_pos(tick, ball.xmin, ball.xmax);
		let y = get_pos(tick, ball.ymin, ball.ymax);

		if (x != ball.x || y != ball.y || force_flag) {
			fillRect(g, ball.x, ball.y, ball.width, ball.height, "#fafafa");
			ball.x = x;
			ball.y = y;
			fillRect(g, ball.x, ball.y, ball.width, ball.height, "#0000ff");
		}
	}

	function on_work()
	{
		let laptime = TIMER.laptime();
		ball_timing.check(function() {
			draw_ball(laptime);
			FPS.check();
		});

		stat_timing.check(function() {
			draw_stat('FPS=' + FPS.tostr(1) + " / TimeSpan=" + FPS.msec(1) + "[ms]");
		});
		ANIME.restart();
	}

	function on_stop()
	{
		let laptime = TIMER.stop();
		draw_stat('STOP');
		draw_ball(laptime, true);
	}

	TIMER.start();
	ANIME.toggle(on_work, on_stop);
}

function reset_timer()
{
	TIMER.clear();
	if (!ANIME.alive) {
		const g = get_canvas_context("img");
		clear(g, "#fafafa");
	}
}

return { draw: animation, reset: reset_timer };

})();
