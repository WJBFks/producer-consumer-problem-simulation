class Process {
  id: number;
  type: "Producer" | "Consumer";
  constructor(id: number, type: "Producer" | "Consumer") {
    this.id = id;
    this.type = type;
  }
}

class Buffer {
  id: number;
  isExist: boolean;
  constructor(id: number, isExist: boolean) {
    this.id = id;
    this.isExist = isExist;
  }
}

export { Process, Buffer };
