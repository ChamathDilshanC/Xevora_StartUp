'use client';

import { FloatingPaths } from '@/components/floating-paths';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  resetPassword,
  signInWithApple,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from '@/lib/auth';
import { AtSignIcon, ChevronLeftIcon, Loader2, LockIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

type AuthMode = 'signin' | 'signup' | 'reset';

export function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Apple Sign In
  const handleAppleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithApple();
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Continue (Check if user exists)
  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Show password field
    setShowPassword(true);
  };

  // Handle Email Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push('/');
    } catch (err: any) {
      // If invalid credentials (user doesn't exist or wrong password), try to create account
      if (
        err.message.includes('Invalid email or password') ||
        err.message.includes('No account found') ||
        err.message.includes('invalid-credential')
      ) {
        try {
          // Automatically create a new account
          await signUpWithEmail(email, password);
          setSuccess('Account created successfully! Redirecting...');
          setTimeout(() => router.push('/'), 1000);
        } catch (signupErr: any) {
          // If account already exists, it means the password was wrong
          if (signupErr.message.includes('already exists')) {
            setError(
              'Incorrect password. Please try again or reset your password.'
            );
          } else {
            setError(signupErr.message);
          }
        }
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Sign Up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password);
      router.push('/');
    } catch (err: any) {
      // If account exists, switch to signin mode
      if (err.message.includes('already exists')) {
        setAuthMode('signin');
        setError('Account already exists. Please sign in.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (!showPassword) {
      handleEmailContinue(e);
    } else if (authMode === 'signin') {
      handleEmailSignIn(e);
    } else if (authMode === 'signup') {
      handleEmailSignUp(e);
    } else if (authMode === 'reset') {
      handlePasswordReset(e);
    }
  };

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      <div className="relative hidden h-full flex-col border-r bg-secondary p-10 lg:flex dark:bg-secondary/20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <Logo className="mr-auto" />

        <div className="z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl">
              Xevora transformed my wardrobe and my confidence. Every piece
              tells a story, and I feel unstoppable.
            </p>
            <footer className="font-mono font-semibold text-sm">
              ~ Developed by Xevora Team @ Chamath Dilshan
            </footer>
          </blockquote>
        </div>
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>
      <div className="relative flex min-h-screen flex-col justify-center p-4">
        <div
          aria-hidden
          className="-z-10 absolute inset-0 isolate opacity-60 contain-strict"
        >
          <div className="-translate-y-87.5 absolute top-0 right-0 h-320 w-140 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
          <div className="absolute top-0 right-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="-translate-y-87.5 absolute top-0 right-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
        </div>
        <Button asChild className="absolute top-7 left-5" variant="ghost">
          <a href="/">
            <ChevronLeftIcon />
            Home
          </a>
        </Button>
        <div className="mx-auto space-y-4 sm:w-sm">
          <Logo className="lg:hidden" />
          <div className="flex flex-col space-y-1">
            <h1 className="font-bold text-2xl tracking-wide">
              {authMode === 'reset'
                ? 'Reset Password'
                : authMode === 'signup'
                ? 'Create Account'
                : 'Sign In or Join Now!'}
            </h1>
            <p className="text-base text-muted-foreground">
              {authMode === 'reset'
                ? 'Enter your email to receive a password reset link'
                : authMode === 'signup'
                ? 'Create your Xevora account'
                : 'Login or create your Xevora account'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="rounded-md bg-green-500/10 p-3 text-green-600 text-sm dark:text-green-400">
              {success}
            </div>
          )}

          {authMode !== 'reset' && (
            <>
              <div className="space-y-2">
                <Button
                  className="w-full"
                  size="lg"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Continue with Google
                </Button>
                <Button
                  className="w-full"
                  size="lg"
                  type="button"
                  onClick={handleAppleSignIn}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <AppleIcon />
                  )}
                  Continue with Apple
                </Button>
              </div>

              <div className="flex w-full items-center justify-center">
                <div className="h-px w-full bg-border" />
                <span className="px-2 text-muted-foreground text-xs">OR</span>
                <div className="h-px w-full bg-border" />
              </div>
            </>
          )}

          <form className="space-y-3" onSubmit={handleSubmit}>
            <p className="text-start text-muted-foreground text-xs">
              {authMode === 'reset'
                ? 'Enter your email address'
                : 'Enter your email address to sign in or create an account'}
            </p>
            <InputGroup>
              <InputGroupInput
                placeholder="your.email@example.com"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <InputGroupAddon>
                <AtSignIcon />
              </InputGroupAddon>
            </InputGroup>

            {showPassword && authMode !== 'reset' && (
              <div className="space-y-2">
                <InputGroup>
                  <InputGroupInput
                    placeholder="Password (min 6 characters)"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <InputGroupAddon>
                    <LockIcon />
                  </InputGroupAddon>
                </InputGroup>
                {authMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('reset');
                      setShowPassword(false);
                      setPassword('');
                    }}
                    className="text-muted-foreground text-xs hover:text-primary"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : authMode === 'reset' ? (
                'Send Reset Link'
              ) : showPassword ? (
                authMode === 'signup' ? (
                  'Create Account'
                ) : (
                  'Sign In'
                )
              ) : (
                'Continue With Email'
              )}
            </Button>

            {showPassword && authMode === 'signin' && (
              <p className="text-center text-muted-foreground text-sm">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-primary hover:underline"
                >
                  Sign up
                </button>
              </p>
            )}

            {showPassword && authMode === 'signup' && (
              <p className="text-center text-muted-foreground text-sm">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}

            {authMode === 'reset' && (
              <p className="text-center text-muted-foreground text-sm">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setShowPassword(false);
                  }}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </form>
          <p className="mt-8 text-muted-foreground text-sm">
            By clicking continue, you agree to our{' '}
            <a
              className="underline underline-offset-4 hover:text-primary"
              href="#"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              className="underline underline-offset-4 hover:text-primary"
              href="#"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g>
      <path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
    </g>
  </svg>
);

function AppleIcon({
  fill = 'currentColor',
  ...props
}: React.ComponentProps<'svg'>) {
  return (
    <svg fill={fill} viewBox="0 0 24 24" {...props}>
      <g id="_Group_2">
        <g id="_Group_3">
          <path
            d="M18.546,12.763c0.024-1.87,1.004-3.597,2.597-4.576c-1.009-1.442-2.64-2.323-4.399-2.378    c-1.851-0.194-3.645,1.107-4.588,1.107c-0.961,0-2.413-1.088-3.977-1.056C6.122,5.927,4.25,7.068,3.249,8.867    c-2.131,3.69-0.542,9.114,1.5,12.097c1.022,1.461,2.215,3.092,3.778,3.035c1.529-0.063,2.1-0.975,3.945-0.975    c1.828,0,2.364,0.975,3.958,0.938c1.64-0.027,2.674-1.467,3.66-2.942c0.734-1.041,1.299-2.191,1.673-3.408    C19.815,16.788,18.548,14.879,18.546,12.763z"
            id="_Path_"
          />
          <path
            d="M15.535,3.847C16.429,2.773,16.87,1.393,16.763,0c-1.366,0.144-2.629,0.797-3.535,1.829    c-0.895,1.019-1.349,2.351-1.261,3.705C13.352,5.548,14.667,4.926,15.535,3.847z"
            id="_Path_2"
          />
        </g>
      </g>
    </svg>
  );
}
