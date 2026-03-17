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
        this.setCharacterPortrait('hassan')

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
            this.portrait.setDisplaySize(100, 100);
            this.portrait.setVisible(false);
            console.log(`🎭 Portrait carregado: ${portraitKey} para ${characterName}`);

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
            this.portrait.fillCircle(130, height - 170, 50);
            this.portrait.setVisible(false);
            console.log(`🎨 Usando fallback colorido para ${characterName}`);
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
            'viajante1': 'viajante1-portrait',
            'viajante2': 'viajante2-portrait'
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
            'beremiz': 0x228B22,    // Green
            'hassan': 0x4169E1,     // Royal blue
            'mercador': 0xFF8C00,   // Dark orange
            'califa': 0x9932CC,     // Dark orchid
            'poeta': 0xDC143C,      // Crimson
            'sabio': 0x8B4513,      // Saddle brown
            'viajante1': 0x2F4F4F,  // Dark slate gray
            'viajante2': 0x800080   // Purple
        };
        const normalizedName = characterName.toLowerCase();
        return colorMap[normalizedName] || GameConfig.COLORS.ACCENT;
    }

    // Show dialogue UI elements
    showDialogueUI() {
        this.dialogueBox.setVisible(true);
        this.portraitBg.setVisible(true);

        if (this.portrait) {
            this.portrait.setVisible(true);
            console.log('🎭 Portrait visível no diálogo');
        } else {
            console.warn('⚠️ Portrait não encontrado ao mostrar UI');
        }

        this.nameText.setVisible(true);
        this.dialogueText.setVisible(true);
        this.continueButton.setVisible(true);
        this.continueButtonText.setVisible(true);

        // Fade in animation
        const targets = [this.dialogueBox, this.portraitBg, this.nameText, this.dialogueText, this.continueButton, this.continueButtonText];
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
        const targets = [this.dialogueBox, this.portraitBg, this.nameText, this.dialogueText, this.continueButton, this.continueButtonText];
        if (this.portrait) targets.push(this.portrait);

        this.scene.tweens.add({
            targets: targets,
            alpha: { from: 1, to: 0 },
            duration: GameConfig.ANIMATIONS.FADE_DURATION,
            ease: 'Power2',
            onComplete: () => {
                this.dialogueBox.setVisible(false);
                this.portraitBg.setVisible(false);
                if (this.portrait) this.portrait.setVisible(false);
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