// Sayfa yüklendiğinde çalışacak kod
document.addEventListener('DOMContentLoaded', function() {
    // Kayıt ol butonu ve modal
    const kayitBtn = document.getElementById('kayitBtn');
    const kayitModal = document.getElementById('kayitModal');
    const kayitKapat = document.querySelector('#kayitModal .kapat');

    // Kayıt ol butonuna tıklandığında modalı aç
    if (kayitBtn) {
        kayitBtn.addEventListener('click', function() {
            if (kayitModal) {
                kayitModal.style.display = 'block';
            }
        });
    }

    document.getElementById('scrollArrow').addEventListener('click', function() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Kapat butonuna tıklandığında modalı kapat
    if (kayitKapat) {
        kayitKapat.addEventListener('click', function() {
            if (kayitModal) {
                kayitModal.style.display = 'none';
            }
        });
    }

    // Modal dışına tıklandığında modalı kapat
    window.addEventListener('click', function(event) {
        if (event.target == kayitModal) {
            kayitModal.style.display = 'none';
        }
    });

    // Şifremi unuttum butonu ve modal
    const sifremiUnuttumBtn = document.getElementById('sifremiUnuttumBtn');
    const sifremiUnuttumModal = document.getElementById('sifremiUnuttumModal');
    const sifremiUnuttumKapat = document.querySelector('#sifremiUnuttumModal .kapat');

    // Şifremi unuttum butonuna tıklandığında modalı aç
    if (sifremiUnuttumBtn) {
        sifremiUnuttumBtn.addEventListener('click', function() {
            if (sifremiUnuttumModal) {
                sifremiUnuttumModal.style.display = 'block';
            }
        });
    }

    // Kapat butonuna tıklandığında modalı kapat
    if (sifremiUnuttumKapat) {
        sifremiUnuttumKapat.addEventListener('click', function() {
            if (sifremiUnuttumModal) {
                sifremiUnuttumModal.style.display = 'none';
            }
        });
    }

    // Modal dışına tıklandığında modalı kapat
    window.addEventListener('click', function(event) {
        if (event.target == sifremiUnuttumModal) {
            sifremiUnuttumModal.style.display = 'none';
        }
    });

    // Kayıt formu gönderimi
    const kayitFormu = document.getElementById('kayitFormu');
    if (kayitFormu) {
        kayitFormu.addEventListener('submit', function(event) {
            event.preventDefault();
            // Form verilerini al
            const formData = {
                tc: document.getElementById('tc').value,
                ad: document.getElementById('ad').value,
                soyad: document.getElementById('soyad').value,
                cinsiyet: document.getElementById('cinsiyet').value,
                dogumTarihi: document.getElementById('dogumTarihi').value,
                telefon: document.getElementById('telefon').value,
                eposta: document.getElementById('kayitEposta').value,
                sifre: document.getElementById('kayitSifre').value,
                sifreTekrar: document.getElementById('sifreTekrar').value,
                kvkk: document.getElementById('kvkk').checked
            };

            // Şifre kontrolü
            if (formData.sifre !== formData.sifreTekrar) {
                alert('Şifreler eşleşmiyor!');
                return;
            }

            // KVKK kontrolü
            if (!formData.kvkk) {
                alert('KVKK şartlarını kabul etmelisiniz!');
                return;
            }

            // Burada form verilerini sunucuya gönderme işlemi yapılacak
            console.log('Kayıt formu gönderildi:', formData);
            alert('Kayıt işlemi başarılı!');
            kayitModal.style.display = 'none';
            kayitFormu.reset();
        });
    }

    // Şifremi unuttum formu gönderimi
    const sifremiUnuttumFormu = document.getElementById('sifremiUnuttumFormu');
    if (sifremiUnuttumFormu) {
        sifremiUnuttumFormu.addEventListener('submit', function(event) {
            event.preventDefault();
            const eposta = document.getElementById('sifremiUnuttumEposta').value;
            
            // Burada şifre sıfırlama işlemi yapılacak
            console.log('Şifre sıfırlama isteği gönderildi:', eposta);
            alert('Şifre sıfırlama linki e-posta adresinize gönderildi!');
            sifremiUnuttumModal.style.display = 'none';
            sifremiUnuttumFormu.reset();
        });
    }

    // Giriş formu gönderimi
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Basit kontrol - gerçek uygulamada backend kontrolü yapılmalı
            if (username && password) {
                // Ana panele yönlendir
                window.location.href = 'ana-panel.html';
            } else {
                alert('Lütfen kullanıcı adı ve şifre giriniz!');
            }
        });
    }

    // KVKK Modal işlemleri
    const kvkkModal = document.getElementById('kvkkModal');
    const kvkkLink = document.getElementById('kvkkLink');
    const kvkkKapat = kvkkModal.querySelector('.kapat');

    kvkkLink.addEventListener('click', function(e) {
        e.preventDefault();
        kvkkModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    kvkkKapat.addEventListener('click', function() {
        kvkkModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', function(e) {
        if (e.target == kvkkModal) {
            kvkkModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // KVKK onay kontrolü
    const kvkkOnay = document.getElementById('kvkkOnay');
    const kayitForm = document.querySelector('.kayit-form');

    kayitForm.addEventListener('submit', function(e) {
        if (!kvkkOnay.checked) {
            e.preventDefault();
            alert('Lütfen KVKK metnini okuyup onaylayınız.');
            return false;
        }
    });

    document.getElementById('scrollArrow').addEventListener('click', function() {
        document.getElementById('loginForm').scrollIntoView({ behavior: 'smooth' });
    });
});