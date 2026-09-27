'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X, Loader2, Quote, Star, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface Testimonial {
  id: number;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  linkedin_url: string | null;
  created_at: string;
}

const EMPTY = {
  name: '', role: '', content: '', rating: '5', image_url: '',
  is_active: true, sort_order: '0', linkedin_url: '',
};

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/content/testimonials');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleCreate = () => { setForm(EMPTY); setEditingId(null); setShowForm(true); };

  const handleEdit = (item: Testimonial) => {
    setForm({
      name: item.name,
      role: item.role || '',
      content: item.content,
      rating: item.rating?.toString() || '5',
      image_url: item.image_url || '',
      is_active: item.is_active,
      sort_order: item.sort_order?.toString() || '0',
      linkedin_url: item.linkedin_url || '',
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) { toast.error('Name and content required'); return; }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/content/testimonials/${editingId}` : '/api/admin/content/testimonials';
      const res = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(editingId ? 'Updated!' : 'Created!');
      setShowForm(false); setForm(EMPTY); setEditingId(null); fetchItems();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete testimonial from "${name}"?`)) return;
    try {
      await fetch(`/api/admin/content/testimonials/${id}`, { method: 'DELETE' });
      toast.success('Deleted'); fetchItems();
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggle = async (item: Testimonial) => {
    try {
      await fetch(`/api/admin/content/testimonials/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, is_active: !item.is_active }),
      });
      toast.success(item.is_active ? 'Hidden' : 'Visible');
      fetchItems();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0F223D]">Testimonials</h1>
          <p className="text-gray-600 mt-1">Manage testimonials shown on your site.</p>
        </div>
        <button onClick={handleCreate} className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A227] text-white rounded-lg hover:bg-[#8B6914] font-semibold shadow-md">
          <Plus size={18} /> New Testimonial
        </button>
      </div>

      {loading && <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#C9A227]" size={32} /></div>}

      {!loading && items.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <Quote className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-400 mb-4">No testimonials yet.</p>
          <button onClick={handleCreate} className="px-4 py-2 bg-[#C9A227] text-white rounded-lg">Create your first testimonial</button>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.id} className={`bg-white rounded-xl shadow-md p-6 border-2 transition ${item.is_active ? 'border-[#C9A227]/20' : 'border-gray-200 opacity-70'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#0F223D] flex items-center justify-center text-white font-bold">{item.name.charAt(0)}</div>
                  )}
                  <div>
                    <p className="font-bold text-[#0F223D]">{item.name}</p>
                    {item.role && <p className="text-xs text-gray-500">{item.role}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < item.rating ? 'text-[#C9A227] fill-[#C9A227]' : 'text-gray-300'} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 italic line-clamp-4 mb-4">"{item.content}"</p>
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button onClick={() => handleEdit(item)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <Pencil size={14} /> Edit
                </button>
                <button onClick={() => handleToggle(item)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50 rounded-lg transition">
                  {item.is_active ? <><EyeOff size={14} /> Hide</> : <><Eye size={14} /> Show</>}
                </button>
                <button onClick={() => handleDelete(item.id, item.name)} className="inline-flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-[#0F223D]">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227]" placeholder="e.g., Volunteer" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Content *</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                  <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227]">
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Star{n>1?'s':''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227] text-sm" />
                {form.image_url && <div className="mt-2 w-16 h-16 rounded-full overflow-hidden border border-gray-200"><img src={form.image_url} alt="Preview" className="w-full h-full object-cover" /></div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input type="url" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227] text-sm" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-5 h-5 text-[#C9A227] rounded" />
                <label htmlFor="is_active" className="text-sm text-gray-700">Active (visible on site)</label>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button type="submit" disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A227] text-white rounded-lg hover:bg-[#8B6914] disabled:opacity-50 font-semibold">
                  {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> {editingId ? 'Update' : 'Create'}</>}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}