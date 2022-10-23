let tabuleiro = [];
jogadorAtual = 0;
let intX;
let intY;

function preencheTabuleiro() {
    for (let i = 0; i < 8; i++) {
        tabuleiro.push([]);
        for (let j = 0; j < 8; j++) {
            tabuleiro[i].push('X');
        }
    }
    tabuleiro[3][3] = 'B';
    tabuleiro[4][4] = 'B';
    tabuleiro[3][4] = 'P';
    tabuleiro[4][3] = 'P';
}

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

function jogadaValida(x, y) {
    intX = Math.floor(x/80);
    intY = Math.floor(y/80);

    if (x % 80 <= (intX + 0.1) || y % 80 <= (intY + 0.1)) {
        return false;
    }

    if (tabuleiro[intX][intY] !== 'X') {
        return false;
    }

    let pecaJogador = 'P';

    if (jogadorAtual % 2 !== 0) {
        pecaJogador = 'B';
    }

    if (tabuleiro[intX+1][intY] === 'X' && tabuleiro[intX-1][intY] === 'X' &&
        tabuleiro[intX][intY+1] === 'X' && tabuleiro[intX][intY-1] === 'X' && 
        tabuleiro[intX+1][intY+1] === 'X' && tabuleiro[intX-1][intY-1] === 'X' &&
        tabuleiro[intX+1][intY+1] === 'X' && tabuleiro[intX-1][intY-1] === 'X') {
        return false;
    }

    let podeJogar = verificaPecaAoLado(pecaJogador);

    if (typeof podeJogar !== 'boolean') {
        podeJogar = true;
    } 
    
    return podeJogar;
}

function verificaPecaAoLado(peca) {
    if (tabuleiro[intX+1][intY] !== peca && tabuleiro[intX+1][intY] !== 'X') {
        return (intX+1, intY);
    } 
    if (tabuleiro[intX-1][intY] !== peca && tabuleiro[intX-1][intY] !== 'X') {
        return (intX-1, intY);
    } 
    if (tabuleiro[intX][intY+1] !== peca && tabuleiro[intX][intY+1] !== 'X') {
        return (intX, intY+1);
    }
    if (tabuleiro[intX][intY-1] !== peca && tabuleiro[intX][intY-1] !== 'X') {
        return (intX, intY-1);
    }
    if (tabuleiro[intX+1][intY+1] !== peca && tabuleiro[intX+1][intY+1] !== 'X') {
        return (intX+1, intY+1);
    }
    if (tabuleiro[intX-1][intY-1] !== peca && tabuleiro[intX-1][intY-1] !== 'X') {
        return (intX-1, intY-1);
    }
    if (tabuleiro[intX+1][intY-1] !== peca && tabuleiro[intX+1][intY-1] !== 'X') {
        return (intX+1, intY-1);
    }
    if (tabuleiro[intX-1][intY+1] !== peca && tabuleiro[intX-1][intY+1] !== 'X') {
        return (intX-1, intY+1);
    }
    return false;
}

function jogada(cor, x, y) {
    if (jogadaValida(x,y)) {
        marcaTabuleiro(cor, intX, intY);

        let cX = 40 + (intX * 80);
        let cY = 40 + (intY * 80);
    
        adicionarPeca(cor, cX, cY);
    
        jogadorAtual += 1;
    }
}

function marcaTabuleiro(cor, x,y) {
    let peca;
    if (cor === 'black') {
        peca = 'P';
    } else {
        peca = 'B';
    }
    tabuleiro[x][y] = peca;
}

function iniciaJogo(elementHide, elementShow) {
    montarTabuleiro();
    elementHide.style.display = 'none';
    elementShow.style.display = 'flex';
    preencheTabuleiro();

    canvas.addEventListener('click', function(event) {
        x = event.offsetX;
        y = event.offsetY;
        jogada(jogadorAtual % 2 === 0 ? 'black' : 'white', x, y);
    });
}

window.onload=function(){
    let btnMaquina = document.getElementById("modoMaquina");
    let btnPlay = document.getElementById("modoJogador");
    let divBotoes = document.getElementById("divBotoes");
    let divPontuacao = document.getElementById("pontuacao");
    let jogadorMaquina = document.getElementById("jogadorMaquina");

    btnMaquina.addEventListener("click", () => {
        iniciaJogo(divBotoes, divPontuacao);
        jogadorMaquina.innerHTML = 'Maquina';
    });
    
    btnPlay.addEventListener("click", () => {
        iniciaJogo(divBotoes, divPontuacao);
    });
};