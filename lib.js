function randomHue() {
  return Math.floor(Math.random() * 360);
}

function preserveRelativeProperties(hsl1, hsl2) {
  // Extract the hue, saturation, and lightness values
  const [h1, s1, l1] = hsl1;
  const [h2, s2, l2] = hsl2;

  // Calculate the differences
  const hueDiff = h2 - h1;
  const satDiff = s2 - s1;
  const lightDiff = l2 - l1;

  // Generate a new base hue
  const newHue1 = randomHue();
  const newHue2 = (newHue1 + hueDiff + 360) % 360; // Ensure the hue is within the 0-360 range

  // Apply the differences to get the new saturation and lightness
  const newSat1 = s1;
  const newSat2 = Math.min(Math.max(newSat1 + satDiff, 0), 100); // Clamp between 0-100%
  const newLight1 = l1;
  const newLight2 = Math.min(Math.max(newLight1 + lightDiff, 0), 100); // Clamp between 0-100%

  // Return the new HSL color pairs
  return [[newHue1, newSat1, newLight1], [newHue2, newSat2, newLight2]];
}


function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  if (delta == 0)
    h = 0;
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  else if (cmax == g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0)
    h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l];
}

// Function to convert HSL to hex
function HSLToHex(h,s,l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}

// Function to generate a new color pair and update the DOM elements
function updateColors() {
  const originalColor1 = hexToHSL("#4B6CDF"); // Convert the original color to HSL
  const originalColor2 = hexToHSL("#E9B2F6"); // Convert the original color to HSL
  const newColors = preserveRelativeProperties(originalColor1, originalColor2);

  // Convert the new HSL colors back to hex
  const newHexColor1 = HSLToHex(...newColors[0]);
  const newHexColor2 = HSLToHex(...newColors[1]);

  // Update the DOM elements with the new colors
  document.querySelector('body').style.backgroundColor = newHexColor1;
  document.querySelector('.svg-container').style.boxShadow = `0 0 50px 30px ${newHexColor2}`;
  document.querySelector('rect').setAttribute('fill', newHexColor2);
  setTimeout(updateColors, 20000);
}

setTimeout(updateColors, 5000);

