// Main entry point for O Homem que Calculava game
// Initialize the game when the page loads

window.addEventListener('load', () => {
    console.log('Página carregada, aguardando inicialização...');

    // Wait longer for all scripts to load, especially on slower connections
    setTimeout(() => {
        initializeGame();
    }, 500);
});

function initializeGame() {
    console.log('Iniciando O Homem que Calculava...');

    // Hide loading message
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }

    // Check if Phaser is loaded
    if (typeof Phaser === 'undefined') {
        console.error('Phaser.js não foi carregado!');
        document.getElementById('game-container').innerHTML = '<div class="loading">Erro: Phaser.js não carregado. Tente recarregar a página.</div>';
        return;
    }
    console.log('✓ Phaser carregado:', Phaser.VERSION);

    // Simple check for main class
    if (typeof CalculavaGame === 'undefined') {
        console.error('CalculavaGame não foi carregada!');
        document.getElementById('game-container').innerHTML =
            '<div class="loading">Erro: CalculavaGame não foi carregada.<br><br>' +
            'Tente:<br>' +
            '1. Recarregar a página (Ctrl+F5)<br>' +
            '2. Verificar se todos os arquivos estão no lugar correto<br>' +
            '3. Usar <a href="index-debug.html" style="color: #d4af37;">modo debug</a> para mais informações</div>';
        return;
    }

    try {
        console.log('✓ Iniciando jogo...');
        // Start the game
        const game = new CalculavaGame();

        // Global reference for debugging
        window.game = game;
        console.log('✅ Jogo iniciado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao iniciar o jogo:', error);
        console.error('Stack trace:', error.stack);

        // Show more detailed error message
        let errorMsg = '❌ Erro ao iniciar o jogo: ' + error.message + '<br><br>';

        if (error.message.includes('is not defined')) {
            errorMsg += 'Uma classe necessária não foi carregada.<br>';
            errorMsg += 'Tente recarregar a página (Ctrl+F5).<br><br>';
        }

        errorMsg += '<a href="index-debug.html" style="color: #d4af37;">🔍 Usar modo debug</a> para mais detalhes.<br>';
        errorMsg += 'Abra o console do navegador (F12) para ver o erro completo.';

        document.getElementById('game-container').innerHTML = '<div class="loading" style="color: #ff4500;">' + errorMsg + '</div>';
    }
}