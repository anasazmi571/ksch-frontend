import { ReactNode, createContext, useCallback, useEffect, useMemo, useState } from "react";
import { Category, Contingent, DataStore, Events, SignUpDetails, Team, TeamFormDetails, TeamMember, User } from "../models";
import { JsonDataStore } from "../data/JsonDataStore";
import { UserType } from "../enums";

type UserFunctions = {
  contingents: Contingent[];
  categories: Category[];
  user: User | undefined;
  teams: Team[];
  teamMembers: TeamMember[];
  events: Events[];
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (details: SignUpDetails) => Promise<void>;
  createTeam: (v: Omit<Team, 'id'>) => Promise<void>;
  updateTeam: (id: string, v: TeamFormDetails) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
};

export const UserContext = createContext<UserFunctions>({
  contingents: [],
  categories: [],
  user: undefined,
  teams: [],
  teamMembers: [],
  events: [],
  signIn: () => new Promise<void>(resolve => resolve()),
  signOut: () => new Promise<void>(resolve => resolve()),
  signUp: () => new Promise<void>(resolve => resolve()),
  createTeam: () => new Promise<void>(resolve => resolve()),
  updateTeam: () => new Promise<void>(resolve => resolve()),
  deleteTeam: () => new Promise<void>(resolve => resolve())
});

