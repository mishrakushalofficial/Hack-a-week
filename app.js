// State management
let currentUser = null
let currentSavingsMonth = 6 // July (0-indexed)
let currentExpensesMonth = 6 // July (0-indexed)

// Check if user is logged in on page load
window.addEventListener("DOMContentLoaded", () => {
  const storedUser = localStorage.getItem("smartpiggy_user")
  if (storedUser) {
    currentUser = JSON.parse(storedUser)
    // Redirect to dashboard if on login page
    if (window.location.pathname.includes("login.html")) {
      window.location.href = "dashboard.html"
    }

    // Load fresh data if on dashboard
    if (window.location.pathname.includes("dashboard.html")) {
      loadDashboardData()
    }
  } else {
    // Redirect to index if trying to access dashboard without login
    if (window.location.pathname.includes("dashboard.html")) {
      window.location.href = "login.html"
    }
  }

  // Update user name if on dashboard
  if (currentUser && document.getElementById("user-name")) {
    document.getElementById("user-name").textContent = currentUser.name
  }
})

// Toggle password visibility
function togglePassword() {
  const input = document.getElementById("login-password")
  input.type = input.type === "password" ? "text" : "password"
}

// BACKEND INTEGRATION STRUCTURE
// =============================================================================
// API Configuration (replace with your actual backend URL)
const API_BASE_URL = "/api" // Change this to your backend URL in production

