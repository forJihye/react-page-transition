import React, { useEffect, useRef } from 'react';
import { tween , styler } from 'popmotion';
import { Link, checkTagPreload, fixed, Ref } from '../utils/transition';

const imageMoving = async(from, to) => {
  const fromEl = from.current;
  const toEl = to.current;
  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();
  const {width, height, transform, right, bottom, top, left} = toEl.style;
  const placeholder = Object.assign(document.createElement('div'), {style: `
    position: absolute; width: ${toRect.width}px; height: ${toRect.height}px right: 0; bottom: 0;`
  });
  toEl.parentNode.replaceChild(placeholder, toEl);
  Object.assign(toEl.style, {right: 'auto', bottom: 'auto', left: `${fromRect.x}px`, top: `${fromRect.y}px`});
  fixed.append(toEl);
  fixed.show();
  tween({
    from: {x: 0, y: 0, width: fromRect.width, height: fromRect.height, opacity: 1},
    to: {x: toRect.x-fromRect.x, y: toRect.y-fromRect.y, width: toRect.width, height: toRect.height, opacity: 0},
    duration: 2000
  }).start(v => styler(fromEl).set(v));
  tween({
    from: {x: 0, y: 0, width: fromRect.width, height: fromRect.height, opacity: 0},
    to: {x: toRect.x-fromRect.x, y: toRect.y-fromRect.y, width: toRect.width, height: toRect.height, opacity: 1},
    duration: 2000
  }).start({
    update: v => styler(toEl).set(v),
    complete: () => {
      setTimeout(() => {
        Object.assign(toEl.style, {width, height, transform, right, bottom, top, left});
        fixed.remove(toEl);
        fixed.hide();
        placeholder.parentNode.replaceChild(toEl, placeholder);
      }, 0);
    }
  });
}

const Post = () => {
  const fromImg = useRef(null);
  const toImg = useRef(null);
  useEffect(() => {
    if(toImg.current) toImg.current.style.opacity = 0;
  }, []);
  return <Ref.main name="post-page">post page
    <Link to="/" seed='pushPage'>goto main</Link>
    <br />
    <button onClick={async() => {
      await Promise.all([fromImg.current, toImg.current].map(el => checkTagPreload(el)));
      await imageMoving(fromImg, toImg);
    }}>start moving image</button>

    <div style={{position: 'relative', width: '650px', height: '350px', margin: '10px auto', backgroundColor: '#f2f2f2'}}>
      <img ref={fromImg} src="https://picsum.photos/120/100" style={{position: 'absolute', left: 0, top: 0}} />
      <img ref={toImg} src="https://picsum.photos/200/150" style={{position: 'absolute', right: 0, bottom: 0}} />
    </div>
  </Ref.main>
}

export default Post;