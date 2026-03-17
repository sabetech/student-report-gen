import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'exam_report_subjects';

export const subjectService = {
    getAll: () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [
            { id: '1', name: 'Mathematics', code: 'MATH' },
            { id: '2', name: 'English Language', code: 'ENG' },
            { id: '3', name: 'Science', code: 'SCI' },
        ]; // Default subjects
    },

    create: (subject) => {
        const subjects = subjectService.getAll();
        const newSubject = { ...subject, id: uuidv4() };
        subjects.push(newSubject);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
        return newSubject;
    },

    update: (id, updates) => {
        const subjects = subjectService.getAll();
        const index = subjects.findIndex(s => s.id === id);
        if (index === -1) throw new Error('Subject not found');

        const updatedSubject = { ...subjects[index], ...updates };
        subjects[index] = updatedSubject;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
        return updatedSubject;
    },

    delete: (id) => {
        const subjects = subjectService.getAll();
        const newSubjects = subjects.filter(s => s.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSubjects));
    }
};
