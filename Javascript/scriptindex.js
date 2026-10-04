/* =====================================
    DATA LOGIN ADMIN & USER
===================================== */
const ADMIN_USERNAME = "prawiragp";
const ADMIN_PASSWORD = "polgpontop";

// --- DATA LOGIN USER (ANGGOTA) ---
const USER_USERNAME = "userprawira"; // Ubah username user di sini
const USER_PASSWORD = "user123";      // Ubah password user di sini

/* =====================================
    NAVIGASI TAB / SECTION DASHBOARD
===================================== */
document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu-item, .quick");
    const sections = document.querySelectorAll(".page-section");
    const pageTitle = document.getElementById("pageTitle");
    const pageLabel = document.getElementById("pageLabel");
    const pageDescription = document.getElementById("pageDescription");

    const pageInfo = {
        dashboard: ["Dashboard", "DASHBOARD", "Pusat pengelolaan data Kepolisian Garuda Prime RP."],
        prawira: ["DATA PRAWIRA", "DATA PRAWIRA", "Kelola dan pantau data Prawira."],
        mdt: ["LIST MDT", "LIST MDT", "Daftar dan pengelolaan MDT."],
        evidence: ["DATA EVIDENCE", "DATA EVIDENCE", "Kelola data evidence yang tersimpan."],
        apd: ["APD MANAGEMENT", "APD MANAGEMENT", "Pencatatan Withdraw Senjata & Deposit APD."],
        kodeetik: ["DATA KASUS KODE ETIK", "KODE ETIK", "Pencatatan dan Pengelolaan Pelanggaran Kode Etik Personel."],
        caseingoing: ["CASE IN GOING", "CASE IN GOING", "Pengelolaan data kasus yang sedang berjalan."],
        rekap: ["REKAP SEMUA", "REKAP SEMUA", "Ringkasan seluruh data dalam sistem."]
    };

    function openSection(id) {
        if (!sections.length) return;

        sections.forEach(section => {
            section.classList.toggle("active-section", section.id === id);
        });

        document.querySelectorAll(".menu-item").forEach(item => {
            item.classList.toggle("active", item.dataset.section === id);
        });

        const info = pageInfo[id] || pageInfo.dashboard;
        if (pageTitle) pageTitle.textContent = info[0];
        if (pageLabel) pageLabel.textContent = info[1];
        if (pageDescription) pageDescription.textContent = info[2];
    }

    menuItems.forEach(item => {
        item.addEventListener("click", () => openSection(item.dataset.section));
    });

    // TOGGLE SIDEBAR FIX (Desktop & Mobile)
    const toggleBtn = document.getElementById("toggleSidebar");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main");

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", function (e) {
            e.stopPropagation(); // Mencegah event klik langsung tertutup oleh document

            // Cek jika ukuran layar HP / Tablet
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle("active-mobile");
            } else {
                sidebar.classList.toggle("collapsed");
                if (mainContent) mainContent.classList.toggle("expanded");
            }
        });
    }

    // Klik di luar sidebar di HP untuk menutup sidebar
    document.addEventListener("click", function (e) {
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains("active-mobile")) {
            if (!sidebar.contains(e.target) && e.target !== toggleBtn) {
                sidebar.classList.remove("active-mobile");
            }
        }
    });

    /* =====================================
   PROTEKSI DASHBOARD & ROLE AKSES
===================================== */
    const currentPage = window.location.pathname.split("/").pop().toLowerCase();
    const isLoggedIn = sessionStorage.getItem("adminLoggedIn");
    const currentRole = sessionStorage.getItem("userRole");

    // Berjalan jika di halaman dashboard
    if (currentPage.includes("dashboard") || currentPage === "") {
        if (isLoggedIn !== "true") {
            alert("AKSES DITOLAK!\nSilakan login terlebih dahulu.");
            sessionStorage.clear();
            window.location.replace("index.html");
        }

        // Tampilkan nama & role di sidebar/topbar
        const namaAkun = sessionStorage.getItem("userName");
        if (namaAkun) {
            document.querySelectorAll('.admin-mini strong, .profile strong').forEach(el => el.textContent = namaAkun);
            document.querySelectorAll('.admin-mini small, .profile small').forEach(el => {
                el.textContent = (currentRole === "administrator") ? "Administrator" : "Anggota Prawira";
            });
        }

        // JIKA ROLE ADALAH 'anggota' (USER BIASA), SEMBUNYIKAN HANYA TOMBOL HAPUS
        if (currentRole === "anggota") {
            const styleRestriction = document.createElement('style');
            styleRestriction.innerHTML = `
            .btn-delete { display: none !important; }
        `;
            document.head.appendChild(styleRestriction);
        }
    }

    /* =====================================
       HALAMAN LOGIN (index.html)
    ===================================== */
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        if (isLoggedIn === "true") {
            window.location.href = "dashboard.html";
        }

        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value;
            const errorMessage = document.getElementById("errorMessage");

            // 1. Cek Login Admin
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                sessionStorage.setItem("adminLoggedIn", "true");
                sessionStorage.setItem("userRole", "administrator");
                sessionStorage.setItem("userName", "Administrator");
                window.location.href = "dashboard.html";
            }
            // 2. Cek Login User (Anggota)
            else if (username === USER_USERNAME && password === USER_PASSWORD) {
                sessionStorage.setItem("adminLoggedIn", "true");
                sessionStorage.setItem("userRole", "anggota");
                sessionStorage.setItem("userName", "Anggota Prawira");
                window.location.href = "dashboard.html";
            }
            // 3. Cek Login dari Data Anggota LocalStorage (Jika ada)
            else {
                let dataAnggota = JSON.parse(localStorage.getItem('dataPrawira')) || [];
                const cekAkun = dataAnggota.find(user => user.username === username && user.password === password);

                if (cekAkun) {
                    sessionStorage.setItem("adminLoggedIn", "true");
                    sessionStorage.setItem("userRole", cekAkun.role || "anggota");
                    sessionStorage.setItem("userName", cekAkun.nama);
                    window.location.href = "dashboard.html";
                } else {
                    if (errorMessage) {
                        errorMessage.textContent = "Username atau password salah!";
                        errorMessage.style.display = "block";
                    }
                    document.getElementById("password").value = "";
                }
            }
        });

        const togglePassword = document.getElementById("togglePassword");
        if (togglePassword) {
            togglePassword.addEventListener("click", function () {
                const passwordInput = document.getElementById("password");
                if (passwordInput.type === "password") {
                    passwordInput.type = "text";
                    togglePassword.textContent = "🙈";
                } else {
                    passwordInput.type = "password";
                    togglePassword.textContent = "👁";
                }
            });
        }
    }

    /* =====================================
       LOGOUT
    ===================================== */
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            sessionStorage.removeItem("adminLoggedIn");
            sessionStorage.removeItem("userRole");
            sessionStorage.removeItem("userName");
            window.location.replace("index.html");
        });
    }

    /* =====================================
       SISTEM CRUD DASHBOARD & SIDEBAR
    ===================================== */
    if (document.getElementById('tabelPrawiraBody')) {

        // --- DATA PRAWIRA (CRUD FIX) ---
        let dataPrawira = JSON.parse(localStorage.getItem('dataPrawira')) || [];
        const tbodyPrawira = document.getElementById('tabelPrawiraBody');
        const modalPrawira = document.getElementById('modalPrawira');
        const formPrawira = document.getElementById('formPrawira');
        const btnTambahPrawira = document.getElementById('btnTambahPrawira');
        const closeModalPrawira = document.getElementById('closeModal');

        // Helper untuk populate dropdown Prawira di modal lain
        function populatePrawiraDropdown(selectElementId, selectedValue = '') {
            const selectEl = document.getElementById(selectElementId);
            if (!selectEl) return;

            selectEl.innerHTML = '<option value="" disabled selected>Pilih Officer dari Data Prawira...</option>';

            if (dataPrawira.length === 0) {
                selectEl.innerHTML = '<option value="" disabled>Belum ada Data Prawira</option>';
                return;
            }

            dataPrawira.forEach(p => {
                const labelPrawira = `[${p.callSign}] ${p.nama}`;
                const option = document.createElement('option');
                option.value = labelPrawira;
                option.textContent = labelPrawira;

                if (labelPrawira === selectedValue || p.nama === selectedValue) {
                    option.selected = true;
                }

                selectEl.appendChild(option);
            });
        }

        function renderTabelPrawira(data = dataPrawira) {
            if (!tbodyPrawira) return;
            tbodyPrawira.innerHTML = '';
            if (data.length === 0) {
                tbodyPrawira.innerHTML = `<tr><td colspan="6" style="text-align:center;">Belum ada data.</td></tr>`;
            } else {
                data.forEach((item, i) => {
                    tbodyPrawira.innerHTML += `
                <tr>
                    <td><strong>${item.callSign}</strong></td>
                    <td><span class="badge">${item.pangkat}</span></td>
                    <td>${item.nama}</td>
                    <td>${item.jk}</td>
                    <td>${item.tanggungJawab}</td>
                    <td class="action-btns">
                        <button class="btn-edit" onclick="editPrawira(${i})">Edit</button>
                        <button class="btn-delete" onclick="hapusPrawira(${i})">Hapus</button>
                    </td>
                </tr>`;
                });
            }
            const elTotal = document.getElementById('totalPrawira');
            if (elTotal) elTotal.textContent = `TOTAL ${data.length} DATA`;
        }

        // Event Klik Tombol Tambah Data Prawira
        if (btnTambahPrawira && modalPrawira && formPrawira) {
            btnTambahPrawira.addEventListener('click', () => {
                formPrawira.reset();
                const editIndexInput = document.getElementById('editIndex');
                if (editIndexInput) editIndexInput.value = '';

                const modalTitle = document.getElementById('modalTitle');
                if (modalTitle) modalTitle.textContent = 'Tambah Data Prawira';

                modalPrawira.style.display = 'flex';
            });
        }

        // Event Tutup Modal Prawira
        if (closeModalPrawira && modalPrawira) {
            closeModalPrawira.addEventListener('click', () => {
                modalPrawira.style.display = 'none';
            });
        }

        // Event Submit Form Prawira
        if (formPrawira) {
            formPrawira.addEventListener('submit', (e) => {
                e.preventDefault();
                const dataBaru = {
                    callSign: document.getElementById('callSign').value,
                    pangkat: document.getElementById('pangkat').value,
                    nama: document.getElementById('nama').value,
                    jk: document.getElementById('jk').value,
                    tanggungJawab: document.getElementById('tanggungJawab').value
                };

                const index = document.getElementById('editIndex').value;

                if (index === '') {
                    dataPrawira.push(dataBaru);
                } else {
                    dataPrawira[index] = dataBaru;
                }

                localStorage.setItem('dataPrawira', JSON.stringify(dataPrawira));
                renderTabelPrawira();
                modalPrawira.style.display = 'none';
                if (typeof updateRekapData === 'function') updateRekapData();
            });
        }

        window.editPrawira = (i) => {
            const item = dataPrawira[i];
            if (!item) return;

            document.getElementById('editIndex').value = i;
            document.getElementById('callSign').value = item.callSign || '';
            document.getElementById('pangkat').value = item.pangkat || '';
            document.getElementById('nama').value = item.nama || '';
            document.getElementById('jk').value = item.jk || '';
            document.getElementById('tanggungJawab').value = item.tanggungJawab || '';

            const modalTitle = document.getElementById('modalTitle');
            if (modalTitle) modalTitle.textContent = 'Edit Data Prawira';

            modalPrawira.style.display = 'flex';
        };

        window.hapusPrawira = (i) => {
            if (confirm('Hapus data ini?')) {
                dataPrawira.splice(i, 1);
                localStorage.setItem('dataPrawira', JSON.stringify(dataPrawira));
                renderTabelPrawira();
                if (typeof updateRekapData === 'function') updateRekapData();
            }
        };

        const cariPrawiraInput = document.getElementById('cariPrawira');
        if (cariPrawiraInput) {
            cariPrawiraInput.addEventListener('input', (e) => {
                const keyword = e.target.value.toLowerCase();
                renderTabelPrawira(dataPrawira.filter(item =>
                    (item.nama && item.nama.toLowerCase().includes(keyword)) ||
                    (item.callSign && item.callSign.toLowerCase().includes(keyword))
                ));
            });
        }

        renderTabelPrawira();

        // --- SINKRONISASI DATA PRAWIRA REALTIME ---
const prawiraRef = database.ref('dataPrawira');

// 1. Dapatkan dan Dengarkan Perubahan Data secara Realtime dari Firebase
prawiraRef.on('value', (snapshot) => {
    const data = snapshot.val();
    window.dataPrawira = [];
    
    if (data) {
        // Mengubah objek Firebase menjadi Array agar sesuai dengan fungsi render yang ada
        Object.keys(data).forEach(key => {
            window.dataPrawira.push({
                firebaseKey: key,
                ...data[key]
            });
        });
    }
    
    // Render otomatis setiap kali ada data baru / perubahan dari perangkat manapun
    if (typeof window.renderTabelPrawira === 'function') {
        window.renderTabelPrawira();
    }
    if (typeof updateRekapData === 'function') {
        updateRekapData();
    }
});

// 2. Simpan / Tambah Data ke Firebase
formPrawira.addEventListener('submit', function (e) {
    e.preventDefault();
    
    const dataBaru = {
        callSign: document.getElementById('callSign').value,
        pangkat: document.getElementById('pangkat').value,
        nama: document.getElementById('nama').value,
        jk: document.getElementById('jk').value,
        tanggungJawab: document.getElementById('tanggungJawab').value
    };

    const index = document.getElementById('editIndex').value;

    if (index === '') {
        // Tambah data baru ke Firebase Database
        prawiraRef.push(dataBaru);
    } else {
        // Update data berdasarkan Firebase Key
        const itemKey = window.dataPrawira[index].firebaseKey;
        if (itemKey) {
            database.ref('dataPrawira/' + itemKey).set(dataBaru);
        }
    }

    modalPrawira.style.display = 'none';
});

// 3. Hapus Data dari Firebase
window.hapusPrawira = function (i) {
    const item = window.dataPrawira[i];
    if (item && item.firebaseKey && confirm('Hapus data Prawira ini?')) {
        database.ref('dataPrawira/' + item.firebaseKey).remove();
    }
};

        // --- LIST MDT ---
        let dataMDT = JSON.parse(localStorage.getItem('dataMDT')) || [];
        const tbodyMDT = document.getElementById('tabelMDTBody');
        const modalMDT = document.getElementById('modalMDT');
        const formMDT = document.getElementById('formMDT');

        // Element Modal Review MDT
        const modalReviewMDT = document.getElementById('modalReviewMDT');
        const closeModalReviewMDT = document.getElementById('closeModalReviewMDT');
        const btnTutupReviewMDT = document.getElementById('btnTutupReviewMDT');

        // Penampung Foto Base64 MDT
        let currentMdtFotoBase64 = '';

        function getBadge(status) {
            if (status === 'Lengkap' || status === 'Disetorkan') return '<span class="badge success">' + status + '</span>';
            if (status === 'Tidak Lengkap') return '<span class="badge warning">' + status + '</span>';
            return '<span class="badge danger">' + status + '</span>';
        }

        // Handler Upload File dan Link URL Foto MDT
        function initMdtFotoHandlers() {
            const mdtFotoUrl = document.getElementById('mdtFotoUrl');
            const mdtFotoFile = document.getElementById('mdtFotoFile');
            const mdtFotoPreview = document.getElementById('mdtFotoPreview');
            const mdtFotoPreviewContainer = document.getElementById('mdtFotoPreviewContainer');

            if (mdtFotoFile) {
                mdtFotoFile.onchange = function (e) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function (evt) {
                            currentMdtFotoBase64 = evt.target.result;
                            if (mdtFotoPreview) mdtFotoPreview.src = currentMdtFotoBase64;
                            if (mdtFotoPreviewContainer) mdtFotoPreviewContainer.style.display = 'block';
                            if (mdtFotoUrl) mdtFotoUrl.value = '';
                        };
                        reader.readAsDataURL(file);
                    }
                };
            }

            if (mdtFotoUrl) {
                mdtFotoUrl.oninput = function (e) {
                    const url = e.target.value.trim();
                    if (url) {
                        currentMdtFotoBase64 = url;
                        if (mdtFotoPreview) mdtFotoPreview.src = url;
                        if (mdtFotoPreviewContainer) mdtFotoPreviewContainer.style.display = 'block';
                        if (mdtFotoFile) mdtFotoFile.value = '';
                    } else {
                        currentMdtFotoBase64 = '';
                        if (mdtFotoPreviewContainer) mdtFotoPreviewContainer.style.display = 'none';
                    }
                };
            }
        }

        function renderTabelMDT(data = dataMDT) {
            if (!tbodyMDT) return;
            tbodyMDT.innerHTML = '';
            if (data.length === 0) {
                tbodyMDT.innerHTML = `<tr><td colspan="8" style="text-align:center;">Belum ada data MDT.</td></tr>`;
            } else {
                data.forEach((item, i) => {
                    const formatTanggal = item.tanggal ? item.tanggal.replace('T', ' ') : '-';
                    tbodyMDT.innerHTML += `
            <tr>
                <td>${formatTanggal}</td>
                <td><strong>${item.no}</strong></td>
                <td>${item.komando}</td>
                <td>${item.officer || item.unit || '-'}</td>
                <td>${getBadge(item.statusMDT)}</td>
                <td>${getBadge(item.statusSetor)}</td>
                <td>${item.keterangan || '-'}</td>
                <td class="action-btns">
                    <button class="btn-review" onclick="reviewMDT(${i})">Review</button>
                    <button class="btn-edit" onclick="editMDT(${i})">Edit</button>
                    <button class="btn-delete" onclick="hapusMDT(${i})">Hapus</button>
                </td>
            </tr>`;
                });
            }
            const elTotal = document.getElementById('totalMDT');
            if (elTotal) elTotal.textContent = `TOTAL ${data.length} DATA`;
        }

        // Fungsi Review Modal
        window.reviewMDT = (i) => {
            const item = dataMDT[i];
            if (!item || !modalReviewMDT) return;

            document.getElementById('revMdtTanggal').textContent = item.tanggal ? item.tanggal.replace('T', ' ') : '-';
            document.getElementById('revMdtNo').textContent = item.no || '-';
            document.getElementById('revMdtKomando').textContent = item.komando || '-';
            document.getElementById('revMdtOfficer').textContent = item.officer || item.unit || '-';
            document.getElementById('revMdtStatus').innerHTML = getBadge(item.statusMDT);
            document.getElementById('revMdtSetor').innerHTML = getBadge(item.statusSetor);
            document.getElementById('revMdtKeterangan').textContent = item.keterangan || '-';

            const imgEl = document.getElementById('revMdtFoto');
            const noFotoEl = document.getElementById('revMdtNoFoto');

            if (item.foto) {
                if (imgEl) { imgEl.src = item.foto; imgEl.style.display = 'inline-block'; }
                if (noFotoEl) noFotoEl.style.display = 'none';
            } else {
                if (imgEl) imgEl.style.display = 'none';
                if (noFotoEl) noFotoEl.style.display = 'inline-block';
            }

            modalReviewMDT.style.display = 'flex';
        };

        if (closeModalReviewMDT) closeModalReviewMDT.addEventListener('click', () => modalReviewMDT.style.display = 'none');
        if (btnTutupReviewMDT) btnTutupReviewMDT.addEventListener('click', () => modalReviewMDT.style.display = 'none');

        const btnTambahMDT = document.getElementById('btnTambahMDT');
        if (btnTambahMDT) {
            btnTambahMDT.addEventListener('click', () => {
                formMDT.reset();
                document.getElementById('editIndexMDT').value = '';
                document.getElementById('modalTitleMDT').textContent = 'Tambah List MDT';
                currentMdtFotoBase64 = '';

                const previewContainer = document.getElementById('mdtFotoPreviewContainer');
                if (previewContainer) previewContainer.style.display = 'none';

                populatePrawiraDropdown('mdtOfficer');

                const now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                document.getElementById('mdtTanggal').value = now.toISOString().slice(0, 16);

                initMdtFotoHandlers();

                modalMDT.style.display = 'flex';
            });
        }

        const closeModalMDT = document.getElementById('closeModalMDT');
        if (closeModalMDT) {
            closeModalMDT.addEventListener('click', () => modalMDT.style.display = 'none');
        }

        if (formMDT) {
            formMDT.addEventListener('submit', (e) => {
                e.preventDefault();
                const dataBaru = {
                    tanggal: document.getElementById('mdtTanggal').value,
                    no: document.getElementById('mdtNo').value,
                    komando: document.getElementById('mdtKomando').value,
                    officer: document.getElementById('mdtOfficer').value,
                    statusMDT: document.getElementById('mdtStatus').value,
                    statusSetor: document.getElementById('mdtSetor').value,
                    keterangan: document.getElementById('mdtKeterangan').value,
                    foto: currentMdtFotoBase64
                };
                const index = document.getElementById('editIndexMDT').value;
                if (index === '') dataMDT.push(dataBaru);
                else dataMDT[index] = dataBaru;

                localStorage.setItem('dataMDT', JSON.stringify(dataMDT));
                renderTabelMDT();
                modalMDT.style.display = 'none';
                if (typeof updateRekapData === 'function') updateRekapData();
            });
        }

        window.editMDT = (i) => {
            const item = dataMDT[i];
            document.getElementById('editIndexMDT').value = i;
            document.getElementById('mdtTanggal').value = item.tanggal || '';
            document.getElementById('mdtNo').value = item.no || '';
            document.getElementById('mdtKomando').value = item.komando || '';

            populatePrawiraDropdown('mdtOfficer', item.officer || item.unit || '');

            document.getElementById('mdtStatus').value = item.statusMDT || '';
            document.getElementById('mdtSetor').value = item.statusSetor || '';
            document.getElementById('mdtKeterangan').value = item.keterangan || '';

            // Tampilkan foto jika ada
            currentMdtFotoBase64 = item.foto || '';
            const mdtFotoUrl = document.getElementById('mdtFotoUrl');
            const mdtFotoPreview = document.getElementById('mdtFotoPreview');
            const mdtFotoPreviewContainer = document.getElementById('mdtFotoPreviewContainer');

            if (item.foto) {
                if (mdtFotoUrl && item.foto.startsWith('http')) {
                    mdtFotoUrl.value = item.foto;
                }
                if (mdtFotoPreview) mdtFotoPreview.src = item.foto;
                if (mdtFotoPreviewContainer) mdtFotoPreviewContainer.style.display = 'block';
            } else {
                if (mdtFotoUrl) mdtFotoUrl.value = '';
                if (mdtFotoPreviewContainer) mdtFotoPreviewContainer.style.display = 'none';
            }

            initMdtFotoHandlers();

            document.getElementById('modalTitleMDT').textContent = 'Edit List MDT';
            modalMDT.style.display = 'flex';
        };

        window.hapusMDT = (i) => {
            if (confirm('Hapus data MDT ini?')) {
                dataMDT.splice(i, 1);
                localStorage.setItem('dataMDT', JSON.stringify(dataMDT));
                renderTabelMDT();
                if (typeof updateRekapData === 'function') updateRekapData();
            }
        };

        const cariMDTInput = document.getElementById('cariMDT');
        if (cariMDTInput) {
            cariMDTInput.addEventListener('input', (e) => {
                const keyword = e.target.value.toLowerCase();
                renderTabelMDT(dataMDT.filter(item =>
                    (item.no && item.no.toLowerCase().includes(keyword)) ||
                    (item.komando && item.komando.toLowerCase().includes(keyword)) ||
                    (item.officer && item.officer.toLowerCase().includes(keyword))
                ));
            });
        }
        renderTabelMDT();

        // --- DATA EVIDENCE (DENGAN REVIEW, FOTO, DAN CRUD FIX) ---
        let dataEvidence = JSON.parse(localStorage.getItem('dataEvidence')) || [];
        const tbodyEvidence = document.getElementById('tabelEvidenceBody');
        const modalEvidence = document.getElementById('modalEvidence');
        const formEvidence = document.getElementById('formEvidence');
        const containerBarang = document.getElementById('containerBarangEvidence');
        const btnTambahBarangRow = document.getElementById('btnTambahBarangRow');

        // Modal Review Evidence Elements
        const modalReviewEvidence = document.getElementById('modalReviewEvidence');
        const closeModalReviewEvidence = document.getElementById('closeModalReviewEvidence');
        const btnTutupReviewEv = document.getElementById('btnTutupReviewEv');

        // Variabel Foto
        let currentFotoBase64 = '';

        const optionsBarangHTML = `
    <option value="" disabled selected>Pilih / Cari Barang...</option>
    <optgroup label="Senjata & Amunisi">
        <option value="Ceramic Pistol">Ceramic Pistol</option>
        <option value="Mini SMG">Mini SMG</option>
        <option value="Micro SMG">Micro SMG</option>
        <option value="SMG">SMG</option>
        <option value="PISTOL">PISTOL</option>
        <option value="ASSAULT RIFLE">ASSAULT RIFLE</option>
        <option value="REVOLVER MK2">REVOLVER MK2</option>
        <option value="MACHINE PISTOL">MACHINE PISTOL</option>
        <option value="SPECIAL CARBINE">SPECIAL CARBINE</option>
        <option value="KNIFE">KNIFE</option>
        <option value=".44 MAGNUM">.44 MAGNUM</option>
        <option value=".45 ACP">.45 ACP</option>
        <option value="99MM">99MM</option>
        <option value="5.56MM">5.56MM</option>
        <option value="BUBUK MESIU">BUBUK MESIU</option>
        <option value="BULLETPROOF VEST">BULLETPROOF VEST</option>
    </optgroup>
    <optgroup label="Narkotika & Ilegal">
        <option value="JAMUR">JAMUR</option>
        <option value="LIQUID JAMUR">LIQUID JAMUR</option>
        <option value="DAUN KECUBUNG">DAUN KECUBUNG</option>
        <option value="KECUBUNG">KECUBUNG</option>
        <option value="LINTINGAN">LINTINGAN</option>
        <option value="LSD">LSD</option>
    </optgroup>
    <optgroup label="Peralatan & Lainnya">
        <option value="ADV LOCKPICK">ADV LOCKPICK</option>
        <option value="DRILL">DRILL</option>
        <option value="OBENG">OBENG</option>
        <option value="KUAS">KUAS</option>
        <option value="BLACK MONEY">BLACK MONEY</option>
        <option value="RED MONEY">RED MONEY</option>
        <option value="TROJAN USB">TROJAN USB</option>
        <option value="SPOOFING CARD">SPOOFING CARD</option>
        <option value="CONTRACT TABLET">CONTRACT TABLET</option>
        <option value="ACCES PALETO BANK">ACCES PALETO BANK</option>
        <option value="ALAT ELEKTRONIK">ALAT ELEKTRONIK</option>
        <option value="TV">TV</option>
        <option value="MICROWAVE">MICROWAVE</option>
        <option value="COFFE MACHINE">COFFE MACHINE</option>
        <option value="KALUNG EMAS">KALUNG EMAS</option>
        <option value="GELANG EMAS">GELANG EMAS</option>
        <option value="JAM TANGAN">JAM TANGAN</option>
        <option value="COINS">COINS</option>
    </optgroup>
    <optgroup label="Material">
        <option value="GEAR">GEAR</option>
        <option value="OLI PELUMAS">OLI PELUMAS</option>
        <option value="AKI">AKI</option>
        <option value="PLAT BESI">PLAT BESI</option>
        <option value="SPRING">SPRING</option>
        <option value="KOTAK KARET">KOTAK KARET</option>
        <option value="DAUN KERING">DAUN KERING</option>
        <option value="DAUN SINGKONG">DAUN SINGKONG</option>
        <option value="TAWAS">TAWAS</option>
        <option value="SAGU">SAGU</option>
        <option value="SERBUK SAGU">SERBUK SAGU</option>
    </optgroup>
`;

        function tambahBarisBarang(namaBarang = '', jumlah = '') {
            if (!containerBarang) return;
            const div = document.createElement('div');
            div.className = 'barang-row';
            div.innerHTML = `
        <select class="input-nama-barang" required>
            ${optionsBarangHTML}
        </select>
        <input type="number" class="input-jumlah-barang" placeholder="Jumlah" min="1" value="${jumlah}" required style="width: 100px;">
        <button type="button" class="btn-remove-row" title="Hapus Barang">🗑</button>
    `;

            if (namaBarang) {
                const select = div.querySelector('.input-nama-barang');
                select.value = namaBarang;
            }

            div.querySelector('.btn-remove-row').addEventListener('click', () => {
                if (containerBarang.children.length > 1) {
                    div.remove();
                } else {
                    alert('Minimal harus ada 1 barang!');
                }
            });

            containerBarang.appendChild(div);
        }

        if (btnTambahBarangRow) {
            btnTambahBarangRow.addEventListener('click', () => tambahBarisBarang());
        }

        // Handler Input & File Foto (Pengecekan Elemen Aman)
        function initFotoHandlers() {
            const evFotoUrl = document.getElementById('evFotoUrl');
            const evFotoFile = document.getElementById('evFotoFile');
            const evFotoPreview = document.getElementById('evFotoPreview');
            const evFotoPreviewContainer = document.getElementById('evFotoPreviewContainer');

            if (evFotoFile) {
                evFotoFile.onchange = function (e) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function (evt) {
                            currentFotoBase64 = evt.target.result;
                            if (evFotoPreview) evFotoPreview.src = currentFotoBase64;
                            if (evFotoPreviewContainer) evFotoPreviewContainer.style.display = 'block';
                            if (evFotoUrl) evFotoUrl.value = '';
                        };
                        reader.readAsDataURL(file);
                    }
                };
            }

            if (evFotoUrl) {
                evFotoUrl.oninput = function (e) {
                    const url = e.target.value.trim();
                    if (url) {
                        currentFotoBase64 = url;
                        if (evFotoPreview) evFotoPreview.src = url;
                        if (evFotoPreviewContainer) evFotoPreviewContainer.style.display = 'block';
                        if (evFotoFile) evFotoFile.value = '';
                    } else {
                        currentFotoBase64 = '';
                        if (evFotoPreviewContainer) evFotoPreviewContainer.style.display = 'none';
                    }
                };
            }
        }

        function renderTabelEvidence(data = dataEvidence) {
            if (!tbodyEvidence) return;
            tbodyEvidence.innerHTML = '';
            if (data.length === 0) {
                tbodyEvidence.innerHTML = `<tr><td colspan="8" style="text-align:center;">Belum ada data Evidence.</td></tr>`;
            } else {
                data.forEach((item, i) => {
                    let barangBadge = item.listBarang ? item.listBarang.map(b => `<span class="badge" style="background:#34495e; color:#fff; margin-bottom: 2px; display:inline-block;">${b.nama} (${b.jumlah})</span>`).join('<br>') : `<span class="badge">${item.barang || '-'} (${item.total || 0})</span>`;

                    let totalQty = item.listBarang ? item.listBarang.reduce((acc, curr) => acc + Number(curr.jumlah), 0) : (item.total || 0);

                    tbodyEvidence.innerHTML += `
            <tr>
                <td>${item.data ? item.data.replace('T', ' ') : '-'}</td>
                <td><strong>${item.incident || '-'}</strong><br><small style="color:gray">${item.mdtTidak || ''}</small></td>
                <td>${barangBadge}</td>
                <td><strong>${totalQty}</strong></td>
                <td><code>${item.code || '-'}</code></td>
                <td>${item.officer || '-'}</td>
                <td>${item.keterangan || '-'}</td>
                <td class="action-btns">
                    <button class="btn-review" onclick="reviewEvidence(${i})">Review</button>
                    <button class="btn-edit" onclick="editEvidence(${i})">Edit</button>
                    <button class="btn-delete" onclick="hapusEvidence(${i})">Hapus</button>
                </td>
            </tr>`;
                });
            }
            const elTotal = document.getElementById('totalEvidence');
            if (elTotal) elTotal.textContent = `TOTAL ${data.length} DATA`;
        }

        // Fungsi Buka Review Evidence
        window.reviewEvidence = (i) => {
            const item = dataEvidence[i];
            if (!item || !modalReviewEvidence) return;

            const revEvTanggal = document.getElementById('revEvTanggal');
            const revEvIncident = document.getElementById('revEvIncident');
            const revEvCode = document.getElementById('revEvCode');
            const revEvOfficer = document.getElementById('revEvOfficer');
            const revEvKeterangan = document.getElementById('revEvKeterangan');
            const revEvBarang = document.getElementById('revEvBarang');
            const imgEl = document.getElementById('revEvFoto');
            const noFotoEl = document.getElementById('revEvNoFoto');

            if (revEvTanggal) revEvTanggal.textContent = item.data ? item.data.replace('T', ' ') : '-';
            if (revEvIncident) revEvIncident.textContent = item.incident || '-';
            if (revEvCode) revEvCode.innerHTML = `<code>${item.code || '-'}</code>`;
            if (revEvOfficer) revEvOfficer.textContent = item.officer || '-';
            if (revEvKeterangan) revEvKeterangan.textContent = item.keterangan || '-';

            let barangBadge = item.listBarang ? item.listBarang.map(b => `<span class="badge" style="background:#34495e; color:#fff; margin: 2px; display:inline-block;">${b.nama} (${b.jumlah})</span>`).join(' ') : `<span class="badge">${item.barang || '-'} (${item.total || 0})</span>`;
            if (revEvBarang) revEvBarang.innerHTML = barangBadge;

            if (item.foto) {
                if (imgEl) { imgEl.src = item.foto; imgEl.style.display = 'inline-block'; }
                if (noFotoEl) noFotoEl.style.display = 'none';
            } else {
                if (imgEl) imgEl.style.display = 'none';
                if (noFotoEl) noFotoEl.style.display = 'inline-block';
            }

            modalReviewEvidence.style.display = 'flex';
        };

        // Event Listener Tutup Review
        if (closeModalReviewEvidence) {
            closeModalReviewEvidence.addEventListener('click', () => modalReviewEvidence.style.display = 'none');
        }
        if (btnTutupReviewEv) {
            btnTutupReviewEv.addEventListener('click', () => modalReviewEvidence.style.display = 'none');
        }

        const btnTambahEvidence = document.getElementById('btnTambahEvidence');
        if (btnTambahEvidence) {
            btnTambahEvidence.addEventListener('click', () => {
                formEvidence.reset();
                document.getElementById('editIndexEvidence').value = '';
                if (containerBarang) containerBarang.innerHTML = '';
                currentFotoBase64 = '';

                const evFotoPreviewContainer = document.getElementById('evFotoPreviewContainer');
                if (evFotoPreviewContainer) evFotoPreviewContainer.style.display = 'none';

                tambahBarisBarang();
                if (typeof populatePrawiraDropdown === 'function') {
                    populatePrawiraDropdown('evidenceOfficer');
                }

                initFotoHandlers();

                document.getElementById('modalTitleEvidence').textContent = 'Tambah Data Evidence';
                modalEvidence.style.display = 'flex';
            });
        }

        const closeModalEvidence = document.getElementById('closeModalEvidence');
        if (closeModalEvidence) {
            closeModalEvidence.addEventListener('click', () => modalEvidence.style.display = 'none');
        }

        if (formEvidence) {
            formEvidence.addEventListener('submit', (e) => {
                e.preventDefault();

                // 1. Ambil data baris barang
                const rows = containerBarang.querySelectorAll('.barang-row');
                const listBarang = [];

                rows.forEach(row => {
                    const nama = row.querySelector('.input-nama-barang').value;
                    const jumlah = row.querySelector('.input-jumlah-barang').value;
                    if (nama && jumlah) {
                        listBarang.push({ nama, jumlah });
                    }
                });

                // 2. Susun objek data baru
                const dataBaru = {
                    data: document.getElementById('evData').value,
                    code: document.getElementById('evCode').value,
                    incident: document.getElementById('evIncident').value,
                    mdtTidak: document.getElementById('evMdtTidak').value,
                    listBarang: listBarang,
                    foto: currentFotoBase64,
                    officer: document.getElementById('evidenceOfficer').value,
                    keterangan: document.getElementById('evKeterangan').value
                };

                const index = document.getElementById('editIndexEvidence').value;

                // 3. Simpan data dengan penanganan batas memori LocalStorage
                try {
                    if (index === '') {
                        dataEvidence.push(dataBaru);
                    } else {
                        dataEvidence[index] = dataBaru;
                    }

                    localStorage.setItem('dataEvidence', JSON.stringify(dataEvidence));

                    // Render ulang & tutup modal
                    renderTabelEvidence();
                    modalEvidence.style.display = 'none';
                    if (typeof updateRekapData === 'function') updateRekapData();

                } catch (error) {
                    alert("Gagal menyimpan! Ukuran foto terlalu besar untuk penyimpanan lokal. Gunakan link URL foto saja atau gunakan file gambar yang lebih kecil.");
                    console.error("Storage Error:", error);
                }
            });
        }

        window.editEvidence = (i) => {
            const item = dataEvidence[i];
            if (!item) return;

            document.getElementById('editIndexEvidence').value = i;
            document.getElementById('evData').value = item.data || '';
            document.getElementById('evCode').value = item.code || '';
            document.getElementById('evIncident').value = item.incident || '';
            document.getElementById('evMdtTidak').value = item.mdtTidak || '';

            if (typeof populatePrawiraDropdown === 'function') {
                populatePrawiraDropdown('evidenceOfficer', item.officer || '');
            }

            document.getElementById('evKeterangan').value = item.keterangan || '';

            // Handle foto saat Edit
            currentFotoBase64 = item.foto || '';
            const evFotoUrl = document.getElementById('evFotoUrl');
            const evFotoPreview = document.getElementById('evFotoPreview');
            const evFotoPreviewContainer = document.getElementById('evFotoPreviewContainer');

            if (item.foto) {
                if (evFotoUrl && item.foto.startsWith('http')) {
                    evFotoUrl.value = item.foto;
                }
                if (evFotoPreview) evFotoPreview.src = item.foto;
                if (evFotoPreviewContainer) evFotoPreviewContainer.style.display = 'block';
            } else {
                if (evFotoUrl) evFotoUrl.value = '';
                if (evFotoPreviewContainer) evFotoPreviewContainer.style.display = 'none';
            }

            initFotoHandlers();

            if (containerBarang) containerBarang.innerHTML = '';
            if (item.listBarang && item.listBarang.length > 0) {
                item.listBarang.forEach(b => tambahBarisBarang(b.nama, b.jumlah));
            } else {
                tambahBarisBarang(item.barang || '', item.total || '');
            }

            document.getElementById('modalTitleEvidence').textContent = 'Edit Data Evidence';
            modalEvidence.style.display = 'flex';
        };

        window.hapusEvidence = (i) => {
            if (confirm('Hapus data Evidence ini?')) {
                dataEvidence.splice(i, 1);
                localStorage.setItem('dataEvidence', JSON.stringify(dataEvidence));
                renderTabelEvidence();
                if (typeof updateRekapData === 'function') updateRekapData();
            }
        };

        const cariEvidenceInput = document.getElementById('cariEvidence');
        if (cariEvidenceInput) {
            cariEvidenceInput.addEventListener('input', (e) => {
                const keyword = e.target.value.toLowerCase();
                renderTabelEvidence(dataEvidence.filter(item =>
                    (item.incident && item.incident.toLowerCase().includes(keyword)) ||
                    (item.officer && item.officer.toLowerCase().includes(keyword))
                ));
            });
        }

        renderTabelEvidence();

        // --- APD MANAGEMENT (Withdraw Senjata & Deposit APD) ---
        let dataAPD = JSON.parse(localStorage.getItem('dataAPD')) || [];
        const tbodyAPD = document.getElementById('tabelAPDBody');
        const modalAPD = document.getElementById('modalAPD');
        const formAPD = document.getElementById('formAPD');
        const containerBarangAPD = document.getElementById('containerBarangAPD');
        const btnTambahBarangAPD = document.getElementById('btnTambahBarangAPD');

        // Fungsi menambah baris dinamis APD dengan Serial Number
        function tambahBarisBarangAPD(namaBarang = '', jumlah = '', serialNumber = '') {
            if (!containerBarangAPD) return;
            const div = document.createElement('div');
            div.className = 'barang-row-apd';
            div.style.cssText = 'display: flex; gap: 8px; align-items: center;';

            div.innerHTML = `
        <input type="text" class="input-nama-apd" placeholder="Nama Barang / Senjata..." value="${namaBarang}" required style="flex: 2;">
        <input type="number" class="input-jumlah-apd" placeholder="Jumlah" min="1" value="${jumlah || 1}" required style="width: 80px;">
        <input type="text" class="input-serial-apd" placeholder="Serial Number" value="${serialNumber}" style="flex: 1.5;">
        <button type="button" class="btn-remove-row" title="Hapus Barang" style="background: rgba(231, 76, 60, 0.2); color: #e74c3c; border: 1px solid #e74c3c; padding: 6px 10px; border-radius: 6px; cursor: pointer;">🗑</button>
    `;

            div.querySelector('.btn-remove-row').addEventListener('click', () => {
                if (containerBarangAPD.children.length > 1) {
                    div.remove();
                } else {
                    alert('Minimal harus ada 1 barang!');
                }
            });

            containerBarangAPD.appendChild(div);
        }

        if (btnTambahBarangAPD) {
            btnTambahBarangAPD.addEventListener('click', () => tambahBarisBarangAPD());
        }

        function renderTabelAPD(data = dataAPD) {
            if (!tbodyAPD) return;
            tbodyAPD.innerHTML = '';

            if (data.length === 0) {
                tbodyAPD.innerHTML = `<tr><td colspan="9" style="text-align:center;">Belum ada data APD / Senjata.</td></tr>`;
            } else {
                data.forEach((item, i) => {
                    const badgeClass = item.jenis === 'Withdraw Senjata' ? 'danger' : 'success';

                    // Format tampilan barang + Serial Number menggunakan badge gelap yang rapi
                    let barangBadge = '';
                    let totalQty = 0;

                    if (item.listBarang && Array.isArray(item.listBarang)) {
                        barangBadge = item.listBarang.map(b => {
                            const snText = b.serialNumber ? ` [SN: ${b.serialNumber}]` : '';
                            return `<span class="badge-item">${b.nama} (${b.jumlah})${snText}</span>`;
                        }).join('<br>');

                        totalQty = item.listBarang.reduce((acc, curr) => acc + Number(curr.jumlah), 0);
                    } else {
                        barangBadge = `<span class="badge-item">${item.barang || '-'} (${item.jumlah || 1})</span>`;
                        totalQty = item.jumlah || 1;
                    }

                    tbodyAPD.innerHTML += `
            <tr>
                <td>${item.tanggal ? item.tanggal.replace('T', ' ') : '-'}</td>
                <td>${item.officer || '-'}</td>
                <td>${item.nama || '-'}</td>
                <td><strong>${item.callSign || '-'}</strong></td>
                <td><span class="badge ${badgeClass}">${item.jenis}</span></td>
                <td>${barangBadge}</td>
                <td style="text-align: center;"><strong>${totalQty}</strong></td>
                <td>${item.keterangan || '-'}</td>
                <td class="action-btns">
                    <button class="btn-edit" onclick="editAPD(${i})">Edit</button>
                    <button class="btn-delete" onclick="hapusAPD(${i})">Hapus</button>
                </td>
            </tr>`;
                });
            }

            const totalEl = document.getElementById('totalAPD');
            if (totalEl) totalEl.textContent = `TOTAL ${data.length} DATA`;
        }

        const btnTambahAPD = document.getElementById('btnTambahAPD');
        if (btnTambahAPD) {
            btnTambahAPD.addEventListener('click', () => {
                formAPD.reset();
                document.getElementById('editIndexAPD').value = '';
                containerBarangAPD.innerHTML = '';
                tambahBarisBarangAPD();

                // Populate dropdown Officer dari Data Prawira
                populatePrawiraDropdown('apdOfficer');

                // Auto-fill tanggal & waktu saat ini
                const now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                document.getElementById('apdTanggal').value = now.toISOString().slice(0, 16);

                document.getElementById('modalTitleAPD').textContent = 'Tambah Transaksi APD';
                modalAPD.style.display = 'flex';
            });
        }

        const closeModalAPD = document.getElementById('closeModalAPD');
        if (closeModalAPD) {
            closeModalAPD.addEventListener('click', () => modalAPD.style.display = 'none');
        }

        if (formAPD) {
            formAPD.addEventListener('submit', (e) => {
                e.preventDefault();

                const rows = containerBarangAPD.querySelectorAll('.barang-row-apd');
                const listBarang = [];

                rows.forEach(row => {
                    const nama = row.querySelector('.input-nama-apd').value;
                    const jumlah = row.querySelector('.input-jumlah-apd').value;
                    const serialNumber = row.querySelector('.input-serial-apd').value;
                    if (nama && jumlah) {
                        listBarang.push({ nama, jumlah, serialNumber });
                    }
                });

                const dataBaru = {
                    tanggal: document.getElementById('apdTanggal').value,
                    officer: document.getElementById('apdOfficer').value,
                    nama: document.getElementById('apdNama').value,
                    callSign: document.getElementById('apdCallSign').value,
                    jenis: document.getElementById('apdJenis').value,
                    listBarang: listBarang,
                    keterangan: document.getElementById('apdKeterangan').value
                };

                const index = document.getElementById('editIndexAPD').value;
                if (index === '') dataAPD.push(dataBaru);
                else dataAPD[index] = dataBaru;

                localStorage.setItem('dataAPD', JSON.stringify(dataAPD));
                renderTabelAPD();
                modalAPD.style.display = 'none';
                updateRekapData();
            });
        }

        window.editAPD = (i) => {
            const item = dataAPD[i];
            document.getElementById('editIndexAPD').value = i;
            document.getElementById('apdTanggal').value = item.tanggal;

            // Populate dropdown Officer dan pilih sesuai data tersimpan
            populatePrawiraDropdown('apdOfficer', item.officer || '');

            document.getElementById('apdNama').value = item.nama;
            document.getElementById('apdCallSign').value = item.callSign;
            document.getElementById('apdJenis').value = item.jenis;
            document.getElementById('apdKeterangan').value = item.keterangan;

            containerBarangAPD.innerHTML = '';
            if (item.listBarang && item.listBarang.length > 0) {
                item.listBarang.forEach(b => tambahBarisBarangAPD(b.nama, b.jumlah, b.serialNumber));
            } else {
                tambahBarisBarangAPD(item.barang, item.jumlah, '');
            }

            document.getElementById('modalTitleAPD').textContent = 'Edit Transaksi APD';
            modalAPD.style.display = 'flex';
        };

        window.hapusAPD = (i) => {
            if (confirm('Hapus transaksi APD ini?')) {
                dataAPD.splice(i, 1);
                localStorage.setItem('dataAPD', JSON.stringify(dataAPD));
                renderTabelAPD();
                updateRekapData();
            }
        };

        const cariAPDInput = document.getElementById('cariAPD');
        if (cariAPDInput) {
            cariAPDInput.addEventListener('input', (e) => {
                const keyword = e.target.value.toLowerCase();
                renderTabelAPD(dataAPD.filter(item =>
                    (item.officer && item.officer.toLowerCase().includes(keyword)) ||
                    item.nama.toLowerCase().includes(keyword) ||
                    item.callSign.toLowerCase().includes(keyword) ||
                    item.jenis.toLowerCase().includes(keyword) ||
                    (item.listBarang && item.listBarang.some(b => b.nama.toLowerCase().includes(keyword) || (b.serialNumber && b.serialNumber.toLowerCase().includes(keyword)))) ||
                    (item.barang && item.barang.toLowerCase().includes(keyword))
                ));
            });
        }
        renderTabelAPD();

        // --- DATA KASUS KODE ETIK (DENGAN REVIEW, FOTO, & CRUD) ---
        let dataKodeEtik = JSON.parse(localStorage.getItem('dataKodeEtik')) || [];
        const tbodyKodeEtik = document.getElementById('tabelKodeEtikBody');
        const modalKodeEtik = document.getElementById('modalKodeEtik');
        const formKodeEtik = document.getElementById('formKodeEtik');

        // Modal Review Kode Etik
        const modalReviewKodeEtik = document.getElementById('modalReviewKodeEtik');
        const closeModalReviewKodeEtik = document.getElementById('closeModalReviewKodeEtik');
        const btnTutupReview = document.getElementById('btnTutupReview');

        // Variabel Penampung Foto Base64
        let currentKeFotoBase64 = '';

        function getBadgeDokumen(jenis) {
            if (jenis === 'SURAT PUTUSAN SIDANG KODE ETIK' || jenis === 'SURAT KEPUTUSAN SIDANG KODE ETIK') {
                return '<span class="badge danger" style="background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;">SIDANG ETIK</span>';
            } else if (jenis === 'SURAT PEMANGGILAN') {
                return '<span class="badge warning" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a;">PEMANGGILAN</span>';
            } else if (jenis === 'SURAT HASIL PEMERIKSAAN NARKOTIKA ANGGOTA') {
                return '<span class="badge danger" style="background:#fce7f3; color:#9d174d; border:1px solid #fbcfe8;">TES NARKOTIKA</span>';
            } else if (jenis.includes('PROKER') || jenis === 'LAPORAN HARIAN') {
                return '<span class="badge success" style="background:#dcfce7; color:#15803d; border:1px solid #bbf7d0;">PROKER / LAPORAN</span>';
            } else if (jenis === 'SOP RESIGN' || jenis === 'LOCKER APD ANGGOTA RESIGN') {
                return '<span class="badge" style="background:#f3e8ff; color:#6b21a8; border:1px solid #e9d5ff;">RESIGN</span>';
            } else if (jenis === 'SURAT DNA TEST') {
                return '<span class="badge" style="background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd;">DNA TEST</span>';
            } else if (jenis === 'SURAT PENGELUARAN BARANG EVIDENCE') {
                return '<span class="badge warning" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a;">EVIDENCE OUT</span>';
            }
            return '<span class="badge">' + (jenis || 'DOKUMEN') + '</span>';
        }

        // Inisialisasi Handler Event Input & Upload Foto
        function initKeFotoHandlers() {
            const keFotoUrl = document.getElementById('keFotoUrl');
            const keFotoFile = document.getElementById('keFotoFile');
            const keFotoPreview = document.getElementById('keFotoPreview');
            const keFotoPreviewContainer = document.getElementById('keFotoPreviewContainer');

            if (keFotoFile) {
                keFotoFile.onchange = function (e) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function (evt) {
                            currentKeFotoBase64 = evt.target.result;
                            if (keFotoPreview) keFotoPreview.src = currentKeFotoBase64;
                            if (keFotoPreviewContainer) keFotoPreviewContainer.style.display = 'block';
                            if (keFotoUrl) keFotoUrl.value = '';
                        };
                        reader.readAsDataURL(file);
                    }
                };
            }

            if (keFotoUrl) {
                keFotoUrl.oninput = function (e) {
                    const url = e.target.value.trim();
                    if (url) {
                        currentKeFotoBase64 = url;
                        if (keFotoPreview) keFotoPreview.src = url;
                        if (keFotoPreviewContainer) keFotoPreviewContainer.style.display = 'block';
                        if (keFotoFile) keFotoFile.value = '';
                    } else {
                        currentKeFotoBase64 = '';
                        if (keFotoPreviewContainer) keFotoPreviewContainer.style.display = 'none';
                    }
                };
            }
        }

        function renderTabelKodeEtik(data = dataKodeEtik) {
            if (!tbodyKodeEtik) return;
            tbodyKodeEtik.innerHTML = '';

            if (data.length === 0) {
                tbodyKodeEtik.innerHTML = `<tr><td colspan="6" style="text-align:center;">Belum ada data dokumen Kode Etik.</td></tr>`;
            } else {
                data.forEach((item, i) => {
                    const formatTanggal = item.tanggal ? item.tanggal.replace('T', ' ') : '-';
                    tbodyKodeEtik.innerHTML += `
            <tr>
                <td>${formatTanggal}</td>
                <td>
                    ${getBadgeDokumen(item.jenis)}<br>
                    <small style="color:var(--muted); font-size:10px;">${item.jenis || ''}</small>
                </td>
                <td><strong>${item.personel || '-'}</strong></td>
                <td>${item.officer || '-'}</td>
                <td>${item.keterangan || '-'}</td>
                <td class="action-btns">
                    <button class="btn-review" onclick="reviewKodeEtik(${i})">Review</button>
                    <button class="btn-edit" onclick="editKodeEtik(${i})">Edit</button>
                    <button class="btn-delete" onclick="hapusKodeEtik(${i})">Hapus</button>
                </td>
            </tr>`;
                });
            }
            const elTotal = document.getElementById('totalKodeEtik');
            if (elTotal) elTotal.textContent = `TOTAL ${data.length} DATA`;
        }

        // Buka Modal Review
        window.reviewKodeEtik = (i) => {
            const item = dataKodeEtik[i];
            if (!item || !modalReviewKodeEtik) return;

            const revTanggal = document.getElementById('revTanggal');
            const revJenis = document.getElementById('revJenis');
            const revPersonel = document.getElementById('revPersonel');
            const revOfficer = document.getElementById('revOfficer');
            const revKeterangan = document.getElementById('revKeterangan');
            const imgEl = document.getElementById('revKeFoto');
            const noFotoEl = document.getElementById('revKeNoFoto');

            if (revTanggal) revTanggal.textContent = item.tanggal ? item.tanggal.replace('T', ' ') : '-';
            if (revJenis) revJenis.innerHTML = getBadgeDokumen(item.jenis) + ` <br><small style="color:gray;">${item.jenis || ''}</small>`;
            if (revPersonel) revPersonel.textContent = item.personel || '-';
            if (revOfficer) revOfficer.textContent = item.officer || '-';
            if (revKeterangan) revKeterangan.textContent = item.keterangan || '-';

            if (item.foto) {
                if (imgEl) { imgEl.src = item.foto; imgEl.style.display = 'inline-block'; }
                if (noFotoEl) noFotoEl.style.display = 'none';
            } else {
                if (imgEl) imgEl.style.display = 'none';
                if (noFotoEl) noFotoEl.style.display = 'inline-block';
            }

            modalReviewKodeEtik.style.display = 'flex';
        };

        if (closeModalReviewKodeEtik) {
            closeModalReviewKodeEtik.addEventListener('click', () => modalReviewKodeEtik.style.display = 'none');
        }
        if (btnTutupReview) {
            btnTutupReview.addEventListener('click', () => modalReviewKodeEtik.style.display = 'none');
        }

        const btnTambahKodeEtik = document.getElementById('btnTambahKodeEtik');
        if (btnTambahKodeEtik) {
            btnTambahKodeEtik.addEventListener('click', () => {
                formKodeEtik.reset();
                document.getElementById('editIndexKodeEtik').value = '';
                currentKeFotoBase64 = '';

                const keFotoPreviewContainer = document.getElementById('keFotoPreviewContainer');
                if (keFotoPreviewContainer) keFotoPreviewContainer.style.display = 'none';

                if (typeof populatePrawiraDropdown === 'function') {
                    populatePrawiraDropdown('kePersonel');
                    populatePrawiraDropdown('keOfficer');
                }

                const now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                document.getElementById('keTanggal').value = now.toISOString().slice(0, 16);

                initKeFotoHandlers();

                document.getElementById('modalTitleKodeEtik').textContent = 'Tambah Dokumen Kode Etik';
                modalKodeEtik.style.display = 'flex';
            });
        }

        const closeModalKodeEtik = document.getElementById('closeModalKodeEtik');
        if (closeModalKodeEtik) {
            closeModalKodeEtik.addEventListener('click', () => modalKodeEtik.style.display = 'none');
        }

        if (formKodeEtik) {
            formKodeEtik.addEventListener('submit', (e) => {
                e.preventDefault();

                const dataBaru = {
                    tanggal: document.getElementById('keTanggal').value,
                    jenis: document.getElementById('keJenisDokumen').value,
                    personel: document.getElementById('kePersonel').value,
                    officer: document.getElementById('keOfficer').value,
                    keterangan: document.getElementById('keKeterangan').value,
                    foto: currentKeFotoBase64
                };

                const index = document.getElementById('editIndexKodeEtik').value;
                if (index === '') dataKodeEtik.push(dataBaru);
                else dataKodeEtik[index] = dataBaru;

                localStorage.setItem('dataKodeEtik', JSON.stringify(dataKodeEtik));
                renderTabelKodeEtik();
                modalKodeEtik.style.display = 'none';
                if (typeof updateRekapData === 'function') updateRekapData();
            });
        }

        window.editKodeEtik = (i) => {
            const item = dataKodeEtik[i];
            if (!item) return;

            document.getElementById('editIndexKodeEtik').value = i;
            document.getElementById('keTanggal').value = item.tanggal || '';
            document.getElementById('keJenisDokumen').value = item.jenis || '';

            if (typeof populatePrawiraDropdown === 'function') {
                populatePrawiraDropdown('kePersonel', item.personel || '');
                populatePrawiraDropdown('keOfficer', item.officer || '');
            }

            document.getElementById('keKeterangan').value = item.keterangan || '';

            // Handle Tampilan Foto
            currentKeFotoBase64 = item.foto || '';
            const keFotoUrl = document.getElementById('keFotoUrl');
            const keFotoPreview = document.getElementById('keFotoPreview');
            const keFotoPreviewContainer = document.getElementById('keFotoPreviewContainer');

            if (item.foto) {
                if (keFotoUrl && item.foto.startsWith('http')) {
                    keFotoUrl.value = item.foto;
                }
                if (keFotoPreview) keFotoPreview.src = item.foto;
                if (keFotoPreviewContainer) keFotoPreviewContainer.style.display = 'block';
            } else {
                if (keFotoUrl) keFotoUrl.value = '';
                if (keFotoPreviewContainer) keFotoPreviewContainer.style.display = 'none';
            }

            initKeFotoHandlers();

            document.getElementById('modalTitleKodeEtik').textContent = 'Edit Dokumen Kode Etik';
            modalKodeEtik.style.display = 'flex';
        };

        window.hapusKodeEtik = (i) => {
            if (confirm('Hapus dokumen kode etik ini?')) {
                dataKodeEtik.splice(i, 1);
                localStorage.setItem('dataKodeEtik', JSON.stringify(dataKodeEtik));
                renderTabelKodeEtik();
                if (typeof updateRekapData === 'function') updateRekapData();
            }
        };

        const cariKodeEtikInput = document.getElementById('cariKodeEtik');
        if (cariKodeEtikInput) {
            cariKodeEtikInput.addEventListener('input', (e) => {
                const keyword = e.target.value.toLowerCase();
                renderTabelKodeEtik(dataKodeEtik.filter(item =>
                    (item.jenis && item.jenis.toLowerCase().includes(keyword)) ||
                    (item.personel && item.personel.toLowerCase().includes(keyword)) ||
                    (item.officer && item.officer.toLowerCase().includes(keyword)) ||
                    (item.keterangan && item.keterangan.toLowerCase().includes(keyword))
                ));
            });
        }

        renderTabelKodeEtik();

        // --- CASE IN GOING ---
        let dataCase = JSON.parse(localStorage.getItem('dataCaseingoing')) || [];
        const tbodyCase = document.getElementById('tabelCaseBody');
        const modalCase = document.getElementById('modalCase');
        const formCase = document.getElementById('formCase');
        const modalReviewCase = document.getElementById('modalReviewCase');

        let currentCaseFotoBase64 = '';

        function initCaseFotoHandlers() {
            const caseFotoUrl = document.getElementById('caseFotoUrl');
            const caseFotoFile = document.getElementById('caseFotoFile');
            const caseFotoPreview = document.getElementById('caseFotoPreview');
            const caseFotoPreviewContainer = document.getElementById('caseFotoPreviewContainer');

            if (caseFotoFile) {
                caseFotoFile.onchange = function (e) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function (evt) {
                            currentCaseFotoBase64 = evt.target.result;
                            if (caseFotoPreview) caseFotoPreview.src = currentCaseFotoBase64;
                            if (caseFotoPreviewContainer) caseFotoPreviewContainer.style.display = 'block';
                            if (caseFotoUrl) caseFotoUrl.value = '';
                        };
                        reader.readAsDataURL(file);
                    }
                };
            }

            if (caseFotoUrl) {
                caseFotoUrl.oninput = function (e) {
                    const url = e.target.value.trim();
                    if (url) {
                        currentCaseFotoBase64 = url;
                        if (caseFotoPreview) caseFotoPreview.src = url;
                        if (caseFotoPreviewContainer) caseFotoPreviewContainer.style.display = 'block';
                        if (caseFotoFile) caseFotoFile.value = '';
                    } else {
                        currentCaseFotoBase64 = '';
                        if (caseFotoPreviewContainer) caseFotoPreviewContainer.style.display = 'none';
                    }
                };
            }
        }

        function renderTabelCase(data = dataCase) {
            if (!tbodyCase) return;
            tbodyCase.innerHTML = '';

            if (data.length === 0) {
                tbodyCase.innerHTML = `<tr><td colspan="7" style="text-align:center;">Belum ada data Case In Going.</td></tr>`;
            } else {
                data.forEach((item, i) => {
                    const formatTanggal = item.date ? item.date.replace('T', ' ') : '-';
                    const fotoBadge = item.foto
                        ? `<button class="btn-review" onclick="reviewCase(${i})">Lihat Foto</button>`
                        : `<span style="color:var(--muted); font-size:11px;">Tidak ada</span>`;

                    tbodyCase.innerHTML += `
            <tr>
                <td>${formatTanggal}</td>
                <td><strong>${item.no || '-'}</strong></td>
                <td>${item.nama || '-'}</td>
                <td>${item.officer || '-'}</td>
                <td>${item.keterangan || '-'}</td>
                <td style="text-align: center;">${fotoBadge}</td>
                <td class="action-btns" style="justify-content: center;">
                    <button class="btn-edit" onclick="editCase(${i})">Edit</button>
                    <button class="btn-delete" onclick="hapusCase(${i})">Hapus</button>
                </td>
            </tr>`;
                });
            }

            const totalEl = document.getElementById('totalCase');
            if (totalEl) totalEl.textContent = `TOTAL ${data.length} DATA`;
        }

        window.reviewCase = (i) => {
            const item = dataCase[i];
            if (!item || !modalReviewCase) return;

            document.getElementById('revCaseDate').textContent = item.date ? item.date.replace('T', ' ') : '-';
            document.getElementById('revCaseNo').textContent = item.no || '-';
            document.getElementById('revCaseNama').textContent = item.nama || '-';
            document.getElementById('revCaseOfficer').textContent = item.officer || '-';
            document.getElementById('revCaseKeterangan').textContent = item.keterangan || '-';

            const imgEl = document.getElementById('revCaseFoto');
            const noFotoEl = document.getElementById('revCaseNoFoto');

            if (item.foto) {
                if (imgEl) { imgEl.src = item.foto; imgEl.style.display = 'inline-block'; }
                if (noFotoEl) noFotoEl.style.display = 'none';
            } else {
                if (imgEl) imgEl.style.display = 'none';
                if (noFotoEl) noFotoEl.style.display = 'inline-block';
            }

            modalReviewCase.style.display = 'flex';
        };

        const closeModalReviewCase = document.getElementById('closeModalReviewCase');
        const btnTutupReviewCase = document.getElementById('btnTutupReviewCase');

        if (closeModalReviewCase) closeModalReviewCase.addEventListener('click', () => modalReviewCase.style.display = 'none');
        if (btnTutupReviewCase) btnTutupReviewCase.addEventListener('click', () => modalReviewCase.style.display = 'none');

        const btnTambahCase = document.getElementById('btnTambahCase');
        if (btnTambahCase) {
            btnTambahCase.addEventListener('click', () => {
                formCase.reset();
                document.getElementById('editIndexCase').value = '';
                currentCaseFotoBase64 = '';

                const previewContainer = document.getElementById('caseFotoPreviewContainer');
                if (previewContainer) previewContainer.style.display = 'none';

                if (typeof populatePrawiraDropdown === 'function') {
                    populatePrawiraDropdown('caseOfficer');
                }

                const now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                document.getElementById('caseDate').value = now.toISOString().slice(0, 16);

                initCaseFotoHandlers();

                document.getElementById('modalTitleCase').textContent = 'Tambah Case In Going';
                modalCase.style.display = 'flex';
            });
        }

        const closeModalCase = document.getElementById('closeModalCase');
        if (closeModalCase) {
            closeModalCase.addEventListener('click', () => modalCase.style.display = 'none');
        }

        if (formCase) {
            formCase.addEventListener('submit', (e) => {
                e.preventDefault();

                const dataBaru = {
                    date: document.getElementById('caseDate').value,
                    no: document.getElementById('caseNo').value,
                    nama: document.getElementById('caseNama').value,
                    officer: document.getElementById('caseOfficer').value,
                    keterangan: document.getElementById('caseKeterangan').value,
                    foto: currentCaseFotoBase64
                };

                const index = document.getElementById('editIndexCase').value;
                if (index === '') dataCase.push(dataBaru);
                else dataCase[index] = dataBaru;

                localStorage.setItem('dataCaseingoing', JSON.stringify(dataCase));
                renderTabelCase();
                modalCase.style.display = 'none';
                if (typeof updateRekapData === 'function') updateRekapData();
            });
        }

        window.editCase = (i) => {
            const item = dataCase[i];
            if (!item) return;

            document.getElementById('editIndexCase').value = i;
            document.getElementById('caseDate').value = item.date || '';
            document.getElementById('caseNo').value = item.no || '';
            document.getElementById('caseNama').value = item.nama || '';

            if (typeof populatePrawiraDropdown === 'function') {
                populatePrawiraDropdown('caseOfficer', item.officer || '');
            }

            document.getElementById('caseKeterangan').value = item.keterangan || '';

            currentCaseFotoBase64 = item.foto || '';
            const caseFotoUrl = document.getElementById('caseFotoUrl');
            const caseFotoPreview = document.getElementById('caseFotoPreview');
            const caseFotoPreviewContainer = document.getElementById('caseFotoPreviewContainer');

            if (item.foto) {
                if (caseFotoUrl && item.foto.startsWith('http')) {
                    caseFotoUrl.value = item.foto;
                }
                if (caseFotoPreview) caseFotoPreview.src = item.foto;
                if (caseFotoPreviewContainer) caseFotoPreviewContainer.style.display = 'block';
            } else {
                if (caseFotoUrl) caseFotoUrl.value = '';
                if (caseFotoPreviewContainer) caseFotoPreviewContainer.style.display = 'none';
            }

            initCaseFotoHandlers();

            document.getElementById('modalTitleCase').textContent = 'Edit Case In Going';
            modalCase.style.display = 'flex';
        };

        window.hapusCase = (i) => {
            if (confirm('Hapus kasus ini?')) {
                dataCase.splice(i, 1);
                localStorage.setItem('dataCaseingoing', JSON.stringify(dataCase));
                renderTabelCase();
                if (typeof updateRekapData === 'function') updateRekapData();
            }
        };

        const cariCaseInput = document.getElementById('cariCase');
        if (cariCaseInput) {
            cariCaseInput.addEventListener('input', (e) => {
                const keyword = e.target.value.toLowerCase();
                renderTabelCase(dataCase.filter(item =>
                    (item.no && item.no.toLowerCase().includes(keyword)) ||
                    (item.nama && item.nama.toLowerCase().includes(keyword)) ||
                    (item.officer && item.officer.toLowerCase().includes(keyword)) ||
                    (item.keterangan && item.keterangan.toLowerCase().includes(keyword))
                ));
            });
        }

        renderTabelCase();

        // --- KALKULASI REKAP DATA & AKUMULASI BARANG EVIDENCE ---
        function updateRekapData() {
            const jumlahPrawira = dataPrawira.length;
            const jumlahMDT = dataMDT.length;
            const jumlahEvidence = dataEvidence.length;
            const jumlahAPD = dataAPD.length;
            const jumlahKodeEtik = dataKodeEtik.length;
            const jumlahCase = dataCase.length;

            // FIX 1: Tambahkan jumlahCase dan jumlahAPD ke totalSemua
            const totalSemua = jumlahPrawira + jumlahMDT + jumlahEvidence + jumlahAPD + jumlahKodeEtik + jumlahCase;

            if (document.getElementById('dash-prawira')) {
                document.getElementById('dash-prawira').textContent = jumlahPrawira;
                document.getElementById('dash-mdt').textContent = jumlahMDT;
                document.getElementById('dash-evidence').textContent = jumlahEvidence;
                document.getElementById('dash-apd').textContent = jumlahAPD;
                document.getElementById('dash-kodeetik').textContent = jumlahKodeEtik;
                document.getElementById('dash-caseingoing').textContent = jumlahCase;
                document.getElementById('dash-total').textContent = totalSemua;
            }

            if (document.getElementById('rekap-prawira')) {
                document.getElementById('rekap-prawira').textContent = jumlahPrawira;
                document.getElementById('rekap-mdt').textContent = jumlahMDT;
                document.getElementById('rekap-evidence').textContent = jumlahEvidence;
                document.getElementById('rekap-apd').textContent = jumlahAPD; // FIX 2: Menunjuk ke ID rekap-apd
                document.getElementById('rekap-kodeetik').textContent = jumlahKodeEtik;
                document.getElementById('rekap-caseingoing').textContent = jumlahCase;
                document.getElementById('rekap-total').textContent = totalSemua;
            }

            // Panggil fungsi render rekap barang evidence
            renderRekapBarangEvidence();
        }

        // Fungsi untuk menjumlahkan total per nama barang dari seluruh data evidence
        function renderRekapBarangEvidence(filterKeyword = '') {
            const tbodyRekap = document.getElementById('tabelRekapBarangBody');
            if (!tbodyRekap) return;

            const rekapBarangMap = {};

            dataEvidence.forEach(item => {
                if (item.listBarang && Array.isArray(item.listBarang)) {
                    item.listBarang.forEach(b => {
                        if (b.nama) {
                            const nama = b.nama.trim();
                            const qty = Number(b.jumlah) || 0;
                            rekapBarangMap[nama] = (rekapBarangMap[nama] || 0) + qty;
                        }
                    });
                } else if (item.barang) {
                    const nama = item.barang.trim();
                    const qty = Number(item.total) || 0;
                    rekapBarangMap[nama] = (rekapBarangMap[nama] || 0) + qty;
                }
            });

            let listBarangAggregated = Object.keys(rekapBarangMap).map(key => ({
                nama: key,
                totalQty: rekapBarangMap[key]
            }));

            if (filterKeyword) {
                listBarangAggregated = listBarangAggregated.filter(b =>
                    b.nama.toLowerCase().includes(filterKeyword.toLowerCase())
                );
            }

            tbodyRekap.innerHTML = '';

            if (listBarangAggregated.length === 0) {
                tbodyRekap.innerHTML = `<tr><td colspan="3" style="text-align:center;">Tidak ada data barang evidence.</td></tr>`;
            } else {
                listBarangAggregated.forEach((item, index) => {
                    tbodyRekap.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${item.nama}</strong></td>
                    <td style="text-align: right;"><span class="badge success" style="font-size: 11px;">${item.totalQty.toLocaleString('id-ID')} Pcs</span></td>
                </tr>`;
                });
            }
        }

        // FIX 3: Jalankan kalkulasi awal saat halaman selesai dimuat
        updateRekapData();

        // Event listener pencarian barang di menu Rekap Semua
        const cariRekapInput = document.getElementById('cariRekapBarang');
        if (cariRekapInput) {
            cariRekapInput.addEventListener('input', (e) => {
                renderRekapBarangEvidence(e.target.value);
            });
        }
    }
});

/* =====================================
   FIX GLOBAL DATA PRAWIRA (Pasti Jalan)
===================================== */

// Data Inisialisasi
window.dataPrawira = JSON.parse(localStorage.getItem('dataPrawira')) || [];

// 1. Fungsi Render Tabel
window.renderTabelPrawira = function () {
    const tbody = document.getElementById('tabelPrawiraBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (window.dataPrawira.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Belum ada data.</td></tr>`;
    } else {
        window.dataPrawira.forEach((item, i) => {
            tbody.innerHTML += `
            <tr>
                <td><strong>${item.callSign || '-'}</strong></td>
                <td><span class="badge">${item.pangkat || '-'}</span></td>
                <td>${item.nama || '-'}</td>
                <td>${item.jk || '-'}</td>
                <td>${item.tanggungJawab || '-'}</td>
                <td class="action-btns">
                    <button class="btn-edit" type="button" onclick="editPrawira(${i})">Edit</button>
                    <button class="btn-delete" type="button" onclick="hapusPrawira(${i})">Hapus</button>
                </td>
            </tr>`;
        });
    }

    const elTotal = document.getElementById('totalPrawira');
    if (elTotal) elTotal.textContent = `TOTAL ${window.dataPrawira.length} DATA`;
};

// 2. Fungsi Buka Modal Tambah
window.bukaModalPrawira = function () {
    const modal = document.getElementById('modalPrawira');
    const form = document.getElementById('formPrawira');
    if (form) form.reset();

    const editIdx = document.getElementById('editIndex');
    if (editIdx) editIdx.value = '';

    const title = document.getElementById('modalTitle');
    if (title) title.textContent = 'Tambah Data Prawira';

    if (modal) modal.style.setProperty('display', 'flex', 'important');
};

// 3. Fungsi Buka Modal Edit
window.editPrawira = function (i) {
    const item = window.dataPrawira[i];
    const modal = document.getElementById('modalPrawira');
    if (!item || !modal) return;

    document.getElementById('editIndex').value = i;
    document.getElementById('callSign').value = item.callSign || '';
    document.getElementById('pangkat').value = item.pangkat || '';
    document.getElementById('nama').value = item.nama || '';
    document.getElementById('jk').value = item.jk || '';
    document.getElementById('tanggungJawab').value = item.tanggungJawab || '';

    const title = document.getElementById('modalTitle');
    if (title) title.textContent = 'Edit Data Prawira';

    modal.style.setProperty('display', 'flex', 'important');
};

// 4. Fungsi Hapus Data
window.hapusPrawira = function (i) {
    if (confirm('Hapus data Prawira ini?')) {
        window.dataPrawira.splice(i, 1);
        localStorage.setItem('dataPrawira', JSON.stringify(window.dataPrawira));
        window.renderTabelPrawira();
        if (typeof updateRekapData === 'function') updateRekapData();
    }
};

// 5. Inisialisasi Event Listener setelah Halaman Dimuat
document.addEventListener("DOMContentLoaded", function () {
    // Tombol Tambah
    const btnTambah = document.getElementById('btnTambahPrawira');
    if (btnTambah) {
        btnTambah.addEventListener('click', window.bukaModalPrawira);
    }

    // Tombol Tutup Modal
    const btnClose = document.getElementById('closeModal');
    const modal = document.getElementById('modalPrawira');
    if (btnClose && modal) {
        btnClose.addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }

    // Submit Form
    const form = document.getElementById('formPrawira');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const dataBaru = {
                callSign: document.getElementById('callSign').value,
                pangkat: document.getElementById('pangkat').value,
                nama: document.getElementById('nama').value,
                jk: document.getElementById('jk').value,
                tanggungJawab: document.getElementById('tanggungJawab').value
            };

            const index = document.getElementById('editIndex').value;

            if (index === '') {
                window.dataPrawira.push(dataBaru);
            } else {
                window.dataPrawira[index] = dataBaru;
            }

            localStorage.setItem('dataPrawira', JSON.stringify(window.dataPrawira));
            window.renderTabelPrawira();

            if (modal) modal.style.display = 'none';
            if (typeof updateRekapData === 'function') updateRekapData();
        });
    }

    // Input Pencarian
    const cariInput = document.getElementById('cariPrawira');
    if (cariInput) {
        cariInput.addEventListener('input', function (e) {
            const keyword = e.target.value.toLowerCase();
            window.renderTabelPrawira(window.dataPrawira.filter(item =>
                (item.nama && item.nama.toLowerCase().includes(keyword)) ||
                (item.callSign && item.callSign.toLowerCase().includes(keyword))
            ));
        });
    }

    // Render Awal
    window.renderTabelPrawira();
});
