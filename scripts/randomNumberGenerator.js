randomNumberGenerator = function() {
  this.a = 101723;
  this.b = 100003;
  this.c = 101292101;

  this.curr = Math.floor(Math.random() * 100000) + 1;

  this.next = function(from, to) {
    this.curr *= this.a;
    this.curr += this.b;
    this.curr %= this.c;

    return from + this.curr%(to-from+1);
  }
};

var rng = new randomNumberGenerator();
