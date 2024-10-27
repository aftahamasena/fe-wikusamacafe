import React from 'react';
import logo from '../../assets/logo.png';

const Nota = ({ transaction }) => {
  const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Nota Transaksi</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap" rel="stylesheet">
            <style>
              body { font-family: 'Courier Prime', monospace; }
              .label { font-weight: bold; }
            </style>
          </head>
          <body class="font-mono">
            <div class="w-full max-w-sm mx-auto border border-gray-300 rounded-lg p-5">
              <div class="text-center">
                <img src="${logo}" alt="Wikusama Cafe" class="w-32 h-auto mx-auto mb-2" />
                <h2 class="text-2xl font-semibold text-gray-900">Wikusama Cafe</h2>
                <p class="text-sm text-gray-500">Jl. Danau Ranau, Sawojajar, Kota Malang, Jawa Timur</p>
              </div>
              
              <div class="mt-6 space-y-2">
                <div class="flex justify-between">
                  <span class="label">Tanggal Pembelian:</span>
                  <span>${new Date(transaction.tgl_transaksi).toLocaleDateString()}</span>
                </div>
                <div class="flex justify-between">
                  <span class="label">Nama Kasir:</span>
                  <span>${transaction.user.nama_user}</span>
                </div>
                <div class="flex justify-between">
                  <span class="label">Nama Pelanggan:</span>
                  <span>${transaction.nama_pelanggan}</span>
                </div>
              </div>

              <div class="mt-6">
                <h4 class="text-lg font-semibold">Menu yang Dibeli:</h4>
                <div class="mt-2 space-y-1">
                  ${
                    Array.isArray(transaction.detail_transaksi) &&
                    transaction.detail_transaksi.length > 0
                      ? transaction.detail_transaksi
                          .map(
                            (item) => `
                            <div class="flex justify-between">
                              <span>${item.menu.nama_menu} (${item.qty})</span>
                              <span>${(item.harga * item.qty).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                            </div>
                          `
                          )
                          .join('')
                      : '<p class="text-red-500">Tidak ada item yang dibeli.</p>'
                  }
                </div>
              </div>

              <div class="mt-6">
                <div class="flex justify-between">
                  <span class="text-lg font-bold">Total Harga:</span>
                  <span class="text-lg font-bold">${transaction.total_harga.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                </div>
                <div class="flex justify-between mt-2">
                  <span class="font-semibold">Status Pembayaran:</span>
                  <span class="${transaction.status === 'lunas' ? 'text-green-600' : 'text-red-600'} font-semibold">
                    ${transaction.status === 'lunas' ? 'Lunas' : 'Belum Bayar'}
                  </span>
                </div>
              </div>

              <div class="mt-6 text-center text-sm text-red-500">
                <p>Terima kasih atas kunjungan Anda!</p>
                <p>Semoga hari Anda menyenangkan.</p>
              </div>
            </div>

            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 5000);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <button
      onClick={printReceipt}
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200"
    >
      Print
    </button>
  );
};

export default Nota;
