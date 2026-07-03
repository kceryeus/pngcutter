import i18n from '../../i18n/i18n.js';
import Modal from '../../components/Modal/Modal.js';
import { getIcon } from '../../utils/icons.js';
import JSZip from 'jszip';

class FormatConverter {
  constructor() {
    this.files = [];
    this.processedFiles = [];
    this.targetFormat = 'image/png';
    this.quality = 0.9;
  }

  render(contentArea) {
    const container = document.createElement('div');
    container.className = 'bulk-tool';
    
    container.innerHTML = `
      <div class="tool-header">
        <h1>${i18n.t('sidebar.formatConverter')}</h1>
        <p class="tool-subtitle">Converta imagens entre PNG, JPG e WEBP em lote.</p>
      </div>
      
      <div class="tool-content">
        <div class="tool-upload-area" id="format-upload-area">
          <div class="upload-area-content">
            <div class="upload-icon">${getIcon('camera')}</div>
            <p class="upload-text">Arraste e solte várias imagens</p>
            <p class="upload-hint">Formatos suportados: JPG, PNG, WEBP</p>
            <input type="file" id="format-file-input" accept="image/jpeg,image/jpg,image/png,image/webp" multiple style="display: none;">
            <button class="upload-btn" id="format-upload-btn">Selecionar Imagens</button>
          </div>
        </div>
        
        <div class="tool-workspace" id="format-workspace" style="display: none;">
          <div class="workspace-sidebar">
            <div class="control-group">
              <label>Converter Para</label>
              <select id="target-format" class="tool-select">
                <option value="image/png">PNG (.png)</option>
                <option value="image/jpeg">JPG (.jpg)</option>
                <option value="image/webp">WEBP (.webp)</option>
              </select>
            </div>
            
            <div id="quality-controls" class="control-group" style="display: none;">
              <label>Qualidade (<span id="quality-label">90%</span>)</label>
              <input type="range" id="format-quality" min="10" max="100" value="90" class="tool-slider">
            </div>
            
            <div class="workspace-actions">
              <button class="action-btn btn-primary" id="format-process-btn">Converter Imagens</button>
              <button class="action-btn btn-secondary" id="format-download-btn" disabled>Descarregar ZIP</button>
            </div>
          </div>
          
          <div class="workspace-main">
            <h3>Ficheiros Selecionados (<span id="format-file-count">0</span>)</h3>
            <div class="file-grid" id="format-file-grid"></div>
            
            <div class="loading-overlay" id="format-loading" style="display: none;">
              <div class="spinner"></div>
              <p>A converter...</p>
            </div>
          </div>
        </div>
      </div>
    `;

    contentArea.setContent(container);
    this.attachEvents();
  }

  attachEvents() {
    const fileInput = document.getElementById('format-file-input');
    const uploadBtn = document.getElementById('format-upload-btn');
    const uploadArea = document.getElementById('format-upload-area');
    const targetFormat = document.getElementById('target-format');
    const qualityControls = document.getElementById('quality-controls');
    const formatQuality = document.getElementById('format-quality');
    const qualityLabel = document.getElementById('quality-label');
    const processBtn = document.getElementById('format-process-btn');
    const downloadBtn = document.getElementById('format-download-btn');

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

    if (targetFormat) {
      targetFormat.addEventListener('change', (e) => {
        this.targetFormat = e.target.value;
        if (this.targetFormat === 'image/jpeg' || this.targetFormat === 'image/webp') {
          qualityControls.style.display = 'flex';
        } else {
          qualityControls.style.display = 'none';
        }
      });
    }

    if (formatQuality) {
      formatQuality.addEventListener('input', (e) => {
        this.quality = parseInt(e.target.value) / 100;
        if (qualityLabel) qualityLabel.textContent = e.target.value + '%';
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
    
    document.getElementById('format-upload-area').style.display = 'none';
    document.getElementById('format-workspace').style.display = 'grid';
  }

  updateFileGrid() {
    const grid = document.getElementById('format-file-grid');
    const count = document.getElementById('format-file-count');
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
          document.getElementById('format-upload-area').style.display = 'flex';
          document.getElementById('format-workspace').style.display = 'none';
        }
      });
    });
  }

  async processImages() {
    if (this.files.length === 0) return;
    
    const loading = document.getElementById('format-loading');
    const downloadBtn = document.getElementById('format-download-btn');
    if (loading) loading.style.display = 'flex';
    if (downloadBtn) downloadBtn.disabled = true;
    
    this.processedFiles = [];
    
    for (const file of this.files) {
      try {
        const processed = await this.convertImage(file);
        
        let extension = 'png';
        if (this.targetFormat === 'image/jpeg') extension = 'jpg';
        if (this.targetFormat === 'image/webp') extension = 'webp';
        
        // Remove old extension and add new one
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const newName = `${baseName}_converted.${extension}`;
        
        this.processedFiles.push({ name: newName, blob: processed });
      } catch (e) {
        console.error('Error converting', file.name, e);
      }
    }
    
    if (loading) loading.style.display = 'none';
    if (downloadBtn && this.processedFiles.length > 0) {
      downloadBtn.disabled = false;
      Modal.success('Imagens convertidas com sucesso!', () => {});
    }
  }

  convertImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        // If converting to jpeg, fill background with white first (in case of transparent png)
        if (this.targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => resolve(blob), this.targetFormat, this.quality);
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
      a.download = 'moz-image-studio-converted.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Zip generation failed', e);
      Modal.danger('Erro ao gerar o ficheiro ZIP.', () => {});
    }
  }
}

export default FormatConverter;
