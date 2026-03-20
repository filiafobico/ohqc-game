// Question System for O Homem que Calculava
// Handles multiple choice math questions and answer validation

class QuestionSystem {
    constructor(scene) {
        this.scene = scene;
        this.question = null;
        this.options = [];
        this.correctIndex = -1;
        this.selectedIndex = -1;
        this.isAnswered = false;
        this.onAnswer = null;

        this.questionElements = [];
        this.optionButtons = [];
        this.optionTexts = [];
    }

    // Display a question with multiple choice options
    displayQuestion(questionData, onAnswer = null) {
        this.question = questionData.question;
        this.options = questionData.options;
        this.correctIndex = questionData.correctIndex;
        this.onAnswer = onAnswer;
        this.isAnswered = false;
        this.selectedIndex = -1;

        this.createQuestionUI();
        this.showQuestionUI();
    }

    // Create question UI elements
    createQuestionUI() {
        const { width, height } = this.scene.sys.game.config;

        // Clear previous elements
        this.clearQuestionUI();

        // Question background
        const questionBg = this.scene.add.graphics();
        questionBg.fillStyle(0x000000, 0.9);
        questionBg.lineStyle(3, GameConfig.COLORS.SECONDARY);
        questionBg.fillRoundedRect(60, 90, width - 120, height - 180, 20);
        questionBg.strokeRoundedRect(60, 90, width - 120, height - 180, 20);
        questionBg.setAlpha(0);
        this.questionElements.push(questionBg);

        // Question text
        const questionText = this.scene.add.text(width / 2, 140, this.question, {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            wordWrap: { width: width - 180, useAdvancedWrap: true },
            align: 'center',
            lineSpacing: 6
        });
        questionText.setOrigin(0.5);
        questionText.setAlpha(0);
        this.questionElements.push(questionText);

        // Create option buttons
        this.createOptionButtons();
    }

    // Create multiple choice option buttons
    createOptionButtons() {
        const { width } = this.scene.sys.game.config;
        const startY = 200; // Reduced from 360
        const spacing = 45;  // Reduced from 70

        this.options.forEach((option, index) => {
            const y = startY + (index * spacing);

            // Option button background
            const button = this.scene.add.graphics();
            button.fillStyle(GameConfig.COLORS.PRIMARY, 0.8);
            button.lineStyle(2, GameConfig.COLORS.SECONDARY);
            button.fillRoundedRect(80, y - 18, width - 160, 36, 8);
            button.strokeRoundedRect(80, y - 18, width - 160, 36, 8);
            button.setAlpha(0);
            this.optionButtons.push(button);
            this.questionElements.push(button);

            // Option text
            const optionText = this.scene.add.text(width / 2, y, `${String.fromCharCode(65 + index)}) ${option}`, {
                fontSize: '14px',
                fill: '#ffffff',
                fontFamily: 'Arial, sans-serif',
                fontStyle: 'bold'
            });
            optionText.setOrigin(0.5);
            optionText.setAlpha(0);
            this.optionTexts.push(optionText);
            this.questionElements.push(optionText);

            // Make button interactive
            button.setInteractive(
                new Phaser.Geom.Rectangle(80, y - 18, width - 160, 36),
                Phaser.Geom.Rectangle.Contains
            );

            // Button hover effects
            button.on('pointerover', () => {
                if (!this.isAnswered) {
                    button.clear();
                    button.fillStyle(GameConfig.COLORS.PRIMARY, 1);
                    button.lineStyle(3, GameConfig.COLORS.SECONDARY);
                    button.fillRoundedRect(80, y - 18, width - 160, 36, 8);
                    button.strokeRoundedRect(80, y - 18, width - 160, 36, 8);

                    optionText.setScale(GameConfig.ANIMATIONS.BUTTON_HOVER_SCALE);
                }
            });

            button.on('pointerout', () => {
                if (!this.isAnswered && this.selectedIndex !== index) {
                    button.clear();
                    button.fillStyle(GameConfig.COLORS.PRIMARY, 0.8);
                    button.lineStyle(2, GameConfig.COLORS.SECONDARY);
                    button.fillRoundedRect(80, y - 18, width - 160, 36, 8);
                    button.strokeRoundedRect(80, y - 18, width - 160, 36, 8);

                    optionText.setScale(1);
                }
            });

            // Button click
            button.on('pointerdown', () => {
                if (!this.isAnswered) {
                    this.selectOption(index);
                }
            });
        });
    }

    // Handle option selection
    selectOption(index) {
        this.selectedIndex = index;
        this.isAnswered = true;

        // Update all buttons to show selection
        this.updateButtonStates();

        // Delay before calling callback
        this.scene.time.delayedCall(1000, () => {
            if (this.onAnswer) {
                this.onAnswer(index, index === this.correctIndex);
            }
        });
    }

    // Update button visual states after selection
    updateButtonStates() {
        const { width } = this.scene.sys.game.config;
        const startY = 200; // Updated to match new coordinates
        const spacing = 45;  // Updated to match new coordinates

        this.optionButtons.forEach((button, index) => {
            const y = startY + (index * spacing);

            button.clear();

            if (index === this.correctIndex) {
                // Correct answer - green
                button.fillStyle(0x32CD32, 0.8);
                button.lineStyle(3, 0x228B22);
            } else if (index === this.selectedIndex) {
                // Selected wrong answer - red
                button.fillStyle(0xFF4500, 0.8);
                button.lineStyle(3, 0xDC143C);
            } else {
                // Unselected - dimmed
                button.fillStyle(GameConfig.COLORS.PRIMARY, 0.4);
                button.lineStyle(1, GameConfig.COLORS.SECONDARY);
            }

            button.fillRoundedRect(80, y - 18, width - 160, 36, 8);
            button.strokeRoundedRect(80, y - 18, width - 160, 36, 8);

            // Reset text scale
            this.optionTexts[index].setScale(1);
        });

        // Add visual feedback animation
        this.scene.tweens.add({
            targets: this.optionButtons[this.selectedIndex],
            scaleX: { from: 1, to: 1.05 },
            scaleY: { from: 1, to: 1.05 },
            duration: 200,
            yoyo: true,
            ease: 'Power2'
        });
    }

    // Show question UI with animations
    showQuestionUI() {
        this.scene.tweens.add({
            targets: this.questionElements,
            alpha: { from: 0, to: 1 },
            duration: GameConfig.ANIMATIONS.FADE_DURATION,
            ease: 'Power2',
            delay: (target, index) => index * 100 // Stagger animation
        });
    }

    // Hide question UI
    hideQuestionUI() {
        return new Promise((resolve) => {
            this.scene.tweens.add({
                targets: this.questionElements,
                alpha: { from: 1, to: 0 },
                duration: GameConfig.ANIMATIONS.FADE_DURATION,
                ease: 'Power2',
                onComplete: () => {
                    this.clearQuestionUI();
                    resolve();
                }
            });
        });
    }

    // Clear all question UI elements
    clearQuestionUI() {
        this.questionElements.forEach(element => {
            if (element && element.destroy) {
                element.destroy();
            }
        });

        this.questionElements = [];
        this.optionButtons = [];
        this.optionTexts = [];
    }

    // Get result of the question
    getResult() {
        return {
            selectedIndex: this.selectedIndex,
            correctIndex: this.correctIndex,
            isCorrect: this.selectedIndex === this.correctIndex,
            selectedAnswer: this.options[this.selectedIndex] || null,
            correctAnswer: this.options[this.correctIndex] || null
        };
    }

    // Cleanup
    destroy() {
        this.clearQuestionUI();
    }
}