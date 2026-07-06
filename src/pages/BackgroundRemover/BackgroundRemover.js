import i18n from '../../i18n/i18n.js';
import Modal from '../../components/Modal/Modal.js';
import PaymentModal from '../../components/PaymentModal/PaymentModal.js';
import { getIcon } from '../../utils/icons.js';
import premium from '../../utils/premium.js';

// Importações dinâmicas para bibliotecas externas
let removeBackgroundLib = null;
let Color = null;
let fabric = null;

// Carregar bibliotecas dinamicamente
async function loadLibraries() {
  try {
    // Always load background removal library (core feature)
    const bgRemoval = await import('@imgly/background-removal');
    removeBackgroundLib = bgRemoval.removeBackground;
    
    if (premium.hasFeature('colorPalettes')) {
      const colorjs = await import('colorjs.io');
      Color = colorjs.default || colorjs.Color;
    }
    
    if (premium.hasFeature('manualRefinement')) {
      fabric = await import('fabric');
      fabric = fabric.fabric || fabric.default;
    }
  } catch (error) {
    console.warn('Some libraries could not be loaded:', error);
  }
}

class BackgroundRemover {
  constructor() {
    this.originalImage = null;
    this.processedImage = null;
    this.committedImageData = null;
    this.unsubscribe = null;
    this.canvas = null;
    this.fabricCanvas = null;
    this.currentMode = 'basic'; // 'basic' or 'advanced'
    this.brushMode = 'remove'; // 'add' or 'remove'
    this.brushSize = 20;
    this.colorAdjustments = { brightness: 0, contrast: 0, saturation: 0 };
    this.currentFilter = 'none';
    this.customBackground = null;
    this.exportFormat = 'png';
    
    // Carregar bibliotecas
    loadLibraries();
  }

