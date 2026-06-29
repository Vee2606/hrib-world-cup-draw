const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTF3-As12GmoDflvrd17JuFb3kLuAo7ipwXf6bL6Bj3Kv-PENEC85i_Gc_HE5y2zIS7RymURSD6MAvg/pub?gid=0&single=true&output=csv"
async function loadTeams() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();

        const rows = data.split("\n").slice(1);

        const activeDiv = document.getElementById("activeTeams");
        const eliminatedDiv = document.getElementById("eliminatedTeams");

        activeDiv.innerHTML = "";
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

            if (cleanStatus === "in") {
                activeDiv.appendChild(card);
            } else {
                eliminatedDiv.appendChild(card);
            }
        });

        document.getElementById("lastUpdated").innerText =
            "Last updated: " + new Date().toLocaleTimeString();

    } catch (error) {
        console.log("Error loading sheet:", error);
    }
}

// run immediately
loadTeams();

// auto refresh every 10 seconds
setInterval(loadTeams, 10000);