const toggle=document.querySelector('.nav-toggle');const links=document.querySelector('.nav-links');if(toggle&&links){toggle.addEventListener('click',()=>{const open=links.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));}

document.addEventListener('DOMContentLoaded',()=>{
  const track=document.querySelector('.client-track');
  const logos=track?.querySelectorAll('.client-logo');
  if(!track||!logos||logos.length<2)return;

  const loopLength=Math.floor(logos.length/2);
  let step=0;

  const cardDistance=()=>{
    const first=logos[0].getBoundingClientRect();
    const second=logos[1].getBoundingClientRect();
    return second.left-first.left;
  };

  window.setInterval(()=>{
    step+=1;
    track.style.transition='transform 520ms ease-in-out';
    track.style.transform=`translateX(-${step*cardDistance()}px)`;

    if(step>=loopLength){
      window.setTimeout(()=>{
        track.style.transition='none';
        track.style.transform='translateX(0)';
        step=0;
      },540);
    }
  },1000);
});


// Keep decorative muted videos playing where browser policy allows it.
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('video.autoplay-video').forEach(video=>{
    video.muted=true;
    video.defaultMuted=true;
    video.playsInline=true;
    const play=()=>video.play().catch(()=>{});
    play();
    video.addEventListener('canplay',play,{once:true});
  });
});


// Gallery progressive loading: images after the initial batch are not requested until Load More.
document.addEventListener('DOMContentLoaded',()=>{
  const items=[...document.querySelectorAll('[data-gallery-item]')];
  const button=document.querySelector('[data-gallery-load]');
  const count=document.querySelector('[data-gallery-count]');
  if(!items.length||!button)return;
  const batch=6;
  const reveal=()=>{
    const hidden=items.filter(item=>item.hidden).slice(0,batch);
    hidden.forEach(item=>{
      const img=item.querySelector('img[data-src]');
      if(img){ img.loading='eager'; img.src=img.dataset.src; img.removeAttribute('data-src'); }
      item.hidden=false;
    });
    const visible=items.filter(item=>!item.hidden).length;
    if(count) count.textContent=String(visible);
    if(visible>=items.length) button.parentElement.hidden=true;
  };
  button.addEventListener('click',reveal);
});


// Gallery popup with zoom controls.
document.addEventListener('DOMContentLoaded',()=>{
  const lightbox=document.querySelector('[data-gallery-lightbox]');
  const lightboxImg=document.querySelector('[data-gallery-lightbox-img]');
  if(!lightbox||!lightboxImg)return;
  const closeBtn=document.querySelector('[data-gallery-close]');
  const zoomIn=document.querySelector('[data-gallery-zoom-in]');
  const zoomOut=document.querySelector('[data-gallery-zoom-out]');
  const zoomReset=document.querySelector('[data-gallery-zoom-reset]');
  const zoomLabel=document.querySelector('[data-gallery-zoom-label]');
  let zoom=1;
  const applyZoom=()=>{lightboxImg.style.transform=`scale(${zoom})`; if(zoomLabel) zoomLabel.textContent=`${Math.round(zoom*100)}%`;};
  const open=(img)=>{
    const src=img.getAttribute('src')||img.dataset.src;
    if(!src)return;
    lightboxImg.src=src;
    lightboxImg.alt=img.alt||'Foto gallery PT Tiga Laksana Jaya';
    zoom=1; applyZoom();
    lightbox.hidden=false;
    document.body.classList.add('lightbox-open');
  };
  const close=()=>{lightbox.hidden=true; document.body.classList.remove('lightbox-open'); lightboxImg.removeAttribute('src');};
  document.querySelectorAll('.gallery-open').forEach(btn=>btn.addEventListener('click',()=>{
    const img=btn.querySelector('img');
    if(img?.dataset.src && !img.getAttribute('src')){ img.loading='eager'; img.src=img.dataset.src; img.removeAttribute('data-src'); }
    if(img) open(img);
  }));
  closeBtn?.addEventListener('click',close);
  lightbox.addEventListener('click',event=>{if(event.target===lightbox) close();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!lightbox.hidden) close();});
  zoomIn?.addEventListener('click',()=>{zoom=Math.min(3,zoom+.25); applyZoom();});
  zoomOut?.addEventListener('click',()=>{zoom=Math.max(.5,zoom-.25); applyZoom();});
  zoomReset?.addEventListener('click',()=>{zoom=1; applyZoom();});
});
