// Simplified main.js for debugging

window.addEventListener('load', () => {
    console.log('=== INICIANDO DEBUG ===');

    // Wait for all scripts to load
    setTimeout(() => {
        console.log('1. Checando Phaser...');
        console.log('Phaser disponível:', typeof Phaser !== 'undefined');
        if (typeof Phaser !== 'undefined') {
            console.log('Versão do Phaser:', Phaser.VERSION);
        }

        console.log('2. Checando GameConfig...');
        console.log('GameConfig disponível:', typeof GameConfig !== 'undefined');

        console.log('3. Checando classes do sistema...');
        console.log('DialogueSystem disponível:', typeof DialogueSystem !== 'undefined');
        console.log('QuestionSystem disponível:', typeof QuestionSystem !== 'undefined');
        console.log('AnimationSystem disponível:', typeof AnimationSystem !== 'undefined');

        console.log('4. Checando cenas...');
        console.log('IntroScene disponível:', typeof IntroScene !== 'undefined');
        console.log('StoryScene disponível:', typeof StoryScene !== 'undefined');
        console.log('QuestionScene disponível:', typeof QuestionScene !== 'undefined');
        console.log('ResultScene disponível:', typeof ResultScene !== 'undefined');

        console.log('5. Checando CalculavaGame...');
        console.log('CalculavaGame disponível:', typeof CalculavaGame !== 'undefined');

        console.log('6. Tentando criar o jogo...');

        // Hide loading
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';

        try {
            if (typeof CalculavaGame === 'undefined') {
                throw new Error('CalculavaGame não está definida');
            }

            const game = new CalculavaGame();
            window.game = game;
            console.log('✅ JOGO CRIADO COM SUCESSO!');

        } catch (error) {
            console.error('❌ ERRO AO CRIAR JOGO:', error);
            console.error('Stack trace:', error.stack);

            document.getElementById('game-container').innerHTML =
                '<div class="loading" style="color: #ff4500;">ERRO: ' + error.message +
                '<br><br>Abra o console (F12) para mais detalhes.</div>';
        }

    }, 200);
});