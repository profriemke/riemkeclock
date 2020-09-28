const scrnClock=1;
const scrnDate=2;
const GBNotification=3;
const digits= [[1,1,1,0,1,1,1],[0,0,1,0,0,1,0],[1,0,1,1,1,0,1],[1,0,1,1,0,1,1],[0,1,1,1,0,1,0],[1,1,0,1,0,1,1],[1,1,0,1,1,1,1],[1,0,1,0,0,1,0],[1,1,1,1,1,1,1],[1,1,1,1,0,1,1]];
  const digitPositionsX=[0,5,60,135,190];
var state={"screen":scrnClock, "subscreen":0, "onsecond":"clock", "color":0,"data":{}, "clockDots":false};
var handleSecondClock;
var handleSecondChime;
var b = Graphics.createArrayBuffer(240,192,1,{msb:true});
const color = new Uint16Array([0x0000,0x333a],0,1);
var n=[];
// clock functions

function writeCircles(){
  const date=new Date();
  const sec=date.getSeconds();
   //b.clearRect(0, 142, 240,240); 
  if (sec==0){
    b.clearRect(0, 142, 240,240); 
  }
  if (sec<=10) {
    b.fillCircle(35, 152, sec);
  } else {
       b.fillCircle(35, 152, 10);
       if (sec<=20) {
         b.fillCircle(65, 152, sec-10);
       } else {
         b.fillCircle(65, 152, 10);
         if (sec<=30) {
           b.fillCircle(95, 152, sec-20);
         } else {
           b.fillCircle(95, 152, 10);
           if (sec<=40) {
             b.fillCircle(135, 152, sec-30);
           } else {
             b.fillCircle(135, 152, 10);
             if (sec<=50) {
               b.fillCircle(165, 152, sec-40);
             } else {
               b.fillCircle(165, 152, 10);
               if (sec<=60) {
                 b.fillCircle(195, 152, sec-50);
               } else {
                 b.fillCircle(195, 152, 10);
               }
             }
           }
         }
       }
   }
}
function writeDigit(digit, position)
{
    const posx=digitPositionsX[position];
    if(digit[0]==1)
      b.fillRect(posx,0, posx+45, 13);
    if(digit[1]==1)
      b.fillRect(posx,0,posx+13, 50);
    if(digit[2]==1)
      b.fillRect(posx+32, 0, posx+45, 50);
    if(digit[3]==1)
      b.fillRect(posx,50, posx+45, 63);
    if(digit[4]==1)
      b.fillRect(posx,50, posx+13, 100);
    if(digit[5]==1)
      b.fillRect(posx+32,50,posx+45, 113);
    if(digit[6]==1)
      b.fillRect(posx, 100, posx+45, 113);
}

function writeTime(){
    var m1;
    var m2;
    var h1;
    var h2;
    var d=new Date();
    var m=d.getMinutes();
    var mStr=m.toString();
    if (mStr.length==1)
    {   
        m1=0;
        m2=m;
    } else {
      m1=mStr[0];
      m2=mStr[1];
    }
    m=d.getHours();
    mStr=m.toString();
    if (mStr.length==1)
    {
        h1=0;
        h2=m;
    } else {
      h1=mStr[0];
      h2=mStr[1];
    }
    b.clearRect(0,0,240,113);
    writeDigit(digits[m2],4);
    writeDigit(digits[m1],3);
    writeDigit(digits[h2],2);
    writeDigit(digits[h1],1); 
  }

  function writeClockDots(){

    if (state.clockDots==false){
        b.fillRect(115, 35, 122, 50);
        b.fillRect(115, 65 , 122, 80);
        state.clockDots=true;
    } else {
        b.clearRect(115, 35, 122, 50);
        b.clearRect(115, 65 , 122, 80);
        state.clockDots=false;
    }
  }

  function writeDate(){
    var m=process.memory();
    var m1=0;
    var m2=0;
    var d1=0;
    var d2=0;
    var sp;
    var date= new Date();
    var mStr=date.getMonth()+1;

    if (mStr.toString().length==1)
    {
        m2=Number(mStr);
    } else {
      sp=mStr.toString().split("");
      m1=sp[0];
      m2=sp[1];
    }
    mStr=date.getDate();
    if (mStr.toString().length==1)
    {
      d2=Number(mStr);
    } else {
      sp=mStr.toString().split("");
      d1=sp[0];
      d2=sp[1];
    }
    b.clearRect(0, 0, 240,192); 
    b.fillRect(115, 100 , 125, 110);
    writeDigit(digits[m2],4);
    writeDigit(digits[m1],3);
    writeDigit(digits[d2],2);
    writeDigit(digits[d1],1);
    b.setFontAlign(0,0); 
    b.setFont("Vector",20); 
    b.drawString(require('locale').dow(new Date()),120,145); 
    b.setFontAlign(-1,0); 
    b.setFont("Vector",15); 
    b.drawString(E.getTemperature().toFixed(1)+" C",5,175); 
    var mem=m.usage*100/m.total;
    b.drawString("mem: "+mem.toFixed(0),70,175); 
    b.drawString("bat: "+E.getBattery().toFixed(0)+" %",160,175);
    g.drawImage({width:240,height:190,bpp:1,buffer:b.buffer, palette: color},0,48);
}

