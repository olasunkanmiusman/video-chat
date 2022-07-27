 const peer = new Peer(); 
var currentcall;
peer.on('open',function(id){
    document.getElementById("uuid").textContent = id;
});


async function callUser(){
// Get Id value from input
const peerID = document.querySelector("input").value;

    // Grab the camera and mic
    const stream = await navigator.mediaDevices.getUserMedia({
video: true, audio: true
    });

    // Switch to video call and switch the camera preview
    document.getElementById("menu").style.display = "none";
    document.getElementById("live").style.display = "block"; 
    document.getElementById("local-video").srcObject = stream;
    document.getElementById("local-video").play();

    // make the call
    const call = peer.call(peerID,stream);
    call.on("stream",(stream) =>  {document.getElementById("remote-video").srcObject = stream;
document.getElementById("remote-video").play();
}
    );
    call.on("data", (stream) => {
        document.querySelector("#remote-video").srcObject = stream;
      });
      
      call.on("error", (err) => {
        console.log(err);
      });

      call.on("close", () => {
        endCall(); location.reload();
      });

      call.on('calloff', function(){
        // location.reload();
        console.log("Call off");
      });

      currentcall = call;
}




 
var pickupcall = false;

//  answer call
peer.on("call", (call) => {
  document.getElementById("pickUp").style.display = "block";
  var audio =  document.getElementById("myaudio");
 audio.play();  

//  Stop call if there is no response
 var StopCall = setTimeout(() => {
  if(pickupcall === true){
    clearTimeout(StopCall);
  }
  else{
    
    call.emit("calloff");
    call.close();
  location.reload();
  }
},10000);
 var pick = document.getElementById("pick"); 
 pick.addEventListener('click',function(){
pickupcall = true;
  navigator.mediaDevices.getUserMedia({
    video: true, audio: true
        }).then( (stream) => {
            document.querySelector("#local-video").srcObject = stream;
            document.querySelector("#local-video").play();
            
          // Stop Ring tone
audio.pause();


        //   Answer the call
        call.answer(stream);

        // Save the close function
        currentcall = call;

        // Change the video veiw
        document.querySelector("#menu").style.display = "none";
document.querySelector("#live").style.display = "block";
call.on("stream", (remoteStream) => {
    // when we receive the remote stream, play it
    document.getElementById("remote-video").srcObject = remoteStream;
    document.getElementById("remote-video").play();
  });
        }).catch( (err) => {
            console.log(`Failed to get local stream ${err}`);
        });

 });
 var reject = document.getElementById("reject"); 
 reject.addEventListener('click',function(){
  pickupcall = true;
  call.close(); audio.pause(); location.reload();
 });
 
});


function endCall() {
    // Go back to the menu
    document.querySelector("#menu").style.display = "block";
    document.querySelector("#live").style.display = "none";
  // If there is no current call, return
    if (!currentcall) return;
  // Close the call, and reset the function
    try {
      currentcall.close();
    } catch {}
    currentcall = undefined;
    location.reload();
  }