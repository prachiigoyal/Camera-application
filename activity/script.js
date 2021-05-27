let videoRecorder=document.querySelector("#record-video");
let videoElem=document.querySelector("#video-elem");
let captureBtn=document.querySelector("#capture");
let timmingElem=document.querySelector("#timming");
let allFilters=document.querySelectorAll(".filter");
let uiFilter=document.querySelector(".ui-filter");
let zoomInElem=document.querySelector(".fa-plus");
let zoomOutElem=document.querySelector(".fa-minus");
let zoomLevel=1;
let filterColor="";
let clearObj;
      let constraints={
          video:true,
          audio:true
      }  
      let mediaRecorder;
      let buffer=[];
      navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream){
          videoElem.srcObject=mediaStream;
        mediaRecorder=new MediaRecorder(mediaStream);
        mediaRecorder.addEventListener("dataavailable",function(e){
            buffer.push(e.data);
        })
        mediaRecorder.addEventListener("stop",function(){
            let blob=new Blob(buffer,{type:"video/mp4"});
            const url=window.URL.createObjectURL(blob);
            addMediaToDB(url,"video")
            // let a=document.createElement("a");
            // a.download="file.mp4";
            // a.href=url;
            // a.click();
        })
      }).catch(function(err){
          console.log(err);
      })
      let recordState=false;
      videoRecorder.addEventListener("click",function(){
          if(!mediaRecorder){
              alert("First allow permission");
              return;
          }
          if(recordState==false){
              mediaRecorder.start();
              videoRecorder.classList.add("record-animation");
              startCounting();
              recordState=true;
          }else{
              mediaRecorder.stop();
              videoRecorder.classList.remove("record-animation");
              stopCounting();
              recordState=false;
          }
      })

captureBtn.addEventListener("click",function(){
    let canvas=document.createElement("canvas");
    canvas.width=videoElem.videoWidth;
    canvas.height=videoElem.videoHeight;
    let tool=canvas.getContext("2d");
    captureBtn.classList.add("capture-animation");
    tool.scale(zoomLevel,zoomLevel)
    let x=(canvas.width/zoomLevel-canvas.width)/2;
    let y=(canvas.height/zoomLevel-canvas.height)/2;
    tool.drawImage(videoElem,x,y);
    if(filterColor){
        tool.fillStyle=filterColor;
        tool.fillRect(0,0,canvas.width,canvas.height);
    }
    let link=canvas.toDataURL();
    addMediaToDB(link,"img");
    // let anchor=document.createElement("a");
    // anchor.download="file.png";
    // anchor.href=link;
    // anchor.click();
    // anchor.remove();
    // canvas.remove();
    setTimeout(() => {
        captureBtn.classList.remove("capture-animation");
    }, 1000);
})
function startCounting(){
    timmingElem.classList.add("timming-active");
    let timeCount=0;
    clearObj=setInterval(function(){
        let seconds=(timeCount%60)<10?`0${Number.parseInt(timeCount%60)}`:`${Number.parseInt(timeCount%60)}`;
        let minutes=(timeCount/60)<10?`0${Number.parseInt(timeCount/60)}`:`${Number.parseInt(timeCount/60)}`;
        let hours=(timeCount/3600)<10?`0${Number.parseInt(timeCount/3600)}`:`${Number.parseInt(timeCount/3600)}`;
        timmingElem.innerText=`${hours}:${minutes}:${seconds}`;
        timeCount++;

    },1000);
}
function stopCounting(){
    timmingElem.classList.remove("timming-active");
    timmingElem.innerText="00:00:00";
    clearInterval(clearObj);
}
for(let i=0;i<allFilters.length;i++){
    allFilters[i].addEventListener("click",function(){
        let color=allFilters[i].style.backgroundColor;
        if(color){
            uiFilter.classList.add("ui-filter-active");
            uiFilter.style.backgroundColor=color;
            filterColor=color;
        }else{
            uiFilter.classList.remove("ui-filter-active");
            uiFilter.style.backgroundColor="";
            filterColor="";
        }
    })
}
zoomInElem.addEventListener("click",function(){
    if(zoomLevel<3){
        zoomLevel+=0.2;
        videoElem.style.transform=`scale(${zoomLevel})`;
    }
})
zoomOutElem.addEventListener("click",function(){
    if(zoomLevel>1){
        zoomLevel-=0.2;
        videoElem.style.transform=`scale(${zoomLevel})`;
    }
})