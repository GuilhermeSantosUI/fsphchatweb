import { Button } from "@/views/components/ui/button";
import { useState } from "react";

export function Dashboard() {
  const [counter, setCounter] = useState(0);
  return (
    <div>
      <h1>Dashboard</h1>


      <Button onClick={() => setCounter(counter + 1)}>
        Clicked {counter} times
      </Button>

    </div>
  );
}
