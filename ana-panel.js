// --- State ---
let userSettings = {
    name: 'Mehmet Atakan Şahin',
    email: '',
    phone: '',
    notifications: ['email', 'push']
};

let appointments = [
    // Örnek veri, normalde backend'den veya localstorage'dan gelir
    { id: Date.now() + 1, hospital: 'Şehir Hastanesi', department: 'Dahiliye Kontrolü', doctor: 'Dr. Mehmet Yılmaz', date: '2025-05-28', time: '10:30', status: 'Onaylandı' },
    { id: Date.now() + 2, hospital: 'Şehir Hastanesi', department: 'Kan Tahlili', doctor: 'Merkez Laboratuvarı', date: '2025-06-03', time: '14:15', status: 'Onaylandı' }
];

let medications = [
    // Örnek veri
    { id: Date.now() + 3, name: 'Aspirin', dose: '100mg', schedules: [{ period: 'sabah', time: '08:30' }, { period: 'akşam', time: '20:30' }] }
];

let reports = [
    // Örnek veri
    { id: Date.now() + 4, type: 'Kan Tahlili', doctor: 'Dr. Ayşe Kaya', date: '2025-02-15', status: 'Normal', fileName: 'kan_tahlili_20250215.pdf', fileUrl: 'img/doktor-raporu.jpg' },
    { id: Date.now() + 5, type: 'Kardiyoloji Raporu', doctor: 'Dr. Mehmet Demir', date: '2025-01-02', status: 'Takip Gerekli', fileName: 'kardiyo_rapor_20250102.pdf', fileUrl: 'img/doktor-raporu.jpg' },
    { id: Date.now() + 6, type: 'Genel Sağlık Kontrolü', doctor: 'Dr. Zeynep Yıldız', date: '2025-04-10', status: 'İyileşiyor', fileName: 'genel_kontrol_20250410.pdf', fileUrl: 'img/doktor-raporu.jpg' }
];

let healthHistory = [
    // Örnek veri
    { id: Date.now() + 7, date: '15 Şubat 2025', hospital: 'Ankara Şehir Hastanesi', department: 'Kardiyoloji', doctor: 'Dr. Mehmet Demir', type: 'Rutin Kontrol' },
    { id: Date.now() + 8, date: '3 Nisan 2025', hospital: 'Gazi Üniversitesi Hastanesi', department: 'Dahiliye', doctor: 'Dr. Ayşe Yılmaz', type: 'Genel Muayene' },
    { id: Date.now() + 9, date: '12 Mart 2025', hospital: 'Özel Medical Park', department: 'Ortopedi', doctor: 'Dr. Ali Kaya', type: 'Fizik Tedavi' }
];

let currentSection = 'homePage'; // Aktif bölümü takip etmek için

// --- Selectors (Sık Kullanılan Elemanlar) ---
const mainContent = document.getElementById('mainContent');
const sideNav = document.querySelector('.side-nav');
const userNameDisplay = document.getElementById('userNameDisplay');
const currentDateElement = document.getElementById('currentDate');

// Bölüm Konteynerları
const sections = {
    homePage: document.getElementById('homePage'),
    healthHistory: document.getElementById('healthHistory'),
    medications: document.getElementById('medications'),
    appointments: document.getElementById('appointments'),
    reports: document.getElementById('reports')
};

// Liste Konteynerları
const homeAppointmentsList = document.getElementById('homeAppointmentsList');
const homeMedicationsList = document.getElementById('homeMedicationsList');
const appointmentsListContainer = document.getElementById('appointmentsList');
const medicationsListContainer = document.getElementById('medicationsList');
const reportsTableBody = document.getElementById('reportsTableBody');
const healthHistoryListContainer = document.getElementById('healthHistoryList');
const medicationRemindersContainer = document.getElementById('medicationReminders');
const emptyReminderState = document.getElementById('emptyReminderState');

// Formlar
const addAppointmentForm = document.getElementById('addAppointmentForm');
const addMedForm = document.getElementById('addMedForm');
const addReportForm = document.getElementById('addReportForm');
const settingsForm = document.getElementById('settingsForm');

