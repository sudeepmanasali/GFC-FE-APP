import { UndoRedoOperationItem } from "./constants";
export class UndoRedoManager {

  public operations: UndoRedoOperationItem[];
  constructor() {
    this.operations = [];
  }

  public push(operation: UndoRedoOperationItem): void {
    this.operations.push(operation);
  }

  public pop(): UndoRedoOperationItem | void {
    if (this.isEmpty()) {
      return this.operations.pop();
    }
  }

  public peek(): UndoRedoOperationItem {
    return this.operations[this.operations.length - 1];
  }

  public isEmpty(): boolean {
    return this.operations.length > 0;
  }

  public size(): number {
    return this.operations.length;
  }

  public clear(): void {
    this.operations = [];
  }
}
