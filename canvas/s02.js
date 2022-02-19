// s02.js

var s02 = (function() {

//=====================================================================
// 画像の表示
function draw_images()
{
    // アニメーション実行中なら停止
	ANIME.stop();

    // 画面クリア
	const g = get_canvas_context("img");
    clear(g, "#fafafa");

	// Imageデータの取得
	const img = IMAGES[0];

	// Imageデータをオリジナルサイズで描画
	drawImage(g, img, 0, 0);

	// Imageデータを拡大縮小して描画
	for (let i = 0; i < 3; i++) {
		let w = img.width * (i + 2) / 4;
		let h = img.height * (5 - i) / 4;
		let x = 144 + i * 32;
		let y = 16 + i * 64;
		drawImage(g, img, x, y, { width: w, height: h });
	}
}

// draw() を s02.draw() という名前で公開
return { draw: draw_images }

})();
