import api from './api';

// Note: Auth headers are automatically added by api interceptor

// Exams API
export const examsApi = {
  // Get all exams
  getAll: async () => {
    const res = await api.get('/admin/exams');
    return res.data;
  },

  // Get single exam
  getById: async (examId) => {
    const res = await api.get(`/admin/exams/${examId}`);
    return res.data;
  },

  // Create exam
  create: async (examData) => {
    const res = await api.post('/admin/exams', examData);
    return res.data;
  },

  // Update exam
  update: async (examId, examData) => {
    const res = await api.put(`/admin/exams/${examId}`, examData);
    return res.data;
  },
  
  // Delete exam
  delete: async (examId) => {
    const res = await api.delete(`/admin/exams/${examId}`);
    return res.data;
  },
};

// Question Papers API
export const papersApi = {
  // Get all papers for an exam
  getByExam: async (examId) => {
    const res = await api.get(`/admin/exams/${examId}/papers`);
    return res.data;
  },

  // Get single paper
  getById: async (paperId) => {
    // Validate paperId before making the request
    if (!paperId || paperId === 'null' || paperId === 'undefined' || paperId === null) {
      throw new Error('Paper ID is required');
    }
    const res = await api.get(`/admin/papers/${paperId}`);
    return res.data;
  },

  // Create paper
  create: async (examId, paperData) => {
    const res = await api.post(`/admin/exams/${examId}/papers`, paperData);
    return res.data;
  },

  // Update paper
  update: async (paperId, paperData) => {
    const res = await api.put(`/admin/papers/${paperId}`, paperData);
    return res.data;
  },

  // Delete paper
  delete: async (paperId) => {
    const res = await api.delete(`/admin/papers/${paperId}`);
    return res.data;
  },
};

// Questions API
export const questionsApi = {
  // Get all questions for a paper
  getByPaper: async (paperId) => {
    const res = await api.get(`/admin/papers/${paperId}/questions`);
    return res.data;
  },

  // Get single question
  getById: async (questionId) => {
    const res = await api.get(`/admin/questions/${questionId}`);
    return res.data;
  },

  // Create question
  create: async (paperId, questionData) => {
    // Validate paperId before making the request
    if (!paperId || paperId === 'null' || paperId === 'undefined' || paperId === null) {
      throw new Error('Paper ID is required to create a question');
    }
    const res = await api.post(`/admin/papers/${paperId}/questions`, questionData);
    return res.data;
  },

  // Update question
  update: async (questionId, questionData) => {
    const res = await api.put(`/admin/questions/${questionId}`, questionData);
    return res.data;
  },

  // Delete question
  delete: async (questionId) => {
    const res = await api.delete(`/admin/questions/${questionId}`);
    return res.data;
  },
};

// PDF Upload & Parsing API
export const uploadApi = {
  uploadPDF: async (paperId, file, year, title) => {
    const formData = new FormData();
    formData.append('file', file);
    if (year) formData.append('year', year);
    if (title) formData.append('title', title);

    const res = await api.post(`/admin/papers/${paperId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  parsePDF: async (paperId, uploadId, language = 'english') => {
    const res = await api.post(`/admin/papers/${paperId}/parse/${uploadId}`, {
      language: language
    });
    return res.data;
  },
  getParsedQuestions: async (paperId, uploadId) => {
    const res = await api.get(`/admin/papers/${paperId}/parse/${uploadId}`);
    return res.data.parsed_data || res.data; // adapt if backend returns different shape
  },
  saveParsedQuestions: async (paperId, uploadId, questions) => {
    const res = await api.post(`/admin/papers/${paperId}/parse/${uploadId}/save`, { questions });
    return res.data;
  }
};


// Import History API
export const importsApi = {
  // Get all imports
  getAll: async () => {
    const res = await api.get('/admin/imports');
    return res.data;
  },

  // Get single import
  getById: async (importId) => {
    const res = await api.get(`/admin/imports/${importId}`);
    return res.data;
  },
};

