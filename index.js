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
        endCall();
      });

      currentcall = call;
}






// function  callUser(){
  
// const peerID = document.querySelector("input").value;

//   var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// getUserMedia({video: true, audio: true}, function(stream) {
//   var call = peer.call(peerID, stream);
//   call.on('stream', function(remoteStream) {
//     // Show stream in some video/canvas element.
//     // Switch to video call and switch the camera preview
//     document.getElementById("menu").style.display = "none";
//     document.getElementById("live").style.display = "block"; 
//     document.getElementById("local-video").srcObject = stream;
//     document.getElementById("local-video").play();
//   });
// }, function(err) {
//   console.log('Failed to get local stream' ,err);
// });

// }


peer.on("call", (call) => {
    if(confirm(`Accept call from  ${call.peer} ? `)){
        navigator.mediaDevices.getUserMedia({
            video: true, audio: true
                }).then( (stream) => {
                    document.querySelector("#local-video").srcObject = stream;
                    document.querySelector("#local-video").play();
                    
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

    }
    else{
        // User rejected the call
        call.close();
    }
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
  }