import React from 'react';
import { groupRefMap, Link, Ref } from '../utils/transition';

const Main = () => {
  return <Ref.main name="main-page"> main page
    <Link to="/post" seed='pushPage'>goto post</Link>
    <Ref.div name="post-list">
      {groupRefMap([1,2,3], (item, i, group) => 
        <Ref.div key={i} to="/detail" seed="pushDetail" {...group('post-inner')}>
          <Ref.h5 {...group('post-title')}>title {item}</Ref.h5>
          <Ref.img src={`https://picsum.photos/200/100?${item}`} {...group('post-img')} preload={true} />
        </Ref.div>
      )}
    </Ref.div>
    {/* {[1,2,3].map((number, index) => (
      <Ref.div to="/post" key={index} group={['posts', index]} name="inner">
        <Ref.h5 group={['posts', index]} name="title">title {number}</Ref.h5>
        <Ref.img src={`https://picsum.photos/200/100?${number}`} group={['posts', index]} name="image" preload={true} />
      </Ref.div>
    ))} */}
  </Ref.main>
}

export default Main;