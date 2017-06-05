const fs = require('fs')
const _ = require('lodash')

const configPath = process.cwd() + '/data/config.json'
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
const metaPath = process.cwd() + '/data/meta.json'
const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
const metaArray = Object.keys(meta).map(page => meta[page])
const pages = metaArray.filter(metaItem => typeof metaItem.page !== 'undefined').map(metaItem => metaItem.page)
const ordered = pages.filter(page => typeof page.order !== 'undefined').sort((pageA, pageB) => pageA.order - pageB.order)
const unordered = pages.filter(page => typeof page.order === 'undefined')
const combined = ordered.concat(unordered)

const getLink = (link) => {
    return `
    <img class='recirc__img' aria-hidden='true' src='/${config.path}/${link.imgPath}' alt='' />
    <div class='recirc__content'>
      <p class='recirc__overline benton-regular'>More from <b class='benton-bold'>${meta.index.title}</b> series</p>
      <a href='/${config.path}/${link.path}?p1=Refugee_menu' class='recirc__link miller-banner-regular'>${link.text}</a>
    </div>
    `
}

module.exports = function(pageMeta, opts) {
  let linksArray = []

  if(typeof pageMeta !== 'undefined') {
    const pageIndex = _.findIndex(combined, page => page.path === pageMeta.page.path)

    if(pageIndex < 0) {
      linksArray = combined
    } else if(pageIndex > 0) {
      linksArray = combined.slice(pageIndex + 1)
      if(pageIndex === 1) {
        linksArray.push(combined[0])
      } else {
        linksArray.concat(combined.slice(0, pageIndex - 1))
      }
    } else {
      linksArray = combined.slice(1)
    }

    linksArray = linksArray.map(getLink)

    return linksArray.join('')
  } else {
    linksArray = combined.map(getLink)
    return linksArray.join('')
  }

}
