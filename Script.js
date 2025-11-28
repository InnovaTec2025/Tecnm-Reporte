// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el formulario existe
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) {
        console.error('No se encontró el formulario de login');
        return;
    }

    // Manejar el formulario de login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = {
            numero_de_control: document.getElementById('numero_de_control').value,
            contraseña: document.getElementById('contraseña').value,
            email: document.getElementById('email').value,
        };

        console.log('Datos del formulario:', formData); // Para debug

        // Validaciones
        if (!validarNumeroDeControl(formData.numero_de_control)) {
            alert('❌ El número de control debe tener 8-10 dígitos');
            return;
        }

        if (!validarContraseña(formData.contraseña)) {
            alert('❌ La contraseña debe tener 18 caracteres alfanuméricos (solo letras mayúsculas y números)');
            return;
        }

        // Generar folio y guardar datos
        formData.folio = generarFolio();
        formData.fecha = new Date().toLocaleString();
        
        // Guardar en localStorage
        localStorage.setItem('usuarioTecnm', JSON.stringify(formData));
        
        // Mostrar confirmación
        alert(`✅ ¡Inicio de sesión exitoso!\nFolio: ${formData.folio}\n\nRedirigiendo al sistema...`);
        
        // Redirigir al dashboard
        window.location.href = 'Reportes.html';
    });
});

// Funciones de validación CORREGIDAS
function validarNumeroDeControl(numero) {
    return /^\d{8,10}$/.test(numero);
}

function validarContraseña(contraseña) {
    // Validar que tenga exactamente 18 caracteres alfanuméricos (según tu pattern)
    return /^[A-Z0-9]{18}$/.test(contraseña);
}

function generarFolio() {
    return 'Tecnm-' + Math.floor(100000 + Math.random() * 900000);
}

// Cargar datos del usuario en el dashboard - CON VERIFICACIONES
function cargarUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuarioTecnm'));
    
    if (!usuario) {
        window.location.href = 'index.html';
        return;
    }

    // Mostrar información del usuario con verificaciones
    if (document.getElementById('userService')) {
        document.getElementById('userService').textContent = usuario.numero_de_control;
    }
    if (document.getElementById('userPhone')) {
        document.getElementById('userPhone').textContent = usuario.contraseña;
    }
    if (document.getElementById('userFolio')) {
        document.getElementById('userFolio').textContent = usuario.folio;
    }
    
    if (usuario.email && document.getElementById('userEmail')) {
        document.getElementById('userEmail').textContent = usuario.email;
    } else if (document.getElementById('emailRow')) {
        document.getElementById('emailRow').style.display = 'none';
    }
}

// Sistema de reportes - CON VERIFICACIONES
function mostrarSeccion(seccionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Mostrar la sección seleccionada
    const seccion = document.getElementById(seccionId);
    if (seccion) {
        seccion.classList.remove('hidden');
    }
}

function crearReporte() {
    const tipoInput = document.getElementById('tipoProblema');
    const descripcionInput = document.getElementById('descripcionProblema');
    const ubicacionInput = document.getElementById('ubicacionProblema');
    
    if (!tipoInput || !descripcionInput || !ubicacionInput) {
        alert('❌ No se encontraron los campos del formulario');
        return;
    }
    
    const tipo = tipoInput.value;
    const descripcion = descripcionInput.value;
    const ubicacion = ubicacionInput.value;
    
    if (!tipo || !descripcion || !ubicacion) {
        alert('❌ Por favor complete todos los campos');
        return;
    }
    
    const usuario = JSON.parse(localStorage.getItem('usuarioTecnm'));
    if (!usuario) {
        alert('❌ No hay sesión activa');
        window.location.href = 'index.html';
        return;
    }
    
    const reporte = {
        folio: usuario.folio,
        tipo,
        descripcion,
        ubicacion,
        fecha: new Date().toLocaleString(),
        estatus: 'Pendiente'
    };
    
    // Guardar reporte
    let reportes = JSON.parse(localStorage.getItem('reportesTecnm') || '[]');
    reportes.push(reporte);
    localStorage.setItem('reportesTecnm', JSON.stringify(reportes));
    
    alert(`✅ Reporte creado exitosamente!\nFolio: ${usuario.folio}`);
    
    // Limpiar formulario
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.reset();
    }
}

function cerrarSesion() {
    localStorage.removeItem('usuarioTecnm');
    localStorage.removeItem('reportesTecnm');
    window.location.href = 'index.html';
}

// Verificar autenticación al cargar páginas protegidas
function verificarAutenticacion() {
    const usuario = JSON.parse(localStorage.getItem('usuarioTecnm'));
    if (!usuario) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Verificar si ya está logueado y redirigir automáticamente
function verificarSesionActiva() {
    const usuario = JSON.parse(localStorage.getItem('usuarioTecnm'));
    if (usuario && window.location.pathname.endsWith('index.html')) {
        // Si ya está logueado y está en la página de login, redirigir a Reportes
        window.location.href = 'Reportes.html';
    }
}

// Ejecutar verificación al cargar
  if (usuario && esPaginaLogin) {
        const irAReportes = confirm(`Ya tienes una sesión activa (Usuario: ${usuario.numero_de_control}). ¿Quieres ir al sistema de reportes?`);
        
        if (irAReportes) {
            window.location.href = 'Reportes.html';
        }
        // Si dice que no, se queda en el login
    }
    
    // Si está en Reportes y NO tiene sesión, redirigir al login
    if (!usuario && esPaginaReportes) {
        alert('No hay sesión activa. Por favor, inicia sesión.');
        window.location.href = 'index.html';
    }
