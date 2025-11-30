document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById('plan-table-body');
    const ecorsDialog = document.querySelector('.ecors-dialog');
    const ecorsDialogMessage = document.querySelector('.ecors-dialog-message');
    
    const manageButton = document.getElementById('manage-button');

    function showError(message) {
        ecorsDialogMessage.textContent = message;
        ecorsDialog.setAttribute('closedby','none');
        ecorsDialog.showModal();
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (ecorsDialog.open) {
                event.preventDefault();
            }
        }
    });

    manageButton.addEventListener('click', () => {
        window.location.href = './reserve.html'; 
    });

    async function fetchStudyPlans() {
        try {
            // const response = await fetch('/intproj25/sy3/itb-ecors/api/v1/study-plans');
            const response = await fetch('http://localhost:3000/intproj25/sy3/itb-ecors/api/v1/study-plans');
            if (!response.ok) {
                throw new Error('There is a problem. Please try again later.');
            }

            const plans = await response.json();
            tableBody.innerHTML = '';

            plans.forEach(plan => {
                const row = document.createElement('tr');
                row.className = 'ecors-row';

                const idCell = document.createElement('td');
                idCell.textContent = plan.id;
                idCell.className = 'ecors-id'; 
                
                const codeCell = document.createElement('td');
                codeCell.textContent = plan.plan_code;
                codeCell.className = 'ecors-planCode'; 
                
                const engCell = document.createElement('td');
                engCell.textContent = plan.name_eng;
                engCell.className = 'ecors-nameEng';
                
                const thaiCell = document.createElement('td');
                thaiCell.textContent = plan.name_th;
                thaiCell.className = 'ecors-nameTh';
                
                row.appendChild(idCell);
                row.appendChild(codeCell);
                row.appendChild(engCell);
                row.appendChild(thaiCell);

                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error('Error fetching study plans:', error.message);
            showError('There is a problem. Please try again later.');
        }
    }
    fetchStudyPlans();
});