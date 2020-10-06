import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, MemoryRouter, Route, useHistory } from 'react-router-dom';
import Main from './components/main';
import Post from './components/post';
import { TransitionContext, TransitionProvider } from './utils/transition';

const Page = () => <>
  <Route exact path='/' render={_=> <Main />} />
  <Route exact path='/post' render={_=> <Post />} />
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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true)
  }, []);
  return <TransitionProvider>
    <MemoryRouter>
      <BrowserRouterComp>
        {loading && <Page />}
      </BrowserRouterComp>
      {loading && <Page />}
    </MemoryRouter>
  </TransitionProvider>
}

export default App;
