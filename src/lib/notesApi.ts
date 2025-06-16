const BASE_URL = 'https://68502f62e7c42cfd1797bfb5.mockapi.io/api/v1/form';

export async function getNotes() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json();
}

export async function createNote(note: { title: string; content: string }) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error('Failed to create note');
  return res.json();
}

export async function updateNote(id: string, note: { title: string; content: string }) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error('Failed to update note');
  return res.json();
}

export async function deleteNote(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete note');
  return res.json();
} 