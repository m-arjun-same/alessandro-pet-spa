/* Alessandro Pet Spa — own engines: groom-wipe slider, two-worlds expander,
   treatment accordion, spa-day timeline draw, booking form. */
(function(){
"use strict";
var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- smooth scroll (Lenis, vendored) ---------- */
var lenis = null;
if (window.Lenis && !reduced){
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  window.__lenis = lenis;
  function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
}
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener("click", function(e){
    var id = a.getAttribute("href");
    if (id.length > 1){
      var el = document.querySelector(id);
      if (el){ e.preventDefault(); if (lenis) lenis.scrollTo(el, {offset:-70}); else el.scrollIntoView({behavior:"smooth"}); }
    }
  });
});

/* ---------- header state ---------- */
var hdr = document.getElementById("hdr");
function onScroll(){ hdr.classList.toggle("is-solid", window.scrollY > window.innerHeight * 0.82); }
window.addEventListener("scroll", onScroll, {passive:true}); onScroll();

/* ---------- reveals + timeline draw + counter (GSAP) ---------- */
if (window.gsap && window.ScrollTrigger && !reduced){
  gsap.registerPlugin(ScrollTrigger);
  if (lenis) lenis.on("scroll", ScrollTrigger.update);
  gsap.utils.toArray(".rv").forEach(function(el){
    gsap.to(el, { opacity:1, y:0, duration:1.05, ease:"power3.out",
      scrollTrigger:{ trigger:el, start:"top 88%" } });
  });
  gsap.to("#tlFill", { scaleY:1, ease:"none",
    scrollTrigger:{ trigger:"#timeline", start:"top 75%", end:"bottom 55%", scrub:0.6 } });
  var big = document.querySelector(".trust__big span[data-count]");
  if (big){
    var target = parseFloat(big.getAttribute("data-count")), obj = { v:0 };
    gsap.to(obj, { v:target, duration:1.6, ease:"power2.out",
      scrollTrigger:{ trigger:big, start:"top 85%" },
      onUpdate:function(){ big.textContent = obj.v.toFixed(1); } });
  }
} else {
  document.documentElement.classList.add("no-anim");
  var f = document.getElementById("tlFill"); if (f) f.style.transform = "scaleY(1)";
  var b = document.querySelector(".trust__big span[data-count]"); if (b) b.textContent = "4.7";
}

/* ---------- THE GROOM WIPE — rest shows BEFORE only; drag wipes the groomed AFTER in over it ---------- */
var ba = document.getElementById("ba");
if (ba){
  var pos = 0, dragging = false;
  function setPos(p){
    pos = Math.max(0, Math.min(100, p));
    ba.style.setProperty("--pos", pos + "%");
    ba.setAttribute("aria-valuenow", Math.round(pos));
  }
  function fromEvent(e){
    var r = ba.getBoundingClientRect();
    return ((e.clientX - r.left) / r.width) * 100;
  }
  ba.addEventListener("pointerdown", function(e){ dragging = true; ba.classList.add("is-touched"); try{ ba.setPointerCapture(e.pointerId); }catch(_){} setPos(fromEvent(e)); });
  ba.addEventListener("pointermove", function(e){ if (dragging) setPos(fromEvent(e)); });
  ["pointerup","pointercancel"].forEach(function(ev){ ba.addEventListener(ev, function(){ dragging = false; }); });
  ba.addEventListener("keydown", function(e){
    if (e.key === "ArrowLeft"){ ba.classList.add("is-touched"); setPos(pos - 4); e.preventDefault(); }
    if (e.key === "ArrowRight"){ ba.classList.add("is-touched"); setPos(pos + 4); e.preventDefault(); }
  });
  setPos(0);
}

/* ---------- TWO WORLDS expander ---------- */
var worlds = document.querySelectorAll("[data-world]");
worlds.forEach(function(w){
  function open(){ worlds.forEach(function(x){ x.classList.toggle("is-open", x === w); }); }
  w.addEventListener("mouseenter", function(){ if (window.innerWidth > 900) open(); });
  w.addEventListener("click", open);
});

