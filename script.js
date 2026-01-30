// Data aplikasi
let state = {
    lists: [],
    currentListId: null,
    isLoggedIn: false
};

// DOM Elements
const loginPage = document.getElementById('login-page');
const homePage = document.getElementById('home-page');
const listPage = document.getElementById('list-page');
const listsContainer = document.getElementById('lists');
const itemsContainer = document.getElementById('items');
const newListInput = document.getElementById('new-list-input');
const addListBtn = document.getElementById('add-list-btn');
const newItemInput = document.getElementById('new-item-input');
const addItemBtn = document.getElementById('add-item-btn');
const backBtn = document.getElementById('back-btn');
const listTitle = document.getElementById('list-title');
const deleteListBtn = document.getElementById('delete-list-btn');
const emptyState = document.getElementById('empty-state');
const itemsEmptyState = document.getElementById('items-empty-state');
const toast = document.getElementById('toast');
const totalItemsEl = document.getElementById('total-items');
const completedItemsEl = document.getElementById('completed-items');
const progressPercentEl = document.getElementById('progress-percent');
const progressFill = document.getElementById('progress-fill');
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const createdDateEl = document.getElementById('created-date');
const updatedDateEl = document.getElementById('updated-date');
const completionRateEl = document.getElementById('completion-rate');
const rememberMe = document.getElementById('remember-me');

// Ikon untuk berbagai jenis list
const listIcons = ["💑", "❤️", "🎯", "✨", "🌟", "🎨", "🌸", "💎", "🎁", "🍿", "🎬", "✈️", "🌴", "🍽️", "🎵"];

// Kata kunci login
const PASSWORD = "sayangkamu";

// Inisialisasi aplikasi
function init() {
    loadData();
    checkLoginStatus();
    setupEventListeners();
    applyFilter('all');
}

// Cek status login
function checkLoginStatus() {
    const savedLogin = localStorage.getItem('dateListLoggedIn');
    const remember = localStorage.getItem('dateListRemember') === 'true';
    
    if (savedLogin === 'true' && remember) {
        state.isLoggedIn = true;
        showHomePage();
    } else {
        showLoginPage();
    }
}

// Muat data dari localStorage
function loadData() {
    const savedData = localStorage.getItem('dateListApp');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        state.lists = parsedData.lists || [];
        state.currentListId = parsedData.currentListId || null;
    }
}

// Simpan data ke localStorage
function saveData() {
    const dataToSave = {
        lists: state.lists,
        currentListId: state.currentListId
    };
    localStorage.setItem('dateListApp', JSON.stringify(dataToSave));
}

// Setup event listeners
function setupEventListeners() {
    // Login events
    loginBtn.addEventListener('click', handleLogin);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    
    // Logout event
    logoutBtn.addEventListener('click', handleLogout);
    
    // List events
    addListBtn.addEventListener('click', addNewList);
    newListInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addNewList();
    });
    
    // Item events
    addItemBtn.addEventListener('click', addNewItem);
    newItemInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addNewItem();
    });
    
    // Navigation events
    backBtn.addEventListener('click', goBackToHome);
    deleteListBtn.addEventListener('click', deleteCurrentList);
    
    // Filter events
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            applyFilter(this.textContent.toLowerCase());
        });
    });
}

// Handle login
function handleLogin() {
    const password = passwordInput.value.trim();
    const remember = rememberMe.checked;
    
    if (password === PASSWORD) {
        state.isLoggedIn = true;
        localStorage.setItem('dateListLoggedIn', 'true');
        localStorage.setItem('dateListRemember', remember.toString());
        showHomePage();
        passwordInput.value = '';
        showToast('Selamat datang di ruang spesial kita! 💕');
    } else {
        showToast('Kata sandi salah... coba ingat-ingat lagi sayang 😘');
        passwordInput.value = '';
        passwordInput.focus();
        
        // Animasi shake untuk input
        passwordInput.style.animation = 'none';
        setTimeout(() => {
            passwordInput.style.animation = 'shake 0.5s ease';
        }, 10);
    }
}

// Handle logout
function handleLogout() {
    if (confirm('Yakin mau keluar dari ruang spesial kita?')) {
        state.isLoggedIn = false;
        localStorage.removeItem('dateListLoggedIn');
        showLoginPage();
        showToast('Sampai jumpa lagi sayang! 😘');
    }
}

// Tampilkan halaman login
function showLoginPage() {
    loginPage.classList.add('active');
    homePage.classList.remove('active');
    listPage.classList.remove('active');
}

// Tampilkan halaman utama
function showHomePage() {
    loginPage.classList.remove('active');
    homePage.classList.add('active');
    listPage.classList.remove('active');
    renderHomePage();
}

// Terapkan filter
function applyFilter(filterType) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === filterType) {
            btn.classList.add('active');
        }
    });
    renderHomePage();
}

// Tambah list baru
function addNewList() {
    const listName = newListInput.value.trim();
    if (!listName) {
        showToast('Nama list tidak boleh kosong sayang! 💕');
        return;
    }
    
    // Buat list baru
    const newList = {
        id: Date.now().toString(),
        name: listName,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        icon: listIcons[Math.floor(Math.random() * listIcons.length)]
    };
    
    state.lists.push(newList);
    saveData();
    renderHomePage();
    newListInput.value = '';
    
    showToast(`Yeay! List "${listName}" berhasil dibuat!
