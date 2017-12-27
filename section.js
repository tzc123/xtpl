const match = require("./match");

class Section {
  constructor(tpl) {
    this.tpl = tpl;
  }

  deal(obj) {
    let logic = match(obj.value);
    let value = {
      ...obj,
      ...logic
    };
    let current = this.current;
    let parent = current.parent;
    if (logic) {
      if (
        this.current.start &&
        this.current.start.type == "if" &&
        (logic.type == "elseif" || logic.type == "else")
      ) {
        if (!this.current.middle) {
          this.current.middle = [];
        }
        this.current.middle.push(value);
      } else {
        if (logic.value) {
          if (!this.current.end) {
            if (!this.current.start) {
              this.start(value);
            } else {
              this.checkout("child");
              this.start(value);
            }
          }
        } else {
          if (logic.type == this.current.start.type) {
            this.end(value);
            if (this.current == this.tree.root) {
              return;
            }
            this.current = this.current.parent;
          } else {
            throw new Error("标签未正确闭合");
          }
        }
      }
    } else {
      this.createVariable(obj);
    }
  }

  createVariable(obj) {
    let current = this.current;
    if (!current.variables) {
      current.variables = [];
    }
    current.variables.push(obj);
  }

  checkout(type) {
    if (type == "child") {
      let child = {
        parent: this.current,
        belong: this
      };
      if (!this.current.children) {
        this.current.children = [];
      }
      this.current.children.push(child);
      this.current = child;
    }
  }

  start(start) {
    this.current.start = start;
    console.log(start.type, "开始");
  }

  end(end) {
    this.current.end = end;
    console.log(end.type, "闭合");
  }
  middle(middle) {
    this.current.middle = middle;
  }
  init() {
    this.tree = {
      root: {
        start: {
          tagBegin: -1,
          tagClose: -1
        },
        end: false,
        belong: this,
        content: this.tpl
      }
    };
    this.current = this.tree.root;
    return this.search();
  }
  search() {
    let startIndex = 0;
    let root = this.tree.root;
    while (true) {
      let tagBegin = this.tpl.indexOf("{", startIndex);
      let tagClose = this.tpl.indexOf("}", startIndex);
      if (tagBegin == -1) {
        if (tagClose == -1) {
          if (!root.children || root.children[root.children.length - 1].end) {
            this.current.end = true;
            return this.tree;
          } else {
            throw new Error("标签未正确闭合");
          }
        } else {
          throw new Error("找不到{");
        }
      } else {
        if (tagClose == -1) {
          throw new Error("找不到}");
        } else {
          let value = this.tpl.substring(tagBegin + 1, tagClose);
          startIndex = tagClose + 1;
          this.deal({
            tagBegin,
            tagClose,
            value
          });
        }
      }
    }
  }
}

module.exports = Section;
