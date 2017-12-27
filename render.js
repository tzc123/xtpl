module.exports = function(section, data) {
  console.log("开始解析");
  make(section.tree.root, function(node) {
    if (node.start.type == "for") {
      node.param = getForParams(node.start.value);
    }
  });
  render(section);
};

function render(section) {
  let tpl = section.tpl;
  let current = section.tree.root;
  // let content = tpl.substring(0, current.start.tagBegin)
  make(current, function(node) {
    if (node != node.belong.tree.root) {
      resolve(node);
    } else {
      node.render = function(data) {
        this.variables &&
          this.variables.forEach(variable => {
            this.content = this.content.replace(
              "{" + variable.value + "}",
              eval(getVariable(data, variable.value))
            );
          });
      };
    }
  });
}

function resolve(node) {
  node.content = node.belong.tpl.substring(
    node.start.tagClose + 1,
    node.end.tagBegin
  );
  node.render = function(data) {
    let tpl = this.belong.tpl;
    let content = "";
    let variables = this.variables;
    if (this.start.type == "for") {
      /**
       * tofix
       */
      let list = eval(getVariable(data, this.param.list).value);
      if (!list) {
        throw new Error("不存在" + this.param.list);
      }
      if ({}.toString.call(list) == "[object Array]") {
        content = list.map((item, index) => {
          let ocontent = this.content;
          variables &&
            variables.forEach(variable => {
              if (variable.value.indexOf(this.param.item) != -1) {
                /**
                 * tofix
                 */
                let _item_ = getVariable(
                  data,
                  variable.value.replace(
                    this.param.item,
                    this.param.list + "[" + index + "]"
                  )
                ).value;
                ocontent = ocontent.replace(
                  "{" + variable.value + "}",
                  eval(_item_)
                );
              } else {
                let res = getVariable(data, variable.value)
                let value
                if (res.complete) {
                  value = eval(res.value)
                } else {
                  value = '{' + res.value + '}'
                }
                ocontent = ocontent.replace(
                  "{" + variable.value + "}",
                  value
                );
              }
            });
          return ocontent;
        });
        content = content.join("");
      } else {
        throw new Error(this.param.list + "不是一个数组");
      }
    } else if (this.start.type == "if") {
      if (this.middle) {
        let choices = [this.start, ...this.middle];
        choices = choices.map((choice, index) => {
          let ocontent = tpl.substring(
            choice.tagClose + 1,
            choices[index + 1] ? choices[index + 1].tagBegin : this.end.tagBegin
          );
          return {
            content: ocontent,
            tag: choice
          };
        });
        choices.some(choice => {
          if (choice.tag.type != "else") {
            if (eval(getVariable(data, choice.tag.value))) {
              content = choice.content;
              variables &&
                variables.forEach(variable => {
                  let res = getVariable(data, variable.value)
                  let value
                  if (res.complete) {
                    value = eval(res.value)
                  } else {
                    value = '{' + res.value + '}'
                  }
                  content = choice.content.replace(
                    "{" + variable.value + "}", value);
                });
              return true;
            }
          } else {
            content = choice.content;
            variables &&
              variables.forEach(variable => {
                let res = getVariable(data, variable.value)
                let value
                if (res.complete) {
                  value = eval(res.value)
                } else {
                  value = '{' + res.value + '}'
                }
                content = choice.content.replace(
                  "{" + variable.value + "}", value);
              });
            return true;
          }
        });
      } else {
        if (eval(getVariable(data, this.start.value))) {
          this.variables &&
            this.variables.forEach(variable => {
              let res = getVariable(data, variable.value)
              let value
              if (res.complete) {
                value = eval(res.value)
              } else {
                value = '{' + res.value + '}'
              }
              content = this.content.replace(
                "{" + variable.value + "}", value);
            });
        }
      }
    }
    let oldContent = this.belong.tpl.substring(
      this.start.tagBegin,
      this.end.tagClose + 1
    );
    console.log(content, "content");
    this.parent.content = this.parent.content.replace(oldContent, content);
  };
}

function getVariable(data, str) {
  let complete = true
  let newStr = str.replace(/(?!"')([^\.\[\]\{\}\(\)\s]*)(?!"')/g, function(
    match,
    key
  ) {
    if (data[key.trim()]) {
      return "data." + key.trim();
    }
    complete = false
    return key;
  });
  return {
    value: newStr,
    complete
  }
}

function getForParams(value) {
  let res = value.match(/(.+) in (.+)/);
  if (!res) {
    throw new Error("for参数有误");
  }
  return {
    item: res[1].trim(),
    list: res[2].trim()
  };
}

function make(node, fn) {
  fn(node);
  if (node.children) {
    node.children.forEach(item => {
      make(item, fn);
    });
  }
}
