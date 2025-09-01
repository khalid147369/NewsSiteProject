import { Link } from 'react-router-dom';
import Container from '../container/container';

const Nav = ({isAdmin}:{isAdmin:boolean}) => {
    return (
        <nav className='bg-black text-white h-8 flex items-center justify-start'>
    <Container className=''>
             <ul className='flex gap-3.5 items-center      '>  

                 <li>
                  <Link to={'/'} className="hover:underline ">Home</Link>
                </li>
                <li>
                  <Link to={'/world'} className="hover:underline">World</Link>
                </li>
                <li>
                  <Link to={'/sports'} className="hover:underline">Sports</Link>
                </li>
                <li>
                  <Link to={'/politic'} className="hover:underline">Politic</Link>
                </li>
                <li>
                  <Link to={'/technology'} className="hover:underline">Technology</Link>
                </li>
                 {isAdmin&&<li>
                  <Link to={'/panel'} className="hover:underline">Panel</Link>
                </li>}
                </ul>
                </Container>
        </nav>
    );
}

export default Nav;
