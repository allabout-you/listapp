// Data aplikasi
let state = {
    lists: [],
    currentListId: null
};

// DOM Elements
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

// Ikon untuk berbagai jenis list
const listIcons = ["💖", "🎬", "🍽️", "✈️", "🎯", "📝", "🎁", "📸", "🎵", "🌅", "🍿", "☕"];

// Inisialisasi aplikasi
function init() {
    loadData();
    renderHomePage();
    setupEventListeners();
}

// Muat data dari localStorage
function loadData() {
    const savedData = localStorage.getItem('dateListApp');
    if (savedData) {
        state = JSON.parse(savedData);
    }
}

// Simpan data ke localStorage
function saveData() {
    localStorage.setItem('dateListApp', JSON.stringify(state));
}

// Setup event listeners
function setupEventListeners() {
    addListBtn.addEventListener('click', addNewList);
    newListInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addNewList();
    });
    
    addItemBtn.addEventListener('click', addNewItem);
    newItemInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addNewItem();
    });
    
    backBtn.addEventListener('click', goBackToHome);
    deleteListBtn.addEventListener('click', deleteCurrentList);
}

// Tambah list baru
function addNewList() {
    const listName = newListInput.value.trim();
    if (!listName) {
        showToast('Nama list tidak boleh kosong!');
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
    
    showToast(`List "${listName}" berhasil dibuat!`);
}

// Tambah item baru ke list saat ini
function addNewItem() {
    if (!state.currentListId) return;
    
    const itemText = newItemInput.value.trim();
    if (!itemText) {
        showToast('Item tidak boleh kosong!');
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
    
    showToast('Item berhasil ditambahkan!');
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
                <i class="fas fa-chevron-right" style="color: var(--gray);"></i>
            `;
            
            listElement.addEventListener('click', () => openList(list.id));
            listsContainer.appendChild(listElement);
        });
    }
    
    // Tampilkan halaman utama
    homePage.classList.add('active');
    listPage.classList.remove('active');
}

// Buka halaman list
function openList(listId) {
    state.currentListId = listId;
    renderListPage();
    
    // Tampilkan halaman list
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
                showToast(item.completed ? 'Yeay! Item selesai!' : 'Item belum selesai');
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
                    showToast(item.completed ? 'Yeay! Item selesai!' : 'Item belum selesai');
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
        state.lists = state.lists.filter(list => list.id !== state.currentListId);
        saveData();
        goBackToHome();
        showToast('List berhasil dihapus!');
    }
}

// Kembali ke halaman utama
function goBackToHome() {
    state.currentListId = null;
    renderHomePage();
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

// Tambahkan beberapa contoh data jika kosong
if (!state.lists || state.lists.length === 0) {
    state.lists = [
        {
            id: '1',
            name: 'Date List 🎬',
            icon: '🎬',
            createdAt: new Date().toISOString(),
            items: [
                { id: '1', text: 'Nonton film romantis di bioskop 🍿', completed: false },
                { id: '2', text: 'Makan malam di rooftop restaurant 🍽️', completed: true },
                { id: '3', text: 'Jalan-jalan di pantai saat sunset 🌅', completed: false },
                { id: '4', text: 'Masak makan malam bersama 👩‍🍳', completed: false }
            ]
        },
        {
            id: '2',
            name: 'Wishlist 💝',
            icon: '💝',
            createdAt: new Date().toISOString(),
            items: [
                { id: '1', text: 'Staycation di hotel bagus 🏨', completed: false },
                { id: '2', text: 'Naik hot air balloon 🎈', completed: false },
                { id: '3', text: 'Liburan ke Bali ✈️', completed: true }
            ]
        },
        {
            id: '3',
            name: 'Couple Goals 👫',
            icon: '👫',
            createdAt: new Date().toISOString(),
            items: [
                { id: '1', text: 'Foto prewedding 📸', completed: false },
                { id: '2', text: 'Belajar dansa bersama 💃', completed: false },
                { id: '3', text: 'Bikin scrapbook kenangan kita 📔', completed: true }
            ]
        }
    ];
    saveData();
}