const firebaseConfig = { databaseURL: "https://m-legacy-5cf2b-default-rtdb.firebaseio.com/" };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const vp = document.getElementById('pixel-viewport');
const cv = document.getElementById('mainCanvas');
const ctx = cv.getContext('2d');
cv.width = 5000; cv.height = 2000;
let scale = 0.25, pX = 0, pY = 0, isD = false, sX, sY;

// ফায়ার ইফেক্ট অ্যানিমেশন (পূর্বের কোড অনুযায়ী ফিক্সড)
const fCv = document.getElementById('fireCanvas');
const fCtx = fCv.getContext('2d');
fCv.width = window.innerWidth; fCv.height = 100;
let pt = [];
class P { constructor(x,y){this.x=x;this.y=y;this.s=Math.random()*4+1;this.o=1;this.c=`hsl(${Math.random()*25+10},100%,50%)`;} update(){this.y-=2;this.o-=0.03;} draw(){fCtx.globalAlpha=this.o;fCtx.fillStyle=this.c;fCtx.beginPath();fCtx.arc(this.x,this.y,this.s,0,Math.PI*2);fCtx.fill();} }
window.onmousemove=(e)=>{if(e.pageY<150)for(let i=0;i<3;i++)pt.push(new P(e.pageX, 80));};
function anim(){ fCtx.clearRect(0,0,fCv.width,100); pt.forEach((p,i)=>{p.update();p.draw();if(p.o<=0)pt.splice(i,1);}); requestAnimationFrame(anim); } anim();

// ম্যাপ মুভমেন্ট ও জুম ইন-আউট
function update() { document.getElementById('canvas-mover').style.transform = `translate(${pX}px, ${pY}px) scale(${scale})`; }
function drawGrid() {
    ctx.strokeStyle = "rgba(0, 0, 255, 0.4)";
    ctx.lineWidth = 0.8;
    for(let x=0;x<=5000;x+=10){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,2000);ctx.stroke();}
    for(let y=0;y<=2000;y+=10){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(5000,y);ctx.stroke();}
}
db.ref('pixels').on('value', s => { render(); let sold=0; const d=s.val(); if(d) Object.keys(d).forEach(k=>sold+=parseInt(d[k].pixelCount||0)); document.getElementById('pixel-count-display').innerText=sold.toLocaleString(); });
function render() { ctx.clearRect(0,0,5000,2000); drawGrid(); }

// জুম ইন-আউট লজিক (মাউস হুইল)
vp.onwheel = (e) => {
    e.preventDefault();
    const zoom = e.deltaY > 0 ? 0.9 : 1.1;
    scale = Math.min(Math.max(0.1, scale * zoom), 5);
    update();
};
vp.onmousedown = (e) => { isD = true; sX = e.clientX-pX; sY = e.clientY-pY; };
window.onmouseup = () => isD = false;
window.onmousemove = (e) => { if(isD){ pX = e.clientX-sX; pY = e.clientY-sY; update(); } };
update();
