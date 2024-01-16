import { DataStore, TDocument } from "../models";

export class JsonDataStore<T extends TDocument> implements DataStore<T> {
  constructor(private data: T[] = []) {}
  
  public getAll(filter?: (item: T) => boolean): Promise<T[]> {
    return new Promise<T[]>(resolve => { resolve(this.data.filter(x => !!filter ? filter(x) : true)) });
  }

  public get(id: string): Promise<T | undefined> {
    return new Promise<T | undefined>(resolve => { resolve(this.data.find(x => x.id === id)) });
  }

  public create(details: Omit<T, 'id'>): Promise<T | undefined> {
    return new Promise<T | undefined>(resolve => {
      const output: T = {
        ...details,
        id: this.data.length.toString()
      } as T;
      this.data = [
        ...this.data,
        output
      ];
      resolve(output);
    });
  }

  public update(id: string, details: Omit<T, 'id'>): Promise<T | undefined> {
    return new Promise<T | undefined>(resolve => {
      const index = this.data.findIndex(x => x.id === id);
      if (index < 0) {
        throw new Error('Item with the specified ID was not found.');
      }
      this.data = [
        ...this.data.slice(0, index),
        {
          ...this.data[index],
          ...details
        },
        ...this.data.slice(index + 1)
      ];
      resolve(this.data[index]);
    });
  }

  public delete(id: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      const index = this.data.findIndex(x => x.id === id);
      if (index < 0) {
        throw new Error('Item with the specified ID was not found.');
      }
      this.data = [
        ...this.data.slice(0, index),
        ...this.data.slice(index + 1)
      ];
      resolve(true);
    });
  }
}