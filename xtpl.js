const fs = require('fs')
const Section = require('./section')
const render = require('./render')

function getTpl(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, function (err, data) {
      err && reject(err)
      data && resolve(data.toString())
      return
    })
  })
}

async function run () {
  let tpl = await getTpl('./index.html')
  let section = new Section(tpl)
  section.init()
  let html = render(section)
}

run()
