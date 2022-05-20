 var canvas = $('canvas')[0];
var context = canvas.getContext('2d');

var Dots = [];
var ID = 0;
var colors = ['#FF9900', '#424242', '#BCBCBC', '#3299BB', '#B9D3B0', '#81BDA4', '#F88F79', '#F6AA93'];
var maximum = 100;

function Dot() {
  this.active = true;
  this.id = ID; ID++;
  
  this.diameter = 2 + Math.random() * 7;

  this.x = Math.round(Math.random() * canvas.width);
  this.y = Math.round(Math.random() * canvas.height);
  
  this.velocity = {
    x: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 0.4,
    y: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 0.4
  };

  this.alpha = 0.1;
  this.maxAlpha = this.diameter < 5 ? 0.3 : 0.8;
  this.hex = colors[Math.round(Math.random() * 7)];
  this.color = HexToRGBA(this.hex, this.alpha);
}

Dot.prototype = {
  Update: function() {
    if(this.alpha <= this.maxAlpha) {
      this.alpha += 0.005;
      this.color = HexToRGBA(this.hex, this.alpha);
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if(this.x > canvas.width + 5 || this.x < 0 - 5 || this.y > canvas.height + 5 || this.y < 0 - 5) {
      this.active = false;
    }
  },

  Draw: function() {
    context.strokeStyle = this.color;
    context.fillStyle = this.color;
    context.save();
    context.beginPath();
    context.translate(this.x, this.y);
    context.moveTo(0, -this.diameter);

    for (var i = 0; i < 7; i++)
    {
      context.rotate(Math.PI / 7);
      context.lineTo(0, -(this.diameter / 2));
      context.rotate(Math.PI / 7);
      context.lineTo(0, -this.diameter);
    }

    if(this.id % 2 == 0) {
      context.stroke();
    } else {
      context.fill();
    }
    
    context.closePath();
    context.restore();
  }
}

function Update() {
  GenerateDots();

  Dots.forEach(function(Dot) {
    Dot.Update();
  });

  Dots = Dots.filter(function(Dot) {
    return Dot.active;
  });

  Render();
  requestAnimationFrame(Update);
}

function Render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  Dots.forEach(function(Dot) {
    Dot.Draw();
  });
}

function GenerateDots() {
  if(Dots.length < maximum) {
    for(var i = Dots.length; i < maximum; i++) {
      Dots.push(new Dot());
    }
  }

  return false;
}

function HexToRGBA(hex, alpha) {
  var red = parseInt((TrimHex(hex)).substring(0, 2), 16);
  var green = parseInt((TrimHex(hex)).substring(2, 4), 16);
  var blue = parseInt((TrimHex(hex)).substring(4, 6), 16);

  return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';
}

function TrimHex(hex) {
  return (hex.charAt(0) == "#") ? hex.substring(1, 7) : hex;
}

function WindowSize(width, height) {
  if(width != null) { canvas.width = width; } else { canvas.width = window.innerWidth; }
  if(height != null) { canvas.height = height; } else { canvas.height = window.innerHeight; }
  
}

$(window).resize(function() {
  Dots = [];
  WindowSize();
});

WindowSize();
GenerateDots();
Update();

// NAVIGATION LOGO SCROLL TOP
$('.logo').on('click', function(e) {
    e.preventDefault();
    $('.nav-toggle').removeClass('open');
    $('.menu-left').removeClass('collapse');
    $('html, body').animate({
      scrollTop: 0
    }, 750, 'easeInOutQuad')
  });
  // LINKS TO ANCHORS
  $('a[href^="#"]').on('click', function(event) {
  
    var $target = $(this.getAttribute('href'));
  
    if($target.length) {
      event.preventDefault();
      $('html, body').stop().animate({
        scrollTop: $target.offset().top
      }, 750, 'easeInOutQuad');
    }
  });
  
  // TOGGLE HAMBURGER & COLLAPSE NAV
  $('.nav-toggle').on('click', function() {
    $(this).toggleClass('open');
    $('.menu-left').toggleClass('collapse');
  });
  // REMOVE X & COLLAPSE NAV ON ON CLICK
  $('.menu-left a').on('click', function() {
    $('.nav-toggle').removeClass('open');
    $('.menu-left').removeClass('collapse');
  });
  
  // SHOW/HIDE NAV
  
  // Hide Header on on scroll down
  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var navbarHeight = $('header').outerHeight();
  
  $(window).scroll(function(event){
      didScroll = true;
  });
  
  setInterval(function() {
      if (didScroll) {
          hasScrolled();
          didScroll = false;
      }
  }, 250);
  
  function hasScrolled() {
      var st = $(this).scrollTop();
  
      // Make sure they scroll more than delta
      if(Math.abs(lastScrollTop - st) <= delta)
          return;
  
      // If they scrolled down and are past the navbar, add class .nav-up.
      // This is necessary so you never see what is "behind" the navbar.
      if (st > lastScrollTop && st > navbarHeight){
          // Scroll Down
          $('header').removeClass('show-nav').addClass('hide-nav');
          $('.nav-toggle').removeClass('open');
          $('.menu-left').removeClass('collapse');
      } else {
          // Scroll Up
          if(st + $(window).height() < $(document).height()) {
              $('header').removeClass('hide-nav').addClass('show-nav');
          }
      }
  
      lastScrollTop = st;
  }

var TxtRotate = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 100) || 4000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  };
  
  TxtRotate.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];
  
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }
  
    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
  
    var that = this;
    var delta = 150 - Math.random() * 100;
  
    if (this.isDeleting) { delta /= 2; }
  
    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 1000;
    }
  
    setTimeout(function() {
      that.tick();
    }, delta);
  };
  
  window.onload = function() {
    var elements = document.getElementsByClassName('txt-rotate');
    for (var i=0; i<elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-rotate');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtRotate(elements[i], JSON.parse(toRotate), period);
      }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #F26921 }";
    document.body.appendChild(css);
  };
 
