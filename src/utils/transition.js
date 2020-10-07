import React, { createContext, useState } from 'react';
import { tween , styler } from 'popmotion';
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

const pushNextPage = (to, state, seed) => {
  const {history: {browser, memory}} = state;
  return async() => {
    if(lock) return;
    lock = true;
    memory.push(to);
    await Promise.all([...state.preload].map(el => checkTagPreload(el)));
    await setTransition(to, state, seed);
    state.preload.clear();
    browser.push(to);
    lock = false;
  }
}

const setTransition = async(to, state, seed) => {
  if(seed === 'pushPage'){
    await gotoFadeInOutPage(to, state)
  }
}

const gotoFadeInOutPage = async(to, state) => {
  const {targets} = state;
  let current = null;
  let next = null;
  switch(to){
    case '/': 
      next = targets.main.memory;
      current = targets.image.browser;
    break;
    case '/image':
      next = targets.image.memory;
      current = targets.main.browser;
    break
  }
  fixed.append(next);
  tween({duration: 1000}).start(v => {
    styler(current).set('opacity', 1-v);
    styler(next).set('opacity', v)
  });
  fixed.show();
  await sleep(1000);
  fixed.remove(next);
  fixed.hide();
}

let lock = false;
export const Link = ({to, seed, ...props}) => {
  return <Consumer>
    {({state}) => <a onClick={pushNextPage(to, state, seed)} {...props} style={{color:'blue',cursor:'pointer'}} />}
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