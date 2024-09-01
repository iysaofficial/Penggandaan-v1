import Head from "next/head";
import Script from "next/script";
import { Inter } from "next/font/google";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

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
    return `PM-GLOCOLIS${timestamp}`;
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
      selectedCategory !== "6 Medali"
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
    } else {
      setPrice("");
    }
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  useEffect(() => {
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbyksmuKXNgmwtcnoAmyv7sE1VrgWkTGnv6t4XHVAJUlrAevmrMV6oGT3MwaYPnpcZL_/exec";

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
        src="https://api.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_CLIENT}
      ></Script>
      <section className="glocolis-section">
        <div className="container">
          <div className="content">
            <h1 className="sub">FORMULIR PENGGANDAAN MEDALI</h1>
            <h1 className="garis-bawah"></h1>
            <br></br>

            <div className="info">
              <p>
                Pilih salah satu dari beberapa nama acara event yang sedang
                diikuti dan di mana Anda ingin melakukan penggandaan jumlah medali yang
                diperoleh...
              </p>
            </div>
            <form name="regist-form mt-5">
              <div class="link-web mx-auto text-center">
                <Link href="/glocolis" legacyBehavior>
                  <a className="btn btn--primary text-center mt-5">
                    Penggandaan GLOCOLIS
                  </a>
                </Link>
                <Link href="/ispc" legacyBehavior>
                  <a class="btn btn--accent text-center mt-5">
                    Penggandaan ISPC
                  </a>
                </Link>
              </div>
              {/* <div className="buttonindo">
                <input
                  type="Submit"
                  method="Submit"
                  value="Submit"
                  onClick={handlePayment}
                />
              </div> */}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
