const formularioContacto = document.getElementById('contactForm');

formularioContacto.addEventListener('submit', function(evento) {
    evento.preventDefault();
    if (validarFormulario()) {
        enviarEmail();
    }
});

function validarFormulario() {
    const nombre = formularioContacto.elements['name'].value;
    const email = formularioContacto.elements['email'].value;
    const mensaje = formularioContacto.elements['message'].value;

    if (!nombre.match(/^[a-zA-Z0-9\s]+$/)) {
        alert('Nombre inválido. Solo se permiten caracteres alfanuméricos.');
        return false;
    }

    if (!validarEmail(email)) {
        alert('Email inválido.');
        return false;
    }

    if (mensaje.length < 5) {
        alert('El mensaje debe tener al menos 5 caracteres.');
        return false;
    }

    return true;
}

function validarEmail(email) {
    const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patronEmail.test(email);
}

function enviarEmail() {
    const email = document.getElementById("email").value;
    const nombre = document.getElementById("name").value;
    const mensaje = document.getElementById("message").value;

    const subject = 'Mensaje desde el formulario de contacto';
    const emailBody = `Nombre: ${nombre}\nEmail: ${email}\nMensaje: ${mensaje}`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    // Abre el cliente de correo predeterminado con los datos del formulario
    window.open(mailtoLink);
}
