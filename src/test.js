function Foo() {
  return {
    x: 1,
    count: function() {
      console.log("this: " + this)
      this.x = this.x + 1
      return this.x
    }
  }
}
