import { showTemporaryAlert } from './alerts.js';
import { generateTable } from './generateTable.js';
import { dropdown } from './dropdownAtt.js';
import { cases } from './caseState.js';

export async function init() {
  console.log('🧤 GetTag script executed');

  const formGetTag = document.getElementById('getTag');
  if (!formGetTag) return;

  formGetTag.addEventListener('submit', async (event) => {

    // Prevent default form submission
    event.preventDefault();

    const input = formGetTag.querySelector('input[type="search"]');
    if (!input || !input.value.trim()) {
      showTemporaryAlert('alert', 'Please enter a tag name to search');
      return;
    }

    // Get the tag name from input
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

      const table = document.querySelector('.tagTable');
      // Clear previous results
      table.innerHTML = `
        <tr>
          <th>Tag</th>
          <th>Usability</th>
          <th>Actions</th>
          <th>Delete</th>
        </tr>
      `;

      // Fetch tag(s) by name
      const resTag = await fetch(`/tags/tagName/${encodeURIComponent(tagName)}`);
      if (await cases(resTag)) {

        // Load tags and attributes
        const rawTag = await resTag.json();
        // Ensure tags is always an array
        const tags = Array.isArray(rawTag) ? rawTag : [rawTag];

        const resAttrAll = await fetch('/tags/attributes');
        if (!resAttrAll.ok) throw new Error('Error fetching attributes list');
        const allAttributes = await resAttrAll.json();

        // For each tag found, create rows and filter attributes by tag id
        for (const t of tags) {
          const tagId = Number(t.id);
          // Robust filter: coerce to Number to avoid type mismatch
          const tagAttrs = allAttributes.filter(att => Number(att.tag) === tagId);
          console.log(`Attributes for tag id=${tagId}:`, tagAttrs);

          const row = document.createElement('tr');
          const dropdownRow = document.createElement('tr');
          dropdownRow.classList.add('dropdown-row');
          dropdownRow.style.display = 'none';

          const filled = generateTable(t, tagAttrs, row, dropdownRow);
          table.appendChild(filled.row);
          table.appendChild(filled.dropdownRow);
        }

        showTemporaryAlert('success', 'Tags retrieved successfully');
        return;
      }else {

        showTemporaryAlert('alert', 'No tags found with that name');

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
      }
      
    } catch (err) {
      console.error('Error fetching tag:', err);
      showTemporaryAlert('alert', 'An unexpected error occurred');
    }
  });
}