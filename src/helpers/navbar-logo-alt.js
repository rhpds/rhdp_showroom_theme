'use strict'

const ALT_TEXT = {
  'demo-platform': 'Red Hat Demo Platform',
  summit: 'Red Hat Summit',
}

module.exports = (logo) => ALT_TEXT[logo] || 'Red Hat Demo Platform'
