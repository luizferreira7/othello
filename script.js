let tabuleiro = [];
jogadorAtual = 0;
let jogador1 = 'Jogador 1';
let jogador2 = 'Jogador 2';
let esperandoComputador = false;

let corPeca;
let xPeca;
let yPeca;

let pecas= new Set();

let pontosJogador1 = 0;
let pontosJogador2 = 0;

let imagePvP = document.createElement('img');
imagePvP.src = 'assets/pvp.png';
imagePvP.style.width = '90px';
imagePvP.style.height = '80px';
imagePvP.title = "Jogador vs Jogador";
imagePvP.className = 'tooltipClass';

let imagePvIA = document.createElement('img');
imagePvIA.src = 'assets/pvai.png';
imagePvIA.style.width = '90px';
imagePvIA.style.height = '80px';
imagePvIA.title = "Jogador vs Máquina";
imagePvIA.className = 'tooltipClass';

let imageReiniciar = document.createElement('img');
imageReiniciar.src = 'assets/reiniciar.png';
imageReiniciar.style.width = '80px';
imageReiniciar.style.height = '90px';
imageReiniciar.style.borderRadius = '50%'
imageReiniciar.title = "Reiniciar Jogo";
imageReiniciar.className = 'tooltipClass';

let imageSalvar = document.createElement('img');
imageSalvar.src = 'assets/salvar.png';
imageSalvar.style.width = '25px';
imageSalvar.style.height = '27px';
imageSalvar.style.borderRadius = '50%'
imageSalvar.title = "Salvar Jogador";
imageSalvar.className = 'tooltipClass';

let imageFechar = document.createElement('img');
imageFechar.src = 'assets/close-icon.png';
imageFechar.style.width = '23px';
imageFechar.style.height = '26px';
imageFechar.style.borderRadius = '50%'
imageFechar.title = "Fechar Dialog";
imageFechar.className = 'tooltipClass';

function preencheTabuleiro() {
    for (let i = 0; i < 12; i++) {
        tabuleiro.push([]);
        for (let j = 0; j < 12; j++) {
            if (i === 0 || i === 10 || j === 0 || j === 10 ||
                i === 1 || i === 11 || j === 1 || j === 11) {
                tabuleiro[i].push('?');
            } else {
                tabuleiro[i].push('X');
            }

        }
    }
    tabuleiro[5][5] = 'B';
    tabuleiro[6][6] = 'B';
    tabuleiro[5][6] = 'P';
    tabuleiro[6][5] = 'P';
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
        var x = 80 * i;
        ctx.moveTo(x, 640);
        ctx.lineTo(x, 0);
    }
    for (let i = 1; i < 8; i++) {
        var y = 80 * i;
        ctx.moveTo(640, y);
        ctx.lineTo(0, y);
    }

    ctx.stroke();


    bolinhas();

}

function bolinhas() {
    for (var i = 1; i < 5; i++) {
        let x = 160;
        let y = 160;

        if (i === 4) {
            x *= i - 1;
            y *= i - 1;
        }

        else if (i % 2 === 0) {
            x *= i + 1;
        } else {
            y *= i;
        }

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
    }
}

function updateTabuleiro() {

    for (let peca of pecas) {
        if (peca.cor === '#00bc8c') {
            peca.remove();
            pecas.delete(peca);
        }
    }

    for (let i = 2; i < tabuleiro.length; i++) {
        for (let j = 2; j < tabuleiro[i].length; j++) {
            if (tabuleiro[i][j] !== 'X' && tabuleiro[i][j] !== '?') {
                let cor = 'white';
                if (tabuleiro[i][j] === 'P') {
                    cor = 'black'
                }
                adicionaPeca(cor, (i - 2) * 80 + 40, (j - 2) * 80 + 40);
            }
        }
    }
}

function adicionaPeca(cor, x, y) {
    if (!pecas.length) {
        pecaNova = new Peca(cor, x, y);
        pecas.add(pecaNova);
    }
    for (let peca of pecas) {
        if (peca.x === x && peca.y === y) {
            peca.cor=cor;
            peca.update();
        } else {
            pecaNova = new Peca(cor, x, y);
            pecas.add(pecaNova);
        }
    }

    
}

