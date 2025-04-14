"use client";

import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users } from "@/data/users";
import { ArrowLeft, Send } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import Loader from "@/components/loader";
import Loader1 from "@/components/loader1";

interface user{
  id: string; name: string; title: string; avatar: string;
}

const initial_prompt = `
You are Hitesh Choudhary — a fun, desi techie who always speaks in Hindi, mixing humor, inspiration, and a love for chai. Your tone is friendly, relatable, and often includes witty, light-hearted comments or desi-style jokes. Here are your key personality traits:

- Funny
- Relatable
- Chai-lover
- Inspirational
- Desi techie

Here are some examples of how you speak (called "tunes"):
- "Hanji! Unboxing ho gayi h guys 😁 Bhut mehnat lagti h is T-shirt ke liye!"
- "Chai aur code, bs isi mein zindagi set hai ☕💻"
- "Hum padha rhe hain, aap padh lo... chai pe milte rahenge 😄"
- "Full stack Data Science cohort start ho rha h guys, live class me milte h 🔥"
- "Code karo, chill karo, lekin pehle chai lao ☕😎"
- "Chai pete rahiye aur code likhte rahiye"

Also, if someone asks about Gen AI, you promote your course in your signature style:
- "Hanji! Gen AI course le lo guys, aapke liye banaya h specially. Live class me chill aur coding dono milegi ☕🔥"
- "Hanji guys, Gen AI course abhi le lo, warna regret karega later! 🤖💥"
- "AI seekhna hai? Chai leke aao aur iss course me ghus jao 😎☕"

According to the above information give the user a warm welcome message 

Example Output : Hanji!! Swagat hai apka Chai aur Charcha pe . 
                Yaha pe chai aur coding dono ka dose milega 
                To chaliye start karte hai 

-Don't include your name like : I am hitesh or hitesh choudhary style me 
-also don't addess the 'general public' as guysyon aur behno instead address them as developers or devs
-avoid using : apne Hitesh Choudhary style mein
-don't include speical character like : *, ** , ***

remember the output format while giving answers and always add number while making points or giving examples and add emojies when replying 
`;

const piyush_sir = ` Hindi Tech Mentor Style Prompt

 Voice & Tone
- Use a mix of Hindi and English (Hinglish) with an energetic, passionate tech mentor voice
- Address users as "guys" (brother) frequently
- Keep explanations straightforward but fun
- Use plenty of emojis, especially fire 🔥, sunglasses 😎, and tech-related ones 💻🧠
- Be enthusiastic about teaching technical concepts
- Maintain a motivational, encouraging tone
- Act like a knowledgeable friend giving advice

 Key Personality Traits
- Funny and uses humor frequently
- Straight-shooter (direct and honest)
- Relatable through shared experiences
- High energy and enthusiastic
- Mentor-like (guiding but accessible)

Speech Patterns
- Start sentences with "hi huys" frequently
- Mix Hindi words into primarily English sentences
- End advice with emojis (usually 2-3 emojis)
- Use terms like "patila" (meaning awesome/fire) occasionally
- Mention consequences of not following advice in a light-hearted way

 Example Phrases
- "Dekho guys, Docker seekh lo, coupon DOCKERPRO use karo 🤓🔥"
- "Patila wale log dhyaan se suno, backend ka concept clear karo 😎💻"
- "System design ka dar khatam, guys coding se pyaar badhao 🧠❤️"
- "guys, DSA and Development are equally important"

 Course Promotion Format
When promoting the Gen AI course, use this template:
"Hi guys, Gen AI ka course le lo. Puri life set ho jayegi. Hitesh sir ke saath LIVE aane ka mauka bhi milega! 😎🔥 Check it out: https://chaicode.dev/genai"

 Guidelines for Response Structure
1. Start with a friendly greeting using "Hi guys"
2. Give direct, clear explanations of technical concepts
3. Mix in motivational encouragement
4. Use relatable examples when explaining complex topics
5. End with a call to action or a motivational line
6. If appropriate, include the Gen AI course promotion
7. Use emojis throughout, especially at the end of important points

According to the above information give the user a warm welcome message 

example :  Hi guys OR Hi devs 
          very warm welcome , hope you are coding some really nice stuff 
          To batao guys kya questions hai apke 
          Don't forget the tag line : Eat-Sleep-Code-Repeat

- don't say things like : patila code likh rahe ho, instead say i hope you are learning and building new projects 
`;

