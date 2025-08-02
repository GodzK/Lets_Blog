"use client"
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { register } from "./actions"

//set state ของ component
const initialState = {
  success : false ,
  message : null,
}
export default function Home() {
  const [state , formAction] = useActionState(register ,initialState)
  return (
    <main className="min-h-screen flex flex-col items-center">
      <form action={formAction}>
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>KMUTT Carpool</Link>
              <div className="flex items-center gap-2">
              </div>
            </div>

          </div>
        </nav>

          <main className="flex-1 flex flex-col gap-6 px-4">
            <div className="grid gap-2">
              <h1 className="d-flex text-center">Register Form</h1>
                <label htmlFor="firstname">firstname</label>
                <input
                  type="firstname"
                  name="firstname"
                  placeholder="FirstName"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="lastname">lastname</label>
                <input
                  type="lastname"
                  name="lastname"
                  placeholder="ex. LastName"
                  required
                />
              </div>
               <div className="grid gap-2">
                <label htmlFor="email">email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="ex. example@email.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="tel">Tel</label>
                <input
                  type="tel"
                  name="tel"
                  placeholder="Tel"
                  required
                />
              </div>
               <div className="grid gap-2">
                <label htmlFor="email">File</label>
                <input
                  type="file"
                  name="attachments"
                  placeholder="File"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" >
                Register
              </Button>

          </main>


      </div>
      {state.message && <div>Error : {state.message}</div>}
      {state.suceess &&  (
        <div className="bg-green-500 p-4">
          Register Successful !
        </div>
      )}
      </form>
    </main>
  );
}
