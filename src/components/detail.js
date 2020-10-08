import React from 'react';
import { groupRefMap, Link, Ref } from '../utils/transition';

const Detail = () => {
  return <Ref.main name="detail-page"> detail page
    <Link to="/">goto main</Link>
    <div style={{width: '500px', margin: '0 auto', background: '#eee', textAlign: 'center'}}>
      <Ref.img src="https://picsum.photos/400/300?1" preload={true} name="detail-img" />
    </div>
  </Ref.main>
}

export default Detail;