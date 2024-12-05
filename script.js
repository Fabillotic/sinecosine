let slider;
let lblsin;
let lblcos;
let lbltan;

let sx = 600;
let sy = 600;

var sm;

var circle_size;

var offset_graph;
var offset_circle;

var circle_center;
var circle_stickout;

var graph_y;

var graph_ymax = 2.0;
var graph_height;

function updateScale() {
	sm = min(sx, sy);
	offset_graph = sx / 10;
	offset_circle = sx / 25;
	circle_size = sm / 5;
	circle_center = offset_circle + circle_size;

	circle_stickout = sm / 50;

	graph_y = offset_circle + circle_size * 3.5;

	graph_height = circle_size;
}

function changeSize(_sx, _sy) {
	sx = _sx;
	sy = _sy;
	resizeCanvas(sx, sy);
	updateScale();
	sliderSetup();
}

function setup() {
	updateScale();

	let canvas = createCanvas(sx, sy);
	let originalParent = canvas.parent();
	canvas.parent("sketch");
	originalParent.remove();
	canvas.position(0, 0, "absolute");

	slider = createSlider(0, TAU, 0, 0);
	sliderSetup();

	lblsin = makeLabel("sin", "red");
	lblcos = makeLabel("cos", "blue");
	lbltan = makeLabel("tan", "orange");
}

function sliderSetup() {
	//slider.position(offset_graph, 0, "relative");
	slider.position(offset_graph, 0, "absolute");
	slider.style("width", (sx - (offset_graph * 2)) + "px");
}

function makeLabel(text, color) {
	lbl = createP(text);
	lbl.style("display", "none");
	lbl.addClass("lbltext");
	lbl.parent("sketch");
	if(color !== null) {
		lbl.style("color", color);
	}

	return lbl;
}

function moveLabel(lbl, x, y) {
	if(lbl !== null) {
		lbl.style("display", "inline");
		lbl.position(x, y, "absolute");
	}
}

function hideLabel(lbl, x, y) {
	if(lbl !== null) {
		lbl.style("display", "none");
	}
}

var x = 0;

function draw() {
	let ww = min(windowWidth, windowHeight);
	changeSize(ww, ww);
	let primary = 0;
	let secondary = 255;
	let tertiary = 240;
	if(!dark) {
		primary = 255;
		secondary = 0;
		tertiary = 20;
	}
	background(primary);
	noFill();
	stroke(secondary);

	let other_end = ((circle_size + circle_stickout) * 2) + circle_stickout;

	//Circle
	circle(circle_center, circle_center, circle_size * 2);
	line(circle_stickout, circle_center, other_end, circle_center);
	line(circle_center, circle_stickout, circle_center, other_end);

	let graph_length = sx - offset_graph;

	map_l = (x) => {return map(x, 0, TAU, offset_graph, graph_length)};

	//Long diagram line
	line(offset_graph - 2, graph_y, graph_length, graph_y);

	//Little x markers
	for (let i = HALF_PI; i < TAU + HALF_PI; i += HALF_PI) {
		let j = map_l(i - QUARTER_PI);
		line(j, graph_y - 5, j, graph_y + 5);
	}

	//Large x markers
	for (let i = HALF_PI; i < TAU; i += HALF_PI) {
		let j = map_l(i);
		line(j, graph_y - 10, j, graph_y + 10);
	}

	//y markers
	for (let i = -(graph_ymax - 1.0); i < graph_ymax; i += 1.0) {
		let j = graph_y - (graph_height / graph_ymax) * i;
		line(offset_graph - 2 - 5, j, offset_graph - 2 + 5, j);
	}

	x = slider.value();

	let c = map_l(x);
	let y_scale = -graph_height / graph_ymax;

	function drawGraph(f, lbl, red=0, green=255, blue=0, offset=1) {
		strokeWeight(2);
		stroke(red, green, blue);

		let gy = graph_y + f(x) * y_scale;
		if(gy >= graph_y - graph_height && gy <= graph_y + graph_height) {
			moveLabel(lbl, c + offset + 10, gy);
		}
		else {
			hideLabel(lbl);
		}

		gy = max(gy, graph_y - graph_height);
		gy = min(gy, graph_y + graph_height);
		line(c + offset, graph_y, c + offset, gy);

		let lx = map_l(0);
		let ly = graph_y;

		for(let i = 0; i < x; i += 0.01) {
			let tx = map_l(i);
			let ty = f(i) * y_scale + graph_y;
			if(ty < graph_y - graph_height || ty > graph_y + graph_height) {
				lx = tx;
				ly = ty;
				continue;
			}
			line(tx, ty, lx, ly);
			lx = tx;
			ly = ty;
		}
		strokeWeight(1);
	}

	drawGraph(sin, lblsin, red=255, green=0, blue=0, offset=-1)
	drawGraph(cos, lblcos, red=0, green=0, blue=255, offset=0)
	drawGraph(tan, lbltan, red=255, green=165, blue=0, offset=-2)

	let px = cos(x) * circle_size + circle_center;
	let py = sin(x) * -circle_size + circle_center;
	let oy = tan(x) * -circle_size + circle_center;
	let oy_vis = oy <= circle_center + circle_size * 1.5 &&
		oy >= circle_center - circle_size * 1.5;

	//Triangle
	strokeWeight(2);
	if(oy_vis) {
		stroke(255, 165, 0);
		line(circle_center, circle_center, circle_center + circle_size, oy);
	}
	stroke(tertiary);
	line(circle_center, circle_center, px, py);

	stroke(255, 0, 0);
	line(px, circle_center, px, py);

	stroke(0, 0, 255);
	line(circle_center, circle_center, px, circle_center);

	if(oy_vis) {
		stroke(255, 165, 0);
		line(circle_center + circle_size, circle_center,
			circle_center + circle_size, oy);
	}

	//"Point"
	noStroke();

	if(oy_vis) {
		fill(255, 165, 0);
		circle(circle_center + circle_size, oy, 10);
	}

	fill(tertiary);
	circle(px, py, 10);

	noFill();

	//Triangle angle
	stroke(tertiary);
	arc(circle_center, circle_center, circle_size / 2, circle_size / 2, -x, 0);

	//y axis
	strokeWeight(1);
	stroke(secondary);
	line(offset_graph - 2, graph_y - graph_height, offset_graph - 2, graph_y + graph_height);
}
