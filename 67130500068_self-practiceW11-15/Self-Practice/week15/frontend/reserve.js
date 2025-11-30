import Keycloak from "keycloak-js";

document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = "/intproj25/sy3/itb-ecors/api/v1";

    const keycloak = new Keycloak({
        url: "https://bscit.sit.kmutt.ac.th/intproj25/ft/keycloak/",
        realm: "itb-ecors",
        clientId: "itb-ecors-sy3",
    });
    window.keycloak = keycloak;

    const userInfoDiv = document.getElementById("user-info");
    const userFullname = document.querySelector(".ecors-fullname");
    const signOutBtn = document.querySelector(".ecors-button-signout");

    const statusH2 = document.getElementById("declaration-status");
    const declareSection = document.getElementById("declare-section");

    const dropdown = document.getElementById("study-plan-dropdown");
    const declareBtn = document.getElementById("declare-button");
    
    const changeBtn = document.getElementById("change-button");
    const cancelBtn = document.getElementById("cancel-button");

    const dialog = document.querySelector(".ecors-dialog");
    const dialogMsg = document.querySelector(".ecors-dialog-message");
    const dialogButtons = document.querySelector(".dialog-buttons");
    
    let studentId = null;
    let allPlans = [];
    let currentDeclaration = null;

    function formatDate(dateString) {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const formatted = new Date(dateString).toLocaleString('en-GB', { 
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
        return `${formatted} (${userTimezone})`;
    }

    function showDialog(msg, mode = 'alert', onConfirm = null) {
        dialogMsg.textContent = msg;
        dialogButtons.innerHTML = ''; 

        if (mode === 'confirm') {            
            const confirmCancelBtn = document.createElement("button");
            confirmCancelBtn.textContent = "Cancel Declaration"; 
            confirmCancelBtn.classList.add("ecors-button-cancel"); 
            confirmCancelBtn.style.marginRight = "10px";
            confirmCancelBtn.onclick = () => {
                dialog.close();
                if(onConfirm) onConfirm();
            };

            const keepBtn = document.createElement("button");
            keepBtn.textContent = "Keep Declaration";
            keepBtn.classList.add("ecors-button-keep"); 
            keepBtn.onclick = () => dialog.close();

            dialogButtons.appendChild(confirmCancelBtn);
            dialogButtons.appendChild(keepBtn);

        } else {            
            const okBtn = document.createElement("button");
            okBtn.textContent = "Ok";
            okBtn.classList.add("ecors-button-dialog"); 
            okBtn.onclick = () => dialog.close();
            dialogButtons.appendChild(okBtn);
        }
        dialog.showModal();
    }

    async function api(url, options = {}) {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keycloak.token}`,
        };
        const res = await fetch(API_BASE_URL + url, { ...options, headers });
        return res;
    }

    async function loadStatus() {
        try {
            if (allPlans.length === 0) {
                const planRes = await api("/study-plans");
                allPlans = await planRes.json();
                
                dropdown.innerHTML = '<option value="">-- Select Major --</option>';
                allPlans.forEach((p) => {
                    const opt = document.createElement("option");
                    opt.value = p.id;
                    opt.classList.add("ecors-plan-row");
                    opt.textContent = `${p.planCode} - ${p.nameEng}`;
                    dropdown.appendChild(opt);
                });
            }

            const declareRes = await api(`/students/${studentId}/declared-plan`);

            if (declareRes.status === 404) {
                currentDeclaration = null;
                updateUI_NotDeclared();
                return;
            }

            if (!declareRes.ok) throw new Error("Error loading status");

            const data = await declareRes.json();
            currentDeclaration = data;
            
            if (data.status === 'CANCELLED') {
                updateUI_Cancelled(data);
            } else {
                updateUI_Declared(data);
            }

        } catch (err) {
            console.error(err);
            showDialog("There is a problem. Please try again later.");
        }
    }

    function updateUI_NotDeclared(msg = "Declaration Status: Not Declared") {
        statusH2.textContent = msg;
        declareSection.style.display = "block";
        dropdown.value = "";
        dropdown.disabled = false;
        
        declareBtn.style.display = "inline-block";
        declareBtn.disabled = true;

        changeBtn.style.display = "none";
        cancelBtn.style.display = "none";
    }

    function updateUI_Declared(data) {
        const plan = allPlans.find((p) => p.id === data.planId);
        if (!plan) return;

        statusH2.textContent = `Declaration Status: Declared ${plan.planCode} - ${plan.nameEng} plan on ${formatDate(data.updatedAt)}`;
        declareSection.style.display = "block";

        dropdown.value = plan.id;
        dropdown.disabled = false;

        declareBtn.style.display = "none";
        
        changeBtn.style.display = "inline-block";
        changeBtn.disabled = true; 
        cancelBtn.style.display = "inline-block";
    }

    function updateUI_Cancelled(data) {
        const plan = allPlans.find((p) => p.id === data.planId);
        statusH2.textContent = `Declaration Status: Cancelled ${plan ? plan.planCode + ' - ' + plan.nameEng : 'Unknown'} plan on ${formatDate(data.updatedAt)}`;
        
        declareSection.style.display = "block";
        dropdown.value = "";
        dropdown.disabled = false;
        
        declareBtn.style.display = "inline-block";
        declareBtn.disabled = true;

        changeBtn.style.display = "none";
        cancelBtn.style.display = "none";
    }

    async function declarePlan() {
        const planId = dropdown.value;
        if (!planId) return;

        try {
            const res = await api(`/students/${studentId}/declared-plan`, {
                method: "POST",
                body: JSON.stringify({ planId: parseInt(planId) }),
            });

            if (res.status === 409) {
                 showDialog("You may have declared study plan already. Please check again.");
                 await loadStatus();
                 return;
            }

            if (!res.ok) throw new Error("Declaration failed");

            const json = await res.json();
            currentDeclaration = json;
            updateUI_Declared(json);
        } catch (err) {
            console.error(err);
            showDialog("There is a problem. Please try again later.");
        }
    }

    async function changePlan() {
        const planId = dropdown.value;
        if (!planId) return;

        try {
            const res = await api(`/students/${studentId}/declared-plan`, {
                method: "PUT",
                body: JSON.stringify({ planId: parseInt(planId) }),
            });

            if (res.status === 404) {
                const err = await res.json();
                showDialog(err.message || "No declared plan found.");
                updateUI_NotDeclared();
                return;
            }
            
            if (res.status === 409) {
                const err = await res.json();
                showDialog(err.message);
                await loadStatus();
                return;
            }

            if (!res.ok) throw new Error("Change failed");

            const json = await res.json();
            currentDeclaration = json;
            showDialog("Declaration updated.");
            updateUI_Declared(json);

        } catch (err) {
            console.error(err);
            showDialog("There is a problem. Please try again later.");
        }
    }

    function confirmCancel() {
        if (!currentDeclaration) return;
        const plan = allPlans.find(p => p.id === currentDeclaration.planId);
        
        const msg = `You have declared ${plan.planCode} - ${plan.nameEng} as your plan on ${formatDate(currentDeclaration.updatedAt)}. Are you sure you want to cancel this declaration?`;

        showDialog(msg, 'confirm', async () => {
            try {
                const res = await api(`/students/${studentId}/declared-plan`, {
                    method: "DELETE"
                });

                if (res.status === 404) {
                    const err = await res.json();
                    showDialog(err.message);
                    updateUI_NotDeclared();
                    return;
                }
                
                if (res.status === 409) {
                    const err = await res.json();
                    showDialog(err.message);
                    await loadStatus();
                    return;
                }

                if (res.status === 200) {
                    const json = await res.json();
                    currentDeclaration = json;
                    showDialog("Declaration cancelled.");
                    updateUI_Cancelled(json);
                } else if (res.status === 204) {
                    showDialog("Declaration cancelled.");
                    updateUI_NotDeclared();
                } else {
                    throw new Error("Cancel failed");
                }

            } catch (err) {
                console.error(err);
                showDialog("There is a problem. Please try again later.");
            }
        });
    }

    dropdown.addEventListener("change", () => {
        const val = dropdown.value;
        
        if (!currentDeclaration || currentDeclaration.status === 'CANCELLED') {
             declareBtn.disabled = !val;
        } else {
             if (!val || parseInt(val) === currentDeclaration.planId) {
                 changeBtn.disabled = true;
             } else {
                 changeBtn.disabled = false;
             }
        }
    });

    declareBtn.addEventListener("click", declarePlan);
    changeBtn.addEventListener("click", changePlan);
    cancelBtn.addEventListener("click", confirmCancel);

    async function initAuth() {
        try {
            const auth = await keycloak.init({
                onLoad: "login-required",
                checkLoginIframe: false,
            });

            if (!auth) return;

            studentId = keycloak.tokenParsed.preferred_username;
            userFullname.textContent = `Welcome, ${keycloak.tokenParsed.name}`;
            userInfoDiv.style.display = "flex";

            signOutBtn.addEventListener("click", () => {
                keycloak.logout({ redirectUri: window.location.origin + "/intproj25/sy3/itb-ecors/" });
            });

            await loadStatus();
        } catch (err) {
            console.error(err);
            showDialog("Could not initialize authentication.");
        }
    }

    initAuth();
});
