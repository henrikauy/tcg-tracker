'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import LoginForm from '@/components/LoginForm';
import LogoutButton from '@/components/LogoutButton';


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
        <LoginForm />
      )}
    </main>
  );
}