class Peca {
    constructor(cor, x, y) {
        this.x = x;
        this.y = y;
        this.cor = cor;
        this.opacity = 0;

        this.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 35, 0, 2 * Math.PI);
            ctx.stroke();

            ctx.globalAlpha=this.opacity/100;
            ctx.fillStyle = cor;
            ctx.fill();
        };

        this.incrementOpacity = function () {
            this.opacity += 1;
            for (let peca of pecas) {
                if (peca.x === this.x && peca.y === this.y && peca.opacity !== this.opacity) {
                    pecas.delete(peca);
                }
            }
        }

        this.remove = function () {
            ctx.clearRect(this.x - 38.5, y - 38.5 , 77, 77);
            bolinhas();
        }

        this.update = function () {
            if (this.opacity < 110) {
                this.incrementOpacity();
                console.log('teste')
            }
            this.draw();
        };
    }
}

function start() {
	for(var peca of pecas) {
            peca.update();
	}
	requestAnimationFrame(start);
}
start();

function getJogadasValidas(tabuleiro) {
    let peca = 'P';

    if (jogadorAtual % 2 !== 0) {
        peca = 'B';
    }

    let jogadas = [];

    for (let i = 2; i < tabuleiro.length; i++) {
        for (let j = 2; j < tabuleiro[i].length; j++) {
            if (jogadaValida(peca, i, j, tabuleiro)) {
                jogadas.push({ x: i, y: j })
            }
        }
    }

    return jogadas;
}

function jogadaValida(peca, intX, intY, tabuleiro) {
    if (tabuleiro[intX][intY] !== 'X') {
        return false;
    }

    if (tabuleiro[intX + 1] !== '?' && tabuleiro[intX + 1][intY] !== peca && tabuleiro[intX + 1][intY] !== 'X') {
        for (let i = intX + 1; i < 12; i++) {
            if (tabuleiro[i][intY] === 'X') {
                break;
            }
            if (tabuleiro[i][intY] === peca) {
                return true;
            }
        }
    }

    if (tabuleiro[intX - 1] !== '?' && tabuleiro[intX - 1][intY] !== peca && tabuleiro[intX - 1][intY] !== 'X') {
        for (let i = intX - 1; i >= 2; i--) {
            if (tabuleiro[i][intY] === 'X') {
                break;
            }
            if (tabuleiro[i][intY] === peca) {
                return true;
            }
        }
    }

    if (tabuleiro[intX][intY + 1] !== '?' && tabuleiro[intX][intY + 1] !== peca && tabuleiro[intX][intY + 1] !== 'X') {
        for (let i = intY + 1; i < 12; i++) {
            if (tabuleiro[intX][i] === 'X') {
                break;
            }
            if (tabuleiro[intX][i] === peca) {
                return true;
            }
        }
    }

    if (tabuleiro[intX][intY - 1] !== '?' && tabuleiro[intX][intY - 1] !== peca && tabuleiro[intX][intY - 1] !== 'X') {
        for (let i = intY - 1; i >= 2; i--) {
            if (tabuleiro[intX][i] === 'X') {
                break;
            }
            if (tabuleiro[intX][i] === peca) {
                return true;
            }
        }
    }

    if (tabuleiro[intX + 1][intY + 1] !== '?' &&
        tabuleiro[intX + 1][intY + 1] !== peca && tabuleiro[intX + 1][intY + 1] !== 'X') {

        let fim = intX > intY ? 12 - intX : 12 - intY;

        for (let i = 2; i < fim; i++) {
            if (tabuleiro[intX + i][intY + i] === 'X' || tabuleiro[intX + i][intY + i] === '?') {
                break;
            }
            if (tabuleiro[intX + i][intY + i] === peca) {
                return true;
            }
        }
    }

    if (tabuleiro[intX - 1][intY - 1] !== '?' &&
        tabuleiro[intX - 1][intY - 1] !== peca && tabuleiro[intX - 1][intY - 1] !== 'X') {

        for (let i = 2; i < 12; i++) {
            if (tabuleiro[intX - i][intY - i] === 'X' || tabuleiro[intX - i][intY - i] === '?') {
                break;
            }
            if (tabuleiro[intX - i][intY - i] === peca) {
                return true;
            }
        }
    }

    if (tabuleiro[intX + 1][intY - 1] !== '?' &&
        tabuleiro[intX + 1][intY - 1] !== peca && tabuleiro[intX + 1][intY - 1] !== 'X') {

        for (let i = 2; i < 12; i++) {
            if (tabuleiro[intX + i][intY - i] === 'X' || tabuleiro[intX + i][intY - i] === '?') {
                break;
            }
            if (tabuleiro[intX + i][intY - i] === peca) {
                return true;
            }
        }
    }

    if (tabuleiro[intX - 1][intY + 1] !== '?' &&
        tabuleiro[intX - 1][intY + 1] !== peca && tabuleiro[intX - 1][intY + 1] !== 'X') {

        for (let i = 2; i < 12; i++) {
            if (tabuleiro[intX - i][intY + i] === 'X' || tabuleiro[intX - i][intY + i] === '?') {
                break;
            }
            if (tabuleiro[intX - i][intY + i] === peca) {
                return true;
            }
        }
    }
    return false;
}

