import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage.ts';
import type { BlogPost } from '../types.ts';
import { User, Calendar } from 'lucide-react';

export const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    setBlogs(StorageService.getBlogs());
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
       <div className="bg-black py-20 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase mb-4">Knowledge Hub</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Insights on training, nutrition, and mindset.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {selectedBlog ? (
            <div className="bg-white rounded-lg shadow-xl overflow-hidden animate-fade-in">
                <div className="h-64 md:h-96 w-full relative">
                     <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
                     <button 
                        onClick={() => setSelectedBlog(null)}
                        className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded hover:bg-black transition backdrop-blur"
                     >
                         &larr; Back to Articles
                     </button>
                </div>
                <div className="p-8 md:p-12 max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">{selectedBlog.title}</h1>
                    <div className="flex items-center text-gray-500 mb-8 border-b border-gray-100 pb-8">
                         <div className="flex items-center mr-6">
                             <User className="h-4 w-4 mr-2" />
                             <span>{selectedBlog.author}</span>
                         </div>
                         <div className="flex items-center">
                             <Calendar className="h-4 w-4 mr-2" />
                             <span>{new Date(selectedBlog.date).toLocaleDateString()}</span>
                         </div>
                    </div>
                    <div 
                        className="prose prose-lg max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: selectedBlog.content }} 
                    />
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map(blog => (
                    <article key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer flex flex-col h-full" onClick={() => setSelectedBlog(blog)}>
                        <div className="h-48 overflow-hidden">
                            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transform hover:scale-105 transition duration-500" />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center text-xs text-gray-500 mb-2">
                                <span className="font-bold text-secondary uppercase">{blog.author}</span>
                                <span className="mx-2">&bull;</span>
                                <span>{new Date(blog.date).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 hover:text-secondary transition">{blog.title}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{blog.description || blog.content.substring(0, 100) + '...'}</p>
                            <span className="text-black font-bold uppercase text-sm mt-auto block hover:underline">Read Article &rarr;</span>
                        </div>
                    </article>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};