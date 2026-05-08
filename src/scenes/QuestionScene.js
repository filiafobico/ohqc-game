// Question Scene for O Homem que Calculava
// Handles math problem presentation and answer selection

class QuestionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'QuestionScene' });
        this.gameController = null;
        this.questionSystem = null;
        this.animationSystem = null;
        this.currentLevel = null;
        this.questionResult = null;
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
        this.setupSystems();
        this.presentQuestion();
    }

    // Create question scene background
    createBackground() {
        const { width, height } = this.sys.game.config;

        try {
            // Use the backgroundImage from level configuration
            const backgroundKey = this.currentLevel.backgroundImage;

            const bgImage = this.add.image(width / 2, height / 2, backgroundKey);
            bgImage.setDisplaySize(width, height);
            bgImage.setAlpha(0.9); // Slightly more transparent for question readability

        } catch (error) {
            console.warn('⚠️ Fallback para background programático:', error);
        }

        // Add subtle decorations
        this.addQuestionDecorations();
    }

    // Add decorative elements for question focus
    addQuestionDecorations() {
        const { width, height } = this.sys.game.config;

        const decorations = this.add.graphics();
        decorations.lineStyle(2, 0xFFD700, 0.4); // Golden border for consistency with theme

        // Single elegant border frame
        decorations.strokeRoundedRect(30, 30, width - 60, height - 60, 15);

        // Subtle corner accents
        decorations.lineStyle(1, 0xFFD700, 0.6);
        decorations.strokeRoundedRect(20, 20, width - 40, height - 40, 20);
    }

    // Create question UI elements
    createUI() {
        const { width } = this.sys.game.config;

        // Level indicator
        this.levelIndicator = this.add.text(40, 40, `Aventura ${this.currentLevel.id}/${this.gameController.getMaxLevels()}`, {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: { x: 8, y: 4 }
        });

        // Problem title
        this.problemTitle = this.add.text(width / 2, 70, this.currentLevel.title, {
            fontSize: '22px',
            fill: GameConfig.COLORS.SECONDARY,
            fontFamily: 'Arial, serif',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.problemTitle.setOrigin(0.5);

        // Exit button (top-right)
        const exitElements = this.addExitButton();

        // Animate UI elements
        this.tweens.add({
            targets: [this.levelIndicator, this.problemTitle, ...exitElements],
            alpha: { from: 0, to: 1 },
            duration: GameConfig.ANIMATIONS.FADE_DURATION,
            ease: 'Power2'
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
        btn.setDepth(20).setAlpha(0);

        const txt = this.add.text(btnX + btnW / 2, btnY + btnH / 2, '⏻', {
            fontSize: '20px',
            fill: '#d4af37',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5).setDepth(20).setAlpha(0);

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
        return [btn, txt];
    }

    // Setup question and animation systems
    setupSystems() {
        this.questionSystem = new QuestionSystem(this);
        this.animationSystem = new AnimationSystem(this);
    }

    // Present the math question
    presentQuestion() {
        // Prepare question data
        const questionData = {
            question: this.currentLevel.question,
            options: this.currentLevel.options,
            correctIndex: this.currentLevel.correctIndex
        };

        // Display question with callback
        this.questionSystem.displayQuestion(questionData, (selectedIndex, isCorrect) => {
            this.handleAnswer(selectedIndex, isCorrect);
        });
    }

    // Handle answer selection
    handleAnswer(selectedIndex, isCorrect) {
        // Store result
        this.questionResult = {
            selectedIndex: selectedIndex,
            isCorrect: isCorrect,
            selectedAnswer: this.currentLevel.options[selectedIndex],
            correctAnswer: this.currentLevel.options[this.currentLevel.correctIndex]
        };

        // Show feedback animation
        if (isCorrect) {
            this.showSuccessFeedback();
        } else {
            this.showFailureFeedback();
        }
    }

    // Show success feedback
    showSuccessFeedback() {
        this.moveToResults();
    }

    // Show failure feedback
    showFailureFeedback() {
        this.moveToResults();
    }

    // Move to results scene
    moveToResults() {
        // Store result data for results scene
        this.registry.set('questionResult', this.questionResult);

        // Delay before transition
        this.time.delayedCall(200, () => {
            // Fade out animation
            this.cameras.main.fadeOut(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);

            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                // Start results scene
                this.scene.start('ResultScene');
            });
        });
    }

    // Cleanup
    destroy() {
        if (this.questionSystem) {
            this.questionSystem.destroy();
        }
        if (this.animationSystem) {
            this.animationSystem.destroy();
        }
        super.destroy();
    }
}