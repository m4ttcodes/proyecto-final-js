
// Definiendo variables para luego hacer referencia al documento html

const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content // solo se visualiza el contenido
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = new DocumentFragment // Generando el fragment
let carrito ={}

// Evento DOMContentLoaded, se dispara cuando el documento carga y se parsea completamente

document.addEventListener('DOMContentLoaded', () => {
  fetchData()

// Local Storage

  if(localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito'))
    mostrarCarrito()
  }
})

// Eventos para dar funcionalidad

cards.addEventListener('click', e => {
  addCarrito(e)
})

items.addEventListener('click', e => {
  btnAccion(e)
})

// Async y await para consumir api

const fetchData = async () => {
  try {
    const res = await fetch('./json/api.json')
    const data = await res.json()

    mostrarCards(data)
  } catch (error) {
    console.log(error)
  }
}

// Mostrar los productos

const mostrarCards = data => {
   data.forEach(producto => {
      templateCard.querySelector('h5').textContent = producto.title
      templateCard.querySelector('p').textContent = producto.precio
      templateCard.querySelector('img').setAttribute('src', producto.image)
      templateCard.querySelector('.btn-dark').dataset.id = producto.id
      const clone = templateCard.cloneNode(true)
      fragment.appendChild(clone)
   });
   cards.appendChild(fragment)
}

// Agregar los productos al carrito

const addCarrito = e => {
  if(e.target.classList.contains('btn-dark')) {
    setCarrito(e.target.parentElement)
  }
  e.stopPropagation()
}

const setCarrito = objeto => {
  const producto = {
    id: objeto.querySelector('.btn-dark').dataset.id,
    title: objeto.querySelector('h5').textContent,
    precio: objeto.querySelector('p').textContent,
    cantidad: 1
  }

  if(carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1
  }

  carrito[producto.id] = {...producto}
  mostrarCarrito()
}

const mostrarCarrito = () => {
  items.innerHTML = ''
  Object.values(carrito).forEach(producto => {
    templateCarrito.querySelector('th').textContent = producto.id
    templateCarrito.querySelectorAll('td')[0].textContent = producto.title
    templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad

    templateCarrito.querySelector('.btn-info').dataset.id = producto.id //botón
    templateCarrito.querySelector('.btn-danger').dataset.id = producto.id //botón
    templateCarrito.querySelector('span')
 .textContent = producto.cantidad * producto.precio
 const clone = templateCarrito.cloneNode(true)
 fragment.appendChild(clone)
 })
 items.appendChild(fragment)

 mostrarFooter()

 localStorage.setItem('carrito', JSON.stringify(carrito))
}

const mostrarFooter = () => {
  footer.innerHTML = ''
  if(Object.keys(carrito).length === 0){
    footer.innerHTML = `
    <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
    `
    return
  }

// Sumando cantidades y total

  const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
  const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)
  console.log(nPrecio)

  templateFooter.querySelectorAll('td')[0].textContent = nCantidad
  templateFooter.querySelector('span').textContent = nPrecio

  const clone = templateFooter.cloneNode(true)
  fragment.appendChild(clone)
  footer.appendChild(fragment)

  const btnVaciar = document.getElementById('vaciar-carrito')
  btnVaciar.addEventListener('click', () => {
    carrito = {}
    mostrarCarrito()
  })
}

const btnAccion = e => {
  if(e.target.classList.contains('btn-info')){
    console.log(carrito[e.target.dataset.id])
    const producto = carrito[e.target.dataset.id]
    producto.cantidad++
    carrito[e.target.dataset.id] = {...producto}
    mostrarCarrito()
  }
  
  if(e.target.classList.contains('btn-danger')){
    const producto = carrito[e.target.dataset.id]
    producto.cantidad--
    if(producto.cantidad === 0) {
      delete carrito[e.target.dataset.id]
    }
    mostrarCarrito()
  }

  e.stopPropagation()

}