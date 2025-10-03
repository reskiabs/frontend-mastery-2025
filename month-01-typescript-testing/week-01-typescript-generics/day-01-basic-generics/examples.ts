function identityAny(arg: any): any {
  return arg;
}
const result = identityAny(1);

// Contoh 1: Basic Generic Function
function identity<T>(arg: T): T {
  return arg;
}

const teks = identity<string>("hello"); // const teks: string
const angka = identity<number>(1);
const objek = identity({ x: 10 });
const result4 = identity("hello"); // type inference
let result5 = identity("hello"); // has type string

// Contoh 2: Generic Array Function
function wrapInArray<T>(value: T): T[] {
  return [value];
}

const number = wrapInArray(5);
const string = wrapInArray("hello");
const mixed = wrapInArray({ id: 1 });

function getLength<T>(arr: T[]): number {
  return arr.length;
}

const array = getLength([1, 2, 4, 5, 6]);
console.log(array);

function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const num = getFirst([1, 4, 7]);
const str = getFirst(["a", "b"]);

// Contoh 3: Multiple Type Parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const pair1 = pair("age", 21);
const pair2 = pair(true, "active");
const pair3 = pair({ x: 1 }, [1, 2]);

// Contoh 4: Real-world - Response Wrapper
interface ApiResponse<TData> {
  data: TData;
  status: number;
  message: string;
}

// untuk user data
const userResponse: ApiResponse<{ id: number; name: string }> = {
  data: { id: 1, name: "Andi" },
  status: 200,
  message: "Success",
};

// untuk product data
const productResponse: ApiResponse<{ id: number; price: number }> = {
  data: { id: 101, price: 50000 },
  status: 200,
  message: "Success",
};

const loginResponse: ApiResponse<{
  id: number;
  token: string;
  is_verify: boolean;
}> = {
  data: { id: 147, token: "jkasndi1do21", is_verify: true },
  status: 403,
  message: "Unauthorize",
};

userResponse.data.name;
productResponse.data.price;
loginResponse.data.token;
