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

        console.log('QuestionScene criada para nível:', this.currentLevel.id);
    }

    // Create question scene background
    createBackground() {
        const { width, height } = this.sys.game.config;

        // Create a more focused background for questions
        const graphics = this.add.graphics();

        // Dark gradient background for focus
        graphics.fillGradientStyle(0x2F4F4F, 0x2F4F4F, 0x1C1C1C, 0x1C1C1C, 1);
        graphics.fillRect(0, 0, width, height);

        // Add subtle decorations
        this.addQuestionDecorations();
    }

    // Add decorative elements for question focus
    addQuestionDecorations() {
        const { width, height } = this.sys.game.config;

        const decorations = this.add.graphics();
        decorations.lineStyle(1, GameConfig.COLORS.SECONDARY, 0.3);

        // Geometric border pattern
        decorations.strokeRoundedRect(30, 30, width - 60, height - 60, 20);
        decorations.strokeRoundedRect(50, 50, width - 100, height - 100, 15);
    }

    // Create question UI elements
    createUI() {
        const { width } = this.sys.game.config;

        // Level indicator
        this.levelIndicator = this.add.text(50, 50, `Nível ${this.currentLevel.id}/20`, {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: { x: 10, y: 5 }
        });

        // Problem title
        this.problemTitle = this.add.text(width / 2, 100, this.currentLevel.title, {
            fontSize: '24px',
            fill: GameConfig.COLORS.SECONDARY,
            fontFamily: 'Arial, serif',
            fontStyle: 'bold'
        });
        this.problemTitle.setOrigin(0.5);

        // Instructions
        this.instructions = this.add.text(width / 2, 130, 'Escolha a resposta correta:', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif'
        });
        this.instructions.setOrigin(0.5);

        // Animate UI elements
        this.tweens.add({
            targets: [this.levelIndicator, this.problemTitle, this.instructions],
            alpha: { from: 0, to: 1 },
            duration: GameConfig.ANIMATIONS.FADE_DURATION,
            ease: 'Power2'
        });
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

        console.log('Resposta selecionada:', this.questionResult);

        // Show feedback animation
        if (isCorrect) {
            this.showSuccessFeedback();
        } else {
            this.showFailureFeedback();
        }
    }

    // Show success feedback
    showSuccessFeedback() {
        // Play success animation
        this.animationSystem.showSuccessAnimation(() => {
            // Special animation for camel level
            if (this.currentLevel.id === 1) {
                this.showCamelAnimation();
            } else {
                this.moveToResults();
            }
        });
    }

    // Show failure feedback
    showFailureFeedback() {
        // Play failure animation
        this.animationSystem.showFailureAnimation(() => {
            this.moveToResults();
        });
    }

    // Show special camel counting animation for level 1
    showCamelAnimation() {
        if (this.currentLevel.id === 1) {
            // Animate the camel division
            const divisions = [18, 12, 4]; // Correct division for 35 camels problem

            this.animationSystem.animateCamelCounting(36, divisions, () => {
                this.moveToResults();
            });
        } else {
            this.moveToResults();
        }
    }

    // Move to results scene
    moveToResults() {
        // Store result data for results scene
        this.registry.set('questionResult', this.questionResult);

        // Delay before transition
        this.time.delayedCall(1000, () => {
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