(function () {
  'use strict'

  const TRAILING_SPACE_RX = / +$/gm

  const supportsCopy = window.navigator.clipboard || document.queryCommandSupported('copy')

  Array.from(document.querySelectorAll('.doc .listingblock pre.highlight')).forEach(function (pre) {
    const code = pre.querySelector('code')
    if (!code) return

    const language = code.dataset.lang
    const toolbox = document.createElement('div')
    toolbox.className = 'source-toolbox'

    if (language) {
      const lang = document.createElement('span')
      lang.className = 'source-lang'
      lang.appendChild(document.createTextNode(language))
      toolbox.appendChild(lang)
    }

    if (supportsCopy) {
      const copy = document.createElement('button')
      copy.className = 'copy-button'
      copy.setAttribute('title', 'Copy to clipboard')
      copy.setAttribute('aria-label', 'Copy to clipboard')

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('viewBox', '0 0 16 16')
      svg.setAttribute('aria-hidden', 'true')
      svg.className.baseVal = 'copy-icon'
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('fill-rule', 'evenodd')
      path.setAttribute('d',
        'M5.75 1a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3a.75.75 0 00' +
        '-.75-.75h-4.5zm.75 3V2.5h3V4h-3zm-2.874-.467a.75.75 0 00-.752-1.298A1.75 1.75 0 002 3.75' +
        'v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-9.5a1.75 1.75 0 00-.874-1.515' +
        '.75.75 0 10-.752 1.298.25.25 0 01.126.217v9.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25' +
        'v-9.5a.25.25 0 01.126-.217z')
      svg.appendChild(path)
      copy.appendChild(svg)

      const toast = document.createElement('span')
      toast.className = 'copy-toast'
      toast.appendChild(document.createTextNode('Copied!'))
      copy.appendChild(toast)

      toolbox.appendChild(copy)
      copy.addEventListener('click', writeToClipboard.bind(copy, code))
    }

    const listingblock = pre.closest('.listingblock')
    const executeTargets = []
    if (listingblock) {
      const hasTop = listingblock.classList.contains('execute') || listingblock.classList.contains('execute-top')
      const hasBottom = listingblock.classList.contains('execute-bottom')
      if (hasTop) executeTargets.push('top')
      if (hasBottom) executeTargets.push('bottom')
    }

    executeTargets.forEach(function (target) {
      const paste = document.createElement('button')
      paste.className = 'paste-button'
      const label = target === 'bottom' ? 'Run in secondary terminal' : 'Run in terminal'
      paste.setAttribute('title', label)
      paste.setAttribute('aria-label', label)

      const pasteIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      pasteIcon.setAttribute('viewBox', '0 0 24 24')
      pasteIcon.setAttribute('aria-hidden', 'true')
      pasteIcon.className.baseVal = 'paste-icon'
      const pastePath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      pastePath.setAttribute('d',
        'M9.25 12a.75.75 0 0 1-.22.53l-2.75 2.75a.75.75 0 0 1-1.06-1.06L7.44 12 5.22 9.78a.75.75 0 1 1' +
        ' 1.06-1.06l2.75 2.75c.141.14.22.331.22.53Zm2 2a.75.75 0 0 0 0 1.5h5a.75.75 0 0 0 0-1.5h-5Z')
      const pastePath2 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      pastePath2.setAttribute('d',
        'M0 4.75C0 3.784.784 3 1.75 3h20.5c.966 0 1.75.784 1.75 1.75v14.5A1.75 1.75 0 0 1 22.25 21H1.75A1.75' +
        ' 1.75 0 0 1 0 19.25Zm1.75-.25a.25.25 0 0 0-.25.25v14.5c0 .138.112.25.25.25h20.5a.25.25 0 0 0' +
        ' .25-.25V4.75a.25.25 0 0 0-.25-.25Z')
      pasteIcon.appendChild(pastePath)
      pasteIcon.appendChild(pastePath2)
      paste.appendChild(pasteIcon)

      if (target === 'bottom') {
        const numLabel = document.createElement('span')
        numLabel.className = 'paste-label'
        numLabel.appendChild(document.createTextNode('2'))
        paste.appendChild(numLabel)
      }

      const pasteToast = document.createElement('span')
      pasteToast.className = 'paste-toast'
      pasteToast.appendChild(document.createTextNode('Executed!'))
      paste.appendChild(pasteToast)

      toolbox.appendChild(paste)
      paste.addEventListener('click', pasteToTerminal.bind(paste, code, target))
    })

    pre.parentNode.appendChild(toolbox)
  })

  function showClickFeedback (button) {
    if (button.classList.contains('clicked')) return
    button.classList.add('clicked')
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        button.classList.remove('clicked')
      })
    })
  }

  function writeToClipboard (code) {
    if (this.classList.contains('clicked')) return
    const text = code.innerText.replace(TRAILING_SPACE_RX, '')
    if (window.navigator.clipboard) {
      window.navigator.clipboard.writeText(text).then(
        showClickFeedback.bind(null, this),
        function (err) {
          console.warn('Clipboard writeText failed:', err)
          fallbackCopy(text, this)
        }.bind(null, this)
      )
    } else {
      fallbackCopy(text, this)
    }
  }

  function fallbackCopy (text, button) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      showClickFeedback(button)
    } catch (err) {
      console.warn('Fallback copy failed:', err)
    }
    document.body.removeChild(textarea)
  }

  function pasteToTerminal (code, target) {
    if (this.classList.contains('clicked')) return
    const text = code.innerText.replace(TRAILING_SPACE_RX, '')
    try {
      const parentDoc = window.parent.document
      let iframe
      if (target === 'bottom') {
        iframe = parentDoc.querySelector('.tabcontent.active .split.bottom iframe')
      }
      if (!iframe) {
        iframe = parentDoc.querySelector('.tabcontent.active .main-content')
      }
      if (!iframe || !iframe.contentDocument) throw new Error('Terminal iframe not accessible.')
      const textArea = iframe.contentDocument.querySelector('.xterm-helper-textarea') ||
        iframe.contentDocument.getElementsByTagName('textarea')[0]
      if (!textArea) throw new Error('Textarea not found in terminal iframe.')

      textArea.focus()
      const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        data: text,
        inputType: 'insertText',
      })
      textArea.dispatchEvent(inputEvent)
      const event = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
      })
      textArea.dispatchEvent(event)
      showClickFeedback(this)
    } catch (err) {
      console.error('Failed to paste to terminal:', err)
    }
  }
})()
