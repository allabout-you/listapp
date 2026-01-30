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
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

// Ikon untuk berbagai jenis list
const listIcons = ["💙", "💗", "💑", "🌌", "🌠", "🎨", "🌸", "💎", "🌊", "🦋", "🌺", "🎆"];

// Kata kunci login
const PASSWORD = "sayangkamu";

// Inisialisasi aplikasi
function init() {
    loadData();
    checkLoginStatus();
    setupEventListeners();
}

// Cek status login
function checkLoginStatus() {
    const savedLogin = localStorage.getItem('dateListLoggedIn');
    if (savedLogin === 'true') {
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
}

// Handle login
function handleLogin() {
    const password = passwordInput.value.trim();
    
    if (password === PASSWORD) {
        state.isLoggedIn = true;
        localStorage.setItem('dateListLoggedIn', 'true');
        showHomePage();
        passwordInput.value = '';
        showToast('Selamat datang di ruang spesial kita! 💕');
    } else {
        showToast('Kata kunci salah... coba ingat-ingat lagi sayang 😘');
        passwordInput.value = '';
        passwordInput.focus();
        
        // Animasi shake untuk input
        passwordInput.style.animation = 'none';
        setTimeout(() => {
            passwordInput.style.animation = 'shake 0.5s ease';
        }, 10);
        
        // CSS untuk animasi shake
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);
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
        icon: listIcons[Math.floor(Math.random() * listIcons.length)]
    };
    
    state.lists.push(newList);
    saveData();
    renderHomePage();
    newListInput.value = '';
    
    showToast(`Yeay! List "${listName}" berhasil dibuat! 🎉`);
    newListInput.focus();
}

// Tambah item baru ke list saat ini
function addNewItem() {
    if (!state.currentListId) return;
    
    const itemText = newItemInput.value.trim();
    if (!itemText) {
        showToast('Item tidak boleh kosong sayang! 💕');
        return;
    }
    
    // Cari list saat ini
    const currentList = state.lists.find(list => list.id === state.currentListId);
    if (!currentList) return;
    
    // Tambah item baru
    const newItem = {
        id: Date.now().toString(),
        text: itemText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    currentList.items.push(newItem);
    saveData();
    renderListPage();
    newItemInput.value = '';
    
    showToast('Item berhasil ditambahkan! 💖');
    newItemInput.focus();
}

// Render halaman utama
function renderHomePage() {
    // Tampilkan/hide empty state
    if (state.lists.length === 0) {
        emptyState.style.display = 'block';
        listsContainer.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        listsContainer.style.display = 'block';
        
        // Render semua list
        listsContainer.innerHTML = '';
        state.lists.forEach(list => {
            const completedCount = list.items.filter(item => item.completed).length;
            const totalCount = list.items.length;
            
            const listElement = document.createElement('div');
            listElement.className = 'list-item';
            listElement.innerHTML = `
                <div class="list-icon">${list.icon}</div>
                <div class="list-content">
                    <div class="list-title">${list.name}</div>
                    <div class="list-count">${completedCount} dari ${totalCount} item selesai</div>
                </div>
                <i class="fas fa-chevron-right" style="color: var(--soft-blue);"></i>
            `;
            
            listElement.addEventListener('click', () => openList(list.id));
            listsContainer.appendChild(listElement);
        });
    }
}

// Buka halaman list
function openList(listId) {
    state.currentListId = listId;
    renderListPage();
    
    // Tampilkan halaman list
    loginPage.classList.remove('active');
    homePage.classList.remove('active');
    listPage.classList.add('active');
}

// Render halaman list
function renderListPage() {
    const currentList = state.lists.find(list => list.id === state.currentListId);
    if (!currentList) {
        goBackToHome();
        return;
    }
    
    // Set judul
    listTitle.textContent = currentList.name;
    
    // Tampilkan/hide empty state
    if (currentList.items.length === 0) {
        itemsEmptyState.style.display = 'block';
        itemsContainer.style.display = 'none';
    } else {
        itemsEmptyState.style.display = 'none';
        itemsContainer.style.display = 'block';
        
        // Render semua item
        itemsContainer.innerHTML = '';
        currentList.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'checklist-item';
            itemElement.innerHTML = `
                <div class="checkbox ${item.completed ? 'checked' : ''}"></div>
                <div class="item-text ${item.completed ? 'completed' : ''}">${item.text}</div>
                <button class="delete-item-btn"><i class="fas fa-times"></i></button>
            `;
            
            // Event listener untuk toggle completed
            const checkbox = itemElement.querySelector('.checkbox');
            const itemText = itemElement.querySelector('.item-text');
            const deleteBtn = itemElement.querySelector('.delete-item-btn');
            
            checkbox.addEventListener('click', () => {
                item.completed = !item.completed;
                checkbox.classList.toggle('checked');
                itemText.classList.toggle('completed');
                saveData();
                updateStats();
                showToast(item.completed ? 'Yeay! Item selesai! 🎉' : 'Item belum selesai');
            });
            
            // Event listener untuk hapus item
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteItem(item.id);
            });
            
            // Bisa juga klik seluruh item untuk toggle
            itemElement.addEventListener('click', (e) => {
                if (e.target !== deleteBtn && !deleteBtn.contains(e.target)) {
                    item.completed = !item.completed;
                    checkbox.classList.toggle('checked');
                    itemText.classList.toggle('completed');
                    saveData();
                    updateStats();
                    showToast(item.completed ? 'Yeay! Item selesai! 🎉' : 'Item belum selesai');
                }
            });
            
            itemsContainer.appendChild(itemElement);
        });
    }
    
    updateStats();
}

// Hapus item
function deleteItem(itemId) {
    const currentList = state.lists.find(list => list.id === state.currentListId);
    if (!currentList) return;
    
    currentList.items = currentList.items.filter(item => item.id !== itemId);
    saveData();
    renderListPage();
    showToast('Item berhasil dihapus!');
}

// Hapus list saat ini
function deleteCurrentList() {
    if (!state.currentListId) return;
    
    if (confirm('Apakah kamu yakin ingin menghapus list ini? Semua item di dalamnya juga akan terhapus.')) {
        const listName = state.lists.find(list => list.id === state.currentListId)?.name;
        state.lists = state.lists.filter(list => list.id !== state.currentListId);
        saveData();
        goBackToHome();
        showToast(`List "${listName}" berhasil dihapus!`);
    }
}

// Kembali ke halaman utama
function goBackToHome() {
    state.currentListId = null;
    showHomePage();
}

// Update statistik di halaman list
function updateStats() {
    const currentList = state.lists.find(list => list.id === state.currentListId);
    if (!currentList) return;
    
    const totalItems = currentList.items.length;
    const completedItems = currentList.items.filter(item => item.completed).length;
    const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    totalItemsEl.textContent = totalItems;
    completedItemsEl.textContent = completedItems;
    progressPercentEl.textContent = `${progressPercent}%`;
}

// Tampilkan toast notifikasi
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Inisialisasi aplikasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', init);

// Tidak ada contoh data awal - biarkan kosong
if (!state.lists || state.lists.length === 0) {
    state.lists = [];
    saveData();
}
