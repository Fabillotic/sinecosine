let slider;

let sx = 600;
let sy = 600;

var sm;

var circle_size;

var offset_graph;
var offset_circle;

var circle_center;
var circle_stickout;

var graph_y;

var graph_height;

function updateScale() {
    sm = min(sx, sy);
    offset_graph = sx / 10;
    offset_circle = sx / 25;
    circle_size = sm / 5;
    circle_center = offset_circle + circle_size;

    circle_stickout = sm / 50;

    graph_y = offset_circle + circle_size * 3;

    graph_height = circle_size / 2;
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
    createCanvas(sx, sy);
    slider = createSlider(0, TAU, 0, 0);
    sliderSetup();
}

function sliderSetup() {
    slider.position(offset_graph, 0, "relative");
    slider.style("width", (sx - (offset_graph * 2)) + "px");
}

var x = 0;
//var isdown = false; //invisible slider variable

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
    
    //Little markers
    for (let i = HALF_PI; i < TAU + HALF_PI; i += HALF_PI) {
        let j = map_l(i - QUARTER_PI);
        line(j, graph_y - 5, j, graph_y + 5);
    }
    
    //Little markers
    for (let i = HALF_PI; i < TAU; i += HALF_PI) {
        let j = map_l(i);
        line(j, graph_y - 10, j, graph_y + 10);
    }
    
    x = slider.value();
    /* Invisible slider
    if(isdown || (mouseIsPressed && mouseX > offset_graph && mouseX < graph_length && mouseY > graph_y - graph_height && mouseY < graph_y + graph_height)) {
        isdown = true;
        x = map(mouseX, offset_graph, graph_length, 0, TAU, true);
    }
    if(!mouseIsPressed) {
        isdown = false;
    }
    */
    
    let c = map_l(x);
    let v = sin(x) * -graph_height + graph_y;
    let w = cos(x) * -graph_height + graph_y;
    
    //sin, cos line

    function drawGraph(f, red=0, green=255, blue=0, offset=1) {
        strokeWeight(2);
        stroke(red, green, blue);
        line(c + offset, graph_y, c + offset, f(x) * -graph_height + graph_y);
        
        let lx = map_l(0);
        let ly = graph_y;
        
        for(let i = 0; i < x; i += 0.01) {
            let tx = map_l(i);
            let ty = f(i) * -graph_height + graph_y;
            line(tx, ty, lx, ly);
            lx = tx;
            ly = ty;
        }
        strokeWeight(1);
    }
    
    drawGraph(sin, red=255, green=0, blue=0, offset=-1)
    drawGraph(cos, red=0, green=0, blue=255, offset=0)
    
    //"Point"
    noStroke();
    fill(tertiary);
    
    let px = cos(x) * circle_size + circle_center;
    let py = sin(x) * -circle_size + circle_center;
    
    circle(px, py, 10);
    
    //Triangle
    noFill();
    stroke(tertiary);
    strokeWeight(2);
    line(circle_center, circle_center, px, py);
    
    stroke(255, 0, 0);
    line(px, circle_center, px, py);
    
    stroke(0, 0, 255);
    line(circle_center, circle_center, px, circle_center);
    
    //Triangle angle
    stroke(tertiary);
    arc(circle_center, circle_center, circle_size / 2, circle_size / 2, -x, 0);
    
    //y axis
    strokeWeight(1);
    stroke(secondary);
    line(offset_graph - 2, graph_y - graph_height, offset_graph - 2, graph_y + graph_height);
}
