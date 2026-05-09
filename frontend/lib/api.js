const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function headers(extra = {}) {
  const h = { 'Content-Type': 'application/json', ...extra };
  const token = getToken();
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function request(method, path, body, isFormData = false) {
  try {
    const opts = { method };
    if (isFormData) {
      const token = getToken();
      opts.headers = token ? { Authorization: `Bearer ${token}` } : {};
      opts.body = body;
    } else {
      opts.headers = headers();
      if (body) opts.body = JSON.stringify(body);
    }
    const res = await fetch(`${BASE_URL}${path}`, opts);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      return { data: null, error: err.detail || `Error ${res.status}` };
    }
    const data = await res.json();
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e.message || 'Network error' };
  }
}

async function get(path) { return request('GET', path); }
async function post(path, body) { return request('POST', path, body); }
async function put(path, body) { return request('PUT', path, body); }
async function upload(path, formData) { return request('POST', path, formData, true); }

export const api = {
  auth: {
    login: (body) => post('/api/auth/login', body),
    signup: (body) => post('/api/auth/signup', body),
    me: () => get('/api/auth/me'),
    updateProfile: (body) => put('/api/auth/profile', body),
  },
  dashboard: {
    summary: () => get('/api/dashboard/summary'),
  },
  schemes: {
    list: () => get('/api/schemes'),
    get: (id) => get(`/api/schemes/${id}`),
    match: (body) => post('/api/match', body),
    analyze: (id) => get(`/api/schemes/analyze/${id}`),
  },
  compliance: {
    check: (body) => post('/api/compliance', body),
    upload: (form) => upload('/api/documents/upload', form),
    documents: () => get('/api/documents'),
    setTypes: (docTypes) => post('/api/documents/set-types', { document_types: docTypes }),
    delete: (id) => request('DELETE', `/api/documents/${id}`),
  },
  proposals: {
    generate: (body) => post('/api/generate/proposal', body),
    impact: (body) => post('/api/generate/impact', body),
  },
  applications: {
    list: () => get('/api/applications'),
    get: (id) => get(`/api/applications/${id}`),
    create: (body) => post('/api/applications', body),
    update: (id, body) => put(`/api/applications/${id}`, body),
  },
  jobs: {
    list: () => get('/api/jobs'),
    apply: (id, body) => post(`/api/jobs/apply/${id}`, body),
  },
};