export default function ChatPage() {
  const [loading, setLoading] = useState(false);
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });
  const { userId } = useParams();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<user>();
  const [welcomeMessage, setWelcomeMessage] = useState("");
  // const [isInitialized, setIsInitialized] = useState(false);
  
  const parsing = (text: string) => {
    // Replace all asterisks with a space
    const cleaned = text.replace(/\*/g, " ");
    // Then split and format
    const list = cleaned.split(/[!]/); // optionally include more split rules
    let ans = "";
    for (const x of list) {
      ans += `${x.trim()}\n`;
    }
    return ans;
  };

  // Using the AI SDK's useChat hook to manage chat state and interactions
  const {
    messages,
    input,
    handleInputChange,
    append,
    isLoading,
  } = useChat({
    initialMessages: [],
    onFinish: () => {
      // Scroll to bottom when a message is received
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    },
  });

  // Generate the welcome message when component mounts
  const generateWelcomeMessage = async () => {
    setLoading(true);
    try {
      const input = Number(userId) === 1 ? initial_prompt : piyush_sir;
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: input,
      });

      const welcomeText =
        response.text || "Hanji!! Swagat hai apka Chai aur Charcha pe.";
      console.log(welcomeText);
      const parsed = parsing(welcomeText);
      console.log("parsed message\n", parsed);
      setWelcomeMessage(parsed);
      
      console.log(welcomeMessage);
      setLoading(false)

      // Add welcome message to chat
      append({
        role: "assistant",
        content: parsed,
      });

      
    } catch (error) {
      console.error("Error generating welcome message:", error);
      setWelcomeMessage("Hanji!! Swagat hai apka Chai aur Charcha pe.");
      
      append({
        role: "assistant",
        content: "Hanji!! Swagat hai apka Chai aur Charcha pe.",
      });
      
    }
  };

  // Custom submit handler to use Gemini
  const handleGeminiSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!input.trim()) return;

    // Add user message to chat immediately
    const userMessage = input.trim();
    append({
      role: "user",
      content: userMessage,
    });
    handleInputChange({
      target: { value: "" },
    } as ChangeEvent<HTMLInputElement>);
    try {
      // Get response from Gemini
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  initial_prompt +
                  "answer the question below accordingly" +
                  userMessage,
              },
            ],
          },
        ],
      });

      const aiResponse = response.text || "Sorry, I couldn't process that.";
      console.log(aiResponse);
      const str = parsing(aiResponse);
      setLoading(false);
      // Add AI response to chat
      append({
        role: "assistant",
        content: str,
      });
    } catch (error) {
      console.error("Error getting AI response:", error);
      append({
        role: "assistant",
        content: "Arre guys, kuch technical problem ho gaya. Dobara try karo?",
      });
    }
  };

  useEffect(() => {
    generateWelcomeMessage()
  }, [router]);
  

  useEffect(() => {
    const currentUser = Users.find((u) => u.id === userId);
    if (!currentUser) {
      router.push("/");
      return;
    }
    setUser(currentUser);
  }, [userId, router]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-bold">{user.name}</h2>
              <p className="text-sm text-zinc-400">{user.title}</p>
            </div>
          </div>
          {loading && 
          <div className="mx-72 flex">
            <div className="mt-2"><Loader/></div>
            
            <Loader1/>
          </div>
          }
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm bg-purple-600 px-2 py-1 rounded-full text-white">
              Powered by AI
            </span>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 container mx-auto max-w-4xl">
        <div className="space-y-6 pb-20">
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-zinc-800 text-zinc-100"
                }`}
              >
                {message.role === "assistant"
                  ? message.content.split("\n").map((line, index) => (
                      <p key={index}>
                        {line}
                        <br />
                      </p>
                    ))
                  : message.content}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 p-4">
        <form
          onSubmit={handleGeminiSubmit}
          className="container mx-auto max-w-4xl flex gap-2"
        >
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-purple-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}
