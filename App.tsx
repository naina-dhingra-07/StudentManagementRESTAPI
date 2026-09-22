import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  RotateCcw, 
  Code2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Student } from './types';

const SEED_STUDENTS: Student[] = [
  { id: 1, name: 'Ananya', course: 'BCA' },
  { id: 2, name: 'Kabir', course: 'BTech' },
  { id: 3, name: 'Meera', course: 'BSc' },
];

interface ApiFeedback {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  statusCode: number;
  statusText: string;
  message: string;
  timestamp: string;
}

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('min_students');
    return saved ? JSON.parse(saved) : SEED_STUDENTS;
  });

  // New student inputs
  const [name, setName] = useState('');
  const [course, setCourse] = useState('BCA');
  const [formError, setFormError] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editCourse, setEditCourse] = useState('');

  // API Status Feedback
  const [feedback, setFeedback] = useState<ApiFeedback | null>({
    method: 'GET',
    endpoint: '/students',
    statusCode: 200,
    statusText: 'OK',
    message: 'Loaded 3 student records from memory.',
    timestamp: new Date().toLocaleTimeString(),
  });

  // Toggle JSON view
  const [showJson, setShowJson] = useState(false);

  const saveStudents = (updated: Student[]) => {
    setStudents(updated);
    localStorage.setItem('min_students', JSON.stringify(updated));
  };

  // POST /students
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedCourse = course.trim();

    if (!trimmedName || !trimmedCourse) {
      setFormError('Name and course are required.');
      setFeedback({
        method: 'POST',
        endpoint: '/students',
        statusCode: 400,
        statusText: 'Bad Request',
        message: 'Validation error: Both name and course are required.',
        timestamp: new Date().toLocaleTimeString(),
      });
      return;
    }

    setFormError('');
    const newId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
    const newStudent: Student = { id: newId, name: trimmedName, course: trimmedCourse };
    const updated = [...students, newStudent];
    saveStudents(updated);

    setName('');
    setCourse('BCA');
    setFeedback({
      method: 'POST',
      endpoint: '/students',
      statusCode: 201,
      statusText: 'Created',
      message: `Created student #${newId} (${newStudent.name})`,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  // PUT /students/:id
  const startEdit = (student: Student) => {
    setEditingId(student.id);
    setEditName(student.name);
    setEditCourse(student.course);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditCourse('');
  };

  const handleSaveEdit = (id: number) => {
    const trimmedName = editName.trim();
    const trimmedCourse = editCourse.trim();

    if (!trimmedName || !trimmedCourse) {
      setFeedback({
        method: 'PUT',
        endpoint: `/students/${id}`,
        statusCode: 400,
        statusText: 'Bad Request',
        message: 'Name and course cannot be empty.',
        timestamp: new Date().toLocaleTimeString(),
      });
      return;
    }

    const updated = students.map((s) =>
      s.id === id ? { ...s, name: trimmedName, course: trimmedCourse } : s
    );
    saveStudents(updated);
    setEditingId(null);

    setFeedback({
      method: 'PUT',
      endpoint: `/students/${id}`,
      statusCode: 200,
      statusText: 'OK',
      message: `Updated student #${id}`,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  // DELETE /students/:id
  const handleDelete = (id: number) => {
    const target = students.find((s) => s.id === id);
    if (!target) {
      setFeedback({
        method: 'DELETE',
        endpoint: `/students/${id}`,
        statusCode: 404,
        statusText: 'Not Found',
        message: `Student #${id} not found.`,
        timestamp: new Date().toLocaleTimeString(),
      });
      return;
    }

    const updated = students.filter((s) => s.id !== id);
    saveStudents(updated);

    setFeedback({
      method: 'DELETE',
      endpoint: `/students/${id}`,
      statusCode: 200,
      statusText: 'OK',
      message: `Deleted student #${id} (${target.name})`,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  // Reset data to Rahul, Priya, Amit
  const handleReset = () => {
    saveStudents(SEED_STUDENTS);
    setFeedback({
      method: 'GET',
      endpoint: '/students',
      statusCode: 200,
      statusText: 'OK',
      message: 'Reset memory to seed data (Ananya, Kabir, Meera).',
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4 sm:px-6 flex justify-center items-start text-zinc-800">
      <div className="max-w-2xl w-full bg-white rounded-lg border border-red-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Simple Top Title Header */}
        <div className="flex items-center justify-between pb-4 border-b border-red-100">
          <div>
            <h1 className="text-xl font-bold text-red-700 tracking-tight flex items-center gap-2">
              Student Management
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                REST API
              </span>
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Simple in-browser CRUD demo
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowJson(!showJson)}
              className={`p-1.5 text-xs rounded border transition-colors flex items-center gap-1 ${
                showJson 
                  ? 'bg-red-700 text-white border-red-700' 
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-red-300 hover:text-red-700'
              }`}
              title="Toggle JSON View"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">JSON</span>
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 text-xs rounded border border-zinc-200 text-zinc-600 hover:text-red-700 hover:border-red-300 transition-colors flex items-center gap-1"
              title="Reset to default seed data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Real-time API Feedback Pill */}
        {feedback && (
          <div className="flex items-center justify-between text-xs font-mono bg-red-50/70 border border-red-200 rounded px-3 py-2 text-zinc-700">
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-700">
                {feedback.method} {feedback.endpoint}
              </span>
              <span className="text-zinc-400">➔</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  feedback.statusCode >= 200 && feedback.statusCode < 300
                    ? 'bg-red-700 text-white'
                    : 'bg-red-200 text-red-900'
                }`}
              >
                {feedback.statusCode} {feedback.statusText}
              </span>
              <span className="text-zinc-500 hidden md:inline text-[11px] font-sans">
                {feedback.message}
              </span>
            </div>
            <span className="text-[10px] text-zinc-400">{feedback.timestamp}</span>
          </div>
        )}

        {/* Add Student Inline Form (POST /students) */}
        <form onSubmit={handleAddStudent} className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Student Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (formError) setFormError('');
              }}
              className="flex-1 px-3 py-2 text-xs border border-zinc-300 rounded focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
            />

            <input
              type="text"
              placeholder="Course (e.g. BCA, BTech)"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full sm:w-36 px-3 py-2 text-xs border border-zinc-300 rounded focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
            />

            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add (POST)</span>
            </button>
          </div>

          {formError && (
            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {formError}
            </p>
          )}
        </form>

        {/* Clean Student Table (GET, PUT, DELETE) */}
        <div className="border border-red-200 rounded overflow-hidden">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-red-700 text-white font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">ID</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Course</th>
                <th className="py-2.5 px-3 w-28 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-zinc-400 text-xs">
                    No students in memory. Use the form above to add a student.
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const isEditing = editingId === student.id;

                  return (
                    <tr key={student.id} className="hover:bg-red-50/40 transition-colors">
                      {/* ID */}
                      <td className="py-2.5 px-3 font-mono font-bold text-center text-red-800">
                        {student.id}
                      </td>

                      {/* Name */}
                      <td className="py-2.5 px-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-red-300 rounded focus:outline-none focus:border-red-600 bg-white"
                            autoFocus
                          />
                        ) : (
                          <span className="font-semibold text-zinc-800">
                            {student.name}
                          </span>
                        )}
                      </td>

                      {/* Course */}
                      <td className="py-2.5 px-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editCourse}
                            onChange={(e) => setEditCourse(e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-red-300 rounded focus:outline-none focus:border-red-600 bg-white"
                          />
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-800 border border-red-200">
                            {student.course}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleSaveEdit(student.id)}
                              className="p-1 bg-red-600 hover:bg-red-700 text-white rounded"
                              title="Save (PUT)"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 rounded"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => startEdit(student)}
                              className="p-1 text-zinc-500 hover:text-red-700 hover:bg-red-50 rounded"
                              title="Edit (PUT /students/:id)"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(student.id)}
                              className="p-1 text-zinc-500 hover:text-red-700 hover:bg-red-50 rounded"
                              title="Delete (DELETE /students/:id)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Collapsible JSON Preview (students.json) */}
        {showJson && (
          <div className="bg-zinc-900 text-zinc-100 p-3 rounded font-mono text-xs overflow-x-auto border border-zinc-800">
            <div className="text-[11px] text-zinc-400 mb-1 flex items-center justify-between border-b border-zinc-800 pb-1">
              <span>// data/students.json (In Memory)</span>
              <span>{students.length} records</span>
            </div>
            <pre className="text-red-300 leading-relaxed">
              {JSON.stringify(students, null, 2)}
            </pre>
          </div>
        )}


      </div>
    </div>
  );
}
