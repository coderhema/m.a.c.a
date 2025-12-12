"use client";

import React, { useState } from "react";
import { PiList, PiX, PiArrowUpRight, PiLeaf, PiHeartbeat, PiChartLine, PiVideoCamera, PiBrain } from "react-icons/pi";
import Link from "next/link";

// --- CSS-based MonitoringGauge Component ---
function MonitoringGauge() {
  return (
    <div className="w-[180px] h-[100px] relative">
      {/* Gauge background arc */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[160px] h-[80px] overflow-hidden">
        <div 
          className="w-[160px] h-[160px] rounded-full border-[20px] border-gray-800"
          style={{
            borderTopColor: '#36e27b',
            borderRightColor: '#36e27b',
            borderBottomColor: 'transparent',
            transform: 'rotate(-45deg)',
          }}
        />
      </div>
      {/* Center dot */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full z-10 shadow-[0_0_10px_rgba(54,226,123,0.5)]" />
      {/* Needle */}
      <div 
        className="absolute bottom-0 left-1/2 w-1 h-[70px] bg-primary origin-bottom rounded-full z-0"
        style={{ transform: 'translateX(-50%) rotate(-45deg)' }}
      />
    </div>
  );
}

// --- MonitoringCard Component ---
function MonitoringCard() {
  return (
    <div className="mt-4 bg-gray-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl w-full border border-gray-800">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="relative z-10 flex justify-between items-start mb-8">
        <div>
          <h3 className="text-2xl font-medium mb-1">Real-Time</h3>
          <h3 className="text-2xl font-medium text-gray-400">Monitoring</h3>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <span className="text-xs font-semibold text-white">Live</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="flex-1 w-full sm:w-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold tracking-tight">1,293</span>
            <span className="text-sm text-green-400 font-medium">↑ 12%</span>
          </div>
          <div className="text-sm text-gray-400 mt-1">Active Patients Monitored</div>
          
          <Link href="/health/dashboard">
            <button className="mt-6 bg-primary hover:bg-primary/90 text-black px-6 py-2.5 rounded-xl text-sm font-medium transition-colors w-full sm:w-auto cursor-pointer">
              View Dashboard
            </button>
          </Link>
        </div>
        
        <div className="flex-shrink-0 bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
          <MonitoringGauge />
        </div>
      </div>
    </div>
  );
}

// --- StatsCard Component ---
interface StatsCardProps {
  theme: "light" | "dark";
  icon: React.ReactNode;
  value: string;
  label: string;
  subLabel?: string;
}

function StatsCard({ theme, icon, value, label, subLabel }: StatsCardProps) {
  const isDark = theme === "dark";
  
  return (
    <div className={`
      relative h-full w-full rounded-[2.5rem] p-6 flex flex-col justify-between transition-transform hover:scale-[1.02] duration-300 shadow-lg
      ${isDark 
        ? "bg-gradient-to-br from-emerald-900 to-gray-900 text-white border border-gray-800" 
        : "bg-gray-800 text-white border border-gray-700"}
    `}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-3xl font-bold tracking-tight mb-1">{value}</span>
          <span className={`text-sm font-medium ${isDark ? "text-emerald-300" : "text-gray-400"}`}>{label}</span>
        </div>
        <button 
          aria-label="View details"
          className={`
          p-2 rounded-full cursor-pointer
          ${isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"}
        `}>
          <PiArrowUpRight size={18} />
        </button>
      </div>

      <div className="self-center my-4 transform hover:scale-110 transition-transform duration-500">
        <div className="drop-shadow-2xl filter">
          {icon}
        </div>
      </div>
      
      {subLabel && (
        <div className={`text-xs ${isDark ? "text-emerald-300" : "text-gray-400"}`}>
          {subLabel}
        </div>
      )}
    </div>
  );
}

// --- HeroContent Component ---
function HeroContent() {
  return (
    <div className="flex flex-col gap-8 lg:gap-12 text-center lg:text-left h-full justify-center">
      {/* Headings */}
      <div className="space-y-6">
        <h1 className="text-5xl sm:text-6xl xl:text-[5.5rem] font-bold tracking-tight leading-[0.95] text-white">
          Connected <br />
          <span className="text-primary">Medical</span> <br />
          Solutions
        </h1>
        <p className="text-base sm:text-lg xl:text-xl text-gray-400 max-w-2xl mt-4 sm:mt-6 leading-relaxed mx-auto lg:mx-0">
          Seamless medical technology designed to improve patient outcomes through real-time data and AI-driven insights.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
        <Link href="/health/dashboard">
          <button className="bg-primary hover:bg-primary/90 text-black px-10 py-4 rounded-full font-medium transition-all shadow-lg shadow-primary/25 flex items-center gap-2 w-full sm:w-auto justify-center text-lg cursor-pointer">
            Get Started
          </button>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-800 bg-gray-600" />
            ))}
          </div>
          <div className="text-left">
            <span className="block text-xl font-bold text-white leading-none">200+</span>
            <span className="text-xs text-gray-400 font-medium">Hospitals and Clinics</span>
          </div>
        </div>
      </div>

      <MonitoringCard />
    </div>
  );
}

