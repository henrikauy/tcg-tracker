'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import LoginForm from '@/components/LoginForm';


export default function Home() {
  const { data: session } = useSession();

  // Access the JWT token
  const token = session?.accessToken;
  
  return (
    <main className="min-h-screen bg-theme p-8">
      {token ? (
        <p>Your token: {token}</p>
      ) : (
        <LoginForm />
      )}
    </main>
  );
}
