// Simplified Intro Scene for debugging
// Shows basic elements to test rendering

class IntroSceneSimple extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        console.log('IntroScene preload iniciado');
        // Skip complex image loading for now
    }

    create() {
        console.log('IntroScene create iniciado');

        const { width, height } = this.sys.game.config;

        // Test basic graphics rendering
        this.createSimpleBackground();
        this.createSimpleText();
        this.createSimpleButton();

        console.log('IntroScene criada - versão simples');
    }

    createSimpleBackground() {
        const { width, height } = this.sys.game.config;

        // Create simple colored background using graphics
        const bg = this.add.graphics();
        bg.fillStyle(0x8B4513, 1); // Brown background
        bg.fillRect(0, 0, width, height);

        // Add simple decorative rectangle
        const decoration = this.add.graphics();
        decoration.fillStyle(0xD4AF37, 1); // Gold border
        decoration.lineStyle(4, 0xD4AF37);
        decoration.strokeRect(20, 20, width - 40, height - 40);

        console.log('Background simples criado');
    }

    createSimpleText() {
        const { width, height } = this.sys.game.config;

        // Simple title text - no fancy styling
        const titleText = this.add.text(width / 2, height / 2 - 100, 'O HOMEM QUE CALCULAVA', {
            fontSize: '32px',
            fill: '#D4AF37',
            fontFamily: 'Arial'
        });
        titleText.setOrigin(0.5);

        // Simple subtitle
        const subtitleText = this.add.text(width / 2, height / 2 - 50, 'Aventuras de Beremiz', {
            fontSize: '20px',
            fill: '#FFFFFF',
            fontFamily: 'Arial'
        });
        subtitleText.setOrigin(0.5);

        // Status text
        const statusText = this.add.text(width / 2, height / 2 + 50, 'Clique para começar', {
            fontSize: '18px',
            fill: '#FFFFFF',
            fontFamily: 'Arial'
        });
        statusText.setOrigin(0.5);

        console.log('Textos simples criados');
    }

    createSimpleButton() {
        const { width, height } = this.sys.game.config;

        // Simple rectangular button
        const button = this.add.graphics();
        button.fillStyle(0xD4AF37, 1);
        button.lineStyle(2, 0xFFFFFF);
        button.fillRoundedRect(width / 2 - 75, height / 2 + 100, 150, 50, 5);
        button.strokeRoundedRect(width / 2 - 75, height / 2 + 100, 150, 50, 5);

        const buttonText = this.add.text(width / 2, height / 2 + 125, 'COMEÇAR', {
            fontSize: '16px',
            fill: '#000000',
            fontFamily: 'Arial'
        });
        buttonText.setOrigin(0.5);

        // Make button interactive
        button.setInteractive(
            new Phaser.Geom.Rectangle(width / 2 - 75, height / 2 + 100, 150, 50),
            Phaser.Geom.Rectangle.Contains
        );

        button.on('pointerdown', () => {
            console.log('Botão clicado - iniciando jogo');
            // For now just show a message
            buttonText.setText('JOGO INICIADO!');
            buttonText.setStyle({ fill: '#00FF00' });
        });

        button.on('pointerover', () => {
            button.setScale(1.05);
            buttonText.setScale(1.05);
        });

        button.on('pointerout', () => {
            button.setScale(1);
            buttonText.setScale(1);
        });

        console.log('Botão simples criado');
    }
}