# 🎨 PNG Cutter – Format Convert & Resize

Uma ferramenta web moderna, completa e **100% gratuita** para conversão de formatos de imagens, redimensionamento em lote e remoção automática de backgrounds com inteligência artificial, construída com o framework MOZ-CHOP.

## 🚀 Funcionalidades

- ✂️ **Remoção de Background com IA & Algoritmo Local** - Remove o background de imagens automaticamente usando IA local (`@imgly/background-removal`) ou algoritmo rápido de cores
- 🔄 **Conversor de Formatos** - Conversão instantânea entre formatos JPG, PNG e WEBP com preservação de qualidade
- 📦 **Redimensionamento em Lote (Bulk Resizer)** - Processe múltiplas imagens em simultâneo com download em arquivo ZIP
- 🖌️ **Refinamento Manual** - Pincel de precisão para adicionar ou remover áreas manualmente (Fabric.js)
- 🎨 **Paletas de Cores & Ajustes** - Controles finos de brilho, contraste, saturação e temas de cor (Color.js)
- 🎭 **Filtros Visuais & Fundos Personalizados** - Cores sólidas, gradientes e fundos customizados
- 📥 **Exportação Rápida** - Download de ficheiros individuais ou em pacotes compactados
- 🎨 **Design Moderno & Vibe Coding** - Interface limpa com suporte completo a Dark/Light Mode
- 🌐 **Multi-idioma** - Suporte completo a Português e Inglês
- 📱 **Totalmente Responsivo** - Funciona perfeitamente em desktop, tablets e smartphones
- 🔒 **100% Privado e Client-Side** - As suas imagens nunca saem do seu navegador. Todo o processamento é local!

## 📋 Requisitos & Instalação

### Instalação Rápida

1. Clone ou descarregue o repositório:
   ```bash
   git clone <repo-url>
   cd pngcutter
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor local:
   ```bash
   npm start
   ```
   Aceda a `http://localhost:8000` no seu navegador.

## 🛠️ Como Usar

### 1. Remoção de Background
1. Aceda à aplicação (`app.html`) e selecione **Remover Background**.
2. Arraste e solte uma imagem ou clique em **Carregar Imagem**.
3. O background será removido instantaneamente. Pode refinar com o pincel manual ou aplicar filtros e fundos personalizados.
4. Clique em **Descarregar PNG**.

### 2. Redimensionamento em Lote
1. Selecione **Redimensionar Lote** na barra de navegação.
2. Carregue múltiplas imagens ao mesmo tempo.
3. Defina as dimensões desejadas e descarregue todas num ficheiro ZIP pronto.

### 3. Conversor de Formatos
1. Selecione **Converter Formato**.
2. Escolha o formato de saída pretendido (PNG, JPG, WEBP).
3. Converta com rapidez mantendo máxima nitidez.

## 📁 Estrutura do Projeto

```
pngcutter/
├── index.html                          # Landing Page
├── app.html                            # Aplicação Principal
├── package.json                        # Configuração e Dependências
├── build.js                            # Script de build para produção
├── local-server.js                     # Servidor local de desenvolvimento
├── src/
│   ├── index.js                       # Inicialização da App
│   ├── landing.js                     # Lógica da Landing Page
│   ├── components/                    # Componentes modulares
│   │   ├── ContentArea/               # Área de conteúdo
│   │   ├── Modal/                     # Caixas de diálogo modais
│   │   ├── Sidebar/                   # Menu lateral responsivo
│   │   └── Topbar/                    # Barra superior
│   ├── layouts/
│   │   └── MainLayout.js              # Layout base da aplicação
│   ├── pages/
│   │   ├── BackgroundRemover/         # Remoção de Background & Edição
│   │   ├── BulkResizer/               # Redimensionador em Lote
│   │   ├── FormatConverter/           # Conversor de Formatos
│   │   └── Landing/                   # Página Inicial
│   ├── utils/                         # Utilitários e Helpers
│   │   ├── dateUtils.js
│   │   ├── icons.js                   # Ícones SVG minimalistas
│   │   ├── legalTexts.js              # Termos de Uso e Privacidade
│   │   ├── stringUtils.js
│   │   └── themeUtils.js
│   ├── themes/                        # Sistema de temas (Dark/Light)
│   │   ├── base.css
│   │   └── themeManager.js
│   └── i18n/                          # Dicionários de Tradução (PT/EN)
│       ├── i18n.js
│       ├── pt.json
│       └── en.json
└── README.md
```

## 🔧 Tecnologias Utilizadas

- **HTML5 & CSS3** - Variáveis CSS, layout moderno, glassmorphism e dark mode
- **JavaScript ES6+** - Arquitetura modular orientada a componentes
- **Canvas API** - Processamento e manipulação de imagem em alta velocidade
- **@imgly/background-removal** - Remoção avançada de fundo por inteligência artificial
- **colorjs.io** - Análise e manipulação cromática
- **fabric.js** - Editor de canvas interativo para desenho e máscaras
- **jszip** - Compactação e descarregamento de múltiplos ficheiros em lote

## 🔒 Privacidade e Segurança

- **100% Client-Side**: Nenhuma imagem é transmitida para servidores externos.
- **Zero Rastreamento de Ficheiros**: Os seus ficheiros permanecem no seu computador ou telemóvel.
- **Gratuito e Sem Custos**: Acesso ilimitado a todas as funcionalidades sem cobranças nem planos pagos.

## 📄 Licença

Distribuído sob licença MIT. Livre para uso pessoal e comercial.

---

**PNG Cutter – Desenvolvido com foco em velocidade, precisão e privacidade.**
