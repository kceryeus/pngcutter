import i18n from '../../i18n/i18n.js';
import Modal from '../../components/Modal/Modal.js';
import { getIcon } from '../../utils/icons.js';
import JSZip from 'jszip';

class BulkResizer {
  constructor() {
    this.files = [];
    this.processedFiles = [];
    this.resizeMode = 'percentage'; // 'percentage' or 'exact'
    this.resizeValue = 50; // default 50%
    this.exactWidth = 800;
    this.exactHeight = 600;
    this.maintainRatio = true;
  }

  render(contentArea) {
    const container = document.createElement('div');
    container.className = 'bulk-tool';
    
    container.innerHTML = `
      <div class="tool-header">
        <h1>${i18n.t('sidebar.bulkResizer')}</h1>
        <p class="tool-subtitle">Redimensione múltiplas imagens de uma só vez para poupar tempo.</p>
      </div>
      
      <div class="tool-content">
        <div class="tool-upload-area" id="bulk-upload-area">
          <div class="upload-area-content">
            <div class="upload-icon">${getIcon('camera')}</div>
            <p class="upload-text">Arraste e solte várias imagens</p>
            <p class="upload-hint">Formatos suportados: JPG, PNG, WEBP</p>
            <input type="file" id="bulk-file-input" accept="image/jpeg,image/jpg,image/png,image/webp" multiple style="display: none;">
            <button class="upload-btn" id="bulk-upload-btn">Selecionar Imagens</button>
          </div>
        </div>
        
        <div class="tool-workspace" id="bulk-workspace" style="display: none;">
          <div class="workspace-sidebar">
            <div class="control-group">
              <label>Modo de Redimensionamento</label>
              <select id="resize-mode" class="tool-select">
                <option value="percentage">Percentagem</option>
                <option value="exact">Tamanho Exato (px)</option>
              </select>
            </div>
            
            <div id="percentage-controls" class="control-group">
              <label>Escala (%)</label>
              <input type="range" id="resize-percentage" min="10" max="200" value="50" class="tool-slider">
              <span id="percentage-label" class="slider-label">50%</span>
            </div>
            
            <div id="exact-controls" class="control-group" style="display: none;">
              <div class="size-inputs">
                <div class="size-input-wrapper">
                  <label>Largura</label>
                  <input type="number" id="resize-width" value="800" class="tool-input">
                </div>
                <div class="size-input-wrapper">
                  <label>Altura</label>
                  <input type="number" id="resize-height" value="600" class="tool-input">
                </div>
              </div>
              <div class="checkbox-wrapper">
                <input type="checkbox" id="maintain-ratio" checked>
                <label for="maintain-ratio">Manter proporção</label>
              </div>
            </div>
            
            <div class="workspace-actions">
              <button class="action-btn btn-primary" id="process-btn">Processar Imagens</button>
              <button class="action-btn btn-secondary" id="bulk-download-btn" disabled>Descarregar ZIP</button>
            </div>
          </div>
          
          <div class="workspace-main">
            <h3>Ficheiros Selecionados (<span id="file-count">0</span>)</h3>
            <div class="file-grid" id="file-grid"></div>
            
            <div class="loading-overlay" id="bulk-loading" style="display: none;">
              <div class="spinner"></div>
              <p>A processar...</p>
            </div>
          </div>
        </div>
      </div>
    `;

    contentArea.setContent(container);
    this.attachEvents();
  }

