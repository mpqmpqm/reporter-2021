export const drawEmojiSparkles = (e) => {
  const { clientX, clientY } = e
  const { value: name } = e.target
  draw(clientX, clientY, name)
  draw(clientX, clientY, name)
  draw(clientX, clientY, name)
  draw(clientX, clientY, name)
  setTimeout(() => {
    draw(clientX, clientY, name)
    draw(clientX, clientY, name)
  }, 10)
  setTimeout(() => {
    draw(clientX, clientY, name)
    draw(clientX, clientY, name)
  }, 20)
}

function draw(clientX, clientY, name) {
  const el = document.createElement("div")
  el.textContent = name
  el.className = "sparkle"

  el.style.top = `${clientY - 50}px`
  el.style.left = `${clientX - 30}px`
  document.body.append(el)
  animate(el)
}

function animate(el) {
  const tx = (Math.random() * (70 - 10) + 10) * (Math.random() > 0.5 ? -1 : 1)
  const neg = tx > 0 ? 1 : -1
  const a = Math.random() * (1 - 0.7) + 0.7
  const d = a
  const b = Math.random() * 0.5 * neg
  const c = -b
  const ty = Math.random() * (160 - 40) + 40

  requestAnimationFrame(() => {
    el.style.transform = `matrix(${a},${b},${c},${d},${tx},-${ty})`
    el.style.opacity = 0

    setTimeout(() => {
      el.remove()
    }, 1500)
  })
}