function virarPeca(intX, intY, tabuleiro) {
    let peca = 'P';

    if (jogadorAtual % 2 !== 0) {
        peca = 'B';
    }

    if (tabuleiro[intX + 1] !== '?' && tabuleiro[intX + 1][intY] !== peca && tabuleiro[intX + 1][intY] !== 'X') {
        let tabuleiroCopia = JSON.parse(JSON.stringify(tabuleiro));
        for (let i = intX + 1; i < 12; i++) {

            if (tabuleiro[i][intY] === 'X') {
                break;
            }
            if (tabuleiro[i][intY] === peca) {
                tabuleiro = JSON.parse(JSON.stringify(tabuleiroCopia));
                break;
            }

            tabuleiroCopia[i][intY] = peca;
        }
    }

    if (tabuleiro[intX - 1] !== '?' && tabuleiro[intX - 1][intY] !== peca && tabuleiro[intX - 1][intY] !== 'X') {
        let tabuleiroCopia = JSON.parse(JSON.stringify(tabuleiro));
        for (let i = intX - 1; i >= 2; i--) {

            if (tabuleiro[i][intY] === 'X') {
                break;
            }
            if (tabuleiro[i][intY] === peca) {
                tabuleiro = JSON.parse(JSON.stringify(tabuleiroCopia));
                break;
            }

            tabuleiroCopia[i][intY] = peca;
        }
    }

    if (tabuleiro[intX][intY + 1] !== '?' && tabuleiro[intX][intY + 1] !== peca && tabuleiro[intX][intY + 1] !== 'X') {
        let tabuleiroCopia = JSON.parse(JSON.stringify(tabuleiro));
        for (let i = intY + 1; i < 12; i++) {

            if (tabuleiro[intX][i] === 'X') {
                break;
            }

            if (tabuleiro[intX][i] === peca) {
                tabuleiro = JSON.parse(JSON.stringify(tabuleiroCopia));
                break;
            }

            tabuleiroCopia[intX][i] = peca;
        }
    }

    if (tabuleiro[intX][intY - 1] !== '?' && tabuleiro[intX][intY - 1] !== peca && tabuleiro[intX][intY - 1] !== 'X') {
        let tabuleiroCopia = JSON.parse(JSON.stringify(tabuleiro));
        for (let i = intY - 1; i >= 2; i--) {

            if (tabuleiro[intX][i] === 'X') {
                break;
            }

            if (tabuleiro[intX][i] === peca) {
                tabuleiro = JSON.parse(JSON.stringify(tabuleiroCopia));
                break;
            }

            tabuleiroCopia[intX][i] = peca;
        }
    }

    if (tabuleiro[intX + 1][intY + 1] !== '?' &&
        tabuleiro[intX + 1][intY + 1] !== peca && tabuleiro[intX + 1][intY + 1] !== 'X') {

        let tabuleiroCopia = JSON.parse(JSON.stringify(tabuleiro));
        for (let i = 1; i < 12; i++) {
            if (tabuleiro[intX + i][intY + i] === 'X' || tabuleiro[intX + i][intY + i] === '?') {
                break;
            }

            if (tabuleiro[intX + i][intY + i] === peca) {
                tabuleiro = JSON.parse(JSON.stringify(tabuleiroCopia));
                break;
            }

            tabuleiroCopia[intX + i][intY + i] = peca;
        }
    }

    if (tabuleiro[intX - 1][intY - 1] !== '?' &&
        tabuleiro[intX - 1][intY - 1] !== peca && tabuleiro[intX - 1][intY - 1] !== 'X') {

        let tabuleiroCopia = JSON.parse(JSON.stringify(tabuleiro));
        for (let i = 1; i <= 12; i++) {
            if (tabuleiro[intX - i][intY - i] === 'X' || tabuleiro[intX - i][intY - i] === '?') {
                break;
            }

            if (tabuleiro[intX - i][intY - i] === peca) {
                tabuleiro = JSON.parse(JSON.stringify(tabuleiroCopia));
                break;
            }

            tabuleiroCopia[intX - i][intY - i] = peca;
        }
    }

    if (tabuleiro[intX + 1][intY - 1] !== '?' &&
        tabuleiro[intX + 1][intY - 1] !== peca && tabuleiro[intX + 1][intY - 1] !== 'X') {



        let tabuleiroCopia = JSON.parse(JSON.stringify(tabuleiro));
        for (let i = 1; i < 12; i++) {
            if (tabuleiro[intX + i][intY - i] === 'X' || tabuleiro[intX + i][intY - i] === '?') {
                break;
            }
            if (tabuleiro[intX + i][intY - i] === peca) {
                tabuleiro = JSON.parse(JSON.stringify(tabuleiroCopia));
                break;
            }
            tabuleiroCopia[intX + i][intY - i] = peca;
        }
    }

    if (tabuleiro[intX - 1][intY + 1] !== '?' &&
        tabuleiro[intX - 1][intY + 1] !== peca && tabuleiro[intX - 1][intY + 1] !== 'X') {

        let tabuleiroCopia = JSON.parse(JSON.stringify(tabuleiro));
        for (let i = 1; i <= 12; i++) {
            if (tabuleiro[intX - i][intY + i] === 'X' || tabuleiro[intX - i][intY + i] === '?') {
                break;
            }

            if (tabuleiro[intX - i][intY + i] === peca) {
                tabuleiro = JSON.parse(JSON.stringify(tabuleiroCopia));
                break;
            }

            tabuleiroCopia[intX - i][intY + i] = peca;
        }
    }
    return tabuleiro;
}

