import React from 'react';
import { groupRefMap, Link } from '../utils/transition';
import { Ref } from '../utils/refComp';

const Main = () => {
  return <Ref.main name="main">
    main page
    <Link to="/image" seed='pushPage'>goto post</Link>

    {groupRefMap([1,2,3], (item, i, group) => 
      <Ref.div to="/post" key={i} {...group('inner')}>
        <Ref.h5 {...group('title')}>title {item}</Ref.h5>
        <Ref.img src={`https://picsum.photos/200/100?${item}`} {...group('image')} preload={true} />
      </Ref.div>
    )}
    {/* {[1,2,3].map((number, index) => (
      <Ref.div to="/post" key={index} group={['posts', index]} name="inner">
        <Ref.h5 group={['posts', index]} name="title">title {number}</Ref.h5>
        <Ref.img src={`https://picsum.photos/200/100?${number}`} group={['posts', index]} name="image" preload={true} />
      </Ref.div>
    ))} */}
  </Ref.main>
}

export default Main;