
import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage.ts';
import type { MembershipTier } from '../types.ts';
import { Edit, Plus, X, Trash2 } from 'lucide-react';

interface PlanState extends Omit<Partial<MembershipTier>, 'features'> {
    features?: string | string[];
}

export const AdminMemberships: React.FC = () => {
    const [plans, setPlans] = useState<MembershipTier[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<PlanState>({ pricing: { monthly: 0 } });

    useEffect(() => {
        setPlans(StorageService.getMemberships());
    }, []);

    const handleDelete = (id: string) => {
        if (window.confirm('Delete this membership tier?')) {
            const updated = plans.filter(p => p.id !== id);
            setPlans(updated);
            StorageService.saveMemberships(updated);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle features splitting
        const featuresArray = typeof currentPlan.features === 'string' 
            ? (currentPlan.features as string).split('\n').filter((s: string) => s.trim()) 
            : (currentPlan.features || []);

        const planToSave = {
            ...currentPlan,
            features: featuresArray
        } as MembershipTier;

        let updatedPlans;
        if (currentPlan.id) {
            updatedPlans = plans.map(p => p.id === currentPlan.id ? planToSave : p);
        } else {
            updatedPlans = [...plans, { ...planToSave, id: Date.now().toString() }];
        }
        setPlans(updatedPlans);
        StorageService.saveMemberships(updatedPlans);
        setIsModalOpen(false);
    };

    // Helper to safely update pricing
    const updatePricing = (field: keyof MembershipTier['pricing'], value: string) => {
        const pricing = currentPlan.pricing || { monthly: 0 };
        setCurrentPlan({
            ...currentPlan,
            pricing: {
                ...pricing,
                [field]: Number(value)
            }
        });
    };

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Membership Plans</h1>
                <button 
                    onClick={() => { setCurrentPlan({ pricing: { monthly: 0 }, features: [], highlight: false }); setIsModalOpen(true); }}
                    className="flex items-center bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-hover"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Plan
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {plans.map(plan => (
                    <div key={plan.id} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold">{plan.name}</h3>
                                {plan.highlight && <span className="text-xs bg-secondary text-white px-2 py-1 rounded">Highlighted</span>}
                            </div>
                            <div className="space-x-2">
                                <button onClick={() => { setCurrentPlan(plan); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800"><Edit className="h-5 w-5" /></button>
                                <button onClick={() => handleDelete(plan.id)} className="text-red-600 hover:text-red-800"><Trash2 className="h-5 w-5" /></button>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-4 text-sm">{plan.description}</p>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded mb-4 text-sm">
                            <div>Monthly: <strong>${plan.pricing.monthly}</strong></div>
                            <div>Quarterly: <strong>${plan.pricing.quarterly || '-'}</strong></div>
                            <div>6-Month: <strong>${plan.pricing.biannual || '-'}</strong></div>
                            <div>Yearly: <strong>${plan.pricing.yearly || '-'}</strong></div>
                        </div>
                        <h4 className="font-bold text-sm mb-2">Features:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                            {plan.features.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{currentPlan.id ? 'Edit' : 'Create'} Plan</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Plan Name</label>
                                <input required type="text" className="w-full border rounded px-3 py-2" value={currentPlan.name || ''} onChange={e => setCurrentPlan({...currentPlan, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <input required type="text" className="w-full border rounded px-3 py-2" value={currentPlan.description || ''} onChange={e => setCurrentPlan({...currentPlan, description: e.target.value})} />
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded">
                                <h4 className="font-bold text-sm mb-2">Pricing Strategy ($)</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium">Monthly (Base)</label>
                                        <input required type="number" className="w-full border rounded px-2 py-1" value={currentPlan.pricing?.monthly || 0} onChange={e => updatePricing('monthly', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium">3-Month</label>
                                        <input type="number" className="w-full border rounded px-2 py-1" value={currentPlan.pricing?.quarterly || ''} onChange={e => updatePricing('quarterly', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium">6-Month</label>
                                        <input type="number" className="w-full border rounded px-2 py-1" value={currentPlan.pricing?.biannual || ''} onChange={e => updatePricing('biannual', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium">Yearly</label>
                                        <input type="number" className="w-full border rounded px-2 py-1" value={currentPlan.pricing?.yearly || ''} onChange={e => updatePricing('yearly', e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Features (One per line)</label>
                                <textarea required rows={5} className="w-full border rounded px-3 py-2" value={Array.isArray(currentPlan.features) ? currentPlan.features.join('\n') : currentPlan.features || ''} onChange={e => setCurrentPlan({...currentPlan, features: e.target.value})} placeholder="Gym Access&#10;Free Towel&#10;..."></textarea>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" checked={currentPlan.highlight || false} onChange={e => setCurrentPlan({...currentPlan, highlight: e.target.checked})} className="mr-2" />
                                <label className="text-sm">Highlight as "Most Popular"</label>
                            </div>

                            <button type="submit" className="w-full bg-black text-white py-2 rounded font-bold">Save Plan</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
