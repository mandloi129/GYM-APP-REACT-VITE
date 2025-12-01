import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage.ts';
import type { BlogPost } from '../types.ts';
import { Edit, Trash2, Plus, X } from 'lucide-react';

export const AdminBlogs: React.FC = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBlog, setCurrentBlog] = useState<Partial<BlogPost>>({});

    useEffect(() => {
        setBlogs(StorageService.getBlogs());
    }, []);

    const handleDelete = (id: string) => {
        if (window.confirm('Delete this article?')) {
            const updated = blogs.filter(b => b.id !== id);
            setBlogs(updated);
            StorageService.saveBlogs(updated);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        let updatedBlogs;
        if (currentBlog.id) {
            updatedBlogs = blogs.map(b => b.id === currentBlog.id ? currentBlog as BlogPost : b);
        } else {
            const newBlog = { 
                ...currentBlog, 
                id: Date.now().toString(),
                date: new Date().toISOString()
            } as BlogPost;
            updatedBlogs = [...blogs, newBlog];
        }
        setBlogs(updatedBlogs);
        StorageService.saveBlogs(updatedBlogs);
        setIsModalOpen(false);
        setCurrentBlog({});
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Blog Posts</h1>
                <button 
                    onClick={() => { setCurrentBlog({}); setIsModalOpen(true); }}
                    className="flex items-center bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-hover"
                >
                    <Plus className="h-4 w-4 mr-2" /> Write Article
                </button>
            </div>

            <div className="space-y-4">
                {blogs.map(blog => (
                    <div key={blog.id} className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col md:flex-row gap-6">
                         <div className="w-full md:w-48 h-32 shrink-0">
                             <img src={blog.image} alt={blog.title} className="w-full h-full object-cover rounded" />
                         </div>
                         <div className="flex-grow">
                             <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-xl mb-1">{blog.title}</h3>
                                    <p className="text-sm text-gray-500 mb-2">By {blog.author} &bull; {new Date(blog.date).toLocaleDateString()}</p>
                                </div>
                             </div>
                             <p className="text-gray-600 line-clamp-2 mb-4">{blog.description}</p>
                             <div className="flex space-x-3">
                                <button onClick={() => { setCurrentBlog(blog); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"><Edit className="h-3 w-3 mr-1" /> Edit</button>
                                <button onClick={() => handleDelete(blog.id)} className="text-red-600 hover:text-red-800 flex items-center text-sm font-medium"><Trash2 className="h-3 w-3 mr-1" /> Delete</button>
                             </div>
                         </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{currentBlog.id ? 'Edit' : 'New'} Article</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Title</label>
                                <input required type="text" className="w-full border rounded px-3 py-2" value={currentBlog.title || ''} onChange={e => setCurrentBlog({...currentBlog, title: e.target.value})} />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Author</label>
                                    <input required type="text" className="w-full border rounded px-3 py-2" value={currentBlog.author || ''} onChange={e => setCurrentBlog({...currentBlog, author: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Image URL</label>
                                    <input required type="text" className="w-full border rounded px-3 py-2" value={currentBlog.image || ''} onChange={e => setCurrentBlog({...currentBlog, image: e.target.value})} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Short Description (Preview)</label>
                                <textarea required className="w-full border rounded px-3 py-2" rows={2} value={currentBlog.description || ''} onChange={e => setCurrentBlog({...currentBlog, description: e.target.value})}></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Full Content (HTML supported)</label>
                                <textarea required className="w-full border rounded px-3 py-2 font-mono text-sm" rows={10} value={currentBlog.content || ''} onChange={e => setCurrentBlog({...currentBlog, content: e.target.value})} placeholder="<p>Write your article here...</p>"></textarea>
                                <p className="text-xs text-gray-500 mt-1">Use basic HTML tags for formatting (e.g. &lt;p&gt;, &lt;br/&gt;, &lt;strong&gt;)</p>
                            </div>

                            <button type="submit" className="w-full bg-secondary text-white py-3 rounded font-bold hover:bg-secondary-hover">Publish Article</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};