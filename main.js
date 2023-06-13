window.onload = function () {
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

  graph.addEventListener('mousewheel', handleZoom); // For modern browsers
  graph.addEventListener('DOMMouseScroll', handleZoom); // For older Firefox

  var primes = generatePrimes(10000);
  for (let i = 0; i < primes.length; ++i) {
    plotPoint(primes[i], primes[i]);
  }
};
