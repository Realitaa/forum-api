# Forum API Submission 1

Saya Reza Mulia Putra (username: realitaa). Ini adalah submission 1 Forum API pada kelas Menjadi Back-End Developer Expert dengan Javascript. Seluruh unit test hijau, dan seluruh Test Postman mandatory hijau. 

## Prerequisite

Saya menggunakan starter project yang diberikan, sehingga spesifikasi minimal seperti versi minimal NodeJS dapat mengikuti dari Dicoding. 

Selanjutnya Anda harus membuat tabel `forumapi` dan `forumapi_test` di database Postgres jika belum ada. Kemudian memberikan hak akses tabel tersebut kepada pengguna Postgres jika dibutuhkan.

## Installation

1. Copy file `.env.example` ke `.env`
    ```
    cp .env.example .env
    ```
2. Buatlah 2 kunci untuk variabel ACCESS dan REFRESH TOKEN KEY JWT. Anda bisa menggunakan fungsi bawaan `crypto` dari NodeJS.
3. Install dependensi
    ```
    npm install
    ```
4. Jalankan migrasi
    ```
    npm run migrate up
    ```
5. Jalankan test (semuanya hijau)
    ```
    npm run test
    ```
6. Jalankan server
    ```
    npm run start
    ```
7. Lakukan pengujian Postman (selain Optional test, semuanya hijau)

## Troubleshoot

Jika terdapat error pada test, cobalah melakukan `TRUNCATE` tabel di database dan lakukan pengujian secara berurutan menggunakan fitur Collection di Postman.

## Closing

Terima kasih telah melakukan review submission saya.