// Butonlar
const addMedBtn = document.getElementById('addMedBtn');
const addReportBtn = document.getElementById('addReportBtn');
const settingsBtn = document.getElementById('settingsBtn');
const logoutBtn = document.getElementById('logoutBtn');
const mhrsBtn = document.getElementById('mhrsBtn');

// Modallar
const addMedModal = document.getElementById('addMedModal');
const settingsModal = document.getElementById('settingsModal');
const reportViewModal = document.getElementById('reportViewModal');
const addReportModal = document.getElementById('addReportModal');

// AI Chat Elemanları
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const micButton = document.getElementById('micButton');

// Bildirim Konteyneri
const notificationContainer = document.getElementById('notificationContainer');

// --- Rendering Functions ---

function renderAppointments() {
    // Ana Randevularım Sayfası
    appointmentsListContainer.innerHTML = ''; // Konteyneri temizle
    if (appointments.length === 0) {
        appointmentsListContainer.innerHTML = '<p>Kayıtlı randevu bulunamadı.</p>';
    } else {
        appointments.forEach(app => {
            const appDate = new Date(app.date);
            const dateString = !isNaN(appDate) ? appDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Geçersiz Tarih';
            const appHtml = `
                <div class="appointment-item">
                    <div class="appointment-time">
                        <span class="time">${app.time}</span>
                        <span class="date">${dateString}</span>
                    </div>
                    <div class="appointment-details">
                        <h3>${app.department}</h3>
                        <p>${app.doctor} - ${app.hospital}</p>
                    </div>
                    <div class="appointment-status ${app.status === 'Onaylandı' ? 'confirmed' : ''}">
                        <span>${app.status}</span>
                    </div>
                     </div>
            `;
            appointmentsListContainer.insertAdjacentHTML('beforeend', appHtml);
        });
    }

    // Ana Sayfa Önizlemesi (Yaklaşan ilk 2)
    homeAppointmentsList.innerHTML = '';
    const upcomingAppointments = appointments
        .filter(app => new Date(app.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 2); // İlk 2 yaklaşan randevu

    if (upcomingAppointments.length === 0) {
        homeAppointmentsList.innerHTML = '<p>Yaklaşan randevu bulunamadı.</p>';
    } else {
        upcomingAppointments.forEach(app => {
             const appDate = new Date(app.date);
             const dateString = !isNaN(appDate) ? appDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) : 'Geçersiz Tarih';
            const appHtml = `
                <div class="appointment-item">
                     <div class="appointment-time">
                         <span class="time">${app.time}</span>
                         <span class="date">${dateString}</span>
                     </div>
                     <div class="appointment-details">
                         <h3>${app.department}</h3>
                         <p>${app.doctor} - ${app.hospital}</p>
                     </div>
                     <div class="appointment-status confirmed">
                         <span>${app.status}</span>
                     </div>
                </div>
            `;
            homeAppointmentsList.insertAdjacentHTML('beforeend', appHtml);
        });
    }
}

