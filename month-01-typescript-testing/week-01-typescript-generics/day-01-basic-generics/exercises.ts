function identityAny(arg: any): any {
  return arg;
}
const result = identityAny(1);

function identity<T>(arg: T): T {
  return arg;
}

const teks = identity<string>("hello"); // const teks: string
const angka = identity<number>(1);
const objek = identity({ x: 10 });
const result4 = identity("hello"); // type inference
let result5 = identity("hello"); // has type string

function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const num = getFirst([1, 4, 7]);
const str = getFirst(["a", "b"]);

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
