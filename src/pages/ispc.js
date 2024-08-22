import Head from "next/head";
import Script from "next/script";
import { Inter } from "next/font/google";
import React, { useState, useEffect, useRef } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [price, setPrice] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedNamaLengkap, setSelectedNamaLengkap] = useState("");
  const [selectNamaSekolah, setselectNamaSekolah] = useState(""); // Menambah state untuk Nama Sekolah
  const [selectEmailKetua, setselectEmailKetua] = useState(""); // Menambah state untuk Email Ketua team
  const [selectKategoriMedali, setselectKategoriMedali] = useState(""); // Menambah state untuk Nama Sekolah
  const [phone, setPhone] = useState(""); // Menambah state untuk phone (Nomor WhatsApp)
  const adminFee = 4500;

  // Create a reference for the "Nama Ketua Tim" field
  const namaKetuaRef = useRef(null);
  const NamaSekolahRef = useRef(null);
  const EmailKetuaRef = useRef(null);
  const KategoriMedaliRef = useRef(null);

  const generateUniqueId = () => {
    const timestamp = new Date().getTime();
    return `PM-ISPC${timestamp}`;
  };

  const generateFormData = (
    selectedCategory,
    price,
    uniqueId,
    selectedNamaLengkap,
    phone,
    selectEmailKetua
  ) => {
    const formattedPrice = Math.max(Math.floor(price), 1);
    const totalPrice = formattedPrice + adminFee;

    const names = selectedNamaLengkap.split("\n");
    const ketua = names.length > 0 ? names[0] : "";

    return {
      transactionDetails: {
        order_id: uniqueId,
        gross_amount: totalPrice.toString(),
      },
      customerDetails: {
        first_name: ketua,
        phone: phone,
        email: selectEmailKetua,
        notes: "Thank you",
      },
      itemDetails: [
        {
          id: uniqueId,
          name: selectedCategory,
          price: formattedPrice.toString(),
          quantity: "1",
        },
        {
          id: `${uniqueId}-admin`,
          name: "Admin Fee",
          price: adminFee.toString(),
          quantity: "1",
        },
      ],
    };
  };

  const getMidtransToken = async (formData) => {
    try {
      const response = await fetch("/api/getMidtransToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        return data.token;
      } else {
        throw new Error(data.error || "Failed to get token");
      }
    } catch (error) {
      console.error("Error mendapatkan token:", error);
      return null;
    }
  };

  const handlePayment = async () => {
    if (
      selectedCategory !== "1 Medali" &&
      selectedCategory !== "2 Medali" &&
      selectedCategory !== "3 Medali" &&
      selectedCategory !== "4 Medali" &&
      selectedCategory !== "5 Medali" &&
      selectedCategory !== "6 Medali" &&
      selectedCategory !== "7 Medali"
    ) {
      alert("Anda harus memilih berapa banyak medali yang ingin digandakan.");
      return;
    }

    if (!selectedNamaLengkap) {
      alert("Nama Ketua Tim harus diisi.");
      namaKetuaRef.current?.focus(); // Fokuskan ke textarea Nama Ketua Tim
      namaKetuaRef.current?.scrollIntoView({ behavior: "smooth" }); // Gulung tampilan ke elemen
      return;
    } else if (selectedNamaLengkap.length > 180) {
      alert("Maksimal Penulisan Nama Ketua dan Anggota 180 karakter");
      namaKetuaRef.current?.focus(); // Fokuskan ke textarea Nama Ketua Tim
      namaKetuaRef.current?.scrollIntoView({ behavior: "smooth" }); // Gulung tampilan ke elemen
      return;
    }

    if (!selectNamaSekolah) {
      alert("Nama Sekolah harus diisi.");
      NamaSekolahRef.current?.focus(); // Fokuskan ke textarea Nama Ketua Tim
      NamaSekolahRef.current?.scrollIntoView({ behavior: "smooth" }); // Gulung tampilan ke elemen
      return;
    }

    if (!selectEmailKetua) {
      alert("Email Ketua harus diisi.");
      return;
    }

    if (!phone) {
      alert("Nomor telepon ketua tim harus diisi");
      return; // Menghentikan eksekusi fungsi jika phone belum diisi
    } else if (phone.length < 5 || phone.length > 20) {
      alert(
        "Nomor telepon harus memiliki panjang antara 5 hingga 20 karakter."
      );
      return; // Menghentikan eksekusi fungsi jika panjang phone tidak sesuai
    }

    if (!selectKategoriMedali) {
      alert("Kategori Medali harus diisi.");
      return;
    }

    const newUniqueId = generateUniqueId();
    setUniqueId(newUniqueId);

    const formData = generateFormData(
      selectedCategory,
      price,
      newUniqueId,
      selectedNamaLengkap,
      phone,
      selectEmailKetua
    );

    const token = await getMidtransToken(formData);

    if (token) {
      window.snap.pay(token, {
        onSuccess: function (result) {
          console.log("Pembayaran sukses:", result);
          // Tindakan setelah pembayaran sukses
        },
        onPending: function (result) {
          console.log("Pembayaran tertunda:", result);
          // Tindakan setelah pembayaran tertunda
        },
        onError: function (result) {
          console.log("Kesalahan pembayaran:", result);
          // Tindakan setelah pembayaran gagal
        },
        onClose: function () {
          console.log("Popup pembayaran ditutup");
          // Tindakan ketika pengguna menutup popup
        },
      });
    }
  };

  useEffect(() => {
    if (selectedCategory === "1 Medali") {
      setPrice("250000");
    } else if (selectedCategory === "2 Medali") {
      setPrice("500000");
    } else if (selectedCategory === "3 Medali") {
      setPrice("750000");
    } else if (selectedCategory === "4 Medali") {
      setPrice("1000000");
    } else if (selectedCategory === "5 Medali") {
      setPrice("1250000");
    } else if (selectedCategory === "6 Medali") {
      setPrice("1500000");
    } else if (selectedCategory === "7 Medali") {
      setPrice("1750000");
    } else {
      setPrice("");
    }
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  useEffect(() => {
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbxssIw4Qmv8qa1wkhCcr5uFNlromlapysft9fSeYSek43gdRcLQynPfj9x25g-4efsWwg/exec";

    const form = document.forms["regist-form"];

    if (form) {
      const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        // Debug: cetak data form
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        try {
          await fetch(scriptURL, { method: "POST", body: formData });
        } catch (error) {
          console.error("Error saat mengirim data:", error);
        }

        form.reset();
      };

      form.addEventListener("submit", handleSubmit);

      // Lepas event listener saat komponen di-unmount
      return () => {
        form.removeEventListener("submit", handleSubmit);
      };
    }
  }, []);

  return (
    <>
      <Head>
        <title>FORM PENGGANDAAN MEDALI</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        type="text/javascript"
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_CLIENT}
      ></Script>
      <section className="registration-section">
        <div className="container">
          <div className="content">
            <h1 className="sub">FORMULIR PENGGANDAAN MEDALI ISPC</h1>
            <h1 className="garis-bawah"></h1>
            <br></br>

            <div className="info">
              <p>
                Isi data berikut dengan akurat dan benar. Pastikan setiap detail
                yang dimasukkan sesuai dengan informasi yang sebenarnya, agar
                data yang diterima dapat diolah dengan benar dan menghasilkan
                output yang valid. Terima kasih atas kerjasama Anda.
              </p>
            </div>
            <form name="regist-form">
              <div className="user-details">
                {/* <div className="input-box">
                  <label className="form-label" value="Peserta Indonesia">
                    Kategori Peserta
                  </label>
                  <input
                    type="text"
                    id="CATEGORY_PARTICIPANT"
                    name="CATEGORY_PARTICIPANT"
                    className="form-control"
                    placeholder="Choose Categories Participant"
                    value="PESERTA INDONESIA"
                    readOnly
                  />
                </div> */}
                <div className="input-box">
                  <label for="Kategori Peserta" className="form-label">
                    Kategori Peserta
                  </label>
                  <select
                    type="text"
                    id="CATEGORY_PARTICIPANT"
                    name="CATEGORY_PARTICIPANT"
                    className="form-control"
                    placeholder="Choose Categories Participant"
                    required
                  >
                    {/* <option value="">--Choose Categories Participant--</option> */}
                    <option value="PESERTA INDONESIA">PESERTA INDONESIA</option>
                    {/* <option value="PESERTA INTERNATIONAL">PESERTA INTERNATIONAL</option> */}
                  </select>
                </div>
                <div className="input-box">
                  <label for="Kategori Kompetisi" className="form-label">
                    Kategori Kompetisi
                  </label>
                  <select
                    type="text"
                    id="Kategori_Kompetisi"
                    name="Kategori_Kompetisi"
                    className="form-control"
                    placeholder="Pilih Kompetisi"
                    required
                  >
                    <option value="">--Pilih Kategori Kompetisi Anda--</option>
                    <option value="ONLINE">ONLINE</option>
                    <option value="OFFLINE">OFFLINE</option>
                  </select>
                </div>
                <div className="input-box">
                  <label htmlFor="Nama Ketua Tim" className="form-label">
                    Nama Ketua Tim
                  </label>
                  <textarea
                    type="text"
                    id="Nama_Ketua_Tim"
                    name="Nama_Ketua_Tim"
                    className="form-control"
                    placeholder="Masukan Nama Ketua Tim"
                    required
                    value={selectedNamaLengkap}
                    ref={namaKetuaRef} // Mengaitkan ref dengan textarea
                    onChange={(e) => setSelectedNamaLengkap(e.target.value)} // Menambahkan handler onChange
                  ></textarea>
                </div>
                <div className="input-box">
                  <label htmlFor="Nama Sekolah" className="form-label">
                    Nama Sekolah/Universitas
                  </label>
                  <textarea
                    type="text"
                    id="Nama_Sekolah"
                    name="Nama_Sekolah"
                    className="form-control"
                    placeholder="Masukan Nama Sekolah/Universitas Anda"
                    required
                    ref={NamaSekolahRef} // Mengaitkan ref dengan textarea
                    value={selectNamaSekolah}
                    onChange={(e) => setselectNamaSekolah(e.target.value)}
                  ></textarea>
                </div>
                <div className="input-box">
                  <label for="LEADER_EMAIL" className="form-label">
                    Alamat Email Ketua Tim
                  </label>
                  {/* <label>
                    <p>Notes : Dimohon untuk mengisi email dengan benar</p>
                  </label> */}
                  <input
                    type="email"
                    id="LEADER_EMAIL"
                    name="LEADER_EMAIL"
                    className="form-control"
                    placeholder="Masukan Alamat Email Ketua Tim"
                    required
                    value={selectEmailKetua}
                    onChange={(e) => setselectEmailKetua(e.target.value)}
                  />
                </div>
                <div className="input-box">
                  <label htmlFor="LEADER_WHATSAPP" className="form-label">
                    Nomor WhatsApp Ketua Tim
                  </label>
                  {/* <label>
                    <p>
                      Harap tulis dengan kode telepon, contoh : (kode negara)
                      (nomor telepon) +62 81770914xxxx
                    </p>
                    <p>
                      Notes : Dimohon untuk mengisi nomor ketua tim dengan benar
                    </p>
                  </label> */}
                  <input
                    type="number"
                    id="LEADER_WHATSAPP"
                    name="LEADER_WHATSAPP"
                    className="form-control"
                    placeholder="Masukan Nomor WhatsApp Ketua Tim"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)} // Menambahkan handler onChange
                  />
                </div>
                <div className="user-details">
                  <div className="input-box">
                    <label html="Jumlah Medali" className="form-label">
                      Jumlah Medali yang ingin digandakan
                    </label>
                    <select
                      type="text"
                      id="Jumlah_Medali"
                      name="Jumlah_Medali"
                      className="form-control"
                      placeholder="Pilih Jumlah Medali yang ingin digandakan"
                      required
                      onChange={handleCategoryChange}
                      value={selectedCategory}
                    >
                      <option value="">--Pilih Jumlah Medali--</option>
                      <option value="1 Medali">1 Medali</option>
                      <option value="2 Medali">2 Medali</option>
                      <option value="3 Medali">3 Medali</option>
                      <option value="4 Medali">4 Medali</option>
                      <option value="5 Medali">5 Medali</option>
                      <option value="6 Medali">6 Medali</option>
                    </select>
                  </div>
                  <div className="input-box">
                    <label for="Kategori Medali" className="form-label">
                      Kategori Medali
                    </label>
                    <select
                      type="text"
                      id="Kategori_Medali"
                      name="Kategori_Medali"
                      className="form-control"
                      placeholder="Pilih Kategori Medali"
                      required
                      value={selectKategoriMedali}
                      onChange={(e) => setselectKategoriMedali(e.target.value)}
                    >
                      <option value="">--Pilih Kategori Medali Anda--</option>
                      <option value="GOLD">GOLD</option>
                      <option value="SILVER">SILVER</option>
                      <option value="BRONZE">BRONZE</option>
                    </select>
                  </div>
                </div>
                <div className="user-details">
                  <div className="input-box">
                    <label className="form-label">
                      Biaya yang harus dibayarkan{" "}
                      <span className="fw-bold">
                        (Belum Termasuk biaya Admin)
                      </span>
                    </label>
                    <input
                      type="text"
                      id="TOTAL_AMOUNT"
                      name="TOTAL_AMOUNT"
                      className="form-control"
                      placeholder="Total Biaya"
                      value={
                        price
                          ? (price / 1000).toLocaleString("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 3,
                            })
                          : ""
                      }
                      readOnly
                    />
                  </div>
                  <div className="input-box invisible">
                    <label className="form-label">INVOICE ID</label>
                    <input
                      type="text"
                      id="Invoice_ID"
                      name="Invoice_ID"
                      className="form-control"
                      placeholder="ID PEMBAYARAN"
                      value={uniqueId}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="buttonindo">
                <input
                  type="Submit"
                  method="Submit"
                  value="Submit"
                  onClick={handlePayment}
                />
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
