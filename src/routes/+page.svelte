<script lang="ts">
  import Notes from '$lib/components/Notes.svelte';
</script>

<main class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
  <div class="bg-white shadow-md">
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-4xl font-bold text-center text-gray-800">
        <span class="text-blue-500">Notes</span> App
      </h1>
      <p class="text-center text-gray-600 mt-2">Organize your thoughts, one note at a time</p>
    </div>
  </div>
  <div class="container mx-auto px-4 py-8">
    <Notes />
  </div>
</main>