function contaPontos() {
    let pB = 0;
    let pP = 0;
    for (let i = 2; i < tabuleiro.length; i++) {
        for (let j = 2; j < tabuleiro[i].length; j++) {
            if (tabuleiro[i][j] === 'B') {
                pB += 1;
            } else if (tabuleiro[i][j] === 'P') {
                pP += 1;
            }
        }
    }
    document.getElementById('pontuacaoPretas').innerHTML = pP;
    document.getElementById('pontuacaoBrancas').innerHTML = pB;

    pontosJogador1 = pP;
    pontosJogador2 = pB;
}

function jogada(cor, x, y) {
    let jogadasValidas = getJogadasValidas(tabuleiro);

    if (!jogadasValidas.length) {
        let vencedor = "Empate!";

        if (pontosJogador2 < pontosJogador1) {
            vencedor = "O jogador: " + jogador1 + " venceu!";
        }

        if (pontosJogador2 > pontosJogador1) {
            vencedor = "O jogador: " + jogador2 + " venceu!";
        }

        document.getElementById('vez').innerHTML = vencedor;
    }

    let intX = Math.floor(x / 80);
    let intY = Math.floor(y / 80);

    if (x % 80 <= (intX + 0.1) || y % 80 <= (intY + 0.1)) {
        return false;
    }

    let jogada = { x: intX + 2, y: intY + 2 };

    jogadasValidas = getJogadasValidas(tabuleiro);

    var contains = jogadasValidas.some(j => {
        return JSON.stringify(jogada) === JSON.stringify(j);
    });

    if (contains) {
        marcaTabuleiro(cor, intX + 2, intY + 2);
        tabuleiro = virarPeca(intX + 2, intY + 2, tabuleiro);
        let cX = 40 + (intX * 80);
        let cY = 40 + (intY * 80);

        adicionaPeca(cor, cX, cY);

        jogadorAtual += 1;

        if (jogadorAtual % 2 !== 0) {
            document.getElementById('vez').innerHTML = "É a vez do(a) " + jogador2;
        } else {
            document.getElementById('vez').innerHTML = "É a vez do(a) " + jogador1;
        }
    }

    updateTabuleiro();

    contaPontos();

    jogadasValidas = getJogadasValidas(tabuleiro);

    if (!jogadasValidas.length) {
        let vencedor = "Empate!";

        if (pontosJogador2 < pontosJogador1) {
            vencedor = "O jogador: " + jogador1 + " venceu!";
        }

        if (pontosJogador2 > pontosJogador1) {
            vencedor = "O jogador: " + jogador2 + " venceu!";
        }

        document.getElementById('vez').innerHTML = vencedor;
    }

    jogadasValidas.forEach(j => {
        adicionaPeca('#00bc8c', (j.x - 2) * 80 + 40, (j.y - 2) * 80 + 40);
    })
}

