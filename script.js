// Seleção de Elementos DOM
const mainText = document.getElementById('main-text');
const mediaContainer = document.getElementById('media-container');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Variável para controlar loops de animação (para poder cancelar ao trocar de tecla)
let currentAnimationId = null;
let timerInterval = null; // <--- ADICIONE ISSO

// --- Configuração Inicial ---
function resetScreen() {
    // 1. Limpa texto e remove classes de estilo
    mainText.textContent = '';
    mainText.className = ''; 
    
    // 2. Limpa container de mídia
    mediaContainer.innerHTML = '';
    mediaContainer.classList.add('hidden');
    document.body.style.backgroundColor = '#070707';
    document.body.style.color = '#ffffffff';
    // 3. Limpa e esconde Canvas
    canvas.classList.add('hidden');
    if (currentAnimationId) {
        cancelAnimationFrame(currentAnimationId);
        currentAnimationId = null;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // --- NOVO: Limpeza do modo Tinta ---
    document.onclick = null; // Remove a função de clique
    
    // Remove todas as manchas existentes na tela
    const manchas = document.querySelectorAll('.ink-spot');
    manchas.forEach(mancha => mancha.remove());

    // 6. PARA O CRONÔMETRO (IMPORTANTE) 
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// --- Mapa de Ações das Teclas ---
const keyActions = {
    'b': () => {
    // 1. Configuração do Texto e Canvas
    mainText.textContent = 'BASKETBALL';
    mainText.classList.add('font-graffiti'); // Certifique-se de ter essa classe CSS ou remova
    
    canvas.classList.remove('hidden');
    canvas.width = 500; // Um pouco mais largo para o arremesso
    canvas.height = 300;

    // 2. Variáveis do Jogo
    const gravity = 0.4;
    const floorY = 280;
    const hoopX = 420;
    const hoopY = 120;
    
    // Estado da bola (Começa na esquerda inferior)
    let ball = {
        x: 50,
        y: 200,
        vx: 6.5, // Velocidade horizontal
        vy: -11, // Impulso vertical (para cima)
        radius: 18,
        angle: 0,
        scored: false
    };

    // 3. Funções de Desenho
    const drawHoop = () => {
        // Tabela (Backboard)
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2;
        ctx.fillRect(hoopX + 10, hoopY - 40, 10, 80);
        ctx.strokeRect(hoopX + 10, hoopY - 40, 10, 80);

        // Aro (Rim)
        ctx.beginPath();
        ctx.moveTo(hoopX, hoopY);
        ctx.lineTo(hoopX + 15, hoopY);
        ctx.strokeStyle = '#d35400'; // Laranja escuro
        ctx.lineWidth = 4;
        ctx.stroke();

        // Rede (Net - visual simplificado)
        ctx.beginPath();
        ctx.moveTo(hoopX, hoopY);
        ctx.lineTo(hoopX + 5, hoopY + 25);
        ctx.lineTo(hoopX + 15, hoopY);
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Poste
        ctx.fillStyle = '#555';
        ctx.fillRect(hoopX + 15, hoopY, 10, 160);
    };

    const drawBall = () => {
        ctx.save(); // Salva o estado atual do canvas
        
        // Move o ponto de origem para o centro da bola para rotacionar
        ctx.translate(ball.x, ball.y);
        ctx.rotate(ball.angle);

        // Corpo da bola
        ctx.beginPath();
        ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#e67e22'; // Laranja Basquete
        ctx.fill();
        ctx.strokeStyle = '#2c3e50'; // Preto/Azul escuro
        ctx.lineWidth = 2;
        ctx.stroke();

        // Linhas da bola (Cruz e Curva)
        ctx.beginPath();
        ctx.moveTo(0, -ball.radius);
        ctx.lineTo(0, ball.radius);
        ctx.moveTo(-ball.radius, 0);
        ctx.lineTo(ball.radius, 0);
        ctx.stroke();
        
        // Efeito visual de rotação
        ball.angle += 0.1; // Aumenta o ângulo para o próximo frame

        ctx.restore(); // Restaura o estado (desfaz a translação/rotação para o resto do cenário)
    };

    // 4. Loop de Animação
    function animate() {
        // Limpa tela
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Desenha cenário
        // Chão
        ctx.fillStyle = '#bdc3c7';
        ctx.fillRect(0, floorY, canvas.width, canvas.height - floorY);
        
        drawHoop();
        drawBall();

        // Física
        ball.vy += gravity;
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Detecção de "Cesta" (Simples: verificar se passou perto do aro descendo)
        if (!ball.scored && 
            ball.x > hoopX - 10 && ball.x < hoopX + 15 && 
            ball.y > hoopY - 10 && ball.y < hoopY + 10 &&
            ball.vy > 0) { // vy > 0 significa que a bola está descendo
            
            ball.scored = true;
            mainText.textContent = "SWISH! 🏀";
            mainText.style.color = '#2ecc71'; // Verde
        }

        // Colisão com o chão
        if (ball.y + ball.radius > floorY) {
            ball.y = floorY - ball.radius;
            ball.vy *= -0.7; // Quica perdendo energia
            ball.vx *= 0.9;  // Atrito no chão

            // Se a bola estiver quase parada, para a animação
            if (Math.abs(ball.vy) < 1 && Math.abs(ball.vx) < 0.1) {
                return; // Encerra o loop
            }
        }

        // Colisão com a tabela (rebote simples)
        if (ball.x + ball.radius > hoopX + 10 && ball.y < hoopY) {
            ball.vx *= -0.8;
            ball.x = hoopX + 10 - ball.radius;
        }

        requestAnimationFrame(animate);
    }

    // Inicia
    animate();
},

    'e': () => {
        /*
           TECLA E - IDEIA:
           - Mostra texto EARTH
           - Exibe GIF/Animação pixelada da Terra girando
           - Estilo Avatar (natureza/energia)
        */
        
        // Configuração Visual
        mainText.textContent = 'EARTH';
        mainText.classList.add('style-earth');
        
        // Mostrar Mídia
        mediaContainer.classList.remove('hidden');
        
        // Criar elemento de imagem (Use placeholder ou arquivo local)
        const img = document.createElement('img');
        // Placeholder da Terra para teste (substitua pelo caminho do seu asset local)
        img.src = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Rotating_earth_%28large%29.gif'; 
        img.alt = 'Earth Rotating';
        
        mediaContainer.appendChild(img);
    },
    
    'r': () => {
        // --- MUDANÇA DE COR ALEATÓRIA ---

        // 1. Lista de cores possíveis (Hex, nomes ou RGB)
        const cores = [
            '#e74c3c', // Vermelho
            '#8e44ad', // Roxo
            '#3498db', // Azul
            '#2ecc71', // Verde
            '#f1c40f', // Amarelo
            '#e67e22', // Laranja
            '#1abc9c', // Turquesa
            '#fff'     // Branco (cuidado com o texto branco)
        ];

        // 2. Sorteia uma cor baseada no tamanho da lista
        const corSorteada = cores[Math.floor(Math.random() * cores.length)];

        // 3. Aplica a cor ao body
        document.body.style.backgroundColor = corSorteada;

        // 4. Atualiza o texto para o usuário saber o que aconteceu
        mainText.textContent = 'RANDOM COLOR';
        
        // (Opcional) Muda a cor do texto se o fundo for muito claro
        //if (corSorteada === '#fff') {
        //    mainText.style.color = '#000';
        //}
    },
    //Ink → tinta se espalhando
    'i': () => {
        mainText.textContent = 'INK - CLIQUE NA TELA';
        const cores = [
            '#e6200aff', // Vermelho
            '#b147dfff', // Roxo
            '#07324eff', // Azul
            '#0aaa4cff', // Verde
            '#c9a100ff', // Amarelo
            '#7a3900ff', // Laranja
            '#00ffccff', // Turquesa
            '#ffffffff',
            '#000000ff'     // Branco (cuidado com o texto branco)
        ];
        // Evento de Clique na Tela inteira
        document.onclick = (e) => {
            mainText.textContent = '';
            // 1. Cria o elemento HTML (div)
            const mancha = document.createElement('div');
            mancha.classList.add('ink-spot'); // Adiciona a classe CSS que criamos
            
            // 2. Tamanho aleatório (entre 50px e 150px)
            const tamanho = Math.floor(Math.random() * 200) + 50;
            mancha.style.width = `${tamanho}px`;
            mancha.style.height = `${tamanho}px`;

            // 3. Cor aleatória
            const corSorteada = cores[Math.floor(Math.random() * cores.length)];
            mancha.style.backgroundColor = corSorteada;

            // 4. Posição (Onde o mouse clicou)
            // e.clientX = posição horizontal do mouse
            // e.clientY = posição vertical do mouse
            mancha.style.left = `${e.clientX}px`;
            mancha.style.top = `${e.clientY}px`;

            // 5. Adiciona na tela
            document.body.appendChild(mancha);
        };
    },

    //Kaleidoscope → formas simétricas

// Quick Time → Timer de reação
    'q': () => {
        // Estado do jogo
        let centesimos = 0;
        let jogando = true;

        // Mensagem inicial rápida
        mainText.textContent = "PARE EM 1.00";
        mainText.style.color = "#fff";

        // Inicia o cronômetro (roda a cada 10 milissegundos)
        timerInterval = setInterval(() => {
            if (!jogando) return; // Se parou, não conta mais

            centesimos++;

            // Formatação matemática para parecer relógio (1.00)
            let segundos = Math.floor(centesimos / 100);
            let restos = centesimos % 100;
            
            // Adiciona um zero na frente se for menor que 10 (ex: 1.05)
            let restosFormatado = restos < 10 ? `0${restos}` : restos;
            
            mainText.textContent = `${segundos}.${restosFormatado}`;

        }, 10); // 10ms = 0.01 segundo

        // Evento de clique para parar
        document.onclick = () => {
            if (jogando) {
                // Para o jogo
                jogando = false;
                clearInterval(timerInterval); // Para o processamento

                // Verifica o resultado
                if (centesimos === 100) {
                    // Acertou na mosca (1.00s)
                    mainText.textContent += " — PERFEITO! 🔥";
                    mainText.style.color = "#00ff00"; // Verde
                    document.body.style.backgroundColor = "#003300";
                } else {
                    // Errou
                    let diferenca = Math.abs(100 - centesimos);
                    mainText.textContent += ` — ERROU POR ${diferenca}, pare em 1.00 para ganhar`;
                    mainText.style.color = "#ff4444"; // Vermelho
                    document.body.style.backgroundColor = "#330000ff";
                }
            } else {
                // Se clicar de novo, reinicia o jogo chamando a própria tecla 'q'
                keyActions['q']();
            }
        };
    },
    'w': () => {
        // --- WHITE NOISE (CHIADO) ---
        
        // 1. Configura o texto (Vibe de TV fora do ar)
        mainText.textContent = "NO SIGNAL";
        mainText.style.fontFamily = "'Courier New', monospace";
        mainText.style.letterSpacing = "5px";
        
        // 2. Torna o container de mídia visível
        mediaContainer.classList.remove('hidden');

        // 3. Cria o elemento de imagem dinamicamente
        const img = document.createElement('img');
        
        // IMPORTANTE: O caminho deve bater exatamente com o nome do seu arquivo
        img.src = 'imagens/Wn.gif'; 
        
        img.alt = 'TV Static';

        // 4. Estilização extra para parecer uma tela de TV (opcional)
        // Isso força o GIF a preencher o espaço, caso ele seja pequeno
        img.style.width = '100%';
        img.style.height = 'auto'; 
        img.style.maxWidth = '600px'; // Tamanho máximo para não estourar a tela
        img.style.borderRadius = '10px';
        img.style.border = '2px solid #333';

        // 5. Adiciona a imagem na tela
        mediaContainer.appendChild(img);
    },
    'y': () => {
        // --- YIN YANG (Com Imagem) ---
        
        // 1. Texto
        mainText.textContent = "Yin-Yang";
        mainText.style.fontFamily = "serif"; // Fonte mais clássica
        mainText.style.letterSpacing = "5px";
        
        // 2. Mostra o container
        mediaContainer.classList.remove('hidden');

        // 3. Cria a imagem
        const img = document.createElement('img');
        
        // CAMINHO DA IMAGEM (Verifique a extensão .png, .jpg, etc)
        img.src = 'imagens/yy.png'; 
        
        img.alt = 'Yin Yang Symbol';
        
        // 4. Adiciona a classe CSS que criamos acima
        img.classList.add('yin-yang-img');

        // 5. Coloca na tela
        mediaContainer.appendChild(img);
    },
    
    'd': () => {
    // 1. Configuração Inicial
    mainText.textContent = 'ROLING...';
    mainText.style.letterSpacing = '2px';
    canvas.classList.remove('hidden');
    canvas.width = 300;
    canvas.height = 300;

    // Configurações visuais
    const size = 200;
    const x = (canvas.width - size) / 2; // Centraliza X
    const y = (canvas.height - size) / 2; // Centraliza Y
    
    // Variáveis de Animação
    let frames = 0;
    const totalFrames = 20; // Duração da animação (aprox. 0.3 segundos)

    // --- Função que desenha uma face específica ---
    const desenharFace = (numero) => {
        // Limpa o canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // A. Corpo do dado (com sombra e cantos redondos)
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 8;
        ctx.shadowOffsetY = 8;
        
        ctx.fillStyle = '#f8f9fa'; // Branco gelo
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 3;

        ctx.beginPath();
        // roundRect(x, y, largura, altura, raio_borda)
        ctx.roundRect(x, y, size, size, 25); 
        ctx.fill();
        ctx.stroke();

        // B. Desenho das Bolinhas (Pips)
        ctx.shadowColor = "transparent"; // Remove sombra interna para as bolinhas ficarem nítidas
        ctx.fillStyle = '#d9534f'; // Cor das bolinhas (Vermelho suave)
        
        const center = size / 2;
        const q1 = size * 0.25; // 25% da largura
        const q3 = size * 0.75; // 75% da largura

        // Helper para desenhar uma bolinha
        const dot = (dx, dy) => {
            ctx.beginPath();
            ctx.arc(x + dx, y + dy, 18, 0, Math.PI * 2);
            ctx.fill();
        };

        // Lógica de posicionamento (Matemática do dado)
        // Centro (ímpares: 1, 3, 5)
        if (numero % 2 === 1) dot(center, center);
        
        // Diagonais (maiores que 1)
        if (numero > 1) { dot(q1, q1); dot(q3, q3); } // Superior Esq / Inferior Dir
        
        // Diagonais Inversas (maiores que 3)
        if (numero > 3) { dot(q3, q1); dot(q1, q3); } // Superior Dir / Inferior Esq
        
        // Laterais (apenas o 6)
        if (numero === 6) { dot(q1, center); dot(q3, center); }
    };

    // --- Função de Loop da Animação ---
    const animarRolagem = () => {
        // Gera um número aleatório para este frame
        const numeroSorteado = Math.floor(Math.random() * 6) + 1;
        
        // Desenha esse número
        desenharFace(numeroSorteado);

        frames++;

        if (frames < totalFrames) {
            // Se ainda não acabou os frames, chama o próximo frame
            requestAnimationFrame(animarRolagem);
        } else {
            // Animação terminou: Mostra o texto final
            mainText.textContent = `DICE: ${numeroSorteado}`;
            mainText.style.letterSpacing = '4px';
        }
    };

    // Inicia a animação
    animarRolagem();
},

};

// --- Ouvinte de Eventos Global ---
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    
    // Limpa a tela antes de qualquer nova ação
    resetScreen();
    
    // Verifica se existe uma ação para a tecla pressionada
    if (keyActions[key]) {
        keyActions[key]();
    } else {
        // Fallback para teclas sem função
        mainText.textContent = `Tecla ${key.toUpperCase()} - (Sem função definida)`;
        mainText.style.fontSize = '4rem';
    }
});
