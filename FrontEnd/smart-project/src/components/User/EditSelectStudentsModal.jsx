import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useClassStore from '@/store/classStore';
import { BASE_URL } from '@/utils/constants';
import Avatar from '@mui/material/Avatar';

function EditSelectStudentsModal({ isOpen, onClose, onSave, selectedStudents: initialSelectedStudents }) {
  function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }

  function stringAvatar(name) {
    const firstName = name.split(' ')[0];
    const lastName = name.split(' ')[1];
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`,
    };
  }

  const { currentClass, classMembers, fetchClassMembers } = useClassStore((state) => ({
    currentClass: state.currentClass,
    classMembers: state.classMembers,
    fetchClassMembers: state.fetchClassMembers,
  }));

  const [selectedStudents, setSelectedStudents] = useState(initialSelectedStudents);
  console.log("modal",selectedStudents)

  useEffect(() => {
    if (currentClass) {
      fetchClassMembers(currentClass.id);
    }
  }, [currentClass, fetchClassMembers]);

  useEffect(() => {
    setSelectedStudents(initialSelectedStudents);
  }, [initialSelectedStudents]);

  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === classMembers.students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(classMembers.students.map((student) => student.id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(selectedStudents);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#151A2C] text-white p-8 rounded-lg shadow-lg w-96">
        <DialogHeader>
          <DialogTitle className="text-2xl mb-6">Select Students</DialogTitle>
          <DialogDescription>Select students you want to assign.</DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <div className="flex items-center mb-4 space-x-4">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={selectedStudents.length === classMembers.students.length}
              onChange={handleSelectAll}
            />
            <label className="text-lg">Select All</label>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <ul className="space-y-4">
              {classMembers.students.map((student) => (
                <li key={student.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                    />
                    {student.user.profile_pic ? (
                      <>
                      {student.user.profile_pic_url &&(
                        <img
                        className="w-12 h-12 rounded-full object-cover"
                        src={student.user.profile_pic_url}
                        alt={student.user.name}
                      />
                      )}
                      </>
                    ) : (
                      <Avatar {...stringAvatar(student.user.name)} />
                    )}
                    <div>
                      <p className="text-lg font-medium">{student.user.name}</p>
                      <p className="text-gray-400">{student.user.email}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white"
              onClick={handleSubmit}
            >
              Assign
            </Button>
            <Button
              type="button"
              className="bg-red-500 hover:bg-red-700 text-white"
              onClick={onClose}
            >
              Cancel
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditSelectStudentsModal;
