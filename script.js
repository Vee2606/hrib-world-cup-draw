const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTF3-As12GmoDflvrd17JuFb3kLuAo7ipwXf6bL6Bj3Kv-PENEC85i_Gc_HE5y2zIS7RymURSD6MAvg/pub?gid=0&single=true&output=csv";

const FIXTURES_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTF3-As12GmoDflvrd17JuFb3kLuAo7ipwXf6bL6Bj3Kv-PENEC85i_Gc_HE5y2zIS7RymURSD6MAvg/pub?gid=2099567374&single=true&output=csv";

async function loadTeams() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();

        const rows = data.split("\n").slice(1);

        const pendingDiv = document.getElementById("pendingTeams");
        const qualifiedDiv = document.getElementById("qualifiedTeams");
        const eliminatedDiv = document.getElementById("eliminatedTeams");

        pendingDiv.innerHTML = "";
        qualifiedDiv.innerHTML = "";
        eliminatedDiv.innerHTML = "";

        rows.forEach(row => {
            const cleanRow = row.replace(/\r/g, "").trim();
            if (!cleanRow) return;

            const [team, owner, status] = cleanRow.split(",");
            if (!team) return;

            const cleanStatus = (status || "").trim().toLowerCase();

            const card = document.createElement("div");
            card.classList.add("team", cleanStatus);

            card.innerHTML = `
                <div>
                    <div><strong>${team}</strong></div>
                    <div class="owner">👤 ${owner || ""}</div>
                </div>
                <div class="status ${cleanStatus}">
                    ${cleanStatus.toUpperCase()}
                </div>
            `;

            if (cleanStatus === "pending") {
                pendingDiv.appendChild(card);
            } else if (cleanStatus === "qualified") {
                qualifiedDiv.appendChild(card);
            } else {
                eliminatedDiv.appendChild(card);
            }
        });

        document.getElementById("lastUpdated").innerText =
            "Last updated: " + new Date().toLocaleTimeString();

    } catch (error) {
        console.log("Error loading teams:", error);
    }
}

async function loadFixtures() {
    try {
        const response = await fetch(FIXTURES_URL);
        const data = await response.text();

        const rows = data.split("\n").slice(1);

        const fixturesDiv = document.getElementById("fixtures");
        fixturesDiv.innerHTML = "";

        rows.forEach(row => {
            const cleanRow = row.replace(/\r/g, "").trim();
            if (!cleanRow) return;

            const [teamA, teamB, date, status] = cleanRow.split(",");
            if (!teamA || !teamB) return;

            const card = document.createElement("div");
            card.classList.add("team");

            card.innerHTML = `
                <div>
                    <div><strong>${teamA} vs ${teamB}</strong></div>
                    <div class="owner">📅 ${date || ""}</div>
                </div>
                <div class="status">
                    ${status || ""}
                </div>
            `;

            fixturesDiv.appendChild(card);
        });

    } catch (error) {
        console.log("Error loading fixtures:", error);
    }
}

// INITIAL LOAD
loadTeams();
loadFixtures();

// AUTO REFRESH EVERY 10 SECONDS
setInterval(() => {
    loadTeams();
    loadFixtures();
}, 10000);