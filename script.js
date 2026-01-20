let timerId = null;
let isFocusMode = true;
let timeLeft = 1500; // 25 minutos padrão

function updateDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    document.getElementById('timer-display').innerText = timeString;
    document.title = timeString + " - FocusFlow";
}

function applyNewSettings() {
    // Só muda o tempo se o cronómetro estiver parado
    if (timerId === null) {
        const focusMins = parseInt(document.getElementById('input-focus').value) || 25;
        const breakMins = parseInt(document.getElementById('input-break').value) || 5;
        timeLeft = (isFocusMode ? focusMins : breakMins) * 60;
        updateDisplay();
    }
}

function toggleTimer() {
    const btn = document.getElementById('btn-start');
    const logo = document.getElementById('logo-timer');

    if (timerId !== null) {
        // PARAR O CRONÓMETRO
        clearInterval(timerId);
        timerId = null;
        btn.innerText = "Retomar";
        if (logo) logo.classList.remove('pulsing');
        console.log("Timer pausado.");
    } else {
        // COMEÇAR O CRONÓMETRO
        console.log("Timer iniciado.");
        btn.innerText = "Pausar";
        if (logo) logo.classList.add('pulsing');

        timerId = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timerId);
                timerId = null;
                if (logo) logo.classList.remove('pulsing');
                switchMode();
            }
        }, 1000);
    }
}

function switchMode() {
    isFocusMode = !isFocusMode;
    document.body.className = isFocusMode ? 'mode-focus' : 'mode-break';
    document.getElementById('status-label').innerText = isFocusMode ? 'Foco' : 'Pausa';
    
    // Alerta sonoro básico usando o sistema
    const beep = new AudioContext();
    const osc = beep.createOscillator();
    osc.connect(beep.destination);
    osc.start();
    osc.stop(beep.currentTime + 0.2);
    
    applyNewSettings();
}

function resetTimer() {
    console.log("Reiniciando o FocusFlow..."); // Verificação na consola (F12)
    
    // 1. Para o cronómetro imediatamente
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
    
    // 2. Reset de estados
    isFocusMode = true;
    
    // 3. Interface: Fundo e Textos
    document.body.className = 'mode-focus';
    
    const statusLabel = document.getElementById('status-label');
    if (statusLabel) statusLabel.innerText = 'Foco';
    
    const btnStart = document.getElementById('btn-start');
    if (btnStart) btnStart.innerText = "Começar";
    
    // 4. Parar a pulsação do TEU LOGO no footer
    const logo = document.getElementById('logo-timer');
    if (logo) logo.classList.remove('pulsing');
    
    // 5. Ler os inputs e atualizar os números no ecrã
    applyNewSettings(); 
}

// Inicia o display assim que o script carrega
updateDisplay();