// Dialogue System for O Homem que Calculava
// Handles character conversations and narrative text display

class DialogueSystem {
    constructor(scene) {
        this.scene = scene;
        this.dialogues = [];
        this.currentDialogueIndex = 0;
        this.isDisplaying = false;
        this.onComplete = null;
        this.buttonEnabled = true; // Control button state
        this.isTyping = false;   // Track if text animation is in progress
        this.fullText = '';      // Full text of current dialogue for skip
        this.textTimer = null;   // Reference to active typing timer

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

        // Character portrait (will be set dynamically)
        this.portrait = null;

        // Character name text
        this.nameText = this.scene.add.text(210, height - 230, '', {
            fontSize: '22px',
            fill: '#d4af37', // Golden color for better contrast on dark background
            fontFamily: 'Arial, serif',
            fontStyle: 'bold'
        });
        this.nameText.setVisible(false);

        // Dialogue text
        this.dialogueText = this.scene.add.text(210, height - 200, '', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            wordWrap: { width: width - 320, useAdvancedWrap: true },
            lineSpacing: 5
        });
        this.dialogueText.setVisible(false);

        // Continue button — below the dialogue box (box bottom = height-70)
        this.continueButton = this.scene.add.graphics();
        this.continueButton.fillStyle(GameConfig.COLORS.SECONDARY, 1);
        this.continueButton.fillRoundedRect(width - 200, height - 62, 130, 44, 8);
        this.continueButton.setVisible(false);
        this.continueButton.setDepth(10);
        this.continueButton.setInteractive(
            new Phaser.Geom.Rectangle(width - 200, height - 62, 130, 44),
            Phaser.Geom.Rectangle.Contains
        );

        this.continueButtonText = this.scene.add.text(width - 135, height - 40, 'Continuar', {
            fontSize: '14px',
            fill: '#000000',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        });
        this.continueButtonText.setOrigin(0.5);
        this.continueButtonText.setVisible(false);
        this.continueButtonText.setDepth(10);

        // Back button — below the dialogue box, left side
        this.backButton = this.scene.add.graphics();
        this.backButton.fillStyle(0x333333, 0.9);
        this.backButton.lineStyle(2, GameConfig.COLORS.SECONDARY, 0.8);
        this.backButton.fillRoundedRect(70, height - 62, 130, 44, 8);
        this.backButton.strokeRoundedRect(70, height - 62, 130, 44, 8);
        this.backButton.setVisible(false);
        this.backButton.setDepth(10);
        this.backButton.setInteractive(
            new Phaser.Geom.Rectangle(70, height - 62, 130, 44),
            Phaser.Geom.Rectangle.Contains
        );

        this.backButtonText = this.scene.add.text(135, height - 40, '← Voltar', {
            fontSize: '14px',
            fill: '#d4af37',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold'
        });
        this.backButtonText.setOrigin(0.5);
        this.backButtonText.setVisible(false);
        this.backButtonText.setDepth(10);

        this.backButton.on('pointerover', () => {
            this.backButton.clear();
            this.backButton.fillStyle(0x555555, 0.9);
            this.backButton.lineStyle(2, GameConfig.COLORS.SECONDARY, 1);
            this.backButton.fillRoundedRect(70, height - 62, 130, 44, 8);
            this.backButton.strokeRoundedRect(70, height - 62, 130, 44, 8);
        });

        this.backButton.on('pointerout', () => {
            this.backButton.clear();
            this.backButton.fillStyle(0x333333, 0.9);
            this.backButton.lineStyle(2, GameConfig.COLORS.SECONDARY, 0.8);
            this.backButton.fillRoundedRect(70, height - 62, 130, 44, 8);
            this.backButton.strokeRoundedRect(70, height - 62, 130, 44, 8);
        });

        this.backButton.on('pointerdown', () => {
            this.previousDialogue();
        });

        // Exit button (top-right corner, shows during dialogue)
        const exitW = 54, exitH = 36, exitX = width - 20 - exitW, exitY = 20;
        this.exitButton = this.scene.add.graphics();
        this.exitButton.fillStyle(0x000000, 0.7);
        this.exitButton.lineStyle(2, GameConfig.COLORS.SECONDARY, 0.9);
        this.exitButton.fillRoundedRect(exitX, exitY, exitW, exitH, 6);
        this.exitButton.strokeRoundedRect(exitX, exitY, exitW, exitH, 6);
        this.exitButton.setVisible(false).setDepth(30);
        this.exitButton.setInteractive(
            new Phaser.Geom.Rectangle(exitX, exitY, exitW, exitH),
            Phaser.Geom.Rectangle.Contains
        );

