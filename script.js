$("document").ready(function() {
    // Set up documentation
    let documentation = "#doc-layout, #doc-art, #doc-jquery, #doc-testing, #doc-sources"
    $(documentation).hide();
    $("#btn-show").click(function() {
        if ($(documentation).is(":hidden")) {
            $(documentation).show();
        }
        else {
            $(documentation).hide();
        }
        window.scrollTo(0, document.body.scrollHeight * 0.3);
    });

    // Init the canvas
    init()

    // Set up the tool button
    $("#text-tool").click(function() {
        console.log(tool)
        tool = !tool
    })
});

// Content variables
let n_particles = 1000;
let padding = 20;
let w = 1400;
let h = 700;
let spacingX = w / Math.sqrt(n_particles) * 0.5;
let spacingY = h / Math.sqrt(n_particles);
let tool = 0 // 0 = circles, 1 = squares

// Mouse variables
let mouseX = 0;
let mouseY = 0;
let mouseDown = false;
let soi = 35; // Sphere of influence

// Canvas variables
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame || window.oRequestAnimationFrame || 
    window.msRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

let Particle = function(x, y) {
    this.x = x; // X position
    this.y = y; // Y position
    this.vx = 0; // X velociy
    this.vy = 0; // Y velociy
    this.radius = 7;
    this.color = "#144149"
    this.shape = 0 // 0 = circles, 1 = squares
}

Particle.prototype.update = function (){
    this.x += this.vx
    this.y += this.vy

    let friction = 1
    if (Math.abs(this.vx) > friction) {
        this.vx -= Math.sign(this.vx) * friction
    } else {
        this.vx = 0
    }

    if (Math.abs(this.vy) > friction) {
        this.vy -= Math.sign(this.vy) * friction
    } else {
        this.vy = 0
    }

    if (mouseDown) {
        dX = this.x - mouseX;
        dY = this.y - mouseY;
        distance = Math.sqrt(dX*dX + dY*dY);
        angle = Math.atan2(this.y - mouseY, this.x - mouseX);

        if (distance < soi) {
            this.vx = Math.cos(angle) * (soi - distance) * 0.2;
            this.vy = Math.sin(angle) * (soi - distance) * 0.2;
            this.radius += 1
            if (!tool) this.color = "#3f7c9d"; else this.color = "#97cfca"
            this.shape = tool
        }
    }
}

Particle.prototype.draw = function() {
    context.beginPath();
    if (this.radius >= 20) {
        this.radius = 20
    }
    if (!this.shape) {
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    } else {
        context.rect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2)
    }
    context.strokeStyle = this.color
    context.stroke();
}

let Particles = function() {
    this.particleList = [];

    x = padding;
    while (x < w - padding + 5) {
        y = padding
        while (y < h - padding + 5) {
            particle = new Particle();
            particle.x = x;
            particle.y = y;
            this.particleList.push(particle);
            y += spacingY;
        }
        x += spacingX;
    }
}

Particles.prototype.update = function() {
    let i = this.particleList.length;
    while (i--) this.particleList[i].update();
}

Particles.prototype.draw = function() {
    let i = this.particleList.length;
    while (i--) this.particleList[i].draw();
}

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    particles.update();
    particles.draw();
    requestAnimFrame(update);
}

function init() {
    canvas.onmousedown = function (e) {
        var rect      = canvas.getBoundingClientRect();
        mouseX       = e.clientX - rect.left,
        mouseY       = e.clientY - rect.top,
        mouseDown    = true;
        e.preventDefault();
    };

    canvas.onmouseup = function (e) {
        mouseDown = false;
        e.preventDefault();
    };

    canvas.onmousemove = function (e) {
        var rect  = canvas.getBoundingClientRect();
        mouseX   = e.clientX - rect.left,
        mouseY   = e.clientY - rect.top,
        e.preventDefault();
    };

    particles = new Particles();
    update();
}
