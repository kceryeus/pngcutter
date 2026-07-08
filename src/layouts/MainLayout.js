import Sidebar from '../components/Sidebar/Sidebar.js';
import Topbar from '../components/Topbar/Topbar.js';
import ContentArea from '../components/ContentArea/ContentArea.js';

class MainLayout {
  constructor(options = {}) {
    this.sidebar = null;
    this.topbar = null;
    this.contentArea = null;
    this.options = options;
  }

  render() {
    const app = document.getElementById('app');
    if (!app) {
      console.error('Element with id "app" not found');
      return;
    }

    app.innerHTML = `
      <div id="sidebar-container"></div>
      <div id="topbar-container"></div>
      <div id="content-container"></div>
    `;

    // Renderizar Sidebar
    this.sidebar = new Sidebar('sidebar-container', this.options.sidebarItems || []);
    this.sidebar.render();

    // Renderizar Topbar
    this.topbar = new Topbar('topbar-container', this.options.topbarOptions || {});
    this.topbar.render();
    this.topbar.setSidebar(this.sidebar);

    // Renderizar ContentArea
    this.contentArea = new ContentArea('content-container', this.options.contentAreaOptions || {});
    this.contentArea.render();

    // O ajuste do layout é feito via CSS usando a classe no body
    // Não precisa de callback JavaScript adicional
  }

  destroy() {
    if (this.sidebar) this.sidebar.destroy();
    if (this.topbar) this.topbar.destroy();
    if (this.contentArea) this.contentArea.destroy();
  }
}

export default MainLayout;

