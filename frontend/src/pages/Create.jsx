import React, {useState } from 'react'
import {toast} from 'react-toastify'

const CreateUser = () => {
  const [data,setData]=useState({name:"",email:""})
  const createData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/create`, { method: "POST", headers:{'Content-Type':'application/json'} ,body:JSON.stringify(data)});
      const json = await res.json()
      console.log(json)
      if(json.success){
        toast.success(json.message)
      }
      if(!json.success){
        toast.error(json.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  };
  return (
    <div>
      <input type="text" placeholder='Enter name' value={data.name} onChange={(e)=>{setData({...data,name:e.target.value})}} />
      <input type="text" placeholder='Enter email' value={data.email} onChange={(e)=>{setData({...data,email:e.target.value})}} />
      <button onClick={createData}>Submit</button>
    </div>
  )
}

export default CreateUser;