/* ---------- TREATMENT MENU ---------- */
var SERVICES = [
  ["Dog Grooming","Dogs","Haircuts, nail trimming, ear cleaning and styling — breed-specific cuts as well as custom styles based on your preferences, finished so your dog leaves looking fabulous and feeling comfortable."],
  ["Cat Grooming","Cats","Haircuts, nail trimming, ear cleaning and detangling, with the gentle handling cats require — a stress-free experience for even the most finicky felines."],
  ["Dog Bathing","Dogs","Standard baths, medicated baths for skin conditions, and flea & tick baths to keep your dog clean and pest-free, with gentle bathing techniques throughout."],
  ["Cat Bathing","Cats","Standard baths, medicated baths for skin issues, and flea & tick baths — each cat handled with care for a gentle, stress-free bath."],
  ["Nail Trimming & Filing","Dogs & cats","Regular nail care that prevents overgrowth and maintains proper foot health, reducing the risk of discomfort and injury."],
  ["Ear Cleaning","Dogs & cats","Thorough inspection and gentle cleaning to prevent infections and mites, keeping ears healthy and free from irritation."],
  ["Teeth Brushing & Dental","Dogs & cats","Oral hygiene care that helps prevent dental disease, reduces bad breath, and keeps teeth and gums healthy."],
  ["De-Shedding Treatments","Dogs & cats","Treatments designed to remove loose fur and reduce shedding — a healthier coat for them, a cleaner home for you."],
  ["Flea & Tick Treatments","Dogs & cats","Treatments that effectively eliminate fleas and ticks and provide preventative care to keep them at bay."],
  ["Puppy & Kitten Grooming","First visits","Young pets are introduced to grooming in a gentle, positive manner, so they develop good grooming habits early on."]
];
var list = document.getElementById("menuList");
if (list){
  SERVICES.forEach(function(s, i){
    var row = document.createElement("div"); row.className = "mrow";
    row.innerHTML = '<button class="mrow__head" aria-expanded="false">' +
      '<span class="mrow__no">' + String(i+1).padStart(2,"0") + '</span>' +
      '<span class="mrow__name"></span>' +
      '<span class="mrow__for"></span>' +
      '<span class="mrow__plus">+</span></button>' +
      '<div class="mrow__body"><p></p></div>';
    row.querySelector(".mrow__name").textContent = s[0];
    row.querySelector(".mrow__for").textContent = s[1];
    row.querySelector(".mrow__body p").textContent = s[2];
    list.appendChild(row);
  });
  list.addEventListener("click", function(e){
    var head = e.target.closest(".mrow__head"); if (!head) return;
    var row = head.parentElement, body = row.querySelector(".mrow__body"), open = row.classList.contains("is-open");
    list.querySelectorAll(".mrow.is-open").forEach(function(r){
      r.classList.remove("is-open"); r.querySelector(".mrow__body").style.maxHeight = "0px";
      r.querySelector(".mrow__head").setAttribute("aria-expanded","false");
    });
    if (!open){ row.classList.add("is-open"); body.style.maxHeight = body.scrollHeight + "px"; head.setAttribute("aria-expanded","true"); }
  });
}

/* ---------- BOOKING FORM ---------- */
var form = document.getElementById("bookForm");
if (form){
  var dateInput = form.querySelector('input[name="date"]');
  if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var fd = new FormData(form);
    var owner = (fd.get("owner")||"").toString().trim(),
        phone = (fd.get("phone")||"").toString().trim(),
        pet = (fd.get("pet")||"").toString().trim(),
        species = (fd.get("species")||"Dog").toString(),
        service = (fd.get("service")||"").toString(),
        date = (fd.get("date")||"").toString(),
        err = document.getElementById("formErr");
    var missing = [];
    if (!owner) missing.push("your name");
    if (!phone) missing.push("a phone number");
    if (!pet) missing.push("your pet's name");
    if (!service) missing.push("a service");
    if (missing.length){
      err.hidden = false;
      err.textContent = "Almost — we still need " + missing.join(", ") + ".";
      return;
    }
    err.hidden = true;
    var notes = (fd.get("notes")||"").toString().trim();
    var body = ["Appointment request from the website","",
      "Name: " + owner, "Phone: " + phone, "Pet: " + pet + " (" + species + ")",
      "Service: " + service, "Preferred day: " + (date || "First available"),
      "Notes: " + (notes || "—")].join("\n");
    var mail = "mailto:alessandropetspa@yahoo.com"
      + "?subject=" + encodeURIComponent("Appointment request — " + pet + " · " + service)
      + "&body=" + encodeURIComponent(body);
    document.getElementById("doneText").textContent =
      "Thanks, " + owner.split(" ")[0] + " — your email app should open with this request addressed to the spa. Press Send there, and we'll call you on " + phone + " to confirm " + pet + "'s appointment.";
    var sum = document.getElementById("doneSum");
    sum.innerHTML = "";
    [["Pet", pet + " (" + species + ")"], ["Service", service], ["Preferred day", date || "First available"], ["We call", phone]].forEach(function(pair){
      var d = document.createElement("div");
      var dt = document.createElement("dt"); dt.textContent = pair[0];
      var dd = document.createElement("dd"); dd.textContent = pair[1];
      d.appendChild(dt); d.appendChild(dd); sum.appendChild(d);
    });
    form.hidden = true;
    document.getElementById("bookDone").hidden = false;
    window.location.href = mail;
  });
  document.getElementById("againBtn").addEventListener("click", function(){
    form.reset(); form.hidden = false;
    document.getElementById("bookDone").hidden = true;
  });
}
})();