// Dummy user database - will be replaced by actual backend
const DUMMY_USERS = {
  "demo-user-001": {
    id: "demo-user-001",
    email: "demo@smartpiggy.com",
    name: "Demo User",
    monthlyData: {
      savings: [
        {
          month: "Jan",
          amount: 8500,
          notes: {
            1000: { count: 3, total: 3000 },
            500: { count: 5, total: 2500 },
            200: { count: 4, total: 800 },
            100: { count: 10, total: 1000 },
            50: { count: 8, total: 400 },
            20: { count: 20, total: 400 },
            10: { count: 40, total: 400 },
          },
        },
        {
          month: "Feb",
          amount: 10200,
          notes: {
            1000: { count: 4, total: 4000 },
            500: { count: 6, total: 3000 },
            200: { count: 5, total: 1000 },
            100: { count: 12, total: 1200 },
            50: { count: 10, total: 500 },
            20: { count: 18, total: 360 },
            10: { count: 14, total: 140 },
          },
        },
        {
          month: "Mar",
          amount: 12400,
          notes: {
            1000: { count: 5, total: 5000 },
            500: { count: 8, total: 4000 },
            200: { count: 6, total: 1200 },
            100: { count: 15, total: 1500 },
            50: { count: 12, total: 600 },
            20: { count: 15, total: 300 },
            10: { count: 8, total: 80 },
          },
        },
        {
          month: "Apr",
          amount: 17000,
          notes: {
            1000: { count: 7, total: 7000 },
            500: { count: 10, total: 5000 },
            200: { count: 10, total: 2000 },
            100: { count: 20, total: 2000 },
            50: { count: 15, total: 750 },
            20: { count: 12, total: 240 },
            10: { count: 10, total: 100 },
          },
        },
        {
          month: "May",
          amount: 14600,
          notes: {
            1000: { count: 6, total: 6000 },
            500: { count: 9, total: 4500 },
            200: { count: 8, total: 1600 },
            100: { count: 18, total: 1800 },
            50: { count: 13, total: 650 },
            20: { count: 16, total: 320 },
            10: { count: 13, total: 130 },
          },
        },
        {
          month: "Jun",
          amount: 19000,
          notes: {
            1000: { count: 8, total: 8000 },
            500: { count: 11, total: 5500 },
            200: { count: 12, total: 2400 },
            100: { count: 22, total: 2200 },
            50: { count: 16, total: 800 },
            20: { count: 14, total: 280 },
            10: { count: 12, total: 120 },
          },
        },
        {
          month: "Jul",
          amount: 27050,
          notes: {
            1000: { count: 5, total: 5000 },
            500: { count: 12, total: 6000 },
            200: { count: 8, total: 1600 },
            100: { count: 25, total: 2500 },
            50: { count: 18, total: 900 },
            20: { count: 30, total: 600 },
            10: { count: 45, total: 450 },
          },
        },
        {
          month: "Aug",
          amount: 15800,
          notes: {
            1000: { count: 6, total: 6000 },
            500: { count: 10, total: 5000 },
            200: { count: 9, total: 1800 },
            100: { count: 20, total: 2000 },
            50: { count: 14, total: 700 },
            20: { count: 15, total: 300 },
            10: { count: 0, total: 0 },
          },
        },
        {
          month: "Sep",
          amount: 18200,
          notes: {
            1000: { count: 7, total: 7000 },
            500: { count: 11, total: 5500 },
            200: { count: 10, total: 2000 },
            100: { count: 22, total: 2200 },
            50: { count: 16, total: 800 },
            20: { count: 18, total: 360 },
            10: { count: 14, total: 140 },
          },
        },
        {
          month: "Oct",
          amount: 21500,
          notes: {
            1000: { count: 8, total: 8000 },
            500: { count: 13, total: 6500 },
            200: { count: 12, total: 2400 },
            100: { count: 28, total: 2800 },
            50: { count: 20, total: 1000 },
            20: { count: 20, total: 400 },
            10: { count: 20, total: 200 },
          },
        },
        {
          month: "Nov",
          amount: 13400,
          notes: {
            1000: { count: 5, total: 5000 },
            500: { count: 8, total: 4000 },
            200: { count: 7, total: 1400 },
            100: { count: 18, total: 1800 },
            50: { count: 12, total: 600 },
            20: { count: 16, total: 320 },
            10: { count: 14, total: 140 },
          },
        },
        {
          month: "Dec",
          amount: 25000,
          notes: {
            1000: { count: 10, total: 10000 },
            500: { count: 15, total: 7500 },
            200: { count: 13, total: 2600 },
            100: { count: 30, total: 3000 },
            50: { count: 22, total: 1100 },
            20: { count: 25, total: 500 },
            10: { count: 15, total: 150 },
          },
        },
      ],
      expenses: [
        {
          month: "Jan",
          amount: 13500,
          notes: {
            1000: { count: 5, total: 5000 },
            500: { count: 10, total: 5000 },
            200: { count: 8, total: 1600 },
            100: { count: 12, total: 1200 },
            50: { count: 8, total: 400 },
            20: { count: 15, total: 300 },
            10: { count: 0, total: 0 },
          },
        },
        {
          month: "Feb",
          amount: 11400,
          notes: {
            1000: { count: 4, total: 4000 },
            500: { count: 9, total: 4500 },
            200: { count: 7, total: 1400 },
            100: { count: 10, total: 1000 },
            50: { count: 6, total: 300 },
            20: { count: 10, total: 200 },
            10: { count: 0, total: 0 },
          },
        },
        {
          month: "Mar",
          amount: 10300,
          notes: {
            1000: { count: 3, total: 3000 },
            500: { count: 8, total: 4000 },
            200: { count: 6, total: 1200 },
            100: { count: 14, total: 1400 },
            50: { count: 10, total: 500 },
            20: { count: 10, total: 200 },
            10: { count: 0, total: 0 },
          },
        },
        {
          month: "Apr",
          amount: 15900,
          notes: {
            1000: { count: 6, total: 6000 },
            500: { count: 12, total: 6000 },
            200: { count: 10, total: 2000 },
            100: { count: 14, total: 1400 },
            50: { count: 8, total: 400 },
            20: { count: 5, total: 100 },
            10: { count: 0, total: 0 },
          },
        },
        {
          month: "May",
          amount: 8700,
          notes: {
            1000: { count: 2, total: 2000 },
            500: { count: 7, total: 3500 },
            200: { count: 5, total: 1000 },
            100: { count: 15, total: 1500 },
            50: { count: 12, total: 600 },
            20: { count: 5, total: 100 },
            10: { count: 0, total: 0 },
          },
        },
        {
          month: "Jun",
          amount: 7600,
          notes: {
            1000: { count: 2, total: 2000 },
            500: { count: 6, total: 3000 },
            200: { count: 5, total: 1000 },
            100: { count: 12, total: 1200 },
            50: { count: 6, total: 300 },
            20: { count: 5, total: 100 },
            10: { count: 0, total: 0 },
          },
        },
        {
          month: "Jul",
          amount: 10100,
          notes: {
            1000: { count: 3, total: 3000 },
            500: { count: 8, total: 4000 },
            200: { count: 4, total: 800 },
            100: { count: 15, total: 1500 },
            50: { count: 10, total: 500 },
            20: { count: 16, total: 320 },
            10: { count: 8, total: 80 },
          },
        },
        {
          month: "Aug",
          amount: 12300,
          notes: {
            1000: { count: 4, total: 4000 },
            500: { count: 9, total: 4500 },
            200: { count: 6, total: 1200 },
            100: { count: 16, total: 1600 },
            50: { count: 12, total: 600 },
            20: { count: 18, total: 360 },
            10: { count: 4, total: 40 },
          },
        },
        {
          month: "Sep",
          amount: 9800,
          notes: {
            1000: { count: 3, total: 3000 },
            500: { count: 7, total: 3500 },
            200: { count: 5, total: 1000 },
            100: { count: 13, total: 1300 },
            50: { count: 11, total: 550 },
            20: { count: 15, total: 300 },
            10: { count: 7, total: 70 },
          },
        },
        {
          month: "Oct",
          amount: 14200,
          notes: {
            1000: { count: 5, total: 5000 },
            500: { count: 10, total: 5000 },
            200: { count: 8, total: 1600 },
            100: { count: 17, total: 1700 },
            50: { count: 13, total: 650 },
            20: { count: 12, total: 240 },
            10: { count: 1, total: 10 },
          },
        },
        {
          month: "Nov",
          amount: 8900,
          notes: {
            1000: { count: 2, total: 2000 },
            500: { count: 7, total: 3500 },
            200: { count: 6, total: 1200 },
            100: { count: 14, total: 1400 },
            50: { count: 10, total: 500 },
            20: { count: 14, total: 280 },
            10: { count: 2, total: 20 },
          },
        },
        {
          month: "Dec",
          amount: 16500,
          notes: {
            1000: { count: 6, total: 6000 },
            500: { count: 11, total: 5500 },
            200: { count: 9, total: 1800 },
            100: { count: 19, total: 1900 },
            50: { count: 15, total: 750 },
            20: { count: 20, total: 400 },
            10: { count: 15, total: 150 },
          },
        },
      ],
    },
    notes: [
      { denomination: 1000, count: 5, total: 5000 },
      { denomination: 500, count: 12, total: 6000 },
      { denomination: 200, count: 8, total: 1600 },
      { denomination: 100, count: 25, total: 2500 },
      { denomination: 50, count: 18, total: 900 },
      { denomination: 20, count: 30, total: 600 },
      { denomination: 10, count: 45, total: 450 },
    ],
    stats: {
      thisMonth: 12450,
      goalProgress: 78,
      goalTarget: 15000,
      lastActivity: "2 hours ago",
      lastAmount: 500,
      streak: 12,
    },
  },
}

