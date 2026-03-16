# O HOMEM QUE CALCULAVA
## Jogo educativo baseado no livro de Malba Tahan

---

# 1. VISÃO GERAL

Título:
O Homem que Calculava — Aventuras de Beremiz

Tipo de jogo:
Puzzle narrativo educativo

Plataforma:
Web

Tecnologia:
HTML
CSS
JavaScript
Phaser.js

Público alvo:
- estudantes
- professores
- amantes de matemática
- leitores do livro

Objetivo:
Resolver problemas matemáticos apresentados ao longo da jornada de Beremiz.

---

# 2. GAMEPLAY

Fluxo de gameplay:

INTRO
↓
CENA NARRATIVA
↓
PROBLEMA MATEMÁTICO
↓
ESCOLHA DE RESPOSTA
↓
RESULTADO
↓
EXPLICAÇÃO
↓
PRÓXIMA FASE

---

# 3. MECÂNICA DO JOGO

Cada fase contém:

- história
- cenário
- personagens
- problema matemático
- opções de resposta
- resposta correta
- animação explicativa

---

# 4. PERSONAGENS

## Beremiz Samir
O homem que calculava.
Gênio da matemática.

## Hassan
Narrador e companheiro de viagem.

## Califa
Governante de Bagdá.

## Mercadores
Personagens que trazem problemas matemáticos.

## Sábios
Personagens que desafiam Beremiz.

---

# 5. CENÁRIOS

Deserto
Caravana
Mercado
Palácio
Biblioteca
Mesquita
Oásis

---

# 6. ESTRUTURA DO PROJETO

homem-que-calculava-game

index.html

src/

main.js
game.js

scenes/

IntroScene.js
StoryScene.js
QuestionScene.js
ResultScene.js

systems/

DialogueSystem.js
QuestionSystem.js
AnimationSystem.js

data/

levels.json
characters.json

assets/

backgrounds/
characters/
ui/
audio/

---

# 7. ARQUITETURA DO JOGO

Scene Manager

IntroScene
StoryScene
QuestionScene
ResultScene

---

# 8. SISTEMA DE DIÁLOGO

Cada diálogo possui:

personagem
texto
avatar
ação

Exemplo:

{
 "character": "Hassan",
 "text": "Encontramos três irmãos discutindo sobre 35 camelos."
}

---

# 9. SISTEMA DE PERGUNTAS

Estrutura:

{
 "question": "Como dividir os camelos?",
 "options": [
   "17,11,7",
   "18,12,4",
   "20,10,5"
 ],
 "correct": 1
}

---

# 10. SISTEMA DE FEEDBACK

Resposta correta:

- animação positiva
- personagem elogia
- explicação matemática

Resposta errada:

- personagem reage
- explicação do erro

---

# 11. SISTEMA DE EXPLICAÇÃO

Mostrar passo a passo da solução.

Exemplo:

1. Beremiz empresta um camelo
2. Agora existem 36
3. metade = 18
4. um terço = 12
5. um nono = 4

---

# 12. LISTA DE FASES

1 — Os 35 camelos
2 — As pérolas do mercador
3 — Os 5 pães dos viajantes
4 — O pagamento do poeta
5 — O problema das escravas
6 — O problema dos números perfeitos
7 — A divisão das moedas
8 — O problema dos camelos no mercado
9 — O problema da caravana
10 — O problema dos quatro irmãos
11 — O desafio do sábio
12 — A conta do mercador
13 — O desafio do califa
14 — O problema dos cavalos
15 — O problema dos tecidos
16 — O problema do jardineiro
17 — O problema das datas
18 — O desafio dos estudantes
19 — O desafio final dos sábios
20 — A prova de Beremiz

---

# 13. ESTRUTURA DAS FASES (JSON)

{
 "levels":[
  {
   "id":1,
   "title":"Os 35 camelos",

   "background":"desert",

   "story":[
    "Três irmãos discutem a herança de 35 camelos.",
    "O primeiro deveria receber metade.",
    "O segundo um terço.",
    "O terceiro um nono."
   ],

   "question":"Como dividir os camelos?",

   "options":[
    "17,11,7",
    "18,12,4",
    "20,10,5",
    "Não é possível dividir"
   ],

   "correctIndex":1,

   "explanation":[
    "Beremiz empresta um camelo.",
    "Agora existem 36 camelos.",
    "Metade = 18",
    "1/3 = 12",
    "1/9 = 4",
    "Total = 34"
   ]
  }
 ]
}

---

# 14. SISTEMA VISUAL

Estilo:

2D ilustrado
estilo livro infantil
arte árabe medieval

---

# 15. UI DO JOGO

Elementos:

- caixa de diálogo
- retrato do personagem
- botões de resposta
- indicador de progresso
- botão próximo

---

# 16. SISTEMA DE ANIMAÇÃO

Animações simples:

personagens reagindo
camelos aparecendo
objetos sendo divididos

---

# 17. PROTÓTIPO DE JOGO

index.html

<script src="phaser.js"></script>
<script src="main.js"></script>

---

# 18. PROMPTS PARA IA GERAR CÓDIGO

PROMPT 1 — GERAR O JOGO

Create a browser game using JavaScript and Phaser.js.

Theme:
The Man Who Counted (O Homem que Calculava).

Game type:
Story based math puzzle game.

Features:
dialogue system
multiple choice questions
level progression
explanation animations

Scenes:

IntroScene
StoryScene
QuestionScene
ResultScene

Load level data from JSON.

---

PROMPT 2 — SISTEMA DE DIÁLOGO

Create a dialogue system for a story game.

Features:

character portrait
animated text
next button
dialogue queue

Used for a math story game inspired by "The Man Who Counted".

---

PROMPT 3 — SISTEMA DE PERGUNTAS

Create a multiple choice question system using JavaScript.

Requirements:

load questions from JSON
render answer buttons
detect correct answer
show feedback animation

---

PROMPT 4 — GERAR O JOGO COMPLETO

Create a complete educational math game inspired by the book "The Man Who Counted".

Requirements:

story scenes
math puzzles
multiple choice answers
explanations
level progression
Phaser.js architecture
JSON level loading

---

# 19. PROMPTS PARA IA GERAR ARTE

Generate a 2D illustration of a medieval arabian desert caravan.

Style:
children book illustration
warm colors
storybook style

---

Generate a character illustration of Beremiz Samir.

Style:
arabian mathematician
friendly
storybook style
2D game character

---

Generate a 2D background of a medieval Baghdad market.

Style:
storybook illustration
bright colors
game background

---

# 20. EXPANSÕES FUTURAS

Modo professor
Editor de fases
Multiplayer educativo
Sistema de pontuação
Ranking