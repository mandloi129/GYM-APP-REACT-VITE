
import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage.ts';
import { ALL_COUNTRY_CODES } from '../constants.ts';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneCode: '+91',
    phoneNumber: '',
    message: '',
    interest: ''
  });
  const [interests, setInterests] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
      const settings = StorageService.getSettings();
      setInterests(settings.contactInterests);
      setFormData(prev => ({ ...prev, interest: settings.contactInterests[0] || 'General Inquiry' }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      StorageService.addLead({
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: `${formData.phoneCode} ${formData.phoneNumber}`,
        interest: formData.interest,
        message: formData.message,
        date: new Date().toISOString()
      });
      setStatus('success');
      setFormData(prev => ({ ...prev, name: '', email: '', phoneNumber: '', message: '' }));
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-secondary">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">Get In Touch</h3>
      {status === 'success' && (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
          Message sent successfully! We'll contact you soon.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            required
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-secondary focus:ring-secondary focus:outline-none"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            required
            type="email"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-secondary focus:ring-secondary focus:outline-none"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <div className="flex mt-1">
              <select 
                className="rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-2 text-sm focus:border-secondary focus:ring-secondary focus:outline-none w-28"
                value={formData.phoneCode}
                onChange={e => setFormData({...formData, phoneCode: e.target.value})}
              >
                  {ALL_COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.dial_code}>{c.code} ({c.dial_code})</option>
                  ))}
              </select>
              <input
                required
                type="tel"
                className="block w-full rounded-r-md border border-gray-300 px-3 py-2 focus:border-secondary focus:ring-secondary focus:outline-none"
                value={formData.phoneNumber}
                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="9876543210"
              />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Interested In</label>
          <select
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-secondary focus:ring-secondary focus:outline-none"
            value={formData.interest}
            onChange={e => setFormData({ ...formData, interest: e.target.value })}
          >
            {interests.map(int => (
                <option key={int} value={int}>{int}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            required
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-secondary focus:ring-secondary focus:outline-none"
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-md font-bold uppercase hover:bg-gray-800 transition shadow-lg"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};
