const fs = require('fs')
const view = require('./view')
const getHtml = require('./getHtml')

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
  let tree = view(tpl)
  let html = getHtml(tree, tpl, {
    test: 'hahaha',
    list: [1,2,3,4,5]
  })
}

run()
