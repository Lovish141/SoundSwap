import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { invokeSignUp } from "@/services/DataService"



export function SignUp() {
    const [firstName,setFirstName]=useState("");
    const [lastName,setLastName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const navigate=useNavigate();
    useEffect(()=>{
      const userData : string | null= localStorage.getItem("soundSwapUser");
      
      if (userData) {
        navigate("/dashboard")
      }
    },[])

    const handleSubmit=(e:any)=>{
      e.preventDefault();
        invokeSignUp(firstName,lastName,email,password)
        .then((data)=>{
          const {message,...modifiedData}=data;

          localStorage.setItem('soundSwapUser',JSON.stringify(modifiedData));
        })
        .catch((err)=>{
          console.log(err);
        })
    }

  return (
    <div className="flex items-center justify-center h-screen">
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" placeholder="Lovish" required value={firstName}  onChange={(e)=>{setFirstName(e.target.value)}}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" placeholder="Sharma" value={lastName} onChange={(e)=>{setLastName(e.target.value)}} required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
            id="password"
            type="password" 
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            Create an account
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="#" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
