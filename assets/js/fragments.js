// Función para obtener la ruta relativa base según la profundidad de la URL actual
function getRootPath() {
    // Obtener la URL actual
    const currentPath = window.location.pathname;
    console.log("Ruta actual:", currentPath);
    
    // Determinar si estamos en una página interna o en la raíz
    let rootPath = "";
    
    // Verificar si estamos en index.html o en la raíz del sitio
    if (currentPath === "/" || currentPath.endsWith("/index.html") || currentPath.endsWith("/")) {
        rootPath = "";
    }
    // Verificar si estamos en una página dentro de la carpeta /pages/
    else if (currentPath.includes('/pages/')) {
        // Si estamos en /pages/archivo.html
        if (currentPath.split('/').filter(part => part.length > 0).length === 2) {
            rootPath = "../";
        }
        // Si estamos en /pages/carpeta/archivo.html
        else if (currentPath.split('/').filter(part => part.length > 0).length === 3) {
            rootPath = "../../";
        }
    }
    
    console.log("Ruta raíz calculada:", rootPath);
    return rootPath;
}

// Función para cargar fragmentos HTML (navbar y footer)
async function loadFragment(containerId, fragmentPath) {
    try {
        const rootPath = getRootPath();
        const fullPath = rootPath + fragmentPath;
        
        console.log(`Cargando fragmento ${fragmentPath} en ${containerId}`);
        console.log(`Ruta completa: ${fullPath}`);
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor ${containerId} no encontrado`);
            return;
        }
        
        const response = await fetch(fullPath);
        if (!response.ok) {
            throw new Error(`Error al cargar el fragmento: ${response.status}`);
        }
        
        let html = await response.text();
        
        // Reemplazar la variable #ROOT_PATH# en el HTML con la ruta raíz calculada
        html = html.replace(/#ROOT_PATH#/g, rootPath);
        
        // Insertar el HTML en el contenedor
        container.innerHTML = html;
        
        // Si es la barra de navegación, activar el elemento actual
        if (containerId === 'navbar-container') {
            activateCurrentNavItem();
        }
        
        console.log(`Fragmento ${fragmentPath} cargado correctamente`);
    } catch (error) {
        console.error('Error al cargar el fragmento:', error);
    }
}

// Función para activar el elemento de navegación actual
function activateCurrentNavItem() {
    // Obtener la URL actual
    const currentPath = window.location.pathname;
    console.log("Activando elemento de navegación para:", currentPath);
    
    // Seleccionar todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-links a');
    if (!navLinks || navLinks.length === 0) {
        console.warn('No se encontraron elementos de navegación');
        return;
    }
    
    // Eliminar la clase 'active' de todos los enlaces
    navLinks.forEach(link => {
        link.classList.remove('active');
        // Si el padre es un elemento de lista con clase 'dropdown', también eliminar 'active'
        if (link.parentElement.parentElement.classList.contains('dropdown')) {
            link.parentElement.parentElement.classList.remove('active');
        }
    });
    
    // Buscar y activar el enlace que coincide con la URL actual
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (!linkPath) return;
        
        // Verificar si la URL actual termina con el path del enlace
        if (currentPath.endsWith(linkPath) || 
            (currentPath === '/' && linkPath === 'index.html') ||
            (currentPath.endsWith('/index.html') && linkPath === 'index.html')) {
            
            link.classList.add('active');
            
            // Si el enlace está dentro de un dropdown, activar también el dropdown
            const parentLi = link.closest('li.dropdown');
            if (parentLi) {
                parentLi.classList.add('active');
                // También activar el enlace principal del dropdown
                const dropdownLink = parentLi.querySelector(':scope > a');
                if (dropdownLink) {
                    dropdownLink.classList.add('active');
                }
            }
            
            console.log("Elemento activado:", linkPath);
        }
    });
}

// Cargar los fragmentos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado, iniciando carga de fragmentos");
    
    // Cargar la barra de navegación
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        loadFragment('navbar-container', 'fragments/nav.html');
    } else {
        console.log("No se encontró el contenedor de la barra de navegación");
    }
    
    // Cargar el pie de página
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        loadFragment('footer-container', 'fragments/footer.html');
    } else {
        console.log("No se encontró el contenedor del pie de página");
    }
});