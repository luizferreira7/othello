let tabuleiro = [];
jogadorAtual = 0;

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

function updateTabuleiro() {
    montarTabuleiro();
    for (let i = 0; i < tabuleiro.length; i++) {
        for (let j = 0; j < tabuleiro[i].length; j++) {
            if (tabuleiro[i][j] !== 'X') {
                let cor = 'white';
                if (tabuleiro[i][j] === 'P') {
                    cor = 'black'
                }
                adicionarPeca(cor, i*80 + 40, j*80 + 40);
            }
        }
    }
}

function adicionarPeca(cor, x, y) {
    ctx.beginPath();
    ctx.arc(x,y,35,0,2*Math.PI);
    ctx.stroke();
    ctx.fillStyle = cor;
    ctx.fill();
}

function getJogadasValidas() {
    let peca = 'P';

    if (jogadorAtual % 2 !== 0) {
        peca = 'B';
    }

    let jogadas = [];

    for (let i = 0; i < tabuleiro.length; i++) {
        for (let j = 0; j < tabuleiro[i].length; j++) {
            if (jogadaValida(peca, i, j)) {
                jogadas.push({x: i, y: j})
            }
        }
    }

    return jogadas;
}

function jogadaValida(peca, intX, intY) {
    if (tabuleiro[intX][intY] !== 'X') {
        return false;
    }

    if (tabuleiro[intX+1] !== undefined && tabuleiro[intX+1][intY] !== peca && tabuleiro[intX+1][intY] !== 'X') {
        for(let i = intX+1; i < 8; i++) {
            if (tabuleiro[i][intY] === peca) {
                return true;
            }
        }
    }

    if (tabuleiro[intX-1] !== undefined && tabuleiro[intX-1][intY] !== peca && tabuleiro[intX-1][intY] !== 'X') {
        for(let i = intX-1; i > 0; i--) {
            if (tabuleiro[i][intY] === peca) {
                return true;
            }
        }
    } 

    if (tabuleiro[intX][intY+1] !== undefined && tabuleiro[intX][intY+1] !== peca && tabuleiro[intX][intY+1] !== 'X') {
        for(let i = intY+1; i < 8; i++) {
            if (tabuleiro[intX][i] === peca) {
                return true;
            }
        }
    }

    if (tabuleiro[intX][intY-1] !== undefined && tabuleiro[intX][intY-1] !== peca && tabuleiro[intX][intY-1] !== 'X') {
        for(let i = intY-1; i > 0; i--) {
            if (tabuleiro[intX][i] === peca) {
                return true;
            }
        }
    }

    if (tabuleiro[intX+1] !== undefined && tabuleiro[intX+1][intY+1] !== undefined && 
        tabuleiro[intX+1][intY+1] !== peca && tabuleiro[intX+1][intY+1] !== 'X') {
                    
        let fim = (8 - (intX+1)) < (8 - (intY+1)) ? (8 - (intX+1)) : (8 - (intY+1)) ;
        for(let i = 2; i < fim; i++) {
            if (tabuleiro[intX+i][intY+i] === peca) {
                return true;
            }
        }
    }

    if (tabuleiro[intX-1] !== undefined && tabuleiro[intX-1][intY-1] !== undefined && 
        tabuleiro[intX-1][intY-1] !== peca && tabuleiro[intX-1][intY-1] !== 'X') {

            let fim = 8 - (intX-1) < 8 - (intY-1) ? 8 - (intX-1) : 8 - (intY-1) ;
            for(let i = 2; i < fim; i++) {
                if (tabuleiro[intX-i][intY-i] === peca) {
                    return true;
                }
            }
    }

    if (tabuleiro[intX+1] !== undefined && tabuleiro[intX+1][intY-1] !== undefined && 
        tabuleiro[intX+1][intY-1] !== peca && tabuleiro[intX+1][intY-1] !== 'X') {
        
        let fim = 8 - (intX+1) < 8 - (intY-1) ? 8 - (intX+1) : 8 - (intY-1) ;
        for(let i = 2; i < fim; i++) {
            if (tabuleiro[intX+i][intY-i] === peca) {
                return true;
            }
        }
    }

    if (tabuleiro[intX-1] !== undefined && tabuleiro[intX-1][intY+1] !== undefined && 
        tabuleiro[intX-1][intY+1] !== peca && tabuleiro[intX-1][intY+1] !== 'X') {
        
            
        let fim = intX < intY ? intX : intY ;

        for(let i = 2; i < fim; i++) {
            if (tabuleiro[intX-i][intY+i] === peca) {
                return true;
            }
        }
    }
    return false;
}

function jogada(cor, x, y) {
    let intX = Math.floor(x/80);
    let intY = Math.floor(y/80);

    if (x % 80 <= (intX + 0.1) || y % 80 <= (intY + 0.1)) {
        return false;
    }

    let jogada = {x: intX, y: intY};

    let jogadasValidas = getJogadasValidas();

    var contains = jogadasValidas.some(j => {
        return JSON.stringify(jogada) === JSON.stringify(j);
    });

    if (contains) {
        marcaTabuleiro(cor, intX, intY);

        let cX = 40 + (intX * 80);
        let cY = 40 + (intY * 80);
    
        adicionarPeca(cor, cX, cY);
    
        jogadorAtual += 1;
    }

    updateTabuleiro();

    jogadasValidas = getJogadasValidas();

    jogadasValidas.forEach(j => {
        adicionarPeca('#00bc8c', (j.x)*80+40, (j.y)*80+40);
    })
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

    let jogadasValidas = getJogadasValidas();

    jogadasValidas.forEach(j => {
        adicionarPeca('#00bc8c', (j.x)*80+40, (j.y)*80+40);
    })

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