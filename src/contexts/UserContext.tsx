import { ReactNode, createContext, useCallback, useEffect, useMemo, useState } from "react";
import { Category, Contingent, DataStore, EventEntry, SignUpDetails, Team, TeamFormDetails, TeamMember, TournamentEvent, User } from "../models";
import { JsonDataStore } from "../data/JsonDataStore";
import { UserType } from "../enums";

type UserFunctions = {
  contingents: Contingent[];
  categories: Category[];
  user: User | undefined;
  teams: Team[];
  teamMembers: TeamMember[];
  events: TournamentEvent[];
  mainEvents: TournamentEvent[];
  openEvents: TournamentEvent[];
  entries: EventEntry[];
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  signUp: (details: SignUpDetails) => Promise<boolean>;
  createTeam: (v: Omit<Team, 'id'>) => Promise<Team | undefined>;
  updateTeam: (id: string, v: TeamFormDetails) => Promise<Team | undefined>;
  updateEntries: (newEntries: EventEntry[]) => Promise<EventEntry[]>;
  deleteTeam: (id: string) => Promise<boolean>;
};

export const UserContext = createContext<UserFunctions>({
  contingents: [],
  categories: [],
  user: undefined,
  teams: [],
  teamMembers: [],
  events: [],
  mainEvents: [],
  openEvents: [],
  entries: [],
  signIn: () => new Promise<boolean>(resolve => resolve(false)),
  signOut: () => new Promise<boolean>(resolve => resolve(false)),
  signUp: () => new Promise<boolean>(resolve => resolve(false)),
  createTeam: () => new Promise<Team | undefined>(resolve => resolve(undefined)),
  updateTeam: () => new Promise<Team | undefined>(resolve => resolve(undefined)),
  updateEntries: () => new Promise<EventEntry[]>(resolve => resolve([])),
  deleteTeam: () => new Promise<boolean>(resolve => resolve(false))
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
      type: UserType.TeamManager,
      contingent: 'cawselangor'
    }
  ]), []);
  const eventDb: DataStore<TournamentEvent> = useMemo(() => new JsonDataStore<TournamentEvent>([
    {
      id: 'event1',
      name: 'Gerak Senaman Cekak Hanafi + Buah Jatuh Kreatif',
      participants: 6,
      graduatesOnly: true,
      timeLimit: 180
    },
    {
      id: 'event2',
      name: 'Umum Senjata',
      participants: 6,
      graduatesOnly: true,
      timeLimit: 30
    },
    {
      id: 'event3',
      name: 'Umum Papan Sekeping',
      participants: 6,
      graduatesOnly: true,
      timeLimit: 30
    },
    {
      id: 'event4',
      name: '4 Lawan 1',
      participants: 5,
      timeLimit: 60
    },
    {
      id: 'event5',
      name: '6 Buah Jatuh Seragam',
      participants: 6,
      timeLimit: 120
    },
    {
      id: 'event6',
      name: 'Menangkis Serangan Pisau',
      participants: 2,
      open: true,
      graduatesOnly: true,
      timeLimit: 60
    },
    {
      id: 'event7',
      name: 'Menangkis Serangan Kaki',
      participants: 2,
      open: true,
      graduatesOnly: true,
      timeLimit: 60
    },
    {
      id: 'event8',
      name: 'Menangkis Serangan Tongkat',
      participants: 2,
      open: true,
      graduatesOnly: true,
      timeLimit: 60
    },
    {
      id: 'event9',
      name: 'Senaman Lading & Menangkis Serangan Menggunakan Lading',
      participants: 2,
      open: true,
      graduatesOnly: true,
      timeLimit: 120
    },
    {
      id: 'event10',
      name: 'Gerak Silat Sepasang',
      participants: 2,
      open: true,
      timeLimit: 120
    },
    {
      id: 'event11',
      name: 'Gerak Silat Bertiga',
      participants: 3,
      open: true,
      timeLimit: 120
    }
  ]), []);
  const teamDb: DataStore<Team> = useMemo(() => new JsonDataStore<Team>([
    {
      id: 'team0',
      category: 'branch-male',
      manager: '1'
    }
  ]), []);
  const teamMemberDb: DataStore<TeamMember> = useMemo(() => new JsonDataStore<TeamMember>([
    {
      id: 'member0',
      name: 'Test Member 1',
      nric: '001122-33-9001',
      team: 'team0'
    },
    {
      id: 'member1',
      name: 'Test Member 2',
      nric: '001122-33-9002',
      team: 'team0'
    },
    {
      id: 'member2',
      name: 'Test Member 3',
      nric: '001122-33-9003',
      team: 'team0'
    },
    {
      id: 'member3',
      name: 'Test Member 4',
      nric: '001122-33-9004',
      team: 'team0'
    },
    {
      id: 'member4',
      name: 'Test Member 5',
      nric: '001122-33-9005',
      team: 'team0'
    },
    {
      id: 'member5',
      name: 'Test Member 6',
      nric: '001122-33-9006',
      team: 'team0'
    }
  ]), []);
  const entryDb: DataStore<EventEntry> = useMemo(() => new JsonDataStore<EventEntry>(), []);
  const [user, setUser] = useState<User>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [events, setEvents] = useState<TournamentEvent[]>([]);
  const [entries, setEntries] = useState<EventEntry[]>([]);
  const [contingents, setContingents] = useState<Contingent[]>([]);

  const mainEvents = useMemo(() => events.filter(x => !x.open), [events]);
  const openEvents = useMemo(() => events.filter(x => !!x.open), [events]);
  
  const signIn = useCallback(async (email: string, password: string) => {
    const users = await userDb.getAll(x => x.email === email && x.password === password);
    if (users.length < 1) {
      throw new Error('Invalid user credentials.');
    }
    setUser(users[0]);
    return true;
  }, [userDb]);

  const signOut = useCallback(async () => {
    setUser(undefined);
    return true;
  }, []);
  const signUp = useCallback(async (details: SignUpDetails) => {
    const newUser = await userDb.create(details);
    if (!newUser) {
      throw new Error('Invalid sign-up details.');
    }
    setUser(newUser);
    return true;
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
    return newTeam;
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
    return newTeams.find(x => x.id === id);
  }, [teamDb, teamMemberDb, user]);

  const updateEntries = useCallback(async (newEntries: EventEntry[]) => {
    const userId = user?.id;
    if (!userId) {
      throw new Error('User does not exist.');
    }
    const oldEntries = entries.map(x => x.id);
    const transactions = [
      ...newEntries.map(x => !oldEntries.includes(x.id) ? entryDb.create(x) : entryDb.update(x.id, x)),
      ...oldEntries.filter(x => newEntries.map(y => y.id).includes(x)).map(x => entryDb.delete(x))
    ];
    await Promise.all(transactions);
    const newTeamIds = teams.map(t => t.id);
    const newEvents = await entryDb.getAll(x => newTeamIds.includes(x.team));
    setEntries(newEvents);
    return newEvents;
  }, [entryDb, teams, user, entries]);

  const deleteTeam = useCallback(async (id: string) => {
    const userId = user?.id;
    if (!userId) {
      throw new Error('User does not exist.');
    }
    const transactions: Promise<boolean>[] = [];
    const eventsToDelete = await entryDb.getAll(x => x.team === id);
    transactions.push(...eventsToDelete.map(x => entryDb.delete(x.id)));
    const members = await teamMemberDb.getAll(x => x.team === id);
    transactions.push(...members.map(x => teamMemberDb.delete(x.id)));
    transactions.push(teamDb.delete(id));
    await Promise.all(transactions);
    return true;
  }, [teamDb, teamMemberDb, entryDb, user]);

  useEffect(() => {
    eventDb.getAll().then(e => {
      setEvents(e);
    }).catch(e => {
      console.error(e);
      setEvents([]);
    })
  }, [eventDb]);

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
      setEntries([]);
    } else {
      const eventIds = teams.map(t => t.id);
      entryDb.getAll(x => eventIds.includes(x.team)).then(result => {
        setEntries(result);
      });
    }
  }, [teams, entryDb]);

  useEffect(() => {
    contingentDb.getAll().then(result => {
      setContingents(result);
    });
    eventDb.getAll().then(result => {
      setEvents(result);
    });
  }, [contingentDb, eventDb]);

  return (
    <UserContext.Provider value={{
      contingents,
      categories,
      user,
      teams,
      teamMembers,
      events,
      mainEvents,
      openEvents,
      entries,
      signIn,
      signOut,
      signUp,
      createTeam,
      updateTeam,
      updateEntries,
      deleteTeam
    }}>
      {children}
    </UserContext.Provider>
  );
}