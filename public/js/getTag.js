import { showTemporaryAlert } from './alerts.js';
import { generateTable } from './generateTable.js';
import { dropdown } from './dropdownAtt.js';
import { cases } from './caseState.js';

export async function init() {
  console.log('🧤 GetTag script executed');

  const formGetTag = document.getElementById('getTag');
  if (!formGetTag) return;

  formGetTag.addEventListener('submit', async (event) => {
    event.preventDefault();

    const input = formGetTag.querySelector('input[type="search"]');
    if (!input || !input.value.trim()) {
      showTemporaryAlert('alert', 'Please enter a tag name to search');
      return;
    }

    const tagName = input.value.trim();

    try {
      // -------------------------------
      // Verify session
      // -------------------------------
      const resSession = await fetch('/users/me');
      const sessionData = await resSession.json();
      if (!sessionData.loggedIn) {
        showTemporaryAlert('alert', 'You must log in to search a tag');
        return;
      }

      // Fetch tag(s) by name
      const resTag = await fetch(`/tags/${encodeURIComponent(tagName)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (await cases(resTag)) {
        // Load tags and attributes
        const tags = await resTag.json();

        const resAttrs = await fetch('/tags/attributes');
        if (!resAttrs.ok) throw new Error('Error fetching attributes');
        const attributes = await resAttrs.json();

        console.log('Tag fetched successfully:', tags);
        console.log('✅ Attributes loaded:', attributes);

        const table = document.querySelector(".tagTable");
        const header = table.querySelector("tr");
        table.innerHTML = '';
        if (header) table.appendChild(header);

        // For each tag found, create rows and filter attributes by tag id
        tags.forEach(tag => {
          const row = document.createElement("tr");
          const dropdownRow = document.createElement("tr");
          dropdownRow.classList.add('dropdown-row');
          dropdownRow.style.display = 'none';

          // Robust filter: coerce to Number to avoid type mismatch
          const tagAttrs = attributes.filter(att => Number(att.tag) === Number(tag.id));

          const filledRows = generateTable(tag, tagAttrs, row, dropdownRow);
          table.appendChild(filledRows.row);
          table.appendChild(filledRows.dropdownRow);
        });

        // Use centralized dropdown binding (idempotent)
        dropdown(table);
        showTemporaryAlert('success', 'Tags retrieved successfully');
        return;
      }

      // If not found by name, search by attribute name (fallback)
      const resAttr = await fetch(`/tags/attribute/attributeName/${encodeURIComponent(tagName)}`);
      if (!(await cases(resAttr))) return;

      const attData = await resAttr.json();
      const attributesFound = Array.isArray(attData) ? attData : [attData];
      if (attributesFound.length === 0) {
        showTemporaryAlert('alert', 'No attributes found by that name');
        return;
      }

      // Take the first attribute and fetch its tag by id
      const firstAttr = attributesFound[0];
      const tagIdFromAttr = Number(firstAttr.tag);
      if (Number.isNaN(tagIdFromAttr)) {
        showTemporaryAlert('alert', 'Invalid attribute->tag association');
        return;
      }

      const resTagById = await fetch(`/tags/idTag/${encodeURIComponent(tagIdFromAttr)}`);
      if (!(await cases(resTagById))) return;

      const tagById = await resTagById.json();
      const tagsArray = Array.isArray(tagById) ? tagById : [tagById];

      const table = document.querySelector(".tagTable");
      const header = table.querySelector("tr");
      table.innerHTML = '';
      if (header) table.appendChild(header);

      tagsArray.forEach(t => {
        const row = document.createElement("tr");
        const dropdownRow = document.createElement("tr");
        dropdownRow.classList.add('dropdown-row');
        dropdownRow.style.display = 'none';

        const tagAttrs = attributesFound.filter(att => Number(att.tag) === Number(t.id));

        const filled = generateTable(t, tagAttrs, row, dropdownRow);
        table.appendChild(filled.row);
        table.appendChild(filled.dropdownRow);
      });

      dropdown(table);
      showTemporaryAlert('success', 'Tag(s) and attribute(s) found');

    } catch (err) {
      console.error('Error fetching tag:', err);
      showTemporaryAlert('alert', 'An unexpected error occurred');
    }
  });
}