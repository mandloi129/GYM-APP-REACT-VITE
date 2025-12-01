
import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage.ts';
import type { Testimonial } from '../types.ts';
import { Edit, Trash2, Plus, X } from 'lucide-react';

export const AdminTestimonials: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [current, setCurrent] = useState<Partial<Testimonial>>({});

    useEffect(() => {
        setTestimonials(StorageService.getTestimonials());
    }, []);

    const handleDelete = (id: string) => {
        if (window.confirm('Delete this testimonial?')) {
            const updated = testimonials.filter(t => t.id !== id);
            setTestimonials(updated);
            StorageService.saveTestimonials(updated);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        let updated;
        if (current.id) {
            updated = testimonials.map(t => t.id === current.id ? current as Testimonial : t);
        } else {
            updated = [...testimonials, { ...current, id: Date.now().toString() } as Testimonial];
        }
        setTestimonials(updated);
        StorageService.saveTestimonials(updated);
        setIsModalOpen(false);
        setCurrent({});
    };

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Testimonials</h1>
                <button 
                    onClick={() => { setCurrent({}); setIsModalOpen(true); }}
                    className="flex items-center bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-hover"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Story
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-lg shadow border border-gray-200 flex gap-4">
                        <img src={item.image} alt="" className="w-16 h-16 rounded-full object-cover shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-bold">{item.name}</h3>
                            <p className="text-secondary text-xs uppercase font-bold mb-2">{item.role}</p>
                            <p className="text-gray-600 text-sm italic mb-4">"{item.content}"</p>
                            <div className="flex justify-end space-x-2">
                                <button onClick={() => { setCurrent(item); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800"><Edit className="h-4 w-4" /></button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{current.id ? 'Edit' : 'Add'} Testimonial</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Person Name</label>
                                <input required type="text" className="w-full border rounded px-3 py-2" value={current.name || ''} onChange={e => setCurrent({...current, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Role (e.g. Pro Athlete)</label>
                                <input required type="text" className="w-full border rounded px-3 py-2" value={current.role || ''} onChange={e => setCurrent({...current, role: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Quote / Story</label>
                                <textarea required rows={3} className="w-full border rounded px-3 py-2" value={current.content || ''} onChange={e => setCurrent({...current, content: e.target.value})}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Image URL</label>
                                <input required type="text" className="w-full border rounded px-3 py-2" value={current.image || ''} onChange={e => setCurrent({...current, image: e.target.value})} />
                            </div>
                            <button type="submit" className="w-full bg-black text-white py-2 rounded font-bold">Save</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