  render(contentArea) {
    const container = document.createElement('div');
    container.className = 'background-remover';
    
    const isPremium = premium.checkPremium();
    
    container.innerHTML = `
      <div class="background-remover-header">
        <h1>${i18n.t('backgroundRemover.title')}</h1>
        <p class="background-remover-subtitle">${i18n.t('backgroundRemover.subtitle')}</p>
      </div>
      
      <div class="background-remover-content">
        <div class="background-remover-upload-area" id="upload-area">
          <div class="upload-area-content">
            <div class="upload-icon">${getIcon('camera')}</div>
            <p class="upload-text">${i18n.t('backgroundRemover.dragDrop')}</p>
            <p class="upload-hint">${i18n.t('backgroundRemover.supportedFormats')}</p>
            <p class="upload-hint">${i18n.t('backgroundRemover.maxSize')}</p>
            <input type="file" id="file-input" accept="image/jpeg,image/jpg,image/png,image/webp" style="display: none;">
            <button class="upload-btn" id="upload-btn">${i18n.t('backgroundRemover.upload')}</button>
          </div>
        </div>
        
        <div class="background-remover-preview" id="preview-area" style="display: none;">
          <div class="preview-images-column">
            <div class="preview-images-row">
              <div class="preview-section preview-original">
                <h3>${i18n.t('backgroundRemover.original')}</h3>
                <div class="preview-image-container">
                  <img id="original-preview" alt="Original">
                </div>
              </div>
              
              <div class="preview-section preview-result">
                <h3>${i18n.t('backgroundRemover.result')}</h3>
                <div class="preview-image-container" id="result-container">
                  <canvas id="processed-canvas"></canvas>
                  <div class="preview-loading" id="processing-indicator" style="display: none;">
                    <div class="spinner"></div>
                    <p>${i18n.t('backgroundRemover.processing')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="preview-actions">
              <button class="action-btn btn-download" id="download-btn" disabled>
                ${getIcon('download')} ${i18n.t('backgroundRemover.download')}
              </button>
              <button class="action-btn btn-reset" id="reset-btn">
                ${i18n.t('backgroundRemover.reset')}
              </button>
            </div>
          </div>
          
          <div class="preview-controls" id="preview-controls">
            <h3 class="controls-title">${i18n.t('backgroundRemover.mode.basic')}</h3>
            <div class="control-group">
              <label>${i18n.t('backgroundRemover.mode.basic')}</label>
              <div class="mode-selector">
                <button class="mode-btn ${this.currentMode === 'basic' ? 'active' : ''}" data-mode="basic">
                  ${i18n.t('backgroundRemover.mode.basic')}
                </button>
                <button class="mode-btn ${this.currentMode === 'advanced' ? 'active' : ''}" data-mode="advanced" ${!isPremium ? 'disabled' : ''}>
                  ${i18n.t('backgroundRemover.mode.advanced')}
                  ${!isPremium ? getIcon('premium') : ''}
                </button>
              </div>
            </div>
            
            <div class="control-group ${!isPremium ? 'premium-locked' : ''}" id="refine-controls">
              <label>${i18n.t('backgroundRemover.refine')} ${!isPremium ? getIcon('premium') : ''}</label>
              <div class="refine-controls">
                <button class="refine-btn ${this.brushMode === 'add' ? 'active' : ''}" data-mode="add">
                  ${getIcon('plus')} ${i18n.t('backgroundRemover.refine.add')}
                </button>
                <button class="refine-btn ${this.brushMode === 'remove' ? 'active' : ''}" data-mode="remove">
                  ${getIcon('minus')} ${i18n.t('backgroundRemover.refine.remove')}
                </button>
                <input type="range" id="brush-size" min="5" max="50" value="${this.brushSize}" class="brush-slider">
                <span class="brush-size-label">${this.brushSize}px</span>
              </div>
            </div>
            
            <div class="control-group ${!isPremium ? 'premium-locked' : ''}" id="color-controls">
              <label>${i18n.t('backgroundRemover.colors')} ${!isPremium ? getIcon('premium') : ''}</label>
              <div class="color-controls">
                <div class="color-adjustments">
                  <div class="adjustment-item">
                    <label>${i18n.t('backgroundRemover.colors.brightness')}</label>
                    <input type="range" id="brightness" min="-100" max="100" value="0" class="color-slider">
                  </div>
                  <div class="adjustment-item">
                    <label>${i18n.t('backgroundRemover.colors.contrast')}</label>
                    <input type="range" id="contrast" min="-100" max="100" value="0" class="color-slider">
                  </div>
                  <div class="adjustment-item">
                    <label>${i18n.t('backgroundRemover.colors.saturation')}</label>
                    <input type="range" id="saturation" min="-100" max="100" value="0" class="color-slider">
                  </div>
                </div>
                <div class="palette-selector">
                  <select id="palette-select" class="palette-select">
                    <option value="none">${i18n.t('backgroundRemover.colors.custom')}</option>
                    <option value="vibrant">Vibrante</option>
                    <option value="pastel">Pastel</option>
                    <option value="monochrome">Monocromático</option>
                    <option value="warm">Quente</option>
                    <option value="cool">Frio</option>
                  </select>
                  <button class="apply-palette-btn" id="apply-palette">${i18n.t('backgroundRemover.colors.apply')}</button>
                </div>
              </div>
            </div>
            
            <div class="control-group ${!isPremium ? 'premium-locked' : ''}" id="filter-controls">
              <label>${i18n.t('backgroundRemover.filters')} ${!isPremium ? getIcon('premium') : ''}</label>
              <select id="filter-select" class="filter-select">
                <option value="none">${i18n.t('backgroundRemover.filters.none')}</option>
                <option value="vintage">${i18n.t('backgroundRemover.filters.vintage')}</option>
                <option value="blackwhite">${i18n.t('backgroundRemover.filters.blackwhite')}</option>
                <option value="sepia">${i18n.t('backgroundRemover.filters.sepia')}</option>
                <option value="cool">${i18n.t('backgroundRemover.filters.cool')}</option>
                <option value="warm">${i18n.t('backgroundRemover.filters.warm')}</option>
              </select>
            </div>
            
            <div class="control-group ${!isPremium ? 'premium-locked' : ''}" id="background-controls">
              <label>${i18n.t('backgroundRemover.background')} ${!isPremium ? getIcon('premium') : ''}</label>
              <div class="background-controls">
                <select id="background-type" class="background-select">
                  <option value="none">${i18n.t('backgroundRemover.background.none')}</option>
                  <option value="color">${i18n.t('backgroundRemover.background.color')}</option>
                  <option value="gradient">${i18n.t('backgroundRemover.background.gradient')}</option>
                  <option value="image">${i18n.t('backgroundRemover.background.image')}</option>
                </select>
                <input type="color" id="background-color" value="#ffffff" style="display: none;">
                <input type="file" id="background-image" accept="image/*" style="display: none;">
              </div>
            </div>
            
            <div class="control-group ${!isPremium ? 'premium-locked' : ''}" id="export-controls">
              <label>${i18n.t('backgroundRemover.export')}</label>
              <select id="export-format" class="export-select">
                <option value="png">${i18n.t('backgroundRemover.export.png')}</option>
                <option value="jpg" ${!isPremium ? 'disabled' : ''}>${i18n.t('backgroundRemover.export.jpg')} ${!isPremium ? 'PRO' : ''}</option>
                <option value="webp" ${!isPremium ? 'disabled' : ''}>${i18n.t('backgroundRemover.export.webp')} ${!isPremium ? 'PRO' : ''}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;

    contentArea.setContent(container);
    this.attachEvents();
    this.updateTranslations();
    
    this.unsubscribe = i18n.subscribe(() => {
      this.updateTranslations();
    });
  }

  attachEvents() {
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const uploadArea = document.getElementById('upload-area');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const refineBtns = document.querySelectorAll('.refine-btn');
    const brushSize = document.getElementById('brush-size');
    const brightness = document.getElementById('brightness');
    const contrast = document.getElementById('contrast');
    const saturation = document.getElementById('saturation');
    const filterSelect = document.getElementById('filter-select');
    const backgroundType = document.getElementById('background-type');
    const backgroundColor = document.getElementById('background-color');
    const backgroundImage = document.getElementById('background-image');
    const exportFormat = document.getElementById('export-format');
    const applyPalette = document.getElementById('apply-palette');
    
    // Verificar se elementos existem antes de usar
    const isPremium = premium.checkPremium();

    // Upload
    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => fileInput?.click());
    }
    if (uploadArea) {
      uploadArea.addEventListener('click', () => fileInput?.click());
      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
      });
      uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
      });
      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) this.handleFile(files[0]);
      });
    }
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) this.handleFile(file);
      });
    }

    // Download
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadImage());
    }

    // Reset
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }

    const handlePremiumClick = (e) => {
      const target = e.target;
      if (target.closest('.premium-locked') || target.disabled || target.classList.contains('mode-btn') && target.dataset.mode === 'advanced' && !isPremium) {
        e.preventDefault();
        e.stopPropagation();
        const paymentModal = new PaymentModal();
        paymentModal.show(() => {
          if (window.Clerk && window.Clerk.user) {
            if (!window.Clerk.user.publicMetadata) window.Clerk.user.publicMetadata = {};
            window.Clerk.user.publicMetadata.isPremium = true;
            premium.setPremium(true);
            window.location.reload();
          }
        });
        return true;
      }
      return false;
    };

    // Mode selection
    modeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (handlePremiumClick({ target: btn, preventDefault: () => e.preventDefault(), stopPropagation: () => e.stopPropagation() })) return;
        
        this.currentMode = btn.dataset.mode;
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.processedImage) {
          this.processImage();
        }
      });
    });

    // Add listener to locked sections
    if (!isPremium) {
      document.querySelectorAll('.premium-locked').forEach(el => {
        el.addEventListener('click', handlePremiumClick, true);
      });
      if (exportFormat) {
        exportFormat.addEventListener('mousedown', handlePremiumClick, true);
      }
    }

    // Refine controls (Premium)
    if (isPremium && refineBtns && refineBtns.length > 0) {
      refineBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.brushMode = btn.dataset.mode;
          refineBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.setupRefinement();
        });
      });
    }

    if (isPremium && brushSize) {
      brushSize.addEventListener('input', (e) => {
        this.brushSize = parseInt(e.target.value, 10);
        const label = document.querySelector('.brush-size-label');
        if (label) label.textContent = `${this.brushSize}px`;
        if (this.fabricCanvas && this.fabricCanvas.freeDrawingBrush) {
          this.fabricCanvas.freeDrawingBrush.width = this.brushSize;
        }
      });
    }

    // Color adjustments (Premium)
    if (isPremium && brightness) {
      brightness.addEventListener('input', (e) => {
        this.colorAdjustments.brightness = parseInt(e.target.value);
        this.applyColorAdjustments();
      });
    }
    if (isPremium && contrast) {
      contrast.addEventListener('input', (e) => {
        this.colorAdjustments.contrast = parseInt(e.target.value);
        this.applyColorAdjustments();
      });
    }
    if (isPremium && saturation) {
      saturation.addEventListener('input', (e) => {
        this.colorAdjustments.saturation = parseInt(e.target.value);
        this.applyColorAdjustments();
      });
    }

    // Filters (Premium)
    if (isPremium && filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        this.currentFilter = e.target.value;
        this.applyFilter();
      });
    }

    // Background (Premium)
    if (isPremium && backgroundType) {
      backgroundType.addEventListener('change', (e) => {
        const type = e.target.value;
        if (type === 'color' && backgroundColor) {
          backgroundColor.style.display = 'block';
          backgroundColor.addEventListener('change', (e) => {
            this.customBackground = { type: 'color', value: e.target.value };
            this.applyBackground();
          });
        } else if (type === 'image' && backgroundImage) {
          backgroundImage.style.display = 'block';
          backgroundImage.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                this.customBackground = { type: 'image', value: event.target.result };
                this.applyBackground();
              };
              reader.readAsDataURL(file);
            }
          });
        } else if (type === 'gradient') {
          this.customBackground = { type: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
          this.applyBackground();
        } else {
          this.customBackground = null;
          this.applyBackground();
        }
      });
    }

    // Export format
    if (exportFormat) {
      exportFormat.addEventListener('change', (e) => {
        this.exportFormat = e.target.value;
      });
    }

    // Palette (Premium)
    if (isPremium && applyPalette) {
      applyPalette.addEventListener('click', () => {
        const paletteSelect = document.getElementById('palette-select');
        if (paletteSelect) {
          this.applyPalette(paletteSelect.value);
        }
      });
    }
  }

  async handleFile(file) {
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      Modal.danger(i18n.t('backgroundRemover.errorSize'), () => {});
      return;
    }

    const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validFormats.includes(file.type)) {
      Modal.danger(i18n.t('backgroundRemover.errorFormat'), () => {});
      return;
    }

    try {
      const imageUrl = URL.createObjectURL(file);
      await this.loadImage(imageUrl);
      await this.processImage();
    } catch (error) {
      console.error('Error processing image:', error);
      Modal.danger(i18n.t('backgroundRemover.error'), () => {});
    }
  }

  loadImage(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.originalImage = img;
        const originalPreview = document.getElementById('original-preview');
        if (originalPreview) {
          originalPreview.src = imageUrl;
        }
        resolve();
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  }

  async processImage() {
    const uploadArea = document.getElementById('upload-area');
    const previewArea = document.getElementById('preview-area');
    const processingIndicator = document.getElementById('processing-indicator');
    const processingText = document.getElementById('processing-text') || document.querySelector('#processing-indicator p');
    const downloadBtn = document.getElementById('download-btn');

    if (uploadArea) uploadArea.style.display = 'none';
    if (previewArea) previewArea.style.display = 'grid';
    if (processingIndicator) processingIndicator.style.display = 'flex';
    if (downloadBtn) downloadBtn.disabled = true;

    // Ensure ML library is loaded before processing
    if (!removeBackgroundLib) {
      if (processingText) {
        processingText.innerHTML = `Inicializando motor de Inteligência Artificial...<br><span style="font-size: 11px; opacity: 0.7; margin-top: 6px; display: block; line-height: 1.4;">A carregar ferramentas de processamento (apenas na primeira execução)</span>`;
      }
      await loadLibraries();
    }

    if (processingText) {
      processingText.innerHTML = `Removendo fundo automaticamente...<br><span style="font-size: 11px; opacity: 0.7; margin-top: 6px; display: block; line-height: 1.4;">Descarregando modelo de precisão. Se a sua ligação à Internet for mais lenta, isto pode demorar um pouco. Por favor, aguarde.</span>`;
    }

    try {
      const canvas = document.getElementById('processed-canvas');
      if (!canvas || !this.originalImage) return;

      if (this.currentMode === 'advanced' && premium.hasFeature('advancedRemoval') && removeBackgroundLib) {
        // Usar biblioteca avançada
        await this.processAdvanced();
      } else {
        // Usar algoritmo básico
        await this.processBasic();
      }

      if (processingIndicator) processingIndicator.style.display = 'none';
      if (downloadBtn) downloadBtn.disabled = false;
      Modal.success(i18n.t('backgroundRemover.success'), () => {});
    } catch (error) {
      console.error('Error processing:', error);
      if (processingIndicator) processingIndicator.style.display = 'none';
      Modal.danger(i18n.t('backgroundRemover.error'), () => {});
    }
  }

  async processAdvanced() {
    if (!removeBackgroundLib) {
      await loadLibraries();
    }

    const canvas = document.getElementById('processed-canvas');
    const fileInput = document.getElementById('file-input');
    const file = fileInput?.files[0];

    if (!file) {
      // Converter canvas para blob se necessário
      const blob = await new Promise(resolve => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.originalImage.width;
        tempCanvas.height = this.originalImage.height;
        const ctx = tempCanvas.getContext('2d');
        ctx.drawImage(this.originalImage, 0, 0);
        tempCanvas.toBlob(resolve, 'image/png');
      });

      const resultBlob = await removeBackgroundLib(blob);
      const img = await this.blobToImage(resultBlob);
      
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      this.processedImage = canvas;
      this.committedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } else {
      const resultBlob = await removeBackgroundLib(file);
      const img = await this.blobToImage(resultBlob);
      
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      this.processedImage = canvas;
      this.committedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  }

  async processBasic() {
    const canvas = document.getElementById('processed-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Use ML library if available (preferred)
    if (removeBackgroundLib) {
      try {
        const fileInput = document.getElementById('file-input');
        const file = fileInput?.files[0];
        let resultBlob;

        if (file) {
          resultBlob = await removeBackgroundLib(file);
        } else {
          // Convert original image to blob
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = this.originalImage.width;
          tempCanvas.height = this.originalImage.height;
          const tempCtx = tempCanvas.getContext('2d');
          tempCtx.drawImage(this.originalImage, 0, 0);
          const blob = await new Promise(resolve => tempCanvas.toBlob(resolve, 'image/png'));
          resultBlob = await removeBackgroundLib(blob);
        }

        const img = await this.blobToImage(resultBlob);
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        this.processedImage = canvas;
        this.committedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        return;
      } catch (error) {
        console.warn('ML background removal failed, falling back to basic algorithm:', error);
      }
    }

    // Fallback: naive corner-sampling algorithm
    canvas.width = this.originalImage.width;
    canvas.height = this.originalImage.height;
    ctx.drawImage(this.originalImage, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const width = canvas.width;
    const height = canvas.height;
    
    const cornerSamples = this.getCornerSamples(data, width, height);
    const bgColor = this.calculateBackgroundColor(cornerSamples);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const similarity = this.colorSimilarity(r, g, b, bgColor.r, bgColor.g, bgColor.b);
        const centerX = width / 2;
        const centerY = height / 2;
        const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const maxDist = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
        const edgeFactor = distFromCenter / maxDist;
        const removeThreshold = 0.85 + (edgeFactor * 0.1);
        
        if (similarity > removeThreshold) {
          data[i + 3] = 0;
        } else if (similarity > 0.7) {
          const alpha = ((removeThreshold - similarity) / (removeThreshold - 0.7)) * 255;
          data[i + 3] = Math.max(0, Math.min(255, alpha));
        }
      }
    }

    this.smoothEdges(data, width, height);
    ctx.putImageData(imageData, 0, 0);
    this.processedImage = canvas;
    this.committedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  blobToImage(blob) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }

  /**
   * Rasterize a Fabric path to a Set of "x,y" pixel keys covered by the stroke.
   * Uses a temp canvas: draw path with stroke (object transform applied), then collect pixels with alpha > 0.
   */
  getStrokePixels(pathObj, width, height, brushSize) {
    if (!pathObj || !pathObj.path || width <= 0 || height <= 0) return new Set();
    const pathData = pathObj.path;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return new Set();

    ctx.strokeStyle = 'white';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    const left = pathObj.left ?? 0;
    const top = pathObj.top ?? 0;
    const scaleX = pathObj.scaleX ?? 1;
    const scaleY = pathObj.scaleY ?? 1;

    let x = 0, y = 0;
    for (let i = 0; i < pathData.length; i++) {
      const cmd = pathData[i];
      if (!Array.isArray(cmd) || cmd.length === 0) continue;
      const c = String(cmd[0]).toUpperCase();
      if (c === 'M') {
        x = cmd[1] * scaleX + left;
        y = cmd[2] * scaleY + top;
        ctx.moveTo(x, y);
      } else if (c === 'L') {
        x = cmd[1] * scaleX + left;
        y = cmd[2] * scaleY + top;
        ctx.lineTo(x, y);
      } else if (c === 'Q') {
        const x1 = cmd[1] * scaleX + left;
        const y1 = cmd[2] * scaleY + top;
        x = cmd[3] * scaleX + left;
        y = cmd[4] * scaleY + top;
        ctx.quadraticCurveTo(x1, y1, x, y);
      } else if (c === 'C') {
        const x1 = cmd[1] * scaleX + left;
        const y1 = cmd[2] * scaleY + top;
        const x2 = cmd[3] * scaleX + left;
        const y2 = cmd[4] * scaleY + top;
        x = cmd[5] * scaleX + left;
        y = cmd[6] * scaleY + top;
        ctx.bezierCurveTo(x1, y1, x2, y2, x, y);
      } else if (c === 'Z') {
        ctx.closePath();
      }
    }
    ctx.stroke();

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const pixels = new Set();
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const i = (py * width + px) * 4;
        if (data[i + 3] > 0) pixels.add(`${px},${py}`);
      }
    }
    return pixels;
  }

  setupRefinement() {
    if (!premium.hasFeature('manualRefinement') || !fabric) return;
    if (!this.committedImageData || !this.processedImage) return;

    const canvas = document.getElementById('processed-canvas');
    if (!canvas) return;

    if (this.fabricCanvas) {
      this.fabricCanvas.dispose();
      this.fabricCanvas = null;
    }

    const ctx = canvas.getContext('2d');
    ctx.putImageData(this.committedImageData, 0, 0);

    this.fabricCanvas = new fabric.Canvas(canvas, {
      isDrawingMode: true,
      freeDrawingBrush: {
        width: this.brushSize,
        color: this.brushMode === 'add' ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)'
      }
    });

    this.fabricCanvas.on('path:created', () => {
      this.applyRefinement();
    });
  }

  applyRefinement() {
    if (!this.fabricCanvas) return;

    const canvas = this.fabricCanvas.lowerCanvasEl || this.fabricCanvas.getElement?.() || document.getElementById('processed-canvas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    if (w <= 0 || h <= 0) return;

    const objects = this.fabricCanvas.getObjects();
    const pathObj = [...objects].reverse().find(obj => obj.type === 'path');
    if (!pathObj) return;

    if (!this.committedImageData || this.committedImageData.width !== w || this.committedImageData.height !== h) {
      this.committedImageData = ctx.getImageData(0, 0, w, h);
    }
    const data = this.committedImageData.data;
    const width = this.committedImageData.width;
    const height = this.committedImageData.height;

    const strokePixels = this.getStrokePixels(pathObj, w, h, this.brushSize);
    if (strokePixels.size === 0) {
      this.fabricCanvas.remove(pathObj);
      this.fabricCanvas.requestRenderAll();
      ctx.putImageData(this.committedImageData, 0, 0);
      return;
    }

    let originalData = null;
    if (this.brushMode === 'add' && this.originalImage) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(this.originalImage, 0, 0);
      originalData = tempCtx.getImageData(0, 0, width, height).data;
    }

    for (const key of strokePixels) {
      const [px, py] = key.split(',').map(Number);
      if (px < 0 || px >= width || py < 0 || py >= height) continue;
      const i = (py * width + px) * 4;
      if (this.brushMode === 'remove') {
        data[i + 3] = 0;
      } else {
        if (originalData) {
          data[i] = originalData[i];
          data[i + 1] = originalData[i + 1];
          data[i + 2] = originalData[i + 2];
        }
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(this.committedImageData, 0, 0);
    this.fabricCanvas.remove(pathObj);
    this.fabricCanvas.requestRenderAll();
    this.updatePreview();
  }

  applyColorAdjustments() {
    this.renderImage();
  }

  applyFilter() {
    this.renderImage();
  }

  applyPalette(paletteName) {
    this.renderImage();
  }

  applyBackground() {
    this.renderImage();
  }

  applyVintageFilter(data) {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      data[i] = Math.min(255, r * 0.9 + g * 0.1);
      data[i + 1] = Math.min(255, g * 0.9 + b * 0.1);
      data[i + 2] = Math.min(255, b * 0.8);
    }
  }

  applyBlackWhiteFilter(data) {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
  }

  applySepiaFilter(data) {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
      data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
      data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
    }
  }

  applyCoolFilter(data) {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      data[i] = Math.min(255, data[i] * 0.9);
      data[i + 1] = Math.min(255, data[i + 1] * 1.1);
      data[i + 2] = Math.min(255, data[i + 2] * 1.2);
    }
  }

  applyWarmFilter(data) {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      data[i] = Math.min(255, data[i] * 1.2);
      data[i + 1] = Math.min(255, data[i + 1] * 1.1);
      data[i + 2] = Math.min(255, data[i + 2] * 0.9);
    }
  }

  applyPaletteToData(data, paletteName) {
    if (!Color) return;
    const palettes = {
      vibrant: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
      pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFDFBA'],
      monochrome: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC'],
      warm: ['#FF6B35', '#F7931E', '#FFD23F', '#FF6B9D', '#C44569'],
      cool: ['#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA15E']
    };

    const palette = palettes[paletteName];
    if (!palette) return;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      let minDist = Infinity;
      let closestColor = palette[0];
      
      palette.forEach(color => {
        const c = new Color(color);
        const dist = Math.sqrt(
          Math.pow(r - c.srgb.r * 255, 2) +
          Math.pow(g - c.srgb.g * 255, 2) +
          Math.pow(b - c.srgb.b * 255, 2)
        );
        if (dist < minDist) {
          minDist = dist;
          closestColor = color;
        }
      });
      
      const c = new Color(closestColor);
      data[i] = c.srgb.r * 255;
      data[i + 1] = c.srgb.g * 255;
      data[i + 2] = c.srgb.b * 255;
    }
  }

  renderImage() {
    if (!this.processedImage || !this.committedImageData) return;

    const canvas = this.processedImage;
    const ctx = canvas.getContext('2d');
    
    // 1. Start with a fresh copy of the clean background-removed image data (the baseline)
    const imageData = new ImageData(
      new Uint8ClampedArray(this.committedImageData.data),
      this.committedImageData.width,
      this.committedImageData.height
    );
    const data = imageData.data;

    // 2. Apply color adjustments (brightness, contrast, saturation)
    const brightness = this.colorAdjustments.brightness / 100;
    const contrast = (this.colorAdjustments.contrast + 100) / 100;
    const saturation = (this.colorAdjustments.saturation + 100) / 100;

    const hasColorAdjustments = brightness !== 0 || contrast !== 1 || saturation !== 1;
    if (hasColorAdjustments) {
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) continue;

        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Brightness
        r += brightness * 255;
        g += brightness * 255;
        b += brightness * 255;

        // Contrast
        r = ((r - 128) * contrast) + 128;
        g = ((g - 128) * contrast) + 128;
        b = ((b - 128) * contrast) + 128;

        // Saturation
        const gray = r * 0.299 + g * 0.587 + b * 0.114;
        r = gray + (r - gray) * saturation;
        g = gray + (g - gray) * saturation;
        b = gray + (b - gray) * saturation;

        data[i] = Math.max(0, Math.min(255, r));
        data[i + 1] = Math.max(0, Math.min(255, g));
        data[i + 2] = Math.max(0, Math.min(255, b));
      }
    }

    // 3. Apply filter
    if (this.currentFilter && this.currentFilter !== 'none') {
      switch (this.currentFilter) {
        case 'vintage':
          this.applyVintageFilter(data);
          break;
        case 'blackwhite':
          this.applyBlackWhiteFilter(data);
          break;
        case 'sepia':
          this.applySepiaFilter(data);
          break;
        case 'cool':
          this.applyCoolFilter(data);
          break;
        case 'warm':
          this.applyWarmFilter(data);
          break;
      }
    }

    // 4. Apply palette quantization if active
    const paletteSelect = document.getElementById('palette-select');
    if (paletteSelect && paletteSelect.value !== 'none' && Color) {
      this.applyPaletteToData(data, paletteSelect.value);
    }

    // 5. Render background
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    if (this.customBackground) {
      if (this.customBackground.type === 'color') {
        tempCtx.fillStyle = this.customBackground.value;
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      } else if (this.customBackground.type === 'gradient') {
        const gradient = tempCtx.createLinearGradient(0, 0, tempCanvas.width, tempCanvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        tempCtx.fillStyle = gradient;
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      } else if (this.customBackground.type === 'image') {
        const img = new Image();
        img.onload = () => {
          tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
          
          // Draw the adjusted image on top
          const imgCanvas = document.createElement('canvas');
          imgCanvas.width = canvas.width;
          imgCanvas.height = canvas.height;
          imgCanvas.getContext('2d').putImageData(imageData, 0, 0);
          tempCtx.drawImage(imgCanvas, 0, 0);
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(tempCanvas, 0, 0);
          this.updatePreview();
        };
        img.src = this.customBackground.value;
        return; // Asynchronous image load handles the drawing
      }
    }

    // Draw the adjusted image on top of standard background
    const imgCanvas = document.createElement('canvas');
    imgCanvas.width = canvas.width;
    imgCanvas.height = canvas.height;
    imgCanvas.getContext('2d').putImageData(imageData, 0, 0);
    tempCtx.drawImage(imgCanvas, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
    this.updatePreview();
  }

  updatePreview() {
    // Atualizar preview se necessário
    const resultContainer = document.getElementById('result-container');
    if (resultContainer && this.processedImage) {
      // Preview já está atualizado via canvas
    }
  }

  downloadImage() {
    if (!this.processedImage) return;

    const canvas = this.processedImage;
    const mimeType = this.exportFormat === 'png' ? 'image/png' : 
                     this.exportFormat === 'jpg' ? 'image/jpeg' : 
                     'image/webp';
    
    const quality = this.exportFormat === 'png' ? undefined : 0.92;

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image-no-background-${Date.now()}.${this.exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, mimeType, quality);
  }

  reset() {
    const uploadArea = document.getElementById('upload-area');
    const previewArea = document.getElementById('preview-area');
    const fileInput = document.getElementById('file-input');

    if (uploadArea) uploadArea.style.display = 'block';
    if (previewArea) previewArea.style.display = 'none';
    if (fileInput) fileInput.value = '';

    if (this.fabricCanvas) {
      this.fabricCanvas.dispose();
      this.fabricCanvas = null;
    }

    this.originalImage = null;
    this.processedImage = null;
    this.committedImageData = null;
    this.currentMode = 'basic';
    this.colorAdjustments = { brightness: 0, contrast: 0, saturation: 0 };
    this.currentFilter = 'none';
    this.customBackground = null;
  }

  // Métodos auxiliares do algoritmo básico
  getCornerSamples(data, width, height) {
    const sampleSize = Math.min(50, Math.floor(width * 0.1), Math.floor(height * 0.1));
    const samples = [];
    
    const corners = [
      { x: 0, y: 0 },
      { x: width - sampleSize, y: 0 },
      { x: 0, y: height - sampleSize },
      { x: width - sampleSize, y: height - sampleSize }
    ];
    
    corners.forEach(corner => {
      for (let y = corner.y; y < corner.y + sampleSize; y++) {
        for (let x = corner.x; x < corner.x + sampleSize; x++) {
          const i = (y * width + x) * 4;
          samples.push({
            r: data[i],
            g: data[i + 1],
            b: data[i + 2]
          });
        }
      }
    });
    
    return samples;
  }

  calculateBackgroundColor(samples) {
    let totalR = 0, totalG = 0, totalB = 0;
    samples.forEach(sample => {
      totalR += sample.r;
      totalG += sample.g;
      totalB += sample.b;
    });
    
    return {
      r: totalR / samples.length,
      g: totalG / samples.length,
      b: totalB / samples.length
    };
  }

  colorSimilarity(r1, g1, b1, r2, g2, b2) {
    const dr = r1 - r2;
    const dg = g1 - g2;
    const db = b1 - b2;
    const distance = Math.sqrt(dr * dr + dg * dg + db * db);
    return 1 - (distance / 441.67);
  }

  smoothEdges(data, width, height) {
    const tempData = new Uint8ClampedArray(data);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = (y * width + x) * 4;
        const alpha = data[i + 3];
        
        if (alpha > 0 && alpha < 255) {
          let neighborAlphas = [];
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const ni = ((y + dy) * width + (x + dx)) * 4;
              neighborAlphas.push(tempData[ni + 3]);
            }
          }
          
          const avgAlpha = neighborAlphas.reduce((a, b) => a + b, 0) / neighborAlphas.length;
          data[i + 3] = (alpha + avgAlpha) / 2;
        }
      }
    }
  }

  updateTranslations() {
    // Atualizar textos traduzidos
    const title = document.querySelector('.background-remover-header h1');
    const subtitle = document.querySelector('.background-remover-subtitle');
    const uploadText = document.querySelector('.upload-text');
    const uploadBtn = document.getElementById('upload-btn');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');
    const processingText = document.querySelector('#processing-indicator p');

    if (title) title.textContent = i18n.t('backgroundRemover.title');
    if (subtitle) subtitle.textContent = i18n.t('backgroundRemover.subtitle');
    if (uploadText) uploadText.textContent = i18n.t('backgroundRemover.dragDrop');
    if (uploadBtn) uploadBtn.textContent = i18n.t('backgroundRemover.upload');
    if (downloadBtn) downloadBtn.innerHTML = `${getIcon('download')} ${i18n.t('backgroundRemover.download')}`;
    if (resetBtn) resetBtn.textContent = i18n.t('backgroundRemover.reset');
    if (processingText) processingText.textContent = i18n.t('backgroundRemover.processing');
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.fabricCanvas) {
      this.fabricCanvas.dispose();
    }
  }
}

export default BackgroundRemover;
