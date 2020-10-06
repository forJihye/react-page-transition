import React from 'react';
import { Link } from '../utils/transition';
import { Ref } from '../utils/refComp';

const Post = () => {
  return <Ref.section name="post">
    post page
    <Link to="/">goto main</Link>
  </Ref.section>
}

export default Post;