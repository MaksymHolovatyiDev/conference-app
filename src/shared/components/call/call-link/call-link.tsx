import { FC } from 'react';
import { Button, Card, CardActions, CardContent, TextField, Typography } from '@mui/material';

// Styles
import './call-link.scss';

type TCallLinkProps = {
  callId: string;
  isSubscriber?: boolean;
};

export const CallLink: FC<TCallLinkProps> = ({
  callId, isSubscriber = false
}: TCallLinkProps) => {
  const callURL = `${ window.location.origin }/call/${ callId }`;

  const copyURLHandler = (): void => {
    try {
      navigator.clipboard?.writeText(callURL);
    } catch (error) {
      console.log('copyHandler', error);
    }
  }

  const copyIdHandler = (): void => {
    if (!callId) return;
    try {
      navigator.clipboard?.writeText(callId);
    } catch (error) {
      console.log('copyHandler', error);
    }
  }

  return (
    <Card className="call-link">
      { !isSubscriber && <div className="call-link--item">
          <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                  Call
              </Typography>
              <Typography variant="body2" color="text.secondary">
                  Share this link so that other users can join you
              </Typography>
          </CardContent>
          <CardActions>
              <TextField label="Call URL" defaultValue={ callURL } variant="outlined"/>
              <Button variant="contained" size="small" onClick={ copyURLHandler }>Copy</Button>
          </CardActions>
      </div> }
      <div className="call-link--item">
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            Your peer id:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Share this id so that other users can call you
          </Typography>
        </CardContent>
        <CardActions>
          <TextField label="Peer ID" defaultValue={ callId } variant="outlined"/>
          <Button variant="contained" size="small" onClick={ copyIdHandler }>Copy</Button>
        </CardActions>
      </div>
    </Card>
  );
};