// Simulated API call for login
async function apiLogin(email, password) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/auth/login`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password })
  // });
  // return await response.json();

  // Dummy validation
  if (email === "demo@smartpiggy.com" && password === "demo123") {
    return {
      success: true,
      user: DUMMY_USERS["demo-user-001"],
    }
  } else {
    return {
      success: false,
      message: "Invalid credentials",
    }
  }
}

// Simulated API call for fetching user data
async function apiGetUserData(userId) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/users/${userId}/data`);
  // return await response.json();

  return DUMMY_USERS[userId] || null
}

// =============================================================================

function handleLogin(event) {
  event.preventDefault()

  const email = document.getElementById("login-email").value
  const password = document.getElementById("login-password").value
  const btnText = document.getElementById("login-btn-text")
  const messageEl = document.getElementById("login-message")

  btnText.innerHTML = "⏳ Signing in..."

  // Hide any previous messages
  messageEl.classList.remove("show", "error", "success")

  apiLogin(email, password).then((result) => {
    if (result.success) {
      currentUser = result.user
      localStorage.setItem("smartpiggy_user", JSON.stringify(currentUser))

      // Show success message
      messageEl.textContent = "✨ Welcome back! Redirecting to dashboard..."
      messageEl.classList.add("show", "success")

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "dashboard.html"
      }, 1000)
    } else {
      // Show error message
      messageEl.textContent = "❌ Invalid email or password. Please try: demo@smartpiggy.com / demo123"
      messageEl.classList.add("show", "error")
      btnText.innerHTML = "Sign In ✨"
    }
  })
}

