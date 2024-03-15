import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

// Styles
import './app.scss';

// Components
import { Main } from './main/main';
import { Call } from './call/call';
import { Error } from './error/error';

type TAppProps = {};

const App: FC<TAppProps> = ({}: TAppProps) => {
  return (
    <div className="app">
      <Routes>
        <Route path="" element={ <Main/> }/>
        <Route path="call" element={ <Call/> }/>
        <Route path="call/:callId" element={ <Call/> }/>
        <Route path="*" element={ <Error/> }/>
      </Routes>
    </div>
  );
}

export default App;
