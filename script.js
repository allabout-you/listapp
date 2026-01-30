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

// Fungsi untuk inisialisasi toggle password di semua input password
function initializePasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password-btn');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input[type="password"], input[type="text"]');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.setAttribute('title', 'Sembunyikan password');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.setAttribute('title', 'Lihat password');
            }
            
            // Fokus kembali ke input setelah toggle
            input.focus();
        });
    });
}

// Panggil fungsi ini saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    initializePasswordToggles();
});
