import { ElevenLabsClient } from "elevenlabs";
const client =new ElevenLabsClient({
    apiKey:process.env.ELEVEN_LAB_API_KEY
})
export default async function getVoices(req, res) {

 const response=await client.voices.getAll();

 const voicesPersonal=response.voices.filter((v)=>v.category=="cloned")
 return res.status(200).json({voices:voicesPersonal})
    
}