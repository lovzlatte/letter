const train = document.querySelector('.train-container');
const smokeContainer = document.querySelector('.smoke-container');
const paper = document.getElementById('paper');
const ropePath = document.getElementById('ropePath');
const goButton = document.getElementById('goButton');
const rewardImage = document.getElementById('rewardImage');
const rewardButton = document.getElementById('rewardButton');
const rewardContainer = document.getElementById('rewardContainer');



let trainLeft = window.innerWidth; // mulai di luar kanan
const trainSpeed = 2;
let isMoving = true; // awalnya jalan terus
let goAgain = false; // kontrol lanjut jalan setelah klik tombol
let smokeInterval = setInterval(createBubble, 150);

function animateTrain() {
  if (isMoving) {
    trainLeft -= trainSpeed;
    train.style.left = `${trainLeft}px`;

    if (trainLeft > 0 && !goAgain) {
      requestAnimationFrame(animateTrain);
    } else if (!goAgain) {
      // berhenti di posisi 0
      train.style.left = `0px`;
      isMoving = false;
      clearInterval(smokeInterval);
    } else {
      // lanjut jalan ke kiri sampai keluar layar
      if (trainLeft + train.offsetWidth > 0) {
        requestAnimationFrame(animateTrain);
      } else {
        // sudah keluar layar, stop dan sembunyikan elemen
        // sudah keluar layar, stop dan sembunyikan elemen
        isMoving = false;
        train.style.display = 'none';
        paper.style.display = 'none';
        clearInterval(smokeInterval);

        setTimeout(() => {
          rewardContainer.classList.add('show'); // ini trigger animasi fadeIn di CSS
        }, 500);

      }
    }
  }
}

requestAnimationFrame(animateTrain);

function createBubble() {
  for (let i = 0; i < 3; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    const size = Math.random() * 8 + 8;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = (Math.random() * 20 - 10) + 'px';

    smokeContainer.appendChild(bubble);
    setTimeout(() => bubble.remove(), 2000);
  }
}

function updatePaperAndRope() {
  const trainBackX = trainLeft + train.offsetWidth - 20;
  const trainBackY = window.innerHeight - 90;

  const paperX = trainBackX + 50;
  const paperY = window.innerHeight - 140;

  paper.style.left = `${paperX}px`;
  paper.style.top = `${paperY}px`;

  const waveAmplitude = 10;
  const waveLength = 40;
  const wavePoints = 6;
  const time = performance.now() / 300;

  let pathD = `M ${trainBackX} ${trainBackY} `;
  for (let i = 1; i <= wavePoints; i++) {
    const x = trainBackX + (i * waveLength);
    const y = trainBackY + Math.sin(i + time) * waveAmplitude;
    pathD += `L ${x} ${y} `;
  }
  pathD += `L ${paperX + 10} ${paperY + 20}`;

  ropePath.setAttribute('d', pathD);
}

function animate() {
  updatePaperAndRope();
  requestAnimationFrame(animate);
}
animate();

// Event listener tombol GO
goButton.addEventListener('click', () => {
  if (!isMoving) {
    goAgain = true;
    isMoving = true;
    train.style.display = 'block';
    paper.style.display = 'flex';
    smokeInterval = setInterval(createBubble, 150);
    animateTrain();
  }
});

rewardButton.addEventListener('click', () => {
  // Hilangkan tombol setelah diklik
  rewardButton.style.display = 'none';

  // Fade-out gambar lama
  rewardImage.style.transition = 'opacity 0.5s ease';
  rewardImage.style.opacity = 0;

  setTimeout(() => {
    // Ganti gambar
    rewardImage.src = 'sertif.png';
    rewardImage.alt = 'Certificate';

    // Fade-in gambar baru
    rewardImage.style.opacity = 1;
  }, 500);
});


// Setelah kereta hilang, tampilkan reward
if (trainLeft + train.offsetWidth <= 0) {
  isMoving = false;

  const rewardContainer = document.getElementById('rewardContainer');
  rewardContainer.style.display = 'flex'; // <-- ini munculin container & center
}

