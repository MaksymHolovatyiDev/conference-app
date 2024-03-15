import { FC, useEffect, useRef } from 'react';
import { Mic, MicOff, Videocam, VideocamOff, NoAccounts } from '@mui/icons-material';

// Styles
import './subscriber.scss';

type TSubscriberProps = {
  mediaStream: MediaStream;
  remoteVideoOn: boolean;
  remoteAudioOn: boolean;
};

export const Subscriber: FC<TSubscriberProps> = ({ mediaStream, remoteVideoOn, remoteAudioOn }: TSubscriberProps) => {
  const videoRef = useRef<HTMLVideoElement & { srcObject: any }>(null);

  const initSubscriber = (): void => {
    if (videoRef.current)
      videoRef.current.srcObject = mediaStream;
  }

  useEffect(() => {
    initSubscriber();
  }, [videoRef.current]);

  return (
    <div className="subscriber">
      <video ref={ videoRef } autoPlay={ true } />
      { !remoteVideoOn && <div className="subscriber--empty">
          <NoAccounts/>
      </div> }
      <div className="subscriber--actions">
        <div className="actions-item">
          { remoteAudioOn ? <Mic/> : <MicOff/> }
        </div>
        <div className="actions-item">
          { remoteVideoOn ? <Videocam/> : <VideocamOff/> }
        </div>
      </div>
    </div>
  );
};
