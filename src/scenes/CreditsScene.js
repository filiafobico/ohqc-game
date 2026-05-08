// Credits Scene for O Homem que Calculava

class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
    }

    create() {
        const { width, height } = this.sys.game.config;

        this.cameras.main.fadeIn(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);

        // Background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x2c1810, 0x2c1810, 0x1a0d08, 0x1a0d08, 1);
        bg.fillRect(0, 0, width, height);

        // Golden border
        const border = this.add.graphics();
        border.lineStyle(3, GameConfig.COLORS.SECONDARY, 0.7);
        border.strokeRect(20, 20, width - 40, height - 40);

        // Decorative top line
        const line = this.add.graphics();
        line.lineStyle(2, GameConfig.COLORS.SECONDARY, 0.5);
        line.lineBetween(80, 90, width - 80, 90);

        // Title
        this.add.text(width / 2, 55, 'Créditos', {
            fontSize: '34px',
            fill: '#d4af37',
            fontFamily: 'Arial, serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Credits content
        const contentX = width / 2;
        const startY = 150;
        const lineH = 48;

        const entries = [
            { label: 'Projeto de Extensão', value: 'Pegaí Leituras Grátis' },
            { label: 'Orientação', value: 'Dra. Diolete Marcante Lati Cerutti' },
            { label: 'Desenvolvimento', value: 'Luiç Oliveira' },
            { label: 'Baseado na obra', value: '"O Homem que Calculava" — Malba Tahan' },
            { label: 'UEPG', value: 'Universidade Estadual de Ponta Grossa' },
        ];

        entries.forEach((entry, i) => {
            const y = startY + i * lineH;

            this.add.text(contentX, y, entry.label, {
                fontSize: '16px',
                fill: '#d4af37',
                fontFamily: 'Arial, serif',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 1
            }).setOrigin(0.5);

            this.add.text(contentX, y + 20, entry.value, {
                fontSize: '20px',
                fill: '#ffffff',
                fontFamily: 'Arial, serif',
                stroke: '#000000',
                strokeThickness: 1
            }).setOrigin(0.5);
        });

        // Decorative bottom line
        const line2 = this.add.graphics();
        line2.lineStyle(2, GameConfig.COLORS.SECONDARY, 0.5);
        line2.lineBetween(80, height - 90, width - 80, height - 90);

        // Back button
        const btnW = 200, btnH = 48;
        const btnX = width / 2 - btnW / 2;
        const btnY = height - 70;

        const btn = this.add.graphics();
        btn.fillStyle(GameConfig.COLORS.PRIMARY, 1);
        btn.lineStyle(2, GameConfig.COLORS.SECONDARY, 1);
        btn.fillRoundedRect(btnX, btnY, btnW, btnH, 10);
        btn.strokeRoundedRect(btnX, btnY, btnW, btnH, 10);

        this.add.text(width / 2, btnY + btnH / 2, '← Voltar', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial, serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        btn.setInteractive(
            new Phaser.Geom.Rectangle(btnX, btnY, btnW, btnH),
            Phaser.Geom.Rectangle.Contains
        );

        btn.on('pointerover', () => {
            this.input.setDefaultCursor('pointer');
            btn.clear();
            btn.fillStyle(GameConfig.COLORS.PRIMARY, 0.7);
            btn.lineStyle(3, GameConfig.COLORS.SECONDARY, 1);
            btn.fillRoundedRect(btnX, btnY, btnW, btnH, 10);
            btn.strokeRoundedRect(btnX, btnY, btnW, btnH, 10);
        });

        btn.on('pointerout', () => {
            this.input.setDefaultCursor('default');
            btn.clear();
            btn.fillStyle(GameConfig.COLORS.PRIMARY, 1);
            btn.lineStyle(2, GameConfig.COLORS.SECONDARY, 1);
            btn.fillRoundedRect(btnX, btnY, btnW, btnH, 10);
            btn.strokeRoundedRect(btnX, btnY, btnW, btnH, 10);
        });

        btn.on('pointerdown', () => {
            this.input.setDefaultCursor('default');
            this.cameras.main.fadeOut(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('IntroScene');
            });
        });
    }
}
