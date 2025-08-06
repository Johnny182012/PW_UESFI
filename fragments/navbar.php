<?php
// Función para determinar la ruta base según la profundidad de la página actual
function getRootPath() {
    $current_path = $_SERVER['PHP_SELF'];
    $path_parts = explode('/', $current_path);
    $depth = count($path_parts) - 1;
    
    if ($depth <= 1 || basename($current_path) === 'index.php') {
        return '';
    } else if ($depth === 2) {
        return '../';
    } else if ($depth === 3) {
        return '../../';
    }
    
    return '';
}

$root_path = getRootPath();
?>

<nav class="navbar">
    <div class="logo-container">
        <a href="<?php echo $root_path; ?>index.php" class="logo-link">
            <img src="<?php echo $root_path; ?>assets/images/logo/sf_logo_1_2.png" alt="Logo San Francisco" class="logo-img">
        </a>
    </div>

    <button class="menu-toggle" aria-label="Toggle menu">
        <i class="fas fa-bars"></i>
    </button>
    <ul class="nav-links">
        <li><a href="<?php echo $root_path; ?>index.php">Inicio</a></li>
        <li><a href="<?php echo $root_path; ?>pages/noticias.php">Noticias</a></li>
        <li class="dropdown">
            <a href="#">Nosotros <i class="fas fa-chevron-down"></i></a>
            <ul class="dropdown-content">
                <li><a href="<?php echo $root_path; ?>pages/nosotros/historia.php">Historia</a></li>
                <li><a href="<?php echo $root_path; ?>pages/nosotros/mision-vision.php">Misión y Visión</a></li>
                <li><a href="<?php echo $root_path; ?>pages/nosotros/autoridades.php">Autoridades</a></li>
                <li><a href="<?php echo $root_path; ?>pages/nosotros/cuadro-honor.php">Cuadro de Honor</a></li>
            </ul>
        </li>
        <!-- Resto de los elementos del menú con la misma estructura -->
        <li><a href="<?php echo $root_path; ?>pages/contacto.php">Contacto</a></li>
    </ul>
</nav>