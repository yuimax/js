// s01.js

var s01 = (function() {

function offset(degree, distance)
{
    let t = Math.PI / 180 * degree;
    let x = Math.sin(t) * distance;
    let y = - Math.cos(t) * distance;
    return [x, y];
}

function draw_shapes()
{
	ANIME.stop();

	const g = get_canvas_context("img");
    clear(g, "#fafafa");
	const small_font = "12pt sans-serif";
    const large_font = "15pt sans-serif";
    g.font = small_font;

	///////////////////////////////////////////////
	let [x, y] = [110, 170];
    drawCircle(g, x, y, 70, { width: 1.5, color: "#006000" });
    drawLine(g, x, y, x, y - 70, { width: 1.5, color: "#006000" });

	let [dx, dy] = offset(-5, 80);
    drawLine(g, x, y, x + dx, y + dy, { width: 3, color: "#f08080" });

    drawText(g, x - 70, 50, "rotation=0", { font: large_font });
    drawText(g, x - 70, 80, "angle: -5 [deg]");

	///////////////////////////////////////////////
	[x, y] = [280, 170];
    drawCircle(g, x, y, 70, { width: 1.5, color: "#006000" });
    drawLine(g, x, y, x, y - 70, { width: 1.5, color: "#006000" });

	[dx, dy] = offset(135, 80);
    drawLine(g, x, y, x + dx, y + dy, { width: 3, color: "#f08080" });

    drawText(g, x - 70, 50, "rotation=140", { font: large_font });
    drawText(g, x - 70, 80, "angle: 135 [deg]");
}

return { draw: draw_shapes };

})();
