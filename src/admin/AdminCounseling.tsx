
import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage.ts';
import type { CounselingService } from '../types.ts';
import { Edit, Trash2, Plus, X } from 'lucide-react';

export const AdminCounseling: React.FC = () => {
    const [services, setServices] = useState<CounselingService[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState<Partial<CounselingService>>({});

    useEffect(() => {
        setServices(StorageService.getCounselingServices());
    }, []);

    const handleDelete = (id: string) => {
        if (window.confirm('Delete this service?')) {
            const updated = services.filter(s => s.id !== id);
            setServices(updated);
            StorageService.saveCounselingServices(updated);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        let updatedServices;
        const serviceData = { 
            ...currentService, 
            price: Number(currentService.price),
            isEnabled: currentService.isEnabled ?? true
        } as CounselingService;

        if (currentService.id) {
            updatedServices = services.map(s => s.id === currentService.id ? serviceData : s);
        } else {
            const newService = { ...serviceData, id: Date.now().toString() };
            updatedServices = [...services, newService];
        }
        setServices(updatedServices);
        StorageService.saveCounselingServices(updatedServices);
        setIsModalOpen(false);
        setCurrentService({});
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Counseling Services</h1>
                <button 
                    onClick={() => { setCurrentService({ price: 0 }); setIsModalOpen(true); }}
                    className="flex items-center bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-hover"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Service
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <div key={service.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                         <div className="h-40 bg-gray-200">
                             <img src={service.image} alt="" className="w-full h-full object-cover" />
                         </div>
                         <div className="p-4">
                             <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">{service.title}</h3>
                                <span className="font-bold text-secondary">₹{service.price}</span>
                             </div>
                             <p className="text-xs text-gray-500 mb-2 font-bold uppercase">{service.duration}</p>
                             <p className="text-sm text-gray-600 mb-4 h-10 line-clamp-2">{service.description}</p>
                             <div className="flex justify-end space-x-2 border-t pt-3">
                                <button onClick={() => { setCurrentService(service); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="h-4 w-4" /></button>
                                <button onClick={() => handleDelete(service.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                             </div>
                         </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{currentService.id ? 'Edit' : 'Add'} Service</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Title</label>
                                <input required type="text" className="w-full border rounded px-3 py-2" value={currentService.title || ''} onChange={e => setCurrentService({...currentService, title: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <textarea required className="w-full border rounded px-3 py-2" rows={3} value={currentService.description || ''} onChange={e => setCurrentService({...currentService, description: e.target.value})}></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Price (₹)</label>
                                    <input required type="number" className="w-full border rounded px-3 py-2" value={currentService.price || 0} onChange={e => setCurrentService({...currentService, price: Number(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Duration</label>
                                    <input required type="text" className="w-full border rounded px-3 py-2" value={currentService.duration || ''} onChange={e => setCurrentService({...currentService, duration: e.target.value})} placeholder="e.g. 45 Mins" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Image URL</label>
                                <input required type="text" className="w-full border rounded px-3 py-2" value={currentService.image || ''} onChange={e => setCurrentService({...currentService, image: e.target.value})} />
                            </div>
                            <button type="submit" className="w-full bg-secondary text-white py-2 rounded font-bold">Save Service</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
