// Dialogue System for O Homem que Calculava
// Handles character conversations and narrative text display

class DialogueSystem {
    constructor(scene) {
        this.scene = scene;
        this.dialogues = [];
        this.currentDialogueIndex = 0;
        this.isDisplaying = false;
        this.onComplete = null;

        this.createDialogueUI();
    }

    // Create the dialogue UI elements
    createDialogueUI() {
        const { width, height } = this.scene.sys.game.config;

        // Dialogue box background
        this.dialogueBox = this.scene.add.graphics();
        this.dialogueBox.fillStyle(0x000000, 0.8);
        this.dialogueBox.lineStyle(3, GameConfig.COLORS.SECONDARY);
        this.dialogueBox.fillRoundedRect(50, height - 250, width - 100, 180, 15);
        this.dialogueBox.strokeRoundedRect(50, height - 250, width - 100, 180, 15);
        this.dialogueBox.setVisible(false);

        // Character portrait background
        this.portraitBg = this.scene.add.graphics();
        this.portraitBg.fillStyle(GameConfig.COLORS.PRIMARY, 0.9);
        this.portraitBg.lineStyle(2, GameConfig.COLORS.SECONDARY);
        this.portraitBg.fillRoundedRect(70, height - 230, 120, 120, 10);
        this.portraitBg.strokeRoundedRect(70, height - 230, 120, 120, 10);
        this.portraitBg.setVisible(false);

        // Character portrait (placeholder)
        this.portrait = this.scene.add.graphics();
        this.portrait.fillStyle(GameConfig.COLORS.ACCENT, 0.7);
        this.portrait.fillCircle(130, height - 170, 50);
        this.portrait.setVisible(false);

        // Character name text
        this.nameText = this.scene.add.text(210, height - 230, '', {
            fontSize: '20px',
            fill: GameConfig.COLORS.SECONDARY,
            fontFamily: 'Arial, serif',
            fontStyle: 'bold'
        });
        this.nameText.setVisible(false);

        // Dialogue text
        this.dialogueText = this.scene.add.text(210, height - 200, '', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            wordWrap: { width: width - 320, useAdvancedWrap: true },
            lineSpacing: 5
        });
        this.dialogueText.setVisible(false);

        // Continue button
        this.continueButton = this.scene.add.graphics();
        this.continueButton.fillStyle(GameConfig.COLORS.SECONDARY, 1);
        this.continueButton.fillRoundedRect(width - 200, height - 120, 130, 40, 8);
        this.continueButton.setVisible(false);
        this.continueButton.setInteractive(
            new Phaser.Geom.Rectangle(width - 200, height - 120, 130, 40),
            Phaser.Geom.Rectangle.Contains
        );

        this.continueButtonText = this.scene.add.text(width - 135, height - 105, 'Continuar', {
            fontSize: '14px',
            fill: '#000000',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        });
        this.continueButtonText.setOrigin(0.5);
        this.continueButtonText.setVisible(false);

        // Button hover effects
        this.continueButton.on('pointerover', () => {
            this.continueButton.clear();
            this.continueButton.fillStyle(GameConfig.COLORS.SECONDARY, 0.8);
            this.continueButton.fillRoundedRect(width - 200, height - 120, 130, 40, 8);
        });

        this.continueButton.on('pointerout', () => {
            this.continueButton.clear();
            this.continueButton.fillStyle(GameConfig.COLORS.SECONDARY, 1);
            this.continueButton.fillRoundedRect(width - 200, height - 120, 130, 40, 8);
        });

