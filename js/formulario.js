
const datos = {
    nombre: '',
    email: '',
    mensaje: ''
}

// submit
const formulario = document.querySelector('.formulario');

formulario.addEventListener('submit', function(e) {
    e.preventDefault();


    // Validar el Formulario...

    const { nombre, email, mensaje } = datos;

    if(nombre === '' || email === '' || mensaje === '' ) {
       
        mostrarError('Todos los campos son obligatorios');
        return; // Detiene la ejecución de esta función
    }

    mostrarMensaje('Mensaje enviado correctamente');

    Swal.fire({
        title: 'Tu mensaje fue enviado con éxito',
        allowOutsideClick: () => {
          const popup = Swal.getPopup()
          popup.classList.remove('swal2-show')
          setTimeout(() => {
            popup.classList.add('animate__animated', 'animate__headShake')
          })
          setTimeout(() => {
            popup.classList.remove('animate__animated', 'animate__headShake')
          }, 500)
          return false
        }
      })
      

});


function mostrarError(mensaje) {
    const alerta = document.createElement('p');
    alerta.textContent = mensaje;
    alerta.classList.add('error');

    formulario.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function mostrarMensaje(mensaje) {
    const alerta = document.createElement('p');
    alerta.textContent = mensaje;
    alerta.classList.add('correcto');
    formulario.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 4000);
 
}


// Eventos de los Inputs...
const nombre = document.querySelector('#nombre');
const email = document.querySelector('#email');
const mensaje = document.querySelector('#mensaje');


nombre.addEventListener('input', leerTexto);
email.addEventListener('input', leerTexto);
mensaje.addEventListener('input', leerTexto);

function leerTexto(e) {
    // console.log(e);
    // console.log(e.target.value);

    datos[e.target.id] = e.target.value;

    console.log(datos);
}