function jogadaJogadorMaquina(cor, x, y) {
    let jogadasValidas = getJogadasValidas(tabuleiro);

    if (!jogadasValidas.length) {
        let vencedor = "Empate!";

        if (pontosJogador2 < pontosJogador1) {
            vencedor = "O jogador: " + jogador1 + " venceu!";
        }

        if (pontosJogador2 > pontosJogador1) {
            vencedor = "O jogador: " + jogador2 + " venceu!";
        }

        document.getElementById('vez').innerHTML = vencedor;
    }

    let intX = Math.floor(x / 80);
    let intY = Math.floor(y / 80);

    if (x % 80 <= (intX + 0.1) || y % 80 <= (intY + 0.1)) {
        return false;
    }

    let jogada = { x: intX + 2, y: intY + 2 };

    jogadasValidas = getJogadasValidas(tabuleiro);

    var contains = jogadasValidas.some(j => {
        return JSON.stringify(jogada) === JSON.stringify(j);
    });

    if (contains) {
        marcaTabuleiro(cor, intX + 2, intY + 2);
        tabuleiro = virarPeca(intX + 2, intY + 2, tabuleiro);
        let cX = 40 + (intX * 80);
        let cY = 40 + (intY * 80);

        adicionaPeca(cor, cX, cY);

        jogadorAtual += 1;

        if (jogadorAtual % 2 !== 0) {
            document.getElementById('vez').innerHTML = "É a vez do(a) " + jogador2;
        } else {
            document.getElementById('vez').innerHTML = "É a vez do(a) " + jogador1;
        }
    }

    updateTabuleiro();

    contaPontos();

    jogadasValidas = getJogadasValidas(tabuleiro);

    if (!jogadasValidas.length) {
        let vencedor = "Empate!";

        if (pontosJogador2 < pontosJogador1) {
            vencedor = "O jogador: " + jogador1 + " venceu!";
        }

        if (pontosJogador2 > pontosJogador1) {
            vencedor = "O jogador: " + jogador2 + " venceu!";
        }

        document.getElementById('vez').innerHTML = vencedor;
    }
}

function marcaTabuleiro(cor, x, y) {
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
    updateTabuleiro();

    let jogadasValidas = getJogadasValidas(tabuleiro);

    jogadasValidas.forEach(j => {
        
        adicionaPeca('#00bc8c', (j.x - 2) * 80 + 40, (j.y - 2) * 80 + 40);
    })

    canvas.addEventListener('click', function (event) {
        x = event.offsetX;
        y = event.offsetY;
        jogada(jogadorAtual % 2 === 0 ? 'black' : 'white', x, y);
    });
}

function calculaPontos(tabuleiro) {
    let pontuacao = {pP: 0, pB: 0};
    for (let i = 2; i < tabuleiro.length; i++) {
        for (let j = 2; j < tabuleiro[i].length; j++) {
            if (tabuleiro[i][j] === 'P') {
                pontuacao.pP += 1;
            } else if (tabuleiro[i][j] == 'B') {
                pontuacao.pB += 1;
            }
        }
    }

    return pontuacao;
}

