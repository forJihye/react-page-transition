import React, { useContext, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { TransitionContext } from './transition';

const refCached = f => {
  const store = new Map();
  // console.log('ref store', store);
  return property => store.has(property) ? store.get(property) : store.set(property, f(property)).get(property)
}

const groupStore = new Map;
const RefCreate = refCached((tagName) => {
  const Make = ({to, name, group, preload, children, ...props}) => {
    const el = useRef(null);
    const history = useHistory();
    const {state, setState} = useContext(TransitionContext);
    const {history: {browser, memory}} = state;
    useEffect(() => {
      if(!el) return;
      const {targets} = state;
      if(history === browser){
        name && setState({targets: {...targets, [name]: {...targets[name], browser: el.current}}});
        if(!group) return;
        const [groupName, groupIndex] = group;
        const groupMap = !groupStore.has(groupName) ? groupStore.set(groupName, new Map).get(groupName) : groupStore.get(groupName);
        const targetMap = !groupMap.has(groupIndex) ? groupMap.set(groupIndex, new Map).get(groupIndex) : groupMap.get(groupIndex);
        targetMap.set(name, el.current);
      }else if(history === memory){
        name && setState({targets: {...targets, [name]: {...targets[name], memory: el.current}}});
        preload && state.preload.add(el.current);
      }
    }, [el]);
    const clickHandler = to && (() => {
      const {targets} = state;
      if(!group) return;
      const [groupName, groupIndex] = group;
      const targetName = groupStore.get(groupName);
      const targetGroup = targetName.get(groupIndex);
      const result = {}
      for(let [name, el] of targetGroup){
        Object.assign(result, {[name]: {...targets[name], browser: el}});
      }
      console.log(result);
    });
    return React.createElement(tagName, {ref: el, onClick: clickHandler, ...props} ,children)
  }
  return Make;
})

const RefTarget = RefCreate('section');
export const Ref = new Proxy(RefTarget, {
  get: (target, property) => {
    return RefCreate(property)
  }
});
