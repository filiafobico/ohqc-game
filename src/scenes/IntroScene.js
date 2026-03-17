// Intro Scene for O Homem que Calculava
// Welcome screen and game introduction

class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
        this.gameController = null;
    }

    preload() {
        // Load character portraits
        this.load.image('beremiz-portrait', 'assets/beremiz_portrait.png');
        this.load.image('hassan-portrait', 'assets/hassan_portrait.png');
        this.load.image('mercador-portrait', 'assets/mercador_portrait.png');
        this.load.image('califa-portrait', 'assets/califa_portrait.png');
        this.load.image('poeta-portrait', 'assets/poeta_portrait.png');
        this.load.image('sabio-portrait', 'assets/sabio_portrait.png');
        this.load.image('viajante1-portrait', 'assets/viajante1_portrait.png');
        this.load.image('viajante2-portrait', 'assets/viajante2_portrait.png');

        // Load background images
        this.load.image('desert-caravan', 'assets/desert-caravan.png');
        this.load.image('bagda-market', 'assets/bagda-market.png');

        // Load result background images
        this.load.image('success', 'assets/success.png');
        this.load.image('error', 'assets/error.png');

        // Load initial screen image
        this.load.image('init-screen', 'assets/init_screen.png');

        // Load placeholder assets as fallback
        this.loadPlaceholderAssets();
    }

    create() {
        // Get game controller reference
        this.gameController = this.registry.get('gameController');

        // Create background
        this.createBackground();

        // Create UI elements
        this.createIntroUI();

        // Load game data
        this.loadGameData();
    }

    // Create simple assets using graphics instead of complex SVG
    loadPlaceholderAssets() {
        // Create textures using graphics instead of SVG
        const graphics = this.add.graphics();

        // Create logo texture programmatically
        graphics.fillStyle(0x8b4513, 1);
        graphics.fillRect(0, 0, 200, 100);
        graphics.generateTexture('logo', 200, 100);
        graphics.destroy();
    }

    // Create background with initial screen image
    createBackground() {
        const { width, height } = this.sys.game.config;

        // Use the initial screen image as background
        try {
            const bgImage = this.add.image(width / 2, height / 2, 'init-screen');
            bgImage.setDisplaySize(width, height);
        } catch (error) {
            console.warn('⚠️ Fallback para background programático:', error);

            // Fallback to gradient background
            const graphics = this.add.graphics();
            graphics.fillGradientStyle(0x8B4513, 0x8B4513, 0xD2691E, 0xD2691E, 1);
            graphics.fillRect(0, 0, width, height);
        }
    }

    // Create intro UI elements - minimal interface since image contains the visuals
    createIntroUI() {
        const { width, height } = this.sys.game.config;

        // Only create start button as invisible clickable area - image provides the visual button
        const startButton = this.add.graphics();
        startButton.fillStyle(0x000000, 0); // Transparent
        startButton.fillRect(width / 2 - 320, height / 2 + 40, 210, 60); // Adjust position to match image button

        // Make button interactive
        startButton.setInteractive(
            new Phaser.Geom.Rectangle(width / 2 - 320, height / 2 + 40, 210, 60),
            Phaser.Geom.Rectangle.Contains
        );

        // Button click - start game
        startButton.on('pointerdown', () => {
            this.startGame();
        });

        // Optional: Add hover effect to indicate clickable area (for testing)
        startButton.on('pointerover', () => {
            this.input.setDefaultCursor('pointer');
        });

        startButton.on('pointerout', () => {
            this.input.setDefaultCursor('default');
        });
    }

    // Load game data asynchronously
    async loadGameData() {
        try {
            if (this.gameController && this.gameController.loadGameData) {
                await this.gameController.loadGameData();
            } else {
                // GameController not available - using default data
            }
        } catch (error) {
            console.warn('Aviso: Erro ao carregar dados (continuando com fallback):', error);
            // Game will use fallback data - don't crash
        }
    }

    // Start the game - transition to first level
    startGame() {
        // Fade out animation
        this.cameras.main.fadeOut(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            // Start with first level story scene
            this.scene.start('StoryScene');
        });
    }
}