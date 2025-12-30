import sidebarHtml from './index.html?raw'; 

export const renderSidebar = (elemento) => {
  elemento.innerHTML = sidebarHtml;
};
