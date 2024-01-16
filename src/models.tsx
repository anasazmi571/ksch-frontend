import { UserType } from "./enums";

export type User = {
  id: string;
  name: string;
  phone: string;
  nric: string;
  email: string;
  password?: string;
  type: UserType;
};

export type SignUpDetails = Omit<User, 'id'>;

export type Contingent = {
  id: string;
  name: string;
  branch: boolean;
  uas: boolean;
  hs: boolean;
  ms: boolean;
};

export type TeamMember = {
  id?: string;
  name: string;
  nric: string;
  isLeader?: boolean;
};

export type Category = {
  id: string;
  name: string;
};

export type TeamManager = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  nric: string;
};

export type Events = {
  id?: string;
  event1?: number[];
  event2?: number[];
  event3?: number[];
  event4?: number[];
  event5?: number[];
  event6?: number[];
  event7?: number[];
  event8?: number[];
  event9?: number[];
  event10?: number[];
  event11?: number[];
}

export type TDocument = { id: string };

export interface DataStore<T extends TDocument> {
  getAll: (filter?: (item: T) => boolean) => Promise<T[]>;
  get: (id: string) => Promise<T | undefined>;
  create: (details: Omit<T, 'id'>) => Promise<T | undefined>;
  update: (id: string, details: Omit<T, 'id'>) => Promise<T | undefined>;
  delete: (id: string) => Promise<boolean>;
};