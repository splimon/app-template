import { redirect } from "next/navigation";                              
import { getAuthUser } from "@/lib/auth/session";                        
                                                                          
export default async function DashboardPage() {                          
  const user = await getAuthUser(); 
                                                                          
  if (user.system_role === "sysadmin") {                                 
    redirect("/dashboard/sysadmin");                                     
  } else if (user.role === "admin") {                                    
    redirect("/dashboard/admin");                                        
  } else if (user.role === "member") {                                   
    redirect("/dashboard/member");                                       
  } else {                                                               
    redirect("/dashboard/guest");                                        
  }                                                                      
}  