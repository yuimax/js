// s03.js

var s03 = (function() {

// 開始時刻
let tick_start = 0;

// アニメーション
function animation()
{
	// 画面クリア
	const bgcolor = "#fafafa";
	const g = get_canvas_context("img");
    clear(g, bgcolor);
	g.font = "12pt sans-serif";
	
	// ステータス行の位置とサイズ
	const tbox_width = g.canvas.width;
	const tbox_height = 20;
	const tbox_x = 0;
	const tbox_y = g.canvas.height - tbox_height;

	// ボールの諸元
	const ball_width = 40;
	const ball_height = 30;
	const ball_xmin = 0;
	const ball_ymin = 0;
	const ball_xmax = g.canvas.width - ball_width;
	const ball_ymax = g.canvas.height - ball_height - tbox_height;
	let ball_x = 0;
	let ball_y = 0;

	// ステータス行の描画タイミング：500ミリ秒
	let stat_timing = timing_checker(500);

	// ボールの描画タイミング：(1000/30)ミリ秒 ←FPS=30
	let ball_timing = timing_checker(1000/30);	

	// １行テキスト表示
	function draw_stat(text)
	{
		fillRect(g, tbox_x, tbox_y, tbox_width, tbox_height, "#d8d8d8");
		drawText(g, tbox_x + 10, tbox_y + 16, text);
	}

	// tickから座標を得る
	function get_pos(tick, min, max)
	{
		let half = max - min;
		let span = half * 2;
		let pos = tick % span;
		return (pos < half) ? pos : (span - pos);
	}

	// tickの位置にボールを表示
	function draw_ball(tick)
	{
		let x = get_pos(tick, ball_xmin, ball_xmax);
		let y = get_pos(tick, ball_ymin, ball_ymax);
		if (x != ball_x || y != ball_y) {
			fillRect(g, ball_x, ball_y, ball_width, ball_height, bgcolor);
			ball_x = x;
			ball_y = y;
			fillRect(g, ball_x, ball_y, ball_width, ball_height, "blue");
		}
	}

	// 毎回の描画処理
	function on_work()
	{
		// ボールの描画タイミングがきたら描画
		ball_timing.check(function() {
			draw_ball(Math.floor(Date.now() / 5));
			FPS.check();
		});

		// ステータス行の描画タイミングがきたら描画
		stat_timing.check(function() {
			draw_stat('FPS=' + FPS.tostr(1) + " / 周期=" + FPS.msec(1) + "[ms]");
		});

		// 次回も実行する
		ANIME.restart();
	}

	// アニメ停止時の処理
	function on_stop()
	{
		draw_stat('STOP');
		draw_ball(0);
	}

	// 停止中なら実行、実行中なら停止する
	ANIME.toggle(on_work, on_stop);
}

// animation() を s03.draw() という名前で公開
return { draw: animation }

})();