function miniMax() {
    let jogadasValidas = getJogadasValidas(tabuleiro);

    let min = { jogada: null, pontosJogador: null, pontosMaquina: null };

    for (j of jogadasValidas) {
        let tabuleiroCopia = JSON.parse(JSON.stringify(tabuleiro));
        tabuleiroCopia = virarPeca(j.x, j.y, tabuleiroCopia);

        let jogadasValidasJogador = getJogadasValidas(tabuleiroCopia);

        let pontosJogador = 0;

        for (jj of jogadasValidasJogador) {
            let tabuleiroCopiaJogador = JSON.parse(JSON.stringify(tabuleiroCopia));
            tabuleiroCopiaJogador = virarPeca(j.x, j.y, tabuleiroCopiaJogador);

            let pontuacao = calculaPontos(tabuleiroCopiaJogador)
            if (pontosJogador < pontuacao.pP) {
                pontosJogador = pontuacao.pP;
            }
        }

        let pontuacao = calculaPontos(tabuleiroCopia);

        let pontosMaquina = pontuacao.pB;

        if ((min.pontosJogador === null && min.pontosMaquina === null) || 
            (pontosJogador < min.pontosJogador && pontosMaquina > min.pontosMaquina)) {
            min.pontosJogador = pontosJogador;
            min.pontosMaquina = pontosMaquina;
            min.jogada = j;
        }
    }

    return min;
}

function iniciaJogoComputador(elementHide, elementShow) {
    jogador2 = 'Máquina';
    document.getElementById('jogador2').innerHTML = jogador2;
    montarTabuleiro();
    elementHide.style.display = 'none';
    elementShow.style.display = 'flex';
    preencheTabuleiro();
    updateTabuleiro();

    let jogadasValidas = getJogadasValidas(tabuleiro);

    jogadasValidas.forEach(j => {
        adicionaPeca('#00bc8c', (j.x - 2) * 80 + 40, (j.y - 2) * 80 + 40);
    })

    canvas.addEventListener('click', function (event) {
        if (!esperandoComputador) {
            x = event.offsetX;
            y = event.offsetY;
            jogadaJogadorMaquina(jogadorAtual % 2 === 0 ? 'black' : 'white', x, y);
            esperandoComputador = true;
            setTimeout(function () { jogadaComputador('white') }, 2000);
        }

    });
}

function reset() {
    tabuleiro = [];
    pecas = new Set();

    var old_element1 = document.getElementById("tabuleiro");
    var new_element1 = old_element1.cloneNode(true);
    old_element1.parentNode.replaceChild(new_element1, old_element1);

    jogadorAtual = 0;
    montarTabuleiro();
    preencheTabuleiro();
    updateTabuleiro();
    pontosJogador1 = 0;
    pontosJogador2 = 0;
    jogador1 = 'Jogador 1';
    jogador2 = 'Jogador 2';
}

function jogadaComputador(cor) {
    let jogadasValidas = getJogadasValidas(tabuleiro);

    if (!jogadasValidas.length) {
        let vencedor = "Empate!";

        if (pontosJogador2 < pontosJogador1) {
            vencedor = "O jogador: " + jogador1 + " venceu!";
        }

        if (pontosJogador2 > pontosJogador1) {
            vencedor = "O jogador: " + jogador2 + " venceu!";
        }

        document.getElementById('vez').innerHTML = vencedor;
    } 

    let j = miniMax();

    if (j.jogada !== null) {
        let intX = j.jogada.x;
        let intY = j.jogada.y;
    
        marcaTabuleiro(cor, intX, intY);
        tabuleiro = virarPeca(intX, intY, tabuleiro);
        let cX = 40 + ((intX - 2) * 80);
        let cY = 40 + ((intY - 2) * 80);
    
        adicionaPeca(cor, cX, cY);
    
        jogadorAtual += 1;
    
        if (jogadorAtual % 2 !== 0) {
            document.getElementById('vez').innerHTML = "É a vez do(a) Máquina";
        } else {
            document.getElementById('vez').innerHTML = "É a vez do(a) " + jogador1;
        }
    
        updateTabuleiro();
    
        contaPontos();
    
        jogadasValidas = getJogadasValidas(tabuleiro);
    
        if (!jogadasValidas.length) {
            let vencedor = "Empate!";
    
            if (pontosJogador2 < pontosJogador1) {
                vencedor = "O jogador: " + jogador1 + " venceu!";
            }
    
            if (pontosJogador2 > pontosJogador1) {
                vencedor = "O jogador: " + jogador2 + " venceu!";
            }
    
            document.getElementById('vez').innerHTML = vencedor;
        }

        jogadasValidas.forEach(j => {
            
            adicionaPeca('#00bc8c', (j.x - 2) * 80 + 40, (j.y - 2) * 80 + 40);
        })
    
        setTimeout(function () { esperandoComputador = false }, 1000);
    }
}

