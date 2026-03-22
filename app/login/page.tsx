import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* --- Navigation --- */}
      <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
        <div className="text-2xl font-bold text-blue-600">DevPlatform</div>
        <div className="space-x-6 hidden md:block">
          <a href="#features" className="hover:text-blue-500">Features</a>
          <a href="#about" className="hover:text-blue-500">About</a>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
            Sign Up
          </button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          Build your future <span className="text-blue-600">faster.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          The all-in-one platform to manage your projects, track progress, and collaborate with your team in real-time.
        </p>
        <div className="space-x-4">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:scale-105 transition">
            Get Started
          </button>
          <button className="border border-gray-300 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100">
            View Demo
          </button>
        </div>
      </header>

      {/* --- Feature Grid --- */}
      <section id="features" className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <FeatureCard title="Fast Performance" desc="Optimized for speed and SEO out of the box." />
          <FeatureCard title="Secure Auth" desc="Enterprise-grade security for all your users." />
          <FeatureCard title="Real-time Data" desc="Synced across all devices instantly." />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ title, desc }) => (
  <div className="p-8 border border-gray-100 rounded-2xl hover:shadow-xl transition">
    <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center text-blue-600 font-bold">✓</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default LandingPage;
npm install @supabase/supabase-js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);
import { supabase } from '../lib/supabaseClient';

async function handleSignUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Error signing up:", error.message);
  } else {
    alert("Check your email for the confirmation link!");
  }
}
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If there is no session and the user is trying to access 
  // a route that starts with '/dashboard', redirect to '/login'
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

// Ensure this middleware only runs on specific routes
export const config = {
  matcher: ['/dashboard/:path*'],
};
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-xl font-bold mb-8">My Platform</h2>
        <nav className="space-y-4">
          <a href="/dashboard" className="block text-gray-600 hover:text-blue-600">Overview</a>
          <a href="/dashboard/settings" className="block text-gray-600 hover:text-blue-600">Settings</a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
  }
export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome back!</h1>
      <p className="mt-4 text-gray-600">This is your private workspace.</p>
      
      {/* Example of a data card */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h3 className="font-semibold">Recent Activity</h3>
          <p className="text-sm text-gray-500">No recent activity yet.</p>
        </div>
      </div>
    </div>
  );
}
'use client'; // This is a client-side component

import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    // 1. Tell Supabase to end the session
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      // 2. Redirect the user back to the login page
      router.push('/login');
      // Refresh the page to ensure all server-side state is cleared
      router.refresh();
    }
  };

  return (
    <button 
      onClick={handleSignOut}
      className="text-red-500 hover:text-red-700 font-medium"
    >
      Sign Out
    </button>
  );
}
import SignOutButton from '../../components/SignOutButton';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-8">My Platform</h2>
        
        <nav className="flex-1 space-y-4">
          <a href="/dashboard" className="block text-gray-600 hover:text-blue-600">Overview</a>
          <a href="/dashboard/settings" className="block text-gray-600 hover:text-blue-600">Settings</a>
        </nav>

        {/* Place the button at the bottom */}
        <div className="mt-auto">
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.href = '/dashboard';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-md rounded-lg w-96 space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <input 
          type="email" placeholder="Email" required
          className="w-full p-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Password" required
          className="w-full p-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Sign In</button>
      </form>
    </div>
  );
}
