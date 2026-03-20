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
        this.createUI();
        this.setupDialogueSystem();
        this.showResults();
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
        this.levelIndicator = this.add.text(50, 50, `Nível ${this.currentLevel.id}/${this.gameController.getMaxLevels()}`, {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: { x: 10, y: 5 }
        });
        this.levelIndicator.setAlpha(0);

        // Continue button (initially hidden)
        this.createContinueButton();

        // Animate UI elements
        this.tweens.add({
            targets: [this.levelIndicator],
            alpha: { from: 0, to: 1 },
            duration: GameConfig.ANIMATIONS.FADE_DURATION,
            ease: 'Power2'
        });
    }

    // Create continue button
    createContinueButton() {
        const { width, height } = this.sys.game.config;

        // Determine button text based on level progression
        const hasNextLevel = this.currentLevel.id < 20;
        const buttonText = hasNextLevel ? 'PRÓXIMO NÍVEL' : 'FINALIZAR JOGO';

        this.continueButton = this.add.graphics();
        this.continueButton.fillStyle(GameConfig.COLORS.SECONDARY, 1);
        this.continueButton.lineStyle(3, GameConfig.COLORS.PRIMARY);
        this.continueButton.fillRoundedRect(width / 2 - 120, height - 80, 240, 50, 15);
        this.continueButton.strokeRoundedRect(width / 2 - 120, height - 80, 240, 50, 15);
        this.continueButton.setVisible(false);

        this.continueButtonText = this.add.text(width / 2, height - 55, buttonText, {
            fontSize: '16px',
            fill: '#000000',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        });
        this.continueButtonText.setOrigin(0.5);
        this.continueButtonText.setVisible(false);

        // Make button interactive
        this.continueButton.setInteractive(
            new Phaser.Geom.Rectangle(width / 2 - 120, height - 80, 240, 50),
            Phaser.Geom.Rectangle.Contains
        );

        // Button click
        this.continueButton.on('pointerdown', () => {
            this.proceedToNext();
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
            this.showContinueButton();
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

    // Show continue button after explanation
    showContinueButton() {
        this.continueButton.setVisible(true);
        this.continueButtonText.setVisible(true);

        // Animate button appearance
        this.tweens.add({
            targets: [this.continueButton, this.continueButtonText],
            alpha: { from: 0, to: 1 },
            scaleX: { from: 0.8, to: 1 },
            scaleY: { from: 0.8, to: 1 },
            duration: GameConfig.ANIMATIONS.FADE_DURATION,
            ease: 'Back.easeOut'
        });
    }

    // Proceed to next level or finish game
    proceedToNext() {
        // Check if there are more levels
        const hasNextLevel = this.gameController.nextLevel();

        if (hasNextLevel) {
            // Go to next level story
            this.cameras.main.fadeOut(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);

            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('StoryScene');
            });
        } else {
            // Game completed - show final screen
            this.showGameComplete();
        }
    }

    // Show game completion screen
    showGameComplete() {
        // Clear scene
        this.cameras.main.fadeOut(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.showFinalScreen();
        });
    }

    // Show final completion screen
    showFinalScreen() {
        const { width, height } = this.sys.game.config;

        // Clear everything
        this.children.removeAll();

        // Fade in new content
        this.cameras.main.fadeIn(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);

        // Final background
        const finalBg = this.add.graphics();
        finalBg.fillGradientStyle(0x4B0082, 0x4B0082, 0x000000, 0x000000, 1);
        finalBg.fillRect(0, 0, width, height);

        // Completion message
        const finalText = this.add.text(width / 2, height / 2 - 50,
            'PARABÉNS!\n\nVocê completou todas as aventuras\nde O Homem que Calculava!\n\nObrigado por jogar!', {
            fontSize: '24px',
            fill: GameConfig.COLORS.SECONDARY,
            fontFamily: 'Arial, serif',
            fontStyle: 'bold',
            align: 'center',
            lineSpacing: 10
        });
        finalText.setOrigin(0.5);

        // Restart button
        const restartButton = this.add.text(width / 2, height / 2 + 100, 'JOGAR NOVAMENTE', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: GameConfig.COLORS.PRIMARY,
            padding: { x: 20, y: 10 }
        });
        restartButton.setOrigin(0.5);
        restartButton.setInteractive();

        restartButton.on('pointerdown', () => {
            this.gameController.reset();
            this.scene.start('IntroScene');
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