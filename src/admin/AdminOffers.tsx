import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage.ts';
import type { Offer } from '../types.ts';
import { Edit, Trash2, Plus, X, Eye, EyeOff } from 'lucide-react';

export const AdminOffers: React.FC = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOffer, setCurrentOffer] = useState<Partial<Offer>>({});

    useEffect(() => {
        setOffers(StorageService.getOffers());
    }, []);

    const handleDelete = (id: string) => {
        if (window.confirm('Delete this offer?')) {
            const updated = offers.filter(o => o.id !== id);
            setOffers(updated);
            StorageService.saveOffers(updated);
        }
    };

    const toggleStatus = (offer: Offer) => {
        const updated = offers.map(o => o.id === offer.id ? { ...o, isEnabled: !o.isEnabled } : o);
        setOffers(updated);
        StorageService.saveOffers(updated);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        let updatedOffers;
        if (currentOffer.id) {
            updatedOffers = offers.map(o => o.id === currentOffer.id ? currentOffer as Offer : o);
        } else {
            const newOffer = { ...currentOffer, id: Date.now().toString(), isEnabled: true } as Offer;
            updatedOffers = [...offers, newOffer];
        }
        setOffers(updatedOffers);
        StorageService.saveOffers(updatedOffers);
        setIsModalOpen(false);
        setCurrentOffer({});
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Offers & Promotions</h1>
                <button 
                    onClick={() => { setCurrentOffer({}); setIsModalOpen(true); }}
                    className="flex items-center bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-hover"
                >
                    <Plus className="h-4 w-4 mr-2" /> New Offer
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map(offer => (
                    <div key={offer.id} className={`bg-white rounded-lg shadow border overflow-hidden relative ${offer.isEnabled ? 'border-gray-200' : 'border-gray-300 opacity-75'}`}>
                         <div className="h-40 bg-gray-200 relative">
                             <img src={offer.image} alt="" className="w-full h-full object-cover" />
                             <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
                                 {offer.discountText}
                             </div>
                         </div>
                         <div className="p-4">
                             <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">{offer.title}</h3>
                             </div>
                             <p className="text-sm text-gray-600 mb-4 h-10 line-clamp-2">{offer.description}</p>
                             
                             <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                                <button onClick={() => toggleStatus(offer)} className={`flex items-center text-sm font-medium ${offer.isEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                                    {offer.isEnabled ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                                    {offer.isEnabled ? 'Active' : 'Hidden'}
                                </button>
                                <div className="flex space-x-1">
                                    <button onClick={() => { setCurrentOffer(offer); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="h-4 w-4" /></button>
                                    <button onClick={() => handleDelete(offer.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                                </div>
                             </div>
                         </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{currentOffer.id ? 'Edit' : 'Create'} Offer</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Offer Title</label>
                                <input required type="text" className="w-full border rounded px-3 py-2" value={currentOffer.title || ''} onChange={e => setCurrentOffer({...currentOffer, title: e.target.value})} placeholder="e.g. Summer Bootcamp" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <textarea required className="w-full border rounded px-3 py-2" rows={3} value={currentOffer.description || ''} onChange={e => setCurrentOffer({...currentOffer, description: e.target.value})}></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Discount Badge Text</label>
                                    <input required type="text" className="w-full border rounded px-3 py-2" value={currentOffer.discountText || ''} onChange={e => setCurrentOffer({...currentOffer, discountText: e.target.value})} placeholder="e.g. 50% OFF" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Image URL</label>
                                    <input required type="text" className="w-full border rounded px-3 py-2" value={currentOffer.image || ''} onChange={e => setCurrentOffer({...currentOffer, image: e.target.value})} />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-secondary text-white py-2 rounded font-bold hover:bg-secondary-hover mt-2">Save Offer</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};