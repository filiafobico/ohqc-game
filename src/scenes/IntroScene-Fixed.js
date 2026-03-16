// Fixed Intro Scene for O Homem que Calculava
// Corrected version with better asset loading and visibility

class IntroSceneFixed extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
        this.gameController = null;
    }

    preload() {
        // Create simple placeholder assets without complex SVG
        this.createSimpleAssets();
        console.log('Assets simples criados');
    }

    create() {
        // Get game controller reference (optional)
        this.gameController = this.registry.get('gameController') || null;

        // Create background
        this.createBackground();

        // Create UI elements (visible from start)
        this.createIntroUI();

        // Load game data (non-blocking)
        if (this.gameController) {
            this.loadGameData();
        }

        console.log('IntroScene criada - versão corrigida');
    }

    // Create simple assets using graphics instead of complex SVG
    createSimpleAssets() {
        // Create textures using graphics instead of SVG
        const graphics = this.add.graphics();

        // Create logo texture programmatically
        graphics.fillStyle(0x8b4513, 1);
        graphics.fillRect(0, 0, 200, 100);
        graphics.generateTexture('logo', 200, 100);
        graphics.destroy();

        console.log('Logo texture criada');
    }

    // Create background with Arabian theme
    createBackground() {
        const { width, height } = this.sys.game.config;

        // Create gradient background
        const graphics = this.add.graphics();

        // Desert sunset colors - simplified gradient
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRect(0, 0, width, height);

        // Add overlay gradient
        graphics.fillStyle(0xD2691E, 0.3);
        graphics.fillRect(0, height * 0.7, width, height * 0.3);

        // Add simple decorative elements
        this.createDecorations();

        console.log('Background criado');
    }

    // Create simple decorative elements
    createDecorations() {
        const { width, height } = this.sys.game.config;

        // Simple geometric patterns
        const decorations = this.add.graphics();
        decorations.lineStyle(2, GameConfig.COLORS.SECONDARY, 0.6);

        // Draw simple Arabic-inspired patterns
        for (let i = 0; i < 5; i++) {
            const x = 50 + (i * (width - 100) / 4);
            decorations.strokeCircle(x, 100, 20);
            decorations.strokeCircle(x, height - 100, 15);
        }

        console.log('Decorações criadas');
    }

    // Create intro UI elements - VISIBLE FROM START
    createIntroUI() {
        const { width, height } = this.sys.game.config;

        // Game title - VISIBLE immediately
        const titleText = this.add.text(width / 2, height / 2 - 150, 'O HOMEM QUE CALCULAVA', {
            fontSize: '42px',
            fill: GameConfig.COLORS.SECONDARY,
            fontFamily: 'Arial, serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        });
        titleText.setOrigin(0.5);
        // Remove setAlpha(0) - make it visible immediately

        // Subtitle - VISIBLE immediately
        const subtitleText = this.add.text(width / 2, height / 2 - 100, 'Aventuras de Beremiz Samir', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial, serif',
            fontStyle: 'italic'
        });
        subtitleText.setOrigin(0.5);
        // Remove setAlpha(0) - make it visible immediately

        // Description - VISIBLE immediately
        const descriptionText = this.add.text(width / 2, height / 2 - 30,
            'Um jogo educativo baseado no livro de Malba Tahan\n\n' +
            'Resolva problemas matemáticos junto com Beremiz\n' +
            'em sua jornada através do Oriente', {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            align: 'center',
            lineSpacing: 5
        });
        descriptionText.setOrigin(0.5);
        // Remove setAlpha(0) - make it visible immediately

        // Start button - VISIBLE immediately
        const startButton = this.add.graphics();
        startButton.fillStyle(GameConfig.COLORS.SECONDARY, 1);
        startButton.lineStyle(3, GameConfig.COLORS.PRIMARY);
        startButton.fillRoundedRect(width / 2 - 100, height / 2 + 80, 200, 60, 15);
        startButton.strokeRoundedRect(width / 2 - 100, height / 2 + 80, 200, 60, 15);
        // Remove setAlpha(0) - make it visible immediately

        const startButtonText = this.add.text(width / 2, height / 2 + 110, 'COMEÇAR AVENTURA', {
            fontSize: '18px',
            fill: '#000000',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        });
        startButtonText.setOrigin(0.5);
        // Remove setAlpha(0) - make it visible immediately

        // Make button interactive
        startButton.setInteractive(
            new Phaser.Geom.Rectangle(width / 2 - 100, height / 2 + 80, 200, 60),
            Phaser.Geom.Rectangle.Contains
        );

        // Button hover effects
        startButton.on('pointerover', () => {
            startButton.setScale(1.05);
            startButtonText.setScale(1.05);
        });

        startButton.on('pointerout', () => {
            startButton.setScale(1);
            startButtonText.setScale(1);
        });

        // Button click - start game
        startButton.on('pointerdown', () => {
            this.startGame();
        });

        // Optional: Add simple fade-in animation AFTER elements are visible
        const elements = [titleText, subtitleText, descriptionText, startButton, startButtonText];
        elements.forEach((element, index) => {
            element.setAlpha(0);
            this.tweens.add({
                targets: element,
                alpha: 1,
                duration: 500,
                delay: index * 100,
                ease: 'Power2.easeOut'
            });
        });

        // Credits text
        const creditsText = this.add.text(width / 2, height - 50,
            'Criado com Phaser.js • Inspirado em Malba Tahan', {
            fontSize: '12px',
            fill: GameConfig.COLORS.SECONDARY,
            fontFamily: 'Arial, sans-serif',
            alpha: 0.7
        });
        creditsText.setOrigin(0.5);

        console.log('UI elementos criados');
    }

    // Load game data asynchronously (non-blocking)
    async loadGameData() {
        try {
            if (this.gameController && this.gameController.loadGameData) {
                await this.gameController.loadGameData();
                console.log('Dados do jogo carregados com sucesso');
            }
        } catch (error) {
            console.warn('Aviso: Erro ao carregar dados (usando fallback):', error);
            // Game will use fallback data - don't crash
        }
    }

    // Start the game - transition to first level
    startGame() {
        console.log('Iniciando jogo...');

        // Fade out animation
        this.cameras.main.fadeOut(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            // For now, just restart the scene as proof it works
            console.log('Transição para próxima cena...');
            this.scene.restart();
            // Later: this.scene.start('StoryScene');
        });
    }
}