function renderMedications() {
    // Ana İlaçlarım Sayfası
    medicationsListContainer.innerHTML = ''; // Temizle
    if (medications.length === 0) {
        medicationsListContainer.innerHTML = '<p>Kayıtlı ilaç bulunamadı.</p>';
    } else {
        medications.forEach(med => {
            const schedulesHtml = med.schedules.map(s =>
                `<span class="schedule-badge">${capitalizeFirstLetter(s.period)}: ${s.time || 'Belirtilmemiş'}</span>`
            ).join('');
            const medHtml = `
                <div class="med-card">
                    <div class="med-info">
                        <i class="fas fa-pills med-icon"></i>
                        <div class="med-details">
                            <h3>${med.name}</h3>
                            <p>${med.dose}</p>
                            <div class="med-schedule">
                                ${schedulesHtml}
                            </div>
                        </div>
                        <button class="delete-med-btn" data-id="${med.id}" title="İlacı Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            medicationsListContainer.insertAdjacentHTML('beforeend', medHtml);
        });
    }

    // Ana Sayfa Önizlemesi (İlk 2)
    homeMedicationsList.innerHTML = '';
    const homeMeds = medications.slice(0, 2);
    if (homeMeds.length === 0) {
        homeMedicationsList.innerHTML = '<p>İlaç bulunamadı.</p>';
    } else {
        homeMeds.forEach(med => {
            const schedulesHtml = med.schedules.map(s =>
                `<span class="schedule-badge">${capitalizeFirstLetter(s.period)}: ${s.time || 'Belirtilmemiş'}</span>`
            ).join('');
            const medHtml = `
                <div class="med-card">
                    <div class="med-info">
                        <i class="fas fa-pills med-icon"></i>
                        <div class="med-details">
                            <h3>${med.name}</h3>
                            <p>${med.dose}</p>
                            <div class="med-schedule">
                                ${schedulesHtml}
                            </div>
                        </div>
                        </div>
                </div>
            `;
            homeMedicationsList.insertAdjacentHTML('beforeend', medHtml);
        });
    }

    // Hatırlatıcıları güncelle
    updateMedicationReminders();
}


function renderReports() {
    reportsTableBody.innerHTML = ''; // Temizle
    if (reports.length === 0) {
        reportsTableBody.innerHTML = '<tr><td colspan="5">Rapor bulunamadı.</td></tr>';
    } else {
        reports.forEach(report => {
            const reportDate = new Date(report.date);
             const dateString = !isNaN(reportDate) ? reportDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Geçersiz Tarih';
            // Duruma göre badge class'ı belirle
            let statusClass = 'stable'; // default
            if (report.status === 'Takip Gerekli') statusClass = 'warning';
            else if (report.status === 'İyileşiyor') statusClass = 'improving';

            const reportHtml = `
                <tr>
                    <td>
                        <div class="patient-info">
                            <i class="fas fa-file-medical document-icon"></i>
                            <div>
                                <h4>${report.type}</h4>
                                <span>${report.fileName || 'Dosya Adı Yok'}</span> </div>
                        </div>
                    </td>
                    <td>${dateString}</td>
                    <td>${report.doctor}</td>
                    <td><span class="status-badge ${statusClass}">${report.status}</span></td>
                    <td>
                        <button class="table-action-btn view-report-btn" data-id="${report.id}" title="Raporu Görüntüle">
                            <i class="fas fa-eye"></i>
                        </button>
                         </td>
                </tr>
            `;
            reportsTableBody.insertAdjacentHTML('beforeend', reportHtml);
        });
    }
}

function renderHealthHistory() {
    healthHistoryListContainer.innerHTML = ''; // Temizle
    if (healthHistory.length === 0) {
        healthHistoryListContainer.innerHTML = '<p>Sağlık geçmişi bulunamadı.</p>';
    } else {
        healthHistory.forEach(visit => {
             const visitDate = new Date(visit.date);
             const dateString = !isNaN(visitDate) ? visitDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : visit.date; // Fallback
            const visitHtml = `
                <div class="visit-item">
                    <div class="visit-date">${dateString}</div>
                    <div class="visit-details">
                        <h3>${visit.hospital}</h3>
                        <p>${visit.department} - ${visit.doctor}</p>
                        <span class="visit-type">${visit.type}</span>
                    </div>
                </div>
            `;
            healthHistoryListContainer.insertAdjacentHTML('beforeend', visitHtml);
        });
    }
}

function updateHealthSummary() {
    document.getElementById('summaryAppointmentsDesc').textContent = appointments.length > 0
        ? `Toplam ${appointments.length} randevunuz bulunuyor.`
        : 'Kayıtlı randevunuz bulunmuyor.';

    document.getElementById('summaryReportsDesc').textContent = reports.length > 0
        ? `Görüntüleyebileceğiniz ${reports.length} raporunuz bulunuyor.`
        : 'Henüz rapor bulunmuyor.';

    // Genel sağlık durumu için daha karmaşık bir mantık gerekebilir, şimdilik statik
    document.getElementById('summaryStatusDesc').textContent = 'Son kontrollerinize göre genel sağlık durumunuz iyi görünüyor.';
}

function updateCurrentDate() {
    const options = { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' };
    const todayString = new Date().toLocaleDateString('tr-TR', options);
    if (currentDateElement) {
        currentDateElement.textContent = todayString;
    }
}

// --- Modal Handling ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error(`Modal with ID "${modalId}" not found.`);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error(`Modal with ID "${modalId}" not found.`);
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// --- Data Handling Functions ---

function addAppointmentHandler(event) {
    event.preventDefault();
    const formData = new FormData(addAppointmentForm);
    const newAppointment = {
        id: Date.now(), // Benzersiz ID
        hospital: formData.get('hospital'),
        department: formData.get('department'),
        doctor: formData.get('doctor'),
        date: formData.get('appDate'),
        time: formData.get('appTime'),
        status: 'Onaylandı' // Varsayılan durum
    };

    appointments.push(newAppointment);
    renderAppointments();
    updateHealthSummary();
    addAppointmentForm.reset();
    showNotification('Başarılı', 'Randevu başarıyla eklendi.');
}

function addMedicationHandler(event) {
    event.preventDefault();
    const name = document.getElementById('medName').value;
    const dose = document.getElementById('medDose').value;
    const schedules = [];
    document.querySelectorAll('#addMedForm input[name="schedule"]:checked').forEach(checkbox => {
        const period = checkbox.value;
        const timeInput = document.querySelector(`#addMedForm input[name="${period}Time"]`);
        schedules.push({ period: period, time: timeInput ? timeInput.value : null });
    });

    if (schedules.length === 0) {
        showNotification('Hata', 'En az bir kullanım zamanı seçmelisiniz.');
        return;
    }

    const newMedication = {
        id: Date.now(),
        name: name,
        dose: dose,
        schedules: schedules
    };

    medications.push(newMedication);
    renderMedications();
    updateHealthSummary(); // İlaç sayısı değiştiği için özet güncellenebilir
    closeModal('addMedModal');
    addMedForm.reset();
     // Checkbox'a bağlı time inputlarını tekrar disable et
    document.querySelectorAll('#addMedForm .schedule-time').forEach(input => input.disabled = true);
    showNotification('Başarılı', 'İlaç başarıyla eklendi.');
}

function deleteMedicationHandler(medId) {
    const idToDelete = parseInt(medId);
    if (confirm('Bu ilacı silmek istediğinizden emin misiniz?')) {
        medications = medications.filter(med => med.id !== idToDelete);
        renderMedications();
        updateHealthSummary(); // İlaç sayısı değiştiği için özet güncellenebilir
        showNotification('Bilgi', 'İlaç silindi.');
    }
}

function addReportHandler(event) {
    event.preventDefault();
    const reportTypeInput = document.getElementById('reportType');
    const reportDoctorInput = document.getElementById('reportDoctor');
    const reportDateInput = document.getElementById('reportDate');
    const reportStatusInput = document.getElementById('reportStatus');
    const reportFileInput = document.getElementById('reportFile');
    const reportFile = reportFileInput.files[0];

    if (!reportFile) {
        showNotification('Hata', 'Lütfen bir rapor dosyası seçin.');
        return false;
    }

     // Dosya doğrulama (opsiyonel ama önerilir)
    if (!validateFile(reportFile)) {
         return false; // Hata mesajı validateFile içinde gösterildi varsayılıyor
    }


    // !!! GERÇEK DOSYA YÜKLEME BURADA YAPILMALI (Backend Gerekir) !!!
    // Simülasyon: Sadece dosya adı ve bilgileri alınıyor
    console.log('Dosya Yükleme:', reportFile.name);
    showNotification('Bilgi', `${reportFile.name} yükleniyor...`);


    // Simülasyon sonrası (veya gerçek yükleme sonrası) state'e ekle
    setTimeout(() => { // Yükleme süresi simülasyonu
        const newReport = {
            id: Date.now(),
            type: reportTypeInput.value,
            doctor: reportDoctorInput.value,
            date: reportDateInput.value,
            status: reportStatusInput.value,
            fileName: reportFile.name,
            fileUrl: 'img/doktor-raporu.jpg' // !!! Gerçek URL backend'den gelmeli
        };

        reports.push(newReport);
        renderReports();
        updateHealthSummary();
        closeModal('addReportModal');
        addReportForm.reset();
        document.getElementById('addReportFileInfo').textContent = ''; // Dosya bilgisi temizle
        showNotification('Başarılı', 'Rapor başarıyla eklendi.');

    }, 1500); // 1.5 saniye bekleme

}

function viewReportHandler(reportId) {
     const idToView = parseInt(reportId);
    const report = reports.find(r => r.id === idToView);
    if (report && report.fileUrl) {
        const frame = document.getElementById('reportFrame');
        frame.src = report.fileUrl; // Raporun URL'sini iframe'e yükle
        openModal('reportViewModal');
    } else {
        showNotification('Hata', 'Rapor bulunamadı veya görüntülenemiyor.');
        console.error('Rapor bulunamadı veya fileUrl eksik:', reportId);
    }
}


function loadSettings() {
    // LocalStorage'dan ayarları yükle veya varsayılanı kullan
    const storedSettings = localStorage.getItem('userSettings');
    if (storedSettings) {
        userSettings = JSON.parse(storedSettings);
    }

    // Formu doldur
    document.getElementById('userName').value = userSettings.name || '';
    document.getElementById('userEmail').value = userSettings.email || '';
    document.getElementById('userPhone').value = userSettings.phone || '';

    // Bildirim checkbox'larını ayarla
    document.querySelectorAll('#settingsForm input[name="notifications"]').forEach(checkbox => {
        checkbox.checked = userSettings.notifications.includes(checkbox.value);
    });

    // Kullanıcı adını sidebar'da güncelle
    userNameDisplay.textContent = userSettings.name || 'Kullanıcı Adı';
}

function saveSettingsHandler(event) {
    event.preventDefault();

    // Formdan verileri al
    const newSettings = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        phone: document.getElementById('userPhone').value,
        notifications: Array.from(document.querySelectorAll('#settingsForm input[name="notifications"]:checked'))
                          .map(cb => cb.value)
    };

    // State'i güncelle
    userSettings = newSettings;

    // LocalStorage'a kaydet
    try {
        localStorage.setItem('userSettings', JSON.stringify(userSettings));
        userNameDisplay.textContent = userSettings.name; // Sidebar'ı güncelle
        closeModal('settingsModal');
        showNotification('Başarılı', 'Ayarlarınız kaydedildi!');
    } catch (e) {
        console.error("Ayarlar kaydedilirken localStorage hatası:", e);
        showNotification("Hata", "Ayarlar kaydedilemedi. Tarayıcı depolama alanı dolu olabilir.");
    }
}

