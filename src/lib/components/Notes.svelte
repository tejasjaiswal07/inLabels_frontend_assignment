<script lang="ts">
  import { onMount } from 'svelte';
  
  // Types
  interface Note {
    id: number;
    title: string;
    content: string;
    createdAt: string;
  }

  // State
  let notes: Note[] = [];
  let loading = true;
  let error: string | null = null;
  let editingNote: Note | null = null;
  let newNote = { title: '', content: '' };
  let showDeleteModal = false;
  let noteToDelete: Note | null = null;
  let searchQuery = '';
  let sortBy: 'title' | 'createdAt' = 'createdAt';
  let sortOrder: 'asc' | 'desc' = 'desc';

  // API URL - Updated to the correct mockapi.io endpoint
  const API_URL = 'https://68502f62e7c42cfd1797bfb5.mockapi.io/api/v1/notes';

  // Fetch notes
  async function fetchNotes() {
    try {
      loading = true;
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      notes = Array.isArray(data) ? data : [];
      error = null;
    } catch (e: unknown) {
      console.error('Error fetching notes:', e);
      error = e instanceof Error ? e.message : 'Failed to fetch notes. Please try again later.';
    } finally {
      loading = false;
    }
  }

  // Create note
  async function createNote() {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const createdNote = await response.json();
      notes = [createdNote, ...notes];
      newNote = { title: '', content: '' };
      error = null;
    } catch (e: unknown) {
      console.error('Error creating note:', e);
      error = e instanceof Error ? e.message : 'Failed to create note. Please try again later.';
    }
  }

  // Update note
  async function updateNote(note: Note) {
    try {
      const response = await fetch(`${API_URL}/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedNote = await response.json();
      notes = notes.map(n => n.id === updatedNote.id ? updatedNote : n);
      editingNote = null;
      error = null;
    } catch (e: unknown) {
      console.error('Error updating note:', e);
      error = e instanceof Error ? e.message : 'Failed to update note. Please try again later.';
    }
  }

  // Delete note
  async function deleteNote(id: number) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      notes = notes.filter(note => note.id !== id);
      showDeleteModal = false;
      noteToDelete = null;
      error = null;
    } catch (e: unknown) {
      console.error('Error deleting note:', e);
      error = e instanceof Error ? e.message : 'Failed to delete note. Please try again later.';
    }
  }

  // Computed values
  $: filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'title') {
        return sortOrder === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else {
        return sortOrder === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Initialize
  onMount(fetchNotes);
</script>

<div class="container mx-auto px-4 py-8 max-w-7xl">
  <!-- Error Message -->
  {#if error}
    <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 shadow-md">
      <div class="flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>{error}</p>
      </div>
    </div>
  {/if}

  <!-- Search and Sort -->
  <div class="mb-8 bg-white rounded-xl shadow-md p-6">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1 relative">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search notes..."
          class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div class="flex gap-2">
        <select
          bind:value={sortBy}
          class="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="createdAt">Sort by Date</option>
          <option value="title">Sort by Title</option>
        </select>
        <button
          on:click={() => sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'}
          class="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  </div>

  <!-- Create Note Form -->
  <form
    on:submit|preventDefault={createNote}
    class="mb-8 bg-white rounded-xl shadow-md p-8 transition-all hover:shadow-lg"
  >
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Create New Note</h2>
    <div class="space-y-6">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          id="title"
          bind:value={newNote.title}
          placeholder="Enter note title"
          required
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
      <div>
        <label for="content" class="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          id="content"
          bind:value={newNote.content}
          placeholder="Write your note content here..."
          required
          rows="4"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
        ></textarea>
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
      >
        Create Note
      </button>
    </div>
  </form>

  <!-- Notes List -->
  {#if loading}
    <div class="flex justify-center items-center h-32">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  {:else if filteredNotes.length === 0}
    <div class="text-center py-12 bg-white rounded-xl shadow-md">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-xl text-gray-600">No notes found</p>
      <p class="text-gray-500 mt-2">Create your first note using the form above</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredNotes as note (note.id)}
        <div class="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg transform hover:scale-[1.02]">
          {#if editingNote?.id === note.id}
            <form
              on:submit|preventDefault={() => {
                if (editingNote) updateNote(editingNote);
              }}
              class="space-y-4"
            >
              <input
                type="text"
                bind:value={editingNote.title}
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                bind:value={editingNote.content}
                rows="3"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
              <div class="flex gap-2">
                <button
                  type="submit"
                  class="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                >
                  Save
                </button>
                <button
                  type="button"
                  on:click={() => editingNote = null}
                  class="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          {:else}
            <h3 class="text-xl font-semibold mb-2 text-gray-800">{note.title}</h3>
            <p class="text-gray-600 mb-4 whitespace-pre-wrap">{note.content}</p>
            <p class="text-sm text-gray-500 mb-4">
              {new Date(note.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <div class="flex gap-2">
              <button
                on:click={() => editingNote = { ...note }}
                class="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
              >
                Edit
              </button>
              <button
                on:click={() => {
                  noteToDelete = note;
                  showDeleteModal = true;
                }}
                class="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <!-- Delete Confirmation Modal -->
  {#if showDeleteModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl p-6 max-w-md w-full transform transition-all">
        <h3 class="text-xl font-bold mb-4 text-gray-800">Confirm Delete</h3>
        <p class="mb-6 text-gray-600">Are you sure you want to delete this note? This action cannot be undone.</p>
        <div class="flex gap-4">
          <button
            on:click={() => {
              if (noteToDelete) deleteNote(noteToDelete.id);
            }}
            class="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            Delete
          </button>
          <button
            on:click={() => {
              showDeleteModal = false;
              noteToDelete = null;
            }}
            class="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}
</div> 