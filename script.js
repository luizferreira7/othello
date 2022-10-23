
function montarTabuleiro() {

    canvas = document.getElementById("tabuleiro");

    canvas.width = '640';
    canvas.height = '640';
    canvas.style.backgroundColor = '#00bc8c';
    canvas.style.border = '10px solid black'

    ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#4F4F4F';
    ctx.lineWidth = 1.5;
          

    for (let i = 1; i < 8; i++) {
        var x = 80*i;
        ctx.moveTo(x,640);
        ctx.lineTo(x,0);
        }
    for (let i = 1; i < 8; i++) {
        var y = 80*i;
        ctx.moveTo(640,y);
        ctx.lineTo(0,y);
        }

    ctx.stroke();


    for (var i = 1; i < 5; i++) {
        let x = 160;
        let y = 160;

        if (i === 4) {
            x *= i-1;
            y *= i-1;
        }

        else if (i%2 === 0) {
            x *= i+1;
        } else {
            y *= i;
        }

        ctx.beginPath();
        ctx.arc(x,y,5,0,2*Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
    }

    // peças iniciais do jogo 

    adicionarPeca('white',280,280);
    adicionarPeca('black',360,280);
    adicionarPeca('black',280,360);
    adicionarPeca('white',360,360);
          
}

function adicionarPeca(cor, x, y) {
    ctx.beginPath();
    ctx.arc(x,y,35,0,2*Math.PI);
    ctx.stroke();
    ctx.fillStyle = cor;
    ctx.fill();
}

window.onload=function(){
    montarTabuleiro();
};