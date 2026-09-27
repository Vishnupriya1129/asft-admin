'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Save, X, Loader2, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface HeroRecord {
  id: string;
  title: string;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
  images: string[];
  is_active: boolean;
  created_at: string;
}

const EMPTY_FORM = {
  title: '',
  subtitle: '',
  button_text: '',
  button_link: '',
  images: [''],
  is_active: true,
};

export default function HeroPage() {
  const [heroes, setHeroes] = useState<HeroRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/content/hero');
      const data = await res.json();
      setHeroes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load hero');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHeroes(); }, []);

  const handleCreate = () => {
    setForm({ ...EMPTY_FORM, images: [''] });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (hero: HeroRecord) => {
    setForm({
      title: hero.title,
      subtitle: hero.subtitle || '',
      button_text: hero.button_text || '',
      button_link: hero.button_link || '',
      images: hero.images?.length ? hero.images : [''],
      is_active: hero.is_active,
    });
    setEditingId(hero.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }

    const cleanImages = form.images.filter((img) => img.trim() !== '');
    if (cleanImages.length === 0) {
      toast.error('At least one image URL is required');
      return;
    }

    setSaving(true);
    try {
      const url = editingId
        ? `/api/admin/content/hero/${editingId}`
        : '/api/admin/content/hero';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, images: cleanImages }),
      });

      if (!res.ok) throw new Error('Save failed');

      toast.success(editingId ? 'Hero updated!' : 'Hero created!');
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      fetchHeroes();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/content/hero/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Deleted');
      fetchHeroes();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleToggleActive = async (hero: HeroRecord) => {
    try {
      const res = await fetch(`/api/admin/content/hero/${hero.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...hero, is_active: !hero.is_active }),
      });
      if (!res.ok) throw new Error('Toggle failed');
      toast.success(hero.is_active ? 'Hidden' : 'Visible');
      fetchHeroes();
    } catch (error) {
      toast.error('Failed to toggle');
    }
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...form.images];
    newImages[index] = value;
    setForm({ ...form, images: newImages });
  };

  const addImageField = () => {
    setForm({ ...form, images: [...form.images, ''] });
  };

  const removeImageField = (index: number) => {
    if (form.images.length <= 1) return;
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0F223D]">Hero Section</h1>
          <p className="text-gray-600 mt-1">Manage the hero content shown on your homepage.</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A227] text-white rounded-lg hover:bg-[#8B6914] transition font-semibold shadow-md"
        >
          <Plus size={18} />
          New Hero
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#C9A227]" size={32} />
        </div>
      )}

      {!loading && heroes.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
          <p className="text-gray-400 mb-4">No hero section yet.</p>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A227] text-white rounded-lg hover:bg-[#8B6914]"
          >
            <Plus size={16} />
            Create Hero
          </button>
        </div>
      )}

      {!loading && heroes.length > 0 && (
        <div className="space-y-6">
          {heroes.map((hero) => (
            <div
              key={hero.id}
              className={`bg-white rounded-2xl shadow-md overflow-hidden border-2 transition-all ${
                hero.is_active ? 'border-[#C9A227]/30' : 'border-gray-200 opacity-80'
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#0F223D]">{hero.title}</h3>
                    {hero.subtitle && (
                      <p className="text-gray-500 text-sm mt-1">{hero.subtitle}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {hero.is_active ? (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                          HIDDEN
                        </span>
                      )}
                      {hero.button_text && (
                        <span className="bg-[#F8F5EE] text-[#8B6914] text-xs font-medium px-3 py-1 rounded-full">
                          Button: {hero.button_text}
                        </span>
                      )}
                      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                        {hero.images?.length || 0} images
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(hero)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleToggleActive(hero)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      title={hero.is_active ? 'Hide' : 'Show'}
                    >
                      {hero.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => handleDelete(hero.id, hero.title)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Image grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {hero.images?.map((url, i) => (
                    <div
                      key={i}
                      className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                    >
                      <img
                        src={url}
                        alt={`Hero ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#0F223D]">
                {editingId ? 'Edit Hero' : 'New Hero'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={form.button_text}
                    onChange={(e) => setForm({ ...form, button_text: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={form.button_link}
                    onChange={(e) => setForm({ ...form, button_link: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Images section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Images * ({form.images.length})
                  </label>
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-xs text-[#C9A227] hover:text-[#8B6914] font-semibold flex items-center gap-1"
                  >
                    <Plus size={14} /> Add image
                  </button>
                </div>
                <div className="space-y-2">
                  {form.images.map((url, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => updateImage(index, e.target.value)}
                          placeholder={`Image ${index + 1} URL`}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-transparent text-sm"
                        />
                        {url && (
                          <div className="mt-1 rounded overflow-hidden border border-gray-200 w-24 h-16">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                      {form.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Remove"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-5 h-5 text-[#C9A227] border-gray-300 rounded focus:ring-[#C9A227]"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">
                  Active (visible on site)
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A227] text-white rounded-lg hover:bg-[#8B6914] transition disabled:opacity-50 font-semibold"
                >
                  {saving ? (
                    <><Loader2 size={16} className="animate-spin" /> Saving...</>
                  ) : (
                    <><Save size={16} /> {editingId ? 'Update' : 'Create'}</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}