  attachEvents() {
    const fileInput = document.getElementById('bulk-file-input');
    const uploadBtn = document.getElementById('bulk-upload-btn');
    const uploadArea = document.getElementById('bulk-upload-area');
    const resizeMode = document.getElementById('resize-mode');
    const percentageControls = document.getElementById('percentage-controls');
    const exactControls = document.getElementById('exact-controls');
    const resizePercentage = document.getElementById('resize-percentage');
    const percentageLabel = document.getElementById('percentage-label');
    const processBtn = document.getElementById('process-btn');
    const downloadBtn = document.getElementById('bulk-download-btn');

    if (uploadBtn) uploadBtn.addEventListener('click', () => fileInput?.click());
    
    if (uploadArea) {
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
        if (e.dataTransfer.files.length > 0) this.handleFiles(Array.from(e.dataTransfer.files));
      });
    }
    
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) this.handleFiles(Array.from(e.target.files));
      });
    }

    if (resizeMode) {
      resizeMode.addEventListener('change', (e) => {
        this.resizeMode = e.target.value;
        if (this.resizeMode === 'percentage') {
          percentageControls.style.display = 'flex';
          exactControls.style.display = 'none';
        } else {
          percentageControls.style.display = 'none';
          exactControls.style.display = 'flex';
        }
      });
    }

    if (resizePercentage) {
      resizePercentage.addEventListener('input', (e) => {
        this.resizeValue = e.target.value;
        if (percentageLabel) percentageLabel.textContent = this.resizeValue + '%';
      });
    }

    if (processBtn) processBtn.addEventListener('click', () => this.processImages());
    if (downloadBtn) downloadBtn.addEventListener('click', () => this.downloadZip());
  }

  handleFiles(files) {
    const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validFiles = files.filter(f => validFormats.includes(f.type));
    
    if (validFiles.length === 0) {
      Modal.danger('Nenhuma imagem válida selecionada.', () => {});
      return;
    }
    
    this.files = [...this.files, ...validFiles];
    this.updateFileGrid();
    
    document.getElementById('bulk-upload-area').style.display = 'none';
    document.getElementById('bulk-workspace').style.display = 'grid';
  }

  updateFileGrid() {
    const grid = document.getElementById('file-grid');
    const count = document.getElementById('file-count');
    if (!grid || !count) return;
    
    count.textContent = this.files.length;
    grid.innerHTML = '';
    
    this.files.forEach((file, index) => {
      const item = document.createElement('div');
      item.className = 'file-item';
      
      const url = URL.createObjectURL(file);
      item.innerHTML = `
        <img src="${url}" alt="${file.name}">
        <p class="file-name">${file.name}</p>
        <button class="remove-file-btn" data-index="${index}">✕</button>
      `;
      
      grid.appendChild(item);
    });
    
    document.querySelectorAll('.remove-file-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        this.files.splice(index, 1);
        this.updateFileGrid();
        if (this.files.length === 0) {
          document.getElementById('bulk-upload-area').style.display = 'flex';
          document.getElementById('bulk-workspace').style.display = 'none';
        }
      });
    });
  }

  async processImages() {
    if (this.files.length === 0) return;
    
    const loading = document.getElementById('bulk-loading');
    const downloadBtn = document.getElementById('bulk-download-btn');
    if (loading) loading.style.display = 'flex';
    if (downloadBtn) downloadBtn.disabled = true;
    
    this.processedFiles = [];
    const exactWidth = parseInt(document.getElementById('resize-width').value) || 800;
    const exactHeight = parseInt(document.getElementById('resize-height').value) || 600;
    const maintainRatio = document.getElementById('maintain-ratio').checked;
    
    for (const file of this.files) {
      try {
        const processed = await this.resizeImage(file, exactWidth, exactHeight, maintainRatio);
        this.processedFiles.push({ name: `resized_${file.name}`, blob: processed });
      } catch (e) {
        console.error('Error resizing', file.name, e);
      }
    }
    
    if (loading) loading.style.display = 'none';
    if (downloadBtn && this.processedFiles.length > 0) {
      downloadBtn.disabled = false;
      Modal.success('Imagens redimensionadas com sucesso!', () => {});
    }
  }

  resizeImage(file, exactWidth, exactHeight, maintainRatio) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        let targetWidth, targetHeight;
        
        if (this.resizeMode === 'percentage') {
          const scale = this.resizeValue / 100;
          targetWidth = img.width * scale;
          targetHeight = img.height * scale;
        } else {
          if (maintainRatio) {
            const ratio = Math.min(exactWidth / img.width, exactHeight / img.height);
            targetWidth = img.width * ratio;
            targetHeight = img.height * ratio;
          } else {
            targetWidth = exactWidth;
            targetHeight = exactHeight;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        canvas.toBlob((blob) => resolve(blob), file.type);
      };
      
      img.onerror = reject;
      img.src = url;
    });
  }

  async downloadZip() {
    if (this.processedFiles.length === 0) return;
    
    const zip = new JSZip();
    this.processedFiles.forEach(pf => {
      zip.file(pf.name, pf.blob);
    });
    
    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = 'png-cutter-resized.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Zip generation failed', e);
      Modal.danger('Erro ao gerar o ficheiro ZIP.', () => {});
    }
  }
}

export default BulkResizer;
