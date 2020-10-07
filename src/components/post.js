import React, { useEffect, useRef } from 'react';
import { tween, styler } from 'popmotion';
import { Link, checkTagPreload } from '../utils/transition';
import { Ref } from '../utils/refComp';

const imageMoving = async(from, to) => {
  await Promise.all([from, to].map(el => checkTagPreload(el)));
  const fromRect = from.getBoundingClientRect();
  const toRect = to.getBoundingClientRect();
  tween({
    from: {opacity: 1},
    to: {opacity: 0}
  }).start(v => styler(fromImg.current).set(v));
}

const Post = () => {
  const fromImg = useRef(null);
  const toImg = useRef(null);
  useEffect(() => {
  }, []);
  return <Ref.section name="post">
    post page
    <Link to="/">goto main</Link>
    {/* <Ref.img src="https://picsum.photos/300/200?1" preload={true} />
    <Ref.img src="https://picsum.photos/300/200" preload={true} /> */}
    <div style={{position: 'relative', width: '650px', height: '350px', backgroundColor: '#f2f2f2'}}>
      <img ref={fromImg} src="https://picsum.photos/120/100" style={{position: 'absolute', left: 0, top: 0}} />
      <img ref={toImg} src="https://picsum.photos/200/150" style={{position: 'absolute', right: 0, bottom: 0}} />
    </div>
  </Ref.section>
}

export default Post;