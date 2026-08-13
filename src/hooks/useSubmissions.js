import { useCallback, useEffect, useState } from 'react';

const SUBS_KEY = 'idea-bank-submissions';

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SUBS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Locally stored idea submissions, newest first. */
export function useSubmissions() {
  const [submissions, setSubmissions] = useState(read);

  useEffect(() => {
    try {
      localStorage.setItem(SUBS_KEY, JSON.stringify(submissions));
    } catch {
      /* storage full or blocked — entries stay in memory for this session */
    }
  }, [submissions]);

  const add = useCallback((entry) => {
    setSubmissions((current) => [entry, ...current]);
  }, []);

  const removeAt = useCallback((index) => {
    setSubmissions((current) => current.filter((_, i) => i !== index));
  }, []);

  return { submissions, add, removeAt };
}
