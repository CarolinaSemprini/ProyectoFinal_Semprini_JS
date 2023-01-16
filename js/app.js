//me aseguro de que el archivo html se cargo
document.addEventListener('DOMContentLoaded',() => { 
    fetchData() 
    
});
  
//obtengo los datos de api.json
async function fetchData() {
    try {
        const res = await fetch('productos.json');
        const data = await res.json();
        //console.log (data)
        pintarProductos(data);
        detectarBotones(data);
    } catch (error) {
        //console.log(error)
    }
}

//Muestro -Pinto los datos del json en el html
const contenedorProductos = document.querySelector('#contenedor-productos')
const pintarProductos=(data)=>{

    //capturo  mi template y el contenido 
    const template=document.querySelector('#template-productos').content
    //aqui creo un fragmento
    const fragment=document.createDocumentFragment()
    //console.log(template)
    //recorro la data voy iterar
    data.forEach(producto =>{
        //console.log(producto)

        //voy a capturar las imagenes que estan dentro del template. Con setattibute le agrego el src si no esta creado el src lo crea y si ya esta creado lo utiliza y le paso la url de la imagen
        template.querySelector('img').setAttribute('src', producto.thumbnailUrl)

        //capturo todos los titulos de los productos de json simplemente modificando el template
        template.querySelector('h2').textContent= producto.title
        

        template.querySelector('p').textContent=producto.precio

        //Utilio datasent para obtener el id del producto para cada boton comprar
        template.querySelector('button').dataset.id=producto.id


        //clono el template ya que es uno solo. Cada vez que modifico el teample lo clonamos y lo agregamos al fragment (clone)
        const clone=template.cloneNode(true)
        fragment.appendChild(clone)

    })

    //agrego la estructura creada en el template y lo agrego a la clase que se llama contenedor-productos
    contenedorProductos.appendChild(fragment)
}

let carrito=JSON.parse(localStorage.getItem("carrito")) || {}

