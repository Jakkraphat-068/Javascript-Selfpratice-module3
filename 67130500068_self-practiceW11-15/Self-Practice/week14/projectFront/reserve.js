import Keycloak from 'keycloak-js';

document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = 'http://localhost:3000/intproj25/sy3/itb-ecors/api/v1';
    // const TEAM_CODE = 'sy3'; 

    const keycloak = new Keycloak({
        url: "http://10.4.84.83:8080",
        realm: "itb-ecors",
        clientId: `itb-ecors-sy3`
    });
    window.keycloak = keycloak;

    const userInfoDiv = document.getElementById('user-info');
    const userFullnameSpan = document.querySelector('.ecors-fullname');
    const signOutButton = document.querySelector('.ecors-button-signout');
    const statusH2 = document.getElementById('declaration-status');
    const declareSection = document.getElementById('declare-section');
    const planDropdown = document.getElementById('study-plan-dropdown');
    const declareButton = document.getElementById('declare-button');
    const ecorsDialog = document.querySelector('.ecors-dialog');
    const ecorsDialogMessage = document.querySelector('.ecors-dialog-message');
    const dialogOkButton = document.querySelector('.ecors-button-dialog');

    let allStudyPlans = []; 
    let studentId = null;

    function showDialog(message) {
        ecorsDialogMessage.textContent = message;
        ecorsDialog.showModal();
    }
    dialogOkButton.addEventListener('click', () => ecorsDialog.close());

    async function fetchApi(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${keycloak.token}` 
        };
        const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });
        return response;
    }

    async function checkDeclarationStatus() {
        try {
            const plansResponse = await fetchApi('/study-plans');
            if (!plansResponse.ok) throw new Error('Failed to fetch study plans.');
            allStudyPlans = await plansResponse.json();

            const statusResponse = await fetchApi(`/students/${studentId}/declared-plan`);
            
            if (statusResponse.status === 200) {
                const data = await statusResponse.json();
                updateDeclarationStatus(data);
                hideDeclareSection();
            } else if (statusResponse.status === 404) {
                statusH2.textContent = "Declaration Status: Not Declared";
                showDeclareSection(); 
                populatePlanDropdown(); 
            } else {
                throw new Error('Failed to check declaration status.');
            }
        } catch (error) {
            console.error(error);
            showDialog("There is a problem. Please try again later.");
        }
    }

    function populatePlanDropdown() {
        planDropdown.innerHTML = '<option value="">-- Select Major --</option>';
        allStudyPlans.forEach(plan => {
            const option = document.createElement('option');
            option.value = plan.id;
            option.textContent = `${plan.plan_code} - ${plan.name_eng}`; 
            planDropdown.appendChild(option);
        });
    }

    async function declarePlan() {
        const selectedPlanId = planDropdown.value;
        if (!selectedPlanId) return;

        try {
            const response = await fetchApi(`/students/${studentId}/declared-plan`, {
                method: 'POST',
                body: JSON.stringify({ plan_id: parseInt(selectedPlanId) }) 
            });

            if (response.status === 201) {
                const data = await response.json();
                updateDeclarationStatus(data);
                hideDeclareSection();
            } else if (response.status === 409) {
                showDialog("You may have declared study plan already. Please check again.");
                checkDeclarationStatus();
            } else {
                throw new Error('Declaration failed.');
            }
        } catch (error) {
            console.error(error);
            showDialog("There is a problem. Please try again later.");
        }
    }

    function updateDeclarationStatus(data) {
        const declaredPlan = allStudyPlans.find(p => p.id === data.planId);
        if (!declaredPlan) return;

        const localUpdatedAt = new Date(data.updatedAt).toLocaleString(undefined, {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        });
        
        statusH2.textContent = `Declaration Status: Declared ${declaredPlan.plan_code} - ${declaredPlan.name_eng} plan on ${localUpdatedAt}`;
    }

    function showDeclareSection() {
        declareSection.style.display = 'block';
    }

    function hideDeclareSection() {
        declareSection.style.display = 'none';
    }

    planDropdown.addEventListener('change', () => {
        declareButton.disabled = !planDropdown.value; 
    });

    declareButton.addEventListener('click', declarePlan);


    async function initKeycloak() {
        try {
            // *** FIX: เปลี่ยน checkLoginIframe เป็น false เพื่อป้องกันปัญหาค้าง ***
            const authenticated = await keycloak.init({ onLoad: 'login-required', checkLoginIframe: false });
            
            if (authenticated) {
                studentId = keycloak.tokenParsed.preferred_username; 
                userFullnameSpan.textContent = `Welcome, ${keycloak.tokenParsed.name}`; 
                userInfoDiv.style.display = 'block';

                signOutButton.addEventListener('click', () => {
                    keycloak.logout({ redirectUri: window.location.origin + '/' }); 
                });

                // *** FIX: เรียก checkDeclarationStatus() ที่นี่หลังจาก studentId พร้อมใช้งาน ***
                await checkDeclarationStatus();
            }
        } catch (error) {
            console.error("Keycloak init failed:", error);
            showDialog("Could not initialize authentication. Please try again later.");
        }
    }

    initKeycloak();
});