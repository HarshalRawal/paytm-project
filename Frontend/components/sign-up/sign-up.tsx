// "use client"
// import { useState } from "react"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { CheckCircle2, User, Mail, Phone, Lock, Eye, EyeOff, Loader2 } from "lucide-react"

// const formSchema = z.object({
//   name: z.string().min(2, {
//     message: "Name must be at least 2 characters.",
//   }),
//   email: z.string().email({
//     message: "Please enter a valid email address.",
//   }),
//   phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
//     message: "Please enter a valid phone number.",
//   }),
//   password: z.string().min(8, {
//     message: "Password must be at least 8 characters.",
//   }),
//   confirmPassword: z.string(),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// })

// export default function SignUpPage() {
//   const [success, setSuccess] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       phone: "",
//       password: "",
//       confirmPassword: "",
//     },
//   })

//   const isSubmitting = form.formState.isSubmitting

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     setSuccess(false)
//     setTimeout(() => {
//       console.log(values)
//       setSuccess(true)
//     }, 2000)  // Simulating a network delay
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-gray-800 dark:via-gray-900 dark:to-black p-4">
//       <Card className="w-full max-w-md shadow-2xl hover:shadow-3xl transition-shadow duration-300 transform hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
//         <CardHeader className="space-y-1 text-center">
//           <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 dark:from-pink-400 dark:to-purple-600">Sign Up</CardTitle>
//           <CardDescription className="text-gray-500 dark:text-gray-400">Create your account to get started</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 pointer-events-none" />
//                         <Input placeholder="John Doe" {...field} 
//                           disabled={isSubmitting} 
//                           className="pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full" 
//                         />
//                       </div>
//                     </FormControl>
//                     <FormMessage className="text-xs text-red-500 mt-1" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 pointer-events-none" />
//                         <Input type="email" placeholder="john@example.com" {...field} 
//                           disabled={isSubmitting} 
//                           className="pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full" 
//                         />
//                       </div>
//                     </FormControl>
//                     <FormMessage className="text-xs text-red-500 mt-1" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="phone"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 pointer-events-none" />
//                         <Input type="tel" placeholder="+1234567890" {...field} 
//                           disabled={isSubmitting} 
//                           className="pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full" 
//                         />
//                       </div>
//                     </FormControl>
//                     <FormMessage className="text-xs text-red-500 mt-1" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 pointer-events-none" />
//                         <Input 
//                           type={showPassword ? "text" : "password"} 
//                           placeholder="••••••••" 
//                           {...field} 
//                           disabled={isSubmitting}
//                           className="pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full" 
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowPassword(!showPassword)}
//                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                         >
//                           {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                         </button>
//                       </div>
//                     </FormControl>
//                     <FormMessage className="text-xs text-red-500 mt-1" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="confirmPassword"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 pointer-events-none" />
//                         <Input 
//                           type={showConfirmPassword ? "text" : "password"} 
//                           placeholder="••••••••" 
//                           {...field} 
//                           disabled={isSubmitting}
//                           className="pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full" 
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                         >
//                           {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                         </button>
//                       </div>
//                     </FormControl>
//                     <FormMessage className="text-xs text-red-500 mt-1" />
//                   </FormItem>
//                 )}
//               />
//               {success && (
//                 <Alert variant="default" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700 rounded-lg">
//                   <CheckCircle2 className="h-4 w-4" />
//                   <AlertTitle>Success</AlertTitle>
//                   <AlertDescription>Your account has been created successfully!</AlertDescription>
//                 </Alert>
//               )}
              
//               {isSubmitting ? (
//                 <Button disabled className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg">
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Creating account...
//                 </Button>
//               ) : (
//                 <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 dark:bg-purple-600 dark:hover:bg-purple-700">
//                   Sign Up
//                 </Button>
//               )}
//             </form>
//           </Form>
//         </CardContent>
//         <CardFooter className="justify-center">
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             Already have an account? <a href="#" className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors duration-300">Sign in</a>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }





'use client'

import { useState, useEffect } from 'react'
import { X, DollarSign, Euro, Bitcoin, ArrowLeftRight, Sun, Moon } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(isDark)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', { email, password })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 transition-colors duration-300 dark:bg-gray-900">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl dark:bg-gray-800">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <button className="text-gray-600 transition-colors duration-200 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">
                <X size={24} />
              </button>
              <h1 className="text-2xl font-semibold text-blue-500 dark:text-blue-400">Sign up</h1>
              <button
                onClick={toggleDarkMode}
                className="text-gray-600 transition-colors duration-200 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-300"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-300"
                  placeholder="Create a password"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500 dark:focus:ring-offset-gray-800"
              >
                Sign up
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <span className="relative bg-white px-4 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">or</span>
            </div>

            <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-blue-300 dark:focus:ring-offset-gray-800">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <a href="#" className="font-semibold text-blue-500 hover:underline dark:text-blue-400">
                Log in
              </a>
            </p>
          </div>

          <div className="relative flex flex-col items-center justify-center space-y-6 overflow-hidden bg-blue-50 p-8 md:items-start dark:bg-gray-700">
            <h2 className="text-3xl font-bold text-blue-600 md:text-4xl lg:text-5xl transition-all duration-300 ease-in-out hover:scale-105 dark:text-blue-400">
              Instant Money Exchange
            </h2>
            <p className="text-center text-xl text-gray-600 md:text-left md:text-2xl transition-all duration-300 ease-in-out hover:translate-x-2 dark:text-gray-300">
              Send, receive, and exchange money in seconds!
            </p>

            {/* Animated objects */}
            <DollarSign className="absolute top-4 left-4 h-8 w-8 text-green-500 animate-bounce dark:text-green-400" />
            <Euro className="absolute top-1/4 right-8 h-6 w-6 text-blue-500 animate-pulse dark:text-blue-400" />
            <Bitcoin className="absolute bottom-1/4 left-8 h-10 w-10 text-orange-500 animate-spin-slow dark:text-orange-400" />
            <ArrowLeftRight className="absolute bottom-8 right-4 h-8 w-8 text-purple-500 animate-ping dark:text-purple-400" />
          </div>
        </div>

        {/* Additional floating objects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <div className="relative h-40 w-40">
            <div className="absolute h-4 w-4 rounded-full bg-yellow-400 animate-float1 dark:bg-yellow-300"></div>
            <div className="absolute h-6 w-6 rounded-full bg-green-400 animate-float2 dark:bg-green-300"></div>
            <div className="absolute h-5 w-5 rounded-full bg-red-400 animate-float3 dark:bg-red-300"></div>
            <div className="absolute h-3 w-3 rounded-full bg-blue-400 animate-float4 dark:bg-blue-300"></div>
          </div>
        </div>
      </div>
    </div>
  )
}