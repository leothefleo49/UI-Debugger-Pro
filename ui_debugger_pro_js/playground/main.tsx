import React from 'react';
import ReactDOM from 'react-dom/client';
import { UIDebugger } from '../src/index';

function App() {
  return (
    <div className="p-10 max-w-4xl mx-auto font-sans">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold mb-2 text-slate-900 tracking-tight">UI Debugger Pro <span className="text-indigo-600">Playground</span></h1>
        <p className="text-slate-500 text-lg">Test your UI debugging tools right here.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Card 1 */}
        <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-slate-100 group">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="text-2xl">🎨</span>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-slate-800">Design Mode</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Click the "Design" tab in the debugger, then click this card. Try changing the 
            <code className="bg-slate-100 px-1 py-0.5 rounded text-sm mx-1">box-shadow</code> 
            or <code className="bg-slate-100 px-1 py-0.5 rounded text-sm mx-1">border-radius</code>.
          </p>
          <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200">
            Interact With Me
          </button>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border-l-8 border-pink-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">NEW</div>
          <h2 className="text-2xl font-bold mb-3 text-slate-800">Layout & Spacing</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Use the "Audit" tab to check for alignment issues. This card has a deliberate 
            <span className="text-pink-600 font-bold"> thick border</span> on the left.
          </p>
          <div className="flex flex-wrap gap-2">
             <span className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-sm font-medium border border-pink-100">#layout</span>
             <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium border border-purple-100">#spacing</span>
             <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">#testing</span>
          </div>
        </div>
      </div>

      {/* Dark Section */}
      <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-2xl text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
         <h3 className="text-2xl font-bold mb-4">Dark Mode Testing</h3>
         <p className="text-slate-400 mb-8 max-w-lg mx-auto">
           Check how your debugger handles dark backgrounds. Try using the "Contrast" checker in the Audit tab.
         </p>
         <div className="flex justify-center gap-4">
           <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg backdrop-blur-sm transition border border-white/10">
             Glass Button
           </button>
           <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2 rounded-lg shadow-lg transition transform hover:-translate-y-0.5">
             Gradient Button
           </button>
         </div>
      </div>

      <footer className="mt-12 text-center text-slate-400 text-sm">
        <p>UI Debugger Pro v7.7.9 Playground</p>
      </footer>

      {/* The Debugger */}
      <UIDebugger />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);