import React, { createContext, useState } from 'react';
import { sleep } from '.';

export const TransitionContext = createContext();
const {Provider, Consumer} = TransitionContext;
export const TransitionProvider = ({...props}) => {
  const [state, setState] = useState({
    history: {
      browser: null,
      memory: null
    },
    targets: {},
    preload: new Set
  });
  return <Provider value={{state, setState: (state) => setState(prevState => Object.assign(prevState, state))}} {...props} />
}

const pushNextPage = (to, seed, state) => {
  const {history: {browser, memory}, targets} = state;
  return async() => {
    if(lock) return;
    lock = true;
    memory.push(to);
    await Promise.all([...state.preload].map(el => checkTagPreload(el)));
    browser.push(to);
    targets.preload.clear();
    lock = false;
  }
}

let lock = false;
export const Link = ({to, seed, ...props}) => {
  return <Consumer>
    {({state}) => <a onClick={pushNextPage(to, seed, state)} {...props} style={{color:'blue',cursor:'pointer'}} />}
  </Consumer>
}

export const checkTagPreload = el => {
  switch(el.tagName){
    case 'IMG': return new Promise(res => el.complete ? res() : el.onload = () => res());
    case 'VIDEO': 
    break;
  }
}

let groupUid = 0;
export const groupRef = (groupUid, index) => refName => ({group: [groupUid, index], name: refName});
export const groupRefMap = (array, f) => {
  const current = 'group'+groupUid++;
  return array.map((item, i) => f(item, i, groupRef(current, i)));
}

export const fixed = (() => {
  const el = Object.assign(document.createElement('div'), {style: `position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: 10; display: none`})
  document.body.prepend(el);
  return {
    show: () => el.style.display = 'block',
    hide: () => el.style.display = 'none',
    append: child => el.appendChild(child),
    remove: child => el.removeChild(child),
    replace: (prev, next) => el.replaceChild(prev, next)
  }
})();