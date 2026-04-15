;(function () {
  'use strict'

  var TRAILING_SPACE_RX = / +$/gm

  var supportsCopy = window.navigator.clipboard

  ;[].slice.call(document.querySelectorAll('.doc .listingblock pre.highlight')).forEach(function (pre) {
    var code = pre.querySelector('code')
    if (!code) return

    var language = code.dataset.lang
    var toolbox, lang, copy, toast

    ;(toolbox = document.createElement('div')).className = 'source-toolbox'

    if (language) {
      ;(lang = document.createElement('span')).className = 'source-lang'
      lang.appendChild(document.createTextNode(language))
      toolbox.appendChild(lang)
    }

    if (supportsCopy) {
      ;(copy = document.createElement('button')).className = 'copy-button'
      copy.setAttribute('title', 'Copy to clipboard')

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('viewBox', '0 0 16 16')
      svg.className.baseVal = 'copy-icon'
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('fill-rule', 'evenodd')
      path.setAttribute('d',
        'M5.75 1a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3a.75.75 0 00' +
        '-.75-.75h-4.5zm.75 3V2.5h3V4h-3zm-2.874-.467a.75.75 0 00-.752-1.298A1.75 1.75 0 002 3.75' +
        'v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-9.5a1.75 1.75 0 00-.874-1.515' +
        '.75.75 0 10-.752 1.298.25.25 0 01.126.217v9.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25' +
        'v-9.5a.25.25 0 01.126-.217z')
      svg.appendChild(path)
      copy.appendChild(svg)

      ;(toast = document.createElement('span')).className = 'copy-toast'
      toast.appendChild(document.createTextNode('Copied!'))
      copy.appendChild(toast)

      toolbox.appendChild(copy)
      copy.addEventListener('click', writeToClipboard.bind(copy, code))
    }

    pre.parentNode.appendChild(toolbox)
  })

  function writeToClipboard (code) {
    var text = code.innerText.replace(TRAILING_SPACE_RX, '')
    window.navigator.clipboard.writeText(text).then(
      function () {
        this.classList.add('clicked')
        this.offsetHeight // eslint-disable-line no-unused-expressions
        this.classList.remove('clicked')
      }.bind(this),
      function () {}
    )
  }
})()
