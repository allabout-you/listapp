// Fungsi untuk memformat tanggal
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Fungsi untuk memformat waktu
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Fungsi untuk menghitung progress
function calculateProgress(items) {
    if (!items || items.length === 0) return 0;
    const completed = items.filter(item => item.completed).length;
    return Math.round((completed / items.length) * 100);
}

// Fungsi untuk mendapatkan warna berdasarkan progress
function getProgressColor(progress) {
    if (progress >= 80) return '#4CAF50'; // Hijau
    if (progress >= 50) return '#FF9800'; // Oranye
    return '#FF5252'; // Merah
}