function logoutHandler() {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        localStorage.removeItem('userSettings'); // Ayarları temizle
        // Gerekirse diğer verileri de temizle
        // localStorage.clear();
        window.location.href = 'index.html'; // Giriş sayfasına yönlendir
    }
}

// --- API Call Functions (AI Chat) ---
async function sendMessage() {
    if (!userInput || !chatMessages) {
        console.error("Chat elementleri bulunamadı.");
        return;
    }
    const message = userInput.value.trim();
    if (message === '') return;

    addMessageToChat('user', message);
    userInput.value = '';
    userInput.focus();

    let loadingId = showLoadingMessage(); // Loading mesajı göster

    try {
        const response = await fetch('https://elokmanweb.onrender.com/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: message }] }],
                // generationConfig: { temperature: 0.7, topP: 0.9, topK: 40 } // Opsiyonel
            })
        });

        removeLoadingMessage(loadingId); // Loading mesajını kaldır

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', response.status, errorText);
            throw new Error(`API Hatası: ${response.status}`);
        }

        const data = await response.json();
        // API yanıt formatına göre ayarla (Gemini API'sine göre düzenlendi)
        const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.reply || 'Anlaşılır bir yanıt alınamadı.';
        addMessageToChat('ai', replyText);

    } catch (error) {
        console.error('Mesaj gönderilirken hata oluştu:', error);
        removeLoadingMessage(loadingId); // Hata durumunda da loading'i kaldır
        addMessageToChat('ai', `Üzgünüm, bir hata oluştu (${error.message}). Lütfen tekrar deneyin.`);
    }
}

