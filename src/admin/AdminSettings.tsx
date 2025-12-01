
import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage.ts';
import type { SiteSettings } from '../types.ts';
import { Save, Lock, Shield, List, X, Image, MessageCircle } from 'lucide-react';

export const AdminSettings: React.FC = () => {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [status, setStatus] = useState<'idle' | 'saved'>('idle');
    const [newCategory, setNewCategory] = useState('');
    const [newInterest, setNewInterest] = useState('');
    
    // Security State
    const [newPassword, setNewPassword] = useState('');
    const [securityPhrase, setSecurityPhrase] = useState('');
    const [securityStatus, setSecurityStatus] = useState('');

    useEffect(() => {
        setSettings(StorageService.getSettings());
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (settings) {
            StorageService.saveSettings(settings);
            setStatus('saved');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    // --- Image Upload Handler ---
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'faviconUrl') => {
        const file = e.target.files?.[0];
        if (file) {
            // Limit file size to 500KB to prevent LocalStorage issues
            if (file.size > 500 * 1024) {
                alert("File is too large. Please upload an image smaller than 500KB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                if (settings) {
                    setSettings({ ...settings, [field]: reader.result as string });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (field: 'logoUrl' | 'faviconUrl') => {
        if (settings) {
            setSettings({ ...settings, [field]: '' });
        }
    };

    const handleUpdatePassword = async () => {
        if (newPassword.length < 4) return alert('Password too short');
        await StorageService.updatePassword(newPassword);
        setNewPassword('');
        setSecurityStatus('Password updated!');
        setTimeout(() => setSecurityStatus(''), 3000);
    };

    const handleUpdatePhrase = async () => {
        if (securityPhrase.split(' ').length < 3) return alert('Phrase must be at least 3 words');
        await StorageService.setSecurityPhrase(securityPhrase);
        setSecurityPhrase('');
        setSecurityStatus('Security phrase set!');
        setTimeout(() => setSecurityStatus(''), 3000);
    };

    // Category Logic
    const addCategory = () => {
        if(newCategory && settings && !settings.programCategories.includes(newCategory)) {
            setSettings({...settings, programCategories: [...settings.programCategories, newCategory]});
            setNewCategory('');
        }
    };
    const removeCategory = (cat: string) => {
        if(settings) {
            setSettings({...settings, programCategories: settings.programCategories.filter(c => c !== cat)});
        }
    };

    // Interest Logic
    const addInterest = () => {
        if(newInterest && settings && !settings.contactInterests.includes(newInterest)) {
            setSettings({...settings, contactInterests: [...settings.contactInterests, newInterest]});
            setNewInterest('');
        }
    };
    const removeInterest = (int: string) => {
        if(settings) {
            setSettings({...settings, contactInterests: settings.contactInterests.filter(i => i !== int)});
        }
    };

    if (!settings) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Site Configuration</h1>
                {status === 'saved' && (
                    <span className="text-green-600 font-bold bg-green-100 px-3 py-1 rounded">Changes Saved!</span>
                )}
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                
                {/* Global Toggles */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h2 className="text-lg font-bold border-b pb-2 mb-4">Global Features</h2>
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Enable "Limited Time Offers" Section on Home Page</span>
                        <div className="flex items-center">
                            <span className={`text-sm mr-3 ${settings.offersEnabled ? 'text-green-600' : 'text-gray-500'}`}>{settings.offersEnabled ? 'Active' : 'Disabled'}</span>
                            <button 
                                type="button"
                                onClick={() => setSettings({...settings, offersEnabled: !settings.offersEnabled})}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.offersEnabled ? 'bg-secondary' : 'bg-gray-200'}`}
                            >
                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.offersEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Branding - UPDATED TO FILE UPLOAD */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h2 className="text-lg font-bold border-b pb-2 mb-4 flex items-center"><Image className="h-4 w-4 mr-2" /> Branding</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Logo Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Website Logo (Replaces Dumbbell Icon)</label>
                            <div className="flex items-start space-x-4">
                                {settings.logoUrl ? (
                                    <div className="relative h-16 w-16 bg-gray-100 rounded border flex items-center justify-center">
                                        <img src={settings.logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                                        <button 
                                            type="button" 
                                            onClick={() => removeImage('logoUrl')}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="h-16 w-16 bg-gray-50 rounded border border-dashed flex items-center justify-center text-gray-400">
                                        <Image className="h-6 w-6" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'logoUrl')}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Recommended: Square PNG/SVG, max 500KB.</p>
                                </div>
                            </div>
                        </div>

                        {/* Favicon Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Website Favicon (Browser Tab)</label>
                            <div className="flex items-start space-x-4">
                                {settings.faviconUrl ? (
                                    <div className="relative h-16 w-16 bg-gray-100 rounded border flex items-center justify-center">
                                        <img src={settings.faviconUrl} alt="Favicon Preview" className="max-h-full max-w-full object-contain" />
                                        <button 
                                            type="button" 
                                            onClick={() => removeImage('faviconUrl')}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="h-16 w-16 bg-gray-50 rounded border border-dashed flex items-center justify-center text-gray-400">
                                        <Image className="h-6 w-6" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'faviconUrl')}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Recommended: 32x32 PNG/ICO, max 500KB.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lists Management */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                        <h2 className="text-lg font-bold border-b pb-2 mb-4 flex items-center"><List className="h-4 w-4 mr-2"/> Program Categories</h2>
                        <div className="flex mb-4">
                            <input type="text" className="flex-1 border rounded-l px-2 py-1 text-sm" placeholder="New Category" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                            <button type="button" onClick={addCategory} className="bg-secondary text-white px-3 rounded-r text-sm font-bold">+</button>
                        </div>
                        <ul className="space-y-2">
                            {settings.programCategories.map(cat => (
                                <li key={cat} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded text-sm">
                                    <span>{cat}</span>
                                    <button type="button" onClick={() => removeCategory(cat)} className="text-red-500 hover:text-red-700"><X className="h-4 w-4" /></button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                        <h2 className="text-lg font-bold border-b pb-2 mb-4 flex items-center"><List className="h-4 w-4 mr-2"/> Contact Form Interests</h2>
                        <div className="flex mb-4">
                            <input type="text" className="flex-1 border rounded-l px-2 py-1 text-sm" placeholder="New Interest Option" value={newInterest} onChange={e => setNewInterest(e.target.value)} />
                            <button type="button" onClick={addInterest} className="bg-secondary text-white px-3 rounded-r text-sm font-bold">+</button>
                        </div>
                        <ul className="space-y-2">
                            {settings.contactInterests.map(int => (
                                <li key={int} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded text-sm">
                                    <span>{int}</span>
                                    <button type="button" onClick={() => removeInterest(int)} className="text-red-500 hover:text-red-700"><X className="h-4 w-4" /></button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h2 className="text-lg font-bold border-b pb-2 mb-4">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                            <input required type="email" className="w-full mt-1 border rounded px-3 py-2" value={settings.contactEmail} onChange={e => setSettings({...settings, contactEmail: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                            <input required type="text" className="w-full mt-1 border rounded px-3 py-2" value={settings.contactPhone} onChange={e => setSettings({...settings, contactPhone: e.target.value})} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Physical Address</label>
                            <input required type="text" className="w-full mt-1 border rounded px-3 py-2" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} />
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-700">Google Maps Embed URL</label>
                             <input type="text" className="w-full mt-1 border rounded px-3 py-2 text-sm text-gray-500" value={settings.mapEmbedUrl} onChange={e => setSettings({...settings, mapEmbedUrl: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h2 className="text-lg font-bold border-b pb-2 mb-4 flex items-center"><MessageCircle className="h-4 w-4 mr-2"/> WhatsApp Configuration</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">General WhatsApp Number</label>
                            <input required type="text" className="w-full mt-1 border rounded px-3 py-2" value={settings.whatsappNumber} onChange={e => setSettings({...settings, whatsappNumber: e.target.value})} placeholder="e.g. 919876543210" />
                            <p className="text-xs text-gray-500 mt-1">Used for Offers and General Inquiries.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Counseling WhatsApp Number</label>
                            <input type="text" className="w-full mt-1 border rounded px-3 py-2" value={settings.counselingWhatsapp || ''} onChange={e => setSettings({...settings, counselingWhatsapp: e.target.value})} placeholder="e.g. 919876543210" />
                            <p className="text-xs text-gray-500 mt-1">Used exclusively for Counseling bookings. (Leave empty to use General)</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h2 className="text-lg font-bold border-b pb-2 mb-4">Social Media Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Instagram URL</label>
                            <input type="text" className="w-full mt-1 border rounded px-3 py-2" value={settings.socials.instagram || ''} onChange={e => setSettings({...settings, socials: {...settings.socials, instagram: e.target.value}})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
                            <input type="text" className="w-full mt-1 border rounded px-3 py-2" value={settings.socials.facebook || ''} onChange={e => setSettings({...settings, socials: {...settings.socials, facebook: e.target.value}})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Twitter/X URL</label>
                            <input type="text" className="w-full mt-1 border rounded px-3 py-2" value={settings.socials.twitter || ''} onChange={e => setSettings({...settings, socials: {...settings.socials, twitter: e.target.value}})} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-black text-white px-8 py-3 rounded font-bold uppercase hover:bg-gray-800 flex items-center shadow-lg transform active:scale-95 transition">
                        <Save className="h-5 w-5 mr-2" /> Save Configuration
                    </button>
                </div>
            </form>

             {/* Security Section */}
            <div className="mt-12 bg-white p-6 rounded-lg shadow border border-red-100">
                <h2 className="text-xl font-bold border-b pb-2 mb-4 flex items-center text-red-900">
                    <Lock className="h-5 w-5 mr-2" /> Admin Security
                </h2>
                {securityStatus && <div className="bg-green-100 text-green-800 p-2 rounded mb-4">{securityStatus}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="font-bold mb-3 flex items-center"><Shield className="h-4 w-4 mr-2"/> Change Password</h3>
                        <div className="space-y-3">
                            <input 
                                type="password" 
                                className="w-full border rounded px-3 py-2" 
                                placeholder="New Password" 
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                            <button onClick={handleUpdatePassword} className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-black">Update Password</button>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold mb-3 flex items-center"><Shield className="h-4 w-4 mr-2"/> Set Security Phrase</h3>
                        <p className="text-xs text-gray-500 mb-2">Used to recover account if password is forgotten.</p>
                        <div className="space-y-3">
                            <input 
                                type="text" 
                                className="w-full border rounded px-3 py-2" 
                                placeholder="e.g. blue ocean sky deep" 
                                value={securityPhrase}
                                onChange={e => setSecurityPhrase(e.target.value)}
                            />
                            <button onClick={handleUpdatePhrase} className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-black">Set Phrase</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
