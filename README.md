# O Homem que Calculava - Jogo Educativo

Um jogo educativo baseado no livro clássico de Malba Tahan, desenvolvido com JavaScript e Phaser.js.

## Como Jogar

### Opção 1: Usando npm e http-server (Recomendado)

1. **Instale o http-server (apenas uma vez):**
   ```bash
   npm install -g http-server
   ```

2. **Execute o jogo:**
   ```bash
   cd game
   npm start
   ```
   Este comando automaticamente:
   - Inicia o servidor na porta 8080
   - Abre o navegador automaticamente
   - Desabilita cache para desenvolvimento

### Opção 2: Usando Python

1. **Inicie o servidor local:**
   ```bash
   cd game
   python3 -m http.server 8080
   ```

2. **Abra seu navegador e visite:**
   ```
   http://localhost:8080
   ```

### Scripts Disponíveis

- `npm start` - Inicia o servidor e abre o navegador automaticamente
- `npm run dev` - Modo desenvolvimento com CORS habilitado
- `npm run serve` - Apenas inicia o servidor sem abrir o navegador

### Se Houver Problemas

1. **Limpe o cache do navegador** (Ctrl+F5)
2. **Use o modo debug** - Acesse http://localhost:8080/index-debug.html
3. **Verifique o console** (F12) para mensagens de erro detalhadas
4. **Teste básico** - Acesse http://localhost:8080/test.html para um teste simples

### Arquivos de Debug

- `index-debug.html` - Versão com debug detalhado e logs no console
- `debug.html` - Teste minimalista de carregamento de scripts
- `test.html` - Teste básico do Phaser.js

### Gameplay
   - Clique em "COMEÇAR AVENTURA" na tela inicial
   - Leia as histórias apresentadas por Hassan e Beremiz
   - Resolva os problemas matemáticos escolhendo a resposta correta
   - Aprenda com as explicações detalhadas
   - Progrida através dos níveis

## Estrutura do Projeto

```
game/
├── index.html              # Página principal
├── src/
│   ├── main.js             # Configuração e inicialização
│   ├── game.js             # Controlador principal do jogo
│   └── scenes/             # Cenas do jogo
│       ├── IntroScene.js   # Tela de introdução
│       ├── StoryScene.js   # Narrativa de cada nível
│       ├── QuestionScene.js # Apresentação das perguntas
│       └── ResultScene.js  # Resultados e explicações
├── systems/                # Sistemas do jogo
│   ├── DialogueSystem.js   # Sistema de diálogos
│   ├── QuestionSystem.js   # Sistema de perguntas
│   └── AnimationSystem.js  # Sistema de animações
├── data/                   # Dados do jogo
│   ├── levels.json         # Níveis e problemas matemáticos
│   └── characters.json     # Personagens e suas características
└── README.md              # Este arquivo
```

## Características do Jogo

### Educacionais
- 5 problemas matemáticos clássicos do livro
- Explicações passo-a-passo detalhadas
- Diferentes tipos de matemática: aritmética, geometria, progressões
- Feedback imediato para respostas certas e erradas

### Técnicas
- Desenvolvido com Phaser.js 3.70
- Sistema de diálogos com retratos de personagens
- Animações de feedback visuais
- Design responsivo
- Suporte a fallback se os arquivos JSON não carregarem

### Visuais
- Tema árabe medieval
- Cores inspiradas no deserto
- Interface amigável
- Animações suaves

## Níveis Incluídos

1. **Os 35 camelos** - Problema clássico de divisão com empréstimo
2. **As pérolas do mercador** - Divisão com resto
3. **Os 5 pães dos viajantes** - Proporções complexas
4. **O pagamento do poeta** - Progressão geométrica
5. **O problema das escravas** - Congruências (Teorema Chinês do Resto)

## Personagens

- **Beremiz Samir** - O protagonista, gênio da matemática
- **Hassan** - Narrador e companheiro de viagem
- **Califa** - Governante de Bagdá
- **Mercadores** - Apresentam problemas comerciais
- **Sábios** - Desafiam Beremiz com problemas complexos

## Expansões Futuras

O jogo foi projetado para suportar até 20 níveis. Para adicionar novos níveis:

1. Edite `data/levels.json` adicionando novos problemas
2. Siga a estrutura JSON existente
3. Inclua sempre: história, pergunta, opções, resposta correta e explicação

## Tecnologias Utilizadas

- **HTML5** - Estrutura da página
- **CSS3** - Estilização
- **JavaScript ES6+** - Lógica do jogo
- **Phaser.js 3.70** - Engine de jogos
- **JSON** - Dados dos níveis e personagens

## Suporte

Para problemas técnicos ou sugestões, verifique:
- Console do navegador para erros JavaScript
- Arquivos JSON estão bem formatados
- Servidor web está executando corretamente
- Navegador suporta JavaScript ES6+

Desenvolvido com base no design especificado em `homem-que-calculava-game-design.md`.