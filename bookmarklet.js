(function(){
  if (document.getElementById('__shiloh_bm__')) return;

  const DB = 'https://shiloh-way-hub-default-rtdb.firebaseio.com';
  const ROOMS = ['Living Room','Kitchen','Primary Bedroom',"Ethan's Room","Elle's Room","Riley's Room",'Bathrooms','Basement','Outdoor / Pool','Garage','Whole Home'];

  function getTitle() {
    const h = (window.location||location).hostname||"";
    if (h.includes('amazon.')) {
      const amz = ['#productTitle','#title span','h1.a-size-large','.product-title-word-break'];
      for (const s of amz) { const el = document.querySelector(s); if (el && el.textContent.trim()) return el.textContent.trim().slice(0,120); }
    }
    const og = document.querySelector('meta[property="og:title"]');
    if (og && og.content) return og.content.trim().slice(0,120);
    const h1 = document.querySelector('h1');
    if (h1 && h1.textContent.trim()) return h1.textContent.trim().slice(0,120);
    return (document.querySelector('[itemprop="name"]')?.textContent?.trim() || document.title).slice(0,120);
  }

  function getPrice() {
    const selectors = ['.a-price .a-offscreen','#priceblock_ourprice','#priceblock_dealprice','[data-automation="product-price"]','.price','#price','[itemprop="price"]'];
    for (const s of selectors) {
      const el = document.querySelector(s);
      if (el) {
        const txt = (el.getAttribute('content') || el.textContent || '').trim();
        const match = txt.match(/\$[\d,]+\.?\d*/);
        if (match) return match[0];
      }
    }
    return '';
  }

  const title = getTitle();
  const price = getPrice();
  const store = ((window.location||location).hostname||"").replace('www.','');

  const overlay = document.createElement('div');
  overlay.id = '__shiloh_bm__';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483647;background:rgba(10,25,22,0.65);display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;';

  overlay.innerHTML = `
    <div style="background:#fff;border-radius:16px;padding:24px;width:340px;max-width:calc(100vw - 32px);box-shadow:0 16px 48px rgba(0,0,0,0.3);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <div style="font-size:16px;font-weight:600;color:#1d5c52;">🛒 Save to Shiloh Hub</div>
        <button id="__shiloh_close__" style="background:none;border:none;font-size:20px;cursor:pointer;color:#aaa;line-height:1;">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div>
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#aaa;margin-bottom:3px;">Item name</div>
          <input id="__shiloh_name__" value="${title.replace(/"/g,'&quot;')}" style="width:100%;box-sizing:border-box;font-size:13px;padding:8px 10px;border:1px solid #ddd;border-radius:8px;outline:none;color:#222;" />
        </div>
        <div style="display:flex;gap:8px;">
          <div style="flex:1;">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#aaa;margin-bottom:3px;">Price</div>
            <input id="__shiloh_price__" value="${price}" placeholder="$0.00" style="width:100%;box-sizing:border-box;font-size:13px;padding:8px 10px;border:1px solid #ddd;border-radius:8px;outline:none;color:#222;" />
          </div>
          <div style="flex:1;">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#aaa;margin-bottom:3px;">Store</div>
            <input id="__shiloh_store__" value="${store}" style="width:100%;box-sizing:border-box;font-size:13px;padding:8px 10px;border:1px solid #ddd;border-radius:8px;outline:none;color:#222;" />
          </div>
        </div>
        <div>
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#aaa;margin-bottom:3px;">Room</div>
          <select id="__shiloh_room__" style="width:100%;font-size:13px;padding:8px 10px;border:1px solid #ddd;border-radius:8px;outline:none;color:#222;background:#fff;">
            ${ROOMS.map(r=>`<option>${r}</option>`).join('')}
          </select>
        </div>
        <div>
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#aaa;margin-bottom:3px;">Priority</div>
          <select id="__shiloh_priority__" style="width:100%;font-size:13px;padding:8px 10px;border:1px solid #ddd;border-radius:8px;outline:none;color:#222;background:#fff;">
            <option>Must have</option><option>Nice to have</option><option>Someday</option>
          </select>
        </div>
        <div>
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#aaa;margin-bottom:3px;">Notes</div>
          <input id="__shiloh_notes__" placeholder="Optional notes…" style="width:100%;box-sizing:border-box;font-size:13px;padding:8px 10px;border:1px solid #ddd;border-radius:8px;outline:none;color:#222;" />
        </div>
        <div id="__shiloh_status__" style="font-size:12px;color:#aaa;min-height:16px;text-align:center;"></div>
        <button id="__shiloh_save__" style="width:100%;padding:11px;background:#1d5c52;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;">Save to Shopping</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.getElementById('__shiloh_name__').select();

  document.getElementById('__shiloh_close__').onclick = () => overlay.remove();
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };

  document.getElementById('__shiloh_save__').onclick = async () => {
    const btn = document.getElementById('__shiloh_save__');
    const status = document.getElementById('__shiloh_status__');
    btn.disabled = true; btn.textContent = 'Saving…';
    try {
      const resp = await fetch(`${DB}/hub/shoppingRooms.json`);
      const rooms = await resp.json();
      if (!rooms || !Array.isArray(rooms)) throw new Error('Could not read shopping rooms');
      const roomName = document.getElementById('__shiloh_room__').value;
      const roomIdx = rooms.findIndex(r => r.name === roomName);
      if (roomIdx === -1) throw new Error(`Room "${roomName}" not found`);
      if (!Array.isArray(rooms[roomIdx].items)) rooms[roomIdx].items = [];
      rooms[roomIdx].items.push({
        id: 'si-bm-' + Date.now(),
        name: document.getElementById('__shiloh_name__').value.trim(),
        priority: document.getElementById('__shiloh_priority__').value,
        status: 'Need to buy',
        store: document.getElementById('__shiloh_store__').value.trim(),
        priceEst: document.getElementById('__shiloh_price__').value.trim(),
        priceActual: '', dims: '', qty: 1, assignee: '', link: (window.location||location).href,
        notes: document.getElementById('__shiloh_notes__').value.trim(),
        done: false,
      });
      const put = await fetch(`${DB}/hub/shoppingRooms.json`, {
        method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(rooms),
      });
      if (!put.ok) throw new Error('Write failed: ' + put.status);
      btn.textContent = '✓ Saved!'; btn.style.background = '#2d6b3f';
      status.textContent = `Added to ${roomName}`; status.style.color = '#2d6b3f';
      setTimeout(() => overlay.remove(), 1400);
    } catch(err) {
      btn.disabled = false; btn.textContent = 'Save to Shopping';
      status.textContent = '✕ ' + err.message; status.style.color = '#c0392b';
    }
  };
})();
