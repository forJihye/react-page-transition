import React, { createContext, useState } from 'react';
import { sleep } from '.';

export const TransitionContext = createContext();
const {Provider, Consumer} = TransitionContext;
export const TransitionProvider = ({...props}) => {
  const [state, setState] = useState({
    history: {
      browser: null,
      memory: null
    }
  });
  return <Provider value={{state, setState: (state) => setState(prevState => Object.assign(prevState, state))}} {...props} />
}

export const Link = ({to, ...props}) => {
  return <Consumer>
    {({state}) => {
      const {history: {browser, memory}} = state;
      const gotoPage = async(ev) => {
        memory.push(to);
        await sleep(1500)
        browser.push(to)
      }
      return <div onClick={gotoPage} {...props} style={{color:'blue',cursor:'pointer'}} />
    }}
  </Consumer>
}