# 🎨 PNG Cutter - Remover Background de Imagens

Uma ferramenta web gratuita para remover backgrounds de imagens e converter para PNG transparente, construída com o framework MOZ-CHOP.

## 🚀 Funcionalidades

### ✨ Versão Gratuita
- ✂️ **Remoção Automática de Background** - Remove o background de imagens automaticamente usando algoritmo baseado em análise de cores
- 📥 **Download em PNG** - Descarrega a imagem processada em formato PNG com transparência
- 🎨 **Interface Moderna** - Design limpo e intuitivo
- 🌓 **Dark/Light Mode** - Suporte completo a temas claro e escuro
- 🌐 **Multi-idioma** - Suporte a Português e Inglês
- 📱 **Responsivo** - Funciona perfeitamente em dispositivos móveis
- 🎯 **Drag & Drop** - Arraste e solte imagens para processar

### ⭐ Funcionalidades Premium
- 🤖 **Remoção Avançada com IA** - Usa `@imgly/background-removal` para resultados muito mais precisos
- 🖌️ **Refinamento Manual** - Pincel para adicionar ou remover áreas manualmente (usando Fabric.js)
- 🎨 **Sistema de Paletas de Cores** - Aplique paletas predefinidas ou personalizadas (usando Color.js)
- 🎛️ **Ajustes de Cores** - Controles de brilho, contraste e saturação
- 🎭 **Filtros Visuais** - Vintage, Preto & Branco, Sépia, Frio, Quente
- 🖼️ **Backgrounds Personalizados** - Adicione cores sólidas, gradientes ou imagens como background
- 📤 **Múltiplos Formatos de Exportação** - PNG, JPG e WEBP

## 📋 Requisitos

### Básico
- Navegador moderno com suporte a ES6 modules
- Nenhuma dependência externa necessária para funcionalidades básicas

### Premium (Opcional)
Para usar as funcionalidades premium, instale as dependências:

```bash
npm install
```

Isso instalará:
- `@imgly/background-removal` - Remoção avançada de background com IA
- `colorjs.io` - Manipulação de cores e paletas
- `fabric` - Editor de canvas interativo para refinamento manual

**Nota:** As funcionalidades premium são carregadas dinamicamente. Se as bibliotecas não estiverem instaladas, apenas as funcionalidades básicas estarão disponíveis.

## 🛠️ Como Usar

### Instalação

1. Clone ou baixe o repositório
2. (Opcional) Para funcionalidades premium, execute:
   ```bash
   npm install
   ```

### Uso Básico

1. Abra o ficheiro `index.html` no seu navegador (ou use `npm start` para servidor local)
2. Clique em "Carregar Imagem" ou arraste uma imagem para a área de upload
3. Aguarde o processamento automático
4. Descarregue a imagem em PNG sem background

### Funcionalidades Premium

1. **Modo Avançado**: Selecione "Avançado (Premium)" para usar IA na remoção de background
2. **Refinamento Manual**: Use os botões "Adicionar Área" ou "Remover Área" e ajuste o tamanho do pincel
3. **Ajustes de Cores**: Use os sliders para ajustar brilho, contraste e saturação
4. **Paletas**: Selecione uma paleta e clique em "Aplicar Paleta"
5. **Filtros**: Escolha um filtro visual no dropdown
6. **Backgrounds**: Selecione tipo de background (cor, gradiente ou imagem)
7. **Exportação**: Escolha o formato de exportação (PNG, JPG ou WEBP)

## 📁 Estrutura do Projeto

```
pngcutter/
├── index.html                          # Ficheiro HTML principal
├── package.json                        # Dependências do projeto
├── server.js                          # Servidor local (opcional)
├── src/
│   ├── index.js                       # Inicialização do framework
│   ├── landing.js                    # Página de landing
│   ├── components/                    # Componentes reutilizáveis
│   │   ├── Sidebar/                   # Menu lateral
│   │   ├── Topbar/                    # Barra superior
│   │   ├── Modal/                     # Caixas de diálogo
│   │   └── ContentArea/               # Área de conteúdo
│   ├── layouts/
│   │   └── MainLayout.js              # Layout principal
│   ├── pages/
│   │   ├── BackgroundRemover/         # Página de remoção de background
│   │   │   ├── BackgroundRemover.js  # Lógica principal
│   │   │   └── BackgroundRemover.css # Estilos
│   │   └── Landing/                   # Página inicial
│   ├── utils/                         # Utilitários
│   │   ├── premium.js                 # Sistema de verificação premium
│   │   ├── icons.js                   # Ícones SVG
│   │   ├── dateUtils.js
│   │   ├── stringUtils.js
│   │   └── themeUtils.js
│   ├── themes/                        # Sistema de temas
│   │   ├── base.css
│   │   └── themeManager.js
│   └── i18n/                          # Traduções
│       ├── i18n.js
│       ├── pt.json
│       └── en.json
└── README.md
```

## 🎯 Formatos Suportados

- JPEG/JPG
- PNG
- WEBP

## ⚙️ Limitações

- Tamanho máximo: 10MB
- O algoritmo básico funciona melhor com imagens que têm backgrounds claros ou uniformes
- Para melhores resultados, use imagens com bom contraste entre o objeto e o background
- Funcionalidades premium requerem instalação de dependências

## 🔧 Tecnologias Utilizadas

### Core
- **HTML5** - Estrutura
- **CSS3** - Estilização com variáveis CSS e dark mode
- **JavaScript ES6+** - Lógica da aplicação
- **Canvas API** - Processamento de imagens

### Premium (Opcional)
- **@imgly/background-removal** - Remoção de background com IA/ML
- **colorjs.io** - Manipulação avançada de cores
- **fabric.js** - Editor de canvas interativo

## 📝 Notas

- A ferramenta processa tudo no navegador (client-side)
- Nenhuma imagem é enviada para servidores externos
- Todas as operações são realizadas localmente no seu dispositivo
- Funcionalidades premium são carregadas dinamicamente (lazy loading)
- Sistema premium pode ser facilmente integrado com sistema de pagamento

## 🎨 Framework MOZ-CHOP

Este projeto utiliza o framework MOZ-CHOP, um framework modular e reutilizável para aplicações web com foco em componentes, utilitários e suporte completo a dark/light mode.

## 🔐 Sistema Premium

O sistema premium está implementado com uma flag simples em `src/utils/premium.js`. Por padrão, está ativado para demonstração. Em produção, você pode:

1. Integrar com sistema de autenticação
2. Conectar com gateway de pagamento
3. Verificar assinaturas via API
4. Gerenciar limites de uso

## 📄 Licença

Este projeto é gratuito e de código aberto.

---

**Desenvolvido com ❤️ para remover backgrounds de imagens de forma fácil e gratuita**
