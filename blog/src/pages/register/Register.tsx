import React,{useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/user'; // Adjust the import path as necessary
import { Alert } from '@material-tailwind/react';

const Register = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('')
type User = {
  username: string;
  email: string;
  password: string;
};
  // State to manage form inputs (optional, can be used for controlled components)
  const [user, setUser] = useState<User>({
    username: '',
    email: '',
    password: ''
  });
  const handleSubmit =async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Handle form submission logic here
    const data =await register(user.username, user.email, user.password)
  
        
        if (data.status === 201){
        navigate("/login"); // Redirect to login page after successful registration
        }else{
          setErrorMessage(data.response?.data?.message || 'Registration failed');
        // Optionally show an error message
        console.log("error : ",errorMessage);
        }
          


  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={user?.username || ''}
            onChange={(e) => {setUser({ ...user, username: e.target.value }),setErrorMessage('')}}
          />
          <input
            type="email"
            placeholder="Email"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={user?.email || ''}
            onChange={(e) => {setUser({ ...user, email: e.target.value }),setErrorMessage('')}}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={user?.password || ''}
            onChange={(e) => {setUser({ ...user, password: e.target.value }),setErrorMessage('')}}
          />
          {errorMessage&&<Alert className=' text-red-500'>{errorMessage}</Alert>}
          <button type="submit" className="bg-green-600 hover:bg-green-700 transition text-white p-3 rounded font-semibold">
            Register
          </button>
          <small className="text-center text-gray-600">
            Already have an account? <Link to="/login" className="text-green-600 hover:underline">Login</Link>
          </small>
        </form>
      </div>
    </div>
  );
};

export default Register;