type Person = {
  name: string;
  age: number;
  email: string;
};

type PersonKeys = keyof Person;

function getProperty(obj: Person, key: keyof Person) {
  return obj[key];
}

const data = { name: "Reski", age: 25, email: "rskbbs@gmail.com" };

console.log(getProperty(data, "age"));

type Gedung = {
  kantor: string;
  gudang: string;
  parkir: string;
};

function bukaPintu<K extends keyof Gedung>(ruangan: K) {
  return ruangan;
}

bukaPintu("kantor");

function ambilNilai<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

type RemoteTv = {
  power: () => void;
  volumeUp: () => void;
  volumeDown: () => void;
  channel: () => void;
};

function tekanTombol<K extends keyof RemoteTv>(tombol: K) {
  console.log(`Menekan tombol: ${tombol}`);
}

tekanTombol("power");
