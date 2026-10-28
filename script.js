(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("year").textContent = new Date().getFullYear();

  // Scroll reveal
  var items = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add("in"); }); }

  // Card spotlight follows the pointer
  document.querySelectorAll(".card").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--x", (e.clientX - r.left) + "px");
      c.style.setProperty("--y", (e.clientY - r.top) + "px");
    });
  });

  // Rotating headline word
  var word = document.getElementById("word");
  var words = word.dataset.words.split(","), wi = 0, ci = words[0].length, del = true;
  function tick() {
    var w = words[wi];
    if (del) { ci--; if (ci <= 0) { del = false; wi = (wi + 1) % words.length; ci = 0; } }
    else { ci++; if (ci >= words[wi].length) { del = true; word.textContent = words[wi]; return setTimeout(tick, 1700); } }
    word.textContent = words[wi].slice(0, ci) || "\u00a0";
    setTimeout(tick, del ? 45 : 85);
  }
  if (!reduce) setTimeout(tick, 1700);

  // Terminal typing
  var term = document.getElementById("term");
  var full = term.textContent;
  if (!reduce) {
    var lines = full.split("\n"), out = "", li = 0, k = 0;
    term.textContent = "";
    (function type() {
      if (li >= lines.length) return;
      var line = lines[li], cmd = line.charAt(0) === "$";
      if (k <= line.length) {
        var shown = line.slice(0, k);
        term.innerHTML = esc(out) + (cmd ? '<span class="p">$</span>' + esc(shown.slice(1)) : esc(shown));
        k++;
        return setTimeout(type, cmd ? 55 : 18);
      }
      out += line + "\n"; li++; k = 0;
      setTimeout(type, cmd ? 250 : 120);
    })();
  } else { term.innerHTML = esc(full); }
  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/^\$/gm, "\u0001").replace(/\u0001/g, '<span class="p">$</span>');
  }

  // Mobile menu
  var nav = document.querySelector(".nav"), mb = document.getElementById("menuBtn");
  function setMenu(o) { nav.classList.toggle("open", o); mb.setAttribute("aria-expanded", o); mb.textContent = o ? "Close" : "Menu"; }
  mb.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  document.querySelectorAll("#menu a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  // Copy email
  var btn = document.getElementById("copy");
  btn.addEventListener("click", function () {
    var email = "pratigyadhakal4444@gmail.com";
    if (navigator.clipboard) navigator.clipboard.writeText(email).then(function () {
      btn.textContent = "Copied";
      setTimeout(function () { btn.textContent = "Copy email"; }, 2000);
    });
  });
})();
