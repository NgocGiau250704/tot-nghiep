
const params = new URLSearchParams(window.location.search);
const guestSlug = params.get("guest");

const guestNames = {
  "ngoc-giau": "Ngọc Giàu",
  "chi-linh": "Chị Linh",
  "ba-me": "Ba mẹ",
  "meo": "Mèo",
  "hai-yen": "Chị Yến",
  "tuong-vy": "Chị Vy",
  
};

function formatGuestName(slug) {
  return (slug || "")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/(^|\s)\S/g, letter => letter.toLocaleUpperCase("vi"));
}

const guestName = guestSlug
  ? guestNames[guestSlug.toLowerCase()] || formatGuestName(guestSlug)
  : "bạn!";

// Hiển thị tên khách mời
const guestNameElement = document.getElementById("guestName");
if (guestNameElement) {
  guestNameElement.textContent = guestName;
}

const greeting = document.getElementById("greeting");
if (greeting) {
  greeting.textContent = guestName === "bạn!"
    ? "Đến chung vui cùng em trong ngày tốt nghiệp nhé,"
    : `Cùng mình ghi dấu một cột mốc đáng nhớ nha, ${guestName}.`;
}

// Khai báo các phần tử
const envelope = document.getElementById("envelope");
const invitation = document.getElementById("invitation");
const openButton = document.getElementById("openButton");
const tapHint = document.getElementById("tapHint");
const bgMusic = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");

let opened = false;

// Thử tự phát nhạc khi mở trang
if (bgMusic) {
  bgMusic.volume = 0.4;
  bgMusic.play().then(() => {
    if (musicButton) musicButton.textContent = "♫ Tắt nhạc";
  }).catch(() => {
    // Trình duyệt có thể chặn tự phát nhạc
  });
}

// Nút bật/tắt nhạc
if (bgMusic && musicButton) {
  musicButton.addEventListener("click", async () => {
    if (bgMusic.paused) {
      try {
        await bgMusic.play();
        musicButton.textContent = "♫ Tắt nhạc";
      } catch (error) {
        console.error("Không phát được nhạc:", error);
        musicButton.textContent = "Thử bật nhạc lại";
      }
    } else {
      bgMusic.pause();
      musicButton.textContent = "♫ Bật nhạc";
    }
  });
}

// Nút mở phong bì
if (openButton) {
  openButton.addEventListener("click", async () => {
    if (opened) return;
    opened = true;

    envelope?.classList.add("open");

    if (tapHint) {
      tapHint.textContent = "Thiệp dành riêng cho bạn ♡";
    }

    // Thử phát nhạc sau thao tác của khách
    if (bgMusic) {
      try {
        await bgMusic.play();
        if (musicButton) musicButton.textContent = "♫ Tắt nhạc";
      } catch (error) {
        console.log("Không thể phát nhạc:", error);
      }
    }


setTimeout(() => {
  invitation?.classList.remove("hidden");

  const memories = document.getElementById("memories");
  memories?.classList.remove("hidden");

  invitation?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  launchConfetti();
}, 850);

  });
}

// Hiệu ứng pháo giấy
function launchConfetti() {
  const canvas = document.getElementById("confetti");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = [
    "#d98ca7", "#f3c6d6", "#e8b66d",
    "#ffffff", "#b85d7e"
  ];

  const pieces = Array.from({ length: 110 }, () => ({
    x: Math.random() * canvas.width,
    y: -Math.random() * canvas.height * 0.5,
    size: Math.random() * 7 + 3,
    speed: Math.random() * 3 + 2,
    drift: Math.random() * 2 - 1,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 6
  }));

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(piece => {
      piece.y += piece.speed;
      piece.x += piece.drift;
      piece.rotation += 0.04;

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;
      ctx.fillRect(
        -piece.size / 2,
        -piece.size / 2,
        piece.size,
        piece.size * 0.65
      );
      ctx.restore();
    });

    frame++;

    if (frame < 150) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  draw();
}
