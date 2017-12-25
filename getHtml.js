module.exports = function (tree, tpl) {
  xtpl = tpl
  console.log(tree)
  console.log('开始解析')
  let b = make(tree.root)
  b()
  // func()
}
let xtpl

function find(str) {

}

function xfor(node) {
  console.log(node)
  let content = xtpl.substring(node.start.tagClose, node.end.tagBegin)
  let variables = node.variables
  xtpl.replace(content, function (match, key) {

  })
}

function xif(node) {
  console.log(node)
}
let func = function () {
  console.log('解析完毕')
}
function make(node) {
  let a = func
  if (node.start.type == 'for') {
    func = function () {
      xfor(node)
      a()
    }
  } else if (node.start.type == 'if') {
    func = function () {
      xif(node)
      a()
    }
  }
  if (node.children) {
    node.children.forEach(item => {
      make(item)
      return false
    })
  }
  return func
}