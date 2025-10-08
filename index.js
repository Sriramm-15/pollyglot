// DOM elements
const translateBtn = document.getElementById('translateBtn')
const textInput = document.getElementById('textInput')
const translationOutput = document.getElementById('translationOutput')
const langFlag = document.getElementById('langFlag')
const timerDisplay = document.getElementById('timer')
const languages = document.querySelectorAll('.languages input[name="lang"]')

// Map radio IDs to language codes and flags
const langMap = {
  french: { code: "fr", flag: "🇫🇷" },
  spanish: { code: "es", flag: "🇪🇸" },
  japanese: { code: "ja", flag: "🇯🇵" },
  hindi: { code: "hi", flag: "🇮🇳" },
  telugu: { code: "te", flag: "🇮🇳" }
}

// Initialize flag on page load
const selectedRadio = document.querySelector('input[name="lang"]:checked')
langFlag.textContent = langMap[selectedRadio.id].flag

// Update flag and glow when user changes language
languages.forEach(radio => {
  radio.addEventListener('change', () => {
    langFlag.textContent = langMap[radio.id].flag

    // Remove glow from all labels
    languages.forEach(r => r.nextElementSibling.style.boxShadow = 'none')
    // Add glow to selected
    radio.nextElementSibling.style.boxShadow = '0 0 10px #00bfff'
  })
})

// Reset timer and translation on input
textInput.addEventListener('input', () => {
  translationOutput.value = ''
  translationOutput.classList.remove('translated-text')
  timerDisplay.textContent = '⏰ 0.0s'
})

// Translate button click
translateBtn.addEventListener('click', async () => {
  const text = textInput.value.trim()
  const langRadio = document.querySelector('input[name="lang"]:checked')
  const target = langRadio ? langMap[langRadio.id].code : "fr"

  if (!text) return alert("Please enter text to translate!")

  translationOutput.value = ""
  translationOutput.classList.remove('translated-text')

  // Loader
  const spinner = document.createElement('span')
  spinner.className = "loader"
  translationOutput.parentNode.insertBefore(spinner, translationOutput.nextSibling)

  // Start timer
  const startTime = performance.now()
  timerDisplay.textContent = `⏰ 0.0s`
  const timerInterval = setInterval(() => {
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(1)
    timerDisplay.textContent = `⏰ ${elapsed}s`
  }, 100)

  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`
    )
    const data = await res.json()

    // Stop timer
    clearInterval(timerInterval)
    const totalTime = ((performance.now() - startTime) / 1000).toFixed(2)
    timerDisplay.textContent = `⏰ ${totalTime}s`

    spinner.remove()
    translationOutput.value = data[0].map(item => item[0]).join('') || "Translation failed."
    translationOutput.classList.add('translated-text')
  } catch (err) {
    clearInterval(timerInterval)
    spinner.remove()
    timerDisplay.textContent = "⏰ Error"
    console.error("Translation fetch error:", err)
    translationOutput.value = "Error translating text!"
  }
})
