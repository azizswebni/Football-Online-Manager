"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Typography } from "@/components/atoms/Typography"
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query";
import { loginService } from "@/services/auth.service"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { LoginResponse } from "@/lib/interfaces"
import { useUserStore } from "@/store/auth.store"

// Zod schema for login form validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function AuthForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [generalError, setGeneralError] = useState<string>("")
  const {setUserData} = useUserStore()
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const router = useRouter();
  const authMutation = useMutation({
    mutationFn: loginService,
    onSuccess: (data: LoginResponse) => {
      toast.info(data.message)
      setUserData(data.user.email,data.user.role,data.user.id)
      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data.message ?? "An unexpected error occurred";
      toast(message);
      setGeneralError("Invalid email or password")
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = form

  const onSubmit = async (data: LoginFormData) => {
    setGeneralError("")
    authMutation.mutate(data)
  }

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl text-center">Welcome</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account or create a new one to start managing your team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* General Error */}
            {generalError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <Typography variant="caption" className="text-red-700">
                  {generalError}
                </Typography>
              </div>
            )}

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className={cn("pl-10", form.formState.errors.email && "border-red-500 focus:border-red-500")}
                        disabled={isSubmitting}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={cn("pl-10 pr-10", form.formState.errors.password && "border-red-500 focus:border-red-500")}
                        disabled={isSubmitting}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>

            {/* Forgot Password */}
            <div className="text-center">
              <Button variant="link" className="text-sm text-slate-600" type="button">
                Forgot your password?
              </Button>
            </div>

            {/* Account Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
              <Typography variant="caption" className="text-blue-700 block mb-1">
                No account? No problem!
              </Typography>
              <Typography variant="caption" className="text-blue-600">
                Just enter any email and password—if you don't have an account, one will be created automatically.
              </Typography>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}