(() => {
  // whatsapp: country code + number, digits only (e.g. "919876543210"). Leave "" to hide that button.
  const SEND_TO = {
    email: "",
    whatsapp: "919328899868",
  };

  const wishes = [
    "Happy birthday, Swati. You are my comfort — and more than that, you are my confidence and my strength. Because of you, I stand a little taller.",
    "Your innocence and kind heart make you rare. You have done so much for me — more than I can ever put into words — and I will always be grateful.",
    "I want you to grow in your life — freely, bravely, and fully as yourself. May you shine like the brightest star in every room you enter.",
    "Your smile is such a bliss — soft, pure, and unforgettable. Even if our paths are not meant to end in marriage, you are the person I will adore and remember until my last breath. Happy birthday.",
  ];

  const envelopeStage = document.getElementById("stage-envelope");
  const cardStage = document.getElementById("stage-card");
  const cakeStage = document.getElementById("stage-cake");
  const toPhotos = document.getElementById("to-photos");
  const wishesStage = document.getElementById("stage-wishes");
  const herWishStage = document.getElementById("stage-her-wish");
  const toHerWish = document.getElementById("to-her-wish");
  const wishForm = document.getElementById("wish-form");
  const herWish = document.getElementById("her-wish");
  const sendEmail = document.getElementById("send-email");
  const sendWhatsapp = document.getElementById("send-whatsapp");
  const wishStatus = document.getElementById("wish-status");
  const wishThanks = document.getElementById("wish-thanks");
  const envelope = document.getElementById("envelope");
  const card = document.getElementById("card");
  const wishText = document.getElementById("wish-text");
  const wishButtons = document.getElementById("wish-buttons");
  const replay = document.getElementById("replay");
  const petals = document.getElementById("petals");
  const hearts = document.getElementById("hearts");
  const cake = document.getElementById("cake");
  const cutCake = document.getElementById("cut-cake");
  const cakeNote = document.getElementById("cake-note");
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");

  let typingTimer = null;
  let confettiPieces = [];
  let confettiRunning = false;
  let reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showStage(active) {
    [envelopeStage, cardStage, cakeStage, wishesStage, herWishStage].forEach((stage) => {
      const isActive = stage === active;
      stage.hidden = !isActive;
      stage.classList.toggle("is-active", isActive);
    });
  }

  function createPetals() {
    const count = reduceMotion ? 6 : 18;
    for (let i = 0; i < count; i++) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDuration = `${7 + Math.random() * 8}s`;
      petal.style.animationDelay = `${Math.random() * 8}s`;
      petal.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
      petals.appendChild(petal);
    }
  }

  function createHearts() {
    const count = reduceMotion ? 5 : 14;
    for (let i = 0; i < count; i++) {
      const heart = document.createElement("span");
      heart.className = "heart";
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.animationDuration = `${8 + Math.random() * 9}s`;
      heart.style.animationDelay = `${Math.random() * 9}s`;
      heart.style.setProperty("--heart-size", `${8 + Math.random() * 10}px`);
      hearts.appendChild(heart);
    }
  }

  function burstHearts() {
    if (reduceMotion) return;
    const scene = cake.parentElement;
    for (let i = 0; i < 12; i++) {
      const heart = document.createElement("span");
      heart.className = "heart-pop";
      heart.style.left = `${42 + Math.random() * 16}%`;
      heart.style.setProperty("--drift", `${(Math.random() - 0.5) * 90}px`);
      heart.style.animationDelay = `${Math.random() * 0.25}s`;
      scene.appendChild(heart);
      heart.addEventListener("animationend", () => heart.remove());
    }
  }

  function resetCake() {
    cake.classList.remove("is-cutting", "is-cut", "is-cutting-two", "is-cut-two");
    cutCake.hidden = false;
    toPhotos.hidden = true;
    cutCake.disabled = false;
    cutCake.textContent = "Cut the cake";
    cakeNote.textContent = "Make a wish, then cut the cake";
  }

  function typeWish(text) {
    clearTimeout(typingTimer);
    wishText.textContent = "";
    if (reduceMotion) {
      wishText.textContent = text;
      return;
    }

    let i = 0;
    const tick = () => {
      wishText.textContent = text.slice(0, i);
      i += 1;
      if (i <= text.length) {
        typingTimer = setTimeout(tick, 18 + Math.random() * 22);
      }
    };
    tick();
  }

  function setWish(index) {
    const buttons = wishButtons.querySelectorAll(".wish-btn");
    buttons.forEach((btn) => {
      btn.classList.toggle("is-active", Number(btn.dataset.wish) === index);
    });
    typeWish(wishes[index]);
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function burstConfetti() {
    if (reduceMotion) return;
    resizeCanvas();
    const colors = ["#c45c7a", "#8f3d56", "#ffd0dc", "#fff7f9", "#e87a97", "#f2b8c6"];
    confettiPieces = Array.from({ length: 120 }, () => ({
      x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 80,
      y: window.innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 11,
      vy: Math.random() * -10 - 4,
      size: 4 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
    }));
    if (!confettiRunning) {
      confettiRunning = true;
      requestAnimationFrame(drawConfetti);
    }
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    confettiPieces = confettiPieces.filter((p) => p.life > 0.02);
    confettiPieces.forEach((p) => {
      p.vy += 0.18;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life *= 0.985;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    if (confettiPieces.length) {
      requestAnimationFrame(drawConfetti);
    } else {
      confettiRunning = false;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  envelope.addEventListener("click", () => {
    envelope.classList.add("is-opening");
    setTimeout(() => {
      showStage(cardStage);
      envelope.classList.remove("is-opening");
    }, reduceMotion ? 120 : 1000);
  });

  card.addEventListener("click", () => {
    card.classList.add("is-opening");
    setTimeout(() => {
      showStage(cakeStage);
      card.classList.remove("is-opening");
      burstConfetti();
    }, reduceMotion ? 120 : 780);
  });

  toPhotos.addEventListener("click", () => {
    showStage(wishesStage);
    window.scrollTo(0, 0);
    setWish(0);
    burstConfetti();
  });

  wishButtons.addEventListener("click", (event) => {
    const btn = event.target.closest(".wish-btn");
    if (!btn) return;
    setWish(Number(btn.dataset.wish));
    burstConfetti();
  });

  cutCake.addEventListener("click", () => {
    if (cake.classList.contains("is-cut") || cake.classList.contains("is-cutting")) return;
    cake.classList.add("is-cutting");
    cakeNote.textContent = "The first slice is yours, Swati";
    cutCake.disabled = true;
    cutCake.textContent = "Cake cut";
    const step = reduceMotion ? 80 : 700;
    setTimeout(() => {
      cake.classList.remove("is-cutting");
      cake.classList.add("is-cut");
      burstHearts();
      burstConfetti();
    }, step);
    setTimeout(() => {
      cake.classList.add("is-cutting-two");
      cakeNote.textContent = "And one for us, together";
    }, step * 2.2);
    setTimeout(() => {
      cake.classList.remove("is-cutting-two");
      cake.classList.add("is-cut-two");
      burstHearts();
      burstConfetti();
    }, step * 3.2);
    setTimeout(() => {
      cutCake.hidden = true;
      toPhotos.hidden = false;
    }, step * 4.4);
  });

  function resetHerWish() {
    wishForm.hidden = false;
    wishThanks.hidden = true;
    wishStatus.textContent = "";
    sendEmail.disabled = false;
    herWish.value = "";
  }

  function wishReceived() {
    wishForm.hidden = true;
    wishThanks.hidden = false;
    burstConfetti();
  }

  toHerWish.addEventListener("click", () => {
    showStage(herWishStage);
    window.scrollTo(0, 0);
    herWish.focus();
  });

  wishForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const wish = herWish.value.trim();
    if (!wish) return;

    if (!SEND_TO.email) {
      wishStatus.textContent = "Email is not set up yet, try WhatsApp instead.";
      return;
    }

    sendEmail.disabled = true;
    wishStatus.textContent = "Sending your wish...";
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${SEND_TO.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: "Swati",
          wish,
          _subject: "Swati's birthday wish",
          _template: "box",
          _captcha: "false",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      wishReceived();
    } catch {
      sendEmail.disabled = false;
      wishStatus.textContent = SEND_TO.whatsapp
        ? "Could not send by email, please try WhatsApp."
        : "Could not send right now, please try again.";
    }
  });

  if (!SEND_TO.whatsapp) sendWhatsapp.hidden = true;
  if (!SEND_TO.email && SEND_TO.whatsapp) sendEmail.hidden = true;

  sendWhatsapp.addEventListener("click", () => {
    const wish = herWish.value.trim();
    if (!wish) {
      herWish.reportValidity();
      return;
    }
    const text = `My birthday wish: ${wish}`;
    window.open(`https://wa.me/${SEND_TO.whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
    wishReceived();
  });

  replay.addEventListener("click", () => {
    clearTimeout(typingTimer);
    wishText.textContent = "";
    resetCake();
    resetHerWish();
    showStage(envelopeStage);
  });

  window.addEventListener("resize", () => {
    if (confettiRunning) resizeCanvas();
  });

  createPetals();
  createHearts();
})();
