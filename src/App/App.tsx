import React from "react";
import "./App.css";

const App: React.FC = (props) => {
  let videoRef = React.createRef<HTMLVideoElement>();
  let remoteRef = React.createRef<HTMLVideoElement>();
  let textRef = React.createRef<HTMLTextAreaElement>();

  const pc_config = {
    iceServers: [
      {
        urls: "stun: [ip]:[port]",
        credential: "credential",
        username: "username",
      },
    ],
  };
  const pc = new RTCPeerConnection(pc_config);

  React.useEffect(() => {
    let options = {
      video: true,
      audio: true,
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log(JSON.stringify(e.candidate));
      }
    };

    pc.onicegatheringstatechange = (e) => {
      console.log(e);
    };

    pc.ontrack = (e) => {
      if (remoteRef.current) {
        remoteRef.current.srcObject = e.streams[0];
      }
    };

    const success = (stream: MediaStream) => {
      let node = videoRef.current;
      if (node) {
        node.srcObject = stream;
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });
      }
    };
    const onError = (err: any) => {
      console.log(err);
    };

    window.navigator.getUserMedia(options, success, onError);
  }, []);

  // const handleCreateOffer = () => {
  //   pc.createOffer({ offerToReceiveVideo: 1 }).then(
  //     (sdp) => {
  //       pc.setLocalDescription(sdp);
  //     },
  //     (e) => {}
  //   );
  // };

  return (
    <>
      <div className="flex-row">
        <video className="video-element" ref={videoRef} autoPlay />
        <video className="video-element" ref={remoteRef} autoPlay />
      </div>
      <textarea ref={textRef}></textarea>
      {/* <button onClick={handleCreateOffer}>Offer</button>
      <button onClick={handleCreateAnswer}>Answer</button> */}
    </>
  );
};

export default App;
