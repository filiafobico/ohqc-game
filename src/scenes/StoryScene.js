// Story Scene for O Homem que Calculava
// Displays narrative content and character dialogue for each level

class StoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StoryScene' });
        this.gameController = null;
        this.dialogueSystem = null;
        this.currentLevel = null;
    }

    create() {
        // Get game controller reference
        this.gameController = this.registry.get('gameController');

        // Get current level data
        this.currentLevel = this.gameController.getCurrentLevel();

        if (!this.currentLevel) {
            console.error('Nenhum nível encontrado');
            this.scene.start('IntroScene');
            return;
        }

        // Create scene
        this.createBackground();
        this.createUI();
        this.setupDialogueSystem();
        this.startStory();

        console.log('StoryScene criada para nível:', this.currentLevel.id);
    }

    // Create background based on level setting
    createBackground() {
        const { width, height } = this.sys.game.config;

        // Create background based on level's background setting
        const backgroundType = this.currentLevel.background || 'desert';

        const graphics = this.add.graphics();

        switch(backgroundType) {
            case 'desert':
                // Desert gradient
                graphics.fillGradientStyle(0xF4A460, 0xF4A460, 0x8B4513, 0x8B4513, 1);
                graphics.fillRect(0, 0, width, height);
                this.addDesertDecorations();
                break;
            case 'palace':
                // Palace gradient
                graphics.fillGradientStyle(0x4B0082, 0x4B0082, 0x8B008B, 0x8B008B, 1);
                graphics.fillRect(0, 0, width, height);
                this.addPalaceDecorations();
                break;
            case 'market':
                // Market gradient
                graphics.fillGradientStyle(0xFF8C00, 0xFF8C00, 0xD2691E, 0xD2691E, 1);
                graphics.fillRect(0, 0, width, height);
                this.addMarketDecorations();
                break;
            default:
                // Default desert
                graphics.fillGradientStyle(0xF4A460, 0xF4A460, 0x8B4513, 0x8B4513, 1);
                graphics.fillRect(0, 0, width, height);
                this.addDesertDecorations();
        }
    }

    // Add desert decorations
    addDesertDecorations() {
        const { width, height } = this.sys.game.config;

        const decorations = this.add.graphics();
        decorations.fillStyle(0x8B4513, 0.6);

        // Sand dunes
        for (let i = 0; i < 4; i++) {
            const x = (i * width / 3) + 100;
            const y = height - 200;
            decorations.fillEllipse(x, y, 200, 80);
        }

        // Simple sun
        decorations.fillStyle(GameConfig.COLORS.SECONDARY, 0.8);
        decorations.fillCircle(width - 100, 100, 50);
    }

    // Add palace decorations
    addPalaceDecorations() {
        const { width, height } = this.sys.game.config;

        const decorations = this.add.graphics();
        decorations.lineStyle(3, GameConfig.COLORS.SECONDARY, 0.8);

        // Arches
        for (let i = 0; i < 3; i++) {
            const x = 150 + (i * 250);
            decorations.strokeCircle(x, height - 100, 60);
            decorations.strokeRect(x - 60, height - 160, 120, 120);
        }
    }

    // Add market decorations
    addMarketDecorations() {
        const { width, height } = this.sys.game.config;

        const decorations = this.add.graphics();
        decorations.fillStyle(GameConfig.COLORS.SECONDARY, 0.6);

        // Market tents
        for (let i = 0; i < 4; i++) {
            const x = 100 + (i * 200);
            const y = height - 150;
            // Triangle tent shape
            decorations.fillTriangle(x, y - 80, x - 60, y, x + 60, y);
        }
    }

    // Create story UI elements
    createUI() {
        const { width } = this.sys.game.config;

        // Level title
        this.levelTitle = this.add.text(width / 2, 80, this.currentLevel.title, {
            fontSize: '28px',
            fill: GameConfig.COLORS.SECONDARY,
            fontFamily: 'Arial, serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.levelTitle.setOrigin(0.5);
        this.levelTitle.setAlpha(0);

        // Level number indicator
        this.levelIndicator = this.add.text(50, 50, `Nível ${this.currentLevel.id}/20`, {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: { x: 10, y: 5 }
        });
        this.levelIndicator.setAlpha(0);

        // Animate UI elements
        this.tweens.add({
            targets: [this.levelTitle, this.levelIndicator],
            alpha: { from: 0, to: 1 },
            duration: GameConfig.ANIMATIONS.FADE_DURATION,
            ease: 'Power2'
        });
    }

    // Setup dialogue system
    setupDialogueSystem() {
        this.dialogueSystem = new DialogueSystem(this);
    }

    // Start the story dialogue
    startStory() {
        // Convert story text to dialogue format
        const dialogues = this.createStoryDialogues();

        // Start dialogue sequence
        this.dialogueSystem.startDialogue(dialogues, () => {
            this.moveToQuestion();
        });
    }

    // Convert level story into dialogue format
    createStoryDialogues() {
        const dialogues = [];

        // Add narrator introduction
        dialogues.push({
            character: 'Hassan',
            text: `Nível ${this.currentLevel.id}: ${this.currentLevel.title}`
        });

        // Add story parts
        this.currentLevel.story.forEach((storyPart, index) => {
            const character = index === 0 ? 'Hassan' :
                           (index % 2 === 0 ? 'Hassan' : 'Beremiz');

            dialogues.push({
                character: character,
                text: storyPart
            });
        });

        // Add transition to question
        dialogues.push({
            character: 'Beremiz',
            text: 'Deixe-me pensar neste problema interessante...'
        });

        return dialogues;
    }

    // Move to question scene
    moveToQuestion() {
        // Fade out animation
        this.cameras.main.fadeOut(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            // Start question scene
            this.scene.start('QuestionScene');
        });
    }

    // Cleanup
    destroy() {
        if (this.dialogueSystem) {
            this.dialogueSystem.destroy();
        }
        super.destroy();
    }
}