'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import LoginForm from '@/components/LoginForm';
import LogoutButton from '@/components/LogoutButton';
import SignupForm from '@/components/SignupForm';


export default function Home() {
  const { data: session } = useSession();

  // Access the JWT token
  const token = session?.accessToken;
  
  return (
    <main className="min-h-screen bg-theme p-8">
      {token ? (
        <div>
        <p>Your token: {token}</p>
        <p>Email: {session?.user?.email}</p>
        <LogoutButton />
        </div>
      ) : (
        <div>
          <LoginForm />
          <SignupForm />
        </div>
      )}
    </main>
  );
}
