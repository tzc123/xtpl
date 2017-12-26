import { resolve } from "dns";

module.exports = function (section, data) {

  console.log(section)
  console.log('开始解析')
  section.data = data
  make(section.tree.root)
  return render(section)
}

function render(section) {
  let tpl = section.tpl
  let current = node.section.tree.root.children[0]
  // let content = tpl.substring(0, current.start.tagBegin)
  let content = resolve(current)
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
  node.content = tpl.substring(node.start.tagClose + 1, node.end.tagBegin)
  node.render = function (data) {
    let tpl = this.belong.tpl
    let content = ''
    let variables = this.variables
    if (this.start.type == 'for') {
      let list = eval(getVariable(data, this.param.list))
      if (!list) {
        throw new Error('不存在' + this.param.list)
      }
      if (({}).toString.call(list) = '[object Array]') {
        content = list.map((item, index) => {
          let ocontent = this.content
          variables.forEach(variable => {
            if (variable.value.indexOf(this.param.value) != -1) {
              ocontent = ocontent.replace('{' + variable.value + '}', eval(getVariable(data, variable.value.replace(this.param.item, this.param.list + '[' + index + ']'))))
            }
              ocontent = ocontent.replace('{' + variable.value + '}', eval(getVariable(data, variable.value)))
          })
          return ocontent
        })
        content = content.join('')
      } else {
        throw new Error(this.param.list + '不是一个数组')
      }
    } else if(this.start.type == 'if') {
      if(eval(getVariable(data, this.start.value))) {
        content = this.content
        variables.forEach(variable => {
          content = content.replace('{' + variable.value + '}', eval(getVariable(data, variable.value)))
        })
      } else {
        content = ''
      }
    }
    this.parent.content = this.parent.content.replace('{' + this.content + '}', content)
  }
}

function getVariable(data, str) {
  let newStr = str.replace(/(?!"')(.*)(?!"')/g, function(match, key) {
    if (data[key]) {
      return 'data.' + key
    }
    return key
  })
  return newStr
}
// function find(node) {
//   let current = node.parent
//   while(current) {
//     let keys = Object.keys(current.data)
//     if (node.start.type == 'for') {
//       for(let i = 0; i < keys.length; i++) {
//         if (keys[i] == node.params.list) {
//           return current.data[keys[i]]
//         }
//       }
//     } else if (node.start.type != 'if') {
//       throw new Error('未知类型')
//     }
//     current = current.parent
//   }
//   return undefined
// }

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

function make(node) {
  if (node.start.type == 'for') {
    node.param = getForParams(node.start.value)
  }
  if (node.children) {
    node.children.forEach(item => {
      make(item)
    })
  }
}