import { FC, Fragment, ChangeEvent, useState } from 'react';
import { Button, FormControl, Input, Modal } from '@mui/material';

// Styles
import './join-to-call.scss';
import { useNavigate } from 'react-router-dom';

type TJoinToCallProps = {};

export const JoinToCall: FC<TJoinToCallProps> = ({}: TJoinToCallProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [callURL, setCallURL] = useState<string>('');
  const [errorURL, setErrorURL] = useState<string>('');

  const navigate = useNavigate();

  const joinToCallHandler = (): void => {
    const regex = new RegExp(`^${window.location.origin}/call/[a-zA-Z0-9]+$`);
    if (!callURL || !regex.test(callURL)) {
      setErrorURL('Error URL');
      return;
    }

    navigate(callURL);
  }

  const onValueChanges = (event: ChangeEvent<HTMLInputElement>): void => {

    setCallURL(event.target.value);
  }

  const toggleOpenModal = (): void => {
    setOpenModal((prevState) => !prevState);
  }

  return (
    <Fragment>
      <Button variant="outlined" onClick={ toggleOpenModal }>Join To Call</Button>
      <Modal
        className={ 'join-to-call' }
        open={ openModal }
        onClose={ toggleOpenModal }
      >
        <div className={ 'join-to-call--body' }>
          <div className={ 'body-item body-item--title' }>
            Join To Call
          </div>
          <FormControl className={ 'body-item' } error={ !!errorURL }>
            <Input placeholder={ 'Call ID' } defaultValue={ callURL } onChange={ onValueChanges }/>
          </FormControl>
          <div className="body-item body-item--actions">
            <Button variant="outlined" onClick={ toggleOpenModal }>Close</Button>
            <Button variant="contained" onClick={ joinToCallHandler }>Join</Button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};