// Handle logout
function handleLogout() {
  currentUser = null
  localStorage.removeItem("smartpiggy_user")
  window.location.href = "index.html"
}

// Toggle user menu dropdown
function toggleUserMenu() {
  const dropdown = document.getElementById("user-dropdown")
  dropdown.classList.toggle("show")
}

// Close dropdown when clicking outside
document.addEventListener("click", (event) => {
  const userMenu = document.querySelector(".user-menu")
  if (userMenu && !userMenu.contains(event.target)) {
    const dropdown = document.getElementById("user-dropdown")
    if (dropdown) {
      dropdown.classList.remove("show")
    }
  }
})

function switchGraph(view) {
  const btnSavings = document.getElementById("btn-savings")
  const btnExpenses = document.getElementById("btn-expenses")
  const subtitle = document.getElementById("graph-subtitle")
  const savingsView = document.getElementById("savings-view")
  const expensesView = document.getElementById("expenses-view")

  if (view === "savings") {
    // Show only savings
    savingsView.classList.remove("hidden")
    expensesView.classList.add("hidden")
    btnSavings.classList.add("active")
    btnExpenses.classList.remove("active")
    subtitle.textContent = "Savings by Note Type"
  } else if (view === "expenses") {
    // Show only expenses
    savingsView.classList.add("hidden")
    expensesView.classList.remove("hidden")
    btnSavings.classList.remove("active")
    btnExpenses.classList.add("active")
    subtitle.textContent = "Expenses by Note Type"
  }
}

function selectMonth(type, monthIndex) {
  if (!currentUser || !currentUser.monthlyData) return

  const monthData = currentUser.monthlyData[type][monthIndex]
  if (!monthData) return

  // Update current month index
  if (type === "savings") {
    currentSavingsMonth = monthIndex
  } else {
    currentExpensesMonth = monthIndex
  }

  // Update active button
  const monthSelector = document.querySelector(`#${type}-view .month-selector-enhanced`)
  if (monthSelector) {
    const buttons = monthSelector.querySelectorAll(".month-btn-enhanced")
    buttons.forEach((btn, idx) => {
      if (idx === monthIndex) {
        btn.classList.add("active")
      } else {
        btn.classList.remove("active")
      }
    })
  }

  // Update summary cards
  const monthLabel = document.getElementById(`${type}-month-label`)
  const total = document.getElementById(`${type}-total`)
  const noteCount = document.getElementById(`${type}-note-count`)

  if (monthLabel) monthLabel.textContent = `${monthData.month} ${type === "savings" ? "Savings" : "Expenses"}`
  if (total) total.textContent = `Rs.${monthData.amount.toLocaleString()}`

  // Calculate total note count
  const totalNotes = Object.values(monthData.notes).reduce((sum, note) => sum + note.count, 0)
  if (noteCount) noteCount.textContent = `${totalNotes} notes`

  // Find highest denomination
  const sortedNotes = Object.entries(monthData.notes).sort((a, b) => Number.parseInt(b[0]) - Number.parseInt(a[0]))
  const highestDenom = sortedNotes[0]
  const highestElement = document.getElementById(`${type}-highest`)
  const highestCountElement = document.getElementById(`${type}-highest-count`)

  if (highestElement) highestElement.textContent = `Rs.${highestDenom[0]}`
  if (highestCountElement) highestCountElement.textContent = `${highestDenom[1].count} notes`

  // Update bar chart
  updateNoteChart(type, monthData.notes)
}

