import { ReactNode, createContext, useCallback, useState } from "react";
import { DataStore, SignUpDetails, User } from "../models";
import { JsonDataStore } from "../data/JsonDataStore";
import { UserType } from "../enums";

type UserFunctions = {
  user: User | undefined;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (details: SignUpDetails) => Promise<void>;
};

export const UserContext = createContext<UserFunctions>({
  user: undefined,
  signIn: () => new Promise<void>(resolve => resolve()),
  signOut: () => new Promise<void>(resolve => resolve()),
  signUp: () => new Promise<void>(resolve => resolve())
});

export function UserProvider({children}: {children: ReactNode}) {
  const userDb: DataStore<User> = new JsonDataStore<User>([
    {
      id: '0',
      name: 'Test User',
      phone: '12345',
      nric: '001122-33-1234',
      email: 'test@mail.com',
      password: 'test1234',
      type: UserType.Admin
    }
  ]);
  const [user, setUser] = useState<User>();
  const signIn = useCallback(async (email: string, password: string) => {
    const users = await userDb.getAll(x => x.email === email && x.password === password);
    if (users.length < 1) {
      throw new Error('Invalid user credentials.');
    }
    setUser(users[0]);
  }, []);
  const signOut = useCallback(async () => {
    setUser(undefined);
  }, []);
  const signUp = useCallback(async (details: SignUpDetails) => {
    const newUser = await userDb.create(details);
    if (!newUser) {
      throw new Error('Invalid sign-up details');
    }
    setUser(newUser);
  }, []);
  return (
    <UserContext.Provider value={{ user, signIn, signOut, signUp }}>
      {children}
    </UserContext.Provider>
  );
}