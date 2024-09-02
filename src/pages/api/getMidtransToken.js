import midtransClient from 'midtrans-client';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Buat instance Snap Midtrans
    const snap = new midtransClient.Snap({
      isProduction: false, // Ubah ke true untuk produksi
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    // Dapatkan data transaksi dari request body
    const { transactionDetails, customerDetails, itemDetails } = req.body;

    const parameter = {
      transaction_details: transactionDetails,
      customer_details: customerDetails,
      item_details: itemDetails,
    };

    try {
      // Mendapatkan token transaksi dari Midtrans
      const transaction = await snap.createTransaction(parameter);
      res.status(200).json({ token: transaction.token });
    } catch (error) {
      console.error('Error mendapatkan token Midtrans:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
