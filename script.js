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
        /* 
           TECLA B - IDEIA:
           - Mostra texto BASKETBALL com fonte graffiti
           - Inicia mini-jogo simples de arremesso (círculo)
           - Visual curto e automático
        */
        
        // Configuração Visual
        mainText.textContent = 'BASKETBALL';
        mainText.classList.add('font-graffiti');
        
        // Ativar Canvas
        canvas.classList.remove('hidden');
        canvas.width = 400;
        canvas.height = 300;
        
        // Lógica simples do jogo (Bola caindo)
        let ballY = 50;
        let speed = 0;
        const gravity = 0.5;
        
        function animateBasket() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Desenha a "bola"
            ctx.beginPath();
            ctx.arc(200, ballY, 20, 0, Math.PI * 2);
            ctx.fillStyle = '#ff8c00';
            ctx.fill();
            ctx.closePath();
            
            // Física simples
            if (ballY < 250) {
                speed += gravity;
                ballY += speed;
                currentAnimationId = requestAnimationFrame(animateBasket);
            } else {
                // Efeito de "quicar" no chão
                if (speed > 2) {
                    speed = -speed * 0.9;
                    ballY += speed;
                    currentAnimationId = requestAnimationFrame(animateBasket);
                }
            }

        }
        animateBasket();
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
