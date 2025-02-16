import { redirect } from "next/navigation";


function page() {
  redirect('/home');
  return null;
}

export default page