
import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage.ts';
import type { LegalPage } from '../types.ts';
import { Edit, Trash2, Plus, X, Eye, EyeOff } from 'lucide-react';

export const AdminLegalPages: React.FC = () => {
    const [pages, setPages] = useState<LegalPage[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<Partial<LegalPage>>({});

    useEffect(() => {
        setPages(StorageService.getLegalPages());
    }, []);

    const handleDelete = (id: string) => {
        if (window.confirm('Delete this page?')) {
            const updated = pages.filter(p => p.id !== id);
            setPages(updated);
            StorageService.saveLegalPages(updated);
        }
    };

    const toggleVisibility = (id: string) => {
        const updated = pages.map(p => p.id === id ? { ...p, isVisible: !p.isVisible } : p);
        setPages(updated);
        StorageService.saveLegalPages(updated);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        let updated;
        // Simple slug generation if not provided
        const genSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const slug = currentPage.slug || genSlug(currentPage.title || '');

        const pageData = { ...currentPage, slug, isVisible: currentPage.isVisible ?? true } as LegalPage;

        if (currentPage.id) {
            updated = pages.map(p => p.id === currentPage.id ? pageData : p);
        } else {
            updated = [...pages, { ...pageData, id: Date.now().toString() }];
        }
        setPages(updated);
        StorageService.saveLegalPages(updated);
        setIsModalOpen(false);
        setCurrentPage({});
    };

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Legal Pages</h1>
                <button 
                    onClick={() => { setCurrentPage({}); setIsModalOpen(true); }}
                    className="flex items-center bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-hover"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Page
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL Slug</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pages.map(page => (
                            <tr key={page.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{page.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">/legal/{page.slug}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button 
                                        onClick={() => toggleVisibility(page.id)}
                                        className={`flex items-center text-xs font-bold px-2 py-1 rounded ${page.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}
                                    >
                                        {page.isVisible ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                                        {page.isVisible ? 'Visible' : 'Hidden'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => { setCurrentPage(page); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="h-4 w-4" /></button>
                                    <button onClick={() => handleDelete(page.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{currentPage.id ? 'Edit' : 'Create'} Legal Page</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Page Title</label>
                                    <input required type="text" className="w-full border rounded px-3 py-2" value={currentPage.title || ''} onChange={e => setCurrentPage({...currentPage, title: e.target.value})} placeholder="e.g. Cookie Policy" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Slug (URL)</label>
                                    <input type="text" className="w-full border rounded px-3 py-2" value={currentPage.slug || ''} onChange={e => setCurrentPage({...currentPage, slug: e.target.value})} placeholder="cookie-policy (auto-generated if empty)" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium">Page Content (HTML)</label>
                                <p className="text-xs text-gray-500 mb-2">You can use HTML tags like &lt;h1&gt;, &lt;p&gt;, &lt;ul&gt;, etc.</p>
                                <textarea required rows={15} className="w-full border rounded px-3 py-2 font-mono text-sm" value={currentPage.content || ''} onChange={e => setCurrentPage({...currentPage, content: e.target.value})} placeholder="<h1>Policy Title</h1><p>Policy content...</p>"></textarea>
                            </div>

                            <button type="submit" className="w-full bg-secondary text-white py-2 rounded font-bold hover:bg-secondary-hover">Save Page</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
