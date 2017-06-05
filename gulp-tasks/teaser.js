const gulp = require('gulp')
const request = require('request')
const fs = require('fs')
const cheerio = require('cheerio')
const { groupBy, forIn } = require('lodash')

gulp.task('fetch-teaser', (cb) => {
	const metaFile = 'data/meta.json'
	fs.readFile(metaFile, (err, data) => {
		const pages = JSON.parse(data)
		fetchAllTeasers(pages, cb)
	})
})

const fetchAllTeasers = (pages, cb) => {
	const teaserData = {}
	const size = Object.keys(pages).length
	let completed = 0
	forIn(pages, (page, name) => {
		teaserData[name] = []
		const fetchNext = (index) => {
			fetchTeaser(page.teasers[index], (err, datum) => {
				index++
				if (!err && datum) teaserData[name].push(datum)

				if (index < page.teasers.length) fetchNext(index)
				else completed += 1

				if (completed >= size) writeData(teaserData, cb)
			})
		}
		fetchNext(0)
	})


}

const fetchTeaser = (url, cb) => {
	request(url, (err, response, body) => {
		if (!err && response.statusCode == 200) {
			const $ = cheerio.load(body)
			const titleRaw = $('title').first().text()
			const title = titleRaw.split('- The Boston Globe')[0].trim()
			const datum = { url, title }

			const meta = $('meta')
			meta.each(function(i, el) {
				if(el.attribs.property && el.attribs.property === 'og:image') {
					const imageRaw = el.attribs.content
					const imageHttps = imageRaw.replace('http://', 'https://')
					const image = imageHttps.replace('image_585w', 'image_960w')
					datum.image = image
				}
			})
			cb(null, datum)
		}
		else cb(true)
	})
}

const writeData = (data, cb) => {
	const teaserFile = 'data/teasers.json'
	const str = JSON.stringify(data)

	fs.writeFile(teaserFile, str, (err) => {
		if (err) console.log(err)
		cb()
	})
}
