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

        // Background color based on success/failure
        const bgColor = this.questionResult.isCorrect ? 0x013220 : 0x8B0000; // Dark green or dark red

        const graphics = this.add.graphics();
        graphics.fillGradientStyle(bgColor, bgColor, 0x000000, 0x000000, 1);
        graphics.fillRect(0, 0, width, height);

        // Add decorative elements
        this.addResultDecorations();
    }

    // Add decorative elements based on result
    addResultDecorations() {
        const { width, height } = this.sys.game.config;

        const decorations = this.add.graphics();

        if (this.questionResult.isCorrect) {
            // Success decorations - golden elements
            decorations.lineStyle(2, GameConfig.COLORS.SECONDARY, 0.6);

            // Draw success symbols (simple diamonds instead of stars)
            for (let i = 0; i < 6; i++) {
                const angle = (360 / 6) * i;
                const x = width / 2 + Math.cos(Phaser.Math.DegToRad(angle)) * 100;
                const y = 150 + Math.sin(Phaser.Math.DegToRad(angle)) * 50;

                // Draw simple diamond shape
                decorations.strokeCircle(x, y, 15);
                decorations.strokeCircle(x, y, 8);
            }
        } else {
            // Failure decorations - simpler elements
            decorations.lineStyle(1, 0xFF6B35, 0.4);

            // Draw simple patterns
            for (let i = 0; i < 4; i++) {
                const x = 150 + (i * 200);
                decorations.strokeCircle(x, 150, 30);
            }
        }
    }

    // Create result UI elements
    createUI() {
        const { width, height } = this.sys.game.config;

        // Result header
        const resultText = this.questionResult.isCorrect ? 'PARABÉNS!' : 'RESPOSTA INCORRETA';
        const resultColor = this.questionResult.isCorrect ? '#32CD32' : '#FF4500';

        this.resultHeader = this.add.text(width / 2, 120, resultText, {
            fontSize: '36px',
            fill: resultColor,
            fontFamily: 'Arial, serif',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 2
        });
        this.resultHeader.setOrigin(0.5);
        this.resultHeader.setAlpha(0);

        // Answer summary
        const summaryText = this.questionResult.isCorrect
            ? `Você escolheu: ${this.questionResult.selectedAnswer} ✓`
            : `Você escolheu: ${this.questionResult.selectedAnswer}\nResposta correta: ${this.questionResult.correctAnswer}`;

        this.answerSummary = this.add.text(width / 2, 180, summaryText, {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            align: 'center',
            lineSpacing: 5
        });
        this.answerSummary.setOrigin(0.5);
        this.answerSummary.setAlpha(0);

        // Level indicator
        this.levelIndicator = this.add.text(50, 50, `Nível ${this.currentLevel.id}/20`, {
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
            targets: [this.resultHeader, this.answerSummary, this.levelIndicator],
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
        this.continueButton.fillRoundedRect(width / 2 - 120, height - 120, 240, 60, 15);
        this.continueButton.strokeRoundedRect(width / 2 - 120, height - 120, 240, 60, 15);
        this.continueButton.setVisible(false);

        this.continueButtonText = this.add.text(width / 2, height - 90, buttonText, {
            fontSize: '18px',
            fill: '#000000',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        });
        this.continueButtonText.setOrigin(0.5);
        this.continueButtonText.setVisible(false);

        // Make button interactive
        this.continueButton.setInteractive(
            new Phaser.Geom.Rectangle(width / 2 - 120, height - 120, 240, 60),
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

        // Start explanation after a short delay
        this.time.delayedCall(1500, () => {
            this.dialogueSystem.startDialogue(explanationDialogues, () => {
                this.showContinueButton();
            });
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

        // Add explanation steps
        if (this.currentLevel.explanation) {
            this.currentLevel.explanation.forEach((step, index) => {
                const character = index % 2 === 0 ? 'Beremiz' : 'Hassan';
                dialogues.push({
                    character: character,
                    text: step
                });
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