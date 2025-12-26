 function test(){
            alert("hi");
        }

        const columnInput = document.getElementById('columnInput');
        const addBtn = document.getElementById('addBtn');
        const clearBtn = document.getElementById('clearBtn');
        const headerRow = document.getElementById('headerRow');
        const dataRow = document.getElementById('dataRow');

        columnInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addColumn();
            }
        });

        // important arrays
        const hole_arr = []; // array of holes
        const p_arr = []; // array of process object
        var count = 0;
                
        let dynamicColumnCount = 0;
        let isPriorityColumnVisible = false;
                
        function addColumn() {
            const columnName = columnInput.value.trim();
            
            if (columnName) {
                // Create new header cell
                const newHeader = document.createElement('th');
                newHeader.textContent = columnName;
                hole_arr.push(Number(columnName));
                
                // Insert before "IF" column (index 1)
                headerRow.insertBefore(newHeader, headerRow.children[1 + dynamicColumnCount]);
                
                dynamicColumnCount++;
                columnInput.value = '';
                
                // Add to partition table
                const partitionTableBody = document.getElementById('partitionTableBody');
                if (partitionTableBody.querySelector('tr td')?.textContent === '-') {
                    partitionTableBody.innerHTML = '';
                }
                const newRow = partitionTableBody.insertRow();
                newRow.insertCell(0).textContent = columnName;
                
                // Show clear button
                clearBtn.classList.remove('hidden');
            }
        }

        function clearAllColumns() {
            // Remove all dynamic columns (between Time and IF)
            while (headerRow.children.length > 5) {
                headerRow.removeChild(headerRow.children[1]);
            }
            
            dynamicColumnCount = 0;
            hole_arr.length = 0;
            clearBtn.classList.add('hidden');
            
            // Clear partition table
            const partitionTableBody = document.getElementById('partitionTableBody');
            partitionTableBody.innerHTML = '<tr><td>-</td></tr>';
        }
         
        class Process {
          constructor(process_name, arrival_time, burst_time, mr, priority) {
            this.process_name = process_name; // string
            this.arrival_time = arrival_time; // int
            this.burst_time = burst_time; // int
            this.mr = mr; // int
            this.priority = priority || null; // number/int

            this.start_time = -1; // int
            this.end_time = 0; // int
            this.running = false; // boolean
            this.allocated = false; // boolean
            this.waiting = false; // boolean
            this.finished = false; // boolean
          }
        }

        function addProcessToTable(process) {
            const tableBody = document.getElementById("tableBody2");
            
            // Remove placeholder row if it exists
            const placeholderRow = tableBody.querySelector('tr td[colspan]');
            if (placeholderRow) {
                placeholderRow.parentElement.remove();
            }
            
            // Check if there's a row with all "-" values
            const rows = tableBody.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                let allDashes = true;
                cells.forEach(cell => {
                    if (cell.textContent !== '-') {
                        allDashes = false;
                    }
                });
                if (allDashes) {
                    row.remove();
                }
            });

            const row = tableBody.insertRow();

            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);

            cell1.textContent = process.process_name;
            cell2.textContent = process.arrival_time;
            cell3.textContent = process.burst_time;
            cell4.textContent = process.mr;

            // Add priority cell if NPP is selected
            if (isPriorityColumnVisible) {
                const cell5 = row.insertCell(4);
                cell5.textContent = process.priority || '-';
            }
            
            // Show edit button when data is added
            document.getElementById('editBtn').classList.remove('hidden');
        }

        function createProcess(){
            const priorityInput = document.getElementById("priority");
            const priority = isPriorityColumnVisible ? priorityInput.value : null;
            
            const obj = new Process(
                document.getElementById("process_name").value,
                document.getElementById("arrival_time").value,
                document.getElementById("burst_time").value,
                document.getElementById("mr").value,
                priority
            );

            p_arr.push(obj);
            addProcessToTable(obj);

            // Clear inputs
            document.getElementById("process_name").value = '';
            document.getElementById("arrival_time").value = '';
            document.getElementById("burst_time").value = '';
            document.getElementById("mr").value = '';
            if (isPriorityColumnVisible) {
                priorityInput.value = '';
            }
        }

        function generateSample1() {
            const fixedData = [
                {name: 'A', arrival: 0, burst: 5, mr: 7},
                {name: 'B', arrival: 1, burst: 10, mr: 3},
                {name: 'C', arrival: 2, burst: 3, mr: 6},
                {name: 'D', arrival: 3, burst: 3, mr: 6}
            ];
            fixedData.forEach(data => {
                const obj = new Process(data.name, data.arrival, data.burst, data.mr, null);
                p_arr.push(obj);
                addProcessToTable(obj);
            });
        }

        function generateSample2() {
            const fixedData = [
                {name: 'A', arrival: 0, burst: 6, mr: 9},
                {name: 'B', arrival: 1, burst: 8, mr: 5},
                {name: 'C', arrival: 2, burst: 4, mr: 8},
                {name: 'D', arrival: 3, burst: 5, mr: 7}
            ];
            fixedData.forEach(data => {
                const obj = new Process(data.name, data.arrival, data.burst, data.mr, null);
                p_arr.push(obj);
                addProcessToTable(obj);
            });
        }

        function generateSampleProcesses() {
            const algo = document.getElementById('algorithm_options').value;
            
            if (algo === 'FCFS') {
                const fixedData = [
                    {name: 'A', arrival: 0, burst: 5, mr: 7},
                    {name: 'B', arrival: 1, burst: 10, mr: 3},
                    {name: 'C', arrival: 2, burst: 3, mr: 6},
                    {name: 'D', arrival: 3, burst: 3, mr: 6}
                ];
                fixedData.forEach(data => {
                    const obj = new Process(data.name, data.arrival, data.burst, data.mr, null);
                    p_arr.push(obj);
                    addProcessToTable(obj);
                });
            } else if (algo === 'SJF') {
                const fixedData = [
                    {name: 'A', arrival: 0, burst: 6, mr: 9},
                    {name: 'B', arrival: 1, burst: 8, mr: 5},
                    {name: 'C', arrival: 2, burst: 4, mr: 8},
                    {name: 'D', arrival: 3, burst: 5, mr: 7}
                ];
                fixedData.forEach(data => {
                    const obj = new Process(data.name, data.arrival, data.burst, data.mr, null);
                    p_arr.push(obj);
                    addProcessToTable(obj);
                });
            } else {
                // Random generation for NPP
                for (let i = 1; i <= 5; i++) {
                    const obj = new Process(
                        'P' + i,
                        Math.floor(Math.random() * 19),
                        Math.floor(Math.random() * 9) + 2,
                        Math.floor(Math.random() * 91) + 30,
                        Math.floor(Math.random() * 3) + 1
                    );
                    p_arr.push(obj);
                    addProcessToTable(obj);
                }
            }
            
            /* Random generation (commented for future use)
            for (let i = 1; i <= 5; i++) {
                const obj = new Process(
                    'P' + i,
                    Math.floor(Math.random() * 19),
                    Math.floor(Math.random() * 9) + 2,
                    Math.floor(Math.random() * 91) + 30,
                    isPriorityColumnVisible ? Math.floor(Math.random() * 3) + 1 : null
                );
                p_arr.push(obj);
                addProcessToTable(obj);
            }
            */
        }

        function showGenerateModal() {
            const genPriorityDiv = document.getElementById('genPriorityDiv');
            if (isPriorityColumnVisible) {
                genPriorityDiv.classList.remove('hidden');
            } else {
                genPriorityDiv.classList.add('hidden');
            }
            document.getElementById('generateModal').classList.remove('hidden');
        }

        function closeGenerateModal() {
            document.getElementById('generateModal').classList.add('hidden');
        }

        function confirmGenerate() {
            const count = parseInt(document.getElementById('genCount').value);
            const arrivalMin = parseInt(document.getElementById('genArrivalMin').value);
            const arrivalMax = parseInt(document.getElementById('genArrivalMax').value);
            const burstMin = parseInt(document.getElementById('genBurstMin').value);
            const burstMax = parseInt(document.getElementById('genBurstMax').value);
            const mrMin = parseInt(document.getElementById('genMrMin').value);
            const mrMax = parseInt(document.getElementById('genMrMax').value);
            const priorityMin = parseInt(document.getElementById('genPriorityMin').value);
            const priorityMax = parseInt(document.getElementById('genPriorityMax').value);
            
            for (let i = 1; i <= count; i++) {
                const obj = new Process(
                    'P' + i,
                    Math.floor(Math.random() * (arrivalMax - arrivalMin + 1)) + arrivalMin,
                    Math.floor(Math.random() * (burstMax - burstMin + 1)) + burstMin,
                    Math.floor(Math.random() * (mrMax - mrMin + 1)) + mrMin,
                    isPriorityColumnVisible ? Math.floor(Math.random() * (priorityMax - priorityMin + 1)) + priorityMin : null
                );
                p_arr.push(obj);
                addProcessToTable(obj);
            }
            
            closeGenerateModal();
        }

        function clearProcessTable() {
            const tableBody = document.getElementById("tableBody2");
            tableBody.innerHTML = '<tr><td>-</td><td>-</td><td>-</td><td>-</td></tr>';
            p_arr.length = 0;
            document.getElementById('editBtn').classList.add('hidden');
        }

        let originalTableData = [];
        let deletedRows = [];

        function enableEdit() {
            const tableBody = document.getElementById('tableBody2');
            const headerRow = document.getElementById('headerRow2');
            const rows = tableBody.querySelectorAll('tr');
            originalTableData = [];
            deletedRows = [];
            
            // Add delete column header
            const deleteHeader = document.createElement('th');
            deleteHeader.textContent = 'Delete';
            deleteHeader.id = 'deleteHeader';
            headerRow.appendChild(deleteHeader);
            
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length > 0 && cells[0].textContent !== '-') {
                    const rowData = [];
                    cells.forEach((cell, idx) => {
                        rowData.push(cell.textContent);
                        const input = document.createElement('input');
                        input.type = idx === 0 ? 'text' : 'number';
                        input.value = cell.textContent;
                        input.className = 'editable-input';
                        cell.textContent = '';
                        cell.appendChild(input);
                    });
                    originalTableData.push(rowData);
                    
                    // Add delete button
                    const deleteCell = row.insertCell(-1);
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.className = 'delete-row-btn';
                    deleteBtn.onclick = function() { deleteRow(row); };
                    deleteCell.appendChild(deleteBtn);
                }
            });
            
            document.getElementById('editBtn').classList.add('hidden');
            document.getElementById('saveBtn').classList.remove('hidden');
            document.getElementById('cancelEditBtn').classList.remove('hidden');
        }

        function deleteRow(row) {
            const cells = row.querySelectorAll('td');
            const rowData = [];
            cells.forEach((cell, idx) => {
                if (idx < cells.length - 1) {
                    const input = cell.querySelector('input');
                    if (input) {
                        rowData.push(input.value);
                    }
                }
            });
            deletedRows.push({ data: rowData, row: row });
            row.style.display = 'none';
        }

        function saveEdit() {
            const tableBody = document.getElementById('tableBody2');
            const headerRow = document.getElementById('headerRow2');
            const rows = tableBody.querySelectorAll('tr');
            p_arr.length = 0;
            
            // Remove deleted rows permanently
            deletedRows.forEach(item => {
                item.row.remove();
            });
            deletedRows = [];
            
            rows.forEach(row => {
                if (row.style.display !== 'none') {
                    const cells = row.querySelectorAll('td');
                    if (cells.length > 0) {
                        const inputs = row.querySelectorAll('input');
                        if (inputs.length > 0) {
                            const values = [];
                            inputs.forEach((input, idx) => {
                                const value = input.value;
                                values.push(value);
                                cells[idx].textContent = value;
                            });
                            
                            if (values[0] !== '-') {
                                const obj = new Process(values[0], values[1], values[2], values[3], values[4] || null);
                                p_arr.push(obj);
                            }
                            
                            // Remove delete button cell
                            if (cells.length > (isPriorityColumnVisible ? 5 : 4)) {
                                cells[cells.length - 1].remove();
                            }
                        }
                    }
                }
            });
            
            // Remove delete column header
            const deleteHeader = document.getElementById('deleteHeader');
            if (deleteHeader) {
                deleteHeader.remove();
            }
            
            document.getElementById('editBtn').classList.remove('hidden');
            document.getElementById('saveBtn').classList.add('hidden');
            document.getElementById('cancelEditBtn').classList.add('hidden');
        }

        function cancelEdit() {
            const tableBody = document.getElementById('tableBody2');
            const headerRow = document.getElementById('headerRow2');
            const rows = tableBody.querySelectorAll('tr');
            let dataIdx = 0;
            
            // Restore deleted rows
            deletedRows.forEach(item => {
                item.row.style.display = '';
            });
            deletedRows = [];
            
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length > 0) {
                    const inputs = row.querySelectorAll('input');
                    if (inputs.length > 0 && dataIdx < originalTableData.length) {
                        cells.forEach((cell, idx) => {
                            if (idx < originalTableData[dataIdx].length) {
                                cell.textContent = originalTableData[dataIdx][idx];
                            }
                        });
                        dataIdx++;
                        
                        // Remove delete button cell
                        if (cells.length > originalTableData[0].length) {
                            cells[cells.length - 1].remove();
                        }
                    }
                }
            });
            
            // Remove delete column header
            const deleteHeader = document.getElementById('deleteHeader');
            if (deleteHeader) {
                deleteHeader.remove();
            }
            
            document.getElementById('editBtn').classList.remove('hidden');
            document.getElementById('saveBtn').classList.add('hidden');
            document.getElementById('cancelEditBtn').classList.add('hidden');
        }

        function finalizeData() {
            const hasProcesses = p_arr.length > 0;
            const hasMemoryBlocks = hole_arr.length > 0;
            const modal = document.getElementById('modal');
            const modalMessage = document.getElementById('modalMessage');

            if (hasProcesses && hasMemoryBlocks) {
                modalMessage.textContent = 'Simulation Ready!';
                modal.classList.remove('hidden');
                
                // Disable input buttons
                document.getElementById('addProcessBtn').disabled = true;
                document.getElementById('generateSampleBtn').disabled = true;
                document.getElementById('clearTableBtn').disabled = true;
                document.getElementById('addBtn').disabled = true;
                document.getElementById('clearBtn').disabled = true;
                document.getElementById('algorithm_options').disabled = true;
                document.getElementById('allocation_strat_options').disabled = true;
                document.getElementById('finalizeBtn').disabled = true;
                
                // Enable action buttons
                document.getElementById('proceedBtn').disabled = false;
                document.getElementById('proceedBtn').classList.remove('hidden');

                document.getElementById('algorithmLabel').classList.remove('hidden');
                document.getElementById('allocationLabel').classList.remove('hidden');

                document.getElementById('repeatBtn').disabled = false;
                document.getElementById('repeatBtn').classList.remove('hidden');
                document.getElementById('finishBtn').disabled = false;
                document.getElementById('finishBtn').classList.remove('hidden');
                document.getElementById('editVariablesBtn').classList.remove('hidden');
                document.getElementById('resetBtn').classList.remove('hidden');
                document.getElementById('editBtn').classList.add('hidden');
                
                // Determine algorithm combination
                determineAlgorithm();
                
                // Check which processes can fit
                checkProcessFit();
                
                // Clone dataTable2 to dataTable3
                cloneProcessTable();
                
                // Show labels
                showAlgorithmLabels();
                
                // Create arrival timeline
                createArrivalTimeline();
                
                // Hide input sections
                hideInputSections();
            } else {
                modalMessage.textContent = 'Simulation Not Ready. Fill in necessary data.';
                modal.classList.remove('hidden');
            }
        }

        function hideInputSections() {
            const stepsContainers = document.querySelectorAll('.steps-container');
            stepsContainers.forEach(container => container.classList.add('hidden'));
            document.querySelector('.memory-options').classList.add('hidden');
            document.querySelector('.finalize-section').classList.add('hidden');
        }

        function showInputSections() {
            const stepsContainers = document.querySelectorAll('.steps-container');
            stepsContainers.forEach(container => container.classList.remove('hidden'));
            document.querySelector('.memory-options').classList.remove('hidden');
            document.querySelector('.finalize-section').classList.remove('hidden');
        }

        function showAlgorithmLabels() {
            const algo = document.getElementById('algorithm_options').value;
            const allocStrat = document.getElementById('allocation_strat_options').value;
            const algoNames = {FCFS: 'First Come First Serve', SJF: 'Shortest Job First', NPP: 'Non-Preemptive Priority'};
            const allocNames = {first_fit: 'First Fit', next_fit: 'Next Fit', best_fit: 'Best Fit', worst_fit: 'Worst Fit'};
            document.getElementById('algorithmLabel').textContent = algoNames[algo];
            document.getElementById('allocationLabel').textContent = allocNames[allocStrat];
            document.getElementById('labelsContainer').classList.remove('hidden');
            document.getElementById('timeDisplay').classList.remove('hidden');
            document.getElementById('editControls').classList.add('hidden');
        }

        function cloneProcessTable() {
            const tableBody2 = document.getElementById('tableBody2');
            const tableBody3 = document.getElementById('tableBody3');
            
            tableBody3.innerHTML = '';
            const rows = tableBody2.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length > 0 && cells[0].textContent !== '-') {
                    const newRow = tableBody3.insertRow();
                    newRow.insertCell(0).textContent = cells[0].textContent;
                    newRow.insertCell(1).textContent = cells[2].textContent;
                }
            });
            
            document.getElementById('liveTableContainer').classList.remove('hidden');
        }

        function determineAlgorithm() {
            const algo = document.getElementById('algorithm_options').value;
            const allocStrat = document.getElementById('allocation_strat_options').value;
            selectedAlgorithm = algo + '_' + allocStrat;
        }

        function cancelSimulation() {
            currentSimTime = 0;
            processQueue = [];
            allocatedProcesses = {};
            
            document.getElementById('addProcessBtn').disabled = false;
            document.getElementById('generateSampleBtn').disabled = false;
            document.getElementById('clearTableBtn').disabled = false;
            document.getElementById('addBtn').disabled = false;
            document.getElementById('clearBtn').disabled = false;
            document.getElementById('algorithm_options').disabled = false;
            document.getElementById('allocation_strat_options').disabled = false;
            document.getElementById('finalizeBtn').disabled = false;
            
            document.getElementById('proceedBtn').disabled = true;
            document.getElementById('finishBtn').disabled = true;
            document.getElementById('cancelBtn').disabled = true;
        }

        let currentSimTime = 0;
        let processQueue = [];
        let allocatedProcesses = {};
        let selectedAlgorithm = null;
        let nextFitIndex = 0;
        let runningProcess = null;
        let canFitPartition = [];

        function checkProcessFit() {
            const maxPartition = Math.max(...hole_arr);
            canFitPartition = [];
            for (let p of p_arr) {
                if (parseInt(p.mr) <= maxPartition) {
                    canFitPartition.push(p.process_name);
                }
            }
        }

        function repeatSimulation() {

            currentSimTime = 0;
            processQueue = [];
            allocatedProcesses = {};
            runningProcess = null;
            nextFitIndex = 0;
            
            // Reset all Process properties to original values
            for (let p of p_arr) {
                p.running = false;
                p.allocated = false;
                p.waiting = false;
                p.finished = false;
                p.start_time = -1;
                p.end_time = 0;
                p.memoryBlock = undefined;
            }
            
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '<tr id="dataRow"></tr>';
            const tableBody3 = document.getElementById('tableBody3');
            tableBody3.innerHTML = '';
            cloneProcessTable();
            document.getElementById('proceedBtn').disabled = false;
            document.getElementById('repeatBtn').disabled = false;
            document.getElementById('finishBtn').disabled = false;
            document.getElementById('currentTimeLabel').textContent = 'Current Time: 0';
            document.getElementById('arrivalTimeline').classList.add('hidden');
            document.getElementById('processSummary').classList.add('hidden');
            document.getElementById('processSummary').classList.add('hidden');
            document.getElementById('processSummary2').classList.add('hidden');
        }

        function startStep() {
            if (currentSimTime === 0) {
                processQueue = [...p_arr].sort((a, b) => a.arrival_time - b.arrival_time);
                processQueue.forEach(p => {
                    allocatedProcesses[p.process_name] = {
                        remainingBurst: parseInt(p.burst_time),
                        allocated: false,
                        memoryBlock: -1
                    };
                });
            }
            
            switch(selectedAlgorithm) {
                case 'FCFS_first_fit': FCFSFF(); break;
                case 'FCFS_next_fit': FCFSNF(); break;
                case 'FCFS_best_fit': FCFSBF(); break;
                case 'FCFS_worst_fit': FCFSWF(); break;
                case 'SJF_first_fit': SJFFF(); break;
                case 'SJF_next_fit': SJFNF(); break;
                case 'SJF_best_fit': SJFBF(); break;
                case 'SJF_worst_fit': SJFWF(); break;
                case 'NPP_first_fit': NPPFF(); break;
                case 'NPP_next_fit': NPPNF(); break;
                case 'NPP_best_fit': NPPBF(); break;
                case 'NPP_worst_fit': NPPWF(); break;
            }
        }

        function proceedToFinish() {
            if (currentSimTime === 0) {
                processQueue = [...p_arr].sort((a, b) => a.arrival_time - b.arrival_time);
                processQueue.forEach(p => {
                    allocatedProcesses[p.process_name] = {
                        remainingBurst: parseInt(p.burst_time),
                        allocated: false,
                        memoryBlock: -1
                    };
                });
            }
            
            // Check if all processes that can fit are done
            let allDone = false;
            while (!allDone) {
                FCFSFF();
                
                allDone = true;
                for (let p of p_arr) {
                    const maxPartition = Math.max(...hole_arr);
                    if (parseInt(p.mr) <= maxPartition) {
                        if (!p.finished) {
                            allDone = false;
                            break;
                        }
                    }
                }
            }
        }

        

        function closeModal() {
            document.getElementById('modal').classList.add('hidden');
        }

        function showResetModal() {
            document.getElementById('resetModal').classList.remove('hidden');
        }

        function closeResetModal() {
            document.getElementById('resetModal').classList.add('hidden');
        }

        function confirmReset() {
            document.getElementById('resetModal').classList.add('hidden');
            resetSimulation();
        }
        
        function updateLiveTable() {
            const tableBody3 = document.getElementById('tableBody3');
            const rows = tableBody3.querySelectorAll('tr');
            
            rows.forEach(row => {
                const processName = row.cells[0].textContent;
                const pState = allocatedProcesses[processName];
                const process = p_arr.find(p => p.process_name === processName);
                
                if (pState) {
                    row.cells[1].textContent = pState.remainingBurst;
                    
                    if (process && process.running) {
                        row.style.border = '3px solid #4CAF50';
                        row.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.5)';
                    } else {
                        row.style.border = '';
                        row.style.boxShadow = '';
                    }
                }
            });
            
            document.getElementById('currentTimeLabel').textContent = 'Current Time: ' + currentSimTime;
        }
        
        function getWaitingJobs() {
            const waiting = [];
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (parseInt(p.arrival_time) <= currentSimTime && !pState.allocated && pState.remainingBurst > 0) {
                    waiting.push(p.process_name);
                }
            }
            return waiting;
        }
        
        function decrementBurstTimes() {
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess];
                if (pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                }
            }
        }
        
        function checkAllProcessesDone() {
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (canFitPartition.includes(p.process_name)) {
                    if (!pState.allocated || pState.remainingBurst > 0) {
                        return false;
                    }
                }
            }
            return true;
        }
        
        function createGanttChart() {
            const finishedProcesses = p_arr.filter(p => p.finished && p.start_time >= 0).sort((a, b) => a.start_time - b.start_time);
            
            if (finishedProcesses.length === 0) return '';
            
            const ganttContainer = document.getElementById('ganttChart');
            const tickMarksContainer = document.getElementById('ganttTickMarks');
            const numberLabelsContainer = document.getElementById('ganttNumberLabels');
            
            ganttContainer.innerHTML = '';
            tickMarksContainer.innerHTML = '';
            numberLabelsContainer.innerHTML = '';
            
            const totalTime = Math.max(...finishedProcesses.map(p => p.end_time));
            const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#FFEB3B', '#795548'];
            
            let currentTime = 0;
            
            finishedProcesses.forEach((process, index) => {
                // Add gap if there's idle time before this process
                if (process.start_time > currentTime) {
                    const gapDiv = document.createElement('div');
                    gapDiv.className = 'gantt-process';
                    gapDiv.style.width = ((process.start_time - currentTime) / totalTime) * 100 + '%';
                    gapDiv.style.backgroundColor = '#333';
                    gapDiv.textContent = 'IDLE';
                    gapDiv.style.fontSize = '10px';
                    ganttContainer.appendChild(gapDiv);
                    
                    // Add corresponding tick
                    const gapTick = document.createElement('div');
                    gapTick.className = 'gantt-tick';
                    gapTick.style.flex = (process.start_time - currentTime);
                    tickMarksContainer.appendChild(gapTick);
                    
                    // Add corresponding label
                    const gapLabel = document.createElement('div');
                    gapLabel.className = 'gantt-number-label';
                    gapLabel.style.flex = (process.start_time - currentTime);
                    numberLabelsContainer.appendChild(gapLabel);
                }
                
                const duration = process.end_time - process.start_time;
                const widthPercent = (duration / totalTime) * 100;
                
                const processDiv = document.createElement('div');
                processDiv.className = 'gantt-process';
                processDiv.style.width = widthPercent + '%';
                processDiv.style.backgroundColor = colors[index % colors.length];
                processDiv.textContent = process.process_name;
                ganttContainer.appendChild(processDiv);
                
                // Add corresponding tick
                const processTick = document.createElement('div');
                processTick.className = 'gantt-tick';
                processTick.style.flex = duration;
                tickMarksContainer.appendChild(processTick);
                
                // Add corresponding label
                const processLabel = document.createElement('div');
                processLabel.className = 'gantt-number-label';
                processLabel.style.flex = duration;
                processLabel.textContent = process.start_time;
                numberLabelsContainer.appendChild(processLabel);
                
                currentTime = process.end_time;
            });
            
            // Add final tick and label
            const finalTick = document.createElement('div');
            finalTick.className = 'gantt-tick';
            tickMarksContainer.appendChild(finalTick);
            
            const finalLabel = document.createElement('div');
            finalLabel.className = 'gantt-number-label';
            finalLabel.textContent = totalTime;
            numberLabelsContainer.appendChild(finalLabel);
        }

        function showProcessSummary() {
            const finished = [];
            const unfinished = [];
            
            let processDetails = '';
            for (let p of p_arr) {
                if (p.start_time >= 0 && p.end_time > 0) {
                    processDetails += `${p.process_name}: Start=${p.start_time}, End=${p.end_time}\n`;
                }
                if (p.finished) {
                    finished.push(p.process_name);
                } else {
                    unfinished.push(p.process_name);
                }
            }
            
            createGanttChart();
            
            
            const finishedEl = document.getElementById('finishedProcesses');
            finishedEl.textContent = finished.length > 0 ? finished.join(', ') : 'None';
            finishedEl.style.color = '#4CAF50';
            const unfinishedEl = document.getElementById('unfinishedProcesses');
            unfinishedEl.textContent = unfinished.length > 0 ? unfinished.join(', ') : 'None';
            unfinishedEl.style.color = unfinished.length > 0 ? '#f44336' : '#e0e0e0';
            document.getElementById('processSummary').classList.remove('hidden');
            document.getElementById('processSummary2').classList.remove('hidden');
            document.getElementById('modalMessage').textContent = 'Process End';
            document.getElementById('modal').classList.remove('hidden');
            document.getElementById('proceedBtn').disabled = true;
            document.getElementById('finishBtn').disabled = true;
            document.getElementById('editVariablesBtn').classList.remove('hidden');
            document.getElementById('resetBtn').classList.remove('hidden');
            document.getElementById('currentTimeLabel').classList.add('hidden');
        }
        function createArrivalTimeline() {
            const arrivalContainer = document.getElementById('arrivalChart');
            const arrivalTickMarks = document.getElementById('arrivalTickMarks');
            const arrivalNumberLabels = document.getElementById('arrivalNumberLabels');
            
            arrivalContainer.innerHTML = '';
            arrivalTickMarks.innerHTML = '';
            arrivalNumberLabels.innerHTML = '';
            
            // Group processes by arrival time
            const processGroups = {};
            p_arr.forEach(process => {
                const arrivalTime = parseInt(process.arrival_time);
                if (!processGroups[arrivalTime]) {
                    processGroups[arrivalTime] = [];
                }
                processGroups[arrivalTime].push(process.process_name);
            });
            
            const sortedTimes = Object.keys(processGroups).map(t => parseInt(t)).sort((a, b) => a - b);
            const maxArrivalTime = Math.max(...sortedTimes);
            
            let currentTime = 0;
            
            sortedTimes.forEach((arrivalTime, index) => {
                // Add gap if needed
                if (arrivalTime > currentTime) {
                    const gapDiv = document.createElement('div');
                    gapDiv.className = 'gantt-process';
                    gapDiv.style.width = ((arrivalTime - currentTime) / (maxArrivalTime + 1)) * 100 + '%';
                    gapDiv.style.backgroundColor = '#333';
                    gapDiv.style.fontSize = '10px';
                    arrivalContainer.appendChild(gapDiv);
                    
                    const gapTick = document.createElement('div');
                    gapTick.className = 'gantt-tick';
                    gapTick.style.flex = (arrivalTime - currentTime);
                    arrivalTickMarks.appendChild(gapTick);
                    
                    const gapLabel = document.createElement('div');
                    gapLabel.className = 'gantt-number-label';
                    gapLabel.style.flex = (arrivalTime - currentTime);
                    arrivalNumberLabels.appendChild(gapLabel);
                }
                
                // Add process arrival
                const processDiv = document.createElement('div');
                processDiv.className = 'gantt-process';
                processDiv.style.width = (1 / (maxArrivalTime + 1)) * 100 + '%';
                arrivalContainer.appendChild(processDiv);
                
                const processTick = document.createElement('div');
                processTick.className = 'gantt-tick';
                processTick.style.flex = 1;
                processTick.setAttribute('data-process', processGroups[arrivalTime].join(', '));
                arrivalTickMarks.appendChild(processTick);
                
                const processLabel = document.createElement('div');
                processLabel.className = 'gantt-number-label';
                processLabel.style.flex = 1;
                processLabel.textContent = arrivalTime;
                arrivalNumberLabels.appendChild(processLabel);
                
                currentTime = arrivalTime + 1;
            });
            
            // Add final tick
            const finalTick = document.createElement('div');
            finalTick.className = 'gantt-tick';
            arrivalTickMarks.appendChild(finalTick);
            
            document.getElementById('arrivalTimeline').classList.remove('hidden');
        }
        
        function FCFSFF() {
            // Check if any unfinished process can fit in any partition
            const unfinishedProcesses = p_arr.filter(p => !p.finished);
            const maxPartitionSize = Math.max(...hole_arr);
            const canAnyProcessFit = unfinishedProcesses.some(p => parseInt(p.mr) <= maxPartitionSize);
            
            if (unfinishedProcesses.length > 0 && !canAnyProcessFit) {
                document.getElementById('modalMessage').textContent = 'Program ends - No remaining processes can fit in any partition';
                document.getElementById('modal').classList.remove('hidden');
                return;
            }
            
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            
            const timeCell = newRow.insertCell(0);
            timeCell.textContent = currentSimTime;
            
            let totalIF = 0;
            let totalAllocated = 0;
            let totalMemory = 0;
            const blockStatus = [];
            
            // Initialize memory blocks
            for (let i = 0; i < dynamicColumnCount; i++) {
                const cell = newRow.insertCell(i + 1);
                cell.textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            
            // Mark blocks occupied by already allocated processes
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    blockStatus[p.memoryBlock] = true;
                }
            }
            
            // Check for newly arrived processes and allocate memory (First Fit)
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    let allocated = false;
                    for (let i = 0; i < dynamicColumnCount; i++) {
                        if (!blockStatus[i] && parseInt(p.mr) <= hole_arr[i]) {
                            p.allocated = true;
                            p.waiting = false;
                            p.memoryBlock = i;
                            blockStatus[i] = true;
                            allocated = true;
                            break;
                        }
                    }
                    if (!allocated) {
                        p.waiting = true;
                        p.allocated = false;
                    }
                }
            }
            
            // Determine running process (FCFS - earliest arrival time among allocated processes)
            let runningProcess = null;
            let earliestArrival = Infinity;
            for (let p of p_arr) {
                if (p.allocated && !p.finished && parseInt(p.arrival_time) < earliestArrival) {
                    earliestArrival = parseInt(p.arrival_time);
                    runningProcess = p;
                }
            }
            
            // Update process states
            for (let p of p_arr) {
                if (p === runningProcess) {
                    p.running = true;
                    if (p.start_time === -1) {
                        p.start_time = currentSimTime;
                    }
                } else {
                    p.running = false;
                }
            }
            
            // Display allocated processes in their assigned memory blocks
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    const cell = newRow.cells[p.memoryBlock + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[p.memoryBlock] - parseInt(p.mr);
                    
                    if (p.running) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            
            // Execute running process (decrement burst time)
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess.process_name];
                if (pState && pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                    if (pState.remainingBurst === 0) {
                        runningProcess.finished = true;
                        runningProcess.running = false;
                        runningProcess.allocated = false; // Free up the partition
                        runningProcess.end_time = currentSimTime + 1;
                    }
                }
            }
            
            // Calculate waiting jobs
            const waitingJobs = [];
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    waitingJobs.push(p.process_name);
                }
            }
            
            // Calculate external fragmentation
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i]) {
                    if (waitingJobs.length > 0) {
                        const canFit = waitingJobs.some(jobName => {
                            const job = p_arr.find(p => p.process_name === jobName);
                            return parseInt(job.mr) <= hole_arr[i];
                        });
                        if (!canFit) {
                            totalEF += hole_arr[i];
                            const cell = newRow.cells[i + 1];
                            cell.textContent = 'XX';
                            cell.style.color = 'red';
                        }
                    }
                }
            }
            
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            
            const ifCell = newRow.insertCell(dynamicColumnCount + 1);
            ifCell.textContent = totalIF;
            
            const efCell = newRow.insertCell(dynamicColumnCount + 2);
            efCell.textContent = totalEF;
            
            const muCell = newRow.insertCell(dynamicColumnCount + 3);
            muCell.textContent = mu + '%';
            
            const waitingCell = newRow.insertCell(dynamicColumnCount + 4);
            waitingCell.textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            updateLiveTable();
            
            // Check if all processes that can fit are done
            let allDone = true;
            for (let p of p_arr) {
                const maxPartition = Math.max(...hole_arr);
                if (parseInt(p.mr) <= maxPartition) { // Process can fit
                    if (!p.finished) {
                        allDone = false;
                        break;
                    }
                }
            }
            
            if (allDone) {
                showProcessSummary();
            }
            
            currentSimTime++;
            
            const tableContainer = document.querySelector('.table-container');
            tableContainer.scrollTop = tableContainer.scrollHeight;
        }

        function resetSimulation() {
            // Reset simulation state
            currentSimTime = 0;
            processQueue = [];
            allocatedProcesses = {};
            
            // Clear allocation table
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '<tr id="dataRow"></tr>';
            
            // Clear process table
            const tableBody2 = document.getElementById('tableBody2');
            tableBody2.innerHTML = '<tr><td>-</td><td>-</td><td>-</td><td>-</td></tr>';
            p_arr.length = 0;
            
            // Hide and clear live table
            document.getElementById('liveTableContainer').classList.add('hidden');
            document.getElementById('tableBody3').innerHTML = '';
            
            // Clear memory blocks
            while (headerRow.children.length > 5) {
                headerRow.removeChild(headerRow.children[1]);
            }
            const dataRow = document.getElementById('dataRow');
            while (dataRow.children.length > 0) {
                dataRow.removeChild(dataRow.children[0]);
            }
            dynamicColumnCount = 0;
            hole_arr.length = 0;
            
            // Enable input buttons
            document.getElementById('addProcessBtn').disabled = false;
            document.getElementById('generateSampleBtn').disabled = false;
            document.getElementById('clearTableBtn').disabled = false;
            document.getElementById('addBtn').disabled = false;
            document.getElementById('clearBtn').disabled = false;
            document.getElementById('algorithm_options').disabled = false;
            document.getElementById('allocation_strat_options').disabled = false;
            document.getElementById('finalizeBtn').disabled = false;
            
            // Disable action buttons
            document.getElementById('proceedBtn').disabled = true;
            document.getElementById('proceedBtn').classList.add('hidden');
            document.getElementById('repeatBtn').disabled = true;
            document.getElementById('repeatBtn').classList.add('hidden');
            document.getElementById('finishBtn').disabled = true;
            document.getElementById('finishBtn').classList.add('hidden');
            document.getElementById('editVariablesBtn').classList.add('hidden');
            document.getElementById('resetBtn').classList.add('hidden');
            
            // Hide time display and labels
            document.getElementById('timeDisplay').classList.add('hidden');
            document.getElementById('labelsContainer').classList.add('hidden');
            document.getElementById('algorithmLabel').classList.add('hidden');
            document.getElementById('allocationLabel').classList.add('hidden');
            document.getElementById('arrivalTimeline').classList.add('hidden');
            document.getElementById('processSummary2').classList.add('hidden');

            document.getElementById('currentTimeLabel').textContent = 'Current Time: 0';
            
            // Hide process summary
            document.getElementById('processSummary').classList.add('hidden');
            
            // Show edit controls
            document.getElementById('editControls').classList.remove('hidden');
            
            // Show input sections
            showInputSections();
            
            // Hide edit button
            document.getElementById('editBtn').classList.add('hidden');
            
            // Close modal
            document.getElementById('modal').classList.add('hidden');
        }

        function editVariables() {
            repeatSimulation();
            currentSimTime = 0;
            processQueue = [];
            allocatedProcesses = {};
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '<tr id="dataRow"></tr>';
            document.getElementById('liveTableContainer').classList.add('hidden');
            document.getElementById('tableBody3').innerHTML = '';
            document.getElementById('addProcessBtn').disabled = false;
            document.getElementById('generateSampleBtn').disabled = false;
            document.getElementById('clearTableBtn').disabled = false;
            document.getElementById('addBtn').disabled = false;
            document.getElementById('clearBtn').disabled = false;
            document.getElementById('algorithm_options').disabled = false;
            document.getElementById('allocation_strat_options').disabled = false;
            document.getElementById('finalizeBtn').disabled = false;
            document.getElementById('proceedBtn').classList.add('hidden');
            document.getElementById('repeatBtn').classList.add('hidden');
            document.getElementById('processSummary').classList.add('hidden');
            document.getElementById('processSummary2').classList.add('hidden');
            document.getElementById('orderTimeline').classList.add('hidden');
            document.getElementById('arrivalTimeline').classList.add('hidden');
            
            document.getElementById('algorithmLabel').classList.add('hidden');
            document.getElementById('allocationLabel').classList.add('hidden');
            document.getElementById('finishBtn').classList.add('hidden');
            document.getElementById('editVariablesBtn').classList.add('hidden');
            document.getElementById('resetBtn').classList.add('hidden');
            document.getElementById('timeDisplay').classList.add('hidden');
            document.getElementById('labelsContainer').classList.add('hidden');
            document.getElementById('processSummary').classList.add('hidden');
            document.getElementById('currentTimeLabel').textContent = 'Current Time: 0';
            document.getElementById('editControls').classList.remove('hidden');
            if (p_arr.length > 0) {
                document.getElementById('editBtn').classList.remove('hidden');
            }
            showInputSections();
        }


        function alterColumn(){
            const algorithmSelect = document.getElementById("algorithm_options");
            const priorityInput = document.getElementById("priority");
            const headerRow2 = document.getElementById("headerRow2");
            const tableBody2 = document.getElementById("tableBody2");
            
            if (algorithmSelect.value === "NPP") {
                // Show priority input
                priorityInput.classList.remove("hidden");
                
                // Add priority column if not already added
                if (!isPriorityColumnVisible) {
                    const priorityHeader = document.createElement("th");
                    priorityHeader.textContent = "Priority";
                    priorityHeader.id = "priorityHeader";
                    headerRow2.appendChild(priorityHeader);
                    
                    // Add priority cells to existing rows
                    const rows = tableBody2.querySelectorAll("tr");
                    rows.forEach(row => {
                        const priorityCell = row.insertCell(-1);
                        priorityCell.textContent = "-";
                    });
                    
                    isPriorityColumnVisible = true;
                }
            } else {
                // Hide priority input
                priorityInput.classList.add("hidden");
                
                // Remove priority column if it exists
                if (isPriorityColumnVisible) {
                    const priorityHeader = document.getElementById("priorityHeader");
                    if (priorityHeader) {
                        priorityHeader.remove();
                    }
                    
                    // Remove priority cells from all rows
                    const rows = tableBody2.querySelectorAll("tr");
                    rows.forEach(row => {
                        if (row.cells.length > 4) {
                            row.deleteCell(-1);
                        }
                    });
                    
                    isPriorityColumnVisible = false;
                }
            }
        }


        


        // FCFS with Next Fit
        function FCFSNF() {
            // Check if any unfinished process can fit in any partition
            const unfinishedProcesses = p_arr.filter(p => !p.finished);
            const maxPartitionSize = Math.max(...hole_arr);
            const canAnyProcessFit = unfinishedProcesses.some(p => parseInt(p.mr) <= maxPartitionSize);
            
            if (unfinishedProcesses.length > 0 && !canAnyProcessFit) {
                document.getElementById('modalMessage').textContent = 'Program ends - No remaining processes can fit in any partition';
                document.getElementById('modal').classList.remove('hidden');
                return;
            }
            
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            
            const timeCell = newRow.insertCell(0);
            timeCell.textContent = currentSimTime;
            
            let totalIF = 0;
            let totalAllocated = 0;
            let totalMemory = 0;
            const blockStatus = [];
            
            // Initialize memory blocks
            for (let i = 0; i < dynamicColumnCount; i++) {
                const cell = newRow.insertCell(i + 1);
                cell.textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            
            // Mark blocks occupied by already allocated processes
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    blockStatus[p.memoryBlock] = true;
                }
            }
            
            // Check for newly arrived processes and allocate memory (Next Fit)
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    let allocated = false;
                    for (let j = 0; j < dynamicColumnCount; j++) {
                        const i = (nextFitIndex + j) % dynamicColumnCount;
                        if (!blockStatus[i] && parseInt(p.mr) <= hole_arr[i]) {
                            p.allocated = true;
                            p.waiting = false;
                            p.memoryBlock = i;
                            blockStatus[i] = true;
                            nextFitIndex = (i + 1) % dynamicColumnCount;
                            allocated = true;
                            break;
                        }
                    }
                    if (!allocated) {
                        p.waiting = true;
                        p.allocated = false;
                    }
                }
            }
            
            // Determine running process (FCFS - earliest arrival time among allocated processes)
            let runningProcess = null;
            let earliestArrival = Infinity;
            for (let p of p_arr) {
                if (p.allocated && !p.finished && parseInt(p.arrival_time) < earliestArrival) {
                    earliestArrival = parseInt(p.arrival_time);
                    runningProcess = p;
                }
            }
            
            // Update process states
            for (let p of p_arr) {
                if (p === runningProcess) {
                    p.running = true;
                    if (p.start_time === -1) {
                        p.start_time = currentSimTime;
                    }
                } else {
                    p.running = false;
                }
            }
            
            // Display allocated processes in their assigned memory blocks
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    const cell = newRow.cells[p.memoryBlock + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[p.memoryBlock] - parseInt(p.mr);
                    
                    if (p.running) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            
            // Execute running process (decrement burst time)
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess.process_name];
                if (pState && pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                    if (pState.remainingBurst === 0) {
                        runningProcess.finished = true;
                        runningProcess.running = false;
                        runningProcess.allocated = false; // Free up the partition
                        runningProcess.end_time = currentSimTime + 1;
                    }
                }
            }
            
            // Calculate waiting jobs
            const waitingJobs = [];
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    waitingJobs.push(p.process_name);
                }
            }
            
            // Calculate external fragmentation
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i]) {
                    if (waitingJobs.length > 0) {
                        const canFit = waitingJobs.some(jobName => {
                            const job = p_arr.find(p => p.process_name === jobName);
                            return parseInt(job.mr) <= hole_arr[i];
                        });
                        if (!canFit) {
                            totalEF += hole_arr[i];
                            const cell = newRow.cells[i + 1];
                            cell.textContent = 'XX';
                            cell.style.color = 'red';
                        }
                    }
                }
            }
            
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            
            const ifCell = newRow.insertCell(dynamicColumnCount + 1);
            ifCell.textContent = totalIF;
            
            const efCell = newRow.insertCell(dynamicColumnCount + 2);
            efCell.textContent = totalEF;
            
            const muCell = newRow.insertCell(dynamicColumnCount + 3);
            muCell.textContent = mu + '%';
            
            const waitingCell = newRow.insertCell(dynamicColumnCount + 4);
            waitingCell.textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            updateLiveTable();
            
            // Check if all processes that can fit are done
            let allDone = true;
            for (let p of p_arr) {
                const maxPartition = Math.max(...hole_arr);
                if (parseInt(p.mr) <= maxPartition) { // Process can fit
                    if (!p.finished) {
                        allDone = false;
                        break;
                    }
                }
            }
            
            if (allDone) {
                showProcessSummary();
            }
            
            currentSimTime++;
            
            const tableContainer = document.querySelector('.table-container');
            tableContainer.scrollTop = tableContainer.scrollHeight;
        }

        // FCFS with Best Fit
        function FCFSBF() {
            // Check if any unfinished process can fit in any partition
            const unfinishedProcesses = p_arr.filter(p => !p.finished);
            const maxPartitionSize = Math.max(...hole_arr);
            const canAnyProcessFit = unfinishedProcesses.some(p => parseInt(p.mr) <= maxPartitionSize);
            
            if (unfinishedProcesses.length > 0 && !canAnyProcessFit) {
                document.getElementById('modalMessage').textContent = 'Program ends - No remaining processes can fit in any partition';
                document.getElementById('modal').classList.remove('hidden');
                return;
            }
            
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            
            const timeCell = newRow.insertCell(0);
            timeCell.textContent = currentSimTime;
            
            let totalIF = 0;
            let totalAllocated = 0;
            let totalMemory = 0;
            const blockStatus = [];
            
            // Initialize memory blocks
            for (let i = 0; i < dynamicColumnCount; i++) {
                const cell = newRow.insertCell(i + 1);
                cell.textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            
            // Mark blocks occupied by already allocated processes
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    blockStatus[p.memoryBlock] = true;
                }
            }
            
            // Check for newly arrived processes and allocate memory (Best Fit)
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    let bestFitIndex = -1;
                    let minWastage = Infinity;
                    for (let i = 0; i < dynamicColumnCount; i++) {
                        if (!blockStatus[i] && parseInt(p.mr) <= hole_arr[i]) {
                            const wastage = hole_arr[i] - parseInt(p.mr);
                            if (wastage < minWastage) {
                                minWastage = wastage;
                                bestFitIndex = i;
                            }
                        }
                    }
                    if (bestFitIndex !== -1) {
                        p.allocated = true;
                        p.waiting = false;
                        p.memoryBlock = bestFitIndex;
                        blockStatus[bestFitIndex] = true;
                    } else {
                        p.waiting = true;
                        p.allocated = false;
                    }
                }
            }
            
            // Determine running process (FCFS - earliest arrival time among allocated processes)
            let runningProcess = null;
            let earliestArrival = Infinity;
            for (let p of p_arr) {
                if (p.allocated && !p.finished && parseInt(p.arrival_time) < earliestArrival) {
                    earliestArrival = parseInt(p.arrival_time);
                    runningProcess = p;
                }
            }
            
            // Update process states
            for (let p of p_arr) {
                if (p === runningProcess) {
                    p.running = true;
                    if (p.start_time === -1) {
                        p.start_time = currentSimTime;
                    }
                } else {
                    p.running = false;
                }
            }
            
            // Display allocated processes in their assigned memory blocks
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    const cell = newRow.cells[p.memoryBlock + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[p.memoryBlock] - parseInt(p.mr);
                    
                    if (p.running) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            
            // Execute running process (decrement burst time)
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess.process_name];
                if (pState && pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                    if (pState.remainingBurst === 0) {
                        runningProcess.finished = true;
                        runningProcess.running = false;
                        runningProcess.allocated = false; // Free up the partition
                        runningProcess.end_time = currentSimTime + 1;
                    }
                }
            }
            
            // Calculate waiting jobs
            const waitingJobs = [];
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    waitingJobs.push(p.process_name);
                }
            }
            
            // Calculate external fragmentation
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i]) {
                    if (waitingJobs.length > 0) {
                        const canFit = waitingJobs.some(jobName => {
                            const job = p_arr.find(p => p.process_name === jobName);
                            return parseInt(job.mr) <= hole_arr[i];
                        });
                        if (!canFit) {
                            totalEF += hole_arr[i];
                            const cell = newRow.cells[i + 1];
                            cell.textContent = 'XX';
                            cell.style.color = 'red';
                        }
                    }
                }
            }
            
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            
            const ifCell = newRow.insertCell(dynamicColumnCount + 1);
            ifCell.textContent = totalIF;
            
            const efCell = newRow.insertCell(dynamicColumnCount + 2);
            efCell.textContent = totalEF;
            
            const muCell = newRow.insertCell(dynamicColumnCount + 3);
            muCell.textContent = mu + '%';
            
            const waitingCell = newRow.insertCell(dynamicColumnCount + 4);
            waitingCell.textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            updateLiveTable();
            
            // Check if all processes that can fit are done
            let allDone = true;
            for (let p of p_arr) {
                const maxPartition = Math.max(...hole_arr);
                if (parseInt(p.mr) <= maxPartition) { // Process can fit
                    if (!p.finished) {
                        allDone = false;
                        break;
                    }
                }
            }
            
            if (allDone) {
                showProcessSummary();
            }
            
            currentSimTime++;
            
            const tableContainer = document.querySelector('.table-container');
            tableContainer.scrollTop = tableContainer.scrollHeight;
        }

        // FCFS with Worst Fit
        function FCFSWF() {
            // Check if any unfinished process can fit in any partition
            const unfinishedProcesses = p_arr.filter(p => !p.finished);
            const maxPartitionSize = Math.max(...hole_arr);
            const canAnyProcessFit = unfinishedProcesses.some(p => parseInt(p.mr) <= maxPartitionSize);
            
            if (unfinishedProcesses.length > 0 && !canAnyProcessFit) {
                document.getElementById('modalMessage').textContent = 'Program ends - No remaining processes can fit in any partition';
                document.getElementById('modal').classList.remove('hidden');
                return;
            }
            
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            
            const timeCell = newRow.insertCell(0);
            timeCell.textContent = currentSimTime;
            
            let totalIF = 0;
            let totalAllocated = 0;
            let totalMemory = 0;
            const blockStatus = [];
            
            // Initialize memory blocks
            for (let i = 0; i < dynamicColumnCount; i++) {
                const cell = newRow.insertCell(i + 1);
                cell.textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            
            // Mark blocks occupied by already allocated processes
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    blockStatus[p.memoryBlock] = true;
                }
            }
            
            // Check for newly arrived processes and allocate memory (Worst Fit)
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    let worstFitIndex = -1;
                    let maxWastage = -1;
                    for (let i = 0; i < dynamicColumnCount; i++) {
                        if (!blockStatus[i] && parseInt(p.mr) <= hole_arr[i]) {
                            const wastage = hole_arr[i] - parseInt(p.mr);
                            if (wastage > maxWastage) {
                                maxWastage = wastage;
                                worstFitIndex = i;
                            }
                        }
                    }
                    if (worstFitIndex !== -1) {
                        p.allocated = true;
                        p.waiting = false;
                        p.memoryBlock = worstFitIndex;
                        blockStatus[worstFitIndex] = true;
                    } else {
                        p.waiting = true;
                        p.allocated = false;
                    }
                }
            }
            
            // Determine running process (FCFS - earliest arrival time among allocated processes)
            let runningProcess = null;
            let earliestArrival = Infinity;
            for (let p of p_arr) {
                if (p.allocated && !p.finished && parseInt(p.arrival_time) < earliestArrival) {
                    earliestArrival = parseInt(p.arrival_time);
                    runningProcess = p;
                }
            }
            
            // Update process states
            for (let p of p_arr) {
                if (p === runningProcess) {
                    p.running = true;
                    if (p.start_time === -1) {
                        p.start_time = currentSimTime;
                    }
                } else {
                    p.running = false;
                }
            }
            
            // Display allocated processes in their assigned memory blocks
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    const cell = newRow.cells[p.memoryBlock + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[p.memoryBlock] - parseInt(p.mr);
                    
                    if (p.running) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            
            // Execute running process (decrement burst time)
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess.process_name];
                if (pState && pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                    if (pState.remainingBurst === 0) {
                        runningProcess.finished = true;
                        runningProcess.running = false;
                        runningProcess.allocated = false; // Free up the partition
                        runningProcess.end_time = currentSimTime + 1;
                    }
                }
            }
            
            // Calculate waiting jobs
            const waitingJobs = [];
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    waitingJobs.push(p.process_name);
                }
            }
            
            // Calculate external fragmentation
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i]) {
                    if (waitingJobs.length > 0) {
                        const canFit = waitingJobs.some(jobName => {
                            const job = p_arr.find(p => p.process_name === jobName);
                            return parseInt(job.mr) <= hole_arr[i];
                        });
                        if (!canFit) {
                            totalEF += hole_arr[i];
                            const cell = newRow.cells[i + 1];
                            cell.textContent = 'XX';
                            cell.style.color = 'red';
                        }
                    }
                }
            }
            
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            
            const ifCell = newRow.insertCell(dynamicColumnCount + 1);
            ifCell.textContent = totalIF;
            
            const efCell = newRow.insertCell(dynamicColumnCount + 2);
            efCell.textContent = totalEF;
            
            const muCell = newRow.insertCell(dynamicColumnCount + 3);
            muCell.textContent = mu + '%';
            
            const waitingCell = newRow.insertCell(dynamicColumnCount + 4);
            waitingCell.textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            updateLiveTable();
            
            // Check if all processes that can fit are done
            let allDone = true;
            for (let p of p_arr) {
                const maxPartition = Math.max(...hole_arr);
                if (parseInt(p.mr) <= maxPartition) { // Process can fit
                    if (!p.finished) {
                        allDone = false;
                        break;
                    }
                }
            }
            
            if (allDone) {
                showProcessSummary();
            }
            
            currentSimTime++;
            
            const tableContainer = document.querySelector('.table-container');
            tableContainer.scrollTop = tableContainer.scrollHeight;
        }

        // SJF with First Fit
        function SJFFF() {
            // Check if any unfinished process can fit in any partition
            const unfinishedProcesses = p_arr.filter(p => !p.finished);
            const maxPartitionSize = Math.max(...hole_arr);
            const canAnyProcessFit = unfinishedProcesses.some(p => parseInt(p.mr) <= maxPartitionSize);
            
            if (unfinishedProcesses.length > 0 && !canAnyProcessFit) {
                document.getElementById('modalMessage').textContent = 'Program ends - No remaining processes can fit in any partition';
                document.getElementById('modal').classList.remove('hidden');
                return;
            }
            
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            
            const timeCell = newRow.insertCell(0);
            timeCell.textContent = currentSimTime;
            
            let totalIF = 0;
            let totalAllocated = 0;
            let totalMemory = 0;
            const blockStatus = [];
            
            // Initialize memory blocks
            for (let i = 0; i < dynamicColumnCount; i++) {
                const cell = newRow.insertCell(i + 1);
                cell.textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            
            // Mark blocks occupied by already allocated processes
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    blockStatus[p.memoryBlock] = true;
                }
            }
            
            // Check for newly arrived processes and allocate memory (First Fit)
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    let allocated = false;
                    for (let i = 0; i < dynamicColumnCount; i++) {
                        if (!blockStatus[i] && parseInt(p.mr) <= hole_arr[i]) {
                            p.allocated = true;
                            p.waiting = false;
                            p.memoryBlock = i;
                            blockStatus[i] = true;
                            allocated = true;
                            break;
                        }
                    }
                    if (!allocated) {
                        p.waiting = true;
                        p.allocated = false;
                    }
                }
            }
            
            // Determine running process (SJF - non-preemptive: continue current running process or select shortest burst time)
            let runningProcess = null;
            
            // First check if there's already a running process that hasn't finished
            for (let p of p_arr) {
                if (p.running && p.allocated && !p.finished) {
                    runningProcess = p;
                    break;
                }
            }
            
            // If no process is currently running, select shortest remaining burst time among allocated processes
            if (!runningProcess) {
                let shortestBurst = Infinity;
                for (let p of p_arr) {
                    if (p.allocated && !p.finished) {
                        const pState = allocatedProcesses[p.process_name];
                        if (pState && pState.remainingBurst < shortestBurst) {
                            shortestBurst = pState.remainingBurst;
                            runningProcess = p;
                        }
                    }
                }
            }
            
            // Update process states
            for (let p of p_arr) {
                if (p === runningProcess) {
                    p.running = true;
                    if (p.start_time === -1) {
                        p.start_time = currentSimTime;
                    }
                } else {
                    p.running = false;
                }
            }
            
            // Display allocated processes in their assigned memory blocks
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    const cell = newRow.cells[p.memoryBlock + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[p.memoryBlock] - parseInt(p.mr);
                    
                    if (p.running) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            
            // Execute running process (decrement burst time)
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess.process_name];
                if (pState && pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                    if (pState.remainingBurst === 0) {
                        runningProcess.finished = true;
                        runningProcess.running = false;
                        runningProcess.allocated = false; // Free up the partition
                        runningProcess.end_time = currentSimTime + 1;
                    }
                }
            }
            
            // Calculate waiting jobs
            const waitingJobs = [];
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    waitingJobs.push(p.process_name);
                }
            }
            
            // Calculate external fragmentation
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i]) {
                    if (waitingJobs.length > 0) {
                        const canFit = waitingJobs.some(jobName => {
                            const job = p_arr.find(p => p.process_name === jobName);
                            return parseInt(job.mr) <= hole_arr[i];
                        });
                        if (!canFit) {
                            totalEF += hole_arr[i];
                            const cell = newRow.cells[i + 1];
                            cell.textContent = 'XX';
                            cell.style.color = 'red';
                        }
                    }
                }
            }
            
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            
            const ifCell = newRow.insertCell(dynamicColumnCount + 1);
            ifCell.textContent = totalIF;
            
            const efCell = newRow.insertCell(dynamicColumnCount + 2);
            efCell.textContent = totalEF;
            
            const muCell = newRow.insertCell(dynamicColumnCount + 3);
            muCell.textContent = mu + '%';
            
            const waitingCell = newRow.insertCell(dynamicColumnCount + 4);
            waitingCell.textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            updateLiveTable();
            
            // Check if all processes that can fit are done
            let allDone = true;
            for (let p of p_arr) {
                const maxPartition = Math.max(...hole_arr);
                if (parseInt(p.mr) <= maxPartition) { // Process can fit
                    if (!p.finished) {
                        allDone = false;
                        break;
                    }
                }
            }
            
            if (allDone) {
                showProcessSummary();
            }
            
            currentSimTime++;
            
            const tableContainer = document.querySelector('.table-container');
            tableContainer.scrollTop = tableContainer.scrollHeight;
        }

        // SJF with Next Fit
        function SJFNF() {
            // Check if any unfinished process can fit in any partition
            const unfinishedProcesses = p_arr.filter(p => !p.finished);
            const maxPartitionSize = Math.max(...hole_arr);
            const canAnyProcessFit = unfinishedProcesses.some(p => parseInt(p.mr) <= maxPartitionSize);
            
            if (unfinishedProcesses.length > 0 && !canAnyProcessFit) {
                document.getElementById('modalMessage').textContent = 'Program ends - No remaining processes can fit in any partition';
                document.getElementById('modal').classList.remove('hidden');
                return;
            }
            
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            
            const timeCell = newRow.insertCell(0);
            timeCell.textContent = currentSimTime;
            
            let totalIF = 0;
            let totalAllocated = 0;
            let totalMemory = 0;
            const blockStatus = [];
            
            // Initialize memory blocks
            for (let i = 0; i < dynamicColumnCount; i++) {
                const cell = newRow.insertCell(i + 1);
                cell.textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            
            // Mark blocks occupied by already allocated processes
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    blockStatus[p.memoryBlock] = true;
                }
            }
            
            // Check for newly arrived processes and allocate memory (Next Fit)
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    let allocated = false;
                    for (let j = 0; j < dynamicColumnCount; j++) {
                        const i = (nextFitIndex + j) % dynamicColumnCount;
                        if (!blockStatus[i] && parseInt(p.mr) <= hole_arr[i]) {
                            p.allocated = true;
                            p.waiting = false;
                            p.memoryBlock = i;
                            blockStatus[i] = true;
                            nextFitIndex = (i + 1) % dynamicColumnCount;
                            allocated = true;
                            break;
                        }
                    }
                    if (!allocated) {
                        p.waiting = true;
                        p.allocated = false;
                    }
                }
            }
            
            // Determine running process (SJF - non-preemptive: continue current running process or select shortest burst time)
            let runningProcess = null;
            
            // First check if there's already a running process that hasn't finished
            for (let p of p_arr) {
                if (p.running && p.allocated && !p.finished) {
                    runningProcess = p;
                    break;
                }
            }
            
            // If no process is currently running, select shortest remaining burst time among allocated processes
            if (!runningProcess) {
                let shortestBurst = Infinity;
                for (let p of p_arr) {
                    if (p.allocated && !p.finished) {
                        const pState = allocatedProcesses[p.process_name];
                        if (pState && pState.remainingBurst < shortestBurst) {
                            shortestBurst = pState.remainingBurst;
                            runningProcess = p;
                        }
                    }
                }
            }
            
            // Update process states
            for (let p of p_arr) {
                if (p === runningProcess) {
                    p.running = true;
                    if (p.start_time === -1) {
                        p.start_time = currentSimTime;
                    }
                } else {
                    p.running = false;
                }
            }
            
            // Display allocated processes in their assigned memory blocks
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    const cell = newRow.cells[p.memoryBlock + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[p.memoryBlock] - parseInt(p.mr);
                    
                    if (p.running) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            
            // Execute running process (decrement burst time)
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess.process_name];
                if (pState && pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                    if (pState.remainingBurst === 0) {
                        runningProcess.finished = true;
                        runningProcess.running = false;
                        runningProcess.allocated = false; // Free up the partition
                        runningProcess.end_time = currentSimTime + 1;
                    }
                }
            }
            
            // Calculate waiting jobs
            const waitingJobs = [];
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    waitingJobs.push(p.process_name);
                }
            }
            
            // Calculate external fragmentation
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i]) {
                    if (waitingJobs.length > 0) {
                        const canFit = waitingJobs.some(jobName => {
                            const job = p_arr.find(p => p.process_name === jobName);
                            return parseInt(job.mr) <= hole_arr[i];
                        });
                        if (!canFit) {
                            totalEF += hole_arr[i];
                            const cell = newRow.cells[i + 1];
                            cell.textContent = 'XX';
                            cell.style.color = 'red';
                        }
                    }
                }
            }
            
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            
            const ifCell = newRow.insertCell(dynamicColumnCount + 1);
            ifCell.textContent = totalIF;
            
            const efCell = newRow.insertCell(dynamicColumnCount + 2);
            efCell.textContent = totalEF;
            
            const muCell = newRow.insertCell(dynamicColumnCount + 3);
            muCell.textContent = mu + '%';
            
            const waitingCell = newRow.insertCell(dynamicColumnCount + 4);
            waitingCell.textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            updateLiveTable();
            
            // Check if all processes that can fit are done
            let allDone = true;
            for (let p of p_arr) {
                const maxPartition = Math.max(...hole_arr);
                if (parseInt(p.mr) <= maxPartition) { // Process can fit
                    if (!p.finished) {
                        allDone = false;
                        break;
                    }
                }
            }
            
            if (allDone) {
                showProcessSummary();
            }
            
            currentSimTime++;
            
            const tableContainer = document.querySelector('.table-container');
            tableContainer.scrollTop = tableContainer.scrollHeight;
        }

        // SJF with Best Fit
        function SJFBF() {
            // Check if any unfinished process can fit in any partition
            const unfinishedProcesses = p_arr.filter(p => !p.finished);
            const maxPartitionSize = Math.max(...hole_arr);
            const canAnyProcessFit = unfinishedProcesses.some(p => parseInt(p.mr) <= maxPartitionSize);
            
            if (unfinishedProcesses.length > 0 && !canAnyProcessFit) {
                document.getElementById('modalMessage').textContent = 'Program ends - No remaining processes can fit in any partition';
                document.getElementById('modal').classList.remove('hidden');
                return;
            }
            
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            
            const timeCell = newRow.insertCell(0);
            timeCell.textContent = currentSimTime;
            
            let totalIF = 0;
            let totalAllocated = 0;
            let totalMemory = 0;
            const blockStatus = [];
            
            // Initialize memory blocks
            for (let i = 0; i < dynamicColumnCount; i++) {
                const cell = newRow.insertCell(i + 1);
                cell.textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            
            // Mark blocks occupied by already allocated processes
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    blockStatus[p.memoryBlock] = true;
                }
            }
            
            // Check for newly arrived processes and allocate memory (Best Fit)
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    let bestFitIndex = -1;
                    let minWastage = Infinity;
                    for (let i = 0; i < dynamicColumnCount; i++) {
                        if (!blockStatus[i] && parseInt(p.mr) <= hole_arr[i]) {
                            const wastage = hole_arr[i] - parseInt(p.mr);
                            if (wastage < minWastage) {
                                minWastage = wastage;
                                bestFitIndex = i;
                            }
                        }
                    }
                    if (bestFitIndex !== -1) {
                        p.allocated = true;
                        p.waiting = false;
                        p.memoryBlock = bestFitIndex;
                        blockStatus[bestFitIndex] = true;
                    } else {
                        p.waiting = true;
                        p.allocated = false;
                    }
                }
            }
            
            // Determine running process (SJF - non-preemptive: continue current running process or select shortest burst time)
            let runningProcess = null;
            
            // First check if there's already a running process that hasn't finished
            for (let p of p_arr) {
                if (p.running && p.allocated && !p.finished) {
                    runningProcess = p;
                    break;
                }
            }
            
            // If no process is currently running, select shortest remaining burst time among allocated processes
            if (!runningProcess) {
                let shortestBurst = Infinity;
                for (let p of p_arr) {
                    if (p.allocated && !p.finished) {
                        const pState = allocatedProcesses[p.process_name];
                        if (pState && pState.remainingBurst < shortestBurst) {
                            shortestBurst = pState.remainingBurst;
                            runningProcess = p;
                        }
                    }
                }
            }
            
            // Update process states
            for (let p of p_arr) {
                if (p === runningProcess) {
                    p.running = true;
                    if (p.start_time === -1) {
                        p.start_time = currentSimTime;
                    }
                } else {
                    p.running = false;
                }
            }
            
            // Display allocated processes in their assigned memory blocks
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    const cell = newRow.cells[p.memoryBlock + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[p.memoryBlock] - parseInt(p.mr);
                    
                    if (p.running) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            
            // Execute running process (decrement burst time)
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess.process_name];
                if (pState && pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                    if (pState.remainingBurst === 0) {
                        runningProcess.finished = true;
                        runningProcess.running = false;
                        runningProcess.allocated = false; // Free up the partition
                        runningProcess.end_time = currentSimTime + 1;
                    }
                }
            }
            
            // Calculate waiting jobs
            const waitingJobs = [];
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    waitingJobs.push(p.process_name);
                }
            }
            
            // Calculate external fragmentation
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i]) {
                    if (waitingJobs.length > 0) {
                        const canFit = waitingJobs.some(jobName => {
                            const job = p_arr.find(p => p.process_name === jobName);
                            return parseInt(job.mr) <= hole_arr[i];
                        });
                        if (!canFit) {
                            totalEF += hole_arr[i];
                            const cell = newRow.cells[i + 1];
                            cell.textContent = 'XX';
                            cell.style.color = 'red';
                        }
                    }
                }
            }
            
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            
            const ifCell = newRow.insertCell(dynamicColumnCount + 1);
            ifCell.textContent = totalIF;
            
            const efCell = newRow.insertCell(dynamicColumnCount + 2);
            efCell.textContent = totalEF;
            
            const muCell = newRow.insertCell(dynamicColumnCount + 3);
            muCell.textContent = mu + '%';
            
            const waitingCell = newRow.insertCell(dynamicColumnCount + 4);
            waitingCell.textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            updateLiveTable();
            
            // Check if all processes that can fit are done
            let allDone = true;
            for (let p of p_arr) {
                const maxPartition = Math.max(...hole_arr);
                if (parseInt(p.mr) <= maxPartition) { // Process can fit
                    if (!p.finished) {
                        allDone = false;
                        break;
                    }
                }
            }
            
            if (allDone) {
                showProcessSummary();
            }
            
            currentSimTime++;
            
            const tableContainer = document.querySelector('.table-container');
            tableContainer.scrollTop = tableContainer.scrollHeight;
        }

        // SJF with Worst Fit
        function SJFWF() {
            // Check if any unfinished process can fit in any partition
            const unfinishedProcesses = p_arr.filter(p => !p.finished);
            const maxPartitionSize = Math.max(...hole_arr);
            const canAnyProcessFit = unfinishedProcesses.some(p => parseInt(p.mr) <= maxPartitionSize);
            
            if (unfinishedProcesses.length > 0 && !canAnyProcessFit) {
                document.getElementById('modalMessage').textContent = 'Program ends - No remaining processes can fit in any partition';
                document.getElementById('modal').classList.remove('hidden');
                return;
            }
            
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            
            const timeCell = newRow.insertCell(0);
            timeCell.textContent = currentSimTime;
            
            let totalIF = 0;
            let totalAllocated = 0;
            let totalMemory = 0;
            const blockStatus = [];
            
            // Initialize memory blocks
            for (let i = 0; i < dynamicColumnCount; i++) {
                const cell = newRow.insertCell(i + 1);
                cell.textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            
            // Mark blocks occupied by already allocated processes
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    blockStatus[p.memoryBlock] = true;
                }
            }
            
            // Check for newly arrived processes and allocate memory (Worst Fit)
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    let worstFitIndex = -1;
                    let maxWastage = -1;
                    for (let i = 0; i < dynamicColumnCount; i++) {
                        if (!blockStatus[i] && parseInt(p.mr) <= hole_arr[i]) {
                            const wastage = hole_arr[i] - parseInt(p.mr);
                            if (wastage > maxWastage) {
                                maxWastage = wastage;
                                worstFitIndex = i;
                            }
                        }
                    }
                    if (worstFitIndex !== -1) {
                        p.allocated = true;
                        p.waiting = false;
                        p.memoryBlock = worstFitIndex;
                        blockStatus[worstFitIndex] = true;
                    } else {
                        p.waiting = true;
                        p.allocated = false;
                    }
                }
            }
            
            // Determine running process (SJF - non-preemptive: continue current running process or select shortest burst time)
            let runningProcess = null;
            
            // First check if there's already a running process that hasn't finished
            for (let p of p_arr) {
                if (p.running && p.allocated && !p.finished) {
                    runningProcess = p;
                    break;
                }
            }
            
            // If no process is currently running, select shortest remaining burst time among allocated processes
            if (!runningProcess) {
                let shortestBurst = Infinity;
                for (let p of p_arr) {
                    if (p.allocated && !p.finished) {
                        const pState = allocatedProcesses[p.process_name];
                        if (pState && pState.remainingBurst < shortestBurst) {
                            shortestBurst = pState.remainingBurst;
                            runningProcess = p;
                        }
                    }
                }
            }
            
            // Update process states
            for (let p of p_arr) {
                if (p === runningProcess) {
                    p.running = true;
                    if (p.start_time === -1) {
                        p.start_time = currentSimTime;
                    }
                } else {
                    p.running = false;
                }
            }
            
            // Display allocated processes in their assigned memory blocks
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    const cell = newRow.cells[p.memoryBlock + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[p.memoryBlock] - parseInt(p.mr);
                    
                    if (p.running) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            
            // Execute running process (decrement burst time)
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess.process_name];
                if (pState && pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                    if (pState.remainingBurst === 0) {
                        runningProcess.finished = true;
                        runningProcess.running = false;
                        runningProcess.allocated = false; // Free up the partition
                        runningProcess.end_time = currentSimTime + 1;
                    }
                }
            }
            
            // Calculate waiting jobs
            const waitingJobs = [];
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    waitingJobs.push(p.process_name);
                }
            }
            
            // Calculate external fragmentation
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i]) {
                    if (waitingJobs.length > 0) {
                        const canFit = waitingJobs.some(jobName => {
                            const job = p_arr.find(p => p.process_name === jobName);
                            return parseInt(job.mr) <= hole_arr[i];
                        });
                        if (!canFit) {
                            totalEF += hole_arr[i];
                            const cell = newRow.cells[i + 1];
                            cell.textContent = 'XX';
                            cell.style.color = 'red';
                        }
                    }
                }
            }
            
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            
            const ifCell = newRow.insertCell(dynamicColumnCount + 1);
            ifCell.textContent = totalIF;
            
            const efCell = newRow.insertCell(dynamicColumnCount + 2);
            efCell.textContent = totalEF;
            
            const muCell = newRow.insertCell(dynamicColumnCount + 3);
            muCell.textContent = mu + '%';
            
            const waitingCell = newRow.insertCell(dynamicColumnCount + 4);
            waitingCell.textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            updateLiveTable();
            
            // Check if all processes that can fit are done
            let allDone = true;
            for (let p of p_arr) {
                const maxPartition = Math.max(...hole_arr);
                if (parseInt(p.mr) <= maxPartition) { // Process can fit
                    if (!p.finished) {
                        allDone = false;
                        break;
                    }
                }
            }
            
            if (allDone) {
                showProcessSummary();
            }
            
            currentSimTime++;
            
            const tableContainer = document.querySelector('.table-container');
            tableContainer.scrollTop = tableContainer.scrollHeight;
        }

        // NPP with First Fit
        function NPPFF() {
            // Check if any unfinished process can fit in any partition
            const unfinishedProcesses = p_arr.filter(p => !p.finished);
            const maxPartitionSize = Math.max(...hole_arr);
            const canAnyProcessFit = unfinishedProcesses.some(p => parseInt(p.mr) <= maxPartitionSize);
            
            if (unfinishedProcesses.length > 0 && !canAnyProcessFit) {
                document.getElementById('modalMessage').textContent = 'Program ends - No remaining processes can fit in any partition';
                document.getElementById('modal').classList.remove('hidden');
                return;
            }
            
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            
            const timeCell = newRow.insertCell(0);
            timeCell.textContent = currentSimTime;
            
            let totalIF = 0;
            let totalAllocated = 0;
            let totalMemory = 0;
            const blockStatus = [];
            
            // Initialize memory blocks
            for (let i = 0; i < dynamicColumnCount; i++) {
                const cell = newRow.insertCell(i + 1);
                cell.textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            
            // Mark blocks occupied by already allocated processes
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    blockStatus[p.memoryBlock] = true;
                }
            }
            
            // Check for newly arrived processes and allocate memory (First Fit)
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    let allocated = false;
                    for (let i = 0; i < dynamicColumnCount; i++) {
                        if (!blockStatus[i] && parseInt(p.mr) <= hole_arr[i]) {
                            p.allocated = true;
                            p.waiting = false;
                            p.memoryBlock = i;
                            blockStatus[i] = true;
                            allocated = true;
                            break;
                        }
                    }
                    if (!allocated) {
                        p.waiting = true;
                        p.allocated = false;
                    }
                }
            }
            
            // Determine running process (NPP - non-preemptive: continue current running process or select highest priority)
            let runningProcess = null;
            
            // First check if there's already a running process that hasn't finished
            for (let p of p_arr) {
                if (p.running && p.allocated && !p.finished) {
                    runningProcess = p;
                    break;
                }
            }
            
            // If no process is currently running, select highest priority (lowest number) among allocated processes
            if (!runningProcess) {
                let highestPriority = Infinity;
                let earliestArrival = Infinity;
                for (let p of p_arr) {
                    if (p.allocated && !p.finished) {
                        const priority = parseInt(p.priority);
                        const arrival = parseInt(p.arrival_time);
                        if (priority < highestPriority || (priority === highestPriority && arrival < earliestArrival)) {
                            highestPriority = priority;
                            earliestArrival = arrival;
                            runningProcess = p;
                        }
                    }
                }
            }
            
            // Update process states
            for (let p of p_arr) {
                if (p === runningProcess) {
                    p.running = true;
                    if (p.start_time === -1) {
                        p.start_time = currentSimTime;
                    }
                } else {
                    p.running = false;
                }
            }
            
            // Display allocated processes in their assigned memory blocks
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    const cell = newRow.cells[p.memoryBlock + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[p.memoryBlock] - parseInt(p.mr);
                    
                    if (p.running) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            
            // Execute running process (decrement burst time)
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess.process_name];
                if (pState && pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                    if (pState.remainingBurst === 0) {
                        runningProcess.finished = true;
                        runningProcess.running = false;
                        runningProcess.allocated = false; // Free up the partition
                        runningProcess.end_time = currentSimTime + 1;
                    }
                }
            }
            
            // Calculate waiting jobs
            const waitingJobs = [];
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    waitingJobs.push(p.process_name);
                }
            }
            
            // Calculate external fragmentation
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i]) {
                    if (waitingJobs.length > 0) {
                        const canFit = waitingJobs.some(jobName => {
                            const job = p_arr.find(p => p.process_name === jobName);
                            return parseInt(job.mr) <= hole_arr[i];
                        });
                        if (!canFit) {
                            totalEF += hole_arr[i];
                            const cell = newRow.cells[i + 1];
                            cell.textContent = 'XX';
                            cell.style.color = 'red';
                        }
                    }
                }
            }
            
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            
            const ifCell = newRow.insertCell(dynamicColumnCount + 1);
            ifCell.textContent = totalIF;
            
            const efCell = newRow.insertCell(dynamicColumnCount + 2);
            efCell.textContent = totalEF;
            
            const muCell = newRow.insertCell(dynamicColumnCount + 3);
            muCell.textContent = mu + '%';
            
            const waitingCell = newRow.insertCell(dynamicColumnCount + 4);
            waitingCell.textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            updateLiveTable();
            
            // Check if all processes that can fit are done
            let allDone = true;
            for (let p of p_arr) {
                const maxPartition = Math.max(...hole_arr);
                if (parseInt(p.mr) <= maxPartition) { // Process can fit
                    if (!p.finished) {
                        allDone = false;
                        break;
                    }
                }
            }
            
            if (allDone) {
                showProcessSummary();
            }
            
            currentSimTime++;
            
            const tableContainer = document.querySelector('.table-container');
            tableContainer.scrollTop = tableContainer.scrollHeight;
        }

        // NPP with Next Fit
        function NPPNF() {
            // Check if any unfinished process can fit in any partition
            const unfinishedProcesses = p_arr.filter(p => !p.finished);
            const maxPartitionSize = Math.max(...hole_arr);
            const canAnyProcessFit = unfinishedProcesses.some(p => parseInt(p.mr) <= maxPartitionSize);
            
            if (unfinishedProcesses.length > 0 && !canAnyProcessFit) {
                document.getElementById('modalMessage').textContent = 'Program ends - No remaining processes can fit in any partition';
                document.getElementById('modal').classList.remove('hidden');
                return;
            }
            
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            
            const timeCell = newRow.insertCell(0);
            timeCell.textContent = currentSimTime;
            
            let totalIF = 0;
            let totalAllocated = 0;
            let totalMemory = 0;
            const blockStatus = [];
            
            // Initialize memory blocks
            for (let i = 0; i < dynamicColumnCount; i++) {
                const cell = newRow.insertCell(i + 1);
                cell.textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            
            // Mark blocks occupied by already allocated processes
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    blockStatus[p.memoryBlock] = true;
                }
            }
            
            // Check for newly arrived processes and allocate memory (Next Fit)
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    let allocated = false;
                    for (let j = 0; j < dynamicColumnCount; j++) {
                        const i = (nextFitIndex + j) % dynamicColumnCount;
                        if (!blockStatus[i] && parseInt(p.mr) <= hole_arr[i]) {
                            p.allocated = true;
                            p.waiting = false;
                            p.memoryBlock = i;
                            blockStatus[i] = true;
                            nextFitIndex = (i + 1) % dynamicColumnCount;
                            allocated = true;
                            break;
                        }
                    }
                    if (!allocated) {
                        p.waiting = true;
                        p.allocated = false;
                    }
                }
            }
            
            // Determine running process (NPP - non-preemptive: continue current running process or select highest priority)
            let runningProcess = null;
            
            // First check if there's already a running process that hasn't finished
            for (let p of p_arr) {
                if (p.running && p.allocated && !p.finished) {
                    runningProcess = p;
                    break;
                }
            }
            
            // If no process is currently running, select highest priority (lowest number) among allocated processes
            if (!runningProcess) {
                let highestPriority = Infinity;
                let earliestArrival = Infinity;
                for (let p of p_arr) {
                    if (p.allocated && !p.finished) {
                        const priority = parseInt(p.priority);
                        const arrival = parseInt(p.arrival_time);
                        if (priority < highestPriority || (priority === highestPriority && arrival < earliestArrival)) {
                            highestPriority = priority;
                            earliestArrival = arrival;
                            runningProcess = p;
                        }
                    }
                }
            }
            
            // Update process states
            for (let p of p_arr) {
                if (p === runningProcess) {
                    p.running = true;
                    if (p.start_time === -1) {
                        p.start_time = currentSimTime;
                    }
                } else {
                    p.running = false;
                }
            }
            
            // Display allocated processes in their assigned memory blocks
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    const cell = newRow.cells[p.memoryBlock + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[p.memoryBlock] - parseInt(p.mr);
                    
                    if (p.running) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            
            // Execute running process (decrement burst time)
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess.process_name];
                if (pState && pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                    if (pState.remainingBurst === 0) {
                        runningProcess.finished = true;
                        runningProcess.running = false;
                        runningProcess.allocated = false; // Free up the partition
                        runningProcess.end_time = currentSimTime + 1;
                    }
                }
            }
            
            // Calculate waiting jobs
            const waitingJobs = [];
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    waitingJobs.push(p.process_name);
                }
            }
            
            // Calculate external fragmentation
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i]) {
                    if (waitingJobs.length > 0) {
                        const canFit = waitingJobs.some(jobName => {
                            const job = p_arr.find(p => p.process_name === jobName);
                            return parseInt(job.mr) <= hole_arr[i];
                        });
                        if (!canFit) {
                            totalEF += hole_arr[i];
                            const cell = newRow.cells[i + 1];
                            cell.textContent = 'XX';
                            cell.style.color = 'red';
                        }
                    }
                }
            }
            
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            
            const ifCell = newRow.insertCell(dynamicColumnCount + 1);
            ifCell.textContent = totalIF;
            
            const efCell = newRow.insertCell(dynamicColumnCount + 2);
            efCell.textContent = totalEF;
            
            const muCell = newRow.insertCell(dynamicColumnCount + 3);
            muCell.textContent = mu + '%';
            
            const waitingCell = newRow.insertCell(dynamicColumnCount + 4);
            waitingCell.textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            updateLiveTable();
            
            // Check if all processes that can fit are done
            let allDone = true;
            for (let p of p_arr) {
                const maxPartition = Math.max(...hole_arr);
                if (parseInt(p.mr) <= maxPartition) { // Process can fit
                    if (!p.finished) {
                        allDone = false;
                        break;
                    }
                }
            }
            
            if (allDone) {
                showProcessSummary();
            }
            
            currentSimTime++;
            
            const tableContainer = document.querySelector('.table-container');
            tableContainer.scrollTop = tableContainer.scrollHeight;
        }

        // NPP with Best Fit
        function NPPBF() {
            // Check if any unfinished process can fit in any partition
            const unfinishedProcesses = p_arr.filter(p => !p.finished);
            const maxPartitionSize = Math.max(...hole_arr);
            const canAnyProcessFit = unfinishedProcesses.some(p => parseInt(p.mr) <= maxPartitionSize);
            
            if (unfinishedProcesses.length > 0 && !canAnyProcessFit) {
                document.getElementById('modalMessage').textContent = 'Program ends - No remaining processes can fit in any partition';
                document.getElementById('modal').classList.remove('hidden');
                return;
            }
            
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            
            const timeCell = newRow.insertCell(0);
            timeCell.textContent = currentSimTime;
            
            let totalIF = 0;
            let totalAllocated = 0;
            let totalMemory = 0;
            const blockStatus = [];
            
            // Initialize memory blocks
            for (let i = 0; i < dynamicColumnCount; i++) {
                const cell = newRow.insertCell(i + 1);
                cell.textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            
            // Mark blocks occupied by already allocated processes
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    blockStatus[p.memoryBlock] = true;
                }
            }
            
            // Check for newly arrived processes and allocate memory (Best Fit)
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    let bestFitIndex = -1;
                    let minWastage = Infinity;
                    for (let i = 0; i < dynamicColumnCount; i++) {
                        if (!blockStatus[i] && parseInt(p.mr) <= hole_arr[i]) {
                            const wastage = hole_arr[i] - parseInt(p.mr);
                            if (wastage < minWastage) {
                                minWastage = wastage;
                                bestFitIndex = i;
                            }
                        }
                    }
                    if (bestFitIndex !== -1) {
                        p.allocated = true;
                        p.waiting = false;
                        p.memoryBlock = bestFitIndex;
                        blockStatus[bestFitIndex] = true;
                    } else {
                        p.waiting = true;
                        p.allocated = false;
                    }
                }
            }
            
            // Determine running process (NPP - non-preemptive: continue current running process or select highest priority)
            let runningProcess = null;
            
            // First check if there's already a running process that hasn't finished
            for (let p of p_arr) {
                if (p.running && p.allocated && !p.finished) {
                    runningProcess = p;
                    break;
                }
            }
            
            // If no process is currently running, select highest priority (lowest number) among allocated processes
            if (!runningProcess) {
                let highestPriority = Infinity;
                let earliestArrival = Infinity;
                for (let p of p_arr) {
                    if (p.allocated && !p.finished) {
                        const priority = parseInt(p.priority);
                        const arrival = parseInt(p.arrival_time);
                        if (priority < highestPriority || (priority === highestPriority && arrival < earliestArrival)) {
                            highestPriority = priority;
                            earliestArrival = arrival;
                            runningProcess = p;
                        }
                    }
                }
            }
            
            // Update process states
            for (let p of p_arr) {
                if (p === runningProcess) {
                    p.running = true;
                    if (p.start_time === -1) {
                        p.start_time = currentSimTime;
                    }
                } else {
                    p.running = false;
                }
            }
            
            // Display allocated processes in their assigned memory blocks
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    const cell = newRow.cells[p.memoryBlock + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[p.memoryBlock] - parseInt(p.mr);
                    
                    if (p.running) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            
            // Execute running process (decrement burst time)
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess.process_name];
                if (pState && pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                    if (pState.remainingBurst === 0) {
                        runningProcess.finished = true;
                        runningProcess.running = false;
                        runningProcess.allocated = false; // Free up the partition
                        runningProcess.end_time = currentSimTime + 1;
                    }
                }
            }
            
            // Calculate waiting jobs
            const waitingJobs = [];
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    waitingJobs.push(p.process_name);
                }
            }
            
            // Calculate external fragmentation
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i]) {
                    if (waitingJobs.length > 0) {
                        const canFit = waitingJobs.some(jobName => {
                            const job = p_arr.find(p => p.process_name === jobName);
                            return parseInt(job.mr) <= hole_arr[i];
                        });
                        if (!canFit) {
                            totalEF += hole_arr[i];
                            const cell = newRow.cells[i + 1];
                            cell.textContent = 'XX';
                            cell.style.color = 'red';
                        }
                    }
                }
            }
            
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            
            const ifCell = newRow.insertCell(dynamicColumnCount + 1);
            ifCell.textContent = totalIF;
            
            const efCell = newRow.insertCell(dynamicColumnCount + 2);
            efCell.textContent = totalEF;
            
            const muCell = newRow.insertCell(dynamicColumnCount + 3);
            muCell.textContent = mu + '%';
            
            const waitingCell = newRow.insertCell(dynamicColumnCount + 4);
            waitingCell.textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            updateLiveTable();
            
            // Check if all processes that can fit are done
            let allDone = true;
            for (let p of p_arr) {
                const maxPartition = Math.max(...hole_arr);
                if (parseInt(p.mr) <= maxPartition) { // Process can fit
                    if (!p.finished) {
                        allDone = false;
                        break;
                    }
                }
            }
            
            if (allDone) {
                showProcessSummary();
            }
            
            currentSimTime++;
            
            const tableContainer = document.querySelector('.table-container');
            tableContainer.scrollTop = tableContainer.scrollHeight;
        }

        // NPP with Worst Fit
        function NPPWF() {
            // Check if any unfinished process can fit in any partition
            const unfinishedProcesses = p_arr.filter(p => !p.finished);
            const maxPartitionSize = Math.max(...hole_arr);
            const canAnyProcessFit = unfinishedProcesses.some(p => parseInt(p.mr) <= maxPartitionSize);
            
            if (unfinishedProcesses.length > 0 && !canAnyProcessFit) {
                document.getElementById('modalMessage').textContent = 'Program ends - No remaining processes can fit in any partition';
                document.getElementById('modal').classList.remove('hidden');
                return;
            }
            
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            
            const timeCell = newRow.insertCell(0);
            timeCell.textContent = currentSimTime;
            
            let totalIF = 0;
            let totalAllocated = 0;
            let totalMemory = 0;
            const blockStatus = [];
            
            // Initialize memory blocks
            for (let i = 0; i < dynamicColumnCount; i++) {
                const cell = newRow.insertCell(i + 1);
                cell.textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            
            // Mark blocks occupied by already allocated processes
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    blockStatus[p.memoryBlock] = true;
                }
            }
            
            // Check for newly arrived processes and allocate memory (Worst Fit)
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    let worstFitIndex = -1;
                    let maxWastage = -1;
                    for (let i = 0; i < dynamicColumnCount; i++) {
                        if (!blockStatus[i] && parseInt(p.mr) <= hole_arr[i]) {
                            const wastage = hole_arr[i] - parseInt(p.mr);
                            if (wastage > maxWastage) {
                                maxWastage = wastage;
                                worstFitIndex = i;
                            }
                        }
                    }
                    if (worstFitIndex !== -1) {
                        p.allocated = true;
                        p.waiting = false;
                        p.memoryBlock = worstFitIndex;
                        blockStatus[worstFitIndex] = true;
                    } else {
                        p.waiting = true;
                        p.allocated = false;
                    }
                }
            }
            
            // Determine running process (NPP - non-preemptive: continue current running process or select highest priority)
            let runningProcess = null;
            
            // First check if there's already a running process that hasn't finished
            for (let p of p_arr) {
                if (p.running && p.allocated && !p.finished) {
                    runningProcess = p;
                    break;
                }
            }
            
            // If no process is currently running, select highest priority (lowest number) among allocated processes
            if (!runningProcess) {
                let highestPriority = Infinity;
                let earliestArrival = Infinity;
                for (let p of p_arr) {
                    if (p.allocated && !p.finished) {
                        const priority = parseInt(p.priority);
                        const arrival = parseInt(p.arrival_time);
                        if (priority < highestPriority || (priority === highestPriority && arrival < earliestArrival)) {
                            highestPriority = priority;
                            earliestArrival = arrival;
                            runningProcess = p;
                        }
                    }
                }
            }
            
            // Update process states
            for (let p of p_arr) {
                if (p === runningProcess) {
                    p.running = true;
                    if (p.start_time === -1) {
                        p.start_time = currentSimTime;
                    }
                } else {
                    p.running = false;
                }
            }
            
            // Display allocated processes in their assigned memory blocks
            for (let p of p_arr) {
                if (p.allocated && !p.finished && p.memoryBlock !== undefined) {
                    const cell = newRow.cells[p.memoryBlock + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[p.memoryBlock] - parseInt(p.mr);
                    
                    if (p.running) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            
            // Execute running process (decrement burst time)
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess.process_name];
                if (pState && pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                    if (pState.remainingBurst === 0) {
                        runningProcess.finished = true;
                        runningProcess.running = false;
                        runningProcess.allocated = false; // Free up the partition
                        runningProcess.end_time = currentSimTime + 1;
                    }
                }
            }
            
            // Calculate waiting jobs
            const waitingJobs = [];
            for (let p of p_arr) {
                if (parseInt(p.arrival_time) <= currentSimTime && !p.allocated && !p.finished) {
                    waitingJobs.push(p.process_name);
                }
            }
            
            // Calculate external fragmentation
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i]) {
                    if (waitingJobs.length > 0) {
                        const canFit = waitingJobs.some(jobName => {
                            const job = p_arr.find(p => p.process_name === jobName);
                            return parseInt(job.mr) <= hole_arr[i];
                        });
                        if (!canFit) {
                            totalEF += hole_arr[i];
                            const cell = newRow.cells[i + 1];
                            cell.textContent = 'XX';
                            cell.style.color = 'red';
                        }
                    }
                }
            }
            
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            
            const ifCell = newRow.insertCell(dynamicColumnCount + 1);
            ifCell.textContent = totalIF;
            
            const efCell = newRow.insertCell(dynamicColumnCount + 2);
            efCell.textContent = totalEF;
            
            const muCell = newRow.insertCell(dynamicColumnCount + 3);
            muCell.textContent = mu + '%';
            
            const waitingCell = newRow.insertCell(dynamicColumnCount + 4);
            waitingCell.textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            updateLiveTable();
            
            // Check if all processes that can fit are done
            let allDone = true;
            for (let p of p_arr) {
                const maxPartition = Math.max(...hole_arr);
                if (parseInt(p.mr) <= maxPartition) { // Process can fit
                    if (!p.finished) {
                        allDone = false;
                        break;
                    }
                }
            }
            
            if (allDone) {
                showProcessSummary();
            }
            
            currentSimTime++;
            
            const tableContainer = document.querySelector('.table-container');
            tableContainer.scrollTop = tableContainer.scrollHeight;
        }


function toggleSidePanel() {
    document.getElementById('sidePanel').classList.toggle('active');
}
        