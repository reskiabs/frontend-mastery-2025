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
- `const` ’ nilai tidak berubah ’ TypeScript bisa lebih spesifik (literal type)
- Jika Anda override dengan `<string>`, TypeScript ikuti instruksi Anda

**Praktiknya:**
Literal type berguna untuk union types yang ketat:
```typescript
type Status = "success" | "error";
const status = identity("success"); // status: "success"  bisa assign ke Status
```
