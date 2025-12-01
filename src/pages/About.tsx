import React from 'react';
import { SectionHeader } from '../components/SectionHeader.tsx';

export const About: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase mb-4">About Us</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">More than just a gym. We are a training ground for success.</p>
        </div>
      </div>

      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
                <img 
                    src="https://images.unsplash.com/photo-1549476464-d649327564b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                    alt="Team" 
                    className="rounded-lg shadow-xl"
                />
            </div>
            <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                    Athletes Aura was founded in 2018 with a simple yet powerful vision: to democratize high-performance training. 
                    Traditionally, elite coaching and programming were reserved for professional athletes. We wanted to change that.
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed">
                    We built a facility where discipline meets community. A place where the mother of two trains alongside the 
                    collegiate linebacker, both pursuing their own versions of peak performance.
                </p>
            </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeader title="Our Values" subtitle="The pillars that define our culture" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                {[
                    { title: 'Discipline', desc: 'Consistency over intensity. Showing up is half the battle.' },
                    { title: 'Growth', desc: 'We never settle. We are always learning, improving, and evolving.' },
                    { title: 'Health', desc: 'Performance shouldn\'t come at the cost of long-term health.' },
                    { title: 'Community', desc: 'We lift each other up. Your win is our win.' }
                ].map((val, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-bold text-secondary mb-3">{val.title}</h3>
                        <p className="text-gray-600">{val.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};