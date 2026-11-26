
let dataAbsensi = JSON.parse(
    localStorage.getItem("absensi")
) || [];

let editId = null;

// Mengisi tanggal hari ini
document.getElementById("tanggal").value =
    new Date().toISOString().split("T")[0];

// Menyimpan data absensi
document.getElementById("formAbsensi")
.addEventListener("submit", function(e) {

    e.preventDefault();

    let nama = document.getElementById("nama").value;
    let nis = document.getElementById("nis").value;
    let status = document.getElementById("status").value;
    let tanggal = document.getElementById("tanggal").value;

    // Mencegah absensi ganda
    let dataLama = dataAbsensi.find(item =>
        item.nis === nis &&
        item.tanggal === tanggal &&
        item.id !== editId
    );

    if (dataLama) {
        alert("Siswa sudah diabsen pada tanggal tersebut!");
        return;
    }

    // Jika sedang mengedit
    if (editId !== null) {

        let index = dataAbsensi.findIndex(
            item => item.id === editId
        );

        dataAbsensi[index] = {
            id: editId,
            nama,
            nis,
            status,
            tanggal
        };

        editId = null;

    } else {

        // Menambahkan data baru
        dataAbsensi.push({
            id: Date.now(),
            nama,
            nis,
            status,
            tanggal
        });
    }

    simpanData();
    tampilkanData();

    this.reset();

    document.getElementById("tanggal").value =
        new Date().toISOString().split("T")[0];
});

// Menyimpan data ke LocalStorage
function simpanData() {

    localStorage.setItem(
        "absensi",
        JSON.stringify(dataAbsensi)
    );
}

// Menghitung persentase kehadiran
function hitungKehadiran(nis) {

    let dataSiswa = dataAbsensi.filter(
        item => item.nis === nis
    );

    let jumlahHadir = dataSiswa.filter(
        item => item.status === "Hadir"
    ).length;

    if (dataSiswa.length === 0) {
        return 0;
    }

    return Math.round(
        (jumlahHadir / dataSiswa.length) * 100
    );
}

// Menampilkan data absensi
function tampilkanData() {

    let tabel = document.getElementById("tabel");

    let cari = document.getElementById("cari")
        .value.toLowerCase();

    tabel.innerHTML = "";

    let hasil = dataAbsensi.filter(item =>
        item.nama.toLowerCase().includes(cari) ||
        item.nis.toLowerCase().includes(cari)
    );

    hasil.forEach((item, index) => {

        let persen = hitungKehadiran(item.nis);

        tabel.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${item.nama}</td>
            <td>${item.nis}</td>
            <td>${item.tanggal}</td>

            <td>
                <span class="status ${item.status}">
                    ${item.status}
                </span>
            </td>

            <td>${persen}%</td>

            <td>
                <button class="btn-edit"
                    onclick="editData(${item.id})">
                    Edit
                </button>

                <button class="btn-delete"
                    onclick="hapusData(${item.id})">
                    Hapus
                </button>
            </td>
        </tr>
        `;
    });

    // Rekap total siswa
    document.getElementById("total").innerText =
        new Set(dataAbsensi.map(item => item.nis)).size;

    // Rekap status
    document.getElementById("hadir").innerText =
        dataAbsensi.filter(item =>
            item.status === "Hadir"
        ).length;

    document.getElementById("izin").innerText =
        dataAbsensi.filter(item =>
            item.status === "Izin"
        ).length;

    document.getElementById("sakit").innerText =
        dataAbsensi.filter(item =>
            item.status === "Sakit"
        ).length;

    document.getElementById("alfa").innerText =
        dataAbsensi.filter(item =>
            item.status === "Alfa"
        ).length;
}

// Fitur pencarian
document.getElementById("cari")
.addEventListener("input", tampilkanData);

// Menghapus data
function hapusData(id) {

    if (confirm("Yakin ingin menghapus data ini?")) {

        dataAbsensi = dataAbsensi.filter(
            item => item.id !== id
        );

        simpanData();
        tampilkanData();
    }
}

// Mengedit data
function editData(id) {

    let item = dataAbsensi.find(
        data => data.id === id
    );

    document.getElementById("nama").value = item.nama;
    document.getElementById("nis").value = item.nis;
    document.getElementById("status").value = item.status;
    document.getElementById("tanggal").value = item.tanggal;

    editId = id;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Menampilkan data saat aplikasi dibuka
tampilkanData();
