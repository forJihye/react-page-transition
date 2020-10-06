import React from 'react';
import { Link } from '../utils/transition';
import { Ref } from '../utils/refComp';

const Main = () => {
  return <Ref.main name="main">
    main page
    <Link to="/post">goto post</Link>
  </Ref.main>
}

export default Main;