# Catatan TypeScript Generics

## Apa itu T?

`T` adalah **type parameter** (parameter tipe) dalam TypeScript generics.

Ini adalah placeholder untuk tipe data yang akan ditentukan kemudian saat fungsi/class digunakan. `T` adalah konvensi penamaan (bisa juga `U`, `V`, `K`, `TData`, dll), dan memungkinkan Anda menulis kode yang dapat bekerja dengan berbagai tipe data sambil tetap type-safe.

Contoh:

```typescript
function identity<T>(value: T): T {
  return value;
}

identity<number>(42);      // T = number
identity<string>("hello"); // T = string
```

Dalam contoh ini, `T` akan digantikan dengan tipe data aktual (`number` atau `string`) saat fungsi dipanggil.

## Kenapa setelah tutup kurung, ada : T?

`: T` setelah kurung fungsi adalah **return type** (tipe data yang dikembalikan fungsi).

```typescript
function identity<T>(value: T): T {
  return value;
}
```

Penjelasan:
- `<T>` - mendefinisikan type parameter
- `(value: T)` - parameter `value` bertipe `T`
- `: T` - fungsi mengembalikan nilai bertipe `T`

Jadi fungsi ini menerima nilai bertipe `T` dan mengembalikan nilai dengan tipe yang sama.

Contoh lain:

```typescript
function getLength<T>(arr: T[]): number {
  return arr.length;
}
```

Di sini `: number` berarti fungsi mengembalikan angka, meskipun menerima array dengan tipe generic `T`.

## Kenapa error saat mengubah : number menjadi : T?

Error: `Type 'number' is not assignable to type 'T'. 'T' could be instantiated with an arbitrary type which could be unrelated to 'number'.`

Error ini muncul karena `arr.length` selalu mengembalikan tipe `number`, tetapi Anda mendeklarasikan return type sebagai `: T`.

TypeScript tidak bisa menjamin bahwa `T` adalah `number`. Misalnya:

```typescript
function getLength<T>(arr: T[]): T {  // L Error
  return arr.length;  // length adalah number, bukan T
}

getLength<string>(["a", "b"]);  // T = string
// Tapi arr.length mengembalikan number (2), bukan string!
```

**Solusi:**

Gunakan `: number` karena `length` property memang selalu mengembalikan number:

```typescript
function getLength<T>(arr: T[]): number {  //  Benar
  return arr.length;
}
```

Return type harus sesuai dengan nilai yang benar-benar dikembalikan fungsi, bukan harus selalu menggunakan `T`.

## Bisakah type berbeda antara type parameter, type value dan type kembalian fungsi?

Ya, bisa! Anda dapat menggunakan multiple type parameters dengan tipe yang berbeda-beda:

```typescript
function typeDifferent<T, U, V>(param1: T, param2: U): V {
  // implementasi
}
```

**Contoh praktis:**

```typescript
function convert<T, U>(value: T, converter: (val: T) => U): U {
  return converter(value);
}

const result = convert<number, string>(42, (num) => num.toString());
// T = number, U = string
// result bertipe string
```

**Catatan penting:**
- Setiap type parameter (`T`, `U`, `V`) harus dideklarasikan di `<T, U, V>`
- Return type `V` harus bisa dibuktikan/di-infer oleh TypeScript dari implementasi fungsi
- Dalam praktik, TypeScript biasanya bisa meng-infer tipe secara otomatis

Contoh lebih sederhana:

```typescript
function wrap<T, U>(value: T): U {
  return value as U;  // membutuhkan type assertion
}
```

## Apa itu type infer/inference?

**Type inference** adalah kemampuan TypeScript untuk **secara otomatis menentukan tipe data** tanpa Anda harus menuliskannya secara eksplisit.

**Contoh:**

```typescript
// TypeScript otomatis tahu 'x' bertipe number
let x = 42;  // inferred sebagai number

// TypeScript otomatis tahu return type adalah number
function add(a: number, b: number) {
  return a + b;  // inferred: return type = number
}

// Dengan generics
function identity<T>(value: T): T {
  return value;
}

identity(42);      // T di-infer sebagai number
identity("hello"); // T di-infer sebagai string
// Tidak perlu tulis identity<number>(42)
```

**Keuntungan:**
- Kode lebih ringkas
- Tetap type-safe
- TypeScript "pintar" menebak tipe berdasarkan konteks

**Kapan perlu eksplisit:**
```typescript
identity<string>(42);  // Error! Anda paksa T = string tapi nilai number
```

