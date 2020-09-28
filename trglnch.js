
var menuIndex;
var apps;
var b = Graphics.createArrayBuffer(240,192,1,{msb:true});
const color = new Uint16Array([0x0000,0xC618],0,1);

function showApps() { 
var s=require("Storage");
  if(menuIndex==undefined) {
    console.log("State: showApps-load");
    menuIndex=0;
    apps = s.list(/\.info$/).map(app=>{var a=s.readJSON(app,1);return a&&{name:a.name,type:a.type,icon:a.icon,sortorder:a.sortorder,src:a.src}}).filter(app=>app && (app.type=="app" || app.type=="clock" || !app.type));
    apps.sort((a,b)=>{
      var n=(0|a.sortorder)-(0|b.sortorder);
      if (n) return n; 
      if (a.name<b.name) return -1;
      if (a.name>b.name) return 1;
      return 0;
     });
    apps.unshift({name:"Enable BLE", icon: "false"});
   
  }
  if(menuIndex>=apps.length) {
    console.log("State: showApps-end of apps - activate clock");

    
    load("trg.js");
    return;
  }
  b.clearRect(0, 30, 240,240);
  b.setFont("Vector",20);
  b.setFontAlign(0,0);
  b.setColor("#38a7d6");
  console.log("State: showApps-showitem "+menuIndex);  
  if (menuIndex==0) {
    console.log("State: showApps-BLE settings ");7
    var settings = s.readJSON('setting.json', 1);
    if (settings.ble==true) {
      b.drawString("Disable BLE",120, 100);
    } else {
      b.drawString("Enable BLE",120, 100);
    }
    b.drawString("next",40,170);
    b.drawString("select",200,170);
    console.log(settings.ble);
  } else {
    b.drawString(apps[menuIndex].name,120, 100);
    b.drawString("next",40,170);
    b.drawString("select",200,170);
    if (apps[menuIndex].icon) 
      icon = s.read(apps[menuIndex].icon);
    if (icon) 
      try {b.drawImage(icon,100,20);} catch(e){console.log(e);}
  }
  g.drawImage({width:240,height:190,bpp:1,buffer:b.buffer, palette: color},0,48);
}
function launchApps () {
  console.log("State: lauchApps "+menuIndex);
  if (menuIndex==0){
    try { NRF.wake(); } catch (e) { }
    const s=require('Storage');
    settings=s.readJSON('setting.json', 1);
    if (settings==undefined) {
    const storage = require('Storage');
    console.log("SETTING ERR");
    }
      
    console.log(settings.ble);
    if(settings.ble==true) {
      settings.ble=false;
      try { NRF.sleep(); } catch (e) { }
    } else {
      settings.ble=true;
      try { NRF.wake(); } catch (e) { }
    }
    console.log(settings);
    s.write('setting.json', settings);
    load("trg.js");
    return;
  }
  const app=apps[menuIndex].src;
  console.log(app);
  load(app);
}
function handleUserEventBTN4(){
 menuIndex++;
  showApps();
}
function handleUserEventBTN5(){

  launchApps();
}
function handleUserEventBTN1(){

  load("trg.js");
}

setWatch(handleUserEventBTN1, BTN3, {edge:"falling", debounce:50, repeat:true});
setWatch(handleUserEventBTN4, BTN4, {edge:"falling", debounce:50, repeat:true});
setWatch(handleUserEventBTN5, BTN5, {edge:"falling", debounce:50, repeat:true});
setWatch(handleUserEventBTN1, BTN1, {edge:"falling", debounce:50, repeat:true});
g.clear();
Bangle.loadWidgets();
Bangle.drawWidgets();
showApps();
load("trg.js");