        this.exitButtonText = this.scene.add.text(exitX + exitW / 2, exitY + exitH / 2, '⏻', {
            fontSize: '20px',
            fill: '#d4af37',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5).setVisible(false).setDepth(30);

        this.exitButton.on('pointerover', () => {
            this.scene.input.setDefaultCursor('pointer');
            this.exitButton.clear();
            this.exitButton.fillStyle(0x333333, 0.9);
            this.exitButton.lineStyle(2, GameConfig.COLORS.SECONDARY, 1);
            this.exitButton.fillRoundedRect(exitX, exitY, exitW, exitH, 6);
            this.exitButton.strokeRoundedRect(exitX, exitY, exitW, exitH, 6);
        });
        this.exitButton.on('pointerout', () => {
            this.scene.input.setDefaultCursor('default');
            this.exitButton.clear();
            this.exitButton.fillStyle(0x000000, 0.7);
            this.exitButton.lineStyle(2, GameConfig.COLORS.SECONDARY, 0.9);
            this.exitButton.fillRoundedRect(exitX, exitY, exitW, exitH, 6);
            this.exitButton.strokeRoundedRect(exitX, exitY, exitW, exitH, 6);
        });
        this.exitButton.on('pointerdown', () => {
            this.scene.input.setDefaultCursor('default');
            this.scene.cameras.main.fadeOut(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);
            this.scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.scene.start('IntroScene');
            });
        });

        // Continue button hover effects
        this.continueButton.on('pointerover', () => {
            if (this.buttonEnabled) {
                this.continueButton.clear();
                this.continueButton.fillStyle(GameConfig.COLORS.SECONDARY, 0.8);
                this.continueButton.fillRoundedRect(width - 200, height - 62, 130, 44, 8);
            }
        });

        this.continueButton.on('pointerout', () => {
            if (this.buttonEnabled) {
                this.continueButton.clear();
                this.continueButton.fillStyle(GameConfig.COLORS.SECONDARY, 1);
                this.continueButton.fillRoundedRect(width - 200, height - 62, 130, 44, 8);
            }
        });

        // Continue button click
        this.continueButton.on('pointerdown', () => {
            if (this.buttonEnabled) {
                this.nextDialogue();
            }
        });
    }

    // Enable/Disable continue button
    enableButton() {
        this.buttonEnabled = true;
        this.updateButtonVisuals();
    }

    disableButton() {
        this.buttonEnabled = false;
        this.updateButtonVisuals();
    }

    updateButtonVisuals() {
        const { width, height } = this.scene.sys.game.config;

        this.continueButton.clear();
        if (this.buttonEnabled) {
            // Enabled state - normal colors
            this.continueButton.fillStyle(GameConfig.COLORS.SECONDARY, 1);
            this.continueButton.fillRoundedRect(width - 200, height - 62, 130, 44, 8);
            this.continueButtonText.setTint(0x000000);
        } else {
            // Disabled state - grayed out
            this.continueButton.fillStyle(0x666666, 0.5);
            this.continueButton.fillRoundedRect(width - 200, height - 62, 130, 44, 8);
            this.continueButtonText.setTint(0x999999);
        }
    }

    // Start displaying dialogue sequence
    startDialogue(dialogues, onComplete = null) {
        this.dialogues = dialogues;
        this.currentDialogueIndex = 0;
        this.onComplete = onComplete;
        this.isDisplaying = true;

        // First prepare the current dialogue (creates portrait)
        this.prepareCurrentDialogue();

        // Then show the UI
        this.showDialogueUI();

        // Finally display the dialogue content
        this.displayCurrentDialogueContent();

        // Set initial back button label
        this.updateBackButtonLabel();
    }

    // Set character portrait with real images
    setCharacterPortrait(characterName) {
        const { height } = this.scene.sys.game.config;

        // Remove existing portrait if it exists
        if (this.portrait) {
            try {
                if (this.portrait.destroy) {
                    this.portrait.destroy();
                }
            } catch (error) {
                console.warn('⚠️ Erro ao remover portrait anterior:', error);
            }
            this.portrait = null;
        }

        // Get portrait key based on character name
        const portraitKey = this.getPortraitKey(characterName);

        try {
            // Try to load real character image
            this.portrait = this.scene.add.image(130, height - 170, portraitKey);
            this.portrait.setDisplaySize(140, 140);
            this.portrait.setVisible(this.isDisplaying);

            // Check if image loaded successfully
            if (this.portrait.texture.key === '__MISSING') {
                throw new Error('Imagem não encontrada');
            }

        } catch (error) {
            console.warn(`⚠️ Erro ao carregar portrait ${portraitKey}:`, error);
            // Fallback to colored circle
            if (this.portrait && this.portrait.destroy) {
                this.portrait.destroy();
            }
            this.portrait = this.scene.add.graphics();
            const color = this.getCharacterColor(characterName);
            this.portrait.fillStyle(color, 0.8);
            this.portrait.fillCircle(130, height - 170, 70);
            this.portrait.setVisible(this.isDisplaying);
        }
    }

    // Get portrait key from character name
    getPortraitKey(characterName) {
        const keyMap = {
            'beremiz': 'beremiz-portrait',
            'hassan': 'hassan-portrait',
            'mercador': 'mercador-portrait',
            'califa': 'califa-portrait',
            'poeta': 'poeta-portrait',
            'sabio': 'sabio-portrait',
            'vendedor': 'vendedor-portrait',
            'oleiro': 'oleiro-portrait',
            'raja': 'raja-portrait',
            'inventor': 'inventor-portrait',
            'vizir': 'vizir-portrait',
            'princesa': 'princesa-portrait',
            'pretendente': 'pretendente-portrait',
        };

        const normalizedName = characterName.toLowerCase();
        const portraitKey = keyMap[normalizedName] || keyMap['beremiz']; // Default to Beremiz

        // Verify if texture exists
        const hasTexture = this.scene.textures.exists(portraitKey);
        if (!hasTexture) {
            console.warn(`⚠️ Texture não encontrada: ${portraitKey}, usando beremiz como fallback`);
            return 'beremiz-portrait';
        }

        return portraitKey;
    }

    // Get fallback color for character
    getCharacterColor(characterName) {
        const colorMap = {
            'beremiz': 0x228B22,      // Green
            'hassan': 0x4169E1,       // Royal blue
            'mercador': 0xFF8C00,     // Dark orange
            'califa': 0x9932CC,       // Dark orchid
            'poeta': 0xDC143C,        // Crimson
            'sabio': 0x8B4513,        // Saddle brown
            'vendedor': 0xB8860B,     // Dark goldenrod
            'oleiro': 0xA0522D,       // Sienna
            'raja': 0x4B0082,         // Indigo
            'inventor': 0x2E8B57,     // Sea green
            'vizir': 0x708090,        // Slate gray
            'princesa': 0xC71585,     // Medium violet red
            'pretendente': 0x1E90FF,  // Dodger blue
        };
        const normalizedName = characterName.toLowerCase();
        return colorMap[normalizedName] || GameConfig.COLORS.ACCENT;
    }

    // Show dialogue UI elements
    showDialogueUI() {
        this.dialogueBox.setVisible(true);

        if (this.portrait) {
            this.portrait.setVisible(true);
        } else {
            console.warn('⚠️ Portrait não encontrado ao mostrar UI');
        }

        this.nameText.setVisible(true);
        this.dialogueText.setVisible(true);
        this.continueButton.setVisible(true);
        this.continueButtonText.setVisible(true);
        this.backButton.setVisible(true);
        this.backButtonText.setVisible(true);
        this.exitButton.setVisible(true);
        this.exitButtonText.setVisible(true);

        // Ensure button is enabled when showing UI
        this.enableButton();

        const targets = [this.dialogueBox, this.nameText, this.dialogueText, this.continueButton, this.continueButtonText, this.backButton, this.backButtonText, this.exitButton, this.exitButtonText];
        if (this.portrait) targets.push(this.portrait);

        this.scene.tweens.add({
            targets: targets,
            alpha: { from: 0, to: 1 },
            duration: GameConfig.ANIMATIONS.FADE_DURATION,
            ease: 'Power2'
        });
    }

    // Hide dialogue UI elements
    hideDialogueUI() {
        // Disable button when hiding UI
        this.disableButton();

        const targets = [this.dialogueBox, this.nameText, this.dialogueText, this.continueButton, this.continueButtonText, this.backButton, this.backButtonText, this.exitButton, this.exitButtonText];
        if (this.portrait) targets.push(this.portrait);

        this.scene.tweens.add({
            targets: targets,
            alpha: { from: 1, to: 0 },
            duration: GameConfig.ANIMATIONS.FADE_DURATION,
            ease: 'Power2',
            onComplete: () => {
                this.dialogueBox.setVisible(false);
                if (this.portrait) this.portrait.setVisible(false);
                this.nameText.setVisible(false);
                this.dialogueText.setVisible(false);
                this.continueButton.setVisible(false);
                this.continueButtonText.setVisible(false);
                this.backButton.setVisible(false);
                this.backButtonText.setVisible(false);
                this.exitButton.setVisible(false);
                this.exitButtonText.setVisible(false);
            }
        });
    }

    // Prepare current dialogue (create portrait without showing content yet)
    prepareCurrentDialogue() {
        if (this.currentDialogueIndex >= this.dialogues.length) {
            return;
        }

        const dialogue = this.dialogues[this.currentDialogueIndex];

        // Update portrait first
        this.updatePortrait(dialogue.character);
    }

    // Display current dialogue content
    displayCurrentDialogueContent() {
        if (this.currentDialogueIndex >= this.dialogues.length) {
            this.endDialogue();
            return;
        }

        const dialogue = this.dialogues[this.currentDialogueIndex];

        // Set character name
        this.nameText.setText(dialogue.character || 'Narrador');

        // Animate text appearance
        this.animateText(dialogue.text);
    }

    // Skip active typing animation and show full text immediately
    skipTyping() {
        if (this.textTimer) {
            this.textTimer.destroy();
            this.textTimer = null;
        }
        this.isTyping = false;
        this.dialogueText.setText(this.fullText);
    }

    // Animate text typing effect
    animateText(text) {
        this.fullText = text;
        this.dialogueText.setText('');
        this.isTyping = true;

        // Cancel any previous timer
        if (this.textTimer) {
            this.textTimer.destroy();
            this.textTimer = null;
        }

        let currentChar = 0;
        this.textTimer = this.scene.time.addEvent({
            delay: GameConfig.ANIMATIONS.TEXT_SPEED,
            callback: () => {
                this.dialogueText.setText(text.substring(0, currentChar));
                currentChar++;

                if (currentChar > text.length) {
                    this.textTimer.destroy();
                    this.textTimer = null;
                    this.isTyping = false;
                }
            },
            repeat: text.length
        });
    }

    // Update character portrait based on current dialogue
    updatePortrait(character) {
        if (character) {
            this.setCharacterPortrait(character);
            // Ensure portrait is visible after creation
            if (this.portrait && this.isDisplaying) {
                this.portrait.setVisible(true);
            }
        }
    }

    // Move to next dialogue
    nextDialogue() {
        // If text is still being typed, skip to end first
        if (this.isTyping) {
            this.skipTyping();
            return;
        }

        this.currentDialogueIndex++;

        // Prepare the new dialogue (creates portrait)
        this.prepareCurrentDialogue();

        // Display the content
        this.displayCurrentDialogueContent();

        this.updateBackButtonLabel();
    }

    // Move to previous dialogue
    previousDialogue() {
        // Cancel any running timer
        if (this.textTimer) {
            this.textTimer.destroy();
            this.textTimer = null;
        }
        this.isTyping = false;

        if (this.currentDialogueIndex === 0) {
            // Already at the first dialogue — go back to level select
            this.isDisplaying = false;
            this.scene.cameras.main.fadeOut(GameConfig.ANIMATIONS.FADE_DURATION, 0, 0, 0);
            this.scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.scene.start('LevelSelectScene');
            });
            return;
        }

        this.currentDialogueIndex--;
        this.prepareCurrentDialogue();
        this.displayCurrentDialogueContent();
        this.updateBackButtonLabel();
    }

    // Update back button label depending on position in dialogue
    updateBackButtonLabel() {
        if (!this.backButtonText) return;
        if (this.currentDialogueIndex === 0) {
            this.backButtonText.setText('✕ Menu');
        } else {
            this.backButtonText.setText('← Voltar');
        }
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
        if (this.portrait) this.portrait.destroy();
        if (this.nameText) this.nameText.destroy();
        if (this.dialogueText) this.dialogueText.destroy();
        if (this.continueButton) this.continueButton.destroy();
        if (this.continueButtonText) this.continueButtonText.destroy();
        if (this.backButton) this.backButton.destroy();
        if (this.backButtonText) this.backButtonText.destroy();
        if (this.exitButton) this.exitButton.destroy();
        if (this.exitButtonText) this.exitButtonText.destroy();
    }
}