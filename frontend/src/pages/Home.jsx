import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'

const Home = () => {
  const [data,setData]=useState([])
  async function fetchData(){
    try {
      const res = await axios.get('http://localhost:8080/read')
      if(res?.data?.success){
        setData(res.data.data)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  useEffect(()=>{
    fetchData()
  },[])
  const updateUser = async(id,name)=>{
    try {
      const res = await axios.post('http://localhost:8080/update',{id,name})
      if(res?.data?.success){
        toast.success(res.data.message)
        fetchData()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  const deleteUser = async(id)=>{
    try {
      const res = await axios.post('http://localhost:8080/delete',{id})
      if(res?.data?.success){
        toast.success(res.data.message)
        fetchData()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>Id</td>
            <td>Name</td>
            <td>Email</td>
            <td>Date</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
            {
              data.map((user)=>(
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.date}</td>
                  <td>
                    <button onClick={()=>{updateUser(user.id,user.name)}}>Update</button>
                    <button onClick={()=>{deleteUser(user.id)}}>Delete</button>
                  </td>
                </tr>
              ))
            }
        </tbody>
      </table>
    </div>
  )
}

export default Home
