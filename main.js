const items = document.getElementById('items')
const templateCard = document.getElementById('template-card').content
const fragment = new DocumentFragment

document.addEventListener('DOMContentLoaded', () => {
  fetchData()
})
items.addEventListener('click', e => {
  addCarrito(e)
})

const fetchData = async () => {
  try {
    const res = await fetch('./json/api.json')
    const data = await res.json()
    console.log(data)
    mostrarCards(data)
  } catch (error) {
    console.log(error)
  }
}

const mostrarCards = data => {
   data.forEach(producto => {
      templateCard.querySelector('h5').textContent = producto.title
      templateCard.querySelector('p').textContent = producto.precio
      templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl)
      templateCard.querySelector('.btn-dark').dataset.id = producto.id
      const clone = templateCard.cloneNode(true)
      fragment.appendChild(clone)
   });
   items.appendChild(fragment)
}

const addCarrito = e => {
  console.log(e.target)
}