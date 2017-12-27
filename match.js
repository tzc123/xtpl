// 关键字
const kw = ['for','elseif','else','if']

function match(str) {
  let logic
  kw.some(item => {
    if (str.indexOf(item) != -1) {
      logic = {
        type: item
      }
      return true
    }
  })
  let res = str.match(/\((.+)\)/)
  if (logic && res) {
    logic.value = res[1]
  }
  return logic || false
}

module.exports = match