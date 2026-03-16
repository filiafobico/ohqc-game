# Instruções de Execução - O Homem que Calculava

## Problemas Resolvidos ✅

- **Ordem de carregamento dos scripts** - Corrigida para garantir que todas as classes sejam carregadas antes da inicialização
- **GameConfig duplicado** - Movido para inline no HTML para evitar conflitos
- **Versão do Phaser.js** - Alterada para versão estável 3.60.0
- **Error handling** - Melhorado com verificações e mensagens de erro detalhadas
- **Timeout de inicialização** - Adicionado para garantir carregamento completo

## Como Executar

### Opção 1: Usando npm (Recomendado)

```bash
# Instalar http-server globalmente (apenas uma vez)
npm install -g http-server

# Navegar para o diretório do jogo
cd game

# Executar o jogo (abre automaticamente no navegador)
npm start
```

### Opção 2: Usando Python

```bash
# Navegar para o diretório do jogo
cd game

# Iniciar servidor
python3 -m http.server 8080

# Abrir navegador em http://localhost:8080
```

## Verificação de Funcionamento

1. **Abra o console do navegador** (F12)
2. **Verifique se aparecem as mensagens:**
   - "Página carregada, aguardando inicialização..."
   - "Phaser carregado: 3.60.0"
   - "Todas as classes necessárias foram carregadas"
   - "O Homem que Calculava iniciado!"
   - "Jogo iniciado com sucesso!"

3. **O jogo deve mostrar:**
   - Tela de introdução com fundo marrom
   - Título "O HOMEM QUE CALCULAVA"
   - Botão "COMEÇAR AVENTURA"

## Scripts Disponíveis

- `npm start` - Inicia servidor e abre navegador
- `npm run dev` - Modo desenvolvimento com CORS
- `npm run serve` - Apenas servidor sem abrir navegador

## Arquivos Corrigidos

- `index.html` - Ordem de scripts e GameConfig inline
- `src/main.js` - Error handling e timeout de inicialização
- `package.json` - Scripts para execução com http-server
- `favicon.ico` - Ícone simples para evitar erro 404

## Se Ainda Houver Problemas

1. **Limpe o cache do navegador** (Ctrl+F5)
2. **Verifique o console** para mensagens de erro
3. **Teste com test.html** - arquivo de diagnóstico simplificado

O jogo agora deve funcionar corretamente! 🎮