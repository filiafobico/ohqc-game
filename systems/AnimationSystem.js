// Animation System for O Homem que Calculava
// Handles feedback animations, transitions, and visual effects

class AnimationSystem {
    constructor(scene) {
        this.scene = scene;
        this.activeAnimations = [];
    }

    // Show success animation when answer is correct
    showSuccessAnimation(callback = null) {
        const { width, height } = this.scene.sys.game.config;

        // Success background flash
        const successFlash = this.scene.add.graphics();
        successFlash.fillStyle(0x32CD32, 0.3);
        successFlash.fillRect(0, 0, width, height);
        successFlash.setAlpha(0);

        this.scene.tweens.add({
            targets: successFlash,
            alpha: { from: 0, to: 0.5, to: 0 },
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                successFlash.destroy();
            }
        });

        // Success text
        const successText = this.scene.add.text(width / 2, height / 2 - 50, 'CORRETO!', {
            fontSize: '48px',
            fill: '#32CD32',
            fontFamily: 'Arial, serif',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 2
        });
        successText.setOrigin(0.5);
        successText.setAlpha(0);
        successText.setScale(0);

        // Success animation
        this.scene.tweens.add({
            targets: successText,
            alpha: { from: 0, to: 1 },
            scaleX: { from: 0, to: 1.2, to: 1 },
            scaleY: { from: 0, to: 1.2, to: 1 },
            duration: 600,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Fade out after showing
                this.scene.tweens.add({
                    targets: successText,
                    alpha: { from: 1, to: 0 },
                    y: successText.y - 50,
                    duration: 400,
                    delay: 800,
                    ease: 'Power2',
                    onComplete: () => {
                        successText.destroy();
                        if (callback) callback();
                    }
                });
            }
        });

        // Particle effect
        this.createSuccessParticles();
    }

    // Show failure animation when answer is wrong
    showFailureAnimation(callback = null) {
        const { width, height } = this.scene.sys.game.config;

        // Failure background flash
        const failureFlash = this.scene.add.graphics();
        failureFlash.fillStyle(0xFF4500, 0.3);
        failureFlash.fillRect(0, 0, width, height);
        failureFlash.setAlpha(0);

        this.scene.tweens.add({
            targets: failureFlash,
            alpha: { from: 0, to: 0.5, to: 0 },
            duration: 600,
            ease: 'Power2',
            onComplete: () => {
                failureFlash.destroy();
            }
        });

        // Failure text
        const failureText = this.scene.add.text(width / 2, height / 2 - 50, 'TENTE NOVAMENTE', {
            fontSize: '36px',
            fill: '#FF4500',
            fontFamily: 'Arial, serif',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 2
        });
        failureText.setOrigin(0.5);
        failureText.setAlpha(0);

        // Shake animation
        this.scene.tweens.add({
            targets: failureText,
            alpha: { from: 0, to: 1 },
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                // Shake effect
                this.scene.tweens.add({
                    targets: failureText,
                    x: { value: failureText.x + 10, duration: 50 },
                    yoyo: true,
                    repeat: 5,
                    onComplete: () => {
                        // Fade out
                        this.scene.tweens.add({
                            targets: failureText,
                            alpha: { from: 1, to: 0 },
                            duration: 400,
                            delay: 600,
                            ease: 'Power2',
                            onComplete: () => {
                                failureText.destroy();
                                if (callback) callback();
                            }
                        });
                    }
                });
            }
        });
    }

    // Create particle effect for success
    createSuccessParticles() {
        const { width, height } = this.scene.sys.game.config;

        // Create multiple particles
        for (let i = 0; i < 15; i++) {
            const particle = this.scene.add.graphics();
            particle.fillStyle(GameConfig.COLORS.SECONDARY);
            particle.fillCircle(0, 0, Phaser.Math.Between(3, 8));

            particle.x = width / 2;
            particle.y = height / 2;

            // Random movement
            const angle = (360 / 15) * i;
            const distance = Phaser.Math.Between(100, 200);
            const targetX = particle.x + Math.cos(Phaser.Math.DegToRad(angle)) * distance;
            const targetY = particle.y + Math.sin(Phaser.Math.DegToRad(angle)) * distance;

            this.scene.tweens.add({
                targets: particle,
                x: targetX,
                y: targetY,
                alpha: { from: 1, to: 0 },
                scaleX: { from: 1, to: 0 },
                scaleY: { from: 1, to: 0 },
                duration: Phaser.Math.Between(800, 1200),
                ease: 'Power2.easeOut',
                onComplete: () => {
                    particle.destroy();
                }
            });
        }
    }

    // Animate camel counting (for the first level)
    animateCamelCounting(totalCamels, divisions, callback = null) {
        const { width, height } = this.scene.sys.game.config;
        const camelElements = [];

        // Create visual representation of camels
        const camelSize = 20;
        const cols = 8;
        const startX = width / 2 - (cols * camelSize) / 2;
        const startY = height / 2 - 100;

        // Create camel representations (simple circles)
        for (let i = 0; i < totalCamels; i++) {
            const x = startX + (i % cols) * (camelSize + 5);
            const y = startY + Math.floor(i / cols) * (camelSize + 5);

            const camel = this.scene.add.graphics();
            camel.fillStyle(0x8B4513, 1); // Brown color
            camel.fillCircle(x, y, camelSize / 2);
            camel.setAlpha(0);

            camelElements.push(camel);
        }

        // Animate camels appearing
        this.scene.tweens.add({
            targets: camelElements,
            alpha: { from: 0, to: 1 },
            duration: 100,
            delay: (target, index) => index * 50, // Stagger appearance
            onComplete: () => {
                // Show division animation
                this.animateDivision(camelElements, divisions, callback);
            }
        });
    }

    // Animate division of items (like camels)
    animateDivision(elements, divisions, callback = null) {
        const { width } = this.scene.sys.game.config;
        let currentIndex = 0;

        // Color each group differently
        const groupColors = [0x32CD32, 0x4169E1, 0xFF6347]; // Green, Blue, Red

        // Animate grouping
        divisions.forEach((count, groupIndex) => {
            for (let i = 0; i < count; i++) {
                if (currentIndex < elements.length) {
                    const element = elements[currentIndex];
                    const targetX = 200 + (groupIndex * 250);
                    const targetY = 400 + (i * 25);

                    this.scene.tweens.add({
                        targets: element,
                        x: targetX,
                        y: targetY,
                        duration: 800,
                        delay: (currentIndex * 50),
                        ease: 'Power2.easeInOut',
                        onStart: () => {
                            element.clear();
                            element.fillStyle(groupColors[groupIndex], 1);
                            element.fillCircle(0, 0, 10);
                        }
                    });

                    currentIndex++;
                }
            }
        });

        // Show group labels
        divisions.forEach((count, groupIndex) => {
            const labelX = 200 + (groupIndex * 250);
            const labelY = 350;

            const label = this.scene.add.text(labelX, labelY, `Grupo ${groupIndex + 1}\n${count} camelos`, {
                fontSize: '14px',
                fill: '#ffffff',
                fontFamily: 'Arial, sans-serif',
                align: 'center'
            });
            label.setOrigin(0.5);
            label.setAlpha(0);

            this.scene.tweens.add({
                targets: label,
                alpha: { from: 0, to: 1 },
                duration: 500,
                delay: 1000 + (groupIndex * 200)
            });
        });

        // Cleanup after animation
        this.scene.time.delayedCall(4000, () => {
            elements.forEach(element => element.destroy());
            if (callback) callback();
        });
    }

    // Scene transition animation
    sceneTransition(type = 'fade', callback = null) {
        const { width, height } = this.scene.sys.game.config;

        const overlay = this.scene.add.graphics();
        overlay.fillStyle(0x000000, 1);
        overlay.fillRect(0, 0, width, height);

        if (type === 'fade') {
            overlay.setAlpha(0);
            this.scene.tweens.add({
                targets: overlay,
                alpha: { from: 0, to: 1 },
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    if (callback) callback();
                }
            });
        }
    }

    // Loading animation
    showLoadingAnimation(text = 'Carregando...') {
        const { width, height } = this.scene.sys.game.config;

        const loadingText = this.scene.add.text(width / 2, height / 2, text, {
            fontSize: '24px',
            fill: GameConfig.COLORS.SECONDARY,
            fontFamily: 'Arial, serif'
        });
        loadingText.setOrigin(0.5);

        // Pulsing animation
        this.scene.tweens.add({
            targets: loadingText,
            alpha: { from: 1, to: 0.3 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Power2'
        });

        return loadingText;
    }

    // Stop all active animations
    stopAllAnimations() {
        this.activeAnimations.forEach(anim => {
            if (anim && anim.destroy) {
                anim.destroy();
            }
        });
        this.activeAnimations = [];
    }

    // Cleanup
    destroy() {
        this.stopAllAnimations();
    }
}