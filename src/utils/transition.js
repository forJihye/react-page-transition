import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { tween , styler } from 'popmotion';
import { sleep } from '.';

const refCached = f => {
  const store = new Map();
  return property => store.has(property) ? store.get(property) : store.set(property, f(property)).get(property)
}

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

const groupStore = new Map;
const RefCompFactory = refCached((tagName) => {
  const Make = ({to, name, group, preload, seed, children, ...props}) => {
    const el = useRef(null);
    const history = useHistory();
    const {state, setState} = useContext(TransitionContext);
    const {history: {browser, memory}} = state;
    useEffect(() => {
      if(!el) return;
      const {targets} = state;
      if(history === browser){
        name && setState({targets: {...targets, [name]: {...targets[name], browser: el.current}}});
        if(group){
          const [groupName, groupIndex] = group;
          const groupMap = !groupStore.has(groupName) ? groupStore.set(groupName, new Map).get(groupName) : groupStore.get(groupName);
          const targetMap = !groupMap.has(groupIndex) ? groupMap.set(groupIndex, new Map).get(groupIndex) : groupMap.get(groupIndex);
          targetMap.set(name, el.current);
        }
      }else if(history === memory){
        name && setState({targets: {...targets, [name]: {...targets[name], memory: el.current}}});
        preload && state.preload.add(el.current);
      }
    }, [el]);

    const clickHandler = to && (async() => {
      const {targets} = state;
      if(group){
        const [groupName, groupIndex] = group;
        const targetName = groupStore.get(groupName);
        const targetGroup = targetName.get(groupIndex);
        const result = {}
        for(let [name, el] of targetGroup){
          Object.assign(result, {[name]: {...targets[name], browser: el}});
        }
        setState({targets: Object.assign(targets, result)});
        pushNextPage(to, seed, state)();
      }
    });
    return React.createElement(tagName, {ref: el, onClick: clickHandler, ...props} ,children)
  }
  return Make;
});

const RefTarget = RefCompFactory('section');
export const Ref = new Proxy(RefTarget, {
  get: (target, property) => {
    return RefCompFactory(property)
  }
});

let lock = false;
const pushNextPage = (to, seed, state) => {
  const {history: {browser, memory}} = state;
  return async() => {
    if(lock) return;
    lock = true;
    memory.push(to);
    await sleep(0);
    await Promise.all([...state.preload].map(el => checkTagPreload(el)));
    await setTransition(to, seed, state);
    state.preload.clear();
    browser.push(to);
    lock = false;
  }
}

const setTransition = async(to, seed, state) => {
  if(seed === 'pushPage'){
    await gotoFadeInOutPage(to, state);
  }else if(seed === 'pushDetail'){
    await gotoPostDetail(state.targets);
  }
}

const gotoFadeInOutPage = async(to, state) => {
  const {targets} = state;
  let current = null;
  let next = null;
  switch(to){
    case '/': 
      next = targets['main-page'].memory;
      current = targets['post-page'].browser;
    break;
    case '/post':
      next = targets['post-page'].memory;
      current = targets['main-page'].browser;
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

const gotoPostDetail = async(targets) => {
  const listEl = targets['post-list'].browser;
  const fromEl = targets['post-img'].browser;
  const toEl = targets['detail-img'].memory;
  const from = fromEl.getBoundingClientRect();
  const to = toEl.getBoundingClientRect();

  const placeholder = Object.assign(document.createElement('div'), {style:`width: ${from.width}px; height: ${from.height}px; background: transparent;`});
  fromEl.parentNode.replaceChild(placeholder, fromEl);

  Object.assign(fromEl.style, {width: from.width+'px', height: from.height+'px', position: 'absolute', left: from.left+'px', top: from.top+'px'});
  fixed.append(fromEl);
  fixed.show();

  return new Promise(res => {
    tween({duration: 1000}).start(v => styler(listEl).set('opacity', 1-v));
    tween({
      from: {x: 0, y: 0, width: from.width, height: from.height},
      to: {x: to.x-from.x, y: to.y-from.y, width: to.width, height: to.height},
      duration: 1000
    }).start({
      update: v => styler(fromEl).set(v),
      complete: () => {
        fixed.remove(fromEl);
        fixed.hide();
        res();
      }
    });
  })  
}

export const Link = ({to, seed, ...props}) => {
  return <Consumer>
    {({state}) => <a {...props} onClick={pushNextPage(to, seed, state)} style={{color:'blue',cursor:'pointer'}} />}
  </Consumer>
}

export const checkTagPreload = el => {
  switch(el.tagName){
    case 'IMG': return new Promise(res => el.complete ? res() : el.onload = () => res());
    case 'VIDEO': return new Promise(res => {
      el.muted = true;
      const play = el.play();
      play && play.then(() => {
        el.pause();
        el.currentTime = 0;
      })
      el.oncanplay = res();
      el.onerror = res();
    });
  }
}

let groupUid = 0;
export const groupRef = (groupUid, index) => (refName) => ({group: [groupUid, index], name: refName});
export const groupRefMap = (array, f) => {
  const current = 'group-'+groupUid++;
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