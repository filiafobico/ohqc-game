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
        this.addExitButton();
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

        this.add.text(width / 2, 48, 'Escolha sua Aventura', {
            fontSize: '30px',
            fill: '#d4af37',
            fontFamily: 'Arial, serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Decorative line
        const line = this.add.graphics();
        line.lineStyle(2, GameConfig.COLORS.SECONDARY, 0.7);
        line.lineBetween(80, 74, width - 80, 74);
    }

    createLevelButtons() {
        const { width } = this.sys.game.config;
        const levels = this.gameController?.gameData?.levels || [];

        // 2-column grid: levels 1-5 left, 6-10 right
        const marginX = 50;
        const colGap  = 20;
        const colW    = (width - marginX * 2 - colGap) / 2;
        const startY  = 88;
        const buttonH = 80;
        const rowGap  = 8;

        levels.forEach((level, index) => {
            const col = index < 5 ? 0 : 1;
            const row = index % 5;
            const x   = marginX + col * (colW + colGap);
            const y   = startY + row * (buttonH + rowGap);
            this.createLevelButton(level, x, y, colW, buttonH);
        });
    }

    createLevelButton(level, x, y, w, h) {
        const bgKey = level.backgroundImage || level.background;

        // Background thumbnail image clipped to button shape
        if (this.textures.exists(bgKey)) {
            const thumb = this.add.image(x + w / 2, y + h / 2, bgKey);
            thumb.setDisplaySize(w, h);
            const maskShape = this.make.graphics({ add: false });
            maskShape.fillStyle(0xffffff);
            maskShape.fillRoundedRect(x, y, w, h, 8);
            thumb.setMask(maskShape.createGeometryMask());
        } else {
            // Fallback solid color when image not loaded
            const fallback = this.add.graphics();
            fallback.fillStyle(GameConfig.COLORS.PRIMARY, 1);
            fallback.fillRoundedRect(x, y, w, h, 8);
        }

        // Dark overlay so text stays readable
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.52);
        overlay.fillRoundedRect(x, y, w, h, 8);

        // Golden border
        const border = this.add.graphics();
        border.lineStyle(2, GameConfig.COLORS.SECONDARY, 1);
        border.strokeRoundedRect(x, y, w, h, 8);

        // Level number badge (golden circle)
        const badgeR  = 22;
        const badgeCX = x + 32;
        const badgeCY = y + h / 2;
        const badge = this.add.graphics();
        badge.fillStyle(GameConfig.COLORS.SECONDARY, 1);
        badge.fillCircle(badgeCX, badgeCY, badgeR);

        this.add.text(badgeCX, badgeCY, String(level.id), {
            fontSize: '20px',
            fill: '#000000',
            fontFamily: 'Arial, serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Level title
        this.add.text(x + 64, y + h / 2, level.title, {
            fontSize: '17px',
            fill: '#ffffff',
            fontFamily: 'Arial, serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2,
            wordWrap: { width: w - 72 }
        }).setOrigin(0, 0.5);

        // Invisible hit area on top
        const hit = this.add.graphics();
        hit.fillStyle(0xffffff, 0.001);
        hit.fillRoundedRect(x, y, w, h, 8);
        hit.setInteractive(
            new Phaser.Geom.Rectangle(x, y, w, h),
            Phaser.Geom.Rectangle.Contains
        );

        hit.on('pointerover', () => {
            overlay.clear();
            overlay.fillStyle(0x000000, 0.28);
            overlay.fillRoundedRect(x, y, w, h, 8);
            border.clear();
            border.lineStyle(3, GameConfig.COLORS.SECONDARY, 1);
            border.strokeRoundedRect(x, y, w, h, 8);
            this.input.setDefaultCursor('pointer');
        });

        hit.on('pointerout', () => {
            overlay.clear();
            overlay.fillStyle(0x000000, 0.52);
            overlay.fillRoundedRect(x, y, w, h, 8);
            border.clear();
            border.lineStyle(2, GameConfig.COLORS.SECONDARY, 1);
            border.strokeRoundedRect(x, y, w, h, 8);
            this.input.setDefaultCursor('default');
        });

        hit.on('pointerdown', () => {
            this.input.setDefaultCursor('default');
            this.startLevel(level.id);
        });
    }

    addExitButton() {
        const { width } = this.sys.game.config;
        const btnW = 54, btnH = 36, btnX = width - 20 - btnW, btnY = 20;

        const btn = this.add.graphics();
        btn.fillStyle(0x000000, 0.7);
        btn.lineStyle(2, GameConfig.COLORS.SECONDARY, 0.9);
        btn.fillRoundedRect(btnX, btnY, btnW, btnH, 6);
        btn.strokeRoundedRect(btnX, btnY, btnW, btnH, 6);
        btn.setDepth(20);

        this.add.text(btnX + btnW / 2, btnY + btnH / 2, '⏻', {
            fontSize: '20px',
            fill: '#d4af37',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5).setDepth(20);

        btn.setInteractive(
            new Phaser.Geom.Rectangle(btnX, btnY, btnW, btnH),
            Phaser.Geom.Rectangle.Contains
        );
        btn.on('pointerover', () => {
            this.input.setDefaultCursor('pointer');
            btn.clear();
            btn.fillStyle(0x333333, 0.9);
            btn.lineStyle(2, GameConfig.COLORS.SECONDARY, 1);
            btn.fillRoundedRect(btnX, btnY, btnW, btnH, 6);
            btn.strokeRoundedRect(btnX, btnY, btnW, btnH, 6);
        });
        btn.on('pointerout', () => {
            this.input.setDefaultCursor('default');
            btn.clear();
            btn.fillStyle(0x000000, 0.7);
            btn.lineStyle(2, GameConfig.COLORS.SECONDARY, 0.9);
            btn.fillRoundedRect(btnX, btnY, btnW, btnH, 6);
            btn.strokeRoundedRect(btnX, btnY, btnW, btnH, 6);
        });
        btn.on('pointerdown', () => {
            this.input.setDefaultCursor('default');
            this.cameras.main.fadeOut(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('IntroScene');
            });
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
