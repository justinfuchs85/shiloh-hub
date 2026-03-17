(function(){
  if(document.getElementById('__shiloh_bm__'))return;

  var DB='https://shiloh-way-hub-default-rtdb.firebaseio.com';
  var ROOMS=['Living Room','Kitchen','Primary Bedroom',"Ethan's Room","Elle's Room","Riley's Room",'Bathrooms','Basement','Outdoor / Pool','Garage','Whole Home'];

  function getTitle(){
    var h=(window.location||location).hostname||'';
    if(h.indexOf('amazon.')>-1){
      var amz=['#productTitle','#title span','h1.a-size-large','.product-title-word-break'];
      for(var i=0;i<amz.length;i++){var el=document.querySelector(amz[i]);if(el&&el.textContent.trim())return el.textContent.trim().slice(0,120);}
    }
    var og=document.querySelector('meta[property="og:title"]');
    if(og&&og.content)return og.content.trim().slice(0,120);
    var h1=document.querySelector('h1');
    if(h1&&h1.textContent.trim())return h1.textContent.trim().slice(0,120);
    return document.title.slice(0,120);
  }

  function getPrice(){
    var sels=['.a-price .a-offscreen','#priceblock_ourprice','#priceblock_dealprice','[data-automation="product-price"]','.price','#price','[itemprop="price"]'];
    for(var i=0;i<sels.length;i++){
      var el=document.querySelector(sels[i]);
      if(el){var txt=(el.getAttribute('content')||el.textContent||'').trim();var m=txt.match(/\$[\d,]+\.?\d*/);if(m)return m[0];}
    }
    return '';
  }

  function getImage(){
    // og:image is the most reliable across all retailers
    var og=document.querySelector('meta[property="og:image"],meta[name="og:image"]');
    if(og&&og.content)return og.content;
    // Amazon specific
    var amzImg=document.querySelector('#landingImage,#imgBlkFront,#main-image');
    if(amzImg&&amzImg.src)return amzImg.src;
    // Generic product image
    var schemaImg=document.querySelector('[itemprop="image"]');
    if(schemaImg){var src=schemaImg.getAttribute('content')||schemaImg.src;if(src)return src;}
    return '';
  }

  var title=getTitle();
  var price=getPrice();
  var imgUrl=getImage();
  var store=((window.location||location).hostname||'').replace('www.','');
  var d=document;
  var ov=d.createElement('div');
  ov.id='__shiloh_bm__';
  ov.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483647;background:rgba(10,25,22,0.65);display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,sans-serif;';
  var roomOpts=ROOMS.map(function(r){return'<option>'+r+'</option>';}).join('');

  // Thumbnail preview HTML — only show if we got an image
  var thumbHtml = imgUrl
    ? '<div style="margin-bottom:10px;display:flex;align-items:center;gap:10px;">'
      + '<img src="'+imgUrl+'" style="width:56px;height:56px;object-fit:cover;border-radius:8px;border:1px solid #ddd;flex-shrink:0;" onerror="this.style.display=\'none\'" />'
      + '<div style="font-size:12px;color:#888;line-height:1.4;">Product image<br><span style="font-size:10px;color:#bbb;">from og:image</span></div>'
      + '</div>'
    : '';

  ov.innerHTML='<div style="background:#fff;border-radius:16px;padding:24px;width:340px;max-width:calc(100vw - 32px);box-shadow:0 16px 48px rgba(0,0,0,0.3);">'
  +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
  +'<div style="font-size:16px;font-weight:600;color:#1d5c52;">&#x1F6D2; Save to Shiloh Hub</div>'
  +'<button id="__shc__" style="background:none;border:none;font-size:20px;cursor:pointer;color:#aaa;">&#x2715;</button>'
  +'</div>'
  + thumbHtml
  +'<div style="display:flex;flex-direction:column;gap:10px;">'
  +'<div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#aaa;margin-bottom:3px;">Item name</div>'
  +'<input id="__shn__" value="'+title.replace(/"/g,'&quot;').replace(/'/g,'&#39;')+'" style="width:100%;box-sizing:border-box;font-size:13px;padding:8px 10px;border:1px solid #ddd;border-radius:8px;outline:none;color:#222;" /></div>'
  +'<div style="display:flex;gap:8px;">'
  +'<div style="flex:1;"><div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#aaa;margin-bottom:3px;">Price</div>'
  +'<input id="__shp__" value="'+price+'" placeholder="$0.00" style="width:100%;box-sizing:border-box;font-size:13px;padding:8px 10px;border:1px solid #ddd;border-radius:8px;outline:none;color:#222;" /></div>'
  +'<div style="flex:1;"><div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#aaa;margin-bottom:3px;">Store</div>'
  +'<input id="__shs__" value="'+store+'" style="width:100%;box-sizing:border-box;font-size:13px;padding:8px 10px;border:1px solid #ddd;border-radius:8px;outline:none;color:#222;" /></div>'
  +'</div>'
  +'<div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#aaa;margin-bottom:3px;">Room</div>'
  +'<select id="__shr__" style="width:100%;font-size:13px;padding:8px 10px;border:1px solid #ddd;border-radius:8px;outline:none;color:#222;background:#fff;">'+roomOpts+'</select></div>'
  +'<div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#aaa;margin-bottom:3px;">Priority</div>'
  +'<select id="__shpr__" style="width:100%;font-size:13px;padding:8px 10px;border:1px solid #ddd;border-radius:8px;outline:none;color:#222;background:#fff;">'
  +'<option>Must have</option><option>Nice to have</option><option>Someday</option></select></div>'
  +'<div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#aaa;margin-bottom:3px;">Notes</div>'
  +'<input id="__shno__" placeholder="Optional notes..." style="width:100%;box-sizing:border-box;font-size:13px;padding:8px 10px;border:1px solid #ddd;border-radius:8px;outline:none;color:#222;" /></div>'
  +'<div id="__shst__" style="font-size:12px;color:#aaa;min-height:16px;text-align:center;"></div>'
  +'<button id="__shsv__" style="width:100%;padding:11px;background:#1d5c52;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;">Save to Shopping</button>'
  +'</div></div>';

  d.body.appendChild(ov);
  d.getElementById('__shn__').select();
  d.getElementById('__shc__').onclick=function(){ov.remove();};
  ov.onclick=function(e){if(e.target===ov)ov.remove();};

  d.getElementById('__shsv__').onclick=async function(){
    var btn=d.getElementById('__shsv__');
    var st=d.getElementById('__shst__');
    btn.disabled=true;btn.textContent='Saving...';
    var item={
      id:'si-bm-'+Date.now(),
      name:d.getElementById('__shn__').value.trim(),
      priority:d.getElementById('__shpr__').value,
      status:'Need to buy',
      store:d.getElementById('__shs__').value.trim(),
      priceEst:d.getElementById('__shp__').value.trim(),
      priceActual:'',dims:'',qty:1,assignee:'',
      link:location.href,
      image:imgUrl,
      notes:d.getElementById('__shno__').value.trim(),
      done:false
    };
    var roomName=d.getElementById('__shr__').value;
    try{
      var rooms=await new Promise(function(resolve,reject){
        var xhr=new XMLHttpRequest();
        xhr.open('GET',DB+'/hub/shoppingRooms.json',true);
        xhr.onload=function(){xhr.status>=200&&xhr.status<300?resolve(JSON.parse(xhr.responseText)):reject(new Error('Read failed: '+xhr.status));};
        xhr.onerror=function(){reject(new Error('Network error on read'));};
        xhr.send();
      });
      if(!rooms||!Array.isArray(rooms))throw new Error('Could not read shopping rooms');
      var idx=rooms.findIndex(function(r){return r.name===roomName;});
      if(idx===-1)throw new Error('Room not found: '+roomName);
      if(!Array.isArray(rooms[idx].items))rooms[idx].items=[];
      rooms[idx].items.push(item);
      await new Promise(function(resolve,reject){
        var xhr=new XMLHttpRequest();
        xhr.open('PUT',DB+'/hub/shoppingRooms.json',true);
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.onload=function(){xhr.status>=200&&xhr.status<300?resolve():reject(new Error('Write failed: '+xhr.status));};
        xhr.onerror=function(){reject(new Error('Network error on write'));};
        xhr.send(JSON.stringify(rooms));
      });
      btn.textContent='Saved!';btn.style.background='#2d6b3f';
      st.textContent='Added to '+roomName;st.style.color='#2d6b3f';
      setTimeout(function(){ov.remove();},1400);
    }catch(err){
      btn.disabled=false;btn.textContent='Save to Shopping';
      st.textContent='Error: '+err.message;st.style.color='#c0392b';
    }
  };
})();
