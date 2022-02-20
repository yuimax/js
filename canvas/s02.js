// s02.js

var s02 = (function() {

function draw_images()
{
	ANIME.stop();

	const g = get_canvas_context("img");
    clear(g, "#fafafa");

	const img = IMAGES[0];
	drawImage(g, img, 0, 0);

	for (let i = 0; i < 3; i++) {
		let w = img.width * (i + 2) / 4;
		let h = img.height * (5 - i) / 4;
		let x = 144 + i * 32;
		let y = 16 + i * 64;
		drawImage(g, img, x, y, { width: w, height: h });
	}
}

return { draw: draw_images }

})();
