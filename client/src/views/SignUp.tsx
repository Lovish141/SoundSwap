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
import Loader from "@/components/global/Loader"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, User, Mail, Lock, Music, ArrowRight, Eye, EyeOff, UserPlus } from "lucide-react"

export function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const userData: string | null = localStorage.getItem("soundSwapUser");
    if (userData) {
      navigate("/dashboard");
    }
  }, [])

  const handleSubmit = (e: any) => {
    setLoading(true);
    setErr(undefined);
    e.preventDefault();
    invokeSignUp(firstName, lastName, email, password)
      .then((data) => {
        const { message, ...modifiedData } = data;
        localStorage.setItem('soundSwapUser', JSON.stringify(modifiedData));
        navigate("/dashboard");
      })
      .catch((err) => {
        setErr(err.message);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
           <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-glow mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Join SoundSwap
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Start your music conversion journey today
          </p>
        </div>

        <Card variant="glass" className="shadow-strong backdrop-blur-xl animate-slide-up">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <UserPlus className="w-6 h-6 text-purple-600" />
              Create Account
            </CardTitle>
            <CardDescription className="text-base">
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input 
                      id="first-name" 
                      placeholder="Enter first name" 
                      required 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10 h-12 border-2 focus:border-purple-500 transition-colors duration-200 bg-white/50 dark:bg-gray-800/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input 
                      id="last-name" 
                      placeholder="Enter last name" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      required 
                      className="pl-10 h-12 border-2 focus:border-purple-500 transition-colors duration-200 bg-white/50 dark:bg-gray-800/50"
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-2 focus:border-purple-500 transition-colors duration-200 bg-white/50 dark:bg-gray-800/50"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-2 focus:border-purple-500 transition-colors duration-200 bg-white/50 dark:bg-gray-800/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Password should be at least 6 characters long
                </p>
              </div>

              {/* Error Alert */}
              {err && (
                <Alert variant="destructive" className="animate-slide-up bg-red-50 dark:bg-red-900/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{err}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="modern" 
                size="lg" 
                className="w-full group font-semibold"
                disabled={loading || !firstName || !lastName || !email || !password}
              >
                Create Account
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            {/* Terms */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              By creating an account, you agree to our{" "}
              <Link to="#" className="text-purple-600 hover:text-purple-500 underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="#" className="text-purple-600 hover:text-purple-500 underline">
                Privacy Policy
              </Link>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-gray-500 dark:text-gray-400">Already a member?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link 
                  to="/signIn" 
                  className="font-semibold text-purple-600 hover:text-purple-500 transition-colors duration-200 underline underline-offset-2"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 animate-fade-in animate-delay-200">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Secure • Private • Fast
          </p>
        </div>
      </div>
    </div>
  )
}
