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
        this.load.image('vendedor-portrait', 'assets/vendedor_portrait.png');
        this.load.image('oleiro-portrait', 'assets/oleiro-portrait.png');
        this.load.image('raja-portrait', 'assets/raja-portrait.png');
        this.load.image('inventor-portrait', 'assets/inventor-portrait.png');
        this.load.image('vizir-portrait', 'assets/vizir-portrait.png');
        this.load.image('princesa-portrait', 'assets/princesa-portrait.png');
        this.load.image('pretendente-portrait', 'assets/pretendente-portrait.png');

        // Load background images
        this.load.image('level_1_bg', 'assets/level_1_bg.png');
        this.load.image('level_2_bg', 'assets/level_2_bg.png');
        this.load.image('level_3_bg', 'assets/level_3_bg.png');
        this.load.image('level_4_bg', 'assets/level_4_bg.png');
        this.load.image('level_5_bg', 'assets/level_5_bg.png');
        this.load.image('level_6_bg', 'assets/level_6_bg.png');
        this.load.image('level_7_bg', 'assets/level_7_bg.png');
        this.load.image('level_8_bg', 'assets/level_8_bg.png');
        this.load.image('level_9_bg', 'assets/level_9_bg.png');
        this.load.image('level_10_bg', 'assets/level_10_bg.png');

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
        const button_params = [width / 2 - 400, height / 2 - 20, 350, 60];
        // Only create start button as invisible clickable area - image provides the visual button
        const startButton = this.add.graphics();
        startButton.fillStyle(0x000000, 0); // Transparent
        startButton.fillRect(...button_params); // Adjust position to match image button

        // Make button interactive
        startButton.setInteractive(
            new Phaser.Geom.Rectangle(...button_params),
            Phaser.Geom.Rectangle.Contains
        );

        // Button click - start game
        startButton.on('pointerdown', () => {
            this.startGame();
        });

        startButton.on('pointerover', () => {
            this.input.setDefaultCursor('pointer');
        });

        startButton.on('pointerout', () => {
            this.input.setDefaultCursor('default');
        });

        // Credits button — invisible hit area matching image position
        const credits_params = [width / 2 - 400, height / 2 + 60, 230, 55];
        const creditsButton = this.add.graphics();
        creditsButton.fillStyle(0x000000, 0);
        creditsButton.fillRect(...credits_params);

        creditsButton.setInteractive(
            new Phaser.Geom.Rectangle(...credits_params),
            Phaser.Geom.Rectangle.Contains
        );

        creditsButton.on('pointerdown', () => {
            this.cameras.main.fadeOut(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('CreditsScene');
            });
        });

        creditsButton.on('pointerover', () => {
            this.input.setDefaultCursor('pointer');
        });

        creditsButton.on('pointerout', () => {
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

    // Start the game - transition to level select
    startGame() {
        // Fade out animation
        this.cameras.main.fadeOut(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('LevelSelectScene');
        });
    }
}