const detectarBotones =(data)=>{
    const botones= document.querySelectorAll('.platillo button')
    
    botones.forEach(btn =>{
        btn.addEventListener('click', ()=>{
            //console.log(btn.dataset.id)
            //agrego la cantidad, ya que en el json no figura
            const producto =data.find(item=>item.id=== parseInt(btn.dataset.id))
            producto.cantidad=1
           //preguntamos en nuestro carrito si existe el producto.id y si existe aumento la cantidad de solo dicho producto.id
           if(carrito.hasOwnProperty(producto.id)){
                producto.cantidad=carrito[producto.id].cantidad + 1
           }

           carrito[producto.id]={...producto}
           pintarCarrito()
          

           Swal.fire({
            title: 'Tu producto fue agregado al carrito',
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
          

        })
    })
    
}


//mostrar los productos comprados en la tabla carrito

const verCarrito=document.getElementById("verCarrito");
const items =document.querySelector('#items')
const tablaConintainer= document.querySelector('.container');

verCarrito.addEventListener("click", ()=>{
    tablaConintainer.classList.toggle('mostrar');
    pintarCarrito();
    
});
const  pintarCarrito= ()=>{

    items.innerHTML=''
    const teample=document.querySelector('#template-carrito').content
    const fragment=document.createDocumentFragment()

    Object.values(carrito).forEach(producto=>{
        //console.log(producto)

    teample.querySelector('th').textContent= producto.id
    teample.querySelectorAll('td')[0].textContent =producto.title
    teample.querySelectorAll('td')[1].textContent =producto.cantidad
    teample.querySelector('span').textContent =producto.precio * producto.cantidad
   
    //accion de botones +-
    teample.querySelector('.btn-info').dataset.id=producto.id
    teample.querySelector('.btn-danger').dataset.id=producto.id

    const clone =teample.cloneNode(true)
    fragment.appendChild(clone)
    
    });
   
    items.appendChild(fragment)
    
    //pintamos el footer el mensaje sobre el carrito

    pintarFooter()
    accionBotones()
    guardarlocal();
    
}

const footer =document.querySelector('#footer-carrito')
const pintarFooter=()=>{
    
    footer.innerHTML=''
    //si el carrito esta vacio entonces mostrame el mensaje, comienzo a comprar y desaparece, presiono el boton de borrar y me muestra el mensaje siguiente 
    if(Object.keys(carrito).length===0 ){
        footer.innerHTML=`<th scope="row" colspan="5">Usted acaba de vaciar su carrito</th>`
        return
    } 

    const teample=document.querySelector('#template-footer').content
    const fragment=document.createDocumentFragment()

    //sumar cantidad y sumar totales
    //convierto la coleccion de objeto en un array para utilizar "reduce", que en acc voy a guardar un dato y le paso un elemento del objeto que es cantidad y como tenemos que devolver un numero, le pasamos 0
    const nCantidad=Object.values(carrito).reduce((acc, {cantidad})=> acc + cantidad,0 )
    const nPrecio= Object.values(carrito).reduce((acc,{cantidad, precio})=> acc+ cantidad *precio, 0)
    //console.log(nPrecio)

    teample.querySelectorAll('td')[0].textContent=nCantidad
    teample.querySelector('span').textContent=nPrecio

    const clone =teample.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    //boton limpiar carrito

    const boton=document.querySelector('#vaciar-carrito')
    boton.addEventListener('click',()=>{
        carrito={}
        pintarCarrito()
    })
}

const accionBotones=()=>{
    const botonesAgregar=document.querySelectorAll('#items .btn-info')
    const botonesEliminar=document.querySelectorAll('#items .btn-danger')
    
    botonesAgregar.forEach(btn=>{
        btn.addEventListener('click', () =>{

            console.log('btn.dataset.id')
            const producto=carrito[btn.dataset.id]
            producto.cantidad++
            carrito[btn.dataset.id]={...producto}
            pintarCarrito()

        })
    })

    botonesEliminar.forEach(btn=>{
        btn.addEventListener('click', () =>{
            const producto=carrito[btn.dataset.id]
            producto.cantidad --
            if(producto.cantidad===0){
                delete carrito[btn.dataset.id]
          
            }else{
                carrito[btn.dataset.id]={...producto}
               
            }
            pintarCarrito() 
            
        })
    })
   
}

   
   //guardando informacion del carrito
   const guardarlocal=()=>{
    localStorage.setItem("carrito",JSON.stringify(carrito));
   };
   
    //obtener los datos guardados en localstorage con get Item 

///navegacion

const menu = document.querySelector('.hamburguesa');
const navegacion = document.querySelector('.navegacion');
const imagenes = document.querySelectorAll('img');

const contenedorPlatillos = document.querySelector('.platillo');
document.addEventListener('DOMContentLoaded',()=>{
    eventos();
    
});

const eventos = () =>{
    menu.addEventListener('click',abrirMenu);
}

const abrirMenu = () =>{
     navegacion.classList.remove('ocultar');
     botonCerrar();
}

const botonCerrar = () =>{
    const btnCerrar = document.createElement('p');
    const overlay  = document.createElement('div');
    overlay.classList.add('pantalla-completa');
    const body = document.querySelector('body');
    if(document.querySelectorAll('.pantalla-completa').length > 0) return;
    body.appendChild(overlay);
    btnCerrar.textContent = 'x';
    btnCerrar.classList.add('btn-cerrar');

    // while(navegacion.children[5]){
    //     navegacion.removeChild(navegacion.children[5]);
    // }
    navegacion.appendChild(btnCerrar);   
    cerrarMenu(btnCerrar,overlay);
    
}

const observer = new IntersectionObserver((entries, observer)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                const imagen = entry.target;
                imagen.src = imagen.dataset.src;
                observer.unobserve(imagen);
            }
        }); 
});


imagenes.forEach(imagen=>{
   
    observer.observe(imagen);
});

const cerrarMenu = (boton, overlay) =>{
    boton.addEventListener('click',()=>{
        navegacion.classList.add('ocultar');
        overlay.remove();
        boton.remove();
    });

    overlay.onclick = function(){
        overlay.remove();
        navegacion.classList.add('ocultar');  
        boton.remove();
    }
}







