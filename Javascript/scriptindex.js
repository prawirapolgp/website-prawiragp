/* =====================================
    KONFIGURASI FIREBASE REALTIME DATABASE
===================================== */
const firebaseConfig = {
    // Sesuaikan URL database Firebase Anda jika berbeda
    databaseURL: "https://websiteprawiragp-default-rtdb.firebaseio.com"
};

// Inisialisasi Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

/* =====================================
    DATA LOGIN ADMIN & USER
===================================== */
const ADMIN_USERNAME = "prawiragp";
const ADMIN_PASSWORD = "polgpontop";

const USER_USERNAME = "userprawira";
const USER_PASSWORD = "user123";

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
            e.stopPropagation();
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle("active-mobile");
            } else {
                sidebar.classList.toggle("collapsed");
                if (mainContent) mainContent.classList.toggle("expanded");
            }
        });
    }

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

    if (currentPage.includes("dashboard") || currentPage === "") {
        if (isLoggedIn !== "true") {
            alert("AKSES DITOLAK!\nSilakan login terlebih dahulu.");
            sessionStorage.clear();
            window.location.replace("index.html");
        }

        const namaAkun = sessionStorage.getItem("userName");
        if (namaAkun) {
            document.querySelectorAll('.admin-mini strong, .profile strong').forEach(el => el.textContent = namaAkun);
            document.querySelectorAll('.admin-mini small, .profile small').forEach(el => {
                el.textContent = (currentRole === "administrator") ? "Administrator" : "Anggota Prawira";
            });
        }

        if (currentRole === "anggota") {
            const styleRestriction = document.createElement('style');
            styleRestriction.innerHTML = `.btn-delete { display: none !important; }`;
            document.head.appendChild(styleRestriction);
        }
    }

/* =====================================
HALAMAN LOGIN (index.html)
===================================== */

// Fungsi Login yang dipanggil langsung oleh tombol
window.prosesLogin = function() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const errorMessage = document.getElementById("errorMessage");

    if (!usernameInput || !passwordInput) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (errorMessage) errorMessage.style.display = "none";

    // 1. CEK LOGIN ADMIN DEFAULT
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sessionStorage.setItem("adminLoggedIn", "true");
        sessionStorage.setItem("userRole", "administrator");
        sessionStorage.setItem("userName", "Administrator");

        // Upload/sinkronisasi data lokal ke Firebase jika ada
        if (typeof syncLocalStorageToFirebase === "function") {
            syncLocalStorageToFirebase();
        }

        window.location.href = "dashboard.html";
        return;
    }

    // 2. CEK LOGIN USER (ANGGOTA) DEFAULT
    if (username === USER_USERNAME && password === USER_PASSWORD) {
        sessionStorage.setItem("adminLoggedIn", "true");
        sessionStorage.setItem("userRole", "anggota");
        sessionStorage.setItem("userName", "Anggota Prawira");

        window.location.href = "dashboard.html";
        return;
    }

    // 3. CEK LOGIN DARI DATA PRAWIRA LOKAL
    let dataAnggota = JSON.parse(localStorage.getItem('dataPrawira')) || [];
    const cekAkun = dataAnggota.find(user => user.username === username && user.password === password);

    if (cekAkun) {
        sessionStorage.setItem("adminLoggedIn", "true");
        sessionStorage.setItem("userRole", cekAkun.role || "anggota");
        sessionStorage.setItem("userName", cekAkun.nama);

        window.location.href = "dashboard.html";
        return;
    }

    // JIKA TIDAK COCOK
    if (errorMessage) {
        errorMessage.textContent = "Username atau password salah!";
        errorMessage.style.display = "block";
    }
    passwordInput.value = "";
};

/* =====================================
   TOGGLE SHOW / HIDE PASSWORD
===================================== */
window.togglePasswordVisibility = function () {
    const passwordInput = document.getElementById("password");
    const toggleBtn = document.getElementById("togglePassword");

    if (!passwordInput || !toggleBtn) return;

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleBtn.textContent = "🙈"; // Ubah ke ikon mata tertutup saat password terlihat
    } else {
        passwordInput.type = "password";
        toggleBtn.textContent = "👁️"; // Ubah ke ikon mata terbuka saat password tersembunyi
    }
};