// --- HeroVisuals Component ---
function HeroVisuals() {
  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Bento Grid Visuals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-auto lg:h-[600px]">
        
        {/* Main Image Container */}
        <div className="relative h-[400px] sm:h-full rounded-[2.5rem] overflow-hidden group">
          <div className="absolute inset-0 bg-gray-800">
            <img 
              src="/maca_1.png" 
              alt="Medical Professional" 
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          
          {/* Floating Experts Pill */}
          <div className="absolute bottom-6 left-6 right-6 bg-gradient-to-r from-primary to-emerald-500 p-4 rounded-2xl shadow-xl flex items-center gap-4 text-black z-20 backdrop-blur-sm bg-opacity-90">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img 
                  key={i}
                  src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                  alt="Expert"
                  className="w-8 h-8 rounded-full border-2 border-primary"
                />
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">+500 Experts</div>
              <div className="text-[10px] text-emerald-900 truncate">Trust our solutions</div>
            </div>
          </div>
        </div>

        {/* Right Column Cards */}
        <div className="flex flex-col gap-4 h-full">
          {/* Top Card */}
          <div className="flex-1 min-h-[220px]">
            <StatsCard 
              theme="dark"
              icon={<div className="text-4xl">💙</div>}
              value="50+"
              label="Specialties"
              subLabel="Across departments"
            />
          </div>

          {/* Bottom Card */}
          <div className="flex-1 min-h-[260px]">
            <StatsCard 
              theme="light"
              icon={<div className="text-4xl">🔬</div>}
              value="80+"
              label="Laboratories"
              subLabel="Integrated network"
            />
          </div>
        </div>
      </div>

      {/* Bottom Description Area */}
      <div className="pl-2 sm:pl-4 text-center sm:text-left mt-auto">
        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between border-t border-gray-800 pt-8">
          <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-md text-left">
            Helping medical teams provide better care with <span className="text-white font-semibold">advanced AI and 24/7 monitoring.</span>
          </p>
          <a href="#" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all bg-primary/10 px-6 py-3 rounded-full hover:bg-primary/20 whitespace-nowrap">
            Learn More <PiArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}

// --- Solutions Section with Stacked Cards ---
const solutions = [
  {
    icon: <PiBrain size={32} />,
    title: "AI Health Consultations",
    description: "Get instant, accurate health guidance powered by advanced AI that understands your symptoms and medical history.",
    color: "from-emerald-500 to-emerald-700",
  },
  {
    icon: <PiHeartbeat size={32} />,
    title: "Real-time Patient Monitoring",
    description: "Continuous vital signs tracking with instant alerts for healthcare providers when anomalies are detected.",
    color: "from-blue-500 to-blue-700",
  },
  {
    icon: <PiChartLine size={32} />,
    title: "Medical Analytics & Insights",
    description: "Transform patient data into actionable insights with powerful analytics dashboards and predictive models.",
    color: "from-purple-500 to-purple-700",
  },
  {
    icon: <PiVideoCamera size={32} />,
    title: "Telemedicine Integration",
    description: "Seamless video consultations with integrated health records and AI-assisted diagnosis support.",
    color: "from-orange-500 to-orange-700",
  },
];

function Solutions() {
  return (
    <section id="solutions" className="py-20 lg:py-32">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          What We <span className="text-primary">Do</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Comprehensive medical solutions powered by cutting-edge technology
        </p>
      </div>

      {/* Stacked Cards Container */}
      <div className="relative flex justify-center items-center min-h-[500px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="group relative"
              style={{
                transform: `translateY(${index * 4}px)`,
                zIndex: solutions.length - index,
              }}
            >
              <div
                className={`
                  relative bg-gray-900 border border-gray-800 rounded-3xl p-8
                  transition-all duration-500 ease-out
                  hover:scale-105 hover:-translate-y-2 hover:z-50
                  hover:shadow-2xl hover:shadow-primary/20
                  group-hover:border-primary/50
                `}
              >
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r ${solution.color}`} />
                
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${solution.color} text-white mb-6`}>
                  {solution.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {solution.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {solution.description}
                </p>

                {/* Hover arrow */}
                <div className="mt-6 flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <PiArrowUpRight size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Hero Component ---
function Hero() {
  return (
    <div className="pt-6 sm:pt-10 lg:pt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
      {/* Left Content Column */}
      <div className="flex flex-col justify-center">
        <HeroContent />
      </div>

      {/* Right Visual Column */}
      <div className="relative h-full min-h-[auto]">
        <HeroVisuals />
      </div>
    </div>
  );
}

// --- Navbar Component ---
const navLinks = [
  { label: "Home", href: "#" },
  { label: "Solutions", href: "#solutions" },
  { label: "Technology", href: "#" },
  { label: "Hospitals", href: "#" },
  { label: "Contact", href: "#" },
];

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="py-6 flex items-center justify-between relative z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <PiLeaf className="text-black" size={24} />
        </div>
        <span className="text-xl font-bold text-white">MACA</span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-gray-400 hover:text-white font-medium transition-colors"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Desktop CTA */}
      <div className="hidden lg:flex items-center gap-4">
        <Link href="/health/dashboard">
          <button className="bg-primary hover:bg-primary/90 text-black px-6 py-2.5 rounded-full font-medium transition-colors cursor-pointer">
            Get Started
          </button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden p-2 text-white cursor-pointer"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <PiX size={24} /> : <PiList size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-900 border border-gray-800 shadow-xl rounded-2xl p-6 lg:hidden mt-2">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-400 hover:text-white font-medium transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link href="/health/dashboard">
              <button className="bg-primary hover:bg-primary/90 text-black px-6 py-2.5 rounded-full font-medium transition-colors w-full mt-4 cursor-pointer">
                Get Started
              </button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

// --- Main LandingPage Component ---
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 scroll-smooth">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar />
        <Hero />
        <Solutions />
      </div>
    </div>
  );
}
