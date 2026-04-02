// src/data/questions.js
// Bank soal Bible Duel — tambah/edit sesuai kebutuhan

export const categories = [
  { id: 'tebak-jawaban', label: '📝 Tebak Jawaban' },
  { id: 'tebak-tokoh',   label: '🤔 Tebak Tokoh' },
]

export const questionsByCategory = {

  // ── Kategori 1: Tebak Jawaban ────────────────────────────
  'tebak-jawaban': [
  {
    text: 'Siapakah yang membunuh Goliat?',
    options: ['Saul', 'Daud', 'Yonatan', 'Absalom'],
    answer: 'Daud'
  },
  {
    text: 'Berapa hari Yesus berpuasa di padang gurun?',
    options: ['20 hari', '30 hari', '40 hari', '50 hari'],
    answer: '40 hari'
  },
  {
    text: 'Di kota manakah Yesus dilahirkan?',
    options: ['Nazaret', 'Yerusalem', 'Betlehem', 'Kapernaum'],
    answer: 'Betlehem'
  },
  {
    text: 'Siapakah murid Yesus yang mengkhianati-Nya?',
    options: ['Petrus', 'Yohanes', 'Tomas', 'Yudas Iskariot'],
    answer: 'Yudas Iskariot'
  },
  {
    text: 'Kitab apakah yang pertama dalam Perjanjian Lama?',
    options: ['Keluaran', 'Kejadian', 'Imamat', 'Mazmur'],
    answer: 'Kejadian'
  },
  {
    text: 'Siapakah yang membangun bahtera (kapal besar) untuk menyelamatkan hewan dari banjir?',
    options: ['Abraham', 'Musa', 'Nuh', 'Daud'],
    answer: 'Nuh'
  },
  {
    text: 'Berapa banyak murid (rasul) yang dipilih Yesus?',
    options: ['7', '10', '12', '14'],
    answer: '12'
  },
  {
    text: 'Di sungai manakah Yesus dibaptis?',
    options: ['Sungai Yordan', 'Sungai Nil', 'Sungai Efrat', 'Sungai Tigris'],
    answer: 'Sungai Yordan'
  },
  {
    text: 'Siapakah yang membaptis Yesus?',
    options: ['Petrus', 'Yohanes Pembaptis', 'Filipus', 'Andreas'],
    answer: 'Yohanes Pembaptis'
  },
  {
    text: 'Buku apakah yang terakhir dalam Alkitab?',
    options: ['Yudas', 'Ibrani', 'Wahyu', '1 Yohanes'],
    answer: 'Wahyu'
  },
  {
    text: 'Siapakah yang pertama kali melihat kebangkitan Yesus?',
    options: ['Maria Magdalena', 'Petrus', 'Yohanes', 'Maria ibu Yesus'],
    answer: 'Maria Magdalena'
  },
  {
    text: 'Dalam peristiwa apa Musa membelah laut?',
    options: ['Perjalanan ke Kanaan', 'Keluaran dari Mesir', 'Pertempuran Yeriko', 'Perjalanan ke Sinai'],
    answer: 'Keluaran dari Mesir'
  },
  {
    text: 'Siapakah raja Israel yang pertama?',
    options: ['Daud', 'Salomo', 'Saul', 'Yosafat'],
    answer: 'Saul'
  },
  {
    text: 'Berapa lama Yusuf dipenjara di Mesir sebelum dibebaskan?',
    options: ['1 tahun', '2 tahun', '5 tahun', '10 tahun'],
    answer: '2 tahun'
  },
  {
    text: 'Di gunung manakah Musa menerima 10 perintah Allah?',
    options: ['Gunung Zion', 'Gunung Sinai', 'Gunung Karmel', 'Gunung Ararat'],
    answer: 'Gunung Sinai'
  },
  ],

  // ── Kategori 2: Tebak Tokoh Alkitab (Emoji) ─────────────
  // Klue berupa emoji, peserta menebak nama tokoh Alkitab
  'tebak-tokoh': [
  {
    type: 'tebak-tokoh',
    text: '🏕️ ⭐ 🐏',
    options: ['Abraham', 'Ishak', 'Yakub', 'Lot'],
    answer: 'Abraham'
    // Tenda (nomad), bintang (keturunan bak bintang), domba jantan (pengorbanan di Moria)
  },
  {
    type: 'tebak-tokoh',
    text: '🌊 🪨 🐍',
    options: ['Musa', 'Harun', 'Yosua', 'Kaleb'],
    answer: 'Musa'
    // Laut Merah terbelah, air dari batu, ular tembaga di tiang
  },
  {
    type: 'tebak-tokoh',
    text: '🌊 🕊️ 🌈',
    options: ['Nuh', 'Abraham', 'Set', 'Lamekh'],
    answer: 'Nuh'
    // Banjir besar, merpati membawa daun zaitun, pelangi perjanjian
  },
  {
    type: 'tebak-tokoh',
    text: '🎵 🦁 ⚔️',
    options: ['Daud', 'Saul', 'Yonatan', 'Absalom'],
    answer: 'Daud'
    // Pemain kecapi/mazmur, membunuh singa, pahlawan perang (Goliat)
  },
  {
    type: 'tebak-tokoh',
    text: '👑 🏛️ 💎',
    options: ['Salomo', 'Daud', 'Rehabeam', 'Yosafat'],
    answer: 'Salomo'
    // Mahkota raja, membangun Bait Suci, hikmat/kekayaan
  },
  {
    type: 'tebak-tokoh',
    text: '💪 ✂️ 🦁',
    options: ['Simson', 'Gideon', 'Yefta', 'Barak'],
    answer: 'Simson'
    // Kekuatan luar biasa, Delila memotong rambutnya, membunuh singa dengan tangan kosong
  },
  {
    type: 'tebak-tokoh',
    text: '🌈 👘 🌾',
    options: ['Yusuf', 'Benyamin', 'Ruben', 'Yehuda'],
    answer: 'Yusuf'
    // Jubah berwarna-warni, mimpi (7 bulir gandum), gandum di Mesir
  },
  {
    type: 'tebak-tokoh',
    text: '🦁 🙏 🌙',
    options: ['Daniel', 'Sadrakh', 'Mesakh', 'Abednego'],
    answer: 'Daniel'
    // Kandang singa, berdoa 3 kali sehari, di Babel (bulan sabit = Babel)
  },
  {
    type: 'tebak-tokoh',
    text: '🔥 🌧️ 🐦',
    options: ['Elia', 'Elisa', 'Yesaya', 'Yeremia'],
    answer: 'Elia'
    // Api dari langit di Karmel, mengakhiri kekeringan, gagak membawakan makanan di Kerit
  },
  {
    type: 'tebak-tokoh',
    text: '🐟 🔑 ⛵',
    options: ['Petrus', 'Andreas', 'Yakobus', 'Yohanes'],
    answer: 'Petrus'
    // Nelayan, kunci kerajaan surga, berjalan di atas air / perahu
  },
  {
    type: 'tebak-tokoh',
    text: '⚡ 📜 🚢',
    options: ['Paulus', 'Barnabas', 'Silas', 'Timotius'],
    answer: 'Paulus'
    // Kilat di jalan Damaskus, surat-surat kiriman, kapal karam
  },
  {
    type: 'tebak-tokoh',
    text: '🦅 📖 🏝️',
    options: ['Yohanes', 'Yakobus', 'Petrus', 'Andreas'],
    answer: 'Yohanes'
    // Lambang elang, menulis Wahyu, diasingkan di Pulau Patmos
  },
  {
    type: 'tebak-tokoh',
    text: '🙏 👶 ⛪',
    options: ['Hana', 'Rut', 'Naomi', 'Debora'],
    answer: 'Hana'
    // Berdoa memohon anak, lahirlah Samuel, bernazar menyerahkan anak ke Bait Suci
  },
  {
    type: 'tebak-tokoh',
    text: '🌾 ❤️ 🤝',
    options: ['Rut', 'Naomi', 'Orpa', 'Rahab'],
    answer: 'Rut'
    // Memungut jelai di ladang, kesetiaan pada mertua, perjanjian setia bersama Naomi
  },
  {
    type: 'tebak-tokoh',
    text: '👼 🎁 ✨',
    options: ['Maria', 'Elisabet', 'Anna', 'Miriam'],
    answer: 'Maria'
    // Malaikat Jibril datang, bayi Yesus sebagai anugerah, bintang Betlehem
  },
  ],
}

// Backward compat — tetap bisa diimpor dengan nama lama
export const questions = questionsByCategory['tebak-jawaban']

