"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState(["Complete the project", "Learn shadcn UI", "Deploy to GitHub"]);
  const [newTask, setNewTask] = useState("");

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, newTask]);
      setNewTask("");
    }
  };

  const deleteTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const clearAll = () => {
    setTasks([]);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Task Manager</CardTitle>
          <CardDescription>Manage your daily tasks efficiently.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={addTask} className="space-y-4">
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <Input 
                    placeholder="Add a new task..." 
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                  />
                </div>
                <Button type="submit" className="col-span-1">Add</Button>
              </div>
            </div>
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <div className="text-center p-4 text-slate-500">
                  No tasks yet. Add one above!
                </div>
              ) : (
                tasks.map((task, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <span>{task}</span>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteTask(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-slate-500">{tasks.length} task{tasks.length !== 1 ? 's' : ''} remaining</p>
          <Button variant="outline" onClick={clearAll}>Clear All</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
