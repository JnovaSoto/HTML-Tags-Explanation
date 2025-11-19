import { showTemporaryAlert } from './alerts.js';

export async function init() {
  console.log('GetTag script executed');

  const formGetTag = document.getElementById('getTag');
  if (!formGetTag) return;

  formGetTag.addEventListener('submit', async (e) => {
    e.preventDefault(); // prevent form submission reload

    const input = formGetTag.querySelector('input[type="search"]');
    if (!input || !input.value.trim()) {
      showTemporaryAlert('alert', 'Please enter a tag name to search');
      return;
    }
    const tagName = input.value.trim();

    try {
      // Check user session
      const resSession = await fetch('/users/me');
      const sessionData = await resSession.json();

      if (!sessionData.loggedIn) {
        showTemporaryAlert('alert', 'You must log in to perform this action');
        return;
      }

      // Optional: check admin level (0 or 1)
      if (sessionData.admin !== 0 && sessionData.admin !== 1) {
        showTemporaryAlert('alert', 'You do not have permission to perform this action');
        return;
      }

      // Fetch tag by name
      const res = await fetch(`/tags/${encodeURIComponent(tagName)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Tag fetched successfully:', data);
        showTemporaryAlert('success', 'Tag retrieved successfully');
      } else if (res.status === 403) {
        showTemporaryAlert('alert', 'You do not have permission');
      } else if (res.status === 404) {
        showTemporaryAlert('alert', 'Tag not found');
      } else {
        const errData = await res.json();
        showTemporaryAlert('alert', errData.error || 'Failed to fetch tag');
      }

    } catch (err) {
      console.error('Error fetching tag:', err);
      showTemporaryAlert('alert', 'An unexpected error occurred');
    }
  });
}
