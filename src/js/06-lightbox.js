;(function () {
  'use strict'

  function openLightbox (el, goFullscreen) {
    var overlay = document.createElement('div')
    overlay.className = 'lightbox-overlay'
    var close = document.createElement('span')
    close.className = 'lightbox-close'
    close.textContent = '\u00d7'
    overlay.appendChild(close)
    var clone = el.cloneNode(true)
    clone.removeAttribute('width')
    clone.removeAttribute('height')
    clone.style.maxWidth = '95vw'
    clone.style.maxHeight = '95vh'
    clone.style.width = 'auto'
    clone.style.height = 'auto'
    overlay.appendChild(clone)

    function remove () {
      if (document.fullscreenElement === overlay) {
        document.exitFullscreen().then(function () { overlay.remove() })
      } else if (overlay.parentNode) {
        overlay.remove()
      }
    }

    overlay.addEventListener('click', remove)
    close.addEventListener('click', function (e) { e.stopPropagation(); remove() })
    document.addEventListener('keydown', function handler (e) {
      if (e.key === 'Escape') { remove(); document.removeEventListener('keydown', handler) }
    })

    document.body.appendChild(overlay)

    if (goFullscreen && overlay.requestFullscreen) {
      document.addEventListener('fullscreenchange', function handler () {
        if (!document.fullscreenElement && overlay.parentNode) {
          overlay.remove()
          document.removeEventListener('fullscreenchange', handler)
        }
      })
      overlay.requestFullscreen().catch(function () {})
    }
  }

  function initLightbox () {
    document.querySelectorAll('.expand, .fullscreen').forEach(function (container) {
      if (container.dataset.lightboxBound) return
      container.dataset.lightboxBound = 'true'
      container.addEventListener('click', function (e) {
        var el = container.querySelector('img, svg')
        if (!el) return
        e.preventDefault()
        e.stopPropagation()
        var goFullscreen = container.classList.contains('fullscreen')
        openLightbox(el, goFullscreen)
      }, true)
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox)
  } else {
    initLightbox()
  }

  var target = document.querySelector('.doc') || document.body
  new MutationObserver(initLightbox).observe(target, { childList: true, subtree: true })
})()
