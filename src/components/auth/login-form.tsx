'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/context/auth-context'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
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
    </svg>
  )
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

export function LoginForm() {
  const { signInWithGoogle, signInWithEmail, signUp, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const displayError = localError || error

  async function handleGoogle() {
    setLocalError(null)
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch {
      // error already set in context
    } finally {
      setLoading(false)
    }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLocalError(null)
    if (!email || !password) {
      setLocalError('Please enter email and password')
      return
    }
    setLoading(true)
    try {
      await signInWithEmail(email, password)
    } catch {
      // error already set in context
    } finally {
      setLoading(false)
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLocalError(null)
    if (!email || !password) {
      setLocalError('Please enter email and password')
      return
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await signUp(email, password)
    } catch {
      // error already set in context
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030303] px-4">
      <Card className="w-full max-w-md border border-white/10 bg-[#0a0a0a] text-white shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight text-white">
            Envision OS
          </CardTitle>
          <CardDescription className="text-white/50">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            onClick={handleGoogle}
            disabled={loading}
          >
            {loading ? <Spinner /> : <GoogleIcon />}
            <span className="ml-2">Continue with Google</span>
          </Button>

          <div className="relative flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/40">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="w-full bg-white/5">
              <TabsTrigger
                value="signin"
                className="flex-1 data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="flex-1 data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-3 pt-2">
                <div className="space-y-1">
                  <Label htmlFor="signin-email" className="text-white/70">
                    Email
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="border-white/20 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-white/30"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signin-password" className="text-white/70">
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="border-white/20 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-white/30"
                    autoComplete="current-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-white/90"
                  disabled={loading}
                >
                  {loading ? <Spinner /> : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-3 pt-2">
                <div className="space-y-1">
                  <Label htmlFor="signup-email" className="text-white/70">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="border-white/20 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-white/30"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-password" className="text-white/70">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="border-white/20 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-white/30"
                    autoComplete="new-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-white/90"
                  disabled={loading}
                >
                  {loading ? <Spinner /> : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {displayError && (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {displayError}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
