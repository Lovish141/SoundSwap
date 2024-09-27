import { Link } from "react-router-dom"

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
import { useNavigate } from "react-router-dom"
import { invokeSignIn } from "@/services/DataService"
import Loader from "@/components/global/Loader"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"


export function SignIn()  {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("");
    const [loading,setLoading]=useState(false);
    const [err,setErr]=useState();
    const navigate=useNavigate();
    useEffect(()=>{
      const userData : string | null= localStorage.getItem("soundSwapUser");
      if (!userData) {
        navigate('/signIn')
      }
      if (userData) {
        navigate("/dashboard")
      }
    },[])
    const handleSubmit=(e:any)=>{
      setLoading(true);
        e.preventDefault();
        invokeSignIn(email,password)
        .then((data)=>{
          const {message,...modifiedData}=data;
          localStorage.setItem('soundSwapUser',JSON.stringify(modifiedData));
          navigate('/dashboard');
        })
        .catch((err)=>{
          setErr(err.response.data.message);
        })
        .finally(()=>{
          setLoading(false);
        });
    }
  return (
    <div className="flex items-center justify-center h-screen">
      {
        loading &&
        <Card className="max-w-sm mx-auto">
          <CardContent>
            <Loader/>
          </CardContent>
        </Card>
      }
      {
        !loading &&
      
    <Card className="mx-auto max-w-sm ">
      <CardHeader>
        
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="lovish.sharma@example.com"
              required
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              {/* <Link to="/" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link> */}
            </div>
            <Input 
            id="password" 
            type="password" 
            required
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            Login
          </Button>
          {/* <Button variant="outline" className="w-full">
            Login with Google
          </Button> */}
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signUp" className="underline">
            Sign up
          </Link>
        </div>
        {
          err &&
          (
           <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle><AlertDescription>{err}</AlertDescription>
            </Alert>
          )
        }
      </CardContent>
    </Card>
}
    </div>
  )
}
