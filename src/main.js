// Main entry point for O Homem que Calculava game
// Initialize the game when the page loads

window.addEventListener('load', () => {
    // Wait a bit for all scripts to load
    setTimeout(() => {
        initializeGame();
    }, 100);
});

function initializeGame() {
    // Hide loading message
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }

    // Check if Phaser is loaded
    if (typeof Phaser === 'undefined') {
        console.error('Phaser.js não foi carregado!');
        document.getElementById('game-container').innerHTML = '<div class="loading">Erro: Phaser.js não carregado</div>';
        return;
    }

    try {
        // Start the game - this will fail if classes aren't loaded
        const game = new CalculavaGame();

        // Global reference for debugging
        window.game = game;
    } catch (error) {
        console.error('Erro ao iniciar o jogo:', error);

        // Show more detailed error message
        let errorMsg = 'Erro ao iniciar o jogo: ' + error.message;
        if (error.message.includes('CalculavaGame is not defined')) {
            errorMsg = 'Erro: Classe CalculavaGame não foi carregada. Verifique se o arquivo src/game.js está sendo carregado corretamente.';
        } else if (error.message.includes('Scene is not defined')) {
            errorMsg = 'Erro: Uma ou mais cenas do jogo não foram carregadas. Verifique os arquivos em src/scenes/.';
        }

        document.getElementById('game-container').innerHTML = '<div class="loading">' + errorMsg + '</div>';
    }
}