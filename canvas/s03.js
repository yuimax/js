// s03.js

var s03 = (function() {

function animation()
{
	const g = get_canvas_context("img");
	const bgcolor = "#fafafa";
    clear(g, bgcolor);
	g.font = "12pt sans-serif";
	
	const stat_width = g.canvas.width;
	const stat_height = 20;
	const stat_x = 0;
	const stat_y = g.canvas.height - stat_height;

	const ball_width = 40;
	const ball_height = 30;
	const ball_xmin = 0;
	const ball_ymin = 0;
	const ball_xmax = g.canvas.width - ball_width;
	const ball_ymax = g.canvas.height - ball_height - stat_height;
	let ball_x = 0;
	let ball_y = 0;

	let stat_timing = timing_checker(500);
	let ball_timing = timing_checker(1000/30);	

	function draw_stat(text)
	{
		fillRect(g, stat_x, stat_y, stat_width, stat_height, "#d8d8d8");
		drawText(g, stat_x + 10, stat_y + 16, text);
	}

	function get_pos(tick, min, max)
	{
		let half = max - min;
		let span = half * 2;
		let pos = tick % span;
		return (pos < half) ? pos : (span - pos);
	}

	function draw_ball(msec)
	{
		let tick = Math.floor(msec / 5);
		let x = get_pos(tick, ball_xmin, ball_xmax);
		let y = get_pos(tick, ball_ymin, ball_ymax);
		if (x != ball_x || y != ball_y) {
			fillRect(g, ball_x, ball_y, ball_width, ball_height, bgcolor);
			ball_x = x;
			ball_y = y;
			fillRect(g, ball_x, ball_y, ball_width, ball_height, "blue");
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
		TIMER.start();
	}

	function on_stop()
	{
		let laptime = TIMER.stop();
		draw_ball(laptime);
		draw_stat('STOP');
	}

	ANIME.toggle(on_work, on_stop);
}

return { draw: animation }

})();
