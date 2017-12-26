module.exports = function (section, data) {
  console.log('开始解析')
  section.data = data
  make(section.tree.root)
  return render(section)
}

function render(section) {
  let tpl = section.tpl
  let current = section.tree.root
  // let content = tpl.substring(0, current.start.tagBegin)
  make(current, function(node) {
    if (node != node.belong.tree.root) {
      resolve(node)
    } else {
      node.render = function (data) {
        this.variables && this.variables.forEach(variable => {
          this.content = this.content.replace('{' + variable.value + '}', eval(getVariable(data, variable.value)))
        })
      }
    }
  })
  // content += tpl.substring(current.start.tagClose + 1)
}

// function resolve(node) {
  // let contentFront = tpl.substring(node.parent.start.tagClose + 1, node.start.tagBegin)
  // let contentEnd = tpl.substring(node.end.tagClose + 1, node.parent.tagBegin)
  // let contentMiddle = tpl.substring(node.start.tagClose + 1, node.end.tagBegin)
//   if (node.start.type == 'for') {
//     contentMiddle = 
//   } else if (node.start.type == 'if') {

//   }
//   return contentFront + contentMiddle + contentEnd
// }

function resolve(node) {
  node.content = node.belong.tpl.substring(node.start.tagClose + 1, node.end.tagBegin)
  node.render = function (data) {
    let tpl = this.belong.tpl
    let content = ''
    let variables = this.variables
    if (this.start.type == 'for') {
      let list = eval(getVariable(data, this.param.list))
      if (!list) {
        throw new Error('不存在' + this.param.list)
      }
      if (({}).toString.call(list) == '[object Array]') {
        content = list.map((item, index) => {
          let ocontent = this.content
          variables && variables.forEach(variable => {
            if (variable.value.indexOf(this.param.item) != -1) {
              let _item_ = getVariable(data, variable.value.replace(this.param.item, this.param.list + '[' + index + ']'))
              ocontent = ocontent.replace('{' + variable.value + '}', eval(_item_))
            } else {
              let _item_ = getVariable(data, variable.value)
              ocontent = ocontent.replace('{' + variable.value + '}', eval(_item_))
            }
          })
          return ocontent
        })
        content = content.join('')
      } else {
        throw new Error(this.param.list + '不是一个数组')
      }
    } else if(this.start.type == 'if') {
      if (this.middle) {
        let choices = [this.start, ...this.middle]
        choices = choices.map((choice, index) => {
          let ocontent = tpl.substring(choice.tagClose + 1, choices[index + 1] ? choices[index + 1].tagBegin : this.end.tagBegin)
          return {
            content: ocontent,
            tag: choice
          }
        })
        choices.some(choice => {
          if (choice.tag.type != 'else') {
            if (eval(getVariable(data, choice.tag.value))) {
              content = choice.content
              variables && variables.forEach(variable => {
                content = choice.content.replace('{' + variable.value + '}', eval(getVariable(data, variable.value)))
              })
              return true
            }
          } else {
            content = choice.content
            variables && variables.forEach(variable => {
              content = choice.content.replace('{' + variable.value + '}', eval(getVariable(data, variable.value)))
            })
            return true
          }
        })
      } else {
        if (eval(getVariable(data, this.start.value))) {
          this.variables && this.variables.forEach(variable => {
            this.content = this.content.replace('{' + variable.value + '}', eval(getVariable(data, variable.value)))
          })
        }
      }
    }
    let oldContent = this.belong.tpl.substring(this.start.tagBegin, this.end.tagClose + 1)
    this.parent.content = this.parent.content.replace(oldContent, content)
  }
}


function getVariable(data, str) {
  let newStr = str.replace(/(?!"')([^\.\[\]\{\}\(\)]*)(?!"')/g, function(match, key) {
    if (data[key.trim()]) {
      return 'data.' + key.trim()
    }
    return key
  })
  return newStr
}

function getForParams(value) {
  let res = value.match(/(.+) in (.+)/)
  if (!res) {
    throw new Error('for参数有误')
  }
  return {
    item: res[1].trim(),
    list: res[2].trim()
  }
}

function make(node, fn) {
  fn(node)
  if (node.children) {
    node.children.forEach(item => {
      make(item, fn)
    })
  }
}