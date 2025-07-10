"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/atoms/Typography"
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoginFormProps {
}

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setErrors({ general: "Invalid email or password" })

    } catch (error) {
      setErrors({ general: "An error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* General Error */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <Typography variant="caption" className="text-red-700">
            {errors.general}
          </Typography>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange("email")}
            className={cn("pl-10", errors.email && "border-red-500 focus:border-red-500")}
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <Typography variant="caption" className="text-red-600">
            {errors.email}
          </Typography>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange("password")}
            className={cn("pl-10 pr-10", errors.password && "border-red-500 focus:border-red-500")}
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
          </Button>
        </div>
        {errors.password && (
          <Typography variant="caption" className="text-red-600">
            {errors.password}
          </Typography>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full bg-green-500 hover:bg-green-600" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
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
  )
}
