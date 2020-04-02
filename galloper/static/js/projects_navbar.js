(function () {
    let projectsDropdown = document.getElementById("projects-dropdown");
    let projectsDropdownItems = document.getElementById("projects-dropdown-items");
    let selectedProjectTitle = document.getElementById("selected-project");
    let selectedProjectId = document.getElementById("selected-project-id");

    let navSecurityReport = document.getElementById("nav-security-report");
    let navSecurityThreshold = document.getElementById("nav-security-threshold");
    let navUIReport = document.getElementById("nav-ui-report");
    let navUIThreshold = document.getElementById("nav-ui-threshold");

    function processNavbarItems(dastEnabled, sastEnabled, performanceEnabled) {
        if (dastEnabled === true && sastEnabled === true) {
            navSecurityReport.style.display = "block";
            navSecurityThreshold.style.display = "block";
        } else {
            navSecurityReport.style.display = "none";
            navSecurityThreshold.style.display = "none";
        }
        navUIReport.style.display = performanceEnabled ? "block" : "none";
        navUIThreshold.style.display = performanceEnabled ? "block" : "none";
    }

    function fillSelectedProject(projectData) {
        if (projectData instanceof Object) {
            selectedProjectId.textContent = projectData.id;
            selectedProjectTitle.textContent = projectData.name;
        }
        sessionStorage.setItem("proj_dast_enabled", projectData.dast_enabled);
        sessionStorage.setItem("proj_sast_enabled", projectData.sast_enabled);
        sessionStorage.setItem("proj_performance_enabled", projectData.performance_enabled);
        processNavbarItems(projectData.dast_enabled, projectData.sast_enabled, projectData.performance_enabled)
    }

    function initProjectDropdown(projectData) {
        if (projectData === undefined) {
            fetch("/api/v1/project-session")
                .then(response => response.json())
                .then(fillSelectedProject)
                .catch(err => console.log("Fetch Error :-S", err));
        } else {
            fillSelectedProject(projectData)
        }
    }

    function selectSessionProject(projectData) {
        fetch(`/api/v1/project-session/${projectData.id}`, {method: "POST"})
            .then(response => response.json())
            .then(initProjectDropdown)
            .catch(err => console.log("Fetch Error :-S", err));
        window.location.reload();
        return false;
    }

    function fillDropdown() {
        while (projectsDropdownItems.firstChild) {
            projectsDropdownItems.removeChild(projectsDropdownItems.firstChild);
        }
        fetch("/api/v1/project")
            .then(response => response.json())
            .then(
                function (data) {
                    for (let projectData of data) {
                        let aElement = document.createElement("a");
                        aElement.setAttribute("class", "dropdown-item");
                        let spanElement = document.createElement("span");
                        let projectNameText = document.createTextNode(projectData.name);
                        spanElement.appendChild(projectNameText);
                        aElement.appendChild(spanElement);
                        aElement.addEventListener(
                            "click",
                            () => selectSessionProject(projectData), false
                        );
                        projectsDropdownItems.appendChild(aElement);
                    }
                }
            )
            .catch(err => console.log("Fetch Error :-S", err));
    }

    initProjectDropdown();

    projectsDropdown.addEventListener("click", fillDropdown, false);

    window.getSelectedProjectId = function () {
        return selectedProjectId.textContent
    };
    window.selectSessionProject = selectSessionProject;
})();
