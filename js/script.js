import FormValidator from './FormValidator.js'

let fHandler = (form) => {
  const data = new FormData(form)
  const [[name,url]] = [...data]
  const API_URL = 'https://api.shrtco.de/v2/shorten?url='

  fetch(API_URL + url)
    .then( response => {
      return response.json()
    })
    .then( data => {
      if(data.ok) {
        const shortlink = data.result.full_short_link

        const container = document.querySelector('.shortlinks-container')
        const template = document.querySelector('#shortlink-card-template')

        let clone = template.content.firstElementChild.cloneNode(true)
        const link_clone = clone.querySelector(".link")
        const shortlink_clone = clone.querySelector(".shortlink")
        const copy_btn_clone = clone.querySelector('.btn')
            

        link_clone.textContent = url
        shortlink_clone.textContent = shortlink
        copy_btn_clone.addEventListener('click', e => {
          e.preventDefault()

          navigator.clipboard.writeText(shortlink_clone.innerText)
          copy_btn_clone.innerText = 'Copied!'
          copy_btn_clone.classList.add('btn-copied')
        })

        container.appendChild(clone)
      } else {
        form.querySelector(".error-message").textContent = "Please enter a valid URL"
        form.querySelector('#url').classList.add('error-outline')
      }
    })
    .catch( error => {
      form.querySelector(".error-message").textContent = "Failed to shorten link. Please try again"
      form.querySelector('#url').classList.add('error-outline')
    })
}

const fv = new FormValidator('#form-shorten', fHandler)

fv.register("#url", (value, inputField) => {
  if(value.length == '') {
    return {
      pass: false,
      error: "Please add a link"
    }
  }

  return {
    pass: true,
  }
})