// Exercise 1: Basic Generic Function
function getLastItem<T>(arr: T[]): T {
  let last = arr[arr.length - 1];
  return last;
}

const lastNum = getLastItem([1, 2, 3, 4, 5]);
const lastStr = getLastItem(["a", "b", "c"]);

// Exercise 2: Generic Object Function
function createPair<T, U>(first: T, second: U): { first: T; second: U } {
  return { first, second };
}

const pairStr = createPair("name", "reski");
console.log(pairStr.second);

// Exercise 3: Real-world Challenge
function filterByProperty<T, K extends keyof T>(arr: T[], key: K, value: T[K]) {
  return arr.filter((item) => item[key] === value);
}

// test case
const users = [
  { id: 1, name: "Andi", active: true },
  { id: 1, name: "Budi", active: false },
  { id: 1, name: "Citra", active: true },
];

const activeUsers = filterByProperty(users, "active", true);
console.log(activeUsers);
