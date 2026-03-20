// Main Game class for O Homem que Calculava
// Configures Phaser.js and manages the overall game structure

class CalculavaGame {
    constructor() {
        this.currentLevel = 1;
        this.maxLevels = 0;
        this.gameData = null;

        this.config = {
            type: Phaser.AUTO,
            width: GameConfig.WIDTH,
            height: GameConfig.HEIGHT,
            parent: 'game-container',
            backgroundColor: GameConfig.COLORS.BACKGROUND,
            scene: [
                IntroScene,
                StoryScene,
                QuestionScene,
                ResultScene
            ],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                min: {
                    width: 320,
                    height: 180  // Updated for 16:9 aspect ratio
                },
                max: {
                    width: 1600,  // Reduced from 1920 to match smaller base size
                    height: 900   // Standard 16:9, reduced from 1080
                }
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            }
        };

        // Create the Phaser game instance
        this.phaserGame = new Phaser.Game(this.config);

        // Add global game reference for scenes to access
        this.phaserGame.registry.set('gameController', this);
    }

    // Load game data (levels, characters, etc.)
    async loadGameData() {
        try {
            // Load levels data
            const levelsResponse = await fetch('data/levels.json');
            const levelsData = await levelsResponse.json();

            // Load characters data
            const charactersResponse = await fetch('data/characters.json');
            const charactersData = await charactersResponse.json();

            this.gameData = {
                levels: levelsData.levels,
                characters: charactersData.characters
            };

            // Atualiza maxLevels dinamicamente baseado nos dados carregados
            this.maxLevels = this.gameData.levels.length;

            return this.gameData;

        } catch (error) {
            console.error('Erro ao carregar dados do jogo:', error);

        }
    }

    // Get current level data
    getCurrentLevel() {
        if (!this.gameData || !this.gameData.levels) {
            return null;
        }

        return this.gameData.levels.find(level => level.id === this.currentLevel);
    }

    // Get character data by name
    getCharacter(name) {
        if (!this.gameData || !this.gameData.characters) {
            return null;
        }

        return this.gameData.characters.find(char => char.name === name);
    }

    // Get maximum number of levels
    getMaxLevels() {
        return this.maxLevels;
    }

    // Progress to next level
    nextLevel() {
        this.currentLevel++;
        if (this.currentLevel > this.maxLevels) {
            this.currentLevel = this.maxLevels;
            return false; // Game completed
        }
        return true; // Has next level
    }

    // Reset game to beginning
    reset() {
        this.currentLevel = 1;
    }
}