'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Building2, IndianRupee, Briefcase, Edit3, Save, X, Upload, FileCheck, Plus, Trash } from 'lucide-react';
import CinematicReveal from '@/components/motion/CinematicReveal';
import BlurReveal from '@/components/motion/BlurReveal';
import { api } from '@/lib/api';

const ease = [0.16, 1, 0.3, 1];

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [docs, setDocs] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const fileRef = useRef(null);

  const docOptions = [
    'Aadhaar', 'PAN Card', 'GST Certificate', 'Bank Statement',
    'Project Report', 'ITR', 'Udyam Registration', 'Business Plan',
    'DPIIT Certificate', 'Incorporation Certificate', 'Pitch Deck',
    'Address Proof', 'Caste Certificate', 'Financial Statements',
  ];

  useEffect(() => {
    api.auth.me().then(({ data }) => {
      if (data) {
        setUser(data);
        setForm(data);
      } else {
        try {
          const u = JSON.parse(localStorage.getItem('user') || '{}');
          setUser(u);
          setForm(u);
        } catch (e) {}
      }
    });
    api.compliance.documents().then(({ data }) => {
      if (data) setDocs(data);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { data } = await api.auth.updateProfile({
      name: form.name,
      entity_type: form.entity_type,
      location: form.location,
      industry: form.industry,
      revenue: parseInt(form.revenue) || 0,
    });
    if (data) {
      setUser(data);
      setForm(data);
      localStorage.setItem('user', JSON.stringify(data));
    }
    setSaving(false);
    setEditing(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !uploadType) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', uploadType);
    const { data } = await api.compliance.upload(formData);
    if (data) {
      setDocs((prev) => [...prev, data]);
    }
    setUploading(false);
    setUploadType('');
    setShowUpload(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDelete = async (docId) => {
    if (!docId) return;
    const { data } = await api.compliance.delete(docId);
    if (data) {
      setDocs((prev) => prev.filter((d) => d.id !== docId));
    }
  };

  const existingDocTypes = docs.map((d) => d.document_type);

  if (!user) {
    return (
      <div className="space-y-4 max-w-[800px] mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <motion.div key={i} className="h-16 rounded-2xl skeleton"
            animate={{ scale: [0.99, 1.01, 0.99] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    );
  }

  const infoFields = [
    { key: 'name', label: 'Full Name', icon: User, type: 'text' },
    { key: 'email', label: 'Email', icon: Mail, type: 'email', readonly: true },
    { key: 'entity_type', label: 'Entity Type', icon: Building2, type: 'select', options: ['startup', 'msme', 'ngo'] },
    { key: 'location', label: 'Location', icon: MapPin, type: 'text' },
    { key: 'industry', label: 'Industry', icon: Briefcase, type: 'text' },
    { key: 'revenue', label: 'Annual Revenue (₹)', icon: IndianRupee, type: 'number' },
  ];

  return (
    <div className="max-w-[800px] mx-auto">
      <CinematicReveal preset="gentle">
        <h1 className="text-32 font-light text-text-primary tracking-tight mb-2">My Profile</h1>
        <p className="text-16 text-text-secondary mb-8">Manage your personal details and documents</p>
      </CinematicReveal>

      {/* ─── Personal Information ─── */}
      <BlurReveal blur={6} distance={20} delay={0.1}>
        <div className="p-6 rounded-2xl mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18 font-semibold text-text-primary">Personal Information</h2>
            {!editing ? (
              <button type="button" onClick={() => setEditing(true)}
                className="flex items-center gap-2 text-14 px-4 py-2 rounded-xl cursor-pointer transition-colors"
                style={{ backgroundColor: '#F5F2EE', color: '#6B6560' }}
              >
                <Edit3 size={14} /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button type="button" onClick={() => { setEditing(false); setForm(user); }}
                  className="flex items-center gap-1 text-14 px-3 py-2 rounded-xl cursor-pointer"
                  style={{ backgroundColor: '#F5F2EE', color: '#6B6560' }}
                >
                  <X size={14} /> Cancel
                </button>
                <button type="button" onClick={handleSave} disabled={saving}
                  className="flex items-center gap-1 text-14 px-4 py-2 rounded-xl cursor-pointer text-white"
                  style={{ backgroundColor: '#111111' }}
                >
                  <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {/* Profile avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6" style={{ borderBottom: '1px solid #E8E2DA' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-24 font-semibold text-white"
              style={{ backgroundColor: '#D4C5B0' }}
            >
              {(user.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <p className="text-20 font-medium text-text-primary">{user.name}</p>
              <p className="text-14 text-text-secondary">{(user.entity_type || '').toUpperCase()} • {user.email}</p>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {infoFields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.key}>
                  <label className="flex items-center gap-2 text-12 text-text-secondary mb-1.5 font-medium uppercase tracking-wider">
                    <Icon size={13} /> {field.label}
                  </label>
                  {editing && !field.readonly ? (
                    field.type === 'select' ? (
                      <select
                        className="input-field text-14"
                        value={form[field.key] || ''}
                        onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                        style={{ cursor: 'pointer' }}
                      >
                        {field.options.map((o) => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                      </select>
                    ) : (
                      <input
                        className="input-field text-14"
                        type={field.type}
                        value={form[field.key] || ''}
                        onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                      />
                    )
                  ) : (
                    <p className="text-14 font-medium text-text-primary py-2.5 px-4 rounded-xl"
                      style={{ backgroundColor: '#F5F2EE' }}
                    >
                      {field.key === 'revenue'
                        ? `₹${(user[field.key] || 0).toLocaleString('en-IN')}`
                        : field.key === 'entity_type'
                          ? (user[field.key] || '').toUpperCase()
                          : user[field.key] || '—'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </BlurReveal>

      {/* ─── Documents Section ─── */}
      <BlurReveal blur={6} distance={20} delay={0.2}>
        <div className="p-6 rounded-2xl mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18 font-semibold text-text-primary">
              My Documents <span className="text-14 font-normal text-text-secondary ml-2">({docs.length})</span>
            </h2>
            <button type="button" onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 text-14 px-4 py-2 rounded-xl cursor-pointer text-white"
              style={{ backgroundColor: '#111111' }}
            >
              <Plus size={14} /> Add Document
            </button>
          </div>

          {/* Upload panel */}
          {showUpload && (
            <motion.div
              className="p-4 rounded-xl mb-6"
              style={{ backgroundColor: '#F5F2EE', border: '1px solid #E8E2DA' }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3, ease }}
            >
              <p className="text-14 font-medium text-text-primary mb-3">Upload a new document</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="input-field text-14 flex-1"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Select document type...</option>
                  {docOptions.filter((d) => !existingDocTypes.includes(d)).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input
                    ref={fileRef}
                    type="file"
                    onChange={handleUpload}
                    disabled={!uploadType || uploading}
                    className="text-14 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-14 file:font-medium file:bg-black file:text-white file:cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </div>
              </div>
              {uploading && (
                <p className="text-12 text-text-secondary mt-2 flex items-center gap-2">
                  <span className="spinner" /> Uploading...
                </p>
              )}
            </motion.div>
          )}

          {/* Document list */}
          {docs.length === 0 ? (
            <div className="text-center py-8">
              <FileCheck size={32} className="mx-auto mb-3" style={{ color: '#D4C5B0' }} />
              <p className="text-14 text-text-secondary">No documents uploaded yet</p>
              <p className="text-12 text-text-secondary mt-1">Add documents to improve your scheme eligibility</p>
            </div>
          ) : (
            <div className="space-y-2">
              {docs.map((doc, i) => (
                <motion.div
                  key={doc.id || i}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ backgroundColor: '#F5F2EE' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#E8F5E9' }}
                    >
                      <FileCheck size={16} style={{ color: '#1A5C38' }} />
                    </div>
                    <div>
                      <p className="text-14 font-medium text-text-primary">{doc.document_type}</p>
                      <p className="text-12 text-text-secondary">
                        {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString('en-IN') : 'Self-declared'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-12 px-2.5 py-1 rounded-full" style={{ backgroundColor: '#E8F5E9', color: '#1A5C38' }}>
                      ✓ Uploaded
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-[#8B1A1A] hover:bg-[#FFEBEE] transition-colors cursor-pointer"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </BlurReveal>

      {/* ─── Document Coverage ─── */}
      <BlurReveal blur={6} distance={20} delay={0.3}>
        <div className="p-6 rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}>
          <h2 className="text-18 font-semibold text-text-primary mb-4">Document Coverage</h2>
          <p className="text-14 text-text-secondary mb-4">Documents required across all government schemes</p>
          <div className="flex flex-wrap gap-2">
            {docOptions.map((d) => {
              const hasDoc = existingDocTypes.includes(d);
              return (
                <span
                  key={d}
                  className="text-13 px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: hasDoc ? '#E8F5E9' : '#FFF8E1',
                    color: hasDoc ? '#1A5C38' : '#92600A',
                    border: hasDoc ? '1px solid #C8E6C9' : '1px solid #FFE082',
                  }}
                >
                  {hasDoc ? '✓' : '✗'} {d}
                </span>
              );
            })}
          </div>
        </div>
      </BlurReveal>
    </div>
  );
}
