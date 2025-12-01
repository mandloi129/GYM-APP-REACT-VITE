
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StorageService } from '../services/storage.ts';
import type { LegalPage } from '../types.ts';

export const LegalViewer: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [page, setPage] = useState<LegalPage | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const pages = StorageService.getLegalPages();
        const found = pages.find(p => p.slug === slug && p.isVisible);
        setPage(found || null);
        setLoading(false);
    }, [slug]);

    if (loading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    }

    if (!page) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
                <p className="text-gray-600 mb-8">The requested legal page does not exist or has been removed.</p>
                <Link to="/" className="bg-black text-white px-6 py-2 rounded font-bold uppercase">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-black py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white uppercase">{page.title}</h1>
                </div>
            </div>
            <div className="max-w-3xl mx-auto px-4 py-16">
                <div className="prose prose-lg max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: page.content }} />
            </div>
        </div>
    );
};
