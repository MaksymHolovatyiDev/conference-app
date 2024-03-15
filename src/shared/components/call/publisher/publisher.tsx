import { FC, useEffect, useRef } from 'react';
import { Mic, MicOff, Videocam, VideocamOff, NoAccounts } from '@mui/icons-material';
import { DataConnection } from 'peerjs';

// Styles
import './publisher.scss';

type TPublisherProps = {
  mediaStream: MediaStream;
  hasVideoDevice: boolean;
  peerConnection: DataConnection | null;
  videoOn: boolean;
  audioOn: boolean;
  setVideoOn: (data: boolean)=>void;
  setAudioOn: (data: boolean)=>void;
};

export const Publisher: FC<TPublisherProps> = ({ 
  mediaStream, 
  hasVideoDevice,
  peerConnection, 
  videoOn, 
  audioOn,
  setVideoOn,
  setAudioOn 
}: TPublisherProps) => {
  const videoRef = useRef<HTMLVideoElement & { srcObject: any }>(null);

  const initPublisher = (): void => {
    if (videoRef.current) 
      videoRef.current.srcObject = mediaStream;
  }

  const toggleMicro = (state: boolean): void => {
    const audioTracks = mediaStream.getAudioTracks();
    audioTracks.forEach(track => {
      track.enabled = state;
    });

    setAudioOn(state);

    peerConnection?.send({
      type: 'mute',
      data: {
        user: '',
        state
      }
    });
  }

  const toggleCamera = (state: boolean): void => {
    if (!hasVideoDevice) return;
    const videoTracks = mediaStream.getVideoTracks();
    videoTracks.forEach(track => {
      track.enabled = state;
    });

    setVideoOn(state);

    peerConnection?.send({
      type: 'video',
      data: {
        user: '',
        state
      }
    });
  }

  useEffect(() => {
    initPublisher();
  }, [videoRef.current]);

  return (
    <div className="publisher">
      <video muted ref={ videoRef } autoPlay={ true } hidden={ !videoOn }></video>
      { (!hasVideoDevice || !videoOn) && <div className="publisher--empty">
          <NoAccounts/>
      </div> }
      <div className="publisher--actions">
        <div className="actions-item" onClick={ () => toggleMicro(!audioOn) }>
          { audioOn ? <Mic/> : <MicOff/> }
        </div>
        {hasVideoDevice &&
          <div className="actions-item" onClick={ () => toggleCamera(!videoOn) }>
            { videoOn ? <Videocam/> : <VideocamOff/> }
          </div>
        }
      </div>
    </div>
  );
};
