"use client"

import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to /dashboard if user is logged in
  redirect('/dashboard')
}