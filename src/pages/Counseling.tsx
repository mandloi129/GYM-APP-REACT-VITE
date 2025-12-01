
import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage.ts';
import type { CounselingService, SiteSettings } from '../types.ts';
import { Clock } from 'lucide-react';

export const Counseling: React.FC = () => {
    const [services, setServices] = useState<CounselingService[]>([]);
    const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());

    useEffect(() => {
        setServices(StorageService.getCounselingServices().filter(s => s.isEnabled));
        setSettings(StorageService.getSettings());
    }, []);

    const getWhatsAppLink = (serviceTitle: string) => {
        // Use counseling specific number if available, otherwise default
        const number = settings.counselingWhatsapp || settings.whatsappNumber;
        const text = `Hi! I want to book the "${serviceTitle}" counseling session.`;
        return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-black py-20 mb-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase mb-4">Counseling</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">Mental conditioning and nutritional guidance for peak performance.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map(service => (
                        <div key={service.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition duration-300">
                            <div className="h-64 overflow-hidden relative">
                                <img src={service.image} alt={service.title} className="w-full h-full object-cover transform hover:scale-105 transition duration-500" />
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-sm font-bold flex items-center shadow">
                                    <Clock className="h-4 w-4 mr-1 text-secondary" /> {service.duration}
                                </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <h3 className="text-xl font-bold mb-2 text-gray-900">{service.title}</h3>
                                <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>
                                
                                <div className="mt-auto">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-2xl font-extrabold text-gray-900">₹{service.price}</span>
                                        <span className="text-xs text-gray-500 uppercase font-bold">Per Session</span>
                                    </div>
                                    <a 
                                        href={getWhatsAppLink(service.title)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block w-full bg-black hover:bg-gray-800 text-white text-center font-bold py-3 rounded uppercase transition"
                                    >
                                        Book Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {services.length === 0 && (
                    <div className="text-center text-gray-500 py-12">
                        <p>No counseling services available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