// launch touchlauncher

function launchApps () {
  if (handleSecondClock) {
    clearInterval(handleSecondClock);
    handleSecondClock=undefined;
  }
  console.log("State: launchApps "+state.data.menuIndex);
  load("trglnch.js");
}

// general setup and timers

function clockUpdate() {
  if (state.screen==scrnClock){
    const d=new Date();
    writeClockDots();
    writeCircles();
    if (d.getSeconds()=="0"){
      writeTime();
    }
    g.drawImage({width:240,height:190,bpp:1,buffer:b.buffer, palette: color},0,48);
  }
}

function chime(){
  const d=new Date();
  if ((d.getHours()>6)  && (d.getHours()<23)){
    if ((d.getMinutes()=="0") && (d.getSeconds()=="0")){
        Bangle.buzz().then(()=>{
          });
        }
  }
}

function handleUserEventBTN5() {
    console.log("BTN5 "+state.screen);
    if(state.screen==scrnClock){
        console.log("switch to: DATE");
        state.screen=scrnDate;
        clearInterval(handleSecondClock);
        handleSecondClock=undefined;
        writeDate();
        g.drawImage({width:240,height:190,bpp:1,buffer:b.buffer, palette: color},0,48);
        return;
    }
    if(state.screen==scrnDate){
        console.log("switch to: CLOCK");
        state.screen=scrnClock;
        state.clockDots=false;
        handleSecondClock = setInterval(clockUpdate,1000);
        writeTime();
        b.clearRect(0, 130, 240,240); 
        writeCircles();
        g.drawImage({width:240,height:190,bpp:1,buffer:b.buffer, palette: color},0,48);
        return;
    }
    if(state.screen==GBNotification){
        console.log("switch to: CLOCK");
        state.screen=scrnClock;
        state.clockDots=false;
        handleSecondClock = setInterval(clockUpdate,1000);
        writeTime();
        writeCircles();
      g.drawImage({width:240,height:190,bpp:1,buffer:b.buffer, palette: color},0,48);
        return;
    }
}

function handleUserEventBTN4() {
    console.log("BTN4 "+state.screen);
    if(state.screen==scrnDate){
      console.log("switch to: CLOCK");
      state.screen=scrnClock;
      state.clockDots=false;
      handleSecondClock = setInterval(clockUpdate,1000);
      writeTime();
      b.clearRect(0, 130, 240,240); 
      writeCircles();
      g.drawImage({width:240,height:190,bpp:1,buffer:b.buffer, palette: color},0,48);
      return;
  }
     if(state.screen==scrnClock){
      console.log("switch to: APP Lnch");
      clearInterval(handleSecondClock);
      handleSecondClock=undefined;
      launchApps();
      return;
    }
}

function handleUserEventBTN1() {
  console.log("BTN1 NRF "+state.screen);
    try { NRF.wake(); } catch (e) { }
    const s=require('Storage');
    settings=s.readJSON('setting.json', 1);
    console.log(settings);
    if(settings.ble==true) {
      settings.ble=false;
      try { NRF.sleep(); } catch (e) { }
    } else {
      settings.ble=true;
      try { NRF.wake(); } catch (e) { }
    }
    s.write('setting.json', settings);
  console.log(state.screen);
}

function handleUserEventBTN3() {
  console.log("BTN3 "+state.screen);
  if(state.screen==scrnClock){
  }
}

Bangle.on('lcdPower',on=>{
  if (on) {
      // nothing
    }

   else {
    // nothing
  }
});

Bangle.loadWidgets();
Bangle.drawWidgets();
b.setColor(1);
writeTime();
writeCircles();
g.drawImage({width:240,height:190,bpp:1,buffer:b.buffer, palette: color},0,48);
state.screen=scrnClock;
handleSecondClock = setInterval(clockUpdate,1000);
handleSecondChime = setInterval(chime,1000);
setWatch(handleUserEventBTN1, BTN1, {edge:"falling", debounce:50, repeat:true});
setWatch(launchApps, BTN2, {edge:"falling", debounce:50, repeat:true});
setWatch(handleUserEventBTN3, BTN3, {edge:"falling", debounce:50, repeat:true});
setWatch(handleUserEventBTN4, BTN4, {edge:"falling", debounce:50, repeat:true});
setWatch(handleUserEventBTN5, BTN5, {edge:"falling", debounce:50, repeat:true});