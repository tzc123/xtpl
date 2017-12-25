const fs = require('fs')
const view = require('./view')

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
  let html = view(tpl)
}

run()
