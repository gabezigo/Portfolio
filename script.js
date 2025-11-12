
/* ===== Mobile drawer with animated icon & smooth slide ===== */
(() => {
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  const toggle = () => {
    burger.classList.toggle('open');
    drawer.classList.toggle('open');
    drawer.setAttribute('aria-hidden', !drawer.classList.contains('open'));
  };
  burger.addEventListener('click', toggle);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open'); drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true');
  }));
})();

/* ===== Hero autoplay (reliable) ===== */
(() => {
  const v = document.getElementById('heroVid');
  if (!v) return;
  const tryPlay = () => v.play().catch(()=>{});
  if (v.readyState >= 2) tryPlay(); else v.addEventListener('canplay', tryPlay, {once:true});
})();

/* ===== Lazy-load & autoplay visible video thumbs; pause offscreen ===== */
(() => {
  const vids = [...document.querySelectorAll('video[data-src]')];
  if (!('IntersectionObserver' in window)) {
    vids.forEach(v=>{ v.src = v.dataset.src; v.load(); v.play().catch(()=>{}); });
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        if (!v.src) v.src = v.dataset.src;
        v.load(); v.play().catch(()=>{});
      } else { v.pause(); }
    });
  }, { rootMargin: '150px 0px' });
  vids.forEach(v => io.observe(v));
})();

/* ===== Carousel + Modal ===== */
(() => {
  const track = document.getElementById('projTrack');
  const left  = document.querySelector('.arrow.left');
  const right = document.querySelector('.arrow.right');
  const modal = document.getElementById('videoModal');
  const mvid  = document.getElementById('modalVideo');
  const close = document.getElementById('closeModal');

  left?.addEventListener('click', ()=> track.scrollBy({left:-350, behavior:'smooth'}));
  right?.addEventListener('click',()=> track.scrollBy({left: 350, behavior:'smooth'}));

  track.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('click', ()=>{
      const src = card.dataset.video;
      if(!src) return;
      mvid.src = src;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden','false');
      mvid.play().catch(()=>{});
    });
  });

  const closeModal = ()=>{
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    mvid.pause(); mvid.currentTime=0; mvid.removeAttribute('src');
  };
  close.addEventListener('click', closeModal);
  modal.addEventListener('click', e=>{ if(e.target===modal) closeModal(); });
  window.addEventListener('keydown', e=>{ if(e.key==='Escape' && modal.classList.contains('open')) closeModal(); });

  // drag-to-scroll (desktop)
  let down=false, startX=0, sLeft=0;
  track.addEventListener('mousedown', e=>{ down=true; startX=e.pageX; sLeft=track.scrollLeft; track.style.cursor='grabbing'; e.preventDefault(); });
  window.addEventListener('mouseup', ()=>{ down=false; track.style.cursor='auto'; });
  track.addEventListener('mousemove', e=>{ if(!down) return; track.scrollLeft = sLeft - (e.pageX - startX)*1.2; });
})();

/* ===== Animate skill bars on first view ===== */
(() => {
  const bars = document.querySelectorAll('.bar');
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.bar-fill').forEach(f=> f.style.width = getComputedStyle(f).getPropertyValue('--w') || '80%');
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        const fill = en.target.querySelector('.bar-fill');
        const w = getComputedStyle(fill).getPropertyValue('--w') || '80%';
        requestAnimationFrame(()=> fill.style.width = w );
        io.unobserve(en.target);
      }
    });
  }, {threshold:.35});
  bars.forEach(b=>io.observe(b));
})();

/* ===== Contact form (AJAX + inline success message) ===== */
(() => {
  const form = document.querySelector(".form");
  if (!form) return;
  const status = document.getElementById("form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const btn = form.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Sending...";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        form.reset();
        status.textContent = "✅ Message sent successfully!";
        status.classList.remove("error");
        status.classList.add("success", "show");
        setTimeout(() => status.classList.remove("show", "success", "error"), 4000);
      } else {
        status.textContent = "❌ Something went wrong. Please try again.";
        status.classList.remove("success");
        status.classList.add("error", "show");
      }
    } catch {
      status.textContent = "⚠️ Network error. Please try again.";
      status.classList.remove("success");
      status.classList.add("error", "show");
    }

    btn.disabled = false;
    btn.textContent = "Send Message";
  });
})();

