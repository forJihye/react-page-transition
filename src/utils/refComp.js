import React, { useContext, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { TransitionContext } from './transition';

const refCached = f => {
  const store = new Map();
  console.log('ref store', store)
  return property => store.has(property) ? store.get(property) : store.set(property, f(property)).get(property)
}

const RefCreate = refCached((tagName) => {
  const Make = ({name, children, ...props}) => {
    const el = useRef();
    const history = useHistory();
    const {state, setState} = useContext(TransitionContext);
    const {history: {browser, memory}} = state;
    useEffect(() => {
      if(!el) return;
      if(history === browser){
      
      }else if(history === memory){
      
      }
    }, [el]);
    return React.createElement(tagName, {ref: el, ...props} ,children)
  }
  return Make;
})

const RefTarget = RefCreate('section');
export const Ref = new Proxy(RefTarget, {
  get: (target, property) => {
    return RefCreate(property)
  }
});
