const container = document.getElementById('constellation');
const canvas = document.getElementById('connection-lines');
const ctx = canvas.getContext('2d');
const tooltip = document.getElementById('tooltip');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  clearCanvas();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const stars = [];
let nonDummyStars = [];

fetch('./data/stars.json')
  .then(res => res.json())
  .then(starsData => {
    starsData.forEach(data => {
      const star = document.createElement('div');
      star.classList.add('star');
      star.style.left = `${data.x}%`;
      star.style.top = `${data.y}%`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(star);

      const starInfo = {
        element: star,
        isDummy: data.name === '' && data.legend === '',
        data: data
      };

      stars.push(starInfo);
      if (!starInfo.isDummy) {
        nonDummyStars.push(starInfo);
      }

      if (!starInfo.isDummy) {
        star.dataset.name = data.name;
        star.dataset.legend = data.legend;

        star.addEventListener('mouseenter', () => {
          tooltip.innerHTML = `<strong>${data.name}</strong><br>${data.legend}`;
          tooltip.style.display = 'block';
          const rect = star.getBoundingClientRect();
          tooltip.style.left = `${rect.right + 10}px`;
          tooltip.style.top = `${rect.top - 5}px`;
        });

        star.addEventListener('mouseleave', () => {
          tooltip.style.display = 'none';
        });
      }
    });

    drawAllConnections();
  });

document.addEventListener('mousemove', (e) => {
  clearCanvas();
  drawAllConnections();

  if (nonDummyStars.length === 0) return;

  const mousePos = { x: e.clientX, y: e.clientY };
  const closestStars = getClosestStarsToPoint(mousePos, 3);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = 'rgba(255, 255, 255, 1)';
  ctx.shadowBlur = 5;

  closestStars.forEach(starInfo => {
    const pos = getElementCenter(starInfo.element);
    ctx.beginPath();
    ctx.moveTo(mousePos.x, mousePos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  });

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
});

function getElementCenter(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}

function getClosestStarsToPoint(point, count = 3) {
  const distances = nonDummyStars.map(starInfo => {
    const pos = getElementCenter(starInfo.element);
    const dist = Math.hypot(pos.x - point.x, pos.y - point.y);
    return { starInfo, dist };
  });

  return distances.sort((a, b) => a.dist - b.dist)
                  .slice(0, count)
                  .map(entry => entry.starInfo);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const namedConnections = [
  ['sadalmelik', 'star1'],
  ['sadalmelik', 'sadalsuud'],
  ['sadalmelik', 'star2'],
  ['star1', 'sadachbia'],
  ['star2', 'star3'],
  ['sadalsuud', 'albali'],
  ['sadachbia', 'sadaltager'],
  ['sadaltager','star4'],
  ['star4','star5'],
  ['star5','star6'],
  ['star6','skat']
];

function drawNamedConnections() {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;

  namedConnections.forEach(([idA, idB]) => {
    const starA = stars.find(s => s.data.id.toLowerCase() === idA.toLowerCase());
    const starB = stars.find(s => s.data.id.toLowerCase() === idB.toLowerCase());

    if (!starA || !starB) {
      console.warn(`연결 실패: ${idA} 또는 ${idB} 별을 찾을 수 없습니다.`);
      return;
    }

    const posA = getElementCenter(starA.element);
    const posB = getElementCenter(starB.element);

    ctx.beginPath();
    ctx.moveTo(posA.x, posA.y);
    ctx.lineTo(posB.x, posB.y);
    ctx.stroke();
  });
}


function drawAllConnections() {
  clearCanvas();
  drawNamedConnections();
}

let inputBuffer = '';

window.addEventListener('keydown', (event) => {
  const key = event.key;

  inputBuffer += key;

  if (inputBuffer.length > 4) {
    inputBuffer = inputBuffer.slice(-4);
  }

  if (inputBuffer.toLowerCase() === 'aqua') {
    window.location.href = 'https://youtu.be/VlrQ-bOzpkQ?si=6yxGfwhlrSt90gdU';
  }
});
