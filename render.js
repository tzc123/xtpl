module.exports = function(section, data) {
  console.log("开始解析");
  make(section.tree.root, function(node) {
    if (node.start.type == "for") {
      node.param = getForParams(node.start.value);
    }
  });
  render(section);
  return section.tree.root.render(data)
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
        let content = this.content
        this.children && this.children.forEach(child => {
          content = content.replace(child.oldContent, child.render(data))
        })
        this.variables &&
          this.variables.forEach(variable => {
            content = content.replace(
              "{" + variable.value + "}",
              eval(getVariable(data, variable.value).value)
            );
          });
        return content
      };
    }
  });
}

function resolve(node) {
  node.content = node.belong.tpl.substring(
    node.start.tagClose + 1,
    node.end.tagBegin
  );
  node.oldContent = node.belong.tpl.substring(
    node.start.tagBegin,
    node.end.tagClose + 1
  );
  node.render = function(data) {
    console.log(data)
    let tpl = this.belong.tpl;
    let content = "";
    let variables = this.variables;
    if (this.start.type == "for") {
      let list = eval(getVariable(data, this.param.list).value);
      if (!list) {
        throw new Error("不存在" + this.param.list);
      }
      if ({}.toString.call(list) == "[object Array]") {
        content = list.map((item, index) => {
          let ocontent = this.content;
          this.children && this.children.forEach(child => {
            ocontent = ocontent.replace(
              child.oldContent,
              child.render({
                ...data,
                [this.param.item]: list[index]
              })
            );
          });
          variables &&
            variables.forEach(variable => {
              if (variable.value.indexOf(this.param.item) != -1) {
                let res = getVariable(
                  data,
                  variable.value.replace(
                    this.param.item,
                    this.param.list + "[" + index + "]"
                  )
                );
                let value = eval(res.value);
                ocontent = ocontent.replace("{" + variable.value + "}", value);
              } else {
                let res = getVariable(data, variable.value);
                let value = eval(res.value);
                ocontent = ocontent.replace("{" + variable.value + "}", value);
              }
            });
          return ocontent;
        });
        content = content.join("");
      } else {
        throw new Error(this.param.list + "不是一个数组");
      }
    } else if (this.start.type == "if") {
      let children = this.children && this.children.map(child => {
        return {
          content: child.render(data),
          oldContent: child.oldContent
        }
      })
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
          content = choice.content;
          if (choice.tag.type != "else") {
            if (eval(getVariable(data, choice.tag.value))) {
              children && children.forEach(child => {
                content = content.replace(child.oldContent, child.content)
              })
              variables &&
                variables.forEach(variable => {
                  let res = getVariable(data, variable.value);
                  let value = eval(res.value);
                  content = choice.content.replace(
                    "{" + variable.value + "}",
                    value
                  );
                });
              return true;
            }
          } else {
            children && children.forEach(child => {
              content = content.replace(child.oldContent, child.content)
            })
            variables &&
              variables.forEach(variable => {
                let res = getVariable(data, variable.value);
                let value = eval(res.value);
                content = choice.content.replace(
                  "{" + variable.value + "}",
                  value
                );
              });
            return true;
          }
        });
      } else {
        if (eval(getVariable(data, this.start.value))) {
          content = this.content
          children && children.forEach(child => {
            content = content.replace(child.oldContent, child.content)
          })
          this.variables &&
            this.variables.forEach(variable => {
              let res = getVariable(data, variable.value);
              let value = eval(res.value);
              content = content.replace("{" + variable.value + "}", value);
            });
        }
      }
    }
    return content;
  };
}

function getVariable(data, str) {
  let complete = true;
  let newStr = str.replace(/(?!"')([^\.\[\]\{\}\(\)\s]*)(?!"')/g, function(
    match,
    key
  ) {
    if (data[key.trim()]) {
      return "data." + key.trim();
    }
    complete = false;
    return key;
  });
  return {
    value: newStr,
    complete
  };
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
