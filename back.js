window.addEventListener("load", () => {
  "use strict";

  const canvas = document.getElementById("back");
  const ctx = canvas.getContext("2d");
  let fc = 0;

  const mod = (a, b) => (a % b + b) % b;
  const pdist = (x1, y1, x2, y2) => (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);

  class gear{
    static translateY = 0;
    constructor(x, y, r, s, off = 0){
      this.x = x;
      this.y = y;
      this.r = r;
      this.s = s;
      this.off = off;
      this.inc = 2 * Math.PI / Math.round(0.15 * (1.05 * this.r + 5));
    }
    run(){
      ctx.translate(this.x, this.y + gear.translateY);
     
      ctx.lineWidth = this.r * 0.1;
     
      ctx.beginPath();
      ctx.arc(0, 0, this.r, 0, 2 * Math.PI);
     
      ctx.stroke();
      
      ctx.rotate(0.01 * fc * this.s + this.off);
      ctx.strokeRect(-3, -this.r, 6, 2 * this.r);
      
      for(let i = 0; i < 2 * Math.PI; i += this.inc){
        ctx.rotate(this.inc);
        ctx.strokeRect(this.r, -5, 10, 10);
      }
      
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    static fromGear(g, a, d){
      let dist = (1.05 * d + 5) + (1.05 * g.r + 5);
      let x = g.x + Math.cos(a) * dist;
      let y = g.y + Math.sin(a) * dist;
     
      let ge = new gear(x, y, d, 0);
      
      ge.s = -g.s * ge.inc / g.inc;
      ge.off = Math.PI + a + (a - g.off) * ge.inc / g.inc + ge.inc / 2;
      
      return ge;
    }
  }

  let gears = [[], []];

  gears[0].push(new gear(700, 300, 50, 0.75));
  gears[1].push(new gear(300, 300, 75, 1.5));

  for(let g = 0; g < gears.length; g++){
    for(let i = 0; i < 1e3; i++){
      const rdmx = Math.random() * 1050 - 25;
      const rdmy = ((0.2 + 0.2 * g) * (document.body.scrollHeight / canvas.clientHeight) + 1) * (Math.random() * 1050 - 25) * canvas.clientHeight / canvas.clientWidth;
      
      let closest = [0, Infinity];
      for(let j = 0; j < gears[g].length; j++){
        let d = pdist(gears[g][j].x, gears[g][j].y, rdmx, rdmy) - 4 * gears[g][j].r * gears[g][j].r;
        if(d < closest[1]){
          closest[0] = j;
          closest[1] = d;
        }
      }
      
      closest[1] **= 0.5;
      if(closest[1] > 140 + 35 * g){
        closest[1] -= 100;
        let ang = Math.atan2(rdmy - gears[g][closest[0]].y, rdmx - gears[g][closest[0]].x);
        gears[g].push(gear.fromGear(gears[g][closest[0]], ang, Math.min(closest[1], 40 + 35 * g + (25 + 10 * g) * Math.random())));
      }
    }
  }

  const draw = () => {
    
    canvas.width = 1000;
    canvas.height = 1000 * canvas.clientHeight / canvas.clientWidth;
   
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
   
    ctx.fillStyle = "orange";
    //ctx.fillRect(Math.random() * (canvas.width - 100), Math.random() * (canvas.height - 100), 100, 100);
    
    let scrolled = 
      window.pageYOffset || 
      document.documentElement.scrollTop || 
      document.body.scrollTop ||
      0;
    
    gear.translateY = -scrolled * 0.2;
    ctx.strokeStyle = "#1A0600";
    for(let i = 0; i < gears.length; i++){
      for(let j = 0; j < gears[i].length; j++){
        gears[i][j].run();
      }
      gear.translateY = -scrolled * 0.4;
      ctx.strokeStyle = "#2C0C00";
    }
   
    fc ++;
    window.requestAnimationFrame(draw);
  };

  window.requestAnimationFrame(draw);
});
