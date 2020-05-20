import React from "react";
import "./App.css";

const App: React.FC = (props) => {
  let videoRef = React.createRef<HTMLVideoElement>();
  let remoteRef = React.createRef<HTMLVideoElement>();
  let textRef = React.createRef<HTMLTextAreaElement>();

  const [text, setText] = React.useState("");

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

  const handleCreateOffer = () => {
    pc.createOffer({ offerToReceiveVideo: true }).then(
      (sdp) => {
        console.log(JSON.stringify(sdp));
        pc.setLocalDescription(sdp);
      },
      (e) => {}
    );
  };

  const setRemoteDescription = () => {
    const desc = JSON.parse(text);
    pc.setRemoteDescription(new RTCSessionDescription(desc));
  };

  const createAnswer = () => {
    pc.createAnswer({ offerToReceiveVideo: true }).then(
      (sdp) => {
        console.log(JSON.stringify(sdp));
        pc.setLocalDescription(sdp);
      },
      (e) => {}
    );
  };

  const addCandidate = () => {
    const candidate = JSON.parse(text);
    console.log("adding Candidate", candidate);
    pc.addIceCandidate(new RTCIceCandidate(candidate));
  };

  return (
    <>
      <div className="flex-row">
        <video className="video-element" ref={videoRef} autoPlay />
        <video className="video-element" ref={remoteRef} autoPlay />
      </div>
      <button onClick={handleCreateOffer}>Offer</button>
      <button onClick={createAnswer}>Answer</button>
      <br />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <br />
      <button onClick={setRemoteDescription}>Set Remote Description</button>
      <button onClick={addCandidate}>Add Candidate</button>
    </>
  );
};

export default App;
