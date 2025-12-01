import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage.ts';
import type { Testimonial } from '../types.ts';
import { Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    setTestimonials(StorageService.getTestimonials());
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
       <div className="bg-black py-20 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase mb-4">Success Stories</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Real results from real athletes. Join the aura.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-xl shadow-lg relative pt-12">
                    <Quote className="absolute top-8 left-8 h-12 w-12 text-secondary opacity-20" />
                    <div className="relative z-10">
                        <p className="text-gray-600 mb-6 italic text-lg leading-relaxed">"{item.content}"</p>
                        <div className="flex items-center border-t border-gray-100 pt-6">
                            <img src={item.image} alt={item.name} className="h-12 w-12 rounded-full object-cover mr-4" />
                            <div>
                                <h4 className="font-bold text-gray-900">{item.name}</h4>
                                <p className="text-sm text-secondary font-semibold uppercase">{item.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
         </div>
         
         <div className="mt-20 text-center bg-gray-900 text-white rounded-2xl p-12 relative overflow-hidden">
             <div className="relative z-10">
                 <h2 className="text-3xl font-bold mb-4 uppercase">Ready to write your story?</h2>
                 <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Join the hundreds of athletes who have transformed their performance and lives at Athletes Aura.</p>
                 <a href="/#/membership" className="inline-block bg-secondary text-white font-bold py-4 px-8 rounded uppercase hover:bg-white hover:text-black transition">Start Today</a>
             </div>
         </div>
      </div>
    </div>
  );
};