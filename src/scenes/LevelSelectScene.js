// Level Select Scene for O Homem que Calculava
// Displays all available levels for the player to choose from

class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
        this.gameController = null;
    }

    create() {
        this.gameController = this.registry.get('gameController');

        this.cameras.main.fadeIn(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);

        this.createBackground();
        this.createTitle();
        this.createLevelButtons();
    }

    createBackground() {
        const { width, height } = this.sys.game.config;

        const bg = this.add.graphics();
        bg.fillGradientStyle(0x2c1810, 0x2c1810, 0x1a0d08, 0x1a0d08, 1);
        bg.fillRect(0, 0, width, height);

        // Decorative golden border
        const border = this.add.graphics();
        border.lineStyle(3, GameConfig.COLORS.SECONDARY, 0.6);
        border.strokeRect(20, 20, width - 40, height - 40);
    }

    createTitle() {
        const { width } = this.sys.game.config;

        this.add.text(width / 2, 55, 'Escolha sua Aventura', {
            fontSize: '36px',
            fill: '#d4af37',
            fontFamily: 'Arial, serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Decorative line
        const line = this.add.graphics();
        line.lineStyle(2, GameConfig.COLORS.SECONDARY, 0.7);
        line.lineBetween(80, 85, width - 80, 85);
    }

    createLevelButtons() {
        const { width } = this.sys.game.config;
        const levels = this.gameController?.gameData?.levels || [];

        const startY = 108;
        const buttonH = 70;
        const gap = 8;
        const bx = 80;
        const bw = width - 160;

        levels.forEach((level, index) => {
            const y = startY + index * (buttonH + gap);
            this.createLevelButton(level, bx, y, bw, buttonH);
        });
    }

    createLevelButton(level, x, y, w, h) {
        const btn = this.add.graphics();
        btn.fillStyle(GameConfig.COLORS.PRIMARY, 0.85);
        btn.lineStyle(2, GameConfig.COLORS.SECONDARY, 1);
        btn.fillRoundedRect(x, y, w, h, 10);
        btn.strokeRoundedRect(x, y, w, h, 10);

        // Level number badge (golden circle)
        const badge = this.add.graphics();
        badge.fillStyle(GameConfig.COLORS.SECONDARY, 1);
        badge.fillCircle(x + 38, y + h / 2, 25);

        this.add.text(x + 38, y + h / 2, String(level.id), {
            fontSize: '24px',
            fill: '#000000',
            fontFamily: 'Arial, serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Level title
        this.add.text(x + 80, y + h / 2, level.title, {
            fontSize: '22px',
            fill: '#ffffff',
            fontFamily: 'Arial, serif',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        // Make interactive
        btn.setInteractive(
            new Phaser.Geom.Rectangle(x, y, w, h),
            Phaser.Geom.Rectangle.Contains
        );

        btn.on('pointerover', () => {
            btn.clear();
            btn.fillStyle(GameConfig.COLORS.PRIMARY, 1);
            btn.lineStyle(3, GameConfig.COLORS.SECONDARY, 1);
            btn.fillRoundedRect(x, y, w, h, 10);
            btn.strokeRoundedRect(x, y, w, h, 10);
            this.input.setDefaultCursor('pointer');
        });

        btn.on('pointerout', () => {
            btn.clear();
            btn.fillStyle(GameConfig.COLORS.PRIMARY, 0.85);
            btn.lineStyle(2, GameConfig.COLORS.SECONDARY, 1);
            btn.fillRoundedRect(x, y, w, h, 10);
            btn.strokeRoundedRect(x, y, w, h, 10);
            this.input.setDefaultCursor('default');
        });

        btn.on('pointerdown', () => {
            this.input.setDefaultCursor('default');
            this.startLevel(level.id);
        });
    }

    startLevel(levelId) {
        this.gameController.setLevel(levelId);

        this.cameras.main.fadeOut(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('StoryScene');
        });
    }
}
