"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from "next/link";

export default function Overview() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}

const CTA = () => {
  return (
    <section className="py-16 bg-primary text-primary-foreground text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to Get Started with Hang?</h2>
      <p className="mb-6 text-lg">Start your free trial today and experience the future of SaaS solutions.</p>
      <Button className="px-6 py-3 text-lg">Get Started</Button>
    </section>
  );
}

// Navbar Component
const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-6 px-10 shadow-sm bg-white">
      <h1 className="text-2xl font-bold">Hang</h1>
      <div className="space-x-4">
        <Button variant="ghost">Features</Button>
        <Button variant="ghost">Pricing</Button>
        <Link href="/auth/login"><Button>Sign in</Button></Link>
        <Button>Sign Up</Button>
      </div>
    </nav>
  );
}

// Hero Component
const Hero = () => {
  return (
    <section className="text-center py-20 bg-gradient-to-b from-primary to-primary-foreground text-white">
      <h1 className="text-5xl font-extrabold leading-tight mb-6">Welcome to Hang</h1>
      <p className="text-lg mb-8">Empowering businesses with cutting-edge SaaS solutions.</p>
      <Button className="px-6 py-3 text-lg">Get Started</Button>
    </section>
  );
}

// Features Component
const Features = () => {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-10">Why Choose Hang?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10">
        <FeatureCard title="Feature One" description="Innovative tools to streamline your workflow." />
        <FeatureCard title="Feature Two" description="Seamless integration with your existing systems." />
        <FeatureCard title="Feature Three" description="24/7 support to keep your business running smoothly." />
      </div>
    </section>
  );
}

const FeatureCard = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className="p-6 border rounded-lg shadow-sm text-center">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// Footer Component
const Footer = () => {
  return (
    <footer className="py-10 text-center bg-gray-100">
      <p>&copy; {new Date().getFullYear()} Hang. All rights reserved.</p>
    </footer>
  );
}
