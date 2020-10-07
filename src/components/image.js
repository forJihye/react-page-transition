import React, { useEffect, useRef, useState } from 'react';
import { tween , styler } from 'popmotion';
import { Link, checkTagPreload, fixed } from '../utils/transition';
import { Ref } from '../utils/refComp';

const imageMoving = async(from, to) => {
  const fromRect = from.getBoundingClientRect();
  const toRect = to.getBoundingClientRect();
  const {width, height, transform, right, bottom, top, left} = to.style;
  const placeholder = Object.assign(document.createElement('div'), {style: `
    position: absolute; width: ${toRect.width}px; height: ${toRect.height}px right: 0; bottom: 0;`
  });
  to.parentNode.replaceChild(placeholder, to);
  Object.assign(to.style, {right: 'auto', bottom: 'auto', left: `${fromRect.x}px`, top: `${fromRect.y}px`, opacity: 1});
  fixed.append(to);
  fixed.show();
  tween({
    from: {x: 0, y: 0, width: fromRect.width, height: fromRect.height, opacity: 1},
    to: {x: toRect.x-fromRect.x, y: toRect.y-fromRect.y, width: toRect.width, height: toRect.height, opacity: 0},
    duration: 2000
  }).start(v => styler(from).set(v));
  tween({
    from: {x: 0, y: 0, width: fromRect.width, height: fromRect.height, opacity: 0},
    to: {x: toRect.x-fromRect.x, y: toRect.y-fromRect.y, width: toRect.width, height: toRect.height, opacity: 1},
    duration: 2000
  }).start({
    update: v => styler(to).set(v),
    complete: () => {
      setTimeout(() => {
        Object.assign(to.style, {width, height, transform, right, bottom, top, left});
        fixed.remove(to);
        fixed.hide();
        placeholder.parentNode.replaceChild(to, placeholder);
      }, 0);
    }
  });
}

const Image = () => {
  const fromImg = useRef(null);
  const toImg = useRef(null);
  useEffect(() => {
    if(toImg.current) toImg.current.style.opacity = 0;
    if(fromImg.current) fromImg.current.style.opacity = 0;
    (async() => {
      await Promise.all([fromImg.current, toImg.current].map(el => checkTagPreload(el)));
      await imageMoving(fromImg.current, toImg.current);
    })();
  }, []);
  return <Ref.section name="image">
    post page
    <Link to="/" seed='pushPage'>goto main</Link>
    <div style={{position: 'relative', width: '650px', height: '350px', margin: '10px auto', backgroundColor: '#f2f2f2'}}>
      <img ref={fromImg} src="https://picsum.photos/120/100" style={{position: 'absolute', left: 0, top: 0}} />
      <img ref={toImg} src="https://picsum.photos/200/150" style={{position: 'absolute', right: 0, bottom: 0}} />
    </div>
  </Ref.section>
}

export default Image;