
import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage.ts';
import type { PlanInquiry, FreeResource } from '../types.ts';
import { Download, Trash2, Plus, X } from 'lucide-react';

export const AdminPlanInquiries: React.FC = () => {
    const [inquiries, setInquiries] = useState<PlanInquiry[]>([]);
    const [resources, setResources] = useState<FreeResource[]>([]);
    const [activeTab, setActiveTab] = useState<'inquiries' | 'resources'>('inquiries');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRes, setCurrentRes] = useState<Partial<FreeResource>>({});

    useEffect(() => {
        setInquiries(StorageService.getPlanInquiries());
        setResources(StorageService.getFreeResources());
    }, []);

    const handleDeleteInquiry = (id: string) => {
        if (window.confirm('Delete this inquiry?')) {
            StorageService.deletePlanInquiry(id);
            setInquiries(StorageService.getPlanInquiries());
        }
    };

    const handleDeleteResource = (id: string) => {
        if (window.confirm('Delete this resource?')) {
            const updated = resources.filter(r => r.id !== id);
            setResources(updated);
            StorageService.saveFreeResources(updated);
        }
    };

    const handleSaveResource = (e: React.FormEvent) => {
        e.preventDefault();
        const newResource = { ...currentRes, id: Date.now().toString() } as FreeResource;
        const updated = [...resources, newResource];
        setResources(updated);
        StorageService.saveFreeResources(updated);
        setIsModalOpen(false);
        setCurrentRes({});
    };

    const exportCSV = () => {
        const headers = 'ID,Name,Email,Phone,Type,Goals,Date';
        const rows = inquiries.map(i => `${i.id},"${i.name}","${i.email}","${i.phone}",${i.type},"${i.goals}",${i.date}`);
        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'plan_inquiries.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Custom Plan Manager</h1>
                <div className="space-x-4">
                    <button 
                        onClick={() => setActiveTab('inquiries')}
                        className={`px-4 py-2 rounded font-bold ${activeTab === 'inquiries' ? 'bg-black text-white' : 'bg-white text-gray-700'}`}
                    >
                        Inquiries
                    </button>
                    <button 
                        onClick={() => setActiveTab('resources')}
                        className={`px-4 py-2 rounded font-bold ${activeTab === 'resources' ? 'bg-black text-white' : 'bg-white text-gray-700'}`}
                    >
                        Free Resources
                    </button>
                </div>
            </div>

            {activeTab === 'inquiries' && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                        <span className="font-bold text-gray-700">Recent Requests</span>
                        <button onClick={exportCSV} className="text-sm bg-green-600 text-white px-3 py-1 rounded flex items-center">
                            <Download className="h-4 w-4 mr-1" /> Export CSV
                        </button>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {inquiries.length === 0 ? <li className="p-8 text-center text-gray-500">No inquiries yet.</li> : inquiries.map(inq => (
                            <li key={inq.id} className="p-6 hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center mb-1">
                                            <span className={`text-xs font-bold uppercase px-2 py-1 rounded mr-3 ${inq.type === 'Diet' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {inq.type} Plan
                                            </span>
                                            <h3 className="font-bold text-lg">{inq.name}</h3>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">{inq.email} &bull; {inq.phone}</p>
                                        <p className="text-gray-700 bg-gray-50 p-3 rounded text-sm italic">"{inq.goals}"</p>
                                        <p className="text-xs text-gray-400 mt-2">{new Date(inq.date).toLocaleString()}</p>
                                    </div>
                                    <button onClick={() => handleDeleteInquiry(inq.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-5 w-5" /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'resources' && (
                <div>
                     <div className="flex justify-end mb-4">
                         <button onClick={() => setIsModalOpen(true)} className="bg-secondary text-white px-4 py-2 rounded flex items-center hover:bg-secondary-hover">
                             <Plus className="h-4 w-4 mr-2" /> Add Resource
                         </button>
                     </div>
                     <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Link</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {resources.map(res => (
                                    <tr key={res.id}>
                                        <td className="px-6 py-4">{res.title}</td>
                                        <td className="px-6 py-4"><span className="text-xs bg-gray-100 px-2 py-1 rounded">{res.type}</span></td>
                                        <td className="px-6 py-4 text-blue-600 truncate max-w-xs"><a href={res.link} target="_blank" rel="noreferrer">{res.link}</a></td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleDeleteResource(res.id)} className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add Downloadable Resource</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleSaveResource} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Title</label>
                                <input required type="text" className="w-full border rounded px-3 py-2" value={currentRes.title || ''} onChange={e => setCurrentRes({...currentRes, title: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Type</label>
                                <select className="w-full border rounded px-3 py-2" value={currentRes.type || 'Diet'} onChange={e => setCurrentRes({...currentRes, type: e.target.value as 'Diet' | 'Workout'})}>
                                    <option value="Diet">Diet</option>
                                    <option value="Workout">Workout</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Download Link (PDF/Drive)</label>
                                <input required type="url" className="w-full border rounded px-3 py-2" value={currentRes.link || ''} onChange={e => setCurrentRes({...currentRes, link: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Short Description</label>
                                <input type="text" className="w-full border rounded px-3 py-2" value={currentRes.description || ''} onChange={e => setCurrentRes({...currentRes, description: e.target.value})} />
                            </div>
                            <button type="submit" className="w-full bg-black text-white py-2 rounded font-bold">Add Resource</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
