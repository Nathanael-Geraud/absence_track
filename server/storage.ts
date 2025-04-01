import { users, type User, type InsertUser, classes, type Class, type InsertClass, students, type Student, type InsertStudent, subjects, type Subject, type InsertSubject, absences, type Absence, type InsertAbsence } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Class operations
  getAllClasses(): Promise<Class[]>;
  getClass(id: number): Promise<Class | undefined>;
  createClass(cls: InsertClass): Promise<Class>;
  
  // Student operations
  getAllStudents(): Promise<Student[]>;
  getStudentsByClass(classId: number): Promise<Student[]>;
  getStudent(id: number): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, student: InsertStudent): Promise<Student>;
  
  // Subject operations
  getAllSubjects(): Promise<Subject[]>;
  getSubject(id: number): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  
  // Absence operations
  getAllAbsences(): Promise<Absence[]>;
  getAbsencesByStudent(studentId: number): Promise<Absence[]>;
  getAbsencesByDate(date: string): Promise<Absence[]>;
  getAbsencesByClass(classId: number): Promise<Absence[]>;
  getAbsence(id: number): Promise<Absence | undefined>;
  createAbsence(absence: InsertAbsence): Promise<Absence>;
  updateAbsenceNotified(id: number, notified: boolean): Promise<Absence | undefined>;
  getRecentAbsences(limit: number): Promise<Absence[]>;
  
  // Stats operations
  getAbsencesCountToday(): Promise<number>;
  getAbsencesCountThisWeek(): Promise<number>;
  getNotificationsSentCount(): Promise<number>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private classes: Map<number, Class>;
  private students: Map<number, Student>;
  private subjects: Map<number, Subject>;
  private absences: Map<number, Absence>;
  
  sessionStore: session.SessionStore;
  
  private userCounter: number;
  private classCounter: number;
  private studentCounter: number;
  private subjectCounter: number;
  private absenceCounter: number;

  constructor() {
    this.users = new Map();
    this.classes = new Map();
    this.students = new Map();
    this.subjects = new Map();
    this.absences = new Map();
    
    this.userCounter = 1;
    this.classCounter = 1;
    this.studentCounter = 1;
    this.subjectCounter = 1;
    this.absenceCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Prune expired entries every 24h
    });
    
    // Initialize with default data
    this.initDefaultData();
  }

  private initDefaultData() {
    // Create default user
    this.createUser({
      username: "prof@ecole.fr",
      password: "$2b$10$9eL.flfd1TqrINacrwJceu4KBaKX53Wo8EcHdAa1xHlOYRJ3OVKRW", // mot de passe: password
      fullname: "Marc Pinel",
      role: "enseignant"
    });
    
    // Create classes
    const classes = [
      { name: "3ème A", level: "3ème" },
      { name: "3ème B", level: "3ème" },
      { name: "4ème A", level: "4ème" },
      { name: "4ème B", level: "4ème" },
      { name: "5ème C", level: "5ème" }
    ];
    
    const classIds: Record<string, number> = {};
    
    classes.forEach(cls => {
      const createdClass = this.createClass(cls);
      classIds[cls.name] = createdClass.id;
    });
    
    // Create subjects
    const subjects = [
      { name: "Mathématiques" },
      { name: "Français" },
      { name: "Histoire-Géographie" },
      { name: "Sciences" },
      { name: "Anglais" },
      { name: "Sport" },
      { name: "Arts plastiques" },
      { name: "Musique" }
    ];
    
    const subjectIds: Record<string, number> = {};
    
    subjects.forEach(subj => {
      const createdSubject = this.createSubject(subj);
      subjectIds[subj.name] = createdSubject.id;
    });
    
    // Create students
    const students = [
      { 
        firstname: "Lucas", 
        lastname: "Martin", 
        class_id: classIds["3ème A"],
        parent_name: "Martin Parents",
        parent_email: "martin.parents@email.com",
        parent_phone: "0612345678",
        status: "actif"
      },
      { 
        firstname: "Sarah", 
        lastname: "Dubois", 
        class_id: classIds["4ème B"],
        parent_name: "Dubois Parents",
        parent_email: "dubois.parents@email.com",
        parent_phone: "0623456789",
        status: "actif"
      },
      { 
        firstname: "Thomas", 
        lastname: "Leroy", 
        class_id: classIds["3ème A"],
        parent_name: "Leroy Parents",
        parent_email: "leroy.parents@email.com",
        parent_phone: "0634567890",
        status: "actif"
      },
      { 
        firstname: "Emma", 
        lastname: "Bernard", 
        class_id: classIds["5ème C"],
        parent_name: "Bernard Parents",
        parent_email: "bernard.parents@email.com",
        parent_phone: "0645678901",
        status: "actif"
      },
      { 
        firstname: "Louis", 
        lastname: "Petit", 
        class_id: classIds["4ème A"],
        parent_name: "Petit Parents",
        parent_email: "petit.parents@email.com",
        parent_phone: "0656789012",
        status: "actif"
      }
    ];
    
    const studentIds: Record<string, number> = {};
    
    students.forEach(student => {
      const createdStudent = this.createStudent(student);
      studentIds[`${student.firstname} ${student.lastname}`] = createdStudent.id;
    });
    
    // Create sample absences
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const absences = [
      {
        student_id: studentIds["Lucas Martin"],
        date: todayStr,
        start_time: "10:30:00",
        end_time: "12:00:00",
        subject_id: subjectIds["Mathématiques"],
        notified: true,
        created_by: 1
      },
      {
        student_id: studentIds["Sarah Dubois"],
        date: todayStr,
        start_time: "09:15:00",
        end_time: "10:45:00",
        subject_id: subjectIds["Français"],
        notified: true,
        created_by: 1
      },
      {
        student_id: studentIds["Thomas Leroy"],
        date: todayStr,
        start_time: "10:30:00",
        end_time: "12:00:00",
        subject_id: subjectIds["Mathématiques"],
        notified: true,
        created_by: 1
      },
      {
        student_id: studentIds["Emma Bernard"],
        date: yesterdayStr,
        start_time: "14:45:00",
        end_time: "16:15:00",
        subject_id: subjectIds["Histoire-Géographie"],
        notified: true,
        created_by: 1
      },
      {
        student_id: studentIds["Louis Petit"],
        date: yesterdayStr,
        start_time: "11:00:00",
        end_time: "12:30:00",
        subject_id: subjectIds["Sciences"],
        notified: true,
        created_by: 1
      }
    ];
    
    absences.forEach(absence => {
      this.createAbsence(absence as InsertAbsence);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userCounter++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
  
  // Class operations
  async getAllClasses(): Promise<Class[]> {
    return Array.from(this.classes.values());
  }
  
  async getClass(id: number): Promise<Class | undefined> {
    return this.classes.get(id);
  }
  
  async createClass(cls: InsertClass): Promise<Class> {
    const id = this.classCounter++;
    const newClass = { ...cls, id };
    this.classes.set(id, newClass);
    return newClass;
  }
  
  // Student operations
  async getAllStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }
  
  async getStudentsByClass(classId: number): Promise<Student[]> {
    return Array.from(this.students.values()).filter(
      student => student.class_id === classId
    );
  }
  
  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }
  
  async createStudent(student: InsertStudent): Promise<Student> {
    const id = this.studentCounter++;
    const newStudent = { ...student, id };
    this.students.set(id, newStudent);
    return newStudent;
  }
  
  async updateStudent(id: number, student: InsertStudent): Promise<Student> {
    const existingStudent = await this.getStudent(id);
    
    if (!existingStudent) {
      throw new Error(`Student with id ${id} not found`);
    }
    
    const updatedStudent = { ...student, id };
    this.students.set(id, updatedStudent);
    return updatedStudent;
  }
  
  // Subject operations
  async getAllSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }
  
  async getSubject(id: number): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }
  
  async createSubject(subject: InsertSubject): Promise<Subject> {
    const id = this.subjectCounter++;
    const newSubject = { ...subject, id };
    this.subjects.set(id, newSubject);
    return newSubject;
  }
  
  // Absence operations
  async getAllAbsences(): Promise<Absence[]> {
    return Array.from(this.absences.values());
  }
  
  async getAbsencesByStudent(studentId: number): Promise<Absence[]> {
    return Array.from(this.absences.values()).filter(
      absence => absence.student_id === studentId
    );
  }
  
  async getAbsencesByDate(date: string): Promise<Absence[]> {
    return Array.from(this.absences.values()).filter(
      absence => absence.date === date
    );
  }
  
  async getAbsencesByClass(classId: number): Promise<Absence[]> {
    const studentsInClass = await this.getStudentsByClass(classId);
    const studentIds = studentsInClass.map(student => student.id);
    
    return Array.from(this.absences.values()).filter(
      absence => studentIds.includes(absence.student_id)
    );
  }
  
  async getAbsence(id: number): Promise<Absence | undefined> {
    return this.absences.get(id);
  }
  
  async createAbsence(absence: InsertAbsence): Promise<Absence> {
    const id = this.absenceCounter++;
    const now = new Date();
    const newAbsence = { 
      ...absence, 
      id,
      created_at: now.toISOString(),
    };
    this.absences.set(id, newAbsence);
    return newAbsence;
  }
  
  async updateAbsenceNotified(id: number, notified: boolean): Promise<Absence | undefined> {
    const absence = await this.getAbsence(id);
    if (!absence) return undefined;
    
    const updatedAbsence = { ...absence, notified };
    this.absences.set(id, updatedAbsence);
    return updatedAbsence;
  }
  
  async getRecentAbsences(limit: number): Promise<Absence[]> {
    return Array.from(this.absences.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }
  
  // Stats operations
  async getAbsencesCountToday(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    return (await this.getAbsencesByDate(today)).length;
  }
  
  async getAbsencesCountThisWeek(): Promise<number> {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is sunday
    
    const weekStart = new Date(today);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    
    return Array.from(this.absences.values()).filter(absence => {
      const absenceDate = new Date(absence.date);
      return absenceDate >= weekStart && absenceDate < weekEnd;
    }).length;
  }
  
  async getNotificationsSentCount(): Promise<number> {
    return Array.from(this.absences.values()).filter(absence => absence.notified).length;
  }
}

export const storage = new MemStorage();
