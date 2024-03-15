import { FC } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Styles
import './main.scss';

// Components
import { JoinToCall } from '../../shared/modals/join-to-call/join-to-call';

type TMainProps = {};

export const Main: FC<TMainProps> = ({}: TMainProps) => {

  const navigate = useNavigate();

  const createCallHandler = (): void => {
    navigate('/call');
  }

  return (
    <main className="main">
      <div className="main--actions">
        <Button variant="contained" onClick={ createCallHandler }>Create Call</Button>
        <JoinToCall/>
      </div>
    </main>
  );
};
