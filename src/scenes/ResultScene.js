// Result Scene for O Homem que Calculava
// Shows explanation and handles level progression

class ResultScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultScene' });
        this.gameController = null;
        this.dialogueSystem = null;
        this.currentLevel = null;
        this.questionResult = null;
    }

    create() {
        // Get game controller reference
        this.gameController = this.registry.get('gameController');

        // Get question result
        this.questionResult = this.registry.get('questionResult');

        // Get current level data
        this.currentLevel = this.gameController.getCurrentLevel();

        if (!this.currentLevel || !this.questionResult) {
            console.error('Dados incompletos para ResultScene');
            this.scene.start('IntroScene');
            return;
        }

        // Create scene
        this.createBackground();
        this.saveProgress();
        this.createUI();
        this.setupDialogueSystem();
        this.showResults();
    }

    // Save level completion to localStorage
    saveProgress() {
        const key = 'calculava_progress';
        let progress = {};
        try {
            progress = JSON.parse(localStorage.getItem(key) || '{}');
        } catch (e) { progress = {}; }

        const levelId = String(this.currentLevel.id);
        // Only upgrade: if already 'correct', keep it even if now wrong
        if (this.questionResult.isCorrect || progress[levelId] !== 'correct') {
            progress[levelId] = this.questionResult.isCorrect ? 'correct' : 'incorrect';
        }

        localStorage.setItem(key, JSON.stringify(progress));
    }

    // Create result scene background
    createBackground() {
        const { width, height } = this.sys.game.config;

        // Use success.png or error.png as background based on result
        const backgroundKey = this.questionResult.isCorrect ? 'success' : 'error';

        try {
            // Try to load result background image
            const bgImage = this.add.image(width / 2, height / 2, backgroundKey);
            bgImage.setDisplaySize(width, height);
            bgImage.setAlpha(0.9); // Slightly transparent for text readability
        } catch (error) {
            console.warn(`⚠️ Fallback para background programático:`, error);

            // Fallback to colored background
            const bgColor = this.questionResult.isCorrect ? 0x013220 : 0x8B0000; // Dark green or dark red
            const graphics = this.add.graphics();
            graphics.fillGradientStyle(bgColor, bgColor, 0x000000, 0x000000, 1);
            graphics.fillRect(0, 0, width, height);
        }

        // Remove decorative elements since image provides the visual feedback
    }

    // Create result UI elements
    createUI() {
        const { width, height } = this.sys.game.config;

        // Remove feedback messages - images provide visual feedback
        // Only keep essential UI elements

        // Level indicator
        this.levelIndicator = this.add.text(50, 50, `Aventura ${this.currentLevel.id}/${this.gameController.getMaxLevels()}`, {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: { x: 10, y: 5 }
        });
        this.levelIndicator.setAlpha(0);

        // Animate UI elements
        this.tweens.add({
            targets: [this.levelIndicator],
            alpha: { from: 0, to: 1 },
            duration: GameConfig.ANIMATIONS.FADE_DURATION,
            ease: 'Power2'
        });
    }

    // Setup dialogue system
    setupDialogueSystem() {
        this.dialogueSystem = new DialogueSystem(this);
    }

    // Show results and explanation
    showResults() {
        // Create explanation dialogue
        const explanationDialogues = this.createExplanationDialogues();

        // Start explanation immediately - no need for delay since visual feedback is provided by background image
        this.dialogueSystem.startDialogue(explanationDialogues, () => {
            this.proceedToNext();
        });
    }

    // Create explanation dialogues
    createExplanationDialogues() {
        const dialogues = [];

        if (this.questionResult.isCorrect) {
            dialogues.push({
                character: 'Beremiz',
                text: 'Excelente! Você resolveu corretamente o problema.'
            });
        } else {
            dialogues.push({
                character: 'Beremiz',
                text: 'Não se preocupe! Deixe-me explicar a solução correta.'
            });
        }

        // Add explanation steps - now using character and text from configuration
        if (this.currentLevel.explanation) {
            this.currentLevel.explanation.forEach((step) => {
                if (typeof step === 'object' && step.character && step.text) {
                    // New format with configured character
                    dialogues.push({
                        character: step.character,
                        text: step.text
                    });
                } else {
                    // Fallback for old format (simple string)
                    dialogues.push({
                        character: 'Beremiz',
                        text: typeof step === 'string' ? step : step.text
                    });
                }
            });
        }

        // Add closing dialogue
        dialogues.push({
            character: 'Hassan',
            text: this.questionResult.isCorrect
                ? 'Mais uma vez, Beremiz demonstra sua sabedoria!'
                : 'Agora você entende a solução! Vamos continuar nossa jornada.'
        });

        return dialogues;
    }

    // Proceed to level select
    proceedToNext() {
        this.cameras.main.fadeOut(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('LevelSelectScene');
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