// Main Game class for O Homem que Calculava
// Configures Phaser.js and manages the overall game structure

class CalculavaGame {
    constructor() {
        this.currentLevel = 1;
        this.maxLevels = 20;
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
                    width: 800,
                    height: 600
                },
                max: {
                    width: 1200,
                    height: 900
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

        console.log('O Homem que Calculava iniciado!');
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

            console.log('Dados do jogo carregados:', this.gameData);
            return this.gameData;

        } catch (error) {
            console.error('Erro ao carregar dados do jogo:', error);
            // Return fallback data if loading fails
            return this.getFallbackData();
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

    // Get fallback data if JSON files fail to load
    getFallbackData() {
        return {
            levels: [{
                id: 1,
                title: "Os 35 camelos",
                background: "desert",
                characters: ["Hassan", "Beremiz"],
                story: [
                    "Três irmãos discutem a herança de 35 camelos.",
                    "O primeiro deveria receber metade.",
                    "O segundo um terço.",
                    "O terceiro um nono."
                ],
                question: "Como dividir os camelos?",
                options: [
                    "17, 11, 7",
                    "18, 12, 4",
                    "20, 10, 5",
                    "Não é possível dividir"
                ],
                correctIndex: 1,
                explanation: [
                    "Beremiz empresta um camelo.",
                    "Agora existem 36 camelos.",
                    "Metade = 18",
                    "1/3 = 12",
                    "1/9 = 4",
                    "Total = 34 camelos distribuídos!",
                    "Sobra 1 camelo que retorna ao dono."
                ]
            }],
            characters: [
                {
                    name: "Hassan",
                    title: "O Narrador",
                    description: "Companheiro de viagem de Beremiz",
                    avatar: "hassan_portrait.png"
                },
                {
                    name: "Beremiz",
                    title: "O Homem que Calculava",
                    description: "Gênio da matemática",
                    avatar: "beremiz_portrait.png"
                }
            ]
        };
    }
}