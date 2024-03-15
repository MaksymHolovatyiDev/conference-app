import { FC, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CallEnd } from '@mui/icons-material';
import { DataConnection, MediaConnection, Peer } from 'peerjs';

// Styles
import './call.scss';

// Components
import { Publisher } from '../../shared/components/call';
import { Subscriber } from '../../shared/components/call/subscriber/subscriber';
import { CallLink } from '../../shared/components/call/call-link/call-link';
import { Chat } from '../../shared/components/call/chat/chat';

// Models
import { IChatMessage } from '../../interfaces/call.interfaces';

type TCallProps = {};

export const Call: FC<TCallProps> = ({}: TCallProps) => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [hasVideoDevice, setHasVideoDevice] = useState<boolean>(false);

  const peerInstance = useRef<Peer | null>(null);
  const peerConnection = useRef<DataConnection | null>(null);
  const [peerCall, setPeerCall] = useState<MediaConnection | null>(null);
  const [currentPeerId, setCurrentPeerId] = useState<string | null>(null);

  const [videoOn, setVideoOn] = useState<boolean>(true);
  const [audioOn, setAudioOn] = useState<boolean>(true);

  const [remoteVideoOn, setRemoteVideoOn] = useState<boolean>(true);
  const [remoteAudioOn, setRemoteAudioOn] = useState<boolean>(true);

  const [messages, setMessages] = useState<IChatMessage[]>([]);

  const { callId } = useParams<{ callId?: string }>();
  const navigate = useNavigate();

  const returnToMain = (): void => {
    navigate('/');
  }

  const onDataReceive = (data: any) => {
    switch(data?.type){
      case "disconnect":
        setRemoteStream(null);
        break;
      case "video":
        setRemoteVideoOn(data?.data?.state);
        break;
      case "mute":
        setRemoteAudioOn(data?.data?.state);
        break;
      case 'message':
        setMessages(prevState => [data.data, ...prevState]);
    }
  }

  const connectToCall = (): void => {
    if (!mediaStream || !callId || !peerInstance.current) return;

    const conn = peerInstance.current?.connect(callId);

    peerConnection.current = conn;
    
    conn.on('data', onDataReceive);
    
    const call = peerInstance.current.call(callId, mediaStream, {metadata: {type: "screenSharing", data: mediaStream },});
    setPeerCall(call);
    
    call.on("stream", (remoteStream:MediaStream) => {
      // Show stream in some <video> element.
      setRemoteStream(remoteStream);
    });
  }

  const createPeer = (): void => {
    if (!mediaStream) return;

    const peer = new Peer({
      host: 'localhost',
      port: 8000,
      path: '/peer',
    });

    peerInstance.current = peer;

    peer.on('open', (id:string) => {
      console.log('My peer ID is: ' + id);
      setCurrentPeerId(id);
    });

    peer.on('connection', (conn: any) => {
      peerConnection.current = conn;
      conn.on('data', onDataReceive);
    });

    peer.on('call', (call:any) => {
      call.answer(mediaStream);

      console.log("M", call); 

      call.on("stream", (remoteStream: MediaStream) => {
        // Show stream in some <video> element.
        setRemoteStream(remoteStream);
      });
    });
  }

  const destroyEntities = (): void => {
    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
    }

    peerConnection.current?.send({
      type: 'disconnect',
    });

    if (peerCall) {
      peerCall.close();
    }
    if (peerInstance.current) {
      peerInstance.current.disconnect();
      peerInstance.current.destroy();
    }
  }

  const endCallHandler = (): void => {
    destroyEntities();
    returnToMain();
  }

  const onSendMessageHandler = (message: string): void => {
    if (!peerConnection.current) return;
    const data: IChatMessage = {
      text: message,
      user: currentPeerId as string,
      created_at: new Date().toISOString()
    };
    peerConnection.current?.send({
      type: 'message',
      data
    });
    setMessages(prevState => [data, ...prevState]);
  }

  const checkCameraConnected = (): Promise<any> => {
    return new Promise(async (res) => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        res(!!videoDevices.length);
      } catch (error) {
        res(false);
      }
    });
  }

  const getMediaStream = async (): Promise<void> => {
    if (!navigator.mediaDevices.getUserMedia) {
      console.log("User Media not supported");
      return;
    }

    const hasVideo = await checkCameraConnected();
    setHasVideoDevice(hasVideo);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: hasVideo, audio: true });
      setMediaStream(stream);
    } catch (error) {
      console.log("Stream not created", error);
      returnToMain();
    }
  }

  useEffect(() => {
    if (!callId || !peerInstance.current) return;
    connectToCall();
  }, [callId, peerInstance.current]);

  useEffect(() => {
    createPeer();
  }, [mediaStream]);

  useEffect(() => {
    getMediaStream();

    return () => {
      destroyEntities();
    }
  }, []);

  return (
    <div className="call">

      <div className="call--link">
        { (!!currentPeerId) && <CallLink callId={ currentPeerId } isSubscriber={ !!callId }/> }
      </div>

      <div className="call--body">
           <div className="body--publisher">
          { mediaStream && <Publisher hasVideoDevice={ hasVideoDevice } mediaStream={ mediaStream }
                                      peerConnection={ peerConnection.current } videoOn={videoOn} audioOn={audioOn}
                                      setVideoOn={setVideoOn} setAudioOn={setAudioOn}/> }
        </div>
        <div className="body--subscriber">
          { remoteStream && <Subscriber mediaStream={ remoteStream } remoteVideoOn={remoteVideoOn} remoteAudioOn={remoteAudioOn}/> }
        </div>
      </div>

      <div className="call--chat">
        <Chat messages={ messages } onSendMessage={ onSendMessageHandler }/>
      </div>

      <div className="call--actions">
        <div className="actions-item end-call" onClick={ endCallHandler }>
          <CallEnd/>
        </div>
      </div>
    </div>
  );
};
