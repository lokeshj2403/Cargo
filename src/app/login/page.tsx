'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react'; // Assuming a future success state
import { signInWithGoogle, signInWithFacebook } from '@/lib/firebase/auth'; // Import Firebase auth functions
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { AuthError } from 'firebase/auth';


// Placeholder icons for social login
const GoogleIcon = () => <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.09 0 24c0 3.91.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>;
const FacebookIcon = () => <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.99 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.99 22 12z"/></svg>;


export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // For registration
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // For displaying success message
  const { toast } = useToast(); // Initialize useToast


  // Dummy handler functions - Replace with actual authentication logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    console.log('Logging in with:', email, password);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Replace with actual API call and error handling
    if (email === 'user@example.com' && password === 'password') {
        // TODO: Implement Firebase email/password sign in
         toast({ title: "Login Success (Simulated)", description: "Redirecting..." });
        // Redirect to user dashboard or home page
        window.location.href = '/'; // Or a dashboard page
    } else {
        setError('Invalid email or password.');
        toast({ title: "Login Failed", description: 'Invalid email or password.', variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
     if (password !== confirmPassword) {
      setError('Passwords do not match.');
      toast({ title: "Registration Failed", description: 'Passwords do not match.', variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    console.log('Registering with:', email, password);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
     // Replace with actual API call, error handling, and success state
     // TODO: Implement Firebase email/password registration
    setError('Registration feature not fully implemented yet.'); // Placeholder
    toast({ title: "Registration Info", description: 'Registration feature not fully implemented yet.', variant: "default" });
    // On successful registration:
    // setIsSuccess(true);
    // toast({ title: "Registration Successful!", description: "You can now log in." });
    // Optionally reset form or automatically log in
    setIsLoading(false);
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    console.log(`Initiating ${provider} login...`);

    let result: any; // Can be UserCredential or AuthError
    if (provider === 'google') {
      result = await signInWithGoogle();
    } else if (provider === 'facebook') {
      result = await signInWithFacebook();
    }

    if (result && result.user) {
        // Login successful
        toast({ title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Login Successful!`, description: `Welcome, ${result.user.displayName || result.user.email}!` });
        // Redirect to dashboard or home
        window.location.href = '/';
    } else if (result instanceof Error) {
        // Login failed
        const authError = result as AuthError;
        let errorMessage = `Failed to sign in with ${provider}. ${authError.message}`;
         if (authError.code === 'auth/popup-closed-by-user') {
             errorMessage = `${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in cancelled.`;
         } else if (authError.code === 'auth/account-exists-with-different-credential') {
            errorMessage = 'An account already exists with this email using a different sign-in method.';
        }
        setError(errorMessage);
        toast({ title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Login Failed`, description: errorMessage, variant: "destructive" });
    } else {
        // Handle unexpected cases or errors without specific codes
         setError(`An unknown error occurred during ${provider} login.`);
         toast({ title: "Login Failed", description: `An unknown error occurred during ${provider} login.`, variant: "destructive" });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-screen-md mx-auto flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              {isRegistering ? 'Create Your Account' : 'Welcome Back!'}
            </CardTitle>
            <CardDescription>
              {isRegistering ? 'Sign up to start booking or driving.' : 'Log in to access your account.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
                 <div className="flex flex-col items-center text-center p-4 bg-green-100 text-green-800 rounded-md">
                    <CheckCircle className="h-12 w-12 mb-2 text-green-600" />
                    <p className="font-semibold">Registration Successful!</p>
                    <p className="text-sm">You can now log in with your credentials.</p>
                    <Button variant="link" onClick={() => { setIsRegistering(false); setIsSuccess(false); }} className="mt-2">
                        Go to Login
                    </Button>
                </div>
            ) : (
                <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        aria-required="true" // Added aria-required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        aria-required="true" // Added aria-required
                        />
                    </div>
                    {isRegistering && (
                        <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                            aria-required="true" // Added aria-required
                        />
                        </div>
                    )}

                    {error && (
                        <p role="alert" className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">{error}</p> // Added role="alert"
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                        {isLoading ? 'Processing...' : (isRegistering ? 'Register' : 'Log In')}
                    </Button>
                </form>
            )}

            {!isSuccess && (
                <>
                    <Separator className="my-6" />

                    <div className="space-y-4">
                        <p className="text-center text-sm text-muted-foreground">
                        {isRegistering ? 'Or sign up with:' : 'Or log in with:'}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" onClick={() => handleSocialLogin('google')} disabled={isLoading}>
                             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <GoogleIcon />}
                             Google
                        </Button>
                        <Button variant="outline" onClick={() => handleSocialLogin('facebook')} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <FacebookIcon />}
                             Facebook
                        </Button>
                        </div>
                    </div>
                </>
            )}
          </CardContent>
          {!isSuccess && (
             <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                <Button variant="link" className="px-1" onClick={() => {setIsRegistering(!isRegistering); setError(null);}}>
                    {isRegistering ? 'Log In' : 'Sign Up'}
                </Button>
                </p>
            </CardFooter>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
}
