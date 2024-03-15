import { FC, useRef, ChangeEvent, useState } from 'react';
import { Button, Card, Input } from '@mui/material';
import { Send } from '@mui/icons-material';

// Styles
import './chat.scss';

// Models
import { IChatMessage } from '../../../../interfaces/call.interfaces';

type TCallLinkProps = {
  messages: IChatMessage[];
  onSendMessage?: (message: string) => void
};

export const Chat: FC<TCallLinkProps> = ({
  messages, onSendMessage = () => {}
}: TCallLinkProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
  }

  const onSendMessageHandler = (): void => {
    console.log('inputRef.current', inputValue)
    onSendMessage(inputValue);
  }

  return (
    <Card className="chat">
      <div className="chat--list">
        { !messages.length && 'Empty list' }
        { messages.map(({ text }, idx) => <div key={ idx } className="list-item">{ text }</div>) }
      </div>
      <div className="chat--send">
        <div className="send-input">
          <Input onChange={ onChangeHandler }/>
        </div>
        <div className="send-action">
          <Button disabled={ !inputValue.length } onClick={ onSendMessageHandler } variant="contained">
            <Send/>
          </Button>
        </div>
      </div>
    </Card>
  );
};