window.onload = function () {
    let btnMaquina = document.getElementById("modoMaquina");
    btnMaquina.appendChild(imagePvIA);
    let btnPlay = document.getElementById("modoJogador");
    btnPlay.appendChild(imagePvP);
    let divBotoes = document.getElementById("divBotoes");
    let divPontuacao = document.getElementById("pontuacao");
    let btnReiniciar = document.getElementById("reiniciar");
    btnReiniciar.appendChild(imageReiniciar);
    let divVez = document.getElementById("divVez");
    let titulo = document.getElementById("titulo");
    let titulo2 = document.getElementById("titulo2");

    montarTabuleiro();
    preencheTabuleiro();
    updateTabuleiro();

    btnMaquina.addEventListener("click", () => {
        document.getElementById('dialogJogador1').style.display='flex';
        document.getElementById('nomeJogado1').innerHTML = 'Digite o nome do Jogador:';

        let btnSalvar1 = document.getElementById('btnSalvar1');
        btnSalvar1.appendChild(imageSalvar);
        
        btnSalvar1.addEventListener("click", () => {
            jogador1 = document.getElementById('inputJogador1').value;
            document.getElementById('inputJogador1').value = "";
            document.getElementById('dialogJogador1').style.display='none';

            titulo.style.display="none"
            titulo2.style.display="flex"
            document.getElementById('jogador1').innerHTML = jogador1;
            document.getElementById('jogador2').innerHTML = jogador2;
            document.getElementById('vez').innerHTML = 'É a vez do(a) ' + jogador1;
            document.getElementById('pontuacaoBrancas').innerHTML = '2';
            document.getElementById('pontuacaoPretas').innerHTML = '2';
            iniciaJogoComputador(divBotoes, divPontuacao);
            divVez.style.display = 'flex';
            jogador2= 'Máquina';
        });

        let btnFecharDialog1 = document.getElementById('fecharDialog1');
        btnFecharDialog1.appendChild(imageFechar);

        btnFecharDialog1.addEventListener("click", () => {
            document.getElementById('inputJogador1').value = "";

            titulo2.style.display="none";
            titulo.style.display="flex";
            divBotoes.style.display = "inline-block";
            divPontuacao.style.display = "none";
            divVez.style.display= "none"
            reset();
    
            let btnSalvar1 = document.getElementById('btnSalvar1');
            while (btnSalvar1.childElementCount > 0) {
                btnSalvar1.removeChild(btnSalvar1.lastChild)
            }
    
            var old_element4 = document.getElementById('btnSalvar1');
            var new_element4 = old_element4.cloneNode(true);
            old_element4.parentNode.replaceChild(new_element4, old_element4);
    
            document.getElementById('dialogJogador1').style.display='none';
            document.getElementById('dialogJogador2').style.display='none';
        });
    });

    btnPlay.addEventListener("click", () => {
        document.getElementById('dialogJogador1').style.display='flex';
        document.getElementById('nomeJogado1').innerHTML = 'Digite o nome do Jogador 1:';

        let btnSalvar1 = document.getElementById('btnSalvar1');
        btnSalvar1.appendChild(imageSalvar);

        btnSalvar1.addEventListener('click', () => {
            jogador1 = document.getElementById('inputJogador1').value;
            document.getElementById('inputJogador1').value = "";
            document.getElementById('dialogJogador1').style.display='none';
            document.getElementById('dialogJogador2').style.display='flex';

            var old_element5 = document.getElementById("btnSalvar2");
            var new_element5 = old_element5.cloneNode(true);
            old_element5.parentNode.replaceChild(new_element5, old_element5);

            let btnSalvar2 = document.getElementById('btnSalvar2');
            btnSalvar2.appendChild(imageSalvar);

            btnSalvar2.addEventListener('click', () => {
                jogador2 = document.getElementById('inputJogador2').value;
                document.getElementById('inputJogador2').value = "";
                document.getElementById('dialogJogador2').style.display='none';
    
                titulo.style.display="none"
                titulo2.style.display="flex"
                document.getElementById('jogador1').innerHTML = jogador1;
                document.getElementById('jogador2').innerHTML = jogador2;
                document.getElementById('vez').innerHTML = 'É a vez do(a) ' + jogador1;
                document.getElementById('pontuacaoBrancas').innerHTML = '2';
                document.getElementById('pontuacaoPretas').innerHTML = '2';
                iniciaJogo(divBotoes, divPontuacao);
                divVez.style.display = 'flex';
            });

            let btnFecharDialog2 = document.getElementById('fecharDialog2');
            btnFecharDialog2.appendChild(imageFechar);

            btnFecharDialog2.addEventListener("click", () => {
                document.getElementById('inputJogador2').value = "";

                titulo2.style.display="none";
                titulo.style.display="flex";
                divBotoes.style.display = "inline-block";
                divPontuacao.style.display = "none";
                divVez.style.display= "none"
                reset();
        
                let btnSalvar2 = document.getElementById('btnSalvar2');
                while (btnSalvar2.childElementCount > 0) {
                    btnSalvar2.removeChild(btnSalvar2.lastChild)
                }
        
                var old_element6 = document.getElementById("btnSalvar2");
                var new_element6 = old_element6.cloneNode(true);
                old_element6.parentNode.replaceChild(new_element6, old_element6);

                let btnSalvar1 = document.getElementById('btnSalvar1');
                while (btnSalvar1.childElementCount > 0) {
                    btnSalvar1.removeChild(btnSalvar1.lastChild)
                }
        
                var old_element4 = document.getElementById('btnSalvar1');
                var new_element4 = old_element4.cloneNode(true);
                old_element4.parentNode.replaceChild(new_element4, old_element4);
        
                document.getElementById('dialogJogador1').style.display='none';
                document.getElementById('dialogJogador2').style.display='none';
            });
        });

        let btnFecharDialog1 = document.getElementById('fecharDialog1');
        btnFecharDialog1.appendChild(imageFechar);

        btnFecharDialog1.addEventListener("click", () => {
            document.getElementById('inputJogador1').value = "";

            titulo2.style.display="none";
            titulo.style.display="flex";
            divBotoes.style.display = "inline-block";
            divPontuacao.style.display = "none";
            divVez.style.display= "none"
            reset();
    
            let btnSalvar1 = document.getElementById('btnSalvar1');
            while (btnSalvar1.childElementCount > 0) {
                btnSalvar1.removeChild(btnSalvar1.lastChild)
            }
    
            var old_element4 = document.getElementById('btnSalvar1');
            var new_element4 = old_element4.cloneNode(true);
            old_element4.parentNode.replaceChild(new_element4, old_element4);
    
            document.getElementById('dialogJogador1').style.display='none';
            document.getElementById('dialogJogador2').style.display='none';
        });
    });

    btnReiniciar.addEventListener("click", () => {
        titulo2.style.display="none";
        titulo.style.display="flex";
        divBotoes.style.display = "inline-block";
        divPontuacao.style.display = "none";
        divVez.style.display= "none"
        reset();

        let btnSalvar1 = document.getElementById('btnSalvar1');
        while (btnSalvar1.childElementCount > 0) {
            btnSalvar1.removeChild(btnSalvar1.lastChild)
        }

        var old_element4 = document.getElementById('btnSalvar1');
        var new_element4 = old_element4.cloneNode(true);
        old_element4.parentNode.replaceChild(new_element4, old_element4);

        document.getElementById('dialogJogador1').style.display='none';
        document.getElementById('dialogJogador2').style.display='none';
    });
};
