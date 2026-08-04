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