export function UserProvider({children}: {children: ReactNode}) {
  const categories: Category[] = useMemo(() => [
    {
      id: 'branch-male',
      name: 'Cawangan Lelaki'
    },
    {
      id: 'branch-female',
      name: 'Cawangan Wanita'
    },
    {
      id: 'uas-male',
      name: 'Universiti Awam/Swasta Lelaki'
    },
    {
      id: 'uas-female',
      name: 'Universiti Awam/Swasta Wanita'
    },
    {
      id: 'hs-male',
      name: 'Sekolah Menengah Tinggi Lelaki'
    },
    {
      id: 'hs-female',
      name: 'Sekolah Menengah Tinggi Wanita'
    },
    {
      id: 'ms-male',
      name: 'Sekolah Menengah Rendah Lelaki'
    },
    {
      id: 'ms-female',
      name: 'Sekolah Menengah Rendah Wanita'
    }
  ], []);
  const contingentDb: DataStore<Contingent> = useMemo(() => new JsonDataStore<Contingent>([
    {
      id: 'cawselangor',
      name: 'Cawangan Selangor',
      branch: true,
      uas: false,
      hs: false,
      ms: false
    },
    {
      id: 'uasutp',
      name: 'Universiti Teknologi Petronas',
      branch: false,
      uas: true,
      hs: false,
      ms: false
    },
    {
      id: 'scmckk',
      name: 'Kolej Melayu Kuala Kangsar',
      branch: false,
      uas: false,
      hs: true,
      ms: false
    }
  ]), []);
  const userDb: DataStore<User> = useMemo(() => new JsonDataStore<User>([
    {
      id: '0',
      name: 'Test Admin',
      phone: '12345',
      nric: '001122-33-1234',
      email: 'test@mail.com',
      password: 'test1234',
      type: UserType.Admin
    },
    {
      id: '1',
      name: 'Test Team Manager',
      phone: '12345',
      nric: '001122-33-4321',
      email: 'tm@mail.com',
      password: 'tmtm1234',
      type: UserType.TeamManager
    }
  ]), []);
  const teamDb: DataStore<Team> = useMemo(() => new JsonDataStore<Team>([]), []);
  const teamMemberDb: DataStore<TeamMember> = useMemo(() => new JsonDataStore<TeamMember>([]), []);
  const eventDb: DataStore<Events> = useMemo(() => new JsonDataStore<Events>([]), []);
  const [user, setUser] = useState<User>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [events, setEvents] = useState<Events[]>([]);
  const [contingents, setContingents] = useState<Contingent[]>([]);
  
  const signIn = useCallback(async (email: string, password: string) => {
    const users = await userDb.getAll(x => x.email === email && x.password === password);
    if (users.length < 1) {
      throw new Error('Invalid user credentials.');
    }
    setUser(users[0]);
  }, [userDb]);

  const signOut = useCallback(async () => {
    setUser(undefined);
  }, []);
  const signUp = useCallback(async (details: SignUpDetails) => {
    const newUser = await userDb.create(details);
    if (!newUser) {
      throw new Error('Invalid sign-up details.');
    }
    setUser(newUser);
  }, [userDb]);

  const createTeam = useCallback(async (v: Omit<Team, 'id'>) => {
    const newTeam = await teamDb.create(v);
    if (!newTeam) {
      throw new Error('Invalid team details.');
    }
    if (!!user) {
      teamDb.getAll(x => x.manager === user.id).then(result => {
        setTeams(result);
      });
    } else {
      setTeams([]);
    }
  }, [teamDb, user]);
  
  const updateTeam = useCallback(async (id: string, v: TeamFormDetails) => {
    const userId = user?.id;
    if (!userId) {
      throw new Error('User does not exist.');
    }
    const newTeam = await teamDb.update(id, { category: v.category, manager: userId });
    if (!newTeam) {
      throw new Error('Invalid team details.');
    }
    const newTeams = await teamDb.getAll(x => x.manager === user.id);
    setTeams(newTeams);
    const currentMembers = (await teamMemberDb.getAll(x => x.team === newTeam.id)).reduce(
      (prev, curr) => ({
        ...prev,
        [curr.nric]: curr
      }), {} as { [nric: string]: TeamMember }
    );
    const memberTransactions: Promise<TeamMember | undefined>[] = [];
    for (const newMember of v.members) {
      const existing = currentMembers[newMember.nric];
      if (!!existing) {
        memberTransactions.push(teamMemberDb.update(existing.id, { ...existing, ...newMember }));
      } else {
        memberTransactions.push(teamMemberDb.create(newMember));
      }
    }
    const newMembers = await Promise.all(memberTransactions);
    setTeamMembers(newMembers.filter(x => !!x) as TeamMember[]);
    const oldEvent = (await eventDb.getAll(x => x.team === newTeam.id)).find(x => !!x);
    if (!!oldEvent) {
      await eventDb.update(oldEvent.id, v.events);
    } else {
      await eventDb.create(v.events);
    }
    const newTeamIds = newTeams.map(t => t.id);
    const newEvents = await eventDb.getAll(x => newTeamIds.includes(x.team));
    setEvents(newEvents);
  }, [teamDb, teamMemberDb, eventDb, user]);

  const deleteTeam = useCallback(async (id: string) => {
    const userId = user?.id;
    if (!userId) {
      throw new Error('User does not exist.');
    }
    const transactions: Promise<boolean>[] = [];
    const events = await eventDb.getAll(x => x.team === id);
    transactions.push(...events.map(x => eventDb.delete(x.id)));
    const members = await teamMemberDb.getAll(x => x.team === id);
    transactions.push(...members.map(x => teamMemberDb.delete(x.id)));
    transactions.push(teamDb.delete(id));
    await Promise.all(transactions);
  }, [teamDb, teamMemberDb, eventDb, user]);

  useEffect(() => {
    if (!!user) {
      teamDb.getAll(x => x.manager === user.id).then(result => {
        setTeams(result);
      });
    } else {
      setTeams([]);
    }
  }, [user, teamDb]);

  useEffect(() => {
    if (teams.length < 1) {
      setTeamMembers([]);
    } else {
      const teamIds = teams.map(t => t.id);
      teamMemberDb.getAll(x => teamIds.includes(x.team)).then(result => {
        setTeamMembers(result);
      });
    }
  }, [teams, teamMemberDb]);

  useEffect(() => {
    if (teams.length < 1) {
      setEvents([]);
    } else {
      const eventIds = teams.map(t => t.id);
      eventDb.getAll(x => eventIds.includes(x.team)).then(result => {
        setEvents(result);
      });
    }
  }, [teams, eventDb]);

  useEffect(() => {
    contingentDb.getAll().then(result => {
      setContingents(result);
    });
  }, [contingentDb]);

  return (
    <UserContext.Provider value={{ contingents, categories, user, teams, teamMembers, events, signIn, signOut, signUp, createTeam, updateTeam, deleteTeam }}>
      {children}
    </UserContext.Provider>
  );
}