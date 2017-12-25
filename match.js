function match(str) {
  let kw = ['for','elseif','else','if']
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