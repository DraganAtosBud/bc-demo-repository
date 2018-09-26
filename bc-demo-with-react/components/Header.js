import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
  return (
     <Menu style={{ marginTop: '10px' }}>
       <Link route="/">
         <a className="item">Home</a>
       </Link>

       <Menu.Menu>
         <Link route="/orders/">
           <a className="item">My Orders</a>
         </Link>
       </Menu.Menu>

       <Menu.Menu>
         <Link route="/deliveries/">
           <a className="item">My Deliveries</a>
         </Link>
       </Menu.Menu>
     </Menu>
   );
};
