//variables

const carrito = document.querySelector('#carrito');
const contenido = document.querySelector('#lista-carrito tbody');
const vaciar = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

cargarEventos();
function cargarEventos (){
    //agregar un curso aprentando "agregar al carrito"
    listaCursos.addEventListener('click', agregarCurso);
    //eliminar articulos del carrito
    carrito.addEventListener('click', eliminarCurso);
    //muestra los cursos que estan en localStorage
    document.addEventListener('DOMContentLoaded', ()=> {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

        carritoHTML();
    })
    //vaciar carrito
    vaciar.addEventListener('click', () => {
        articulosCarrito = [];//reseteamos el arreglo

        limpiarHTML();//eliminamos todo el html
    })
}
//funciones
function agregarCurso(e){
    e.preventDefault();

    if( e.target.classList.contains('agregar-carrito')){
        const cursoSeleccionado = e.target.parentElement.parentElement
        leerDatos(cursoSeleccionado);
    }

}
//eliminar articulos
function eliminarCurso(e){
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id');

        //elimina del arreglo articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId);
        
        carritoHTML();//volvemos a iterar sobre el carrito y se actualiza el html
    }
}
//leer el contenido del html al que le dimos click y traeme la informacion
function leerDatos(curso){
    //console.log(curso);
    //crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    //revisar si un articulo ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id );
    if(existe){
        //actualizamos la cantidad
        const cursos = articulosCarrito.map(curso => {
            if( curso.id === infoCurso.id ){
                curso.cantidad++;
                return curso; // retorna el objeto actualizado
            }else{
                return curso;// este retorna los objetos que no son los duplicados 
            }
        });
        articulosCarrito = [...cursos];
    }else{
        //agregamos el articulo al carrito
        //agregar elementos al arreglo de carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    carritoHTML();
}
// mostrando el carrito en el html
function carritoHTML(){
    //limpiar html
    limpiarHTML();

    //recorre el carrito y genera un html 
    articulosCarrito.forEach( curso => {
        const { imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td> <img src="${imagen}" width="100"> </td>    
            <td> ${titulo} </td>
            <td> ${precio} </td>
            <td> ${cantidad} </td>
            <td> <a href="#" class="borrar-curso" data-id="${id}"> X </a> </td>
        `;
        //agrega el html del carrito al tbody
        contenido.appendChild(row);
    });

    //agregar el carrito de compras al storage
    sincronizarStorage();
}

function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

//elimina los cursos del tbody
function limpiarHTML(){
    //forma lenta
    //contenido.innerHTML = '';

    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild)
    }
}