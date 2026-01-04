const list = document.getElementById("list");

function getData() {
  return JSON.parse(localStorage.getItem("works")) || [];
}

function getNextId() {
  const data = getData();
  if (data.length === 0) return "#GXC001";
  let maxNum = 0;
  data.forEach(w => {
    const num = parseInt(w.id.replace("#GXC", ""));
    if (!isNaN(num) && num > maxNum) maxNum = num;
  });
  return "#GXC" + (maxNum + 1).toString().padStart(3, "0");
}

function updateIdField() {
  const idField = document.getElementById("id");
  if (idField) idField.value = getNextId();
}

function save() {
  const img = document.getElementById("img");
  const cat = document.getElementById("cat");
  const subcat = document.getElementById("subcat");

  if (!img.value || !cat.value || !subcat.value) return alert("Please fill all fields");

  const work = {
    id: getNextId(),
    category: cat.value,
    subcategory: subcat.value,
    image: img.value
  };

  const data = getData();
  data.unshift(work);
  localStorage.setItem("works", JSON.stringify(data));

  img.value = cat.value = subcat.value = "";
  updateIdField();
  render();
  alert("Work published successfully!");
}

function del(i) {
  if (!confirm("Remove this item from portfolio?")) return;
  const data = getData();
  data.splice(i, 1);
  localStorage.setItem("works", JSON.stringify(data));
  render();
}

function render() {
  if (!list) return;
  list.innerHTML = "";
  const data = getData();
  
  if (data.length === 0) {
    list.innerHTML = "<p style='padding: 20px; text-align: center; color: #64748b;'>No items in portfolio.</p>";
    return;
  }

  data.forEach((w, i) => {
    const d = document.createElement("div");
    d.className = "item";
    let preview = "";
    if (w.image.includes("youtube.com") || w.image.includes("youtu.be")) {
      preview = '<i class="fa-brands fa-youtube" style="font-size: 30px; color: #ef4444; width: 60px; text-align: center;"></i>';
    } else {
      preview = `<img src="${w.image}" onerror="this.src='https://placehold.co/100x100?text=Media'">`;
    }
    d.innerHTML = `
      ${preview}
      <div class="item-info">
        <b>${w.id}</b>
        <small>${w.category.replace(/_/g, ' ')} / ${w.subcategory.replace(/_/g, ' ')}</small>
      </div>
      <button class="btn-delete" onclick="del(${i})"><i class="fa-solid fa-trash"></i> Delete</button>
    `;
    list.appendChild(d);
  });
}

async function renderInquiries() {
  const inquiryList = document.getElementById('inquiryList');
  if (!inquiryList) return;
  inquiryList.innerHTML = "<p style='padding: 20px; text-align: center;'>Loading inquiries...</p>";
  
  try {
    const response = await fetch('/api/inquiries');
    const inquiries = await response.json();
    inquiryList.innerHTML = "";
    
    if (inquiries.length === 0) {
      inquiryList.innerHTML = "<p style='padding: 20px; text-align: center; color: #64748b;'>No inquiries received yet.</p>";
      return;
    }
    
    inquiries.forEach((inq) => {
      const date = new Date(inq.created_at).toLocaleString();
      const d = document.createElement("div");
      d.className = "item inquiry-card";
      d.style.flexDirection = "column";
      d.style.alignItems = "flex-start";
      d.innerHTML = `
        <div class="inquiry-header">
          <b style="color: var(--primary); font-size: 16px;">${inq.name}</b>
          <span class="badge badge-new">New</span>
        </div>
        <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px;">
          <i class="fa-solid fa-envelope"></i> ${inq.email} | 
          <i class="fa-solid fa-wallet"></i> Budget: ₹${parseInt(inq.budget).toLocaleString()} | 
          <i class="fa-solid fa-calendar"></i> ${date}
        </div>
        <div class="message-text">${inq.message}</div>
        <button class="btn-delete" onclick="delInquiry(${inq.id})"><i class="fa-solid fa-check"></i> Mark as Resolved</button>
      `;
      inquiryList.appendChild(d);
    });
  } catch (error) {
    inquiryList.innerHTML = "<p style='color: #ef4444; padding: 20px; text-align: center;'>Failed to load inquiries.</p>";
    console.error(error);
  }
}

async function delInquiry(id) {
  if (!confirm("Mark this inquiry as resolved and delete?")) return;
  try {
    const response = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    if (response.ok) renderInquiries();
  } catch (error) {
    alert("Operation failed");
  }
}

function updateSubCats() {
  const cat = document.getElementById("cat").value;
  const sub = document.getElementById("subcat");
  if (!sub) return;
  sub.innerHTML = '<option value="">Select Sub-Category</option>';
  const options = {
    graphic_design: ["Logo Design", "Social Media", "Branding", "UI/UX"],
    video_editing: ["Reels/Shorts", "YouTube Videos", "Commercials", "Documentary"]
  };
  if (options[cat]) {
    options[cat].forEach(o => {
      const opt = document.createElement("option");
      opt.value = o.toLowerCase().replace(/\s/g, "_");
      opt.innerText = o;
      sub.appendChild(opt);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  render();
  updateIdField();
});
