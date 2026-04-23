import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#050510] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050510]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <span className="font-bold text-lg italic">D</span>
            </div>
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Dynami<span className="text-blue-500">Code</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="px-6 py-2.5 text-sm font-semibold border border-blue-500/30 rounded-full hover:bg-blue-500/5 transition-all">
              Log In
            </Link>
            <Link to="/register" className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-40 pb-20 px-4 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              AI-Powered Coding
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Level Up Your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-gradient-x">
                Coding Skills
              </span> <br />
              with AI
            </h1>
            <p className="text-xl text-gray-400 max-w-xl">
              Personalized coding challenges that adapt to your progress. 
              Master Algorithms, Data Structures, and more with real-time AI feedback.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                Get Started for Free
              </Link>
              <a href="#features" className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm">
                Learn More
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 blur-[100px] rounded-full animate-pulse" />
            <div className="relative z-10 p-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <div className="ml-4 text-xs text-gray-500 font-mono">ai-coding-workspace.js</div>
              </div>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex gap-4">
                  <span className="text-gray-600">01</span>
                  <span className="text-purple-400">function</span>
                  <span className="text-blue-400">optimizeCode</span>
                  <span className="text-gray-300">(input) &#123;</span>
                </div>
                <div className="flex gap-4 pl-4">
                  <span className="text-gray-600">02</span>
                  <span className="text-gray-400">// AI analyzing logic...</span>
                </div>
                <div className="flex gap-4 pl-4">
                  <span className="text-gray-600">03</span>
                  <span className="text-purple-400">const</span>
                  <span className="text-white">efficiency</span>
                  <span className="text-gray-300">=</span>
                  <span className="text-yellow-400">AI.calculate</span>
                  <span className="text-gray-300">(input);</span>
                </div>
                <div className="flex gap-4 pl-4">
                  <span className="text-gray-600">04</span>
                  <span className="text-purple-400">return</span>
                  <span className="text-blue-400">input.map</span>
                  <span className="text-gray-300">(item =&gt; item * efficiency);</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600">05</span>
                  <span className="text-gray-300">&#125;</span>
                </div>
              </div>
              

              <div className="absolute -bottom-6 -left-6 p-6 bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">AI Suggestion</div>
                    <div className="text-sm font-medium">Use Hash Map for O(1) lookups</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

 
      <section id="features" className="py-24 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">Everything you need to master coding</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Powerful tools designed to help you learn faster and build smarter applications.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-500">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Adaptive Challenges</h3>
              <p className="text-gray-400 leading-relaxed">
                Our AI analyzes your performance and generates personalized coding problems that target your weaknesses.
              </p>
            </div>

            <div className="group p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.08] hover:border-purple-500/30 transition-all duration-500">
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Real-Time Feedback</h3>
              <p className="text-gray-400 leading-relaxed">
                Get instant AI code reviews, optimization tips, and detailed explanations as you write your solutions.
              </p>
            </div>

    
            <div className="group p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-500">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Track Progress</h3>
              <p className="text-gray-400 leading-relaxed">
                Visualize your skill growth across different categories with detailed analytics and performance graphs.
              </p>
            </div>
          </div>
        </div>
      </section>

 
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">Your Personalized Dashboard</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Track your journey to becoming a pro developer.</p>
          </div>

          <div className="relative h-[600px] max-w-5xl mx-auto">
           
            <div className="absolute top-0 left-0 w-full md:w-[70%] z-20 p-8 bg-[#0A0A1F] border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl">
              <div className="flex justify-between items-center mb-8">
                <h4 className="font-bold text-xl">Performance Analytics</h4>
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-bold">Weekly</div>
                  <div className="px-3 py-1 bg-white/5 text-gray-500 rounded-lg text-xs font-bold">Monthly</div>
                </div>
              </div>
              <div className="h-64 flex items-end gap-4">
                {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-blue-600/20 to-blue-500/50 rounded-t-lg transition-all hover:to-blue-400" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-gray-500 font-mono">
                <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
              </div>
            </div>

            
            <div className="absolute bottom-10 right-0 w-full md:w-[45%] z-30 p-8 bg-[#0D0D26] border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl translate-y-10">
              <h4 className="font-bold text-xl mb-6">Skills Mastery</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Algorithms</span>
                    <span className="text-sm font-bold text-blue-400">85%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-blue-600 to-blue-400" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Data Structures</span>
                    <span className="text-sm font-bold text-purple-400">72%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[72%] bg-gradient-to-r from-purple-600 to-purple-400" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Databases</span>
                    <span className="text-sm font-bold text-blue-400">60%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[60%] bg-gradient-to-r from-blue-600 to-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto p-12 md:p-20 rounded-[40px] bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-blue-600/10 border border-white/10 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.1)_0%,_transparent_70%)]" />
          <h2 className="text-4xl md:text-6xl font-bold relative z-10">Start Coding Smarter Today</h2>
          <p className="text-xl text-gray-400 relative z-10 max-w-2xl mx-auto">
            Join thousands of developers who are already leveling up their careers with DynamiCode.
          </p>
          <div className="relative z-10 pt-4">
            <Link to="/register" className="inline-block px-12 py-5 bg-white text-[#050510] font-bold rounded-2xl hover:bg-blue-50 hover:scale-105 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
              Join DynamiCode Now
            </Link>
          </div>
        </div>
      </section>


      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-xs font-bold italic">D</span>
            </div>
            <span className="text-lg font-bold">DynamiCode</span>
          </div>
          <p className="text-gray-500 text-sm">&copy; 2026 DynamiCode. All rights reserved.</p>
          <div className="flex gap-6 text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 5s ease infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default Landing;