document.addEventListener('DOMContentLoaded', () => {
    // Buttons
    const shuffleBtn = document.getElementById('shuffleBtn');
    const saveClassBtn = document.getElementById('saveClassBtn');
    const shareBtn = document.getElementById('shareBtn');
    const viewGroupBtn = document.getElementById('viewGroupBtn');
    const viewClassesBtn = document.getElementById('viewClassesBtn');

    // Inputs/Containers
    const studentNamesInput = document.getElementById('studentNames');
    const groupCountSelect = document.getElementById('groupCount');
    const groupsContainer = document.getElementById('groupsContainer');
    const classSelect = document.getElementById('classSelect');
    const shareLinkInput = document.getElementById('shareLink');
    const studentInputContainer = document.getElementById('studentInputContainer');

    const groupingStrategySelect = document.getElementById('groupingStrategySelect');
    const groupingTypeSelect = document.getElementById('groupingTypeSelect');
    const groupingTypeContainer = document.getElementById('groupingTypeContainer');

    // Sections
    const groupsSection = document.getElementById('groupsSection');
    const classesSection = document.getElementById('classesSection');
    const classTableBody = document.getElementById('classTableBody');
    const classTitle = document.getElementById('classTitle');

    // Modals & Buttons for Attributes
    const editAttributesBtn = document.getElementById('editAttributesBtn');
    const deleteClassBtn = document.getElementById('deleteClassBtn');
    const editAttributesModalEl = document.getElementById('editAttributesModal');
    // Initialize Attribute Modal
    const editAttributesModal = new bootstrap.Modal(editAttributesModalEl);
    const saveAttributesBtn = document.getElementById('saveAttributesBtn');
    const attr1Input = document.getElementById('attr1Input');
    const attr2Input = document.getElementById('attr2Input');
    const attr3Input = document.getElementById('attr3Input');

    // Advanced Features UI
    const absentStudentsBtn = document.getElementById('absentStudentsBtn');
    const absentStudentsModalEl = document.getElementById('absentStudentsModal');
    const absentStudentsModal = new bootstrap.Modal(absentStudentsModalEl);
    const absentStudentsList = document.getElementById('absentStudentsList');
    const resetAbsentBtn = document.getElementById('resetAbsentBtn');
    const viewGridBtn = document.getElementById('viewGridBtn');
    const viewListBtn = document.getElementById('viewListBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn'); // Optional if implemented


    let qrCodeObj = null;

    // State
    let currentClassData = []; // Array of { name: string, attrs: { reading: '', behavior: '', social: '' }, isAbsent?: boolean }
    let currentClassName = '';
    let hasGeneratedGroups = false;
    let lastGeneratedGroups = null;
    let currentAttributeNames = ['Reading Level', 'Behavior', 'Social Group'];
    let currentGroupView = 'grid'; // 'grid' or 'list'

    // Populate Group Size Dropdown
    for (let i = 2; i <= 50; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        groupCountSelect.appendChild(option);
    }
    // Set default to something reasonable for "Students per Group"
    groupCountSelect.value = 4;

    // --- Helper: Parse/Format Student Data ---

    // Convert raw text to student objects
    function parseStudentText(text) {
        return text.split('\n')
            .map(n => n.trim())
            .filter(n => n.length > 0)
            .map(name => ({
                name: name,
                attrs: { reading: '', behavior: '', social: '' },
                isAbsent: false
            }));
    }

    // Convert student objects back to text (for textarea)
    function studentsToText(students) {
        return students.map(s => s.name).join('\n');
    }

    // --- State Encoding/Decoding (Legacy + New) ---

    function encodeState(students, groupCount, currentGroups) {
        const state = {
            s: students, // New: full objects
            c: groupCount,
            g: currentGroups
        };
        return btoa(JSON.stringify(state));
    }

    function decodeState(encoded) {
        try {
            return JSON.parse(atob(encoded));
        } catch (e) {
            console.error("Failed to decode state", e);
            return null;
        }
    }

    // --- View Toggling ---

    function switchView(view) {
        if (view === 'group') {
            groupsSection.style.display = 'block';
            classesSection.style.display = 'none';
            viewGroupBtn.className = 'active';
            viewClassesBtn.className = '';

            // Re-sync textarea if names changed in table
            if (currentClassData.length > 0) {
                studentNamesInput.value = studentsToText(currentClassData);
            }
        } else {
            groupsSection.style.display = 'none';
            classesSection.style.display = 'block';
            viewGroupBtn.className = '';
            viewClassesBtn.className = 'active';

            // Update Class Title
            classTitle.textContent = currentClassName || 'New Class';

            renderClassTable();
        }
    }

    viewGroupBtn.addEventListener('click', () => switchView('group'));
    viewClassesBtn.addEventListener('click', () => switchView('classes'));

    // --- Attribute Editing Logic ---

    function updateTableHeaders() {
        document.getElementById('thAttr1').textContent = currentAttributeNames[0];
        document.getElementById('thAttr2').textContent = currentAttributeNames[1];
        document.getElementById('thAttr3').textContent = currentAttributeNames[2];

        // Update Dropdown Labels
        if (groupingStrategySelect) {
            // Options 1, 2, 3 correspond to indices 1, 2, 3 (0 is Random)
            groupingStrategySelect.options[1].textContent = currentAttributeNames[0];
            groupingStrategySelect.options[2].textContent = currentAttributeNames[1];
            groupingStrategySelect.options[3].textContent = currentAttributeNames[2];
        }
    }

    if (groupingStrategySelect) {
        groupingStrategySelect.addEventListener('change', () => {
            if (groupingStrategySelect.value === 'random') {
                groupingTypeContainer.style.display = 'none';
            } else {
                groupingTypeContainer.style.display = 'block';
            }
        });
    }

    if (editAttributesBtn) {
        editAttributesBtn.addEventListener('click', () => {
            attr1Input.value = currentAttributeNames[0];
            attr2Input.value = currentAttributeNames[1];
            attr3Input.value = currentAttributeNames[2];
            editAttributesModal.show();
        });
    }

    if (saveAttributesBtn) {
        saveAttributesBtn.addEventListener('click', () => {
            currentAttributeNames = [
                attr1Input.value.trim() || 'Attribute 1',
                attr2Input.value.trim() || 'Attribute 2',
                attr3Input.value.trim() || 'Attribute 3'
            ];
            updateTableHeaders();
            editAttributesModal.hide();
            autoSave(); // Save changes to storage
        });
    }

    // Delete Class
    if (deleteClassBtn) {
        deleteClassBtn.addEventListener('click', () => {
            if (!currentClassName) return;
            if (confirm(`Are you sure you want to delete class "\${currentClassName}"?`)) {
                const savedClasses = JSON.parse(localStorage.getItem('readyGroupGo_classes') || '{}');
                delete savedClasses[currentClassName];
                localStorage.setItem('readyGroupGo_classes', JSON.stringify(savedClasses));

                // Reset
                currentClassName = '';
                currentClassData = [];
                currentAttributeNames = ['Reading Level', 'Behavior', 'Social Group'];
                studentNamesInput.value = '';
                loadSavedClasses();
                switchView('group'); // Go back to start
            }
        });
    }


    // --- View Toggle Logic ---
    if (viewGridBtn && viewListBtn) {
        viewGridBtn.addEventListener('click', () => {
            currentGroupView = 'grid';
            updateGroupViewUI();
        });
        viewListBtn.addEventListener('click', () => {
            currentGroupView = 'list';
            updateGroupViewUI();
        });
    }

    function updateGroupViewUI() {
        if (currentGroupView === 'grid') {
            viewGridBtn.classList.add('active');
            viewGridBtn.style.backgroundColor = '#d1f7c4'; // Keep the color
            viewListBtn.classList.remove('active');
            viewListBtn.style.backgroundColor = '';
        } else {
            viewGridBtn.classList.remove('active');
            viewGridBtn.style.backgroundColor = '';
            viewListBtn.classList.add('active');
            viewListBtn.style.backgroundColor = '#d1f7c4';
        }

        if (lastGeneratedGroups) {
            renderGroups(lastGeneratedGroups);
        }
    }


    // --- Full Screen Logic ---
    const fullScreenModalEl = document.getElementById('fullScreenModal');
    const fullScreenModal = new bootstrap.Modal(fullScreenModalEl);
    const fullScreenGroupsContainer = document.getElementById('fullScreenGroupsContainer');
    const fullScreenTitle = document.getElementById('fullScreenTitle');
    const fullScreenPrintBtn = document.getElementById('fullScreenPrintBtn');

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!hasGeneratedGroups) {
                alert('Please generate groups first.');
                return;
            }

            // Populate Data
            fullScreenTitle.textContent = currentClassName || 'My Class';
            // No URL needed in Fullscreen as per user request

            // Render Groups in Fullscreen Container
            renderGroupsFullscreen(lastGeneratedGroups || []);

            fullScreenModal.show();
        });
    }

    if (fullScreenPrintBtn) {
        fullScreenPrintBtn.addEventListener('click', () => {
            window.print();
        });
    }

    function renderGroupsFullscreen(groups) {
        fullScreenGroupsContainer.innerHTML = '';
        groups.forEach((group, index) => {
            const card = document.createElement('div');
            card.className = 'each-group'; // Uses same styling as group-box-share > each-group

            const title = document.createElement('div');
            title.textContent = `Group ${index + 1}`;
            title.className = 'title';

            const list = document.createElement('ul');
            list.className = 'names';

            group.forEach(student => {
                const sObj = (typeof student === 'string') ? { name: student } : student;
                const li = document.createElement('li');
                li.textContent = sObj.name;
                // No drag and drop in fullscreen usually?
                // But CSS style3.css .full-screen .group-box-share .each-group .names li exists
                list.appendChild(li);
            });

            card.appendChild(title);
            card.appendChild(list);
            fullScreenGroupsContainer.appendChild(card);
        });
    }

    // --- Absent Student Logic ---

    function renderAbsentModal() {
        absentStudentsList.innerHTML = '';
        currentClassData.forEach((student, index) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `btn btn-sm m-1 ${student.isAbsent ? 'btn-danger text-decoration-line-through' : 'btn-outline-secondary'}`;
            btn.textContent = student.name;
            btn.style.minWidth = '100px';
            btn.addEventListener('click', () => {
                student.isAbsent = !student.isAbsent;
                renderAbsentModal();
            });
            absentStudentsList.appendChild(btn);
        });
    }

    if (absentStudentsBtn) {
        absentStudentsBtn.addEventListener('click', () => {
            // Sync first to ensure names are up to date
            if (currentClassData.length === 0 && studentNamesInput.value.trim()) {
                currentClassData = parseStudentText(studentNamesInput.value);
            }
            renderAbsentModal();
            absentStudentsModal.show();
        });
    }

    if (resetAbsentBtn) {
        resetAbsentBtn.addEventListener('click', () => {
            currentClassData.forEach(s => s.isAbsent = false);
            renderAbsentModal();
        });
    }

    // Auto-save absent status when modal hides? Or just rely on next auto-save action?
    // Better to auto-save on change or close.
    if (absentStudentsModalEl) {
        absentStudentsModalEl.addEventListener('hidden.bs.modal', () => {
            autoSave();
            // If groups are visible, maybe re-shuffle? Or let user do it. User should do it.
        });
    }


    // --- Table Rendering/Editing ---

    function renderClassTable() {
        classTableBody.innerHTML = '';
        updateTableHeaders();

        // If we are in "Paste Names" mode but haven't parsed them yet
        const rawText = studentNamesInput.value.trim();
        if (currentClassData.length === 0 && rawText) {
            currentClassData = parseStudentText(rawText);
        }

        currentClassData.forEach((student, index) => {
            const tr = document.createElement('tr');

            // Name
            const tdName = document.createElement('td');
            const inputName = document.createElement('input');
            inputName.className = 'form-control form-control-sm';
            inputName.value = student.name;
            inputName.addEventListener('change', (e) => {
                student.name = e.target.value;
                autoSave();
            });
            tdName.appendChild(inputName);

            // Attributes (Reading, Behavior, Social)
            const tdReading = createAttrCell(student, 'reading');
            const tdBehavior = createAttrCell(student, 'behavior');
            const tdSocial = createAttrCell(student, 'social');

            tr.appendChild(tdName);
            tr.appendChild(tdReading);
            tr.appendChild(tdBehavior);
            tr.appendChild(tdSocial);
            classTableBody.appendChild(tr);
        });
    }

    function createAttrCell(student, attrKey) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text'; // or number
        input.className = 'form-control form-control-sm';
        input.value = student.attrs[attrKey] || '';
        input.addEventListener('change', (e) => {
            student.attrs[attrKey] = e.target.value;
            autoSave();
        });
        td.appendChild(input);
        return td;
    }

    function autoSave() {
        if (currentClassName) {
            const savedClasses = JSON.parse(localStorage.getItem('readyGroupGo_classes') || '{}');
            // Save as object with headers, or just data?
            // To maintain backward compat, we should check structure. 
            // New structure: { data: [...], headers: [...] }
            savedClasses[currentClassName] = {
                data: currentClassData,
                headers: currentAttributeNames
            };
            localStorage.setItem('readyGroupGo_classes', JSON.stringify(savedClasses));
        }
        // Also update the textarea for consistency
        studentNamesInput.value = studentsToText(currentClassData);
    }

    // --- Load from URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');
    if (sharedData) {
        const state = decodeState(sharedData);
        if (state) {
            // Handle legacy "n" (names array) vs new "s" (students array)
            if (state.s) {
                currentClassData = state.s;
                studentNamesInput.value = studentsToText(currentClassData);
            } else if (state.n) {
                currentClassData = state.n.map(name => ({
                    name: name,
                    attrs: { reading: '', behavior: '', social: '' }
                }));
                studentNamesInput.value = state.n.join('\n');
            }

            if (state.h) {
                currentAttributeNames = state.h;
                updateTableHeaders();
            }

            if (state.c) groupCountSelect.value = state.c;

            if (state.g && Array.isArray(state.g)) {
                // If specific groups came from URL, render them
                // We need to map strings back to objects if legacy
                // For simplicity, just rendering names if legacy
                hasGeneratedGroups = true; // Flag that we have groups
                renderGroups(state.g.map(g => g.map(name => {
                    // Find student object or create temp
                    return currentClassData.find(s => s.name === name) || { name: name, attrs: {} };
                })));
                // Update view state
                switchView('group');
            }
        }
    }

    // --- Save/Load LocalStorage ---

    function loadSavedClasses() {
        classSelect.innerHTML = '<option value="">Select Choose Class</option>';
        const savedClasses = JSON.parse(localStorage.getItem('readyGroupGo_classes') || '{}');
        for (const className in savedClasses) {
            const option = document.createElement('option');
            option.value = className;
            option.textContent = className;
            classSelect.appendChild(option);
        }
    }
    loadSavedClasses();

    classSelect.addEventListener('change', () => {
        const selectedClass = classSelect.value;
        currentClassName = selectedClass;

        if (selectedClass) {
            const savedClasses = JSON.parse(localStorage.getItem('readyGroupGo_classes') || '{}');
            const storedStruct = savedClasses[selectedClass];

            // Migration check
            if (Array.isArray(storedStruct)) {
                // Old format: just the array
                // check if inside is string or object
                if (storedStruct.length > 0 && typeof storedStruct[0] === 'string') {
                    currentClassData = parseStudentText(storedStruct.join('\n'));
                } else {
                    currentClassData = storedStruct;
                }
                currentAttributeNames = ['Reading Level', 'Behavior', 'Social Group']; // Reset defaults
            } else if (storedStruct && storedStruct.data) {
                // New format: { data: [], headers: [] }
                currentClassData = storedStruct.data;
                currentAttributeNames = storedStruct.headers || ['Reading Level', 'Behavior', 'Social Group'];
            }

            studentNamesInput.value = studentsToText(currentClassData);

            // Sync UI with loaded attributes
            updateTableHeaders();

            // Auto-Generate Groups Logic (Default size 4)
            if (groupCountSelect) {
                groupCountSelect.value = '4';
            }

            // Don't auto-switch view, but clear existing groups as context changed
            hasGeneratedGroups = false;

            // Render basic view first
            if (classesSection.style.display !== 'none') {
                renderClassTable();
            } else {
                switchView('group');
                // Trigger Shuffle automatically if we have students
                if (currentClassData.length > 0 && shuffleBtn) {
                    shuffleBtn.click();
                }
            }
        } else {
            currentClassData = [];
            currentAttributeNames = ['Reading Level', 'Behavior', 'Social Group'];
            studentNamesInput.value = '';
            hasGeneratedGroups = false;
            if (groupsSection.style.display !== 'none') {
                switchView('group');
            }
        }
    });

    studentNamesInput.addEventListener('input', () => {
        // If user edits text directly, we re-parse and potentially lose attributes unless we are careful.
        // For a simple version using textual input primarily for "Quick Paste", we just reset attributes.
        // Ideally, we'd diff, but for now, simple is better.
        currentClassData = parseStudentText(studentNamesInput.value);
    });

    saveClassBtn.addEventListener('click', () => {
        const rawNames = studentNamesInput.value.trim();
        if (!rawNames) {
            alert('Please enter some student names to save.');
            return;
        }

        const className = prompt("Enter a name for this class:", currentClassName || "");
        if (className) {
            currentClassName = className;
            // Ensure currentClassData is up to date
            if (currentClassData.length === 0) {
                currentClassData = parseStudentText(rawNames);
            }

            autoSave(); // Save with headers logic

            alert('Class saved!');
            loadSavedClasses();
            classSelect.value = className;
        }
    });

    // --- Sharing ---

    function generateShareUrl() {
        const groupCount = parseInt(groupCountSelect.value);

        let currentGroups = null;
        if (lastGeneratedGroups && lastGeneratedGroups.length > 0) {
            // Convert objects to just names if needed, but encodeState might handle objects?
            // Checking encodeState implementation... 
            // It likely expects names.
            currentGroups = lastGeneratedGroups.map(group => group.map(s => (typeof s === 'object' ? s.name : s)));
        }

        const stateEncoded = encodeState(currentClassData, groupCount, currentGroups);
        return `${window.location.origin}${window.location.pathname}?data=${stateEncoded}`;
    }

    shareBtn.addEventListener('click', () => {
        if (currentClassData.length === 0 && (!lastGeneratedGroups || lastGeneratedGroups.length === 0)) {
            alert("Nothing to share!");
            return;
        }

        const shareUrl = generateShareUrl();
        shareLinkInput.value = shareUrl;

        const qrContainer = document.getElementById('qrcode');
        qrContainer.innerHTML = '';
        qrCodeObj = new QRCode(qrContainer, {
            text: shareUrl,
            width: 128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        const shareModal = new bootstrap.Modal(document.getElementById('shareModal'));
        shareModal.show();
    });


    function renderGroups(groups) {
        groupsContainer.innerHTML = '';

        if (currentGroupView === 'list') {
            renderGroupsTable(groups);
        } else {
            renderGroupsGrid(groups);
        }
    }

    function renderGroupsGrid(groups) {
        let draggedItem = null;

        groups.forEach((group, index) => {
            const card = document.createElement('div');
            card.className = 'each-group';

            const title = document.createElement('h5');
            title.textContent = `Group ${index + 1}`;
            title.className = 'title';

            const list = document.createElement('ul');
            list.className = 'names';

            // Drag over listener for the card
            card.addEventListener('dragover', (e) => {
                e.preventDefault();
                card.style.backgroundColor = '#f0f8ff';
                card.style.transform = 'scale(1.02)';
                card.style.transition = 'all 0.2s';
            });

            card.addEventListener('dragleave', (e) => {
                card.style.backgroundColor = '';
                card.style.transform = '';
            });

            card.addEventListener('drop', (e) => {
                e.preventDefault();
                card.style.backgroundColor = '';
                card.style.transform = '';
                if (draggedItem) {
                    list.appendChild(draggedItem);
                    draggedItem = null;
                }
            });

            group.forEach(student => {
                // student can be string (from share) or object
                const sObj = (typeof student === 'string') ? { name: student, attrs: {} } : student;

                const li = document.createElement('li');
                li.className = 'draggable-student';
                li.draggable = true;
                li.textContent = sObj.name;

                li.addEventListener('dragstart', (e) => {
                    draggedItem = li;
                    setTimeout(() => { li.style.opacity = '0.5'; }, 0);
                    e.stopPropagation();
                });

                li.addEventListener('dragend', (e) => {
                    setTimeout(() => { li.style.opacity = '1'; draggedItem = null; }, 0);
                });

                list.appendChild(li);
            });

            card.appendChild(title);
            card.appendChild(list);
            groupsContainer.appendChild(card);
        });
    }

    function renderGroupsTable(groups) {
        const table = document.createElement('table');
        table.className = 'table table-bordered table-striped';
        table.style.backgroundColor = 'white';
        table.style.borderRadius = '8px';
        table.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';

        // Header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th style="width: 15%">Group</th>
                <th style="width: 25%">Name</th>
                <th style="width: 20%">${currentAttributeNames[0]}</th>
                <th style="width: 20%">${currentAttributeNames[1]}</th>
                <th style="width: 20%">${currentAttributeNames[2]}</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        groups.forEach((group, groupIndex) => {
            group.forEach((student, studentIndex) => {
                const sObj = (typeof student === 'string') ? { name: student, attrs: {} } : student;
                const tr = document.createElement('tr');

                // Group Name Cell (Rowspan logic)
                if (studentIndex === 0) {
                    const tdGroup = document.createElement('td');
                    tdGroup.textContent = `Group ${groupIndex + 1}`;
                    tdGroup.rowSpan = group.length;
                    tdGroup.style.fontWeight = 'bold';
                    tdGroup.style.verticalAlign = 'middle';
                    tdGroup.style.backgroundColor = groupIndex % 2 === 0 ? '#f8f9fa' : '#ffffff'; // Slight alt color for group blocks?
                    tr.appendChild(tdGroup);
                }

                // Student Name
                const tdName = document.createElement('td');
                tdName.textContent = sObj.name;
                tr.appendChild(tdName);

                // Attributes
                const tdAttr1 = document.createElement('td');
                tdAttr1.textContent = sObj.attrs ? sObj.attrs.reading || '' : '';
                tr.appendChild(tdAttr1);

                const tdAttr2 = document.createElement('td');
                tdAttr2.textContent = sObj.attrs ? sObj.attrs.behavior || '' : '';
                tr.appendChild(tdAttr2);

                const tdAttr3 = document.createElement('td');
                tdAttr3.textContent = sObj.attrs ? sObj.attrs.social || '' : '';
                tr.appendChild(tdAttr3);

                tbody.appendChild(tr);
            });
        });

        table.appendChild(tbody);
        groupsContainer.appendChild(table);
    }

    shuffleBtn.addEventListener('click', () => {
        // Sync data first
        if (currentClassData.length === 0) {
            currentClassData = parseStudentText(studentNamesInput.value);
        }

        if (currentClassData.length === 0) {
            alert('Please enter some student names.');
            return;
        }

        const maxGroupSize = parseInt(groupCountSelect.value);
        // Logic Update: Calculate number of groups based on Max Students per Group
        // e.g. 10 students, max 3 -> 4 groups (3,3,2,2)

        // Strategy & Type
        const strategy = groupingStrategySelect ? groupingStrategySelect.value : 'random';
        // If strategy logic selected, check type
        const type = (strategy !== 'random' && groupingTypeSelect) ? groupingTypeSelect.value : 'diversify';

        // Filter out absent students
        let currentList = currentClassData.filter(s => !s.isAbsent);

        // Recalculate numGroups based on ACTUAL count
        const totalStudents = currentList.length;
        const numGroupsActual = Math.ceil(totalStudents / maxGroupSize);
        if (numGroupsActual < 1) {
            alert('No active students available for grouping!');
            return;
        }

        const groups = Array.from({ length: numGroupsActual }, () => []);

        if (strategy === 'random') {
            // --- Random Shuffle ---
            for (let i = currentList.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [currentList[i], currentList[j]] = [currentList[j], currentList[i]];
            }
            // Distribute Balanced (Round Robin)
            currentList.forEach((s, index) => {
                groups[index % numGroupsActual].push(s);
            });

        } else {
            // --- Attribute Based ---
            // Sort by attribute value
            currentList.sort((a, b) => {
                const valA = (a.attrs[strategy] || '').toLowerCase();
                const valB = (b.attrs[strategy] || '').toLowerCase();
                if (valA < valB) return -1;
                if (valA > valB) return 1;
                return 0;
            });

            if (type === 'uniform') {
                // Uniformly (Homogeneous): Chunk them
                // Fill group 1 to Max, then Group 2, etc.
                let currentGroupIndex = 0;
                currentList.forEach(s => {
                    if (groups[currentGroupIndex].length >= maxGroupSize) {
                        currentGroupIndex++;
                    }
                    if (currentGroupIndex < groups.length) {
                        groups[currentGroupIndex].push(s);
                    }
                });

            } else {
                // Diversify (Heterogeneous): Round Robin on Sorted List
                // This ensures "lows" and "highs" are distributed across groups
                currentList.forEach((s, index) => {
                    groups[index % numGroupsActual].push(s);
                });
            }
        }

        hasGeneratedGroups = true;
        lastGeneratedGroups = groups;
        renderGroups(groups);
        switchView('group'); // Switch back to see result
    });
});
