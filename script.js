let tabuleiro = [];
jogadorAtual = 0;
let jogador1 = 'Jogador 1';
let jogador2 = 'Jogador 2';
let esperandoComputador = false;

let pontosJogador1 = 0;
let pontosJogador2 = 0;

let imagePvP = document.createElement('img');
imagePvP.src = 'assets/pvp.png';
imagePvP.style.width = '90px';
imagePvP.style.height = '90px';
imagePvP.title = "Jogador vs Jogador";
imagePvP.className = 'tooltipClass';

let imagePvIA = document.createElement('img');
imagePvIA.src = 'assets/pvai.png';
imagePvIA.style.width = '90px';
imagePvIA.style.height = '90px';
imagePvIA.title = "Jogador vs Máquina";
imagePvIA.className = 'tooltipClass';

let imageReiniciar = document.createElement('img');
imageReiniciar.src = 'assets/reiniciar.png';
imageReiniciar.style.width = '80px';
imageReiniciar.style.height = '90px';
imageReiniciar.style.borderRadius = '50%'
imageReiniciar.title = "Reiniciar Jogo";
imageReiniciar.className = 'tooltipClass';

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
    montarTabuleiro();
    for (let i = 2; i < tabuleiro.length; i++) {
        for (let j = 2; j < tabuleiro[i].length; j++) {
            if (tabuleiro[i][j] !== 'X') {
                let cor = 'white';
                if (tabuleiro[i][j] === 'P') {
                    cor = 'black'
                }
                adicionarPeca(cor, (i - 2) * 80 + 40, (j - 2) * 80 + 40);
            }
        }
    }
}

function adicionarPeca(cor, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, 2 * Math.PI);
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
    let intX = Math.floor(x / 80);
    let intY = Math.floor(y / 80);

    if (x % 80 <= (intX + 0.1) || y % 80 <= (intY + 0.1)) {
        return false;
    }

    let jogada = { x: intX + 2, y: intY + 2 };

    let jogadasValidas = getJogadasValidas();

    var contains = jogadasValidas.some(j => {
        return JSON.stringify(jogada) === JSON.stringify(j);
    });

    if (contains) {
        marcaTabuleiro(cor, intX + 2, intY + 2);
        tabuleiro = virarPeca(intX + 2, intY + 2, tabuleiro);
        let cX = 40 + (intX * 80);
        let cY = 40 + (intY * 80);

        adicionarPeca(cor, cX, cY);

        jogadorAtual += 1;

        if (jogadorAtual % 2 !== 0) {
            document.getElementById('vez').innerHTML = "É a vez do(a) " + jogador2;
        } else {
            document.getElementById('vez').innerHTML = "É a vez do(a) " + jogador1;
        }
    }

    updateTabuleiro();

    contaPontos();

    jogadasValidas = getJogadasValidas();

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
        adicionarPeca('#00bc8c', (j.x - 2) * 80 + 40, (j.y - 2) * 80 + 40);
    })
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

    let jogadasValidas = getJogadasValidas();

    jogadasValidas.forEach(j => {
        adicionarPeca('#00bc8c', (j.x - 2) * 80 + 40, (j.y - 2) * 80 + 40);
    })

    canvas.addEventListener('click', function (event) {
        x = event.offsetX;
        y = event.offsetY;
        jogada(jogadorAtual % 2 === 0 ? 'black' : 'white', x, y);
    });
}

function calculaPontos(tabuleiro) {
    let pP = 0;
    for (let i = 2; i < tabuleiro.length; i++) {
        for (let j = 2; j < tabuleiro[i].length; j++) {
            if (tabuleiro[i][j] === 'P') {
                pP += 1;
            }
        }
    }

    return pP;
}

function miniMax() {
    let jogadasValidas = getJogadasValidas();

    let min = { jogada: null, pontos: null };

    for (j of jogadasValidas) {
        let tabuleiroCopia = JSON.parse(JSON.stringify(tabuleiro));
        tabuleiroCopia = virarPeca(j.x, j.y, tabuleiroCopia);

        let pontos = calculaPontos(tabuleiroCopia)
        if (min.pontos === null || min.pontos < pontos) {
            min.pontos = pontos;
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

    let jogadasValidas = getJogadasValidas();

    jogadasValidas.forEach(j => {
        adicionarPeca('#00bc8c', (j.x - 2) * 80 + 40, (j.y - 2) * 80 + 40);
    })

    canvas.addEventListener('click', function (event) {
        if (!esperandoComputador) {
            x = event.offsetX;
            y = event.offsetY;
            jogada(jogadorAtual % 2 === 0 ? 'black' : 'white', x, y);
            esperandoComputador = true;
            setTimeout(function () { jogadaComputador('white') }, 2000);
        }

    });
}

function reset() {
    tabuleiro = [];
    var old_element = document.getElementById("tabuleiro");
    var new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
    jogadorAtual = 0;
    preencheTabuleiro();
    updateTabuleiro();
    pontosJogador1 = 0;
    pontosJogador2 = 0;
    jogador1 = 'Jogador 1';
    jogador2 = 'Jogador 2';
}

function jogadaComputador(cor) {
    let j = miniMax();

    let intX = j.jogada.x;
    let intY = j.jogada.y;

    marcaTabuleiro(cor, intX, intY);
    tabuleiro = virarPeca(intX, intY, tabuleiro);
    let cX = 40 + ((intX - 2) * 80);
    let cY = 40 + ((intY - 2) * 80);

    adicionarPeca(cor, cX, cY);

    jogadorAtual += 1;

    if (jogadorAtual % 2 !== 0) {
        document.getElementById('vez').innerHTML = "É a vez do(a) Máquina";
    } else {
        document.getElementById('vez').innerHTML = "É a vez do(a) " + jogador1;
    }

    updateTabuleiro();

    contaPontos();

    jogadasValidas = getJogadasValidas();

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
        adicionarPeca('#00bc8c', (j.x - 2) * 80 + 40, (j.y - 2) * 80 + 40);
    })

    setTimeout(function () { esperandoComputador = false }, 1000);
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
    let jogadorMaquina = document.getElementById("jogadorMaquina");
    let divVez = document.getElementById("divVez");
    let titulo = document.getElementById("titulo");
    let titulo2 = document.getElementById("titulo2");

    montarTabuleiro();
    preencheTabuleiro();
    updateTabuleiro();

    btnMaquina.addEventListener("click", () => {
        titulo.style.display="none"
        titulo2.style.display="flex"
        document.getElementById('jogador1').innerHTML = jogador1;
        document.getElementById('vez').innerHTML = 'É a vez do(a) ' + jogador1;
        document.getElementById('pontuacaoBrancas').innerHTML = '2';
        document.getElementById('pontuacaoPretas').innerHTML = '2';
        iniciaJogoComputador(divBotoes, divPontuacao);
        divVez.style.display = 'flex';
        jogadorMaquina.innerHTML = 'Maquina';
    });

    btnPlay.addEventListener("click", () => {
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

    btnReiniciar.addEventListener("click", () => {
        titulo2.style.display="none"
        titulo.style.display="flex"
        divBotoes.style.display = "inline-block";
        divPontuacao.style.display = "none";
        divVez.style.display= "none"
        reset();
    });
};