import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { sendSms } from "./sms";
import { z } from "zod";
import { insertAbsenceSchema, insertClassSchema, insertStudentSchema, insertSubjectSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Classes API
  app.get("/api/classes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const classes = await storage.getAllClasses();
    res.json(classes);
  });

  app.post("/api/classes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertClassSchema.parse(req.body);
      const newClass = await storage.createClass(validatedData);
      res.status(201).json(newClass);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Subjects API
  app.get("/api/subjects", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const subjects = await storage.getAllSubjects();
    res.json(subjects);
  });

  app.post("/api/subjects", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertSubjectSchema.parse(req.body);
      const newSubject = await storage.createSubject(validatedData);
      res.status(201).json(newSubject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Students API
  app.get("/api/students", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      let students;
      const classId = req.query.class_id;
      
      if (classId && !isNaN(Number(classId))) {
        students = await storage.getStudentsByClass(Number(classId));
      } else {
        students = await storage.getAllStudents();
      }
      
      // Get class data for each student
      const classes = await storage.getAllClasses();
      const classMap = new Map(classes.map(c => [c.id, c]));
      
      // Get absence counts
      const studentsWithDetails = await Promise.all(
        students.map(async (student) => {
          const absences = await storage.getAbsencesByStudent(student.id);
          
          // Get relevant class
          const studentClass = classMap.get(student.class_id);
          
          return {
            ...student,
            class: {
              id: studentClass?.id || 0,
              name: studentClass?.name || "Inconnue"
            },
            absences_count: absences.length
          };
        })
      );
      
      res.json(studentsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/students/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const id = parseInt(req.params.id);
      const student = await storage.getStudent(id);
      
      if (!student) {
        return res.status(404).json({ message: "Élève non trouvé" });
      }
      
      const studentClass = await storage.getClass(student.class_id);
      const absences = await storage.getAbsencesByStudent(id);
      
      res.json({
        ...student,
        class: studentClass,
        absences_count: absences.length
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/students", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertStudentSchema.parse(req.body);
      
      // Verify that class exists
      const classExists = await storage.getClass(validatedData.class_id);
      if (!classExists) {
        return res.status(400).json({ message: "La classe spécifiée n'existe pas" });
      }
      
      const newStudent = await storage.createStudent(validatedData);
      res.status(201).json(newStudent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
  app.patch("/api/students/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const id = parseInt(req.params.id);
      const existingStudent = await storage.getStudent(id);
      
      if (!existingStudent) {
        return res.status(404).json({ message: "Élève non trouvé" });
      }
      
      const validatedData = insertStudentSchema.parse(req.body);
      
      // Verify that class exists
      const classExists = await storage.getClass(validatedData.class_id);
      if (!classExists) {
        return res.status(400).json({ message: "La classe spécifiée n'existe pas" });
      }
      
      // Update student (assuming storage has an updateStudent method)
      const updatedStudent = await storage.updateStudent(id, validatedData);
      
      const studentClass = await storage.getClass(updatedStudent.class_id);
      const absences = await storage.getAbsencesByStudent(id);
      
      res.json({
        ...updatedStudent,
        class: {
          id: studentClass?.id || 0,
          name: studentClass?.name || "Inconnue"
        },
        absences_count: absences.length
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Absences API
  app.get("/api/absences", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      let absences;
      const { student_id, class_id, date } = req.query;
      
      if (student_id && !isNaN(Number(student_id))) {
        absences = await storage.getAbsencesByStudent(Number(student_id));
      } else if (class_id && !isNaN(Number(class_id))) {
        absences = await storage.getAbsencesByClass(Number(class_id));
      } else if (date) {
        absences = await storage.getAbsencesByDate(date as string);
      } else {
        absences = await storage.getAllAbsences();
      }
      
      // Get additional data for each absence
      const students = await storage.getAllStudents();
      const classes = await storage.getAllClasses();
      const subjects = await storage.getAllSubjects();
      
      const studentMap = new Map(students.map(s => [s.id, s]));
      const classMap = new Map(classes.map(c => [c.id, c]));
      const subjectMap = new Map(subjects.map(s => [s.id, s]));
      
      const absencesWithDetails = absences.map(absence => {
        const student = studentMap.get(absence.student_id);
        const studentClass = student ? classMap.get(student.class_id) : undefined;
        const subject = subjectMap.get(absence.subject_id);
        
        return {
          ...absence,
          student: {
            id: student?.id || 0,
            firstname: student?.firstname || "",
            lastname: student?.lastname || ""
          },
          class: {
            id: studentClass?.id || 0,
            name: studentClass?.name || "Inconnue"
          },
          subject: {
            id: subject?.id || 0,
            name: subject?.name || "Inconnue"
          }
        };
      });
      
      res.json(absencesWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/absences/recent", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const recentAbsences = await storage.getRecentAbsences(limit);
      
      // Get additional data for each absence
      const students = await storage.getAllStudents();
      const classes = await storage.getAllClasses();
      const subjects = await storage.getAllSubjects();
      
      const studentMap = new Map(students.map(s => [s.id, s]));
      const classMap = new Map(classes.map(c => [c.id, c]));
      const subjectMap = new Map(subjects.map(s => [s.id, s]));
      
      const absencesWithDetails = recentAbsences.map(absence => {
        const student = studentMap.get(absence.student_id);
        const studentClass = student ? classMap.get(student.class_id) : undefined;
        const subject = subjectMap.get(absence.subject_id);
        
        return {
          ...absence,
          student: {
            id: student?.id || 0,
            firstname: student?.firstname || "",
            lastname: student?.lastname || ""
          },
          class: {
            id: studentClass?.id || 0,
            name: studentClass?.name || "Inconnue"
          },
          subject: {
            id: subject?.id || 0,
            name: subject?.name || "Inconnue"
          }
        };
      });
      
      res.json(absencesWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/absences", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { send_notification, ...absenceData } = req.body;
      const validatedData = insertAbsenceSchema.parse({
        ...absenceData,
        created_by: req.user?.id
      });
      
      // Verify that student exists
      const student = await storage.getStudent(validatedData.student_id);
      if (!student) {
        return res.status(400).json({ message: "L'élève spécifié n'existe pas" });
      }
      
      // Verify that subject exists
      const subject = await storage.getSubject(validatedData.subject_id);
      if (!subject) {
        return res.status(400).json({ message: "La matière spécifiée n'existe pas" });
      }
      
      // Create absence record
      const newAbsence = await storage.createAbsence(validatedData);
      
      // Send SMS notification if requested
      if (send_notification) {
        const studentClass = await storage.getClass(student.class_id);
        
        const smsSuccess = await sendSms({
          to: student.parent_phone,
          studentName: `${student.firstname} ${student.lastname}`,
          className: studentClass?.name || "",
          date: validatedData.date,
          startTime: validatedData.start_time,
          endTime: validatedData.end_time,
          subject: subject.name
        });
        
        if (smsSuccess) {
          await storage.updateAbsenceNotified(newAbsence.id, true);
          newAbsence.notified = true;
        }
      }
      
      // Get additional data for response
      const studentClass = await storage.getClass(student.class_id);
      
      res.status(201).json({
        ...newAbsence,
        student: {
          id: student.id,
          firstname: student.firstname,
          lastname: student.lastname
        },
        class: {
          id: studentClass?.id || 0,
          name: studentClass?.name || "Inconnue"
        },
        subject: {
          id: subject.id,
          name: subject.name
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Get absences for a specific student
  app.get("/api/students/:id/absences", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const id = parseInt(req.params.id);
      const student = await storage.getStudent(id);
      
      if (!student) {
        return res.status(404).json({ message: "Élève non trouvé" });
      }
      
      const absences = await storage.getAbsencesByStudent(id);
      
      // Get additional data for each absence
      const subjects = await storage.getAllSubjects();
      const classes = await storage.getAllClasses();
      const subjectMap = new Map(subjects.map(s => [s.id, s]));
      const studentClass = await storage.getClass(student.class_id);
      
      const absencesWithDetails = absences.map(absence => {
        const subject = subjectMap.get(absence.subject_id);
        
        return {
          ...absence,
          student: {
            id: student.id,
            firstname: student.firstname,
            lastname: student.lastname
          },
          class: {
            id: studentClass?.id || 0,
            name: studentClass?.name || "Inconnue"
          },
          subject: {
            id: subject?.id || 0,
            name: subject?.name || "Inconnue"
          }
        };
      });
      
      res.json(absencesWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
  // Dashboard stats API
  app.get("/api/stats/dashboard", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const todayCount = await storage.getAbsencesCountToday();
      const weekCount = await storage.getAbsencesCountThisWeek();
      const notificationsCount = await storage.getNotificationsSentCount();
      
      res.json({
        absences_today: todayCount,
        absences_week: weekCount,
        notifications_sent: notificationsCount
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
