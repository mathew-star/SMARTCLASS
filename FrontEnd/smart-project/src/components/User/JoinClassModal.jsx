import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

function JoinClassModal({ isOpen, onClose, onSave }) {
  const [code, setCode] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();
    onSave( code );
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#151A2C] text-white p-8 rounded-lg shadow-lg w-96">
        <DialogHeader>
          <DialogTitle className="text-2xl mb-6">Join Classroom</DialogTitle>
          <DialogDescription>
            Join a new classroom.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block  text-gray-200 text-sm font-bold mb-2" htmlFor="title">
                Code
              </label>
              <input
                id="code"
                type="text"
                placeholder="Classroom code"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            
            <DialogFooter>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white">
                Join
              </Button>

            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default JoinClassModal;