function addMessageToChat(type, content) {
    if (!chatMessages) return;
    const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const aiAvatar = 'img/elokman.png';
    const userAvatar = 'img/user.png';

    const messageHtml = `
        <div class="message ${type}">
            <div class="message-info">
                ${type === 'ai' ?
                    `<img src="${aiAvatar}" alt="AI" class="message-avatar">
                     <span class="message-sender">Lokman</span>` :
                    `<span class="message-sender">Siz</span>
                     <img src="${userAvatar}" alt="Kullanıcı" class="message-avatar">`
                }
            </div>
            <div class="message-bubble">
                <p>${content.replace(/\*\*/g, '<strong>').replace(/\*/g, '</strong>')}</p> </div> <span class="message-time">${time}</span>
        </div>
    `; // Markdown bold formatını HTML'e çevirme eklendi

    chatMessages.insertAdjacentHTML('beforeend', messageHtml);
    chatMessages.scrollTop = chatMessages.scrollHeight; // En alta kaydır
}

function showLoadingMessage() {
    if (!chatMessages) return null;
    const loadingId = 'loading-' + Date.now();
    const aiAvatar = 'img/elokman.png';

    const loadingHtml = `
        <div class="message ai" id="${loadingId}">
            <div class="message-info">
                <img src="${aiAvatar}" alt="AI" class="message-avatar">
                <span class="message-sender">Lokman</span>
            </div>
            <div class="message-bubble">
                <p class="loading-dots">Yanıt yazıyor<span>.</span><span>.</span><span>.</span></p>
            </div>
        </div>
    `;

    chatMessages.insertAdjacentHTML('beforeend', loadingHtml);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loadingId;
}