// Mencegah form reload jika tombol Enter ditekan
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            window.prosesLogin();
        });
    }
});

    /* =====================================
       LOGOUT
    ===================================== */
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            sessionStorage.clear();
            window.location.replace("index.html");
        });
    }

    /* =====================================
       SISTEM CRUD DASHBOARD DENGAN FIREBASE
    ===================================== */
    if (document.getElementById('tabelPrawiraBody')) {

        let globalDataPrawira = {};
        let globalDataMDT = {};
        let globalDataEvidence = {};
        let globalDataAPD = {};
        let globalDataKodeEtik = {};
        let globalDataCase = {};

        // Helper untuk populate dropdown Prawira
        function populatePrawiraDropdown(selectElementId, selectedValue = '') {
            const selectEl = document.getElementById(selectElementId);
            if (!selectEl) return;

            selectEl.innerHTML = '<option value="" disabled selected>Pilih Officer dari Data Prawira...</option>';
            const keys = Object.keys(globalDataPrawira);

            if (keys.length === 0) {
                selectEl.innerHTML = '<option value="" disabled>Belum ada Data Prawira</option>';
                return;
            }

            keys.forEach(key => {
                const p = globalDataPrawira[key];
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

        // --- 1. DATA PRAWIRA (REALTIME) ---
        const tbodyPrawira = document.getElementById('tabelPrawiraBody');
        const modalPrawira = document.getElementById('modalPrawira');
        const formPrawira = document.getElementById('formPrawira');
        const btnTambahPrawira = document.getElementById('btnTambahPrawira');
        const closeModalPrawira = document.getElementById('closeModal');

        db.ref('prawira').on('value', snapshot => {
            globalDataPrawira = snapshot.val() || {};
            renderTabelPrawira();
            updateRekapData();
        });

        function renderTabelPrawira(dataObj = globalDataPrawira) {
            if (!tbodyPrawira) return;
            tbodyPrawira.innerHTML = '';
            const keys = Object.keys(dataObj);

            if (keys.length === 0) {
                tbodyPrawira.innerHTML = `<tr><td colspan="6" style="text-align:center;">Belum ada data.</td></tr>`;
            } else {
                keys.forEach(key => {
                    const item = dataObj[key];
                    tbodyPrawira.innerHTML += `
                    <tr>
                        <td><strong>${item.callSign || '-'}</strong></td>
                        <td><span class="badge">${item.pangkat || '-'}</span></td>
                        <td>${item.nama || '-'}</td>
                        <td>${item.jk || '-'}</td>
                        <td>${item.tanggungJawab || '-'}</td>
                        <td class="action-btns">
                            <button class="btn-edit" onclick="editPrawira('${key}')">Edit</button>
                            <button class="btn-delete" onclick="hapusPrawira('${key}')">Hapus</button>
                        </td>
                    </tr>`;
                });
            }
            const elTotal = document.getElementById('totalPrawira');
            if (elTotal) elTotal.textContent = `TOTAL ${keys.length} DATA`;
        }

        if (btnTambahPrawira && modalPrawira && formPrawira) {
            btnTambahPrawira.addEventListener('click', () => {
                formPrawira.reset();
                document.getElementById('editIndex').value = '';
                document.getElementById('modalTitle').textContent = 'Tambah Data Prawira';
                modalPrawira.style.display = 'flex';
            });
        }

        if (closeModalPrawira && modalPrawira) {
            closeModalPrawira.addEventListener('click', () => modalPrawira.style.display = 'none');
        }

        if (formPrawira) {
            formPrawira.addEventListener('submit', (e) => {
                e.preventDefault();
                const key = document.getElementById('editIndex').value;
                const dataBaru = {
                    callSign: document.getElementById('callSign').value,
                    pangkat: document.getElementById('pangkat').value,
                    nama: document.getElementById('nama').value,
                    jk: document.getElementById('jk').value,
                    tanggungJawab: document.getElementById('tanggungJawab').value
                };

                if (key) {
                    db.ref('prawira/' + key).update(dataBaru);
                } else {
                    db.ref('prawira').push(dataBaru);
                }
                modalPrawira.style.display = 'none';
            });
        }

        window.editPrawira = (key) => {
            const item = globalDataPrawira[key];
            if (!item) return;

            document.getElementById('editIndex').value = key;
            document.getElementById('callSign').value = item.callSign || '';
            document.getElementById('pangkat').value = item.pangkat || '';
            document.getElementById('nama').value = item.nama || '';
            document.getElementById('jk').value = item.jk || '';
            document.getElementById('tanggungJawab').value = item.tanggungJawab || '';

            document.getElementById('modalTitle').textContent = 'Edit Data Prawira';
            modalPrawira.style.display = 'flex';
        };

        window.hapusPrawira = (key) => {
            if (confirm('Hapus data Prawira ini?')) {
                db.ref('prawira/' + key).remove();
            }
        };

        // --- 2. LIST MDT (REALTIME) ---
        const tbodyMDT = document.getElementById('tabelMDTBody');
        const modalMDT = document.getElementById('modalMDT');
        const formMDT = document.getElementById('formMDT');
        let currentMdtFotoBase64 = '';

        function getBadge(status) {
            if (status === 'Lengkap' || status === 'Disetorkan') return '<span class="badge success">' + status + '</span>';
            if (status === 'Tidak Lengkap') return '<span class="badge warning">' + status + '</span>';
            return '<span class="badge danger">' + status + '</span>';
        }

        db.ref('mdt').on('value', snapshot => {
            globalDataMDT = snapshot.val() || {};
            renderTabelMDT();
            updateRekapData();
        });

        function renderTabelMDT(dataObj = globalDataMDT) {
            if (!tbodyMDT) return;
            tbodyMDT.innerHTML = '';
            const keys = Object.keys(dataObj);

            if (keys.length === 0) {
                tbodyMDT.innerHTML = `<tr><td colspan="8" style="text-align:center;">Belum ada data MDT.</td></tr>`;
            } else {
                keys.forEach(key => {
                    const item = dataObj[key];
                    const formatTanggal = item.tanggal ? item.tanggal.replace('T', ' ') : '-';
                    tbodyMDT.innerHTML += `
                    <tr>
                        <td>${formatTanggal}</td>
                        <td><strong>${item.no || '-'}</strong></td>
                        <td>${item.komando || '-'}</td>
                        <td>${item.officer || '-'}</td>
                        <td>${getBadge(item.statusMDT)}</td>
                        <td>${getBadge(item.statusSetor)}</td>
                        <td>${item.keterangan || '-'}</td>
                        <td class="action-btns">
                            <button class="btn-review" onclick="reviewMDT('${key}')">Review</button>
                            <button class="btn-edit" onclick="editMDT('${key}')">Edit</button>
                            <button class="btn-delete" onclick="hapusMDT('${key}')">Hapus</button>
                        </td>
                    </tr>`;
                });
            }
            const elTotal = document.getElementById('totalMDT');
            if (elTotal) elTotal.textContent = `TOTAL ${keys.length} DATA`;
        }

        window.reviewMDT = (key) => {
            const item = globalDataMDT[key];
            const modalReviewMDT = document.getElementById('modalReviewMDT');
            if (!item || !modalReviewMDT) return;

            document.getElementById('revMdtTanggal').textContent = item.tanggal ? item.tanggal.replace('T', ' ') : '-';
            document.getElementById('revMdtNo').textContent = item.no || '-';
            document.getElementById('revMdtKomando').textContent = item.komando || '-';
            document.getElementById('revMdtOfficer').textContent = item.officer || '-';
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

        const btnTambahMDT = document.getElementById('btnTambahMDT');
        if (btnTambahMDT) {
            btnTambahMDT.addEventListener('click', () => {
                formMDT.reset();
                document.getElementById('editIndexMDT').value = '';
                document.getElementById('modalTitleMDT').textContent = 'Tambah List MDT';
                currentMdtFotoBase64 = '';

                populatePrawiraDropdown('mdtOfficer');
                const now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                document.getElementById('mdtTanggal').value = now.toISOString().slice(0, 16);

                modalMDT.style.display = 'flex';
            });
        }

        const closeModalMDT = document.getElementById('closeModalMDT');
        if (closeModalMDT) closeModalMDT.addEventListener('click', () => modalMDT.style.display = 'none');

        if (formMDT) {
            formMDT.addEventListener('submit', (e) => {
                e.preventDefault();
                const key = document.getElementById('editIndexMDT').value;
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

                if (key) {
                    db.ref('mdt/' + key).update(dataBaru);
                } else {
                    db.ref('mdt').push(dataBaru);
                }
                modalMDT.style.display = 'none';
            });
        }

        window.editMDT = (key) => {
            const item = globalDataMDT[key];
            if (!item) return;

            document.getElementById('editIndexMDT').value = key;
            document.getElementById('mdtTanggal').value = item.tanggal || '';
            document.getElementById('mdtNo').value = item.no || '';
            document.getElementById('mdtKomando').value = item.komando || '';

            populatePrawiraDropdown('mdtOfficer', item.officer || '');

            document.getElementById('mdtStatus').value = item.statusMDT || '';
            document.getElementById('mdtSetor').value = item.statusSetor || '';
            document.getElementById('mdtKeterangan').value = item.keterangan || '';
            currentMdtFotoBase64 = item.foto || '';

            document.getElementById('modalTitleMDT').textContent = 'Edit List MDT';
            modalMDT.style.display = 'flex';
        };

        window.hapusMDT = (key) => {
            if (confirm('Hapus data MDT ini?')) {
                db.ref('mdt/' + key).remove();
            }
        };

        // --- 3. DATA EVIDENCE (REALTIME) ---
        const tbodyEvidence = document.getElementById('tabelEvidenceBody');
        const modalEvidence = document.getElementById('modalEvidence');
        const formEvidence = document.getElementById('formEvidence');

        db.ref('evidence').on('value', snapshot => {
            globalDataEvidence = snapshot.val() || {};
            renderTabelEvidence();
            updateRekapData();
        });

        function renderTabelEvidence(dataObj = globalDataEvidence) {
            if (!tbodyEvidence) return;
            tbodyEvidence.innerHTML = '';
            const keys = Object.keys(dataObj);

            if (keys.length === 0) {
                tbodyEvidence.innerHTML = `<tr><td colspan="8" style="text-align:center;">Belum ada data Evidence.</td></tr>`;
            } else {
                keys.forEach(key => {
                    const item = dataObj[key];
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
                            <button class="btn-review" onclick="reviewEvidence('${key}')">Review</button>
                            <button class="btn-edit" onclick="editEvidence('${key}')">Edit</button>
                            <button class="btn-delete" onclick="hapusEvidence('${key}')">Hapus</button>
                        </td>
                    </tr>`;
                });
            }
            const elTotal = document.getElementById('totalEvidence');
            if (elTotal) elTotal.textContent = `TOTAL ${keys.length} DATA`;
        }

        window.hapusEvidence = (key) => {
            if (confirm('Hapus data Evidence ini?')) {
                db.ref('evidence/' + key).remove();
            }
        };

        // --- 4. APD MANAGEMENT (REALTIME) ---
        db.ref('apd').on('value', snapshot => {
            globalDataAPD = snapshot.val() || {};
            renderTabelAPD();
            updateRekapData();
        });

        function renderTabelAPD(dataObj = globalDataAPD) {
            const tbodyAPD = document.getElementById('tabelAPDBody');
            if (!tbodyAPD) return;
            tbodyAPD.innerHTML = '';
            const keys = Object.keys(dataObj);

            if (keys.length === 0) {
                tbodyAPD.innerHTML = `<tr><td colspan="9" style="text-align:center;">Belum ada data APD / Senjata.</td></tr>`;
            } else {
                keys.forEach(key => {
                    const item = dataObj[key];
                    const badgeClass = item.jenis === 'Withdraw Senjata' ? 'danger' : 'success';
                    let barangBadge = item.listBarang ? item.listBarang.map(b => `${b.nama} (${b.jumlah})`).join('<br>') : (item.barang || '-');
                    let totalQty = item.listBarang ? item.listBarang.reduce((acc, curr) => acc + Number(curr.jumlah), 0) : (item.jumlah || 1);

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
                            <button class="btn-edit" onclick="editAPD('${key}')">Edit</button>
                            <button class="btn-delete" onclick="hapusAPD('${key}')">Hapus</button>
                        </td>
                    </tr>`;
                });
            }
            const totalEl = document.getElementById('totalAPD');
            if (totalEl) totalEl.textContent = `TOTAL ${keys.length} DATA`;
        }

        window.hapusAPD = (key) => {
            if (confirm('Hapus transaksi APD ini?')) {
                db.ref('apd/' + key).remove();
            }
        };

        // --- 5. KODE ETIK (REALTIME) ---
        db.ref('kodeetik').on('value', snapshot => {
            globalDataKodeEtik = snapshot.val() || {};
            renderTabelKodeEtik();
            updateRekapData();
        });

        function renderTabelKodeEtik(dataObj = globalDataKodeEtik) {
            const tbodyKodeEtik = document.getElementById('tabelKodeEtikBody');
            if (!tbodyKodeEtik) return;
            tbodyKodeEtik.innerHTML = '';
            const keys = Object.keys(dataObj);

            if (keys.length === 0) {
                tbodyKodeEtik.innerHTML = `<tr><td colspan="6" style="text-align:center;">Belum ada data dokumen Kode Etik.</td></tr>`;
            } else {
                keys.forEach(key => {
                    const item = dataObj[key];
                    tbodyKodeEtik.innerHTML += `
                    <tr>
                        <td>${item.tanggal ? item.tanggal.replace('T', ' ') : '-'}</td>
                        <td>${item.jenis || '-'}</td>
                        <td><strong>${item.personel || '-'}</strong></td>
                        <td>${item.officer || '-'}</td>
                        <td>${item.keterangan || '-'}</td>
                        <td class="action-btns">
                            <button class="btn-review" onclick="reviewKodeEtik('${key}')">Review</button>
                            <button class="btn-edit" onclick="editKodeEtik('${key}')">Edit</button>
                            <button class="btn-delete" onclick="hapusKodeEtik('${key}')">Hapus</button>
                        </td>
                    </tr>`;
                });
            }
            const elTotal = document.getElementById('totalKodeEtik');
            if (elTotal) elTotal.textContent = `TOTAL ${keys.length} DATA`;
        }

        window.hapusKodeEtik = (key) => {
            if (confirm('Hapus dokumen kode etik ini?')) {
                db.ref('kodeetik/' + key).remove();
            }
        };

        // --- 6. CASE IN GOING (REALTIME) ---
        db.ref('caseingoing').on('value', snapshot => {
            globalDataCase = snapshot.val() || {};
            renderTabelCase();
            updateRekapData();
        });

        function renderTabelCase(dataObj = globalDataCase) {
            const tbodyCase = document.getElementById('tabelCaseBody');
            if (!tbodyCase) return;
            tbodyCase.innerHTML = '';
            const keys = Object.keys(dataObj);

            if (keys.length === 0) {
                tbodyCase.innerHTML = `<tr><td colspan="7" style="text-align:center;">Belum ada data Case In Going.</td></tr>`;
            } else {
                keys.forEach(key => {
                    const item = dataObj[key];
                    tbodyCase.innerHTML += `
                    <tr>
                        <td>${item.date ? item.date.replace('T', ' ') : '-'}</td>
                        <td><strong>${item.no || '-'}</strong></td>
                        <td>${item.nama || '-'}</td>
                        <td>${item.officer || '-'}</td>
                        <td>${item.keterangan || '-'}</td>
                        <td style="text-align: center;">${item.foto ? `<button class="btn-review" onclick="reviewCase('${key}')">Lihat Foto</button>` : 'Tidak ada'}</td>
                        <td class="action-btns">
                            <button class="btn-edit" onclick="editCase('${key}')">Edit</button>
                            <button class="btn-delete" onclick="hapusCase('${key}')">Hapus</button>
                        </td>
                    </tr>`;
                });
            }
            const totalEl = document.getElementById('totalCase');
            if (totalEl) totalEl.textContent = `TOTAL ${keys.length} DATA`;
        }

        window.hapusCase = (key) => {
            if (confirm('Hapus kasus ini?')) {
                db.ref('caseingoing/' + key).remove();
            }
        };

        // --- KALKULASI REKAP DATA REALTME ---
        function updateRekapData() {
            const jumlahPrawira = Object.keys(globalDataPrawira).length;
            const jumlahMDT = Object.keys(globalDataMDT).length;
            const jumlahEvidence = Object.keys(globalDataEvidence).length;
            const jumlahAPD = Object.keys(globalDataAPD).length;
            const jumlahKodeEtik = Object.keys(globalDataKodeEtik).length;
            const jumlahCase = Object.keys(globalDataCase).length;

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
                document.getElementById('rekap-apd').textContent = jumlahAPD;
                document.getElementById('rekap-kodeetik').textContent = jumlahKodeEtik;
                document.getElementById('rekap-caseingoing').textContent = jumlahCase;
                document.getElementById('rekap-total').textContent = totalSemua;
            }
        }
    }
});
