import {useState} from 'react';
import './Avatar.css'; // Assuming you have a CSS file for styles
import { Link, useNavigate } from 'react-router-dom';
import { useUser  } from '../../context/UserContext';
const Avatar = () => {
const [isColapsed, setIsCollapsed] = useState(true);
const {user } = useUser();
const navigate = useNavigate();

const name = user?.data?.user?.username
    return (
        <div onClick={()=>setIsCollapsed(!isColapsed)} className='avatar relative z-20'>
            {name?            <p className='absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>{name[0]}</p>
            : <small className='absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>login</small>}
            {/* <img src="path/to/avatar.jpg" alt="User Avatar" className="w-16 h-16 rounded-full" /> */}
            {!isColapsed && 
                <div className='absolute top-16 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-4'>
                    <ul className='flex flex-col gap-2'>
                        <Link to="/profile" className="hover:underline"><li className='hover:bg-gray-100 p-2 rounded text-black'>Profile</li></Link>
                        <Link to="/login" className="hover:underline"><li className='hover:bg-gray-100 p-2 rounded text-black'>Settings</li></Link>
                       {user.isLoggedIn?<li className='hover:bg-gray-100 p-2 rounded text-black' onClick={()=>{user.logout()}}>Logout</li>:
                       <li className='hover:bg-gray-100 p-2 rounded text-black' onClick={()=>navigate('/login')}>Login</li>} 
                        
                        

                    </ul> 
        </div>}
        </div>
    );
}

export default Avatar;