Jadi inference = TypeScript otomatis mendeteksi tipe, Anda tidak perlu tulis manual.

## Kenapa berbeda antara const teks dan const result4?

Perbedaan ini terjadi karena **literal type inference** pada `const`.

**Penjelasan:**

```typescript
const result4 = identity("hello");
// TypeScript meng-infer tipe paling spesifik: literal type "hello"
// Karena const tidak bisa diubah, TypeScript tahu nilainya pasti "hello"

const teks = identity<string>("hello");
// Anda eksplisit menentukan T = string
// Jadi return type adalah string (lebih umum), bukan literal "hello"
```

**Analogi:**

```typescript
const a = "hello";        // const a: "hello" (literal type)
const b: string = "hello"; // const b: string (general type)

let c = "hello";          // let c: string (karena let bisa diubah)
```

**Kenapa TypeScript melakukan ini:**
- `const` í nilai tidak berubah í TypeScript bisa lebih spesifik (literal type)
- Jika Anda override dengan `<string>`, TypeScript ikuti instruksi Anda

**Praktiknya:**
Literal type berguna untuk union types yang ketat:
```typescript
type Status = "success" | "error";
const status = identity("success"); // status: "success"  bisa assign ke Status
```

## Jelaskan Contoh 4: Real-world - Response Wrapper

**Response Wrapper** adalah pola umum dalam pengembangan API untuk membungkus data response dengan metadata tambahan.

### Struktur:

```typescript
interface ApiResponse<T> {
  data: T;           // Data aktual (bisa tipe apa saja)
  status: number;    // HTTP status code
  message: string;   // Pesan response
}
```

### Kenapa menggunakan Generic `<T>`?

- `data` bisa berisi berbagai tipe objek (user, product, order, dll)
- Dengan generic, TypeScript tahu tipe data spesifik di dalam `data`
- Type-safe: tidak perlu type assertion saat mengakses properti

### Contoh Penggunaan:

```typescript
// User response - T = { id: number; name: string }
const userResponse: ApiResponse<{ id: number; name: string }> = {
  data: { id: 1, name: "Andi" },  // TypeScript tahu struktur ini
  status: 200,
  message: "Success",
};

userResponse.data.name;  // ‚úÖ TypeScript tahu ada property 'name'

// Product response - T = { id: number; price: number }
const productResponse: ApiResponse<{ id: number; price: number }> = {
  data: { id: 101, price: 50000 },  // Struktur berbeda
  status: 200,
  message: "Success",
};

productResponse.data.price;  // ‚úÖ TypeScript tahu ada property 'price'
```

### Manfaat:
- Konsistensi struktur response
- Type safety untuk data yang berbeda-beda
- Autocomplete saat akses `data`
- Real-world pattern di API development

## Cara me-return key di createPair

Jika Anda ingin return sebagai **object dengan key**, ubah return type:

```typescript
// Return sebagai object
function createPair<T, U>(first: T, second: U): { first: T; second: U } {
  return { first, second };
}

const pairStr = createPair("name", "reski");
// pairStr.first === "name"
// pairStr.second === "reski"
```

Atau bisa return sebagai **tuple**:

```typescript
// Return sebagai tuple
function createPair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const pairStr = createPair("name", "reski");
// pairStr[0] === "name"
// pairStr[1] === "reski"
```

Pilih sesuai kebutuhan: **tuple** `[T, U]` atau **object** `{ first: T; second: U }`

## Apa itu tuple?

**Tuple** adalah tipe data array dengan **jumlah elemen dan tipe tetap** pada setiap posisi.

**Perbedaan dengan Array biasa:**

```typescript
// Array biasa - semua elemen tipe sama, panjang bebas
const arr: number[] = [1, 2, 3, 4, 5];

// Tuple - tipe tiap posisi tetap, panjang tetap
const tuple: [string, number] = ["age", 25];
//            posisi 0  posisi 1
```

**Contoh Tuple:**

```typescript
// Tuple dengan 2 elemen: string dan number
const person: [string, number] = ["John", 30];
person[0]; // string
person[1]; // number

// Tuple dengan 3 elemen berbeda
const data: [number, string, boolean] = [1, "hello", true];

// Error jika urutan salah
const wrong: [string, number] = [25, "age"]; // ‚ùå Error!
```

**Kegunaan:**

```typescript
// Return multiple values dengan tipe berbeda
function getUser(): [number, string] {
  return [1, "Reski"];
}

const [id, name] = getUser();
// id: number
// name: string
```

Tuple = array dengan tipe dan posisi yang sudah ditentukan.
