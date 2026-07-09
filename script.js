const scores = [
  {
    player: "mrekk",
    title: "Dragonborn of Aim",
    map: "Save Me",
    artist: "Avenged Sevenfold",
    mods: "HDDT",
    accuracy: 99.18,
    pp: 1711.2,
    score: 128947220,
    mode: "osu"
  },
  {
    player: "akolibed",
    title: "Archmage of Speed",
    map: "Sidetracked Day",
    artist: "VINXIS",
    mods: "HDDT",
    accuracy: 98.92,
    pp: 1693.6,
    score: 121337880,
    mode: "osu"
  },
  {
    player: "Lifeline",
    title: "Blade of the North",
    map: "Through the Fire and Flames",
    artist: "DragonForce",
    mods: "HDDT",
    accuracy: 98.67,
    pp: 1584.4,
    score: 118672340,
    mode: "osu"
  },
  {
    player: "WhiteCat",
    title: "Silent Assassin",
    map: "Chronostasis",
    artist: "Silentroom",
    mods: "HDHR",
    accuracy: 99.41,
    pp: 1519.8,
    score: 109227650,
    mode: "osu"
  },
  {
    player: "Vaxei",
    title: "Greybeard of Consistency",
    map: "Yomi Yori",
    artist: "Imperial Circus Dead Decadence",
    mods: "HR",
    accuracy: 99.04,
    pp: 1468.9,
    score: 104881992,
    mode: "osu"
  }
];

const leaderboardRows = document.getElementById("leaderboardRows");
const searchInput = document.getElementById("searchInput");
const modeButtons = document.querySelectorAll(".mode-btn");

const championName = document.getElementById("championName");
const championPP = document.getElementById("championPP");
const highestPP = document.getElementById("highestPP");
const averageAccuracy = document.getElementById("averageAccuracy");
const totalScore = document.getElementById("totalScore");
const topMod = document.getElementById("topMod");
const shuffleThemeButton = document.getElementById("shuffleThemeButton");

let activeMode = "all";

function getTopFiveScores(data) {
  return [...data]
    .sort((a, b) => b.pp - a.pp)
    .slice(0, 5);
}

function formatNumber(number) {
  return new Intl.NumberFormat("en-US").format(number);
}

function getInitials(name) {
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function matchesSearch(score, searchTerm) {
  const combinedText = `
    ${score.player}
    ${score.title}
    ${score.map}
    ${score.artist}
    ${score.mods}
    ${score.mode}
  `.toLowerCase();

  return combinedText.includes(searchTerm.toLowerCase());
}

function getFilteredScores() {
  const searchTerm = searchInput.value.trim();

  return getTopFiveScores(scores).filter(score => {
    const modeMatches = activeMode === "all" || score.mode === activeMode;
    const searchMatches = matchesSearch(score, searchTerm);

    return modeMatches && searchMatches;
  });
}

function renderLeaderboard() {
  const filteredScores = getFilteredScores();

  leaderboardRows.innerHTML = "";

  if (filteredScores.length === 0) {
    leaderboardRows.innerHTML = `
      <div class="empty-state">
        No ancient records match your search.
      </div>
    `;
    return;
  }

  filteredScores.forEach((score, index) => {
    const row = document.createElement("article");
    row.className = "score-row";
    row.style.animationDelay = `${index * 90}ms`;

    row.innerHTML = `
      <div>
        <span class="rank-badge">#${index + 1}</span>
      </div>

      <div class="player">
        <span class="avatar">${getInitials(score.player)}</span>
        <span>
          <span class="player-name">${score.player}</span>
          <span class="player-title">${score.title}</span>
        </span>
      </div>

      <div>
        <span class="map-name">${score.map}</span>
        <span class="map-artist">${score.artist}</span>
      </div>

      <div>
        <span class="mod-pill">${score.mods}</span>
      </div>

      <div>
        ${score.accuracy.toFixed(2)}%
      </div>

      <div>
        <span class="pp-value">${score.pp.toFixed(1)}pp</span>
      </div>
    `;

    leaderboardRows.appendChild(row);
  });
}

function renderStats() {
  const topFive = getTopFiveScores(scores);
  const champion = topFive[0];

  const averageAcc =
    topFive.reduce((sum, score) => sum + score.accuracy, 0) / topFive.length;

  const scoreTotal =
    topFive.reduce((sum, score) => sum + score.score, 0);

  const modCounts = topFive.reduce((counts, score) => {
    counts[score.mods] = (counts[score.mods] || 0) + 1;
    return counts;
  }, {});

  const mostCommonMod = Object.entries(modCounts)
    .sort((a, b) => b[1] - a[1])[0][0];

  championName.textContent = champion.player;
  championPP.textContent = `${champion.pp.toFixed(1)}pp`;

  highestPP.textContent = `${champion.pp.toFixed(1)}pp`;
  averageAccuracy.textContent = `${averageAcc.toFixed(2)}%`;
  totalScore.textContent = formatNumber(scoreTotal);
  topMod.textContent = mostCommonMod;
}

function setupModeButtons() {
  modeButtons.forEach(button => {
    button.addEventListener("click", () => {
      modeButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      activeMode = button.dataset.mode;
      renderLeaderboard();
    });
  });
}

function setupSearch() {
  searchInput.addEventListener("input", renderLeaderboard);
}

function setupThemeButton() {
  shuffleThemeButton.addEventListener("click", () => {
    document.body.classList.toggle("rune-glow");
  });
}

function init() {
  renderStats();
  renderLeaderboard();
  setupModeButtons();
  setupSearch();
  setupThemeButton();
}

init();
