import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage.ts';
import type { Coach } from '../types.ts';
import { Edit, Trash2, Plus, X, Upload } from 'lucide-react';

export const AdminCoaches: React.FC = () => {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCoach, setCurrentCoach] = useState<Partial<Coach>>({});

    useEffect(() => {
        setCoaches(StorageService.getCoaches());
    }, []);

    const handleDelete = (id: string) => {
        if (window.confirm('Delete this coach profile?')) {
            const updated = coaches.filter(c => c.id !== id);
            setCoaches(updated);
            StorageService.saveCoaches(updated);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        let updatedCoaches;
        const coachToSave = {
            ...currentCoach,
            socials: currentCoach.socials || {}
        };

        if (currentCoach.id) {
            updatedCoaches = coaches.map(c => c.id === currentCoach.id ? coachToSave as Coach : c);
        } else {
            const newCoach = { ...coachToSave, id: Date.now().toString() } as Coach;
            updatedCoaches = [...coaches, newCoach];
        }
        setCoaches(updatedCoaches);
        StorageService.saveCoaches(updatedCoaches);
        setIsModalOpen(false);
        setCurrentCoach({});
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Coaches</h1>
                <button 
                    onClick={() => { setCurrentCoach({ socials: {} }); setIsModalOpen(true); }}
                    className="flex items-center bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-hover"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Coach
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coaches.map(coach => (
                    <div key={coach.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
                         <div className="h-48 bg-gray-200">
                             <img src={coach.image} alt={coach.name} className="w-full h-full object-cover" />
                         </div>
                         <div className="p-4 flex-grow flex flex-col">
                             <h3 className="font-bold text-lg">{coach.name}</h3>
                             <p className="text-secondary text-sm font-semibold uppercase mb-2">{coach.role}</p>
                             <div className="text-xs text-gray-500 space-y-1 mb-4 flex-grow">
                                <p><strong>Exp:</strong> {coach.experience}</p>
                                <p className="truncate"><strong>Certs:</strong> {coach.certifications}</p>
                             </div>
                             <div className="flex justify-end mt-auto pt-4 border-t border-gray-100 space-x-2">
                                <button onClick={() => { setCurrentCoach(coach); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="h-4 w-4" /></button>
                                <button onClick={() => handleDelete(coach.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                             </div>
                         </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{currentCoach.id ? 'Edit' : 'Add'} Coach</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Full Name</label>
                                    <input required type="text" className="w-full border rounded px-3 py-2" value={currentCoach.name || ''} onChange={e => setCurrentCoach({...currentCoach, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Role / Title</label>
                                    <input required type="text" className="w-full border rounded px-3 py-2" value={currentCoach.role || ''} onChange={e => setCurrentCoach({...currentCoach, role: e.target.value})} />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Experience (e.g. 5 Years)</label>
                                    <input required type="text" className="w-full border rounded px-3 py-2" value={currentCoach.experience || ''} onChange={e => setCurrentCoach({...currentCoach, experience: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Certifications</label>
                                    <input required type="text" className="w-full border rounded px-3 py-2" value={currentCoach.certifications || ''} onChange={e => setCurrentCoach({...currentCoach, certifications: e.target.value})} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Achievements</label>
                                <textarea className="w-full border rounded px-3 py-2" rows={2} value={currentCoach.achievements || ''} onChange={e => setCurrentCoach({...currentCoach, achievements: e.target.value})}></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Profile Image URL</label>
                                <div className="flex">
                                    <input required type="text" className="w-full border rounded-l px-3 py-2" value={currentCoach.image || ''} onChange={e => setCurrentCoach({...currentCoach, image: e.target.value})} />
                                    <div className="bg-gray-100 border border-l-0 rounded-r px-3 py-2 flex items-center text-gray-500">
                                        <Upload className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-bold text-sm mb-2">Social Usernames (Optional)</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500">Instagram</label>
                                        <input type="text" className="w-full border rounded px-2 py-1 text-sm" placeholder="@username" value={currentCoach.socials?.instagram || ''} onChange={e => setCurrentCoach({...currentCoach, socials: {...currentCoach.socials, instagram: e.target.value}})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500">YouTube</label>
                                        <input type="text" className="w-full border rounded px-2 py-1 text-sm" placeholder="Channel" value={currentCoach.socials?.youtube || ''} onChange={e => setCurrentCoach({...currentCoach, socials: {...currentCoach.socials, youtube: e.target.value}})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500">LinkedIn</label>
                                        <input type="text" className="w-full border rounded px-2 py-1 text-sm" placeholder="profile-id" value={currentCoach.socials?.linkedin || ''} onChange={e => setCurrentCoach({...currentCoach, socials: {...currentCoach.socials, linkedin: e.target.value}})} />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-secondary text-white py-2 rounded font-bold hover:bg-secondary-hover mt-4">Save Profile</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};