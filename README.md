# Challenge Gold Binar Academy - Back End Javascript

Challenge ini merupakan submission dari Bootcamp Binar Academy jalur Back End Javascript pada level Gold. Sistem Back End yang merupakan implementasi dari _online shop_ bernama Bingle bertujuan untuk menyimpan data pelanggan, mengelola daftar item, dan menerima pesanan pelanggan.

Sistem dirancang dengan runtime **Node.JS** dan framework **Express.JS** serta arsitektur database menggunakan SQL khsusnya **PostgreSQL**. Hasil dari rancangan sistem project Node ini dapat dijalankan sebagai RESTful API Server yang memiliki API yang berfungsi sebagai berikut:

1. Register pelanggan baru
2. Login pelanggan
3. Menampilkan daftar item
4. Membuat pesanan baru
5. Memperbarui status pesanan

## Dokumentasi method

### Register Pelanggan Baru

_Endpoint_ :

```
http://localhost:3000/users/register
```

_Request Body_ :

```
{
    "firstName" : "Prananda",
    "lastName": "Yoga",
    "email" : "PranandaYOGA21@mail.com",
    "phoneNumber": "081335824410",
    "address": "Jalan Penfuit No.7, Kuta, Bali",
    "password": "pranandayoga"
}
```

```
{
    "data": {
        "id": 26,
        "firstName": "a",
        "lastName": "b",
        "email": "ab@mail.com",
        "phoneNumber": "081335224420",
        "address": "Jalan Penfuit No.7, Kuta, Bali",
        "authToken": null,
        "createdAt": "2024-02-02T13:34:50.170Z",
        "updatedAt": "2024-02-02T13:34:50.170Z"
    },
    "message": "New user created with ID 26"
}
```
