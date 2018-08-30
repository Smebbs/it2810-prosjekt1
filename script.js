$("document").ready(function() {
    let documentation = "#doc-layout, #doc-art, #doc-jquery, #doc-sources"
    $(documentation).hide();
    init()
    $("#btn-show").click(function() {
        if ($(documentation).is(":hidden")) {
            $(documentation).show();
        }
        else {
            $(documentation).hide();
        }
    });
});

// Content variables
let n_particles = 1000;
let padding = 20;
let w = 1400;
let h = 700;
let spacingX = w / Math.sqrt(n_particles) * 0.5;
let spacingY = h / Math.sqrt(n_particles);

// Mouse variables
let mouseX = 0;
let mouseY = 0;
let mouseDown = false;
let soi = 50; // Sphere of influence

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
        }
    }
}

Particle.prototype.draw = function() {
    context.beginPath();
    context.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    if (this.vx + this.vy != 0) {
        context.strokeStyle = "#8ad5d8"
    } else {
        context.strokeStyle = "#144149"; 
    }
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
