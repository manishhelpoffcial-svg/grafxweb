const grid=document.getElementById("grid");
const content=document.getElementById("content");
const focus=document.getElementById("focus");

const data=JSON.parse(localStorage.getItem("works"))||[];

data.forEach(w=>{
  const d=document.createElement("div");
  d.className=`card ${w.category} ${w.subcategory}`;
  
  if (w.image.includes("youtube.com") || w.image.includes("youtu.be")) {
    // Get Video ID
    let vid = "";
    if (w.image.includes("v=")) vid = w.image.split("v=")[1].split("&")[0];
    else if (w.image.includes("embed/")) vid = w.image.split("embed/")[1].split("?")[0];
    else if (w.image.includes("youtu.be/")) vid = w.image.split("youtu.be/")[1].split("?")[0];
    
    const thumb = `https://img.youtube.com/vi/${vid}/mqdefault.jpg`;
    d.innerHTML=`<div class="video-thumb-container" style="aspect-ratio: 16/9;">
                   <img src="${thumb}" style="height: 100%; object-fit: cover;">
                   <i class="fa-brands fa-youtube video-play-icon"></i>
                 </div>`;
  } else {
    d.innerHTML=`<img src="${w.image}">`;
  }
  
  d.onclick=()=>openFocus(w);
  grid.appendChild(d);
});

const subCats = {
  graphic_design: [
    { name: "Poster", icon: "fa-image" },
    { name: "Logo", icon: "fa-pen-nib" },
    { name: "Thumbnail", icon: "fa-youtube" },
    { name: "Menu Card", icon: "fa-file-invoice" },
    { name: "Business Card", icon: "fa-address-card" }
  ],
  video_editing: [
    { name: "Short Video", icon: "fa-bolt" },
    { name: "Long Video", icon: "fa-film" },
    { name: "Wedding Video", icon: "fa-heart" }
  ]
};

function filter(cat){
  const cards = document.querySelectorAll(".card");
  cards.forEach(c=>{
    c.style.display=cat==="all"||c.classList.contains(cat)?"block":"none";
  });

  const subcatBar = document.getElementById('subcatBar');
  subcatBar.innerHTML = '';
  
  if (cat !== 'all' && subCats[cat]) {
    subCats[cat].forEach(s => {
      const btn = document.createElement('button');
      const sVal = s.name.toLowerCase().replace(/ /g, '_');
      btn.innerHTML = `<i class="fa-solid ${s.icon}"></i> ${s.name}`;
      btn.onclick = () => filterSub(sVal);
      subcatBar.appendChild(btn);
    });
  }
  toggleMenu(false);
}

function filterSub(subcat) {
  document.querySelectorAll(".card").forEach(c=>{
    c.style.display=c.classList.contains(subcat)?"block":"none";
  });
}

function openFocus(w){
  focus.style.display="flex";
  content.classList.add("blur");
  
  const focusImg = document.getElementById("focusImg");
  const focusBox = document.querySelector(".focus-box");
  const focusWA = document.getElementById("focusWA");
  
  // Remove existing iframe if any
  const oldIframe = focusBox.querySelector("iframe");
  if (oldIframe) oldIframe.remove();
  focusImg.style.display = "block";

  if (w.image.includes("youtube.com") || w.image.includes("youtu.be")) {
    let vid = "";
    if (w.image.includes("v=")) vid = w.image.split("v=")[1].split("&")[0];
    else if (w.image.includes("embed/")) vid = w.image.split("embed/")[1].split("?")[0];
    else if (w.image.includes("youtu.be/")) vid = w.image.split("youtu.be/")[1].split("?")[0];
    
    focusImg.style.display = "none";
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${vid}?autoplay=1`;
    iframe.width = "100%";
    iframe.height = "250px";
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.style.borderRadius = "14px";
    focusBox.insertBefore(iframe, focusBox.firstChild);
  } else {
    focusImg.src=w.image;
  }
  
  focusId.innerText=w.id;
  const msg = encodeURIComponent(`Hi, I'm interested in work ID ${w.id}. Can we discuss this?`);
  focusWA.href = `https://wa.me/918918197622?text=${msg}`;
}

function closeFocus(){
  focus.style.display="none";
  content.classList.remove("blur");
  const focusBox = document.querySelector(".focus-box");
  const iframe = focusBox.querySelector("iframe");
  if (iframe) iframe.remove();
}

function toggleMenu(force){
  const m=document.getElementById("menu");
  m.classList.toggle("active",force??!m.classList.contains("active"));
  content.classList.toggle("blur");
}