window.onload = function () {

  const LIMIT_NUMBER = 10000;

  const graph = document.getElementById('graph');
  const origin = { x: graph.offsetWidth / 2, y: graph.offsetHeight / 2 };
  let zoomLevel = 1;

  function polarToCartesian(r, theta) {
    return {
      x: r * Math.cos(theta),
      y: -r * Math.sin(theta)
    };
  }

  function plotPoint(r, theta) {
    const point = polarToCartesian(r * zoomLevel, theta);
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.style.left = `${origin.x + point.x - dot.offsetWidth / 2}px`;
    dot.style.top = `${origin.y + point.y - dot.offsetHeight / 2}px`;
    graph.appendChild(dot);
  }

  function generatePrimes(limit) {
    var sieve = [], i, j, primes = [];
    for (i = 2; i <= limit; ++i) {
      if (!sieve[i]) {
        primes.push(i);
        for (j = i << 1; j <= limit; j += i) {
          sieve[j] = true;
        }
      }
    }
    return primes;
  }

  function handleZoom(event) {
    event.preventDefault(); // Prevent default browser zoom behavior
    const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    if (delta > 0) {
      zoomLevel *= 1.2; // Increase zoom
    } else {
      zoomLevel /= 1.2; // Decrease zoom
    }
    graph.innerHTML = '<div id="xAxis"></div><div id="yAxis"></div>'; // Clear existing points
    for (let i = 0; i < primes.length; ++i) {
      plotPoint(primes[i], primes[i]);
    }
  }

  function handlePinch(event) {
    event.preventDefault(); // Prevent default pinch zoom behavior
    if (event.touches.length >= 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      if (typeof lastDistance !== 'undefined') {
        if (distance > lastDistance) {
          zoomLevel *= 1.2; // Increase zoom
        } else if (distance < lastDistance) {
          zoomLevel /= 1.2; // Decrease zoom
        }
        graph.innerHTML = '<div id="xAxis"></div><div id="yAxis"></div>'; // Clear existing points
        for (let i = 0; i < primes.length; ++i) {
          plotPoint(primes[i], primes[i]);
        }
      }
      lastDistance = distance;
    }
  }

  graph.addEventListener('wheel', handleZoom, { passive: false }); // For modern desktop browsers
  graph.addEventListener('mousewheel', handleZoom, { passive: false }); // For older desktop browsers
  graph.addEventListener('DOMMouseScroll', handleZoom, { passive: false }); // For Firefox

  graph.addEventListener('touchstart', function (event) {
    if (event.touches.length >= 2) {
      lastDistance = Math.hypot(event.touches[1].clientX - event.touches[0].clientX, event.touches[1].clientY - event.touches[0].clientY);
    }
  });

  graph.addEventListener('touchmove', handlePinch, { passive: false });

  var primes = generatePrimes(LIMIT_NUMBER);
  for (let i = 0; i < primes.length; ++i) {
    plotPoint(primes[i], primes[i]);
  }
};
