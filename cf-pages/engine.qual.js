(function () {
  let step = 0;
  let locked = false;

  const steps = [
    {
      q: "Is your business still dependent on you day-to-day?",
      o: ["Yes", "No"],
      v: (a) => a === "Yes"
    },
    {
      q: "What type of business do you run?",
      o: ["HVAC", "Electrical", "Plumbing", "Water Treatment", "Air Quality", "Direct Sales"],
      v: () => true
    },
    {
      q: "How long have you been operating?",
      o: ["0–1 years", "2–5 years", "5–10 years", "10+ years"],
      v: (a) => a !== "0–1 years"
    },
    {
      q: "Which best describes your role today?",
      o: ["I run everything", "I still sell or manage daily", "I only review numbers"],
      v: (a) => a !== "I only review numbers"
    }
  ];

  const root = document.createElement("div");
  root.style.cssText = `
    position:fixed;
    inset:0;
    background:#0a0a0a;
    color:#ffffff;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    font-family:system-ui,-apple-system,BlinkMacSystemFont;
    text-align:center;
    z-index:9999;
  `;
  document.body.appendChild(root);

  function clear() {
    root.innerHTML = "";
    locked = false;
  }

  function button(text, fn) {
    const b = document.createElement("button");
    b.innerText = text;
    b.style.cssText = `
      padding:16px 32px;
      margin:8px;
      font-size:16px;
      font-weight:600;
      cursor:pointer;
      border:none;
    `;
    b.onclick = () => {
      if (locked) return;
      locked = true;
      fn();
    };
    return b;
  }

  function renderStep() {
    clear();
    if (!steps[step]) return renderQualified();

    const h = document.createElement("h2");
    h.innerText = steps[step].q;
    h.style.marginBottom = "24px";
    root.appendChild(h);

    steps[step].o.forEach(opt => {
      root.appendChild(
        button(opt, () => {
          if (!steps[step].v(opt)) renderExit();
          else {
            step++;
            renderStep();
          }
        })
      );
    });
  }

  function renderExit() {
    clear();
    const h = document.createElement("h2");
    h.innerText = "This engine isn’t built for your business.";
    const p = document.createElement("p");
    p.innerText =
      "LUKAIRO installs operational engines for established service and direct sales companies only.";
    p.style.opacity = "0.7";
    p.style.maxWidth = "520px";
    root.append(h, p);
  }

  function renderQualified() {
    clear();
    const h = document.createElement("h2");
    h.innerText = "You’re a fit.";

    const p = document.createElement("p");
    p.innerText =
      "LUKAIRO installs the same sales and service engine we run in our own water, air, and field service businesses. No learning. No lifting. Built to be used.";
    p.style.maxWidth = "560px";
    p.style.margin = "20px 0";

    const a = document.createElement("a");
    a.innerText = "Book the Build Call";
    a.href = "https://www.lukairoengine.com/widget/bookings/booking-lukairo";
    a.style.cssText = `
      background:#ffffff;
      color:#000000;
      padding:18px 36px;
      text-decoration:none;
      font-weight:700;
      display:inline-block;
      margin-top:12px;
    `;

    root.append(h, p, a);
  }

  renderStep();
})();