function updateNoteChart(type, notes) {
  const chartId = `${type}-note-chart`
  const chart = document.getElementById(chartId)
  if (!chart) {
    console.log("Chart not found:", chartId)
    return
  }

  console.log("Updating chart for", type, "with notes:", notes)

  const noteColors = {
    10: "hsl(200, 100%, 50%)",
    20: "hsl(180, 100%, 50%)",
    50: "hsl(160, 100%, 40%)",
    100: "hsl(45, 100%, 50%)",
    200: "hsl(25, 100%, 50%)",
    500: "hsl(330, 100%, 60%)",
    1000: "hsl(270, 100%, 60%)",
  }

  // Determine max scale based on view type
  const maxScale = type === "savings" ? 12000 : 8000

  const denominations = [10, 20, 50, 100, 200, 500, 1000]
  const barGroups = chart.querySelectorAll(".bar-group-enhanced")

  console.log("Found bar groups:", barGroups.length)

  denominations.forEach((denom, idx) => {
    if (barGroups[idx] && notes[denom]) {
      const noteData = notes[denom]
      const bar = barGroups[idx].querySelector(".single-bar-enhanced")

      if (bar) {
        // Calculate height as percentage of the max scale
        const heightPercent = (noteData.total / maxScale) * 100
        const finalHeight = Math.max(heightPercent, 3)
        
        console.log(`Denom ${denom}: total=${noteData.total}, height=${finalHeight}%`)
        
        // Set height directly without !important
        bar.style.height = `${finalHeight}%`

        // Update tooltip
        if (noteData.total >= 1000) {
          bar.setAttribute("data-value", `Rs.${(noteData.total / 1000).toFixed(1)}k (${noteData.count} notes)`)
        } else {
          bar.setAttribute("data-value", `Rs.${noteData.total} (${noteData.count} notes)`)
        }
      }
    }
  })

  updateNoteCards(type, notes)
}

function updateNoteCards(type, notes) {
  const viewId = `${type}-view`
  const view = document.getElementById(viewId)
  if (!view) return

  const noteCards = view.querySelectorAll(".note-card")
  const denominations = [10, 20, 50, 100, 200, 500, 1000]

  denominations.forEach((denom, idx) => {
    if (noteCards[idx] && notes[denom]) {
      const countSpan = noteCards[idx].querySelector("span:last-child")
      if (countSpan) {
        countSpan.textContent = `${notes[denom].count} notes`
      }
    }
  })
}

async function loadDashboardData() {
  if (!currentUser) return

  // Fetch fresh data from backend
  const userData = await apiGetUserData(currentUser.id)

  if (userData) {
    // Update the stored user data
    currentUser = userData
    localStorage.setItem("smartpiggy_user", JSON.stringify(currentUser))

    // Load savings chart for current month
    const savingsData = userData.monthlyData.savings[currentSavingsMonth]
    selectMonth("savings", currentSavingsMonth)

    // Load expenses chart for current month
    const expensesData = userData.monthlyData.expenses[currentExpensesMonth]
    selectMonth("expenses", currentExpensesMonth)

    console.log("[v0] Dashboard data loaded and charts rendered for user:", currentUser.id)
  }
}