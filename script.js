
/* =========================
   1. THÔNG TIN KHÁCH MỜI
========================= */

const params = new URLSearchParams(window.location.search);

const guestSlug = (params.get("guest") || "").trim().toLowerCase();
const guestType = (params.get("type") || "friend").trim().toLowerCase();

// Danh sách tên khách mời duy nhất
const guestNames = {
  "ngoc-giau": "Ngọc Giàu",
  "chi-linh": "Chị Linh",
  "ba-me": "Ba mẹ",
  "hai-yen": "Chị Yến",
  "tuong-vy": "Tường Vy",
  "yen-nhien": "Yên Nhiên",
   "kieu-vy":"Kiều Vy",
   "mong-tuyen":"Mộng Tuyền"
   "thu-thuy":"Thu Thủy",
   "thuy-vy":"Thúy Vy",
   "thanh-thuy":"Thanh Thúy",
   "ngoc-han":"Ngọc Hân",
   "kim-thuy":"Kim Thùy",
   "ngo-thanh":"Ngô Thành",
   "tan-khang":"Tấn Khang",
   "quoc-thanh":"Quốc Thành",
   "nhat-huy":"Nhật Huy",
   "xuan-dao":"Xuân Đào",
   "thien-nhan":"Thiện Nhân",
   "anh-thu": "Anh Thư",
   "lan-chi":"Lan Chi",
   "gia-huy":"Gia Huy",
   "keke":"Ngọc Huyền",
   "sep":"Sếp Bằng"
};

// Chuyển slug thành tên dễ đọc nếu chưa có trong danh sách
function formatGuestName(slug) {
  return (slug || "")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/(^|\s)\S/g, letter =>
      letter.toLocaleUpperCase("vi")
    );
}

const guestName = guestSlug
  ? guestNames[guestSlug] || formatGuestName(guestSlug)
  : "bạn";

// Hiển thị tên khách mời
const guestNameElement = document.getElementById("guestName");

if (guestNameElement) {
  guestNameElement.textContent = guestName;
}

// Hiển thị lời chào theo nhóm khách
const greeting = document.getElementById("greeting");

if (greeting) {
  if (guestType === "senior") {
    greeting.textContent =
      "Đến chung vui cùng em trong ngày tốt nghiệp nhé, ${guestName}";
  } else {
    greeting.textContent =
      "Cùng mình ghi dấu một cột mốc đáng nhớ nha, ${guestName}";
  }
}


/* =========================
   2. KHAI BÁO PHẦN TỬ
========================= */

const envelope = document.getElementById("envelope");
const invitation = document.getElementById("invitation");
const openButton = document.getElementById("openButton");
const tapHint = document.getElementById("tapHint");
const bgMusic = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");

let opened = false;


/* =========================
   3. NHẠC NỀN
========================= */

// Chuẩn bị âm lượng
if (bgMusic) {
  bgMusic.volume = 0.4;
}

// Trình duyệt có thể chặn tự phát nhạc.
// Nhạc sẽ được thử phát khi khách bấm mở thiệp.


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


/* =========================
   4. NÚT MỞ PHONG BÌ
========================= */

if (openButton) {
  openButton.addEventListener("click", async () => {
    if (opened) return;

    opened = true;

    // Hiệu ứng mở phong bì
    envelope?.classList.add("open");

    if (tapHint) {
      tapHint.textContent = "Thiệp dành riêng cho bạn ♡";
    }

    // Phát nhạc sau thao tác của khách
    if (bgMusic) {
      try {
        await bgMusic.play();

        if (musicButton) {
          musicButton.textContent = "♫ Tắt nhạc";
        }
      } catch (error) {
        console.log("Không thể phát nhạc:", error);
      }
    }

    // Hiện nội dung thiệp sau hiệu ứng mở
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


/* =========================
   5. HIỆU ỨNG PHÁO GIẤY
========================= */

function launchConfetti() {
  const canvas = document.getElementById("confetti");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = [
    "#d98ca7",
    "#f3c6d6",
    "#e8b66d",
    "#ffffff",
    "#b85d7e"
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
