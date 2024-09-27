"use client"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, User, Mail, Phone, Lock, Eye, EyeOff, Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Please enter a valid phone number.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function SignUpPage() {
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  const isSubmitting = form.formState.isSubmitting

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSuccess(false)
    setTimeout(() => {
      console.log(values)
      setSuccess(true)
    }, 2000)  // Simulating a network delay
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-gray-800 dark:via-gray-900 dark:to-black p-4">
      <Card className="w-full max-w-md shadow-2xl hover:shadow-3xl transition-shadow duration-300 transform hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 dark:from-pink-400 dark:to-purple-600">Sign Up</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 pointer-events-none" />
                        <Input placeholder="John Doe" {...field} 
                          disabled={isSubmitting} 
                          className="pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 pointer-events-none" />
                        <Input type="email" placeholder="john@example.com" {...field} 
                          disabled={isSubmitting} 
                          className="pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 pointer-events-none" />
                        <Input type="tel" placeholder="+1234567890" {...field} 
                          disabled={isSubmitting} 
                          className="pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 pointer-events-none" />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                          disabled={isSubmitting}
                          className="pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 pointer-events-none" />
                        <Input 
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                          disabled={isSubmitting}
                          className="pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />
              {success && (
                <Alert variant="default" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700 rounded-lg">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Your account has been created successfully!</AlertDescription>
                </Alert>
              )}
              
              {isSubmitting ? (
                <Button disabled className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-lg">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </Button>
              ) : (
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 dark:bg-purple-600 dark:hover:bg-purple-700">
                  Sign Up
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account? <a href="#" className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors duration-300">Sign in</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
