
import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage.ts';
import type { Program } from '../types.ts';
import { Edit, Trash2, Plus, X } from 'lucide-react';

export const AdminPrograms: React.FC = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProgram, setCurrentProgram] = useState<Partial<Program>>({});

    useEffect(() => {
        setPrograms(StorageService.getPrograms());
        setCategories(StorageService.getSettings().programCategories);
    }, []);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure?')) {
            const updated = programs.filter(p => p.id !== id);
            setPrograms(updated);
            StorageService.savePrograms(updated);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        let updatedPrograms;
        // Default category if none selected or dynamic lists changed
        const safeProgram = {
            ...currentProgram,
            category: currentProgram.category || categories[0] || 'General'
        };

        if (safeProgram.id) {
            updatedPrograms = programs.map(p => p.id === safeProgram.id ? safeProgram as Program : p);
        } else {
            const newProgram = { ...safeProgram, id: Date.now().toString(), isEnabled: true } as Program;
            updatedPrograms = [...programs, newProgram];
        }
        setPrograms(updatedPrograms);
        StorageService.savePrograms(updatedPrograms);
        setIsModalOpen(false);
        setCurrentProgram({});
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Programs</h1>
                <button 
                    onClick={() => { setCurrentProgram({ category: categories[0] }); setIsModalOpen(true); }}
                    className="flex items-center bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-hover"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Program
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map(program => (
                    <div key={program.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden relative">
                         <div className="h-40 bg-gray-200">
                             <img src={program.image} alt="" className="w-full h-full object-cover" />
                         </div>
                         <div className="p-4">
                             <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg">{program.name}</h3>
                                <span className={`text-xs px-2 py-1 rounded ${program.isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {program.isEnabled ? 'Active' : 'Disabled'}
                                </span>
                             </div>
                             <p className="text-sm text-gray-500 mt-1">{program.category}</p>
                             <div className="flex justify-end mt-4 space-x-2">
                                <button onClick={() => { setCurrentProgram(program); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="h-4 w-4" /></button>
                                <button onClick={() => handleDelete(program.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                             </div>
                         </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{currentProgram.id ? 'Edit' : 'Add'} Program</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input required type="text" className="w-full border rounded px-3 py-2" value={currentProgram.name || ''} onChange={e => setCurrentProgram({...currentProgram, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <textarea required className="w-full border rounded px-3 py-2" rows={3} value={currentProgram.description || ''} onChange={e => setCurrentProgram({...currentProgram, description: e.target.value})}></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Category</label>
                                    <select className="w-full border rounded px-3 py-2" value={currentProgram.category || ''} onChange={e => setCurrentProgram({...currentProgram, category: e.target.value})}>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Price (Text)</label>
                                    <input type="text" className="w-full border rounded px-3 py-2" value={currentProgram.price || ''} onChange={e => setCurrentProgram({...currentProgram, price: e.target.value})} placeholder="e.g. ₹5000/mo" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Image URL</label>
                                <input required type="text" className="w-full border rounded px-3 py-2" value={currentProgram.image || ''} onChange={e => setCurrentProgram({...currentProgram, image: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Discount %</label>
                                <input type="number" className="w-full border rounded px-3 py-2" value={currentProgram.discountPercentage || 0} onChange={e => setCurrentProgram({...currentProgram, discountPercentage: Number(e.target.value)})} />
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" className="mr-2" checked={currentProgram.isEnabled ?? true} onChange={e => setCurrentProgram({...currentProgram, isEnabled: e.target.checked})} />
                                <label>Enable Program</label>
                            </div>
                            <button type="submit" className="w-full bg-secondary text-white py-2 rounded font-bold">Save Program</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
