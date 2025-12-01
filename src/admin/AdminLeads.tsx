import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage.ts';
import type { Lead } from '../types.ts';
import { Trash2, Download } from 'lucide-react';

export const AdminLeads: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);

    useEffect(() => {
        setLeads(StorageService.getLeads());
    }, []);

    const handleDelete = (id: string) => {
        if (window.confirm('Delete this lead?')) {
            StorageService.deleteLead(id);
            setLeads(StorageService.getLeads());
        }
    };

    const handleExport = () => {
        const headers = 'ID,Name,Email,Phone,Interest,Message,Date';
        const rows = leads.map(l => 
            `${l.id},"${l.name}","${l.email}","${l.phone}","${l.interest}","${(l.message || '').replace(/"/g, '""')}","${l.date}"`
        );
        const csvContent = [headers, ...rows].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Leads & Inquiries</h1>
                <button 
                    onClick={handleExport}
                    className="flex items-center bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition-colors shadow-sm"
                >
                    <Download className="h-4 w-4 mr-2" /> Export CSV
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
                <ul className="divide-y divide-gray-200">
                    {leads.length > 0 ? leads.map(lead => (
                        <li key={lead.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between md:justify-start md:gap-4">
                                        <h3 className="text-lg font-bold text-gray-900">{lead.name}</h3>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                                            {lead.interest}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center text-sm text-gray-500 gap-y-1 gap-x-2 mt-2">
                                        <span className="flex items-center">{lead.email}</span>
                                        <span className="hidden md:inline text-gray-300">&bull;</span>
                                        <span className="flex items-center">{lead.phone}</span>
                                        <span className="hidden md:inline text-gray-300">&bull;</span>
                                        <span className="flex items-center text-gray-400">{new Date(lead.date).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <div className="mt-3 text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-100 text-sm italic">
                                        "{lead.message}"
                                    </div>
                                </div>
                                
                                <div className="flex items-start justify-end">
                                    <button 
                                        onClick={() => handleDelete(lead.id)}
                                        className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                                        title="Delete Lead"
                                        aria-label="Delete Lead"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    )) : (
                        <li className="p-12 text-center text-gray-500 flex flex-col items-center">
                            <div className="bg-gray-100 p-4 rounded-full mb-3">
                                <Download className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-lg font-medium">No leads found</p>
                            <p className="text-sm">Contact form submissions will appear here.</p>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};