        // Continue button click
        this.continueButton.on('pointerdown', () => {
            this.nextDialogue();
        });
    }

    // Start displaying dialogue sequence
    startDialogue(dialogues, onComplete = null) {
        this.dialogues = dialogues;
        this.currentDialogueIndex = 0;
        this.onComplete = onComplete;
        this.isDisplaying = true;

        this.showDialogueUI();
        this.displayCurrentDialogue();
    }

    // Show dialogue UI elements
    showDialogueUI() {
        this.dialogueBox.setVisible(true);
        this.portraitBg.setVisible(true);
        this.portrait.setVisible(true);
        this.nameText.setVisible(true);
        this.dialogueText.setVisible(true);
        this.continueButton.setVisible(true);
        this.continueButtonText.setVisible(true);

        // Fade in animation
        this.scene.tweens.add({
            targets: [this.dialogueBox, this.portraitBg, this.portrait,
                      this.nameText, this.dialogueText, this.continueButton, this.continueButtonText],
            alpha: { from: 0, to: 1 },
            duration: GameConfig.ANIMATIONS.FADE_DURATION,
            ease: 'Power2'
        });
    }

    // Hide dialogue UI elements
    hideDialogueUI() {
        this.scene.tweens.add({
            targets: [this.dialogueBox, this.portraitBg, this.portrait,
                      this.nameText, this.dialogueText, this.continueButton, this.continueButtonText],
            alpha: { from: 1, to: 0 },
            duration: GameConfig.ANIMATIONS.FADE_DURATION,
            ease: 'Power2',
            onComplete: () => {
                this.dialogueBox.setVisible(false);
                this.portraitBg.setVisible(false);
                this.portrait.setVisible(false);
                this.nameText.setVisible(false);
                this.dialogueText.setVisible(false);
                this.continueButton.setVisible(false);
                this.continueButtonText.setVisible(false);
            }
        });
    }

    // Display current dialogue
    displayCurrentDialogue() {
        if (this.currentDialogueIndex >= this.dialogues.length) {
            this.endDialogue();
            return;
        }

        const dialogue = this.dialogues[this.currentDialogueIndex];

        // Set character name
        this.nameText.setText(dialogue.character || 'Narrador');

        // Animate text appearance
        this.animateText(dialogue.text);

        // Update portrait (placeholder color based on character)
        this.updatePortrait(dialogue.character);
    }

    // Animate text typing effect
    animateText(text) {
        this.dialogueText.setText('');

        let currentChar = 0;
        const textTimer = this.scene.time.addEvent({
            delay: GameConfig.ANIMATIONS.TEXT_SPEED,
            callback: () => {
                this.dialogueText.setText(text.substring(0, currentChar));
                currentChar++;

                if (currentChar > text.length) {
                    textTimer.destroy();
                }
            },
            repeat: text.length
        });
    }

    // Update character portrait (placeholder implementation)
    updatePortrait(character) {
        this.portrait.clear();

        // Different colors for different characters
        let color = GameConfig.COLORS.ACCENT;
        switch(character?.toLowerCase()) {
            case 'hassan':
                color = 0x4169E1; // Royal blue
                break;
            case 'beremiz':
                color = 0x32CD32; // Lime green
                break;
            case 'califa':
                color = 0xFF4500; // Orange red
                break;
            default:
                color = GameConfig.COLORS.ACCENT;
        }

        this.portrait.fillStyle(color, 0.7);
        this.portrait.fillCircle(130, this.scene.sys.game.config.height - 170, 50);
    }

    // Move to next dialogue
    nextDialogue() {
        this.currentDialogueIndex++;
        this.displayCurrentDialogue();
    }

    // End dialogue sequence
    endDialogue() {
        this.isDisplaying = false;
        this.hideDialogueUI();

        if (this.onComplete) {
            this.scene.time.delayedCall(GameConfig.ANIMATIONS.FADE_DURATION, () => {
                this.onComplete();
            });
        }
    }

    // Cleanup
    destroy() {
        if (this.dialogueBox) this.dialogueBox.destroy();
        if (this.portraitBg) this.portraitBg.destroy();
        if (this.portrait) this.portrait.destroy();
        if (this.nameText) this.nameText.destroy();
        if (this.dialogueText) this.dialogueText.destroy();
        if (this.continueButton) this.continueButton.destroy();
        if (this.continueButtonText) this.continueButtonText.destroy();
    }
}