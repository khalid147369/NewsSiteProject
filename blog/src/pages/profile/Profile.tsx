
import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { changePassword, changeProfileData } from '../../api/user';
import { Alert } from '@material-tailwind/react';

const Profile = () => {
    const {user} =useUser();
    type inputType= 'username' | 'email' | 'previousPassword'|'newPassword'
    type currentUserType={
        username?:string,
        email?:string,
        previousPassword?:string,
        newPassword?:string,
    }
    const inicialState ={
        username:user?.data.user.username,
        email:user?.data.user.email,
        previousPassword:'',
        newPassword:''}
        
    
     const [currentUser,setCurrentUser]=useState<currentUserType>(inicialState)
     const [informationMessage,setInformationMessage]=useState({
        status:'',
        message:''
     })
     const [isChanging,setIsChanging]=useState(false)
    const isChanged=JSON.stringify(currentUser)!==JSON.stringify(inicialState)

    useEffect(()=>{
    setCurrentUser({
        username:user?.data.user.username,
        email:user?.data.user.email,
        previousPassword:'',
        newPassword:''
    })
},[user])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>,inputType:inputType)=>{
        setInformationMessage((prev)=>{return{...prev,message:''}});
        setCurrentUser({...currentUser,[inputType ]:e.target.value })
        e.target.value
    }
const handleSubmit = (e)=>{

e.preventDefault();

const token=user?.data.accessToken;
if (currentUser.username !== inicialState.username || currentUser.email !== inicialState.email) {
    changeProfileData({username:currentUser.username,email:currentUser.email},token).then(data=>{
   user.set((prev)=>{
    return {...prev,user:{...prev.user,username:currentUser.username?? prev.user.username,email:currentUser.email??prev.user.email}}
   })
       if(data.status === 200)
        setInformationMessage({
    message:data.data.message,
    status:'success'
    });
    else
        setInformationMessage({
    message:data.response.data.message,
    status:'error'
});
       
});
}

if(currentUser.newPassword&&currentUser.previousPassword){

    changePassword(currentUser.previousPassword,currentUser.newPassword,token).then(data=>{
       if(data.status === 200)
        setInformationMessage({
    message:data.data.message,
    status:'success'
    });
    else
        setInformationMessage({
    message:data.response.data.message,
    status:'error'
});
       
    })

}

}

    return (
      <div className=" absolute flex flex-col rounded-xl bg-transparent transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-fit h-fit ">
  <h4 className="block text-xl font-medium text-slate-800">
  Profile
   </h4>
  <p className="text-slate-500 font-light">
    Nice to meet you! Enter your details to edit Profile.
  </p>
  <form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 ">
    <div className="mb-1 flex flex-col gap-6">
      <div className="w-full max-w-sm min-w-[200px]">
        <label className="block mb-2 text-sm text-slate-600">
          Your Name
        </label>
        <input value={currentUser.username} onChange={(e)=>handleChange(e,'username')} type="text" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Your Name" />
      </div>
      <div className="w-full max-w-sm min-w-[200px]">
        <label className="block mb-2 text-sm text-slate-600">
          Email
        </label>
        <input value={currentUser.email} onChange={(e)=>handleChange(e,'email')} type="email" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Your Email" />
      </div>
      <div className="w-full max-w-sm min-w-[200px]">
        <label className="block mb-2 text-sm text-slate-600">
          Previous Password
        </label>
        <input value={currentUser.previousPassword} onChange={(e)=>handleChange(e,'previousPassword')} type="password" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Your Password" />
      </div>
      <div className="w-full max-w-sm min-w-[200px]">
        <label className="block mb-2 text-sm text-slate-600">
          New Password
        </label>
        <input value={currentUser.newPassword} onChange={(e)=>handleChange(e,'newPassword')} type="password" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Your Password" />
      </div>
    </div>
{informationMessage.status==='success'&&informationMessage.message ? <Alert className=' text-green-500'>{`${informationMessage.message}!!`}</Alert>:informationMessage.status==='error'&&informationMessage.message&&<Alert className=' text-red-500'>{`${informationMessage.message}!!`}</Alert>}
    <button type='submit'  disabled={!isChanged}  className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" >
      Accept
    </button>
  </form>
</div>
    );
}

export default Profile;


