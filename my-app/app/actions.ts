// send form straight to server
"use server";
import { createClient } from "@/lib/supabase/client";
import { v4 as uuid } from "uuid";

export async function register(prevState : any , formData: FormData) {
    try{
const firstname = formData.get("firstname");
  const lastname = formData.get("lastname");
  const email = formData.get("email");
  const tel = formData.get("tel");
  const attachments = formData.get("attachments") as File;
  const filename = uuid();
  const supabase = createClient();
  console.log(`Data -- ${[firstname ,lastname, email , tel, attachments]}`);

    const { error } =  await supabase.storage.from('attachments').upload(filename,attachments)
    const publicAttachmentUrl = supabase.storage.from('attachments').getPublicUrl(filename);
    if (error) {
        console.log("error" , error);
        return {message: "Upload Error!"};
    }
    console.log("Upload Successful" , publicAttachmentUrl);
    
    const { error:insertError } = await supabase
    .from("users")
    .insert([{ 
        firstname,
        lastname,
        email,
        tel,
        attachments:publicAttachmentUrl.data.publicUrl
     }])
     if (insertError) {
        console.log("Error Occur!!", error);
        return {message : "register Fail" };
     }
    
    return {success : true , message : "register successful"} ;
    
    }
  catch(error){
    return {message : "internal server error" , error}
  }

}
