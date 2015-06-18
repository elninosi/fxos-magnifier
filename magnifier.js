(function() {
  'use strict';

  detectMultiTapGesture(3, magnify);

  function magnify(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    var oldTransform = document.body.style.transform;
    var oldTransformOrigin = document.body.style.transformOrigin;

    var x0 = event.changedTouches[0].clientX;
    var y0 = event.changedTouches[0].clientY;
    var xp0 = Math.round(x0/screen.width);
    var yp0 = Math.round(y0/screen.height);

    document.body.style.transformOrigin = '0 0';
    document.body.style.transform =
      'translate(-' + x0 + 'px, -' + y0 + 'px) scale(2)';

    window.addEventListener('touchmove', move, true);
    window.addEventListener('touchend', end, true);

    function move(event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      var x1 = event.changedTouches[0].clientX;
      var y1 = event.changedTouches[0].clientY;
      var xp1 = Math.round(x1/screen.width);
      var yp1 = Math.round(y1/screen.height);

      document.body.style.transform =
        'translate(-' + x1 + 'px, -' + y1 + 'px) scale(2)';
    }

    function end(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      document.body.style.transform = oldTransform;
      document.body.style.transformOrigin = oldTransformOrigin;
      window.removeEventListener('touchmove', move, true);
      window.removeEventListener('touchend', end, true);
    }
  }

  function detectMultiTapGesture(numtaps, callback) {
    const TIME_THRESHOLD = 400;  // max ms between taps
    const SPACE_THRESHOLD = 20;  // max pixel distance between taps

    window.addEventListener('touchstart', tap, true);

    var count = 0;
    var lastx, lasty;
    var timer = null;

    function tap(event) {
      clearTimeout(timer);
      count++;
      if (count === numtaps) {
        count = 0;
        callback(event);
      }
      else {
        // Get coordinates of this tap
        var x = event.changedTouches[0].clientX;
        var y = event.changedTouches[0].clientY;

        // If this is not the first tap in a sequence verify that this tap
        // is near the last one. If the tap is too far away, reset the tap
        // count back to 0.
        if (count > 1) {
          if (Math.abs(x - lastx) > SPACE_THRESHOLD ||
              Math.abs(y - lasty) > SPACE_THRESHOLD) {
            count = 0;
            return;
          }
        }
        lastx = x;
        lasty = y;

        // taps must be within 1/3rd of a second of each other or
        // we reset back down to 0.
        timer = setTimeout(function() { count = 0; }, TIME_THRESHOLD);
      }
    }
  }
}());
