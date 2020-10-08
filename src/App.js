import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, MemoryRouter, Route as RouteRaw, useHistory } from 'react-router-dom';
import { TransitionContext, TransitionProvider } from './utils/transition';
import Main from './components/main';
import Post from './components/post';
import Detail from './components/detail';

const Hidden = ({children}) => {
  return <div style={{
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    overflow: 'hidden',
    visibility: 'hidden',
    opacity: 0.0001
  }}>
    {children}
  </div>
}

const Route = ({component, ...props}) => <RouteRaw {...props} render={_ => <div>{component}</div>} />

const Page = () => <>
  <Route exact path='/' component={<Main />} />
  <Route exact path='/post' component={<Post />} />
  <Route exact path='/detail' component={<Detail />} />
</>

const HistoryObserver = ({memoryHistory, children}) => {
  const history = useHistory();
  const {setState} = useContext(TransitionContext);
  useEffect(() => {
    setState({
      history: {
        browser: history,
        memory: memoryHistory
      }
    })
  }, []);
  return <>{children}</>
}

const BrowserRouterComp = ({children}) => {
  const history = useHistory();
  return <BrowserRouter>
    <HistoryObserver memoryHistory={history}>
      {children}
    </HistoryObserver>
  </BrowserRouter>
}

function App() {
  const [isRender, setIsRender] = useState(false);
  useEffect(() => {
    setTimeout(() => setIsRender(true));
  }, []);
  return <TransitionProvider>
    <MemoryRouter>
      <BrowserRouterComp>
        {isRender && <Page />}
      </BrowserRouterComp>
      {isRender && <Hidden><Page /></Hidden>}
    </MemoryRouter>
  </TransitionProvider>
}

export default App;
