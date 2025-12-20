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
        }
         
        class Process {
          constructor(process_name, arrival_time, burst_time, mr, priority) {
            this.process_name = process_name;
            this.arrival_time = arrival_time;
            this.burst_time = burst_time;
            this.mr = mr;
            this.priority = priority || null;
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
            
            while (!checkAllProcessesDone()) {
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
                
                if (pState) {
                    row.cells[1].textContent = pState.remainingBurst;
                    
                    if (runningProcess === processName) {
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
        
        function showProcessSummary() {
            const finished = [];
            const unfinished = [];
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst === 0) {
                    finished.push(p.process_name);
                } else {
                    unfinished.push(p.process_name);
                }
            }
            document.getElementById('finishedProcesses').textContent = finished.length > 0 ? finished.join(', ') : 'None';
            document.getElementById('unfinishedProcesses').textContent = unfinished.length > 0 ? unfinished.join(', ') : 'None';
            document.getElementById('processSummary').classList.remove('hidden');
            document.getElementById('modalMessage').textContent = 'Process End';
            document.getElementById('modal').classList.remove('hidden');
            document.getElementById('proceedBtn').disabled = true;
            document.getElementById('finishBtn').disabled = true;
            document.getElementById('editVariablesBtn').classList.remove('hidden');
            document.getElementById('resetBtn').classList.remove('hidden');
            document.getElementById('currentTimeLabel').textContent = 'End Time: ' + (currentSimTime + 1);
        }
        
        function FCFSFF() {
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            
            const timeCell = newRow.insertCell(0);
            timeCell.textContent = currentSimTime;
            
            let totalIF = 0;
            let totalAllocated = 0;
            let totalMemory = 0;
            const blockStatus = [];
            
            for (let i = 0; i < dynamicColumnCount; i++) {
                const cell = newRow.insertCell(i + 1);
                cell.textContent = '-';
                totalMemory += hole_arr[i];
                let blockUsed = false;
                
                for (let p of processQueue) {
                    const pState = allocatedProcesses[p.process_name];
                    
                    if (parseInt(p.arrival_time) <= currentSimTime && !pState.allocated) {
                        if (parseInt(p.mr) <= hole_arr[i]) {
                            pState.allocated = true;
                            pState.memoryBlock = i;
                            if (!runningProcess) {
                                runningProcess = p.process_name;
                            }
                        }
                    }
                    
                    if (pState.allocated && pState.memoryBlock === i && pState.remainingBurst > 0) {
                        cell.textContent = p.process_name + '(' + p.mr + ')';
                        totalAllocated += parseInt(p.mr);
                        totalIF += hole_arr[i] - parseInt(p.mr);
                        blockUsed = true;
                        if (runningProcess === p.process_name) {
                            cell.style.backgroundColor = '#2d5f2d';
                        } else {
                            cell.style.backgroundColor = '#4a4a2d';
                        }
                        break;
                    }
                }
                blockStatus.push(blockUsed);
            }
            
            const waitingJobs = getWaitingJobs();
            let totalEF = 0;
            
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i]) {
                    if (waitingJobs.length > 0) {
                        const canFit = waitingJobs.some(jobName => {
                            const job = processQueue.find(p => p.process_name === jobName);
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
            
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess];
                if (pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                }
                if (pState.remainingBurst === 0) {
                    runningProcess = null;
                    for (let p of processQueue) {
                        const pState = allocatedProcesses[p.process_name];
                        if (pState.allocated && pState.remainingBurst > 0) {
                            runningProcess = p.process_name;
                            break;
                        }
                    }
                }
            }
            
            updateLiveTable();
            
            if (checkAllProcessesDone()) {
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
            document.getElementById('finishBtn').disabled = true;
            document.getElementById('finishBtn').classList.add('hidden');
            document.getElementById('editVariablesBtn').classList.add('hidden');
            document.getElementById('resetBtn').classList.add('hidden');
            
            // Hide time display and labels
            document.getElementById('timeDisplay').classList.add('hidden');
            document.getElementById('labelsContainer').classList.add('hidden');
            document.getElementById('algorithmLabel').classList.add('hidden');
            document.getElementById('allocationLabel').classList.add('hidden');
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
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            newRow.insertCell(0).textContent = currentSimTime;
            let totalIF = 0, totalAllocated = 0, totalMemory = 0;
            const blockStatus = [];
            for (let i = 0; i < dynamicColumnCount; i++) {
                newRow.insertCell(i + 1).textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (parseInt(p.arrival_time) <= currentSimTime && !pState.allocated) {
                    for (let j = 0; j < dynamicColumnCount; j++) {
                        const i = (nextFitIndex + j) % dynamicColumnCount;
                        if (!blockStatus[i] && parseInt(p.mr) <= hole_arr[i]) {
                            pState.allocated = true;
                            pState.memoryBlock = i;
                            blockStatus[i] = true;
                            nextFitIndex = (i + 1) % dynamicColumnCount;
                            if (!runningProcess) {
                                runningProcess = p.process_name;
                            }
                            break;
                        }
                    }
                }
                if (pState.allocated && pState.remainingBurst > 0) {
                    const i = pState.memoryBlock;
                    const cell = newRow.cells[i + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[i] - parseInt(p.mr);
                    blockStatus[i] = true;
                    if (runningProcess === p.process_name) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            const waitingJobs = getWaitingJobs();
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i] && waitingJobs.length > 0) {
                    const canFit = waitingJobs.some(jobName => {
                        const job = processQueue.find(p => p.process_name === jobName);
                        return parseInt(job.mr) <= hole_arr[i];
                    });
                    if (!canFit) {
                        totalEF += hole_arr[i];
                        newRow.cells[i + 1].textContent = 'XX';
                        newRow.cells[i + 1].style.color = 'red';
                    }
                }
            }
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            newRow.insertCell(dynamicColumnCount + 1).textContent = totalIF;
            newRow.insertCell(dynamicColumnCount + 2).textContent = totalEF;
            newRow.insertCell(dynamicColumnCount + 3).textContent = mu + '%';
            newRow.insertCell(dynamicColumnCount + 4).textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess];
                if (pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                }
                if (pState.remainingBurst === 0) {
                    runningProcess = null;
                    for (let p of processQueue) {
                        const pState = allocatedProcesses[p.process_name];
                        if (pState.allocated && pState.remainingBurst > 0) {
                            runningProcess = p.process_name;
                            break;
                        }
                    }
                }
            }
            updateLiveTable();
            if (checkAllProcessesDone()) {
                showProcessSummary();
            }
            currentSimTime++;
            document.querySelector('.table-container').scrollTop = document.querySelector('.table-container').scrollHeight;
        }

        // FCFS with Best Fit
        function FCFSBF() {
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            newRow.insertCell(0).textContent = currentSimTime;
            let totalIF = 0, totalAllocated = 0, totalMemory = 0;
            const blockStatus = [];
            for (let i = 0; i < dynamicColumnCount; i++) {
                newRow.insertCell(i + 1).textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (parseInt(p.arrival_time) <= currentSimTime && !pState.allocated) {
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
                        pState.allocated = true;
                        pState.memoryBlock = bestFitIndex;
                        blockStatus[bestFitIndex] = true;
                        if (!runningProcess) {
                            runningProcess = p.process_name;
                        }
                    }
                }
                if (pState.allocated && pState.remainingBurst > 0) {
                    const i = pState.memoryBlock;
                    const cell = newRow.cells[i + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[i] - parseInt(p.mr);
                    blockStatus[i] = true;
                    if (runningProcess === p.process_name) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            const waitingJobs = getWaitingJobs();
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i] && waitingJobs.length > 0) {
                    const canFit = waitingJobs.some(jobName => {
                        const job = processQueue.find(p => p.process_name === jobName);
                        return parseInt(job.mr) <= hole_arr[i];
                    });
                    if (!canFit) {
                        totalEF += hole_arr[i];
                        newRow.cells[i + 1].textContent = 'XX';
                        newRow.cells[i + 1].style.color = 'red';
                    }
                }
            }
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            newRow.insertCell(dynamicColumnCount + 1).textContent = totalIF;
            newRow.insertCell(dynamicColumnCount + 2).textContent = totalEF;
            newRow.insertCell(dynamicColumnCount + 3).textContent = mu + '%';
            newRow.insertCell(dynamicColumnCount + 4).textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess];
                if (pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                }
                if (pState.remainingBurst === 0) {
                    runningProcess = null;
                    for (let p of processQueue) {
                        const pState = allocatedProcesses[p.process_name];
                        if (pState.allocated && pState.remainingBurst > 0) {
                            runningProcess = p.process_name;
                            break;
                        }
                    }
                }
            }
            updateLiveTable();
            if (checkAllProcessesDone()) {
                showProcessSummary();
            }
            currentSimTime++;
            document.querySelector('.table-container').scrollTop = document.querySelector('.table-container').scrollHeight;
        }

        // FCFS with Worst Fit
        function FCFSWF() {
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            newRow.insertCell(0).textContent = currentSimTime;
            let totalIF = 0, totalAllocated = 0, totalMemory = 0;
            const blockStatus = [];
            for (let i = 0; i < dynamicColumnCount; i++) {
                newRow.insertCell(i + 1).textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (parseInt(p.arrival_time) <= currentSimTime && !pState.allocated) {
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
                        pState.allocated = true;
                        pState.memoryBlock = worstFitIndex;
                        blockStatus[worstFitIndex] = true;
                        if (!runningProcess) {
                            runningProcess = p.process_name;
                        }
                    }
                }
                if (pState.allocated && pState.remainingBurst > 0) {
                    const i = pState.memoryBlock;
                    const cell = newRow.cells[i + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[i] - parseInt(p.mr);
                    blockStatus[i] = true;
                    if (runningProcess === p.process_name) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            const waitingJobs = getWaitingJobs();
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i] && waitingJobs.length > 0) {
                    const canFit = waitingJobs.some(jobName => {
                        const job = processQueue.find(p => p.process_name === jobName);
                        return parseInt(job.mr) <= hole_arr[i];
                    });
                    if (!canFit) {
                        totalEF += hole_arr[i];
                        newRow.cells[i + 1].textContent = 'XX';
                        newRow.cells[i + 1].style.color = 'red';
                    }
                }
            }
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            newRow.insertCell(dynamicColumnCount + 1).textContent = totalIF;
            newRow.insertCell(dynamicColumnCount + 2).textContent = totalEF;
            newRow.insertCell(dynamicColumnCount + 3).textContent = mu + '%';
            newRow.insertCell(dynamicColumnCount + 4).textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess];
                if (pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                }
                if (pState.remainingBurst === 0) {
                    runningProcess = null;
                    for (let p of processQueue) {
                        const pState = allocatedProcesses[p.process_name];
                        if (pState.allocated && pState.remainingBurst > 0) {
                            runningProcess = p.process_name;
                            break;
                        }
                    }
                }
            }
            updateLiveTable();
            if (checkAllProcessesDone()) {
                showProcessSummary();
            }
            currentSimTime++;
            document.querySelector('.table-container').scrollTop = document.querySelector('.table-container').scrollHeight;
        }

        // SJF with First Fit
        function SJFFF() {
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            newRow.insertCell(0).textContent = currentSimTime;
            let totalIF = 0, totalAllocated = 0, totalMemory = 0;
            const blockStatus = [];
            for (let i = 0; i < dynamicColumnCount; i++) {
                newRow.insertCell(i + 1).textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0) {
                    blockStatus[pState.memoryBlock] = true;
                }
            }
            const arrivedProcesses = processQueue.filter(p => parseInt(p.arrival_time) <= currentSimTime && !allocatedProcesses[p.process_name].allocated).sort((a, b) => parseInt(a.burst_time) - parseInt(b.burst_time));
            for (let p of arrivedProcesses) {
                const pState = allocatedProcesses[p.process_name];
                for (let i = 0; i < dynamicColumnCount; i++) {
                    if (!blockStatus[i] && parseInt(p.mr) <= hole_arr[i]) {
                        pState.allocated = true;
                        pState.memoryBlock = i;
                        blockStatus[i] = true;
                        break;
                    }
                }
            }
            
            runningProcess = null;
            let shortestBurst = Infinity;
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0 && pState.remainingBurst < shortestBurst) {
                    shortestBurst = pState.remainingBurst;
                    runningProcess = p.process_name;
                }
            }
            
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0) {
                    const i = pState.memoryBlock;
                    const cell = newRow.cells[i + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[i] - parseInt(p.mr);
                    blockStatus[i] = true;
                    if (runningProcess === p.process_name) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            const waitingJobs = getWaitingJobs();
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i] && waitingJobs.length > 0) {
                    const canFit = waitingJobs.some(jobName => {
                        const job = processQueue.find(p => p.process_name === jobName);
                        return parseInt(job.mr) <= hole_arr[i];
                    });
                    if (!canFit) {
                        totalEF += hole_arr[i];
                        newRow.cells[i + 1].textContent = 'XX';
                        newRow.cells[i + 1].style.color = 'red';
                    }
                }
            }
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            newRow.insertCell(dynamicColumnCount + 1).textContent = totalIF;
            newRow.insertCell(dynamicColumnCount + 2).textContent = totalEF;
            newRow.insertCell(dynamicColumnCount + 3).textContent = mu + '%';
            newRow.insertCell(dynamicColumnCount + 4).textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess];
                if (pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                }
                if (pState.remainingBurst === 0) {
                    runningProcess = null;
                    let shortestBurst = Infinity;
                    for (let p of processQueue) {
                        const pState = allocatedProcesses[p.process_name];
                        if (pState.allocated && pState.remainingBurst > 0 && pState.remainingBurst < shortestBurst) {
                            shortestBurst = pState.remainingBurst;
                            runningProcess = p.process_name;
                        }
                    }
                }
            }
            updateLiveTable();
            if (checkAllProcessesDone()) {
                showProcessSummary();
            }
            currentSimTime++;
            document.querySelector('.table-container').scrollTop = document.querySelector('.table-container').scrollHeight;
        }

        // SJF with Next Fit
        function SJFNF() {
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            newRow.insertCell(0).textContent = currentSimTime;
            let totalIF = 0, totalAllocated = 0, totalMemory = 0;
            const blockStatus = [];
            for (let i = 0; i < dynamicColumnCount; i++) {
                newRow.insertCell(i + 1).textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0) {
                    blockStatus[pState.memoryBlock] = true;
                }
            }
            const arrivedProcesses = processQueue.filter(p => parseInt(p.arrival_time) <= currentSimTime && !allocatedProcesses[p.process_name].allocated).sort((a, b) => parseInt(a.burst_time) - parseInt(b.burst_time));
            for (let p of arrivedProcesses) {
                const pState = allocatedProcesses[p.process_name];
                for (let j = 0; j < dynamicColumnCount; j++) {
                    const i = (nextFitIndex + j) % dynamicColumnCount;
                    if (!blockStatus[i] && parseInt(p.mr) <= hole_arr[i]) {
                        pState.allocated = true;
                        pState.memoryBlock = i;
                        blockStatus[i] = true;
                        nextFitIndex = (i + 1) % dynamicColumnCount;
                        break;
                    }
                }
            }
            
            runningProcess = null;
            let shortestBurst = Infinity;
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0 && pState.remainingBurst < shortestBurst) {
                    shortestBurst = pState.remainingBurst;
                    runningProcess = p.process_name;
                }
            }
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0) {
                    const i = pState.memoryBlock;
                    const cell = newRow.cells[i + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[i] - parseInt(p.mr);
                    blockStatus[i] = true;
                    if (runningProcess === p.process_name) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            const waitingJobs = getWaitingJobs();
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i] && waitingJobs.length > 0) {
                    const canFit = waitingJobs.some(jobName => {
                        const job = processQueue.find(p => p.process_name === jobName);
                        return parseInt(job.mr) <= hole_arr[i];
                    });
                    if (!canFit) {
                        totalEF += hole_arr[i];
                        newRow.cells[i + 1].textContent = 'XX';
                        newRow.cells[i + 1].style.color = 'red';
                    }
                }
            }
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            newRow.insertCell(dynamicColumnCount + 1).textContent = totalIF;
            newRow.insertCell(dynamicColumnCount + 2).textContent = totalEF;
            newRow.insertCell(dynamicColumnCount + 3).textContent = mu + '%';
            newRow.insertCell(dynamicColumnCount + 4).textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            if (!runningProcess) {
                let shortestBurst = Infinity;
                for (let p of processQueue) {
                    const pState = allocatedProcesses[p.process_name];
                    if (pState.allocated && pState.remainingBurst > 0 && pState.remainingBurst < shortestBurst) {
                        shortestBurst = pState.remainingBurst;
                        runningProcess = p.process_name;
                    }
                }
            }
            
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess];
                if (pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                }
                if (pState.remainingBurst === 0) {
                    runningProcess = null;
                    let shortestBurst = Infinity;
                    for (let p of processQueue) {
                        const pState = allocatedProcesses[p.process_name];
                        if (pState.allocated && pState.remainingBurst > 0 && pState.remainingBurst < shortestBurst) {
                            shortestBurst = pState.remainingBurst;
                            runningProcess = p.process_name;
                        }
                    }
                }
            }
            updateLiveTable();
            if (checkAllProcessesDone()) {
                showProcessSummary();
            }
            currentSimTime++;
            document.querySelector('.table-container').scrollTop = document.querySelector('.table-container').scrollHeight;
        }

        // SJF with Best Fit
        function SJFBF() {
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            newRow.insertCell(0).textContent = currentSimTime;
            let totalIF = 0, totalAllocated = 0, totalMemory = 0;
            const blockStatus = [];
            for (let i = 0; i < dynamicColumnCount; i++) {
                newRow.insertCell(i + 1).textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0) {
                    blockStatus[pState.memoryBlock] = true;
                }
            }
            const arrivedProcesses = processQueue.filter(p => parseInt(p.arrival_time) <= currentSimTime && !allocatedProcesses[p.process_name].allocated).sort((a, b) => parseInt(a.burst_time) - parseInt(b.burst_time));
            for (let p of arrivedProcesses) {
                const pState = allocatedProcesses[p.process_name];
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
                    pState.allocated = true;
                    pState.memoryBlock = bestFitIndex;
                    blockStatus[bestFitIndex] = true;
                }
            }
            
            runningProcess = null;
            let shortestBurst = Infinity;
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0 && pState.remainingBurst < shortestBurst) {
                    shortestBurst = pState.remainingBurst;
                    runningProcess = p.process_name;
                }
            }
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0) {
                    const i = pState.memoryBlock;
                    const cell = newRow.cells[i + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[i] - parseInt(p.mr);
                    blockStatus[i] = true;
                    if (runningProcess === p.process_name) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            const waitingJobs = getWaitingJobs();
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i] && waitingJobs.length > 0) {
                    const canFit = waitingJobs.some(jobName => {
                        const job = processQueue.find(p => p.process_name === jobName);
                        return parseInt(job.mr) <= hole_arr[i];
                    });
                    if (!canFit) {
                        totalEF += hole_arr[i];
                        newRow.cells[i + 1].textContent = 'XX';
                        newRow.cells[i + 1].style.color = 'red';
                    }
                }
            }
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            newRow.insertCell(dynamicColumnCount + 1).textContent = totalIF;
            newRow.insertCell(dynamicColumnCount + 2).textContent = totalEF;
            newRow.insertCell(dynamicColumnCount + 3).textContent = mu + '%';
            newRow.insertCell(dynamicColumnCount + 4).textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            if (!runningProcess) {
                let shortestBurst = Infinity;
                for (let p of processQueue) {
                    const pState = allocatedProcesses[p.process_name];
                    if (pState.allocated && pState.remainingBurst > 0 && pState.remainingBurst < shortestBurst) {
                        shortestBurst = pState.remainingBurst;
                        runningProcess = p.process_name;
                    }
                }
            }
            
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess];
                if (pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                }
                if (pState.remainingBurst === 0) {
                    runningProcess = null;
                    let shortestBurst = Infinity;
                    for (let p of processQueue) {
                        const pState = allocatedProcesses[p.process_name];
                        if (pState.allocated && pState.remainingBurst > 0 && pState.remainingBurst < shortestBurst) {
                            shortestBurst = pState.remainingBurst;
                            runningProcess = p.process_name;
                        }
                    }
                }
            }
            updateLiveTable();
            if (checkAllProcessesDone()) {
                showProcessSummary();
            }
            currentSimTime++;
            document.querySelector('.table-container').scrollTop = document.querySelector('.table-container').scrollHeight;
        }

        // SJF with Worst Fit
        function SJFWF() {
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            newRow.insertCell(0).textContent = currentSimTime;
            let totalIF = 0, totalAllocated = 0, totalMemory = 0;
            const blockStatus = [];
            for (let i = 0; i < dynamicColumnCount; i++) {
                newRow.insertCell(i + 1).textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0) {
                    blockStatus[pState.memoryBlock] = true;
                }
            }
            const arrivedProcesses = processQueue.filter(p => parseInt(p.arrival_time) <= currentSimTime && !allocatedProcesses[p.process_name].allocated).sort((a, b) => parseInt(a.burst_time) - parseInt(b.burst_time));
            for (let p of arrivedProcesses) {
                const pState = allocatedProcesses[p.process_name];
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
                    pState.allocated = true;
                    pState.memoryBlock = worstFitIndex;
                    blockStatus[worstFitIndex] = true;
                }
            }
            
            runningProcess = null;
            let shortestBurst = Infinity;
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0 && pState.remainingBurst < shortestBurst) {
                    shortestBurst = pState.remainingBurst;
                    runningProcess = p.process_name;
                }
            }
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0) {
                    const i = pState.memoryBlock;
                    const cell = newRow.cells[i + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[i] - parseInt(p.mr);
                    blockStatus[i] = true;
                    if (runningProcess === p.process_name) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            const waitingJobs = getWaitingJobs();
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i] && waitingJobs.length > 0) {
                    const canFit = waitingJobs.some(jobName => {
                        const job = processQueue.find(p => p.process_name === jobName);
                        return parseInt(job.mr) <= hole_arr[i];
                    });
                    if (!canFit) {
                        totalEF += hole_arr[i];
                        newRow.cells[i + 1].textContent = 'XX';
                        newRow.cells[i + 1].style.color = 'red';
                    }
                }
            }
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            newRow.insertCell(dynamicColumnCount + 1).textContent = totalIF;
            newRow.insertCell(dynamicColumnCount + 2).textContent = totalEF;
            newRow.insertCell(dynamicColumnCount + 3).textContent = mu + '%';
            newRow.insertCell(dynamicColumnCount + 4).textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            if (!runningProcess) {
                let shortestBurst = Infinity;
                for (let p of processQueue) {
                    const pState = allocatedProcesses[p.process_name];
                    if (pState.allocated && pState.remainingBurst > 0 && pState.remainingBurst < shortestBurst) {
                        shortestBurst = pState.remainingBurst;
                        runningProcess = p.process_name;
                    }
                }
            }
            
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess];
                if (pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                }
                if (pState.remainingBurst === 0) {
                    runningProcess = null;
                    let shortestBurst = Infinity;
                    for (let p of processQueue) {
                        const pState = allocatedProcesses[p.process_name];
                        if (pState.allocated && pState.remainingBurst > 0 && pState.remainingBurst < shortestBurst) {
                            shortestBurst = pState.remainingBurst;
                            runningProcess = p.process_name;
                        }
                    }
                }
            }
            updateLiveTable();
            if (checkAllProcessesDone()) {
                showProcessSummary();
            }
            currentSimTime++;
            document.querySelector('.table-container').scrollTop = document.querySelector('.table-container').scrollHeight;
        }

        // NPP with First Fit
        function NPPFF() {
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            newRow.insertCell(0).textContent = currentSimTime;
            let totalIF = 0, totalAllocated = 0, totalMemory = 0;
            const blockStatus = [];
            for (let i = 0; i < dynamicColumnCount; i++) {
                newRow.insertCell(i + 1).textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0) {
                    blockStatus[pState.memoryBlock] = true;
                }
            }
            const arrivedProcesses = processQueue.filter(p => parseInt(p.arrival_time) <= currentSimTime && !allocatedProcesses[p.process_name].allocated).sort((a, b) => parseInt(a.priority) - parseInt(b.priority));
            for (let p of arrivedProcesses) {
                const pState = allocatedProcesses[p.process_name];
                for (let i = 0; i < dynamicColumnCount; i++) {
                    if (!blockStatus[i] && parseInt(p.mr) <= hole_arr[i]) {
                        pState.allocated = true;
                        pState.memoryBlock = i;
                        blockStatus[i] = true;
                        break;
                    }
                }
            }
            
            runningProcess = null;
            let highestPriority = Infinity;
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0 && parseInt(p.priority) < highestPriority) {
                    highestPriority = parseInt(p.priority);
                    runningProcess = p.process_name;
                }
            }
            
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0) {
                    const i = pState.memoryBlock;
                    const cell = newRow.cells[i + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[i] - parseInt(p.mr);
                    blockStatus[i] = true;
                    if (runningProcess === p.process_name) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            const waitingJobs = getWaitingJobs();
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i] && waitingJobs.length > 0) {
                    const canFit = waitingJobs.some(jobName => {
                        const job = processQueue.find(p => p.process_name === jobName);
                        return parseInt(job.mr) <= hole_arr[i];
                    });
                    if (!canFit) {
                        totalEF += hole_arr[i];
                        newRow.cells[i + 1].textContent = 'XX';
                        newRow.cells[i + 1].style.color = 'red';
                    }
                }
            }
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            newRow.insertCell(dynamicColumnCount + 1).textContent = totalIF;
            newRow.insertCell(dynamicColumnCount + 2).textContent = totalEF;
            newRow.insertCell(dynamicColumnCount + 3).textContent = mu + '%';
            newRow.insertCell(dynamicColumnCount + 4).textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess];
                if (pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                }
            }
            updateLiveTable();
            if (checkAllProcessesDone()) {
                showProcessSummary();
            }
            currentSimTime++;
            document.querySelector('.table-container').scrollTop = document.querySelector('.table-container').scrollHeight;
        }

        // NPP with Next Fit
        function NPPNF() {
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            newRow.insertCell(0).textContent = currentSimTime;
            let totalIF = 0, totalAllocated = 0, totalMemory = 0;
            const blockStatus = [];
            for (let i = 0; i < dynamicColumnCount; i++) {
                newRow.insertCell(i + 1).textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0) {
                    blockStatus[pState.memoryBlock] = true;
                }
            }
            const arrivedProcesses = processQueue.filter(p => parseInt(p.arrival_time) <= currentSimTime && !allocatedProcesses[p.process_name].allocated).sort((a, b) => parseInt(a.priority) - parseInt(b.priority));
            for (let p of arrivedProcesses) {
                const pState = allocatedProcesses[p.process_name];
                for (let j = 0; j < dynamicColumnCount; j++) {
                    const i = (nextFitIndex + j) % dynamicColumnCount;
                    if (!blockStatus[i] && parseInt(p.mr) <= hole_arr[i]) {
                        pState.allocated = true;
                        pState.memoryBlock = i;
                        blockStatus[i] = true;
                        nextFitIndex = (i + 1) % dynamicColumnCount;
                        break;
                    }
                }
            }
            
            runningProcess = null;
            let highestPriority = Infinity;
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0 && parseInt(p.priority) < highestPriority) {
                    highestPriority = parseInt(p.priority);
                    runningProcess = p.process_name;
                }
            }
            
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0) {
                    const i = pState.memoryBlock;
                    const cell = newRow.cells[i + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[i] - parseInt(p.mr);
                    blockStatus[i] = true;
                    if (runningProcess === p.process_name) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            const waitingJobs = getWaitingJobs();
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i] && waitingJobs.length > 0) {
                    const canFit = waitingJobs.some(jobName => {
                        const job = processQueue.find(p => p.process_name === jobName);
                        return parseInt(job.mr) <= hole_arr[i];
                    });
                    if (!canFit) {
                        totalEF += hole_arr[i];
                        newRow.cells[i + 1].textContent = 'XX';
                        newRow.cells[i + 1].style.color = 'red';
                    }
                }
            }
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            newRow.insertCell(dynamicColumnCount + 1).textContent = totalIF;
            newRow.insertCell(dynamicColumnCount + 2).textContent = totalEF;
            newRow.insertCell(dynamicColumnCount + 3).textContent = mu + '%';
            newRow.insertCell(dynamicColumnCount + 4).textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess];
                if (pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                }
            }
            updateLiveTable();
            if (checkAllProcessesDone()) {
                showProcessSummary();
            }
            currentSimTime++;
            document.querySelector('.table-container').scrollTop = document.querySelector('.table-container').scrollHeight;
        }

        // NPP with Best Fit
        function NPPBF() {
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            newRow.insertCell(0).textContent = currentSimTime;
            let totalIF = 0, totalAllocated = 0, totalMemory = 0;
            const blockStatus = [];
            for (let i = 0; i < dynamicColumnCount; i++) {
                newRow.insertCell(i + 1).textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0) {
                    blockStatus[pState.memoryBlock] = true;
                }
            }
            const arrivedProcesses = processQueue.filter(p => parseInt(p.arrival_time) <= currentSimTime && !allocatedProcesses[p.process_name].allocated).sort((a, b) => parseInt(a.priority) - parseInt(b.priority));
            for (let p of arrivedProcesses) {
                const pState = allocatedProcesses[p.process_name];
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
                    pState.allocated = true;
                    pState.memoryBlock = bestFitIndex;
                    blockStatus[bestFitIndex] = true;
                }
            }
            
            runningProcess = null;
            let highestPriority = Infinity;
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0 && parseInt(p.priority) < highestPriority) {
                    highestPriority = parseInt(p.priority);
                    runningProcess = p.process_name;
                }
            }
            
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0) {
                    const i = pState.memoryBlock;
                    const cell = newRow.cells[i + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[i] - parseInt(p.mr);
                    blockStatus[i] = true;
                    if (runningProcess === p.process_name) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            const waitingJobs = getWaitingJobs();
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i] && waitingJobs.length > 0) {
                    const canFit = waitingJobs.some(jobName => {
                        const job = processQueue.find(p => p.process_name === jobName);
                        return parseInt(job.mr) <= hole_arr[i];
                    });
                    if (!canFit) {
                        totalEF += hole_arr[i];
                        newRow.cells[i + 1].textContent = 'XX';
                        newRow.cells[i + 1].style.color = 'red';
                    }
                }
            }
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            newRow.insertCell(dynamicColumnCount + 1).textContent = totalIF;
            newRow.insertCell(dynamicColumnCount + 2).textContent = totalEF;
            newRow.insertCell(dynamicColumnCount + 3).textContent = mu + '%';
            newRow.insertCell(dynamicColumnCount + 4).textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess];
                if (pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                }
            }
            updateLiveTable();
            if (checkAllProcessesDone()) {
                showProcessSummary();
            }
            currentSimTime++;
            document.querySelector('.table-container').scrollTop = document.querySelector('.table-container').scrollHeight;
        }

        // NPP with Worst Fit
        function NPPWF() {
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            newRow.insertCell(0).textContent = currentSimTime;
            let totalIF = 0, totalAllocated = 0, totalMemory = 0;
            const blockStatus = [];
            for (let i = 0; i < dynamicColumnCount; i++) {
                newRow.insertCell(i + 1).textContent = '-';
                totalMemory += hole_arr[i];
                blockStatus.push(false);
            }
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0) {
                    blockStatus[pState.memoryBlock] = true;
                }
            }
            const arrivedProcesses = processQueue.filter(p => parseInt(p.arrival_time) <= currentSimTime && !allocatedProcesses[p.process_name].allocated).sort((a, b) => parseInt(a.priority) - parseInt(b.priority));
            for (let p of arrivedProcesses) {
                const pState = allocatedProcesses[p.process_name];
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
                    pState.allocated = true;
                    pState.memoryBlock = worstFitIndex;
                    blockStatus[worstFitIndex] = true;
                }
            }
            
            runningProcess = null;
            let highestPriority = Infinity;
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0 && parseInt(p.priority) < highestPriority) {
                    highestPriority = parseInt(p.priority);
                    runningProcess = p.process_name;
                }
            }
            
            for (let p of processQueue) {
                const pState = allocatedProcesses[p.process_name];
                if (pState.allocated && pState.remainingBurst > 0) {
                    const i = pState.memoryBlock;
                    const cell = newRow.cells[i + 1];
                    cell.textContent = p.process_name + '(' + p.mr + ')';
                    totalAllocated += parseInt(p.mr);
                    totalIF += hole_arr[i] - parseInt(p.mr);
                    blockStatus[i] = true;
                    if (runningProcess === p.process_name) {
                        cell.style.backgroundColor = '#2d5f2d';
                    } else {
                        cell.style.backgroundColor = '#4a4a2d';
                    }
                }
            }
            const waitingJobs = getWaitingJobs();
            let totalEF = 0;
            for (let i = 0; i < dynamicColumnCount; i++) {
                if (!blockStatus[i] && waitingJobs.length > 0) {
                    const canFit = waitingJobs.some(jobName => {
                        const job = processQueue.find(p => p.process_name === jobName);
                        return parseInt(job.mr) <= hole_arr[i];
                    });
                    if (!canFit) {
                        totalEF += hole_arr[i];
                        newRow.cells[i + 1].textContent = 'XX';
                        newRow.cells[i + 1].style.color = 'red';
                    }
                }
            }
            const allocatedMem = totalMemory - totalIF - totalEF;
            const mu = totalMemory > 0 ? ((allocatedMem / totalMemory) * 100).toFixed(2) : 0;
            newRow.insertCell(dynamicColumnCount + 1).textContent = totalIF;
            newRow.insertCell(dynamicColumnCount + 2).textContent = totalEF;
            newRow.insertCell(dynamicColumnCount + 3).textContent = mu + '%';
            newRow.insertCell(dynamicColumnCount + 4).textContent = waitingJobs.length > 0 ? waitingJobs.join(', ') : '-';
            
            if (runningProcess) {
                const pState = allocatedProcesses[runningProcess];
                if (pState.remainingBurst > 0) {
                    pState.remainingBurst--;
                }
            }
            updateLiveTable();
            if (checkAllProcessesDone()) {
                showProcessSummary();
            }
            currentSimTime++;
            document.querySelector('.table-container').scrollTop = document.querySelector('.table-container').scrollHeight;
        }