function removeLoadingMessage(loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
        loadingElement.remove();
    }
}

// --- Utils ---
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showSection(sectionId) {
    if (!sections[sectionId]) {
        console.error(`Bölüm bulunamadı: ${sectionId}`);
        sectionId = 'homePage'; // Hata durumunda ana sayfaya dön
    }

    // Tüm bölümleri gizle
    Object.values(sections).forEach(section => {
        if (section) section.style.display = 'none';
    });

    // İstenen bölümü göster
    sections[sectionId].style.display = 'block';
    currentSection = sectionId;

    // Aktif menü öğesini güncelle
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeButton = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Gerekirse ilgili bölümün verisini yeniden render et (opsiyonel)
    // if (sectionId === 'appointments') renderAppointments();
    // else if (sectionId === 'medications') renderMedications();
    // ...
}

function showNotification(title, message, type = 'info') { // type: info, success, error, warning
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`; // Tip sınıfı eklendi

    const id = 'notification-' + Date.now();
    notification.id = id;

    // İkon tipi
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    else if (type === 'error') iconClass = 'fa-times-circle';
    else if (type === 'warning') iconClass = 'fa-exclamation-triangle';

    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="notification-content">
            <h4 class="notification-title">${title}</h4>
            <p class="notification-message">${message}</p>
        </div>
        <button class="notification-close" onclick="closeNotification('${id}')" title="Kapat">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(notification);

    // Otomatik kapatma
    setTimeout(() => {
        closeNotification(id);
    }, 7000); // 7 saniye
}

// Global scope'da olması gerekiyor çünkü inline onclick ile çağrılıyor
window.closeNotification = function(id) {
    const notification = document.getElementById(id);
    if (notification) {
        notification.classList.add('removing');
        // Animasyonun bitmesini bekle ve sonra kaldır
        setTimeout(() => {
            notification.remove();
        }, 300); // CSS transition süresi kadar
    }
}

function validateFile(file) {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
         showNotification('Hata', `Desteklenmeyen dosya formatı: ${file.type}! Lütfen PDF veya resim dosyası yükleyin.`, 'error');
        return false;
    }

    if (file.size > maxSize) {
         showNotification('Hata', `Dosya boyutu çok büyük (${(file.size / 1024 / 1024).toFixed(2)}MB)! Maksimum 5MB yükleyebilirsiniz.`, 'error');
        return false;
    }

    return true;
}

// İlaç Hatırlatıcı Fonksiyonu (Optimize Edilmiş)
function updateMedicationReminders() {
     if (!medicationRemindersContainer || !emptyReminderState) return;

    const now = new Date();
    // Saat ve dakikayı toplam dakika olarak al (örn: 10:30 -> 630)
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    const todaysReminders = [];

    medications.forEach(med => {
        med.schedules.forEach(schedule => {
            if (schedule.time) {
                const [hours, minutes] = schedule.time.split(':').map(Number);
                if (!isNaN(hours) && !isNaN(minutes)) {
                    const reminderTimeInMinutes = hours * 60 + minutes;
                    todaysReminders.push({
                        name: med.name,
                        dose: med.dose,
                        timeMinutes: reminderTimeInMinutes,
                        timeString: schedule.time
                    });

                    // Bildirim kontrolü: Tam ilaç saati geldiğinde veya 1 dk içinde
                    if (reminderTimeInMinutes === currentTimeInMinutes || reminderTimeInMinutes === currentTimeInMinutes -1 ) {
                        showNotification(
                            'İlaç Hatırlatıcı',
                            `${schedule.time} - ${med.name} (${med.dose}) ilacınızı alma zamanı!`,
                            'info'
                        );
                    }
                }
            }
        });
    });

    // Saate göre sırala
    todaysReminders.sort((a, b) => a.timeMinutes - b.timeMinutes);

    // Listeyi render et
    medicationRemindersContainer.innerHTML = '';
    if (todaysReminders.length === 0) {
        medicationRemindersContainer.style.display = 'none';
        emptyReminderState.style.display = 'flex';
    } else {
        medicationRemindersContainer.style.display = 'block';
        emptyReminderState.style.display = 'none';
        todaysReminders.forEach(reminder => {
            const isPast = reminder.timeMinutes < currentTimeInMinutes;
            const reminderHtml = `
                <div class="reminder-item ${isPast ? 'past' : ''}">
                    <div class="reminder-time">
                        <i class="fas fa-clock"></i>
                        <span>${reminder.timeString}</span>
                    </div>
                    <div class="reminder-details">
                        <h3>${reminder.name}</h3>
                        <p>${reminder.dose}</p>
                    </div>
                    <div class="reminder-status">
                        ${isPast ?
                            '<i class="fas fa-check-circle" title="Alındı (Geçmiş)"></i>' :
                            '<i class="fas fa-bell" title="Bekleniyor"></i>'
                        }
                    </div>
                </div>
            `;
            medicationRemindersContainer.insertAdjacentHTML('beforeend', reminderHtml);
        });
    }
}


// Web Speech API Tanıma
let recognition = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (userInput) {
            userInput.value = transcript;
            sendMessage(); // Otomatik gönderim eklendi
        }
         if (micButton) micButton.classList.remove('active');
    };

    recognition.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
         showNotification('Hata', `Ses tanıma hatası: ${event.error}`, 'error');
        if (micButton) micButton.classList.remove('active');
    }

    recognition.onend = () => {
        if (micButton) micButton.classList.remove('active');
    };

} else {
    console.warn("Tarayıcınız Web Speech API'sini desteklemiyor.");
    if (micButton) micButton.style.display = 'none'; // Destek yoksa butonu gizle
}


// --- Event Listeners ---
function setupEventListeners() {
    // Sidebar Navigasyon
    sideNav.addEventListener('click', (event) => {
        const button = event.target.closest('.nav-btn');
        if (button && button.dataset.section) {
            showSection(button.dataset.section);
        }
    });

    // Genel Butonlar (Tümünü Gör vs.)
    mainContent.addEventListener('click', (event) => {
         const button = event.target.closest('.view-all-btn');
         if (button && button.dataset.sectionTarget) {
              showSection(button.dataset.sectionTarget);
         }
    });


    // Modal Açma Butonları
    if (addMedBtn) addMedBtn.addEventListener('click', () => openModal('addMedModal'));
    if (addReportBtn) addReportBtn.addEventListener('click', () => openModal('addReportModal'));
    if (settingsBtn) settingsBtn.addEventListener('click', () => {
        loadSettings(); // Ayarları modal açılmadan önce yükle
        openModal('settingsModal');
    });
    if (logoutBtn) logoutBtn.addEventListener('click', logoutHandler);
    if (mhrsBtn) mhrsBtn.addEventListener('click', () => window.open('https://mhrs.gov.tr', '_blank'));


    // Modal Kapatma Butonları (Event Delegation)
    document.body.addEventListener('click', (event) => {
        // Kapatma (X) butonları
        if (event.target.matches('.close-modal') || event.target.closest('.close-modal')) {
             const button = event.target.closest('.close-modal');
            const modalId = button.dataset.modalId;
            if (modalId) {
                closeModal(modalId);
            }
        }
        // Modal dışı tıklama
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });


    // Form Gönderimleri
    if (addAppointmentForm) addAppointmentForm.addEventListener('submit', addAppointmentHandler);
    if (addMedForm) addMedForm.addEventListener('submit', addMedicationHandler);
    if (addReportForm) addReportForm.addEventListener('submit', addReportHandler);
    if (settingsForm) settingsForm.addEventListener('submit', saveSettingsHandler);


    // Dinamik Liste İçindeki Butonlar (Event Delegation)
    // İlaç Silme
    medicationsListContainer.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.delete-med-btn');
        if (deleteButton && deleteButton.dataset.id) {
            deleteMedicationHandler(deleteButton.dataset.id);
        }
    });

    // Rapor Görüntüleme
    reportsTableBody.addEventListener('click', (event) => {
        const viewButton = event.target.closest('.view-report-btn');
        if (viewButton && viewButton.dataset.id) {
            viewReportHandler(viewButton.dataset.id);
        }
        // Rapor Silme için de benzer bir yapı eklenebilir
        // const deleteButton = event.target.closest('.delete-report-btn');
        // if (deleteButton && deleteButton.dataset.id) {
        //     deleteReportHandler(deleteButton.dataset.id); // Bu fonksiyonu yazmanız gerekir
        // }
    });


    // AI Chat
    if (sendButton) sendButton.addEventListener('click', sendMessage);
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { // Shift+Enter yeni satır içindir
                 e.preventDefault(); // Formun submit olmasını engelle (eğer varsa)
                sendMessage();
            }
        });
    }
     // Mikrofon Butonu
     if (micButton && recognition) {
          micButton.addEventListener('click', () => {
               if (micButton.classList.contains('active')) {
                    recognition.stop();
                    micButton.classList.remove('active');
               } else {
                    try {
                         recognition.start();
                         micButton.classList.add('active');
                    } catch (e) {
                         console.error("Recognition başlatılamadı:", e);
                         showNotification('Hata', 'Ses tanıma başlatılamadı.', 'error');
                         micButton.classList.remove('active');
                    }
               }
          });
     }

     // İlaç Ekleme Modalındaki Checkbox'a bağlı Time Input Aktifleştirme
     addMedModal.addEventListener('change', (event) => {
          if (event.target.matches('input[name="schedule"]')) {
               const timeInput = event.target.closest('label').querySelector('.schedule-time');
               if (timeInput) {
                    timeInput.disabled = !event.target.checked;
                    if (!event.target.checked) {
                         timeInput.value = ''; // İşaret kaldırıldığında saati temizle
                    }
               }
          }
     });

     // Rapor Ekle Modalındaki Dosya Seçimi Bilgisi
     const reportFileInput = document.getElementById('reportFile');
     const reportFileInfo = document.getElementById('addReportFileInfo');
     if (reportFileInput && reportFileInfo) {
          reportFileInput.addEventListener('change', () => {
               if (reportFileInput.files.length > 0) {
                    const file = reportFileInput.files[0];
                    reportFileInfo.textContent = `Seçilen dosya: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
               } else {
                    reportFileInfo.textContent = '';
               }
          });
     }

}


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadSettings(); // Başlangıçta ayarları yükle
    renderAppointments();
    renderMedications();
    renderReports();
    renderHealthHistory();
    updateHealthSummary();
    updateCurrentDate();
    setupEventListeners();
    showSection('homePage'); // Başlangıçta Ana Sayfa'yı göster

    // Hatırlatıcıları periyodik olarak güncelle
    setInterval(updateMedicationReminders, 60000); // Her dakika
    // Tarihi her saat başı güncelle (opsiyonel)
    // setInterval(updateCurrentDate, 